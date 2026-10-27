// src/components/StadiumTunnelEntrance.tsx
import React, { useState, useEffect } from 'react';
import { MLB_TEAMS, MLB_DIVISIONS, MLBTeamInfo } from '../data/mlbTeams';
import { teamThemeService, ActiveTeamTheme, NEGRO_LEAGUES_TEAM_INFO } from '../services/teamThemeService';
import { NEGRO_LEAGUE_LEGENDS } from '../data/negroLeagues';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { hobbyAudio } from '../utils/hobbySoundEngine';
import { UserAccountProfile, authService } from '../services/authService';
import { REWARD_CONFIG } from '../config/rewardsConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Sparkles, 
  MapPin, 
  Shield, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Users, 
  CheckCircle2,
  Lock,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';

interface StadiumTunnelEntranceProps {
  isOpen: boolean;
  onComplete: (selectedTeam: ActiveTeamTheme, profile?: UserAccountProfile, bonusTokens?: number) => void;
  onClose?: () => void;
  initialTeam?: string;
}

export const StadiumTunnelEntrance: React.FC<StadiumTunnelEntranceProps> = ({
  isOpen,
  onComplete,
  onClose,
  initialTeam = 'Baltimore Orioles'
}) => {
  // Cinematic Walkout Stages: 'TUNNEL_DEPTH' -> 'WALKING_FORWARD' -> 'FIELD_BURST' -> 'ON_FIELD_SIGNUP'
  const [cinematicStage, setCinematicStage] = useState<'TUNNEL_DEPTH' | 'WALKING_FORWARD' | 'FIELD_BURST' | 'ON_FIELD_SIGNUP'>('TUNNEL_DEPTH');
  const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%
  
  // League Filter for Team Selection: 'ALL' | 'AL' | 'NL' | 'NEGRO_LEAGUES'
  const [leagueFilter, setLeagueFilter] = useState<'ALL' | 'AL' | 'NL' | 'NEGRO_LEAGUES'>('ALL');
  
  // Currently Chosen Team
  const [selectedTeamName, setSelectedTeamName] = useState<string>(() => initialTeam || teamThemeService.getActiveTeam().name);
  const [activeTheme, setActiveTheme] = useState<ActiveTeamTheme>(() => teamThemeService.getActiveTeam());

  // Email Sign Up & Credentials State
  const [isSigningUp, setIsSigningUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscribe to theme updates
  useEffect(() => {
    return teamThemeService.subscribe((theme) => {
      setActiveTheme(theme);
    });
  }, []);

  // Handle Walking Forward Cinematic Animation
  useEffect(() => {
    if (cinematicStage === 'WALKING_FORWARD') {
      const interval = setInterval(() => {
        setWalkProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setCinematicStage('FIELD_BURST');
            soundManager.playBatCrack(true);
            triggerHapticFeedback('HEAVY');
            playSynthCrowdCheer();
            setTimeout(() => {
              setCinematicStage('ON_FIELD_SIGNUP');
              soundManager.playJackpotChime();
            }, 900);
            return 100;
          }
          // Walking step audio pacing
          if (prev % 20 === 0) {
            soundManager.playButtonClick();
            triggerHapticFeedback('LIGHT');
          }
          return prev + 2.5;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [cinematicStage]);

  if (!isOpen) return null;

  // Trigger Walkout Animation
  const handleStartWalkout = () => {
    soundManager.playCardWhoosh();
    triggerHapticFeedback('SNAP');
    setCinematicStage('WALKING_FORWARD');
    setWalkProgress(0);
  };

  // Skip straight to On-Field Sign Up & Login
  const handleSkipCinematic = () => {
    soundManager.playButtonClick();
    setCinematicStage('ON_FIELD_SIGNUP');
    setWalkProgress(100);
  };

  // Select Favorite Team
  const handleSelectTeam = (teamName: string) => {
    soundManager.playButtonClick();
    triggerHapticFeedback('LIGHT');
    setSelectedTeamName(teamName);
    const updated = teamThemeService.setFavoriteTeam(teamName);
    setActiveTheme(updated);
  };

  // Handle Email Credentials Submit (Sign In or Register)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please provide your GM email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    let authUserUid: string | null = null;
    let authUserEmail: string = cleanEmail;
    let authDisplayName: string = username.trim() || cleanEmail.split('@')[0];

    try {
      if (isSigningUp) {
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
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
        setErrorMessage('Invalid email or password. Check credentials or switch to Register New GM.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/user-not-found') {
        setErrorMessage('No account found for this email. Switch to Register New GM to create one.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/email-already-in-use') {
        setErrorMessage('Email already registered. Switch to Sign In to enter your password.');
        setIsSigningUp(false);
        setIsLoading(false);
        return;
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters.');
        setIsLoading(false);
        return;
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }
      // If network/offline, proceed gracefully with local profile
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
      authService.saveProfile(profile);
    } catch {
      // ignore
    }

    const finalTeam = teamThemeService.setFavoriteTeam(selectedTeamName);
    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setIsLoading(false);

    onComplete(finalTeam, profile, 0);
  };

  // Direct Guest Play quick entrance
  const handleGuestQuickEnter = () => {
    hobbyAudio.playBoxOpen();
    const guestProfile: UserAccountProfile = {
      uid: `gm_guest_${Date.now()}`,
      email: 'guest@thebaltimorechop.app',
      displayName: 'Guest GM',
      username: username.trim() || 'CamdenSlugger',
      photoURL: null,
      isAnonymous: true,
      linkedProviders: ['anonymous'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(guestProfile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      authService.saveProfile(guestProfile);
    } catch {
      // ignore
    }

    const finalTeam = teamThemeService.setFavoriteTeam(selectedTeamName);
    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    onComplete(finalTeam, guestProfile, 0);
  };

  // Filtered teams list
  const filteredTeams = MLB_TEAMS.filter((team) => {
    if (leagueFilter === 'ALL') return true;
    if (leagueFilter === 'AL') return team.league === 'AL';
    if (leagueFilter === 'NL') return team.league === 'NL';
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black select-none overflow-hidden animate-fade-in font-sans">
      
      {/* Top Close Button (if dismissed) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm border border-white/20 transition-all cursor-pointer shadow-lg"
          title="Close Splash Gate"
        >
          ✕
        </button>
      )}

      {/* ============================================================== */}
      {/* CINEMATIC STAGES 1, 2 & 3: FIRST-PERSON MLB STADIUM TUNNEL WALKOUT */}
      {/* ============================================================== */}
      {(cinematicStage === 'TUNNEL_DEPTH' || cinematicStage === 'WALKING_FORWARD' || cinematicStage === 'FIELD_BURST') && (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* 3D Perspective Tunnel Wrapper */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{
              perspective: '1000px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {/* TUNNEL WALLS & CEILING ARCH (Deep Concrete & Subway Brick Textures) */}
            <div 
              className="absolute inset-0 transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${1 + walkProgress * 0.02}) translateZ(${walkProgress * 8}px)`,
                background: `
                  radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(10,12,16,0.92) 80%),
                  repeating-linear-gradient(90deg, #181d26 0px, #181d26 80px, #0f131a 80px, #0f131a 82px),
                  linear-gradient(180deg, #11151c 0%, #202734 50%, #0b0e13 100%)
                `
              }}
            >
              {/* Overhead Industrial Pendant Lights passing overhead */}
              <div 
                className="absolute top-0 left-0 right-0 h-28 pointer-events-none flex justify-around opacity-60"
                style={{
                  transform: `translateY(${walkProgress * 0.4}px)`
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1 h-12 bg-slate-600" />
                    <div className="w-8 h-4 rounded-full bg-amber-400/80 shadow-[0_10px_25px_rgba(245,158,11,0.9)]" />
                  </div>
                ))}
              </div>

              {/* Tunnel Side Rails & Dugout Pipes */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black via-slate-900 to-transparent border-r border-slate-700/30" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black via-slate-900 to-transparent border-l border-slate-700/30" />

              {/* Concrete Floor with Field Yard Marker line */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #1e2530 0px, #1e2530 30px, #0f131a 30px, #0f131a 32px)'
                }}
              />
            </div>

            {/* TUNNEL PORTAL OPENING (THE MOUTH OF THE DUGOUT LEADING ONTO THE FIELD) */}
            <div 
              className={`relative z-10 w-72 sm:w-96 h-80 sm:h-[420px] rounded-t-full border-t-8 border-x-8 border-slate-800 flex flex-col items-center justify-end overflow-hidden shadow-[0_0_120px_rgba(255,255,255,0.7)] transition-all duration-300 ${
                cinematicStage === 'FIELD_BURST' ? 'scale-150 brightness-200' : 'scale-100'
              }`}
              style={{
                transform: `scale(${1 + walkProgress * 0.04}) translateY(${-walkProgress * 0.5}px)`
              }}
            >
              {/* Field Grass & Warning Track Dirt Background through the opening */}
              <div 
                className="absolute inset-0 bg-cover bg-bottom flex flex-col justify-between p-4"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 20%, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.6) 30%, rgba(22,101,52,0.9) 70%),
                    linear-gradient(180deg, #38bdf8 0%, #166534 60%, #854d0e 95%)
                  `
                }}
              >
                {/* Stadium Light Tower Flare */}
                <div className="w-full flex justify-between items-start opacity-80 animate-pulse">
                  <div className="w-12 h-6 bg-white/80 rounded-full blur-md shadow-[0_0_40px_#fff]" />
                  <div className="w-12 h-6 bg-white/80 rounded-full blur-md shadow-[0_0_40px_#fff]" />
                </div>

                {/* Stadium Upper Deck Silhouette */}
                <div className="text-center my-auto">
                  <span className="text-3xl sm:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    🏟️
                  </span>
                  <span className="text-xs font-display font-black text-white uppercase tracking-widest block drop-shadow-md">
                    {activeTheme.ballpark}
                  </span>
                </div>

                {/* Dirt Warning Track Steps */}
                <div className="h-10 w-full bg-gradient-to-t from-amber-900 to-amber-700/80 rounded-t-xl border-t border-amber-500/50 flex items-center justify-center text-[10px] font-mono font-black text-amber-200 tracking-wider">
                  STEP ONTO DIAMOND ⬆️
                </div>
              </div>
            </div>

            {/* Radiant Sunburst / Floodlight Flare effect that blinds camera on exit */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-radial from-amber-100 via-yellow-200 to-transparent"
              style={{
                opacity: cinematicStage === 'FIELD_BURST' ? 0.95 : walkProgress > 70 ? (walkProgress - 70) * 0.03 : 0
              }}
            />
          </div>

          {/* HUD Overlay in Tunnel Mode */}
          <div className="relative z-30 flex flex-col items-center text-center p-6 max-w-md w-full animate-fadeIn">
            {/* Overhead Stadium Signage */}
            <div className="px-5 py-3 rounded-2xl bg-black/85 border-2 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.5)] mb-6 backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                THE BALTIMORE CHOP™ • STADIUM TUNNEL ENTRANCE
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide mt-0.5">
                {activeTheme.name}
              </h2>
              <span className="text-xs text-slate-300 font-mono flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> {activeTheme.ballpark}
              </span>
            </div>

            {/* Prompt Actions */}
            {cinematicStage === 'TUNNEL_DEPTH' && (
              <div className="space-y-3 w-full">
                <button
                  type="button"
                  onClick={handleStartWalkout}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-base uppercase tracking-wider shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>🚶‍♂️ WALK OUT ONTO THE FIELD</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleSkipCinematic}
                  className="text-xs text-amber-400 hover:text-white font-mono underline uppercase tracking-wider transition-colors cursor-pointer block mx-auto pt-1"
                >
                  ⚡ Skip Straight to GM Email Login & Roster →
                </button>
              </div>
            )}

            {/* Walking Progress Bar */}
            {cinematicStage === 'WALKING_FORWARD' && (
              <div className="w-full space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                  <span>EMERGING FROM TUNNEL...</span>
                  <span>{Math.round(walkProgress)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-75"
                    style={{ width: `${walkProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Listen for the crowd roar as the lights break over the diamond
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 4: ON-FIELD SIGN UP & EMAIL LOGIN PAGE (THE DIAMOND)     */}
      {/* ============================================================== */}
      {cinematicStage === 'ON_FIELD_SIGNUP' && (
        <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col liquid-glass-panel rounded-3xl border-2 border-amber-500/70 p-4 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] overflow-hidden animate-fade-in mx-3 my-auto">
          
          {/* Top Header Banner: Active Club & Walkout Replay */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20"
                style={{
                  backgroundColor: activeTheme.primaryColor || '#DF4601'
                }}
              >
                {activeTheme.logoIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    ON-FIELD GM REGISTRATION
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {activeTheme.ballpark}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide leading-tight">
                  SIGN UP & TAKE THE FIELD
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setCinematicStage('TUNNEL_DEPTH');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Replay stadium tunnel walkout animation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Walk Stadium Tunnel
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Slabs: Left = Email Credentials, Right = Team Selector */}
          <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 pr-1">
            
            {/* Left Column: GM Email Authentication Form */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                {/* Sign In vs Register Toggle */}
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      hobbyAudio.playCardShuffleFlick();
                      setErrorMessage(null);
                      setIsSigningUp(false);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      !isSigningUp 
                        ? 'bg-amber-500 text-slate-950 shadow font-black' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      hobbyAudio.playCardShuffleFlick();
                      setErrorMessage(null);
                      setIsSigningUp(true);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isSigningUp 
                        ? 'bg-amber-500 text-slate-950 shadow font-black' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register New GM
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] font-mono text-red-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Email Sign In Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-3 font-mono">
                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Mail className="w-3 h-3" /> GM Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@franchise.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  {isSigningUp && (
                    <div>
                      <label className="text-[10px] text-amber-300 font-bold block mb-1 uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3" /> GM Handle / Username
                      </label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. CamdenSlugger, IronMan_8"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  )}

                  {/* New GM Grant Callout */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] space-y-0.5">
                    <span className="text-amber-400 font-bold uppercase block">
                      🎁 NEW GM SIGNUP GRANT
                    </span>
                    <span className="text-slate-200 block">
                      1,500 Base + 1,000 Bonus = <strong className="text-amber-300 font-mono">2,500 Vending Tokens</strong>
                    </span>
                    <span className="text-emerald-400 block text-[9.5px]">
                      ✓ Rip a 750-Token Hobby Box immediately upon entry!
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>⚾ Authenticating GM...</span>
                    ) : isSigningUp ? (
                      <span>⚾ Create Account & Take The Field</span>
                    ) : (
                      <span>⚾ Sign In & Take The Field</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Bottom Quick Guest Alternative */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    hobbyAudio.playCardShuffleFlick();
                    setErrorMessage(null);
                    setIsSigningUp(!isSigningUp);
                  }}
                  className="text-amber-400 hover:text-white underline cursor-pointer"
                >
                  {isSigningUp ? 'Already a GM? Sign In' : 'Need an account? Register'}
                </button>
                <button
                  type="button"
                  onClick={handleGuestQuickEnter}
                  className="text-slate-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Direct Guest Play →
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Franchise Selector */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-amber-400">
                    SELECT YOUR HOME FRANCHISE
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Selected Club: <strong className="text-white">{selectedTeamName}</strong> ({activeTheme.ballpark})
                  </p>
                </div>

                {/* League Filter Navigation Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[10px] font-display font-bold uppercase">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setLeagueFilter('ALL');
                    }}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      leagueFilter === 'ALL'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All MLB
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setLeagueFilter('AL');
                    }}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      leagueFilter === 'AL'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setLeagueFilter('NL');
                    }}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      leagueFilter === 'NL'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    NL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setLeagueFilter('NEGRO_LEAGUES');
                    }}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      leagueFilter === 'NEGRO_LEAGUES'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Negro Leagues
                  </button>
                </div>
              </div>

              {/* Scrollable Teams Grid */}
              <div className="overflow-y-auto max-h-[360px] pr-1 space-y-2">
                {leagueFilter === 'NEGRO_LEAGUES' ? (
                  <div
                    onClick={() => handleSelectTeam('Negro League Legends')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedTeamName === 'Negro League Legends'
                        ? 'bg-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'bg-slate-950/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                        👑
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">
                            HISTORIC ERA
                          </span>
                          {selectedTeamName === 'Negro League Legends' && (
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <h4 className="text-xs font-display font-black text-white uppercase">
                          Negro League Legends
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          Satchel Paige, Josh Gibson, Cool Papa Bell, Buck Leonard
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredTeams.map((team) => {
                      const isSelected = selectedTeamName === team.name;

                      return (
                        <div
                          key={team.id}
                          onClick={() => handleSelectTeam(team.name)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-[1.01]'
                              : 'bg-slate-950/70 border-white/10 hover:border-white/30 hover:bg-slate-900/90'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow shrink-0"
                              style={{ backgroundColor: `${team.primaryColor}30`, borderColor: team.primaryColor }}
                            >
                              {team.logoIcon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">
                                  {team.league} {team.division}
                                </span>
                                {isSelected && (
                                  <Check className="w-3 h-3 text-amber-400 shrink-0" />
                                )}
                              </div>
                              <h4 className="text-xs font-display font-bold text-white uppercase tracking-tight truncate">
                                {team.name}
                              </h4>
                              <span className="text-[9px] font-mono text-slate-400 block truncate">
                                {team.ballpark}
                              </span>
                            </div>
                          </div>

                          <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-300 border border-white/5 shrink-0">
                            26-Man
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
