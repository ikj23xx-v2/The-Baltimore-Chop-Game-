// src/components/GuestLimitModal.tsx
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase';
import { authService, UserAccountProfile } from '../services/authService';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';

interface GuestLimitModalProps {
  isOpen: boolean;
  limitType: 'DAILY_LIMIT' | 'TOTAL_LIMIT';
  onAccountCreated: (profile: UserAccountProfile) => void;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  limitType,
  onAccountCreated,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier) {
      setErrorMsg('Please enter your Username or Email');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const emailToUse = identifier.includes('@')
      ? identifier
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@thebaltimorechop.app`;
    const usernameToUse = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    let userUid: string | null = null;
    try {
      if (isLoginMode) {
        const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
        if (cred?.user) userUid = cred.user.uid;
      } else {
        const cred = await createUserWithEmailAndPassword(auth, emailToUse, password);
        if (cred?.user) userUid = cred.user.uid;
      }
    } catch (err: any) {
      console.warn('Firebase auth attempt info:', err);
    }

    const newProfile: UserAccountProfile = {
      uid: userUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: emailToUse,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: [],
    };

    saveAndProceed(newProfile);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    soundManager.playButtonClick();

    let profile: UserAccountProfile | null = null;
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        const u = res.user;
        const cleanName = u.displayName || u.email?.split('@')[0] || 'GoogleGM';
        profile = {
          uid: u.uid,
          email: u.email || 'google_gm@thebaltimorechop.app',
          displayName: cleanName,
          username: cleanName.replace(/[^a-zA-Z0-9_]/g, ''),
          photoURL: u.photoURL,
          isAnonymous: false,
          linkedProviders: ['google.com'],
          createdAt: Date.now(),
          lastUsernameChangeAt: null,
          usernameHistory: [],
        };
      }
    } catch {
      const cleanName = usernameOrEmail.trim() || 'GoogleGM';
      profile = {
        uid: `gm_google_${Date.now()}`,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : 'google_gm@thebaltimorechop.app',
        displayName: cleanName,
        username: cleanName,
        photoURL: null,
        isAnonymous: false,
        linkedProviders: ['google.com'],
        createdAt: Date.now(),
        lastUsernameChangeAt: null,
        usernameHistory: [],
      };
    }

    if (profile) {
      saveAndProceed(profile);
    } else {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    soundManager.playButtonClick();

    let profile: UserAccountProfile | null = null;
    try {
      const provider = new OAuthProvider('apple.com');
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        const u = res.user;
        const cleanName = u.displayName || u.email?.split('@')[0] || 'AppleGM';
        profile = {
          uid: u.uid,
          email: u.email || 'apple_gm@thebaltimorechop.app',
          displayName: cleanName,
          username: cleanName.replace(/[^a-zA-Z0-9_]/g, ''),
          photoURL: u.photoURL,
          isAnonymous: false,
          linkedProviders: ['apple.com'],
          createdAt: Date.now(),
          lastUsernameChangeAt: null,
          usernameHistory: [],
        };
      }
    } catch {
      const cleanName = usernameOrEmail.trim() || 'AppleGM';
      profile = {
        uid: `gm_apple_${Date.now()}`,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : 'apple_gm@thebaltimorechop.app',
        displayName: cleanName,
        username: cleanName,
        photoURL: null,
        isAnonymous: false,
        linkedProviders: ['apple.com'],
        createdAt: Date.now(),
        lastUsernameChangeAt: null,
        usernameHistory: [],
      };
    }

    if (profile) {
      saveAndProceed(profile);
    } else {
      setIsLoading(false);
    }
  };

  const saveAndProceed = (profile: UserAccountProfile) => {
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      authService.saveProfile(profile);
    } catch {
      // ignore
    }

    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setIsLoading(false);
    onAccountCreated(profile);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#f5f0e6] border-4 border-[#b58d3d] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-6 text-[#2c2c2c] animate-fadeIn">
        
        {/* Header Ribbon */}
        <div className="text-center pb-3 border-b-2 border-[#d4af37] mb-4">
          <div className="inline-block bg-[#e65c00] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1 tracking-wider shadow">
            {limitType === 'DAILY_LIMIT' ? '1-Hour Daily Limit Reached' : '5-Hour Trial Limit Reached'}
          </div>
          <h2 className="text-xl font-black text-[#2c2c2c] tracking-wide uppercase">
            {limitType === 'DAILY_LIMIT' ? 'Daily Guest Pass Expired' : 'Guest Trial Complete'}
          </h2>
          <p className="text-xs font-semibold text-[#5a4c33] mt-1">
            {limitType === 'DAILY_LIMIT' 
              ? 'Guest play is limited to 1 hour per day. Sign up free to unlock unlimited play today!'
              : 'Direct guest play is limited to 5 total hours per IP. Sign up free to keep your roster and continue!'}
          </p>
        </div>

        {/* Saved Progress Reassurance */}
        <div className="bg-[#e9dfcc] border border-[#b58d3d] rounded-lg p-3 mb-4 text-xs">
          <div className="font-bold text-[#8b4513] flex items-center gap-1.5 mb-1">
            <span>🛡️</span>
            <span>Your Roster & Progress Are Saved!</span>
          </div>
          <p className="text-[#3c362b] leading-tight">
            Signing up locks in your drafted players, bankroll, and awards you the <strong>2,500 Vending Tokens</strong> starter grant!
          </p>
        </div>

        {errorMsg && (
          <div className="mb-3 bg-red-900/90 text-red-100 text-xs font-mono p-2 rounded border border-red-500 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#444] mb-1">
              USERNAME / EMAIL
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. CamdenSlugger or your@email.com"
              disabled={isLoading}
              className="w-full p-2.5 bg-[#e4dec9] border border-[#b58d3d] rounded text-sm text-[#222] font-semibold outline-none focus:border-[#ff6b00] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#444] mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={isLoading}
              className="w-full p-2.5 bg-[#e4dec9] border border-[#b58d3d] rounded text-sm text-[#222] font-semibold outline-none focus:border-[#ff6b00] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded bg-[#e65c00] hover:bg-[#cc5200] active:scale-[0.99] text-white font-black text-sm tracking-wide uppercase shadow-md cursor-pointer transition-all"
          >
            {isLoginMode ? 'LOG IN & CONTINUE PLAYING' : 'SIGN UP FREE & UNLOCK UNLIMITED GM PLAY'}
          </button>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="py-2 px-2 bg-white hover:bg-slate-50 border border-[#b58d3d] rounded text-xs font-bold text-[#222] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google (+1K)</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleAppleSignIn}
              className="py-2 px-2 bg-white hover:bg-slate-50 border border-[#b58d3d] rounded text-xs font-bold text-[#222] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.7-7.85-12.01-14.34-6.17-9.35-11.1-19.86-14.79-31.54-3.69-11.68-5.54-22.68-5.54-33 0-14.42 3.65-26.65 10.96-36.68 7.31-10.03 16.64-15.17 27.99-15.42 4.87 0 10.15 1.3 15.84 3.91 5.69 2.61 9.5 3.97 11.43 4.09 1.77 0 5.75-1.42 11.94-4.26 6.19-2.84 11.55-4.14 16.08-3.9 11.95.63 21.72 5.09 29.31 13.37-10.42 6.35-15.5 15.1-15.26 26.25.25 8.74 3.59 16.02 10.02 21.84 6.43 5.82 14.13 9.07 23.1 9.76-2.12 6.42-4.63 12.78-7.53 19.08zM119.22 31.84c0-7.14 2.65-13.91 7.95-20.31 5.3-6.4 11.83-10.45 19.59-12.15.25 1.14.38 2.22.38 3.24 0 7.02-2.73 13.88-8.19 20.58-5.46 6.7-12.19 10.59-20.19 11.68-.26-1.02-.39-2.04-.39-3.04z" />
              </svg>
              <span>Apple (+1K)</span>
            </button>
          </div>

          <div className="text-center pt-2 border-t border-[#d4af37]/40">
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setIsLoginMode(!isLoginMode);
              }}
              className="text-xs font-bold text-[#8b4513] hover:underline cursor-pointer"
            >
              {isLoginMode ? 'Need a new account? Sign Up Free' : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
