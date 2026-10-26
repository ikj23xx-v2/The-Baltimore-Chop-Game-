/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlayerCard, 
  PitchType, 
  StrikeZone, 
  SpecialSkill, 
  PitchDelivery, 
  PlayByPlayEntry, 
  TaskRequirement, 
  NonPlayerCard,
  CardSetId 
} from './types/game';
import { ALL_PLAYERS, INITIAL_ROSTER, BASE_ACTIVE_PLAYERS, TOP_25_WAR_LEGENDS, NEGRO_LEAGUE_LEGENDS } from './data/players';
import { INITIAL_EQUIPMENT_CARDS, INITIAL_TASKS } from './data/equipment';
import { CARD_SETS } from './data/sets';
import { AtBatEngine } from './game/atBatEngine';
import { soundManager } from './services/audio';
import { triggerHapticFeedback } from './services/haptics';

// Analytics & Sabermetrics Engine
import { 
  calculateLeverageIndex, 
  computeChopIndexScore, 
  LINEAR_WEIGHT_POINTS 
} from './data/chopExtremeAnalytics';

// Components
import { Scoreboard } from './components/Scoreboard';
import { Card3D } from './components/Card3D';
import { AtBatArena } from './components/AtBatArena';
import { JackpotDraftModal } from './components/JackpotDraftModal';
import { VendingMachineModal } from './components/VendingMachineModal';
import { RefractorForgeModal } from './components/RefractorForgeModal';
import { RosterManagerModal } from './components/RosterManagerModal';
import { FranchiseSeasonModal } from './components/FranchiseSeasonModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { SeasonalSetsModal } from './components/SeasonalSetsModal';
import { DraftBoardGrid } from './components/DraftBoardGrid';
import { PWAInstallButton } from './components/PWAInstallButton';
import { PackRippingModal } from './components/PackRippingModal';
import { AdminOperationsModal } from './components/AdminOperationsModal';
import { StadiumTunnelEntrance } from './components/StadiumTunnelEntrance';
import { teamThemeService, ActiveTeamTheme } from './services/teamThemeService';
import { getRosterForTeam } from './data/players';
import { LoginStreakModal } from './components/LoginStreakModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { CardAlmanacModal } from './components/CardAlmanacModal';
import { FirstEnterPortalModal } from './components/FirstEnterPortalModal';
import { ChopExtremeHubModal } from './components/ChopExtremeHubModal';
import { CardStatsDetailModal } from './components/CardStatsDetailModal';
import { recordDailyLogin, getSevenDayStreakStatus } from './utils/loginStreak';
import { authService, UserAccountProfile } from './services/authService';

export default function App() {
  // --- NAVIGATION VIEW TABS ---
  const [mainTab, setMainTab] = useState<'ARENA' | 'DRAFT_BOARD' | 'SETS' | 'EXTREME'>('ARENA');

  // --- ROSTER & PLAYERS ---
  const [roster, setRoster] = useState<PlayerCard[]>(INITIAL_ROSTER);
  const [activeBatterIndex, setActiveBatterIndex] = useState(0);
  const activeBatter = roster[activeBatterIndex] || roster[0];
  const [opposingPitcher, setOpposingPitcher] = useState<PlayerCard>(ALL_PLAYERS[4]); // Jim Palmer / Opponent Ace

  // --- AT-BAT INTERACTIVE INPUTS ---
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType>('4-SEAM');
  const [selectedZone, setSelectedZone] = useState<StrikeZone>('MIDDLE');
  const [activeSkill, setActiveSkill] = useState<SpecialSkill | undefined>('BALTIMORE_CHOP');
  const [isPitching, setIsPitching] = useState(false);
  const [pitchSequence, setPitchSequence] = useState<PitchDelivery[]>([]);

  // --- SCOREBOARD & BASES ---
  const [homeScore, setHomeScore] = useState(4);
  const [awayScore, setAwayScore] = useState(3);
  const [inning, setInning] = useState(9);
  const [halfInning, setHalfInning] = useState<'TOP' | 'BOTTOM'>('BOTTOM');
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(1);
  const [baseRunners, setBaseRunners] = useState<[boolean, boolean, boolean]>([true, false, true]);

  // --- ECONOMY & INVENTORY ---
  const [franchisePoints, setFranchisePoints] = useState(1850);
  const [vendingTokens, setVendingTokens] = useState(5);
  const [streakCount, setStreakCount] = useState(3);
  const [inventory, setInventory] = useState<NonPlayerCard[]>(INITIAL_EQUIPMENT_CARDS);
  const [tasks, setTasks] = useState<TaskRequirement[]>(INITIAL_TASKS);
  const [activeSetId, setActiveSetId] = useState<CardSetId>('SERIES_1');

  // --- 5-IN-7 LOGIN STREAK ---
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [streakStatus, setStreakStatus] = useState(() => getSevenDayStreakStatus());

  // --- USER PROFILE & SOCIAL ACCOUNT MODAL ---
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserAccountProfile | null>(() => authService.getProfile());

  // --- BROADCAST & SIMULATION ---
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayEntry[]>([
    {
      id: 'init-1',
      text: '🏟️ 9th Inning Crisis: Runners on the corners, 1 out in the bottom of the 9th! High Leverage Index active (2.5x Multiplier).',
      type: 'info',
      timestamp: Date.now()
    }
  ]);
  const [seasonRecord, setSeasonRecord] = useState<{ wins: number; losses: number; gamesPlayed: number; mode: '162_SEASON' | 'MINI_SERIES' }>({ wins: 54, losses: 38, gamesPlayed: 92, mode: '162_SEASON' });
  const [teamArchetype, setTeamArchetype] = useState<'SPEED_CONTACT' | 'BALTIMORE_SLUGGER' | 'IRON_DEFENSE'>('BALTIMORE_SLUGGER');
  const [isMuted, setIsMuted] = useState(false);

  // --- MODAL CONTROLS ---
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [isVendingOpen, setIsVendingOpen] = useState(false);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isFranchiseOpen, setIsFranchiseOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSetsOpen, setIsSetsOpen] = useState(false);
  const [isPackRipOpen, setIsPackRipOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isChopExtremeOpen, setIsChopExtremeOpen] = useState(false);
  const [inspectedCardForStats, setInspectedCardForStats] = useState<PlayerCard | null>(null);

  // --- ACTIVE THEME STATE (Dynamic Team Styling) ---
  const [currentTeamTheme, setCurrentTeamTheme] = useState<ActiveTeamTheme>(() => teamThemeService.getActiveTheme());

  // Subscribe to team theme updates
  React.useEffect(() => {
    return teamThemeService.subscribe((newTheme) => {
      setCurrentTeamTheme(newTheme);
    });
  }, []);

  // Subscribe to auth updates
  React.useEffect(() => {
    return authService.subscribe((profile) => {
      setUserProfile(profile);
    });
  }, []);

  // Handle franchise team selection
  const handleTeamSelected = (teamTheme: ActiveTeamTheme) => {
    teamThemeService.setActiveTheme(teamTheme);
    setCurrentTeamTheme(teamTheme);

    const teamRoster = getRosterForTeam(teamTheme.name);
    setRoster(teamRoster);
    setActiveBatterIndex(0);

    const aces = ALL_PLAYERS.filter(p => p.team !== teamTheme.name && (p.position === 'SP' || p.position === 'RP'));
    if (aces.length > 0) {
      setOpposingPitcher(aces[Math.floor(Math.random() * aces.length)]);
    }

    setIsSplashOpen(false);
    addLog(`🏟️ Walked out of the stadium tunnel into ${teamTheme.ballpark}! You are managing the ${teamTheme.name}!`, 'chop');
    soundManager.playBatCrack(true);
  };

  // Record daily login on launch
  React.useEffect(() => {
    const res = recordDailyLogin();
    setStreakStatus(getSevenDayStreakStatus());
    if (res.isNewDay) {
      addLog(`📅 Daily Login recorded! Keep your 5-in-7 streak alive!`, 'info');
    }
  }, []);

  // Listen for hidden Ops shortcut (Ctrl+Shift+O or Cmd+Shift+O) or URL hash #ops
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsOperationsOpen(true);
        soundManager.playButtonClick();
      }
    };
    const handleHash = () => {
      if (window.location.hash === '#ops') {
        setIsOperationsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    if (typeof window !== 'undefined' && window.location.hash === '#ops') {
      setIsOperationsOpen(true);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Claim streak bonus
  const handleClaimStreakReward = (reward: { points: number; tokens: number; packReward: boolean }) => {
    setFranchisePoints((pts) => pts + reward.points);
    setVendingTokens((tok) => tok + reward.tokens);
    setStreakStatus(getSevenDayStreakStatus());
    setIsStreakOpen(false);
    addLog(`🔥 STREAK MILESTONE CLAIMED: +${reward.points} Points & +${reward.tokens} Tokens! Opening Foil Pack!`, 'chop');
    setIsPackRipOpen(true);
  };

  // Helper to add broadcast entry
  const addLog = (text: string, type: 'chop' | 'hit' | 'out' | 'info' | 'homerun') => {
    setPlayByPlay((prev) => [
      { id: `log-${Date.now()}-${Math.random()}`, text, type, timestamp: Date.now() },
      ...prev.slice(0, 30)
    ]);
  };

  // Update tasks
  const updateTask = (category: TaskRequirement['category'], countDelta = 1) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.category === category && !t.completed) {
          const next = t.currentCount + countDelta;
          if (next >= t.targetCount) {
            setVendingTokens((tok) => tok + t.rewardTokens);
            addLog(`🎖️ CHALLENGE COMPLETED: "${t.name}"! +🪙 ${t.rewardTokens} Vending Tokens awarded!`, 'chop');
            return { ...t, currentCount: next, completed: true };
          }
          return { ...t, currentCount: next };
        }
        return t;
      })
    );
  };

  // Sound toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // --- RESOLVE AT-BAT SHOWDOWN WITH RE24 & LEVERAGE SCORING ---
  const handleSwing = () => {
    if (isPitching) return;
    setIsPitching(true);

    // 1. Generate pitcher delivery
    const pitch = AtBatEngine.generatePitch(opposingPitcher);
    setPitchSequence((prev) => [pitch, ...prev.slice(0, 2)]);

    // Equipment Buffs
    const buffs = inventory
      .filter((i) => i.equipped)
      .reduce(
        (acc, item) => ({
          contactBonus: (acc.contactBonus || 0) + (item.buffStats.contactBonus || 0),
          powerBonus: (acc.powerBonus || 0) + (item.buffStats.powerBonus || 0),
          chopBounceBonus: (acc.chopBounceBonus || 0) + (item.buffStats.chopBounceBonus || 0),
          pitchHintAccuracy: (acc.pitchHintAccuracy || 0) + (item.buffStats.pitchHintAccuracy || 0)
        }),
        { contactBonus: 0, powerBonus: 0, chopBounceBonus: 0, pitchHintAccuracy: 0 }
      );

    // 2. Resolve showdown
    const res = AtBatEngine.resolvePitch(
      pitch,
      { guessType: selectedPitchType, guessZone: selectedZone, specialSkill: activeSkill },
      activeBatter,
      opposingPitcher,
      buffs,
      streakCount
    );

    // 3. Audio & Haptics
    triggerHapticFeedback(res.hapticPattern);
    if (res.isBaltimoreChop) {
      soundManager.playBaltimoreChop();
      updateTask('CHOP', 1);
    } else if (res.outcome === 'HOME_RUN') {
      soundManager.playBatCrack(true);
      soundManager.playOrganCharge();
      updateTask('HOMERUN', 1);
    } else if (res.outcome === 'DOUBLE' || res.outcome === 'SINGLE' || res.outcome === 'TRIPLE') {
      soundManager.playBatCrack(true);
    } else if (res.outcome === 'STRIKEOUT') {
      soundManager.playUmpireCall(true);
      updateTask('STRIKEOUT', 1);
    } else {
      soundManager.playBatCrack(false);
    }

    // 4. Calculate Situational Leverage & RE24 Linear Weights Points
    const leverage = calculateLeverageIndex(inning, homeScore - awayScore, { first: baseRunners[0], second: baseRunners[1], third: baseRunners[2] }, outs);
    const eventType = 
      res.outcome === 'HOME_RUN' ? 'HOME_RUN' :
      res.outcome === 'TRIPLE' ? 'TRIPLE' :
      res.outcome === 'DOUBLE' ? 'DOUBLE' :
      (res.outcome === 'SINGLE' || res.isBaltimoreChop) ? 'SINGLE' :
      res.outcome === 'WALK' ? 'WALK' :
      res.outcome === 'STRIKEOUT' ? 'STRIKEOUT' : 'OUT';

    const isBarrel = (res.hitData?.exitVelocity || 80) >= 98;
    const chopScore = computeChopIndexScore(eventType, leverage, { barrelContact: isBarrel });

    // 5. Update Game State
    setTimeout(() => {
      setIsPitching(false);

      if (res.isBaltimoreChop) {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 1);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) {
          setHomeScore((s) => s + runnerRes.runsScored);
        }
        setFranchisePoints((pts) => pts + Math.max(15, chopScore.totalChopIndex));
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(`⚡ BALTIMORE CHOP! [RE24 +${chopScore.totalChopIndex} pts · LI ${leverage.leverageIndex}x] ${res.description}`, 'chop');
      } else if (res.outcome === 'HOME_RUN') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 4);
        setBaseRunners(runnerRes.nextRunners);
        setHomeScore((s) => s + runnerRes.runsScored);
        setFranchisePoints((pts) => pts + Math.max(100, chopScore.totalChopIndex));
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(`🚀 NO-DOUBTER HOME RUN! [RE24 +${chopScore.totalChopIndex} pts · ${leverage.tier} LEVERAGE ${leverage.multiplier}x] ${res.description}`, 'homerun');
      } else if (res.outcome === 'DOUBLE') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 2);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) setHomeScore((s) => s + runnerRes.runsScored);
        setFranchisePoints((pts) => pts + Math.max(30, chopScore.totalChopIndex));
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(`💥 GAPPAGE DOUBLE! [RE24 +${chopScore.totalChopIndex} pts] ${res.description}`, 'hit');
      } else if (res.outcome === 'SINGLE') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 1);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) setHomeScore((s) => s + runnerRes.runsScored);
        setFranchisePoints((pts) => pts + Math.max(20, chopScore.totalChopIndex));
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(`⚾ BASE HIT! [RE24 +${chopScore.totalChopIndex} pts] ${res.description}`, 'hit');
      } else if (res.outcome === 'GROUNDOUT' || res.outcome === 'FLYOUT') {
        recordOut(`${res.description} [RE24 -27 pts]`);
      } else {
        const nextStrikes = strikes + 1;
        if (nextStrikes >= 3) {
          recordOut(`Whiff on ${pitch.velocity} mph ${pitch.type}. Strike 3! [RE24 -30 pts]`);
        } else {
          setStrikes(nextStrikes);
          addLog(`Count moves to ${balls}-${nextStrikes} on a ${pitch.velocity} mph ${pitch.type}.`, 'out');
        }
      }
    }, 600);
  };

  const recordOut = (desc: string) => {
    const nextOuts = outs + 1;
    if (nextOuts >= 3) {
      setOuts(0);
      resetCount();
      setStreakCount(0);
      if (halfInning === 'TOP') {
        setHalfInning('BOTTOM');
        addLog(`3 Outs recorded. Side retired. Bottom of Inning ${inning} underway!`, 'out');
      } else {
        setHalfInning('TOP');
        setInning((i) => i + 1);
        addLog(`3 Outs recorded. Moving into Inning ${inning + 1}!`, 'out');
      }
    } else {
      setOuts(nextOuts);
      resetCount();
      addLog(desc, 'out');
    }
  };

  const resetCount = () => {
    setBalls(0);
    setStrikes(0);
  };

  // Franchise simulation
  const handleSimulateGames = (count: number) => {
    const teamContactAvg = roster.reduce((acc, p) => acc + p.stats.contact, 0) / roster.length;
    const teamWarAvg = roster.reduce((acc, p) => acc + p.bRefWar, 0) / roster.length;
    
    let wins = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100 + (teamWarAvg > 5 ? 15 : 5) + (teamContactAvg > 80 ? 10 : 0);
      if (roll > 50) wins++;
    }
    const losses = count - wins;
    const pts = wins * 65;

    setSeasonRecord((prev) => ({
      ...prev,
      wins: prev.wins + wins,
      losses: prev.losses + losses,
      gamesPlayed: prev.gamesPlayed + count
    }));
    setFranchisePoints((p) => p + pts);

    if (wins >= count * 0.6) {
      updateTask('SEASON', 1);
    }

    return { winsAdded: wins, pointsEarned: pts };
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center pb-24 selection:bg-orange-600 selection:text-white">
      
      {/* ================= 1. CLEAN OPAQUE SOLID TOP HEADER ================= */}
      <header className="w-full bg-[#0a0f18] border-b border-white/10 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Brand (With Reliable Fallback) */}
          <div 
            onClick={() => {
              soundManager.playButtonClick();
              setIsPortalOpen(true);
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer group"
            title="Click to open Knowledge Base & Season Card Collection"
          >
            <img
              src="/chop-logo.jpeg"
              alt="The Baltimore Chop"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border-2 border-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.5)] group-hover:scale-105 transition-transform shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/icon.svg';
              }}
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-display font-black tracking-wider text-orange-500 uppercase block leading-none">
                  THE BALTIMORE CHOP
                </span>
                <span className="text-[10px] font-display font-black text-amber-400 -mt-2">
                  ™
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-amber-400/90 font-bold uppercase">
                MLB TRADING CARD SHOWDOWN
              </span>
            </div>
          </div>

          {/* Active Franchise & Stadium Tunnel Walkout Selector */}
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setIsSplashOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-md hover:scale-105 active:scale-95 group shrink-0"
            style={{
              backgroundColor: `${currentTeamTheme.primaryColor}25`,
              borderColor: `${currentTeamTheme.primaryColor}80`
            }}
            title="Click to Walk Out of the Stadium Tunnel & Change Your Favorite Team"
          >
            <div
              className="w-4 h-4 rounded-full border border-white/80 shrink-0 shadow flex items-center justify-center text-[8px]"
              style={{ backgroundColor: currentTeamTheme.primaryColor }}
            >
              ⚾
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-mono font-black text-amber-400 uppercase tracking-widest leading-none">
                  {currentTeamTheme.league === 'NEGRO_LEAGUES' ? 'NEGRO LEAGUES' : `${currentTeamTheme.league} · ${currentTeamTheme.division || 'MLB'}`}
                </span>
                <span className="text-[7px] text-slate-400 group-hover:text-amber-300">▼ TUNNEL</span>
              </div>
              <span className="text-xs font-display font-black text-white uppercase tracking-wider block leading-tight group-hover:text-amber-300">
                {currentTeamTheme.name}
              </span>
            </div>
          </button>

          {/* Right Header Action Pills (Streamlined & Collision-Free) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PWA Install */}
            <PWAInstallButton />

            {/* Login Streak */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setStreakStatus(getSevenDayStreakStatus());
                setIsStreakOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
              title="5-in-7 Days Login Streak Tracker & Rewards"
            >
              <span className="text-amber-400">🔥</span>
              <span>{streakStatus.activeDaysCount}/5 <span className="hidden md:inline">Streak</span></span>
            </button>

            {/* Quick Rip Pack */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsPackRipOpen(true);
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 whitespace-nowrap"
              title="Hobby Collect Foil Pack Rip"
            >
              <span>⚡</span> <span className="hidden sm:inline">Rip</span> Pack
            </button>

            {/* Cards Checklist */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsAlmanacOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-display font-bold uppercase transition-all flex items-center gap-1 whitespace-nowrap"
              title="Verify All 30 Teams, Players & Sets"
            >
              <span>🗂️</span> <span className="hidden md:inline">Cards</span> Checklist
            </button>

            {/* Chop Extreme Hub Shortcut */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsChopExtremeOpen(true);
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 shadow-md whitespace-nowrap"
              title="Chop Extreme: The 4 Pillars & Sabermetric Mode"
            >
              <span>⚡</span> <span className="hidden sm:inline">Chop</span> Extreme
            </button>

            {/* Knowledge Base Portal Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsPortalOpen(true);
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-display font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 rounded-xl transition-all whitespace-nowrap shrink-0 shadow flex items-center gap-1"
              title="Knowledge Base & Season Card Collection"
            >
              <span>📚</span> <span className="hidden md:inline">Knowledge</span> Base
            </button>

            {/* User Profile */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsAccountModalOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
              title="User Account Handle"
            >
              <span className="text-orange-400">👤</span>
              <span className="text-[11px] truncate max-w-[65px] sm:max-w-[100px]">
                @{userProfile?.username || 'Player'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ================= 2. DEDICATED SUB-NAVIGATION BAR (ZERO SQUISHING) ================= */}
      <nav className="w-full bg-[#0c1320] border-b border-white/10 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none z-30">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setMainTab('ARENA');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                mainTab === 'ARENA' ? 'glass-pill-active' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🏟️</span> Showdown Arena
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setMainTab('DRAFT_BOARD');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                mainTab === 'DRAFT_BOARD' ? 'glass-pill-active' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📋</span> Stick-To-The-Board Grid
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setMainTab('SETS');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                mainTab === 'SETS' ? 'glass-pill-active' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎴</span> Seasonal Sets (8)
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsChopExtremeOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-500/30"
            >
              <span>🔥</span> The 4 Pillars of Chop Extreme
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span>Points: <strong className="text-amber-400">{franchisePoints.toLocaleString()}</strong></span>
            <span>·</span>
            <span>Tokens: <strong className="text-emerald-400">{vendingTokens}</strong></span>
          </div>

        </div>
      </nav>

      {/* ================= 3. MAIN DASHBOARD CONTENT ================= */}
      <main className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pt-4">
        
        {/* Ballpark Scoreboard (Cleanly Separated Below Header) */}
        <Scoreboard
          homeScore={homeScore}
          awayScore={awayScore}
          inning={inning}
          halfInning={halfInning}
          balls={balls}
          strikes={strikes}
          outs={outs}
          baseRunners={baseRunners}
          franchisePoints={franchisePoints}
          vendingTokens={vendingTokens}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          gameModeLabel={
            mainTab === 'ARENA'
              ? `At-Bat Showdown · ${currentTeamTheme.ballpark}`
              : mainTab === 'DRAFT_BOARD'
              ? `Stick-To-The-Board Matrix · 26-Man ${currentTeamTheme.name} Depth Chart`
              : 'Seasonal Sets Vault · 8 Authentic Collector Series Sets'
          }
        />

        {/* VIEW 1: ARENA SHOWDOWN */}
        {mainTab === 'ARENA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 3D Inspectable Card Stage with 360° Drag & Click-to-Inspect */}
            <div className="lg:col-span-4 flex flex-col items-center liquid-glass-panel rounded-3xl p-5 shadow-2xl">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-orange-400">
                    Active Card · 360° Interactive Stage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedCardForStats(activeBatter)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                >
                  Inspect Stats & Rank 📊
                </button>
              </div>

              {/* Quick 8-Set Border Selector Bar */}
              <div className="w-full mb-3 bg-slate-950/80 border border-white/10 rounded-2xl p-2.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                  <span>Authentic Set Border:</span>
                  <span className="text-orange-400 font-bold">
                    {CARD_SETS.find((s) => s.id === activeSetId)?.name || 'Series 1'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {CARD_SETS.map((set) => {
                    const isSelected = activeSetId === set.id;
                    return (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => {
                          soundManager.playButtonClick();
                          setActiveSetId(set.id);
                        }}
                        className={`text-[9.5px] py-1 px-1 rounded-lg font-display font-bold uppercase truncate transition-all text-center border ${
                          isSelected
                            ? 'glass-pill-active shadow-md'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                        title={`${set.name}: ${set.borderTheme}`}
                      >
                        {set.id === 'ALLEN_GINTER'
                          ? 'Tobacco'
                          : set.id === 'STADIUM_CLUB'
                          ? 'Club'
                          : set.id === 'UPDATE_SERIES'
                          ? 'Update'
                          : set.name.replace('CHOP ', '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The 3D Tactile Card (Full 360° Drag & Orbit enabled) */}
              <Card3D
                card={activeBatter}
                interactive={true}
                overrideSetId={activeSetId}
                onInspect={() => setInspectedCardForStats(activeBatter)}
              />

              <div className="w-full mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsRosterOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📋</span> 26-Man Lineup
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedCardForStats(activeBatter)}
                  className="flex-1 py-2 px-3 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-white font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span>📊</span> Stats & Rank
                </button>
              </div>
            </div>

            {/* Right Column: Strike Zone Arena & Counter Matchup */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              <AtBatArena
                currentBatter={activeBatter}
                currentPitcher={opposingPitcher}
                selectedPitchType={selectedPitchType}
                onSelectPitchType={setSelectedPitchType}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                activeSkill={activeSkill}
                onSelectSkill={setActiveSkill}
                onSwing={handleSwing}
                isPitching={isPitching}
                pitchSequence={pitchSequence}
                streakCount={streakCount}
                playByPlay={playByPlay}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: STICK-TO-THE-BOARD DEPTH CHART */}
        {mainTab === 'DRAFT_BOARD' && (
          <DraftBoardGrid
            roster={roster}
            activeBatterId={activeBatter.id}
            onSelectActiveBatter={(card) => {
              const idx = roster.findIndex((c) => c.id === card.id);
              if (idx !== -1) {
                setActiveBatterIndex(idx);
                addLog(`${card.name} stepped up as the active batter.`, 'info');
              }
            }}
            onInspectCard={(card) => setInspectedCardForStats(card)}
            onOpenDraft={() => setIsDraftOpen(true)}
            onOpenForge={() => setIsForgeOpen(true)}
          />
        )}

        {/* VIEW 3: 8 SEASONAL SETS VAULT */}
        {mainTab === 'SETS' && (
          <div className="space-y-6">
            <div className="liquid-glass-panel rounded-3xl p-6 border border-orange-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-wide">
                    The 8 Authentic Seasonal Sets Vault
                  </h2>
                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Authentic 3D printed borders, refractor economies & 12-month release calendar
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPackRipOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>⚡</span> Rip Sealed Pack Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CARD_SETS.map((set) => {
                const isSelected = activeSetId === set.id;
                return (
                  <div
                    key={set.id}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setActiveSetId(set.id);
                    }}
                    className={`liquid-glass-panel rounded-2xl p-4 cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected ? 'border-orange-500 shadow-xl scale-[1.02]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-white/10">
                          {set.seasonName}
                        </span>
                        {set.status === 'ACTIVE' ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded-full">
                            ● Active ({set.daysRemaining}d)
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-800">
                            Drops in {set.daysRemaining}d
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-display font-black text-white uppercase tracking-tight">
                        {set.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-2">
                        {set.lore}
                      </p>
                      <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono space-y-1">
                        <div>
                          <span className="text-slate-500">3D Border:</span>{' '}
                          <span className="text-orange-300 font-bold">{set.borderTheme}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">{set.totalCards} Cards</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSetId(set.id);
                          setMainTab('ARENA');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-display font-bold uppercase transition-all ${
                          isSelected ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ================= 4. RESPONSIVE FLOATING DOCK (ZERO CUTOFF) ================= */}
      <aside 
        aria-label="Quick Actions Dock" 
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 liquid-glass-dock rounded-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-2xl max-w-[96vw] overflow-x-auto scrollbar-none whitespace-nowrap"
      >
        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setMainTab('ARENA');
          }}
          className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1 shrink-0 ${
            mainTab === 'ARENA' ? 'glass-pill-active' : 'text-slate-300 hover:text-white'
          }`}
          title="Showdown Arena"
        >
          <span>🏟️</span> <span className="hidden sm:inline">Arena</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setMainTab('DRAFT_BOARD');
          }}
          className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1 shrink-0 ${
            mainTab === 'DRAFT_BOARD' ? 'glass-pill-active' : 'text-slate-300 hover:text-white'
          }`}
          title="Stick-To-The-Board Grid"
        >
          <span>📋</span> <span className="hidden sm:inline">Board</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5 shrink-0" />

        {/* Rip Foil Pack */}
        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setIsPackRipOpen(true);
          }}
          className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-display font-black uppercase bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
          title="Rip Sealed Foil Pack"
        >
          <span>⚡</span> <span className="font-black">Rip Pack</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5 shrink-0" />

        <button
          type="button"
          onClick={() => setIsDraftOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-amber-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 shrink-0"
          title="Casino Jackpot Draft"
        >
          <span>🎰</span> <span className="hidden sm:inline">Draft</span>
        </button>

        <button
          type="button"
          onClick={() => setIsVendingOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-emerald-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 shrink-0"
          title="Equipment Vending"
        >
          <span>🥫</span> <span className="hidden sm:inline">Vending</span>
        </button>

        <button
          type="button"
          onClick={() => setIsForgeOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-yellow-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 shrink-0"
          title="Refractor Forge"
        >
          <span>✨</span> <span className="hidden sm:inline">Forge</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setMainTab('SETS');
          }}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1 shrink-0 ${
            mainTab === 'SETS' ? 'glass-pill-active' : 'text-orange-400 hover:text-white hover:bg-white/10'
          }`}
          title="Seasonal Sets"
        >
          <span>🎴</span> <span className="hidden sm:inline">Sets</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setIsChopExtremeOpen(true);
          }}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-black uppercase text-red-400 hover:text-white hover:bg-red-950/50 transition-all flex items-center gap-1 shrink-0 border border-red-500/30"
          title="Chop Extreme 4 Pillars"
        >
          <span>🏆</span> <span className="hidden sm:inline">Extreme</span>
        </button>
      </aside>

      {/* ================= 5. COMPLETE MODALS SUITE ================= */}
      
      {/* Chop Extreme Sabermetric Hub Modal (4 Pillars + RE24 Calculator) */}
      <ChopExtremeHubModal
        isOpen={isChopExtremeOpen}
        onClose={() => setIsChopExtremeOpen(false)}
        onAwardExtremePoints={(pts, reason) => {
          setFranchisePoints((p) => p + pts * 50);
          addLog(`🏆 EXTREME CHALLENGE: +${pts} Extreme Points awarded (${reason})!`, 'chop');
        }}
      />

      {/* Deep Card Stats, 360° Rotation & Community Rank Detail Modal */}
      <CardStatsDetailModal
        card={inspectedCardForStats}
        isOpen={Boolean(inspectedCardForStats)}
        onClose={() => setInspectedCardForStats(null)}
        onDeployCard={(card, role) => {
          const idx = roster.findIndex((c) => c.id === card.id);
          if (idx !== -1) {
            setActiveBatterIndex(idx);
          }
          addLog(`🛡️ DEPLOYED: ${card.name} stationed as ${role}!`, 'info');
        }}
      />

      {/* 26-Man Casino Jackpot Draft Modal */}
      <JackpotDraftModal
        isOpen={isDraftOpen}
        onClose={() => setIsDraftOpen(false)}
        currentRoster={roster}
        onDraftComplete={(newRoster) => setRoster(newRoster)}
        activeSetId={activeSetId}
      />

      {/* Seasonal Sets Modal */}
      <SeasonalSetsModal
        isOpen={isSetsOpen}
        onClose={() => setIsSetsOpen(false)}
        activeSetId={activeSetId}
        onSelectActiveSet={(setId) => setActiveSetId(setId)}
        roster={roster}
        samplePlayer={activeBatter}
      />

      {/* Vending Machine Modal */}
      <VendingMachineModal
        isOpen={isVendingOpen}
        onClose={() => setIsVendingOpen(false)}
        vendingTokens={vendingTokens}
        onUseToken={(cost) => {
          if (vendingTokens < cost) return false;
          setVendingTokens((tok) => tok - cost);
          return true;
        }}
        tasks={tasks}
        inventory={inventory}
        onEquipItem={(item) => {
          setInventory((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
        }}
      />

      {/* Refractor Forge Modal */}
      <RefractorForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        franchisePoints={franchisePoints}
        onDeductPoints={(cost) => {
          if (franchisePoints < cost) return false;
          setFranchisePoints((p) => p - cost);
          return true;
        }}
        roster={roster}
        onUpdateCard={(updated) => {
          setRoster((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }}
      />

      {/* Roster Manager Modal */}
      <RosterManagerModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        roster={roster}
        activeBatter={activeBatter}
        onSelectActiveBatter={(p) => {
          const idx = roster.findIndex((card) => card.id === p.id);
          if (idx !== -1) setActiveBatterIndex(idx);
          setIsRosterOpen(false);
          addLog(`${p.name} stepped up as the active starting batter.`, 'info');
        }}
        onOpenDraft={() => {
          setIsRosterOpen(false);
          setIsDraftOpen(true);
        }}
      />

      {/* Franchise Season Modal */}
      <FranchiseSeasonModal
        isOpen={isFranchiseOpen}
        onClose={() => setIsFranchiseOpen(false)}
        seasonRecord={seasonRecord}
        onSimulateGames={handleSimulateGames}
        teamArchetype={teamArchetype}
        franchisePoints={franchisePoints}
        roster={roster}
      />

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Pack Ripping Ceremony Modal */}
      <PackRippingModal
        isOpen={isPackRipOpen}
        onClose={() => setIsPackRipOpen(false)}
        activeSetId={activeSetId}
        onCardsClaimed={(cards) => {
          setRoster((prev) => [...cards, ...prev]);
          addLog(`⚡ Pack Rip Complete: Pulled ${cards.length} cards from ${activeSetId}!`, 'chop');
        }}
        tokensAvailable={vendingTokens}
        onDeductToken={() => {
          if (vendingTokens < 1) return false;
          setVendingTokens((tok) => tok - 1);
          return true;
        }}
      />

      {/* Admin Operations Modal */}
      <AdminOperationsModal
        isOpen={isOperationsOpen}
        onClose={() => setIsOperationsOpen(false)}
        franchisePoints={franchisePoints}
        onSetFranchisePoints={(newVal) => setFranchisePoints(newVal)}
        vendingTokens={vendingTokens}
        onSetVendingTokens={(newVal) => setVendingTokens(newVal)}
        roster={roster}
        onAddCardToRoster={(card) => setRoster((prev) => [card, ...prev])}
        onUpdateRoster={(newRoster) => setRoster(newRoster)}
        homeScore={homeScore}
        awayScore={awayScore}
        onSetScores={(home, away) => {
          setHomeScore(home);
          setAwayScore(away);
        }}
        seasonRecord={seasonRecord}
        onSetSeasonRecord={(rec) => setSeasonRecord(rec)}
        onBroadcastLog={addLog}
      />

      {/* Stadium Tunnel Walk-Out Entrance & Franchise Selector */}
      <StadiumTunnelEntrance
        isOpen={isSplashOpen}
        onComplete={handleTeamSelected}
        onClose={() => setIsSplashOpen(false)}
      />

      {/* 5-in-7 Days Login Streak Modal */}
      <LoginStreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        onClaimReward={handleClaimStreakReward}
      />

      {/* User Profile Modal */}
      <AccountProfileModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onBroadcastLog={addLog}
      />

      {/* Master Teams & Cards Almanac Checklist */}
      <CardAlmanacModal
        isOpen={isAlmanacOpen}
        onClose={() => setIsAlmanacOpen(false)}
        onSelectActiveBatter={(card) => {
          const idx = roster.findIndex((c) => c.name === card.name);
          if (idx !== -1) {
            setActiveBatterIndex(idx);
            addLog(`${card.name} stepped up as the active starting batter.`, 'info');
          }
        }}
      />

      {/* Knowledge Base & Card Collection Hub Portal */}
      <FirstEnterPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onSelectCardForShowdown={(card) => {
          const idx = roster.findIndex((c) => c.name === card.name);
          if (idx !== -1) {
            setActiveBatterIndex(idx);
            addLog(`${card.name} selected as active batter from portal!`, 'info');
          }
        }}
        onOpenCardDetails={(card) => {
          setInspectedCardForStats(card);
        }}
      />
    </div>
  );
}
