// src/components/OnboardingSplashModal.tsx
import React, { useState } from 'react';
import { authService, UserAccountProfile } from '../services/authService';
import { REWARD_CONFIG } from '../config/rewardsConfig';
import { MLB_TEAMS, MLBTeamInfo } from '../data/mlbTeams';
import { ActiveTeamTheme, teamThemeService } from '../services/teamThemeService';

interface OnboardingSplashModalProps {
  isOpen: boolean;
  onComplete: (profile: UserAccountProfile, bonusTokens: number, startingCredits: number, selectedMode: string) => void;
}

type OnboardingStage = 'SIGN_UP' | 'TUTORIAL' | 'MODE_SELECT';

export const OnboardingSplashModal: React.FC<OnboardingSplashModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [stage, setStage] = useState<OnboardingStage>('SIGN_UP');
  const [authMethod, setAuthMethod] = useState<'GOOGLE' | 'APPLE' | 'EMAIL'>('GOOGLE');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Baltimore Orioles');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const TUTORIAL_STEPS = [
    {
      title: '🪓 1. THE BALTIMORE CHOP BOUNCE MECHANIC',
      description: 'Strike down on top of the ball in the lower strike quadrant. The ball strikes the hard dirt plate and vaults 30+ feet into the air, allowing speedy runners to score before the third baseman can charge!',
      badge: 'SIGNATURE HIT',
      tip: 'Look for low sinkers and splitters for maximum bounce velocity.'
    },
    {
      title: '📋 2. 26-MAN ACTIVE ROSTER & TOP 25 WAR LEGENDS',
      description: 'Assemble your authentic franchise roster. Station position aces from All-Star legends to modern breakout stars. Nicknames and fielding positions dictate tactical advantages on the diamond.',
      badge: 'ROSTER MANAGEMENT',
      tip: 'Every player features authentic Baseball-Reference career monikers and attributes.'
    },
    {
      title: '📦 3. HOBBY PACK RIPPING & REFRACTOR PARALLELS',
      description: 'Visit the Hobby Outpost to unseal Foil Packs, Blasters, and Hobby Boxes. Chase serial-stamped refractors (#/150 Mojo, #/75 Sapphire, #/25 Gold Wave, and true 1/1 SuperFractors)!',
      badge: 'COLLECTING & SLABBING',
      tip: 'All accounts start with plenty of tokens to rip a full Hobby Box immediately.'
    },
    {
      title: '⚔️ 4. 52-SERIES SIMULATION & HIGH-LEVERAGE CRISIS',
      description: 'Compete in high-stakes 9th-inning crises or simulate a 52-series regular season run. Manager tactical cards and clutch multipliers power your postseason pennant push.',
      badge: 'CHAMPIONSHIP CHASE',
      tip: 'Earn vending tokens on every series victory and share with friends for unlimited token rewards.'
    }
  ];

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    let bonusTokens = REWARD_CONFIG.EMAIL_SIGNUP_BONUS_TOKENS;
    let providerName = 'password';

    if (authMethod === 'GOOGLE') {
      bonusTokens = REWARD_CONFIG.GOOGLE_SIGNUP_BONUS_TOKENS;
      providerName = 'google.com';
    } else if (authMethod === 'APPLE') {
      bonusTokens = REWARD_CONFIG.APPLE_SIGNUP_BONUS_TOKENS;
      providerName = 'apple.com';
    }

    const cleanUsername = username.trim() || `GM_${Math.floor(1000 + Math.random() * 9000)}`;

    const newProfile: UserAccountProfile = {
      uid: `gm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: email.trim() || `${cleanUsername.toLowerCase()}@thebaltimorechop.app`,
      displayName: cleanUsername,
      username: cleanUsername,
      photoURL: null,
      isAnonymous: authMethod === 'EMAIL',
      linkedProviders: [providerName],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    // Save profile locally
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(newProfile));
      // Update team theme
      const team = MLB_TEAMS.find((t: MLBTeamInfo) => t.name === selectedTeam);
      if (team) {
        teamThemeService.setFavoriteTeam(team.name);
      }
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    // Proceed to skippable tutorial
    setStage('TUTORIAL');
  };

  const handleSelectGameMode = (mode: string) => {
    let bonusTokens = REWARD_CONFIG.EMAIL_SIGNUP_BONUS_TOKENS;
    if (authMethod === 'GOOGLE') bonusTokens = REWARD_CONFIG.GOOGLE_SIGNUP_BONUS_TOKENS;
    if (authMethod === 'APPLE') bonusTokens = REWARD_CONFIG.APPLE_SIGNUP_BONUS_TOKENS;

    const profile = authService.getProfile() || {
      uid: `gm_${Date.now()}`,
      email: email.trim() || 'manager@thebaltimorechop.app',
      displayName: username.trim() || 'Baltimore GM',
      username: username.trim() || 'ChopMaster',
      photoURL: null,
      isAnonymous: false,
      linkedProviders: [authMethod === 'GOOGLE' ? 'google.com' : authMethod === 'APPLE' ? 'apple.com' : 'password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    onComplete(profile, bonusTokens, REWARD_CONFIG.STARTER_BASE_CREDITS, mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl font-sans select-none animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* ================= STAGE 1: WELCOME & SIGN UP ================= */}
        {stage === 'SIGN_UP' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-5">
            {/* Logo & App Icon Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-amber-300 text-3xl">
                🪓
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                THE BALTIMORE CHOP™
              </h1>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Official Baseball Card Collecting, 26-Man Lineup Strategy & High-Bounce Simulation Engine
              </p>
            </div>

            {/* Auth Provider Selector with Bonus Badges */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Step 1: Choose Account Authentication
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => setAuthMethod('GOOGLE')}
                  className={`p-3 rounded-2xl border transition-all text-left relative ${
                    authMethod === 'GOOGLE'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2 right-2 text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                    +{REWARD_CONFIG.GOOGLE_SIGNUP_BONUS_TOKENS} TOKENS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌐</span>
                    <div>
                      <div className="text-xs font-bold">Google ID</div>
                      <div className="text-[9px] text-slate-400">1-Tap Fast Link</div>
                    </div>
                  </div>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => setAuthMethod('APPLE')}
                  className={`p-3 rounded-2xl border transition-all text-left relative ${
                    authMethod === 'APPLE'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2 right-2 text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                    +{REWARD_CONFIG.APPLE_SIGNUP_BONUS_TOKENS} TOKENS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍎</span>
                    <div>
                      <div className="text-xs font-bold">Apple ID</div>
                      <div className="text-[9px] text-slate-400">iCloud Sync</div>
                    </div>
                  </div>
                </button>

                {/* Email Button */}
                <button
                  type="button"
                  onClick={() => setAuthMethod('EMAIL')}
                  className={`p-3 rounded-2xl border transition-all text-left relative ${
                    authMethod === 'EMAIL'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2 right-2 text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-bold">
                    +{REWARD_CONFIG.EMAIL_SIGNUP_BONUS_TOKENS} TOKENS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉️</span>
                    <div>
                      <div className="text-xs font-bold">Email / Guest</div>
                      <div className="text-[9px] text-slate-400">Standard Login</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Starter Bonus Callout */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase block">
                  NEW GM SIGNUP GRANT
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {REWARD_CONFIG.STARTER_BASE_TOKENS} Base + {authMethod === 'GOOGLE' || authMethod === 'APPLE' ? '1,000' : '500'} Bonus = <span className="text-amber-400 font-black font-mono">{(REWARD_CONFIG.STARTER_BASE_TOKENS + (authMethod === 'GOOGLE' || authMethod === 'APPLE' ? 1000 : 500)).toLocaleString()} TOKENS</span>
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  ✓ Enough to rip a 750-Token Hobby Box right away!
                </span>
              </div>
              <span className="text-3xl">📦</span>
            </div>

            {/* Inputs: Username & Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  GM Handle / Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. CamdenSlugger, IronMan_8"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Primary Franchise Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {MLB_TEAMS.map((t: MLBTeamInfo) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>⚾</span>
              <span>{isSubmitting ? 'Registering Franchise...' : 'Claim Welcome Pack & Begin'}</span>
            </button>
          </form>
        )}

        {/* ================= STAGE 2: SKIPPABLE TUTORIAL ================= */}
        {stage === 'TUTORIAL' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  STEP {tutorialStep + 1} OF {TUTORIAL_STEPS.length}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">
                  FRANCHISE SCOUTING TUTORIAL
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStage('MODE_SELECT')}
                className="text-xs font-bold text-amber-400 hover:underline p-1 cursor-pointer"
              >
                Skip Tutorial ➔
              </button>
            </div>

            {/* Tutorial Card Content */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {TUTORIAL_STEPS[tutorialStep].badge}
                </span>
                <span className="text-xl">⚾</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-amber-400">
                {TUTORIAL_STEPS[tutorialStep].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {TUTORIAL_STEPS[tutorialStep].description}
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
                💡 <span className="font-bold">PRO SCOUT TIP:</span> {TUTORIAL_STEPS[tutorialStep].tip}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                disabled={tutorialStep === 0}
                onClick={() => setTutorialStep((prev) => Math.max(0, prev - 1))}
                className="bg-slate-800 hover:bg-slate-750 disabled:opacity-30 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                ← Previous
              </button>

              <div className="flex gap-1.5">
                {TUTORIAL_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === tutorialStep ? 'bg-amber-400 scale-125' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setTutorialStep((prev) => prev + 1)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  Next Step ➔
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStage('MODE_SELECT')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer animate-pulse"
                >
                  Choose Mode ➔
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= STAGE 3: SELECT STARTING GAME MODE ================= */}
        {stage === 'MODE_SELECT' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-3xl">🏟️</span>
              <h2 className="text-xl font-black text-amber-400 tracking-wide">
                SELECT A MODE TO START PLAYING
              </h2>
              <p className="text-xs text-slate-400">
                You can play one of each at a time, then freely explore draft boards, card binders, and pack ripping!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                {
                  id: 'ARENA',
                  name: 'At-Bat Arena: 9th-Inning Crisis',
                  desc: 'High-leverage showdown! Runners on the corners, 1 out. Guess the pitch and hit the signature Baltimore Chop bounce!',
                  icon: '⚔️',
                  highlight: 'RECOMMENDED FIRST',
                },
                {
                  id: 'HOBBY_OUTPOST',
                  name: 'Hobby Outpost: Rip Sealed Boxes',
                  desc: 'Use your starter grant to rip a 750-Token Hobby Box or 350-Token Blaster. Chase serial 1/1 SuperFractors.',
                  icon: '📦',
                  highlight: 'START WITH TOKENS',
                },
                {
                  id: 'GM_CONSOLE',
                  name: 'Franchise 52-Series Season',
                  desc: 'Simulate series against the AL & NL, inspect post-mortem recaps, and unlock playoff eligibility.',
                  icon: '🏛️',
                  highlight: 'SIMULATION',
                },
                {
                  id: 'DEPTH_CHART',
                  name: '26-Man Lineup & Depth Chart',
                  desc: 'Review your starting 9, bullpen, bench, and authentic Baseball-Reference player nicknames.',
                  icon: '📋',
                  highlight: 'MANAGEMENT',
                },
              ].map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => handleSelectGameMode(mode.id)}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between group shadow-lg hover:scale-[1.02]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-2xl">{mode.icon}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                        {mode.highlight}
                      </span>
                    </div>
                    <h3 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                      {mode.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {mode.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Launch Mode</span>
                    <span>➔</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-slate-500 font-mono">
                You can switch modes anytime via the floating dock navigator or the new top Control Center.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
