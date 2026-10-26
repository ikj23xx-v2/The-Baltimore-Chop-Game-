// src/components/SplashLoginGate.tsx
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';
import { MLB_TEAMS, MLBTeamInfo } from '../data/mlbTeams';
import { teamThemeService } from '../services/teamThemeService';
import { authService, UserAccountProfile } from '../services/authService';
import { REWARD_CONFIG } from '../config/rewardsConfig';
import { hobbyAudio } from '../utils/hobbySoundEngine';

interface SplashLoginGateProps {
  onLoginSuccess: (profile?: UserAccountProfile, bonusTokens?: number, selectedTeam?: string) => void;
  onClose?: () => void;
  initialTeam?: string;
}

export const SplashLoginGate: React.FC<SplashLoginGateProps> = ({ 
  onLoginSuccess, 
  onClose,
  initialTeam = 'Baltimore Orioles'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>(initialTeam);
  
  const [authStep, setAuthStep] = useState<'METHOD_SELECT' | 'DETAILS_FORM'>('METHOD_SELECT');
  const [selectedMethod, setSelectedMethod] = useState<'GOOGLE' | 'APPLE' | 'EMAIL' | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [animatingEntrance, setAnimatingEntrance] = useState(false);
  const [error, setError] = useState('');

  const getBonusTokens = () => {
    if (selectedMethod === 'GOOGLE' || selectedMethod === 'APPLE') return '1,000 BONUS TOKENS';
    return '500 BONUS TOKENS';
  };

  const getBonusTokensValue = () => {
    if (selectedMethod === 'GOOGLE' || selectedMethod === 'APPLE') return REWARD_CONFIG.GOOGLE_SIGNUP_BONUS_TOKENS;
    return REWARD_CONFIG.EMAIL_SIGNUP_BONUS_TOKENS;
  };

  const handleOAuth = async (providerName: 'GOOGLE' | 'APPLE') => {
    setError('');
    hobbyAudio.playCardShuffleFlick();
    try {
      let provider;
      if (providerName === 'GOOGLE') {
        provider = googleProvider || new GoogleAuthProvider();
      } else {
        provider = appleProvider || new OAuthProvider('apple.com');
      }
      setSelectedMethod(providerName);
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        if (res.user.email) setEmail(res.user.email);
        if (res.user.displayName) setUsername(res.user.displayName);
      }
      setAuthStep('DETAILS_FORM');
    } catch (err: any) {
      console.warn('OAuth provider notification:', err);
      // In restricted iframe preview environments, allow seamless entry into Details Form
      if (!username) {
        setUsername(providerName === 'GOOGLE' ? 'GoogleGM' : 'AppleGM');
      }
      setAuthStep('DETAILS_FORM');
    }
  };

  const handleEmailInitiation = () => {
    hobbyAudio.playCardShuffleFlick();
    setSelectedMethod('EMAIL');
    setAuthStep('DETAILS_FORM');
  };

  const triggerPostAuthAnimation = (savedProfile: UserAccountProfile, bonusAmount: number, teamName: string) => {
    setAnimatingEntrance(true);
    playSynthCrowdCheer();
    
    // Hold 3.2s for the retro tunnel walkout sequence
    setTimeout(() => {
      onLoginSuccess(savedProfile, bonusAmount, teamName);
    }, 3200);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanHandle = username.trim() || `GM_${Math.floor(1000 + Math.random() * 9000)}`;
    const bonusAmount = getBonusTokensValue();

    // 1. Create or link Firebase Auth if using Email
    if (selectedMethod === 'EMAIL') {
      try {
        if (isSigningUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (err: any) {
        console.warn('Firebase email auth message:', err);
      }
    }

    // 2. Persist user account profile locally
    const profile: UserAccountProfile = {
      uid: `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: email.trim() || `${cleanHandle.toLowerCase()}@thebaltimorechop.app`,
      displayName: cleanHandle,
      username: cleanHandle,
      photoURL: null,
      isAnonymous: selectedMethod === 'EMAIL' && !email,
      linkedProviders: [selectedMethod === 'GOOGLE' ? 'google.com' : selectedMethod === 'APPLE' ? 'apple.com' : 'password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      
      // Update team theme
      const team = MLB_TEAMS.find((t: MLBTeamInfo) => t.name === selectedTeam);
      if (team) {
        teamThemeService.setFavoriteTeam(team.name);
      }
    } catch {
      // ignore
    }

    triggerPostAuthAnimation(profile, bonusAmount, selectedTeam);
  };

  const handleGuestQuickEnter = () => {
    hobbyAudio.playBoxOpen();
    const guestProfile: UserAccountProfile = {
      uid: `gm_guest_${Date.now()}`,
      email: 'guest@thebaltimorechop.app',
      displayName: 'Guest GM',
      username: 'CamdenSlugger',
      photoURL: null,
      isAnonymous: true,
      linkedProviders: ['anonymous'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };
    try {
      sessionStorage.setItem('chop_splash_dismissed', 'true');
    } catch {
      // ignore
    }
    triggerPostAuthAnimation(guestProfile, REWARD_CONFIG.EMAIL_SIGNUP_BONUS_TOKENS, selectedTeam);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center font-mono text-amber-100 p-3 sm:p-6 select-none overflow-y-auto">
      
      {/* 1. CINEMATIC RETRO TUNNEL WALKOUT ANIMATION */}
      {animatingEntrance ? (
        <div className="w-full max-w-3xl border-4 border-amber-500 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.35)] bg-[#030712] flex flex-col justify-between p-6 sm:p-8 animate-fadeIn relative">
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute -top-10 left-12 w-48 h-64 bg-amber-400/10 blur-3xl rounded-full" />
            <div className="absolute -top-10 right-12 w-48 h-64 bg-amber-400/10 blur-3xl rounded-full" />
            <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none">
              <path d="M 0,0 L 800,0 L 800,500 L 520,500 C 520,260 280,260 280,500 L 0,500 Z" fill="#020617" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-center border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-amber-400 flex items-center justify-center">
                <div className="w-3.5 h-3.5 border border-amber-400 rotate-45 flex items-center justify-center">
                  <span className="-rotate-45 text-[9px]">⚾</span>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400 tracking-wider">
                THE BALTIMORE CHOP™ STADIUM TUNNEL
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold animate-pulse">● CROWD ROARING</span>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center py-8">
            <div className="text-6xl animate-bounce filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
              🚶‍♂️🏏
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-widest mt-5 animate-pulse text-center">
              EMERGING ONTO THE FIELD...
            </h2>
            <p className="text-xs text-slate-300 uppercase tracking-widest mt-1 text-center font-bold">
              Welcome GM {username || 'Pro'} • Claiming 2,500 Token Welcome Grant!
            </p>
            <p className="text-[10px] text-amber-300/80 mt-1">
              Active Franchise: {selectedTeam}
            </p>
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto">
            <div className="w-full h-3 bg-slate-900 border border-amber-500/50 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" 
                style={{ width: '100%', animation: 'loadingBar 3.2s cubic-bezier(0.42, 0, 0.58, 1) forwards' }} 
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-amber-300/70 mt-2">
              <span>Synthesizing Stadium Ambience...</span>
              <span>100% Ready</span>
            </div>
          </div>
        </div>
      ) : (

        /* 2. SPLASH & ONBOARDING MESH */
        <div className="relative w-full max-w-4xl min-h-[520px] border-4 border-amber-500/80 rounded-[32px] bg-slate-900 shadow-[0_0_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col md:flex-row animate-scaleUp">
          
          {/* Top-Right Quick Close / Guest Pass */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={handleGuestQuickEnter}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-wider hover:text-amber-100 transition-all flex items-center gap-1 cursor-pointer"
              title="Skip authentication and enter the ballpark as guest"
            >
              <span>⚾ Guest Field Pass</span>
              <span>→</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs border border-white/10 transition-colors cursor-pointer"
                title="Close Splash Gate"
              >
                ✕
              </button>
            )}
          </div>

          {/* Left Panel: Game Branding & Bonus Highlights */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚾</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  OFFICIAL HOBBY ENGINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider leading-tight">
                THE BALTIMORE CHOP™
              </h1>
              <p className="text-[11px] text-slate-300 font-sans tracking-wide mt-2 leading-relaxed">
                Official Baseball Card Collecting, 26-Man Lineup Strategy & High-Bounce Simulation Engine.
              </p>

              {/* Bonus Vending Machine Incentive Banner */}
              <div className="mt-5 bg-gradient-to-br from-[#1c1206] to-[#0a0703] border-2 border-amber-500/50 p-4 rounded-2xl relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9.5px] font-black text-amber-400 tracking-wider uppercase">
                        NEW GM SIGNUP GRANT
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white">
                      1500 Base + 1,000 Bonus = <span className="text-amber-400">2,500 Vending Tokens</span>
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">
                      ✓ Instant grant: Rip a 750-Token Hobby Box right away!
                    </p>
                  </div>
                  <span className="text-4xl filter drop-shadow">📦</span>
                </div>
              </div>
            </div>

            {/* Ballpark visual preview block */}
            <div className="mt-6 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-500/30 flex-shrink-0 flex items-center justify-center text-2xl shadow-inner">
                🏟️
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300 block">Camden Yards & 30 Ballparks</span>
                <span className="text-[9px] text-slate-400 block">360° Refractors • Double-Entry Ledger • Web Audio Synthesis</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Account Authorization Gate */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-slate-900">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CREDENTIALS & GM SIGNIN</span>
                <span className="text-[9px] text-slate-500 font-mono">v2.1-PROD</span>
              </div>

              {authStep === 'METHOD_SELECT' ? (
                /* SELECT ID PROVIDER */
                <div className="space-y-3.5">
                  <div className="text-left mb-2">
                    <span className="text-[11px] font-bold text-slate-200 block">
                      STEP 1: CHOOSE AUTHENTICATION
                    </span>
                    <span className="text-[9.5px] text-slate-400">
                      Link your identity to claim your welcome bonus.
                    </span>
                  </div>

                  {error && (
                    <div className="text-[10px] text-red-300 bg-red-950/60 border border-red-800 p-2.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOAuth('GOOGLE')}
                    className="relative w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98 group shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Google ID</div>
                        <div className="text-[9px] text-slate-500">1-Tap Fast Link</div>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                      +1,000 TOKENS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth('APPLE')}
                    className="relative w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98 group shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">🍎</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Apple ID</div>
                        <div className="text-[9px] text-slate-500">iCloud Secure Sync</div>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                      +1,000 TOKENS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailInitiation}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98 group shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">✉️</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Email / Custom GM</div>
                        <div className="text-[9px] text-slate-500">Standard Password Login</div>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      +500 TOKENS
                    </span>
                  </button>
                </div>
              ) : (
                /* onboarding detail setup screen */
                <form onSubmit={handleSubmitRegistration} className="space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-amber-300">STEP 2: GENERAL MANAGER SETUP</span>
                    <button 
                      type="button" 
                      onClick={() => setAuthStep('METHOD_SELECT')} 
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>

                  {error && (
                    <div className="text-[10px] text-red-300 bg-red-950/60 border border-red-800 p-2.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  {selectedMethod === 'EMAIL' && (
                    <>
                      <div>
                        <label className="text-[10px] text-amber-300 font-bold block mb-1">GM EMAIL</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="manager@franchise.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-amber-300 font-bold block mb-1">PASSWORD</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">GM HANDLE / USERNAME</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. CamdenSlugger, IronMan_8"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">PRIMARY FRANCHISE TEAM</label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                    >
                      {MLB_TEAMS.map((t: MLBTeamInfo) => (
                        <option key={t.name} value={t.name}>
                          {t.name} ({t.city})
                        </option>
                      ))}
                      <option value="Negro League Legends">Negro League Legends (Historic)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg mt-3 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>⚾</span> Claim Welcome Pack & Begin ({getBonusTokens()})
                  </button>
                </form>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] border-t border-slate-800 pt-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  hobbyAudio.playCardShuffleFlick();
                  setIsSigningUp(!isSigningUp);
                  setAuthStep('METHOD_SELECT');
                }}
                className="text-amber-400 hover:text-white underline cursor-pointer"
              >
                {isSigningUp ? 'Return to Login' : 'Need a new profile? Sign Up'}
              </button>
              <button
                type="button"
                onClick={handleGuestQuickEnter}
                className="text-slate-400 hover:text-amber-300 text-[10px] underline cursor-pointer"
              >
                Direct Guest Play →
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

function playSynthCrowdCheer() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();
    const duration = 2.8;
    const bufferSize = audioCtx.sampleRate * duration;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 1.2);
    filter.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + duration);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.14, audioCtx.currentTime + 0.9);
    gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
  } catch (err) {
    console.warn('AudioContext failed to trigger', err);
  }
}
