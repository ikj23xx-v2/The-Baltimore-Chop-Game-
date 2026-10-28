// src/components/GuestLimitModal.tsx
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
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
