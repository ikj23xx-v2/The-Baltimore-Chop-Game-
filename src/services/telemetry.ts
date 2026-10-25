// Operations Telemetry & Error Logging Service

export interface CrashReport {
  id: string;
  timestamp: number;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  deviceInfo: string;
  source: string;
  stack?: string;
  resolved: boolean;
}

export interface UserSessionData {
  id: string;
  username: string;
  joinedAt: string;
  device: string;
  browser: string;
  gamesPlayed: number;
  winRate: string;
  franchisePoints: number;
  vendingTokens: number;
  status: 'ACTIVE' | 'IDLE';
}

class TelemetryService {
  private crashReports: CrashReport[] = [
    {
      id: 'CR-1049',
      timestamp: Date.now() - 1000 * 60 * 14,
      message: 'DeviceOrientationEvent.requestPermission requires user activation gesture on iOS 17.4 Safari',
      severity: 'WARNING',
      deviceInfo: 'iPhone 15 Pro · Mobile Safari 17.4',
      source: 'Card3D.tsx:orientationListener',
      resolved: true
    },
    {
      id: 'CR-1050',
      timestamp: Date.now() - 1000 * 60 * 42,
      message: 'AudioContext autoplay policy suspended until first user pointerdown',
      severity: 'INFO',
      deviceInfo: 'Chrome Mobile 123 · Android 14',
      source: 'audio.ts:getContext',
      resolved: true
    }
  ];

  private users: UserSessionData[] = [
    {
      id: 'USR-8821',
      username: 'CamdenCrusher_8',
      joinedAt: '2026-10-21',
      device: 'iPhone 15 Pro',
      browser: 'Mobile Safari',
      gamesPlayed: 34,
      winRate: '68.2%',
      franchisePoints: 3450,
      vendingTokens: 5,
      status: 'ACTIVE'
    },
    {
      id: 'USR-9042',
      username: 'IronManLegend',
      joinedAt: '2026-10-22',
      device: 'Samsung Galaxy S24',
      browser: 'Chrome Mobile',
      gamesPlayed: 19,
      winRate: '57.8%',
      franchisePoints: 1800,
      vendingTokens: 2,
      status: 'IDLE'
    },
    {
      id: 'USR-9120',
      username: 'BMore_ChopMaster',
      joinedAt: '2026-10-24',
      device: 'MacBook Pro',
      browser: 'Chrome 124',
      gamesPlayed: 48,
      winRate: '75.0%',
      franchisePoints: 8900,
      vendingTokens: 12,
      status: 'ACTIVE'
    }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      // Global error listener
      window.addEventListener('error', (event) => {
        this.logCrash({
          id: `CR-${Date.now().toString().slice(-4)}`,
          timestamp: Date.now(),
          message: event.message || 'Unknown window runtime error',
          severity: 'CRITICAL',
          deviceInfo: this.getDeviceString(),
          source: `${event.filename || 'bundle'}:${event.lineno || 0}`,
          stack: event.error?.stack,
          resolved: false
        });
      });

      // Unhandled rejection listener
      window.addEventListener('unhandledrejection', (event) => {
        this.logCrash({
          id: `CR-${Date.now().toString().slice(-4)}`,
          timestamp: Date.now(),
          message: event.reason?.message || String(event.reason),
          severity: 'WARNING',
          deviceInfo: this.getDeviceString(),
          source: 'Promise.UnhandledRejection',
          stack: event.reason?.stack,
          resolved: false
        });
      });
    }
  }

  public getDeviceString(): string {
    if (typeof navigator === 'undefined') return 'Server Runtime';
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return 'Apple iOS Device · Safari';
    if (/Android/.test(ua)) return 'Android Device · Chrome Mobile';
    if (/Macintosh/.test(ua)) return 'macOS Desktop · WebKit/Blink';
    if (/Windows/.test(ua)) return 'Windows PC · Edge/Chrome';
    return 'Web Client';
  }

  public logCrash(report: CrashReport) {
    this.crashReports = [report, ...this.crashReports.slice(0, 50)];
  }

  public getCrashReports(): CrashReport[] {
    return this.crashReports;
  }

  public resolveCrash(id: string) {
    this.crashReports = this.crashReports.map((c) => (c.id === id ? { ...c, resolved: true } : c));
  }

  public clearCrashes() {
    this.crashReports = [];
  }

  public getUsers(): UserSessionData[] {
    return this.users;
  }
}

export const telemetry = new TelemetryService();
