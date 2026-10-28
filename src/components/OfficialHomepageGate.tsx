// src/components/OfficialHomepageGate.tsx
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';
import { authService, UserAccountProfile } from '../services/authService';
import { teamThemeService } from '../services/teamThemeService';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';

interface OfficialHomepageGateProps {
  isOpen: boolean;
  onEnterGame: (profile?: UserAccountProfile, bonusTokens?: number, selectedTeam?: string) => void;
}

export const OfficialHomepageGate: React.FC<OfficialHomepageGateProps> = ({
  isOpen,
  onEnterGame,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier) {
      setAuthError('Please enter your Username or Email');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password');
      return;
    }

    setIsLoading(true);

    const emailToUse = identifier.includes('@') 
      ? identifier 
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@thebaltimorechop.app`;
    const usernameToUse = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    let authUserUid: string | null = null;
    try {
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      if (cred?.user) {
        authUserUid = cred.user.uid;
      }
    } catch (err: any) {
      console.warn('Firebase sign in note:', err);
      // Seamless local profile fallback
    }

    const profile: UserAccountProfile = {
      uid: authUserUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: emailToUse,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    saveAndLaunch(profile, 0);
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier) {
      setAuthError('Please enter your desired Username or Email');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const emailToUse = identifier.includes('@') 
      ? identifier 
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@thebaltimorechop.app`;
    const usernameToUse = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    let authUserUid: string | null = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, emailToUse, password);
      if (cred?.user) {
        authUserUid = cred.user.uid;
      }
    } catch (err: any) {
      console.warn('Firebase register note:', err);
    }

    const profile: UserAccountProfile = {
      uid: authUserUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: emailToUse,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    saveAndLaunch(profile, 1000);
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
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
          usernameHistory: []
        };
      }
    } catch (err: any) {
      console.warn('Google popup note:', err);
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
        usernameHistory: []
      };
    }

    if (profile) {
      saveAndLaunch(profile, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
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
          usernameHistory: []
        };
      }
    } catch (err: any) {
      console.warn('Apple popup note:', err);
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
        usernameHistory: []
      };
    }

    if (profile) {
      saveAndLaunch(profile, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const handleGuestEnter = () => {
    soundManager.playButtonClick();
    const guestProfile: UserAccountProfile = {
      uid: `gm_guest_${Date.now()}`,
      email: 'guest@thebaltimorechop.app',
      displayName: 'Guest GM',
      username: usernameOrEmail.trim() || 'CamdenSlugger',
      photoURL: null,
      isAnonymous: true,
      linkedProviders: ['anonymous'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };
    saveAndLaunch(guestProfile, 0);
  };

  const handleClaimGrant = () => {
    soundManager.playPackRip();
    if (!usernameOrEmail) {
      setUsernameOrEmail('NewGM_' + Math.floor(100 + Math.random() * 900));
    }
    if (!password) {
      setPassword('chop2025');
    }
  };

  const saveAndLaunch = (profile: UserAccountProfile, bonus: number) => {
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      authService.saveProfile(profile);
      teamThemeService.setFavoriteTeam('Baltimore Orioles');
    } catch {
      // ignore
    }

    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setIsLoading(false);
    onEnterGame(profile, bonus, 'Baltimore Orioles');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b12] flex items-center justify-center p-2 sm:p-4 select-none overflow-y-auto">
      
      {/* ============================================================== */}
      {/* DESKTOP & TABLET VIEWPORT (Exact 1024x572 16:9 Artwork Match)  */}
      {/* ============================================================== */}
      <div className="hidden sm:block relative w-full max-w-[1080px] aspect-[1024/572] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.95)] border-4 border-[#2b241c] bg-black shrink-0">
        
        {/* Background Image: Pixel Art Ballpark Tunnel */}
        <img
          src="/assets/aistudio/8eade774-25b0-4c28-893a-8e8401fd2605_028889e8.jpeg"
          alt="The Baltimore Chop Official Homepage"
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Interactive Bottom-Left Grant Banner Hotspot */}
        <button
          type="button"
          onClick={handleClaimGrant}
          title="Click to prefill grant and claim 2,500 Vending Tokens!"
          className="absolute z-20 cursor-pointer rounded-xl transition-all hover:ring-2 hover:ring-amber-400/60 active:scale-[0.99]"
          style={{
            left: '2.5%',
            top: '81.8%',
            width: '45.8%',
            height: '14.5%',
          }}
        />

        {/* Interactive Credentials Overlay (Aligned over the right-hand card) */}
        <form 
          onSubmit={handleLogin}
          className="absolute z-20 flex flex-col justify-between font-sans"
          style={{
            left: '77.8%',
            top: '21.5%',
            width: '19.4%',
            height: '55.2%',
          }}
        >
          <div className="w-full h-full flex flex-col justify-between p-[2%] pt-[6%]">
            
            {/* Header: Transparent overlay over "CREDENTIALS" */}
            <div className="w-full text-center py-[1%]">
              <span className="text-[11px] lg:text-[13px] font-black tracking-widest text-transparent select-none">
                CREDENTIALS
              </span>
            </div>

            {/* Error Message if any */}
            {authError && (
              <div className="bg-red-950/90 text-red-200 text-[8px] font-mono p-1 rounded border border-red-500/50 text-center leading-tight">
                {authError}
              </div>
            )}

            {/* Input Form Fields */}
            <div className="space-y-[4%] w-full">
              <div>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="USERNAME / EMAIL"
                  className="w-full bg-[#9f9582]/90 hover:bg-[#a89e8b] focus:bg-[#b0a693] text-[#1c1812] placeholder-[#4e483e] font-mono text-[9px] sm:text-[10px] lg:text-[11px] px-2 py-1 lg:py-1.5 rounded-md border border-[#524b3e] focus:border-[#e8581c] outline-none shadow-inner font-bold"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  className="w-full bg-[#9f9582]/90 hover:bg-[#a89e8b] focus:bg-[#b0a693] text-[#1c1812] placeholder-[#4e483e] font-mono text-[9px] sm:text-[10px] lg:text-[11px] px-2 py-1 lg:py-1.5 rounded-md border border-[#524b3e] focus:border-[#e8581c] outline-none shadow-inner font-bold"
                />
              </div>
            </div>

            {/* Action Buttons Stack */}
            <div className="space-y-[3%] w-full pt-[2%]">
              {/* 1. LOG IN Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-1 lg:py-1.5 rounded-md bg-gradient-to-b from-[#eb5c1e] to-[#c74007] hover:brightness-110 active:scale-[0.98] text-white font-black text-[10px] sm:text-[11px] lg:text-[12px] tracking-wider uppercase border border-[#6b2103] shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer transition-all flex items-center justify-center"
              >
                LOG IN
              </button>

              {/* 2. SIGN IN WITH GOOGLE Button */}
              <div className="relative w-full">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-0.5 lg:py-1 px-1.5 rounded-md bg-white hover:bg-slate-100 active:scale-[0.98] text-[#2c241a] font-bold text-[8px] sm:text-[9px] lg:text-[10px] tracking-tight uppercase border border-[#8a8170] shadow flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="truncate">SIGN IN WITH GOOGLE</span>
                </button>
                <div className="absolute -top-1.5 right-0.5 pointer-events-none">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-[#302409] font-black text-[6.5px] lg:text-[7.5px] px-1 py-0.2 rounded border border-[#85610e] shadow-sm tracking-tight">
                    +1000 TOKENS
                  </span>
                </div>
              </div>

              {/* 3. SIGN IN WITH APPLE Button */}
              <div className="relative w-full">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleAppleSignIn}
                  className="w-full py-0.5 lg:py-1 px-1.5 rounded-md bg-white hover:bg-slate-100 active:scale-[0.98] text-[#111111] font-bold text-[8px] sm:text-[9px] lg:text-[10px] tracking-tight uppercase border border-[#8a8170] shadow flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 fill-black shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.7-7.85-12.01-14.34-6.17-9.35-11.1-19.86-14.79-31.54-3.69-11.68-5.54-22.68-5.54-33 0-14.42 3.65-26.65 10.96-36.68 7.31-10.03 16.64-15.17 27.99-15.42 4.87 0 10.15 1.3 15.84 3.91 5.69 2.61 9.5 3.97 11.43 4.09 1.77 0 5.75-1.42 11.94-4.26 6.19-2.84 11.55-4.14 16.08-3.9 11.95.63 21.72 5.09 29.31 13.37-10.42 6.35-15.5 15.1-15.26 26.25.25 8.74 3.59 16.02 10.02 21.84 6.43 5.82 14.13 9.07 23.1 9.76-2.12 6.42-4.63 12.78-7.53 19.08zM119.22 31.84c0-7.14 2.65-13.91 7.95-20.31 5.3-6.4 11.83-10.45 19.59-12.15.25 1.14.38 2.22.38 3.24 0 7.02-2.73 13.88-8.19 20.58-5.46 6.7-12.19 10.59-20.19 11.68-.26-1.02-.39-2.04-.39-3.04z" />
                  </svg>
                  <span className="truncate">SIGN IN WITH APPLE</span>
                </button>
                <div className="absolute -top-1.5 right-0.5 pointer-events-none">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-[#302409] font-black text-[6.5px] lg:text-[7.5px] px-1 py-0.2 rounded border border-[#85610e] shadow-sm tracking-tight">
                    +1000 TOKENS
                  </span>
                </div>
              </div>

              {/* 4. SIGN UP Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSignUp}
                className="w-full py-1 lg:py-1.5 rounded-md bg-gradient-to-b from-[#eb5c1e] to-[#c74007] hover:brightness-110 active:scale-[0.98] text-white font-black text-[10px] sm:text-[11px] lg:text-[12px] tracking-wider uppercase border border-[#6b2103] shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer transition-all flex items-center justify-center"
              >
                SIGN UP
              </button>
            </div>

            {/* Direct Guest Quick Enter */}
            <div className="text-center pt-[1%]">
              <button
                type="button"
                onClick={handleGuestEnter}
                className="text-[7.5px] lg:text-[9px] font-mono text-[#4a3f31] hover:text-[#000000] underline font-bold transition-colors cursor-pointer"
              >
                Direct Guest Play →
              </button>
            </div>

          </div>
        </form>

      </div>

      {/* ============================================================== */}
      {/* MOBILE PORTRAIT VIEWPORT (<640px Screen Adaptation)           */}
      {/* ============================================================== */}
      <div className="block sm:hidden w-full max-w-md mx-auto space-y-3 pb-8">
        
        {/* Ballpark Graphic Card */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#2b241c] bg-black">
          <img
            src="/assets/aistudio/8eade774-25b0-4c28-893a-8e8401fd2605_028889e8.jpeg"
            alt="The Baltimore Chop Official Homepage"
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Parchment Credentials Mobile Card */}
        <div className="bg-[#b7ac98] border-4 border-[#2c2419] rounded-2xl p-4 shadow-2xl font-sans text-[#1c1812]">
          <div className="text-center mb-3 border-b-2 border-[#524b3e]/30 pb-2">
            <h2 className="text-sm font-black tracking-widest uppercase text-[#2c2419]">
              CREDENTIALS
            </h2>
            <p className="text-[10px] font-mono font-semibold text-[#524b3e]">
              Enter The Baltimore Chop™ Ballpark
            </p>
          </div>

          {authError && (
            <div className="mb-3 bg-red-900/80 text-red-100 text-xs font-mono p-2 rounded border border-red-500/50 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#4e483e] mb-1">
                USERNAME / EMAIL
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Manager Handle or Email"
                className="w-full bg-[#9f9582] text-[#1c1812] placeholder-[#4e483e] font-mono text-sm px-3 py-2 rounded-lg border border-[#524b3e] focus:border-[#e8581c] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-[#4e483e] mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full bg-[#9f9582] text-[#1c1812] placeholder-[#4e483e] font-mono text-sm px-3 py-2 rounded-lg border border-[#524b3e] focus:border-[#e8581c] outline-none font-bold"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#eb5c1e] to-[#c74007] text-white font-black text-sm tracking-wider uppercase border border-[#6b2103] shadow-md cursor-pointer"
              >
                LOG IN
              </button>

              <div className="relative">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-2 px-3 rounded-lg bg-white text-[#2c241a] font-bold text-xs tracking-tight uppercase border border-[#8a8170] shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>SIGN IN WITH GOOGLE</span>
                </button>
                <div className="absolute -top-2 right-2 pointer-events-none">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-[#302409] font-black text-[9px] px-1.5 py-0.5 rounded border border-[#85610e] shadow-sm">
                    +1000 TOKENS
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleAppleSignIn}
                  className="w-full py-2 px-3 rounded-lg bg-white text-[#111111] font-bold text-xs tracking-tight uppercase border border-[#8a8170] shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-black shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.7-7.85-12.01-14.34-6.17-9.35-11.1-19.86-14.79-31.54-3.69-11.68-5.54-22.68-5.54-33 0-14.42 3.65-26.65 10.96-36.68 7.31-10.03 16.64-15.17 27.99-15.42 4.87 0 10.15 1.3 15.84 3.91 5.69 2.61 9.5 3.97 11.43 4.09 1.77 0 5.75-1.42 11.94-4.26 6.19-2.84 11.55-4.14 16.08-3.9 11.95.63 21.72 5.09 29.31 13.37-10.42 6.35-15.5 15.1-15.26 26.25.25 8.74 3.59 16.02 10.02 21.84 6.43 5.82 14.13 9.07 23.1 9.76-2.12 6.42-4.63 12.78-7.53 19.08zM119.22 31.84c0-7.14 2.65-13.91 7.95-20.31 5.3-6.4 11.83-10.45 19.59-12.15.25 1.14.38 2.22.38 3.24 0 7.02-2.73 13.88-8.19 20.58-5.46 6.7-12.19 10.59-20.19 11.68-.26-1.02-.39-2.04-.39-3.04z" />
                  </svg>
                  <span>SIGN IN WITH APPLE</span>
                </button>
                <div className="absolute -top-2 right-2 pointer-events-none">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-[#302409] font-black text-[9px] px-1.5 py-0.5 rounded border border-[#85610e] shadow-sm">
                    +1000 TOKENS
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleSignUp}
                className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#eb5c1e] to-[#c74007] text-white font-black text-sm tracking-wider uppercase border border-[#6b2103] shadow-md cursor-pointer"
              >
                SIGN UP
              </button>

              <button
                type="button"
                onClick={handleGuestEnter}
                className="w-full py-1 text-xs font-mono text-[#4a3f31] underline font-bold transition-colors cursor-pointer text-center"
              >
                Direct Guest Play →
              </button>
            </div>
          </form>
        </div>

        {/* Mobile GM Signup Grant Box */}
        <div 
          onClick={handleClaimGrant}
          className="bg-gradient-to-r from-[#d9a548] to-[#c18c2f] border-2 border-[#735313] rounded-xl p-3 text-[#2a1c07] shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.99]"
        >
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider">NEW GM SIGNUP GRANT:</div>
            <div className="text-xs font-bold">1500 Base + 1,000 Bonus = 2,500 Vending Tokens!</div>
            <div className="text-[10px] font-medium text-[#402a0b]">✓ Enough to rip a 750-Token Hobby Box right away!</div>
          </div>
          <div className="text-2xl shrink-0 ml-2">📦</div>
        </div>

      </div>

    </div>
  );
};

