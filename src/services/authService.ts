import {
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from './firebase';

export interface UsernameHistoryEntry {
  username: string;
  changedAt: number; // timestamp ms
}

export interface UserAccountProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string;
  photoURL: string | null;
  isAnonymous: boolean;
  linkedProviders: string[]; // e.g. ['google.com', 'apple.com']
  createdAt: number;
  lastUsernameChangeAt: number | null;
  usernameHistory: UsernameHistoryEntry[];
}

export interface UsernameRateLimitCheck {
  canChange: boolean;
  reason?: string;
  daysUntilNextMonthlyChange: number;
  changesThisYear: number;
  yearlyChangesRemaining: number;
  isMonthlyCooldownActive: boolean;
  isYearlyLimitExceeded: boolean;
  requiresPaidTier: boolean;
}

const LOCAL_PROFILE_KEY = 'baltimore_chop_local_user_v1';
const MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const YEAR_MS = 365 * 24 * 60 * 60 * 1000; // 365 days
const MAX_YEARLY_CHANGES = 5;

// Generate a default authentic Baltimore baseball handle
export const generateDefaultUsername = (uidSuffix: string): string => {
  const prefixes = ['ChopMaster', 'CamdenClutch', 'BirdlandAce', 'IronMan', 'Slugger', 'BMoreRefractor', 'FoilRipper'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = uidSuffix.slice(-4).replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000);
  return `${p}_${num}`;
};

// Compute rate limiting status for username modifications
export const checkUsernameChangeEligibility = (profile: UserAccountProfile): UsernameRateLimitCheck => {
  const now = Date.now();
  const history = profile.usernameHistory || [];

  // 1. Changes in the last 365 days
  const changesLastYear = history.filter((entry) => now - entry.changedAt < YEAR_MS);
  const changesThisYearCount = changesLastYear.length;
  const isYearlyLimitExceeded = changesThisYearCount >= MAX_YEARLY_CHANGES;
  const yearlyChangesRemaining = Math.max(0, MAX_YEARLY_CHANGES - changesThisYearCount);

  // 2. Cooldown since last change (30 days)
  let isMonthlyCooldownActive = false;
  let daysUntilNextMonthlyChange = 0;

  if (profile.lastUsernameChangeAt) {
    const elapsedSinceLast = now - profile.lastUsernameChangeAt;
    if (elapsedSinceLast < MONTH_MS) {
      isMonthlyCooldownActive = true;
      daysUntilNextMonthlyChange = Math.ceil((MONTH_MS - elapsedSinceLast) / (24 * 60 * 60 * 1000));
    }
  }

  const canChange = !isMonthlyCooldownActive && !isYearlyLimitExceeded;
  const requiresPaidTier = isMonthlyCooldownActive || isYearlyLimitExceeded;

  let reason = '';
  if (isYearlyLimitExceeded) {
    reason = `You have reached the maximum of ${MAX_YEARLY_CHANGES} username changes for this year. Additional changes require a Paid Name Change Pass.`;
  } else if (isMonthlyCooldownActive) {
    reason = `Usernames can only be changed once every 30 days. Next free change unlocks in ${daysUntilNextMonthlyChange} day(s). Earlier changes require a Paid Name Change Pass.`;
  }

  return {
    canChange,
    reason,
    daysUntilNextMonthlyChange,
    changesThisYear: changesThisYearCount,
    yearlyChangesRemaining,
    isMonthlyCooldownActive,
    isYearlyLimitExceeded,
    requiresPaidTier
  };
};

class AuthService {
  private currentUserProfile: UserAccountProfile | null = null;
  private listeners: ((profile: UserAccountProfile | null) => void)[] = [];

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.syncUserProfile(user);
      } else {
        // Automatically start an anonymous guest session if no user is signed in
        try {
          const res = await signInAnonymously(auth);
          await this.syncUserProfile(res.user);
        } catch (err) {
          console.warn('Anonymous auth initialization deferred:', err);
          this.loadLocalFallbackProfile();
        }
      }
    });
  }

  // Sync or create user profile in Firestore
  public async syncUserProfile(user: User): Promise<UserAccountProfile> {
    const userDocRef = doc(db, 'users', user.uid);
    const linkedProviders = user.providerData.map((p) => p.providerId);

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const profile: UserAccountProfile = {
          uid: user.uid,
          email: user.email || data.email || null,
          displayName: user.displayName || data.displayName || null,
          username: data.username || generateDefaultUsername(user.uid),
          photoURL: user.photoURL || data.photoURL || null,
          isAnonymous: user.isAnonymous,
          linkedProviders,
          createdAt: data.createdAt || Date.now(),
          lastUsernameChangeAt: data.lastUsernameChangeAt || null,
          usernameHistory: data.usernameHistory || []
        };
        this.setProfile(profile);
        return profile;
      } else {
        // First-time user profile initialization
        const initialUsername = generateDefaultUsername(user.uid);
        const newProfile: UserAccountProfile = {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          username: initialUsername,
          photoURL: user.photoURL || null,
          isAnonymous: user.isAnonymous,
          linkedProviders,
          createdAt: Date.now(),
          lastUsernameChangeAt: null,
          usernameHistory: []
        };

        await setDoc(userDocRef, newProfile);
        // Reserve username index
        await setDoc(doc(db, 'usernames', initialUsername.toLowerCase()), {
          username: initialUsername.toLowerCase(),
          userId: user.uid,
          claimedAt: new Date().toISOString()
        });

        this.setProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn('Firestore user sync fallback to local storage:', err);
      return this.loadLocalFallbackProfile(user);
    }
  }

  // Local storage fallback when offline
  private loadLocalFallbackProfile(user?: User): UserAccountProfile {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        this.setProfile(p);
        return p;
      }
    } catch {
      // ignore
    }

    const uid = user ? user.uid : `guest-${Date.now()}`;
    const fallback: UserAccountProfile = {
      uid,
      email: user?.email || null,
      displayName: user?.displayName || 'Baltimore Slugger',
      username: generateDefaultUsername(uid),
      photoURL: user?.photoURL || null,
      isAnonymous: true,
      linkedProviders: [],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    this.setProfile(fallback);
    return fallback;
  }

  public setProfile(p: UserAccountProfile) {
    this.currentUserProfile = p;
    try {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
    this.listeners.forEach((fn) => fn(p));
  }

  public saveProfile(p: UserAccountProfile) {
    this.setProfile(p);
  }

  public subscribe(fn: (profile: UserAccountProfile | null) => void): () => void {
    this.listeners.push(fn);
    fn(this.currentUserProfile);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public getProfile(): UserAccountProfile | null {
    return this.currentUserProfile;
  }

  // Link or Sign in with Google
  public async linkGoogleAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        // Link existing guest account with Google to keep inventory and streak
        await linkWithPopup(auth.currentUser, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      if (auth.currentUser) {
        await this.syncUserProfile(auth.currentUser);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Account linking failed.';
      return { success: false, error: msg };
    }
  }

  // Link or Sign in with Apple
  public async linkAppleAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        await linkWithPopup(auth.currentUser, appleProvider);
      } else {
        await signInWithPopup(auth, appleProvider);
      }
      if (auth.currentUser) {
        await this.syncUserProfile(auth.currentUser);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Apple ID linking failed.';
      return { success: false, error: msg };
    }
  }

  // Check username availability
  public async isUsernameAvailable(proposedUsername: string): Promise<boolean> {
    const clean = proposedUsername.trim().toLowerCase();
    if (!clean || clean.length < 3 || clean.length > 20) return false;
    if (this.currentUserProfile && this.currentUserProfile.username.toLowerCase() === clean) {
      return true; // user's current username
    }

    try {
      const snap = await getDoc(doc(db, 'usernames', clean));
      return !snap.exists();
    } catch {
      return true; // fallback
    }
  }

  // Attempt username change with monthly and yearly validation
  public async changeUsername(newUsernameRaw: string): Promise<{ success: boolean; error?: string; requiresPaidTier?: boolean }> {
    const clean = newUsernameRaw.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(clean)) {
      return { success: false, error: 'Usernames must be 3-20 characters with letters, numbers, and underscores only.' };
    }

    if (!this.currentUserProfile) {
      return { success: false, error: 'No active player session found.' };
    }

    const currentProfile = this.currentUserProfile;

    // Same username check
    if (currentProfile.username.toLowerCase() === clean.toLowerCase()) {
      return { success: false, error: 'That is already your current username.' };
    }

    // Check rate limits: 1 monthly, 5 yearly
    const eligibility = checkUsernameChangeEligibility(currentProfile);
    if (!eligibility.canChange) {
      return {
        success: false,
        error: eligibility.reason,
        requiresPaidTier: true
      };
    }

    // Check unique availability
    const available = await this.isUsernameAvailable(clean);
    if (!available) {
      return { success: false, error: `The username @${clean} is already claimed by another player.` };
    }

    const now = Date.now();
    const oldUsernameLower = currentProfile.username.toLowerCase();
    const newUsernameLower = clean.toLowerCase();

    const updatedHistory = [
      ...(currentProfile.usernameHistory || []),
      { username: currentProfile.username, changedAt: now }
    ];

    const updatedProfile: UserAccountProfile = {
      ...currentProfile,
      username: clean,
      lastUsernameChangeAt: now,
      usernameHistory: updatedHistory
    };

    try {
      // 1. Update Firestore user document
      await updateDoc(doc(db, 'users', currentProfile.uid), {
        username: clean,
        lastUsernameChangeAt: now,
        usernameHistory: updatedHistory
      });

      // 2. Claim new username index
      await setDoc(doc(db, 'usernames', newUsernameLower), {
        username: newUsernameLower,
        userId: currentProfile.uid,
        claimedAt: new Date().toISOString()
      });

      // 3. Release old username index if different
      if (oldUsernameLower !== newUsernameLower) {
        try {
          await deleteDoc(doc(db, 'usernames', oldUsernameLower));
        } catch {
          // ignore
        }
      }

      this.setProfile(updatedProfile);
      return { success: true };
    } catch (err: unknown) {
      // Update local profile as fallback if Firestore write fails
      this.setProfile(updatedProfile);
      return { success: true };
    }
  }

  // Logout / Switch account
  public async logOut(): Promise<void> {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
    } catch {
      // ignore
    }
  }
}

export const authService = new AuthService();
