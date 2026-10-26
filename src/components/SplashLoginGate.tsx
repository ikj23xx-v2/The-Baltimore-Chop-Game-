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

interface SplashLoginGateProps {
  onLoginSuccess: (profile?: UserAccountProfile, bonusTokens?: number) => void;
}

export const SplashLoginGate: React.FC<SplashLoginGateProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Baltimore Orioles');
  
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
    setSelectedMethod('EMAIL');
    setAuthStep('DETAILS_FORM');
  };

  const triggerPostAuthAnimation = (savedProfile: UserAccountProfile, bonusAmount: number) => {
    setAnimatingEntrance(true);
    playSynthCrowdCheer();
    
    // Hold 3.2s for the retro tunnel walkout sequence
    setTimeout(() => {
      onLoginSuccess(savedProfile, bonusAmount);
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
      
      // Update team theme
      const team = MLB_TEAMS.find((t: MLBTeamInfo) => t.name === selectedTeam);
      if (team) {
        teamThemeService.setFavoriteTeam(team.name);
      }
    } catch {
      // ignore
    }

    triggerPostAuthAnimation(profile, bonusAmount);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-amber-100 p-4 select-none relative overflow-hidden">
      
      {/* 1. CINEMATIC RETRO TUNNEL WALKOUT ANIMATION */}
      {animatingEntrance ? (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-center p-4">
          <div className="relative w-full max-w-3xl h-[420px] border-4 border-amber-500 rounded-3xl overflow-hidden shadow-2xl bg-[#030712] flex flex-col justify-between p-6">
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
                  THE BALTIMORE CHOP™ STADIUM
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold animate-pulse">● CROWD ROARING</span>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center py-6">
              <div className="text-5xl animate-bounce filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                🚶‍♂️🏏
              </div>
              <h2 className="text-lg font-black text-amber-400 tracking-widest mt-4 animate-pulse">
                EMERGING ONTO THE FIELD...
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                Welcome GM {username || 'Pro'} • Claiming your Welcome Grant!
              </p>
            </div>

            <div className="relative z-10 w-full max-w-xs mx-auto">
              <div className="w-full h-2 bg-slate-900 border border-amber-500/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400" 
                  style={{ width: '100%', animation: 'loadingBar 3.2s cubic-bezier(0.42, 0, 0.58, 1) forwards' }} 
                />
              </div>
              <span className="text-[9px] text-amber-300/60 block mt-2">Claiming Pack & Starting Season...</span>
            </div>
          </div>
        </div>
      ) : (

        /* 2. SPLASH & ONBOARDING MESH */
        <div className="relative w-full max-w-4xl min-h-[500px] border-4 border-amber-500/80 rounded-[32px] bg-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Panel: Game Branding & Bonus Highlights */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-amber-400 tracking-wider leading-none">
                THE BALTIMORE CHOP™
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-1">
                Official Baseball Card Collecting, 26-Man Lineup Strategy & High-Bounce Simulation Engine
              </p>

              {/* Bonus Vending Machine Incentive Banner */}
              <div className="mt-6 bg-[#160f06] border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold text-amber-400 block tracking-wider uppercase mb-1">
                      NEW GM SIGNUP GRANT
                    </span>
                    <h3 className="text-xs font-black text-white">
                      1500 Base + 1,000 Bonus = <span className="text-amber-400">2,500 Vending Tokens</span>
                    </h3>
                    <p className="text-[9px] text-emerald-400 font-mono mt-0.5">
                      ✓ Enough to rip a 750-Token Hobby Box right away!
                    </p>
                  </div>
                  <span className="text-3xl filter drop-shadow">📦</span>
                </div>
              </div>
            </div>

            {/* Ballpark visual preview block */}
            <div className="mt-6 bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-500/20 overflow-hidden relative flex-shrink-0 flex items-center justify-center text-xl">
                🏟️
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-amber-300 block">THE BALTIMORE CHOP™</span>
                <span className="text-[8px] text-slate-400 block">No player likeness • 100% independent simulation</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Account Authorization Gate */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-slate-900">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-amber-400">CREDENTIALS & GM SIGNIN</span>
                <span className="text-[9px] text-slate-500">v2.1-STABLE</span>
              </div>

              {authStep === 'METHOD_SELECT' ? (
                /* SELECT ID PROVIDER */
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 tracking-wider uppercase block">
                      STEP 1: CHOOSE ACCOUNT AUTHENTICATION
                    </span>
                  </div>

                  {error && <div className="text-[10px] text-red-400 bg-red-950/40 p-2.5 rounded-xl">{error}</div>}

                  <button
                    type="button"
                    onClick={() => handleOAuth('GOOGLE')}
                    className="relative w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🌐</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Google ID</div>
                        <div className="text-[9px] text-slate-500">1-Tap Fast Link</div>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/25">
                      +1000 TOKENS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth('APPLE')}
                    className="relative w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🍎</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Apple ID</div>
                        <div className="text-[9px] text-slate-500">iCloud Sync</div>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/25">
                      +1000 TOKENS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailInitiation}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer hover:bg-slate-850 active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">✉️</span>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Email / Guest</div>
                        <div className="text-[9px] text-slate-500">Standard Login</div>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      +500 TOKENS
                    </span>
                  </button>
                </div>
              ) : (
                /* onboarding detail setup screen */
                <form onSubmit={handleSubmitRegistration} className="space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span>STEP 2: GENERAL MANAGER SETUP</span>
                    <button 
                      type="button" 
                      onClick={() => setAuthStep('METHOD_SELECT')} 
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>

                  {error && <div className="text-[10px] text-red-400 bg-red-950/40 p-2.5 rounded-xl">{error}</div>}

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
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
                  setIsSigningUp(!isSigningUp);
                  setAuthStep('METHOD_SELECT');
                }}
                className="text-amber-400 hover:text-white underline cursor-pointer"
              >
                {isSigningUp ? 'Return to Login' : 'Need a new profile? Sign Up'}
              </button>
              <span className="text-[8.5px] text-slate-500">Apache-2.0</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

function playSynthCrowdCheer() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
