// src/components/SplashLoginGate.tsx
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import { teamThemeService } from '../services/teamThemeService';
import { MLB_TEAMS, MLBTeamInfo } from '../data/mlbTeams';
import { UserAccountProfile } from '../services/authService';
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
  
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatingEntrance, setAnimatingEntrance] = useState(false);
  const [error, setError] = useState('');

  const triggerPostAuthAnimation = (savedProfile: UserAccountProfile, bonusAmount: number, teamName: string) => {
    setAnimatingEntrance(true);
    playSynthCrowdCheer();
    
    // Hold 3.2s for the retro tunnel walkout sequence
    setTimeout(() => {
      onLoginSuccess(savedProfile, bonusAmount, teamName);
    }, 3200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide your GM email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    let authUserUid: string | null = null;
    let authUserEmail: string = cleanEmail;
    let authDisplayName: string = username.trim() || cleanEmail.split('@')[0];

    try {
      if (isSigningUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (cred?.user) {
          authUserUid = cred.user.uid;
          if (cred.user.email) authUserEmail = cred.user.email;
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (cred?.user) {
          authUserUid = cred.user.uid;
          if (cred.user.email) authUserEmail = cred.user.email;
          if (cred.user.displayName) authDisplayName = cred.user.displayName;
        }
      }
    } catch (err: any) {
      console.warn('Firebase email auth message:', err);
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Check credentials or switch to Register New GM.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/user-not-found') {
        setError('No account found for this email. Switch to Register New GM to create one.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/email-already-in-use') {
        setError('Email already registered. Switch to Sign In to enter your password.');
        setIsSigningUp(false);
        setIsLoading(false);
        return;
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      // If network/offline or environment limitation, continue with local profile
    }

    const cleanHandle = username.trim() || authDisplayName || `GM_${Math.floor(1000 + Math.random() * 9000)}`;

    const profile: UserAccountProfile = {
      uid: authUserUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: authUserEmail,
      displayName: cleanHandle,
      username: cleanHandle,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      
      const team = MLB_TEAMS.find((t: MLBTeamInfo) => t.name === selectedTeam);
      if (team) {
        teamThemeService.setFavoriteTeam(team.name);
      }
    } catch {
      // ignore
    }

    setIsLoading(false);
    // User requested: remove the token option for that -> no bonus tokens passed
    triggerPostAuthAnimation(profile, 0, selectedTeam);
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
    triggerPostAuthAnimation(guestProfile, 0, selectedTeam);
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
              Welcome GM {username || email.split('@')[0] || 'Pro'} • Initializing 26-Man Franchise!
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
          
          {/* Top-Right Close Button Only */}
          {onClose && (
            <div className="absolute top-4 right-4 z-30">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs border border-white/20 transition-colors cursor-pointer shadow-md"
                title="Close Splash Gate"
              >
                ✕
              </button>
            </div>
          )}

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

              {/* CHOP Field Club New GM Signup Grant Card */}
              <div className="mt-5">
                <div className="signup-grant-card">
                  <div className="grant-details">
                    <div className="grant-header">
                      <span className="pixel-indicator"></span>
                      <span className="grant-tag">NEW GM SIGNUP GRANT</span>
                    </div>
                    
                    <h3 className="grant-title">
                      1500 Base + 1,000 Bonus = <span className="highlight-amber">2,500 Vending Tokens</span>
                    </h3>
                    
                    <p className="grant-subtitle">
                      <span className="checkmark">✓</span> Instant grant: Rip a 750-Token Hobby Box right away!
                    </p>
                  </div>

                  {/* CHOP FIELD CLUB HOBBY BOX ASSET */}
                  <div className="hobby-box-slot">
                    <img 
                      src="/assets/boxes/chop-field-club-2026-hobby-box.png" 
                      alt="Chop Field Club 2026 Series 1 Hobby Box" 
                      className="retro-box-asset"
                    />
                  </div>
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
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CREDENTIALS & GM LOGIN</span>
                <span className="text-[9px] text-slate-500 font-mono">v2.1-EMAIL</span>
              </div>

              {/* Mode Toggle: Sign In vs Register */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    hobbyAudio.playCardShuffleFlick();
                    setError('');
                    setIsSigningUp(false);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    !isSigningUp 
                      ? 'bg-amber-500 text-slate-950 shadow' 
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    hobbyAudio.playCardShuffleFlick();
                    setError('');
                    setIsSigningUp(true);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSigningUp 
                      ? 'bg-amber-500 text-slate-950 shadow' 
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  Register New GM
                </button>
              </div>

              {error && (
                <div className="text-[10px] text-red-300 bg-red-950/60 border border-red-800 p-2.5 rounded-xl mb-3 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Email Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] text-amber-300 font-bold block mb-1">GM EMAIL</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@franchise.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-sans"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                {isSigningUp && (
                  <>
                    <div>
                      <label className="text-[10px] text-amber-300 font-bold block mb-1">GM HANDLE / USERNAME</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. CamdenSlugger, IronMan_8"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-amber-300 font-bold block mb-1">PRIMARY FRANCHISE TEAM</label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-sans"
                      >
                        {MLB_TEAMS.map((t: MLBTeamInfo) => (
                          <option key={t.name} value={t.name}>
                            {t.name} ({t.city})
                          </option>
                        ))}
                        <option value="Negro League Legends">Negro League Legends (Historic)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Submit Button with NO token option */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl transition-all shadow-lg mt-3 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>⚾ Authenticating...</span>
                  ) : isSigningUp ? (
                    <span>⚾ Create Account & Enter Ballpark</span>
                  ) : (
                    <span>⚾ Sign In & Enter Ballpark</span>
                  )}
                </button>
              </form>
            </div>

            <div className="flex justify-between items-center text-[10px] border-t border-slate-800 pt-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  hobbyAudio.playCardShuffleFlick();
                  setError('');
                  setIsSigningUp(!isSigningUp);
                }}
                className="text-amber-400 hover:text-white underline cursor-pointer"
              >
                {isSigningUp ? 'Return to Sign In' : 'Need a new profile? Register'}
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
