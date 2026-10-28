// src/services/guestPlayLimitService.ts
/**
 * Direct Guest Play Limits Engine:
 * - 1 hour per day limit (3,600 seconds)
 * - 5 hours total lifetime limit per IP/device (18,000 seconds)
 * Forces Sign Up or Log In once either threshold is crossed.
 */

export const DAILY_GUEST_LIMIT_SECONDS = 3600; // 1 hour per day
export const TOTAL_GUEST_LIMIT_SECONDS = 18000; // 5 hours total per IP

export interface GuestLimitStatus {
  canPlay: boolean;
  isDailyExceeded: boolean;
  isTotalExceeded: boolean;
  remainingDailySeconds: number;
  remainingTotalSeconds: number;
  todaySecondsPlayed: number;
  totalSecondsPlayed: number;
  reason?: 'DAILY_LIMIT' | 'TOTAL_LIMIT';
}

interface StoredGuestRecord {
  ip: string;
  totalSeconds: number;
  dailyUsage: { [dateStr: string]: number }; // 'YYYY-MM-DD': seconds
  lastActive: number;
}

const STORAGE_KEY_PREFIX = 'chop_guest_play_limit_';
const DEVICE_ID_KEY = 'chop_guest_device_fingerprint';

class GuestPlayLimitService {
  private clientIp: string = 'device_local';
  private trackingInterval: any = null;
  private listeners: ((status: GuestLimitStatus) => void)[] = [];
  private limitReachedCallbacks: ((reason: 'DAILY_LIMIT' | 'TOTAL_LIMIT') => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.initClientIdentifier();
  }

  private getTodayDateKey(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getOrCreateDeviceFingerprint(): string {
    try {
      let fp = localStorage.getItem(DEVICE_ID_KEY);
      if (!fp) {
        fp = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem(DEVICE_ID_KEY, fp);
      }
      return fp;
    } catch {
      return 'dev_fallback';
    }
  }

  public async initClientIdentifier(): Promise<void> {
    if (this.isInitialized) return;

    // Default to device fingerprint
    const fallbackId = this.getOrCreateDeviceFingerprint();
    this.clientIp = fallbackId;

    // Attempt to fetch public IP in background
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.ip) {
          const cleanIp = String(data.ip).replace(/[^a-zA-Z0-9_.-]/g, '');
          if (cleanIp) {
            // Migrate any device usage to IP if IP record doesn't exist yet
            this.migrateDeviceUsageToIp(fallbackId, cleanIp);
            this.clientIp = cleanIp;
          }
        }
      }
    } catch {
      // Continue with device fingerprint gracefully
    } finally {
      this.isInitialized = true;
      this.notifyListeners();
    }
  }

  private getStorageKey(): string {
    return `${STORAGE_KEY_PREFIX}${this.clientIp}`;
  }

  private loadRecord(): StoredGuestRecord {
    const key = this.getStorageKey();
    const today = this.getTodayDateKey();

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ip: this.clientIp,
          totalSeconds: Number(parsed.totalSeconds) || 0,
          dailyUsage: parsed.dailyUsage || {},
          lastActive: Number(parsed.lastActive) || Date.now(),
        };
      }
    } catch {
      // ignore
    }

    return {
      ip: this.clientIp,
      totalSeconds: 0,
      dailyUsage: { [today]: 0 },
      lastActive: Date.now(),
    };
  }

  private saveRecord(record: StoredGuestRecord): void {
    const key = this.getStorageKey();
    try {
      localStorage.setItem(key, JSON.stringify(record));
    } catch {
      // ignore
    }
  }

  private migrateDeviceUsageToIp(deviceFp: string, newIp: string) {
    try {
      const devKey = `${STORAGE_KEY_PREFIX}${deviceFp}`;
      const ipKey = `${STORAGE_KEY_PREFIX}${newIp}`;

      const devRaw = localStorage.getItem(devKey);
      const ipRaw = localStorage.getItem(ipKey);

      if (devRaw && !ipRaw) {
        localStorage.setItem(ipKey, devRaw);
      } else if (devRaw && ipRaw) {
        // Merge records taking the highest usage
        const devRec: StoredGuestRecord = JSON.parse(devRaw);
        const ipRec: StoredGuestRecord = JSON.parse(ipRaw);

        const mergedTotal = Math.max(devRec.totalSeconds || 0, ipRec.totalSeconds || 0);
        const mergedDaily = { ...(ipRec.dailyUsage || {}) };

        Object.keys(devRec.dailyUsage || {}).forEach((d) => {
          mergedDaily[d] = Math.max(mergedDaily[d] || 0, devRec.dailyUsage[d] || 0);
        });

        localStorage.setItem(
          ipKey,
          JSON.stringify({
            ip: newIp,
            totalSeconds: mergedTotal,
            dailyUsage: mergedDaily,
            lastActive: Date.now(),
          })
        );
      }
    } catch {
      // ignore
    }
  }

  public getLimitStatus(): GuestLimitStatus {
    const record = this.loadRecord();
    const today = this.getTodayDateKey();
    const todaySeconds = record.dailyUsage[today] || 0;
    const totalSeconds = record.totalSeconds || 0;

    const remainingDailySeconds = Math.max(0, DAILY_GUEST_LIMIT_SECONDS - todaySeconds);
    const remainingTotalSeconds = Math.max(0, TOTAL_GUEST_LIMIT_SECONDS - totalSeconds);

    const isTotalExceeded = remainingTotalSeconds <= 0;
    const isDailyExceeded = remainingDailySeconds <= 0;
    const canPlay = !isTotalExceeded && !isDailyExceeded;

    let reason: 'DAILY_LIMIT' | 'TOTAL_LIMIT' | undefined;
    if (isTotalExceeded) {
      reason = 'TOTAL_LIMIT';
    } else if (isDailyExceeded) {
      reason = 'DAILY_LIMIT';
    }

    return {
      canPlay,
      isDailyExceeded,
      isTotalExceeded,
      remainingDailySeconds,
      remainingTotalSeconds,
      todaySecondsPlayed: todaySeconds,
      totalSecondsPlayed: totalSeconds,
      reason,
    };
  }

  public recordPlaytime(secondsToAdd: number): GuestLimitStatus {
    const record = this.loadRecord();
    const today = this.getTodayDateKey();

    const currentToday = record.dailyUsage[today] || 0;
    const newToday = currentToday + secondsToAdd;
    const newTotal = (record.totalSeconds || 0) + secondsToAdd;

    record.dailyUsage[today] = newToday;
    record.totalSeconds = newTotal;
    record.lastActive = Date.now();

    this.saveRecord(record);

    const status = this.getLimitStatus();
    this.notifyListeners();

    if (!status.canPlay && status.reason) {
      this.limitReachedCallbacks.forEach((cb) => cb(status.reason!));
    }

    return status;
  }

  public startLiveTracking(onLimitReached: (reason: 'DAILY_LIMIT' | 'TOTAL_LIMIT') => void): () => void {
    this.stopLiveTracking();

    const checkAndIncrement = () => {
      // Only increment if document is visible / window in focus
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }

      // Add 5 seconds of active playtime
      const status = this.recordPlaytime(5);
      if (!status.canPlay) {
        this.stopLiveTracking();
        onLimitReached(status.reason || 'DAILY_LIMIT');
      }
    };

    // Every 5 seconds tick
    this.trackingInterval = setInterval(checkAndIncrement, 5000);

    return () => {
      this.stopLiveTracking();
    };
  }

  public stopLiveTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  public subscribe(fn: (status: GuestLimitStatus) => void): () => void {
    this.listeners.push(fn);
    fn(this.getLimitStatus());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners(): void {
    const status = this.getLimitStatus();
    this.listeners.forEach((fn) => fn(status));
  }

  public formatRemainingTime(seconds: number): string {
    if (seconds <= 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

export const guestPlayLimitService = new GuestPlayLimitService();
