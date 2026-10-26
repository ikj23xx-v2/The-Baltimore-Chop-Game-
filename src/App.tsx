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
import { ALL_PLAYERS, INITIAL_ROSTER } from './data/players';
import { INITIAL_EQUIPMENT_CARDS, INITIAL_TASKS } from './data/equipment';
import { CARD_SETS } from './data/sets';
import { AtBatEngine } from './game/atBatEngine';
import { soundManager } from './services/audio';
import { triggerHapticFeedback } from './services/haptics';

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
import { SplashScreenModal } from './components/SplashScreenModal';
import { LoginStreakModal } from './components/LoginStreakModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { CardAlmanacModal } from './components/CardAlmanacModal';
import { FirstEnterPortalModal } from './components/FirstEnterPortalModal';
import { recordDailyLogin, getSevenDayStreakStatus } from './utils/loginStreak';
import { authService, UserAccountProfile } from './services/authService';

export default function App() {
  // --- NAVIGATION VIEW TABS ---
  const [mainTab, setMainTab] = useState<'ARENA' | 'DRAFT_BOARD' | 'SETS'>('ARENA');

  // --- ROSTER & PLAYERS ---
  const [roster, setRoster] = useState<PlayerCard[]>(INITIAL_ROSTER);
  const [activeBatterIndex, setActiveBatterIndex] = useState(0);
  const activeBatter = roster[activeBatterIndex] || roster[0];
  const [opposingPitcher, setOpposingPitcher] = useState<PlayerCard>(ALL_PLAYERS[4]); // Jim Palmer / Opponent Ace

  // --- AT-BAT INTERACTIVE INPUTS ---
  const [selectedZone, setSelectedZone] = useState<StrikeZone>('DOWN_MID');
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType>('4-SEAM');
  const [activeSkill, setActiveSkill] = useState<SpecialSkill | undefined>('BALTIMORE_CHOP');
  const [isPitching, setIsPitching] = useState(false);
  const [pitchSequence, setPitchSequence] = useState<PitchDelivery[]>([]);
  const [dynamicHint, setDynamicHint] = useState<string | undefined>(
    'Dynamic Clue: Hurler is targeting the lower edge of the plate with breaking stuff.'
  );
  const [streakCount, setStreakCount] = useState(0);

  // --- MATCH & SCOREBOARD STATE ---
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  const [homeScore, setHomeScore] = useState(4);
  const [awayScore, setAwayScore] = useState(3);
  const [inning, setInning] = useState(9);
  const [halfInning, setHalfInning] = useState<'TOP' | 'BOTTOM'>('BOTTOM');
  const [baseRunners, setBaseRunners] = useState<[boolean, boolean, boolean]>([true, false, false]); // Runner on 1B
  const [franchisePoints, setFranchisePoints] = useState(1250);
  const [vendingTokens, setVendingTokens] = useState(3);
  const [isMuted, setIsMuted] = useState(false);

  // --- PROGRESSION & INVENTORY ---
  const [tasks, setTasks] = useState<TaskRequirement[]>(INITIAL_TASKS);
  const [inventory, setInventory] = useState<NonPlayerCard[]>(INITIAL_EQUIPMENT_CARDS);
  const [seasonRecord, setSeasonRecord] = useState({
    wins: 18,
    losses: 12,
    gamesPlayed: 30,
    mode: '162_SEASON' as const
  });
  const [teamArchetype, setTeamArchetype] = useState('Small Ball & Baltimore Chop');

  // --- PLAY-BY-PLAY FEED ---
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayEntry[]>([
    {
      id: 'init-1',
      text: 'Bottom of the 9th, runner on 1st. Cal Ripken Jr. steps in against the ace.',
      type: 'info',
      timestamp: Date.now()
    }
  ]);

  // --- MODALS ---
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
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [streakStatus, setStreakStatus] = useState(() => getSevenDayStreakStatus());
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserAccountProfile | null>(() => authService.getProfile());
  const [activeSetId, setActiveSetId] = useState<CardSetId>('SERIES_1');
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(true);

  // Subscribe to user auth & profile
  React.useEffect(() => {
    return authService.subscribe((p) => setUserProfile(p));
  }, []);

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
    addLog(`🔥 STREAK MILESTONE CLAIMED: +${reward.points} Franchise Points & +${reward.tokens} Tokens! Opening your bonus Foil Pack!`, 'chop');
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

  // --- RESOLVE AT-BAT SHOWDOWN ---
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

    // 4. Update Game State
    setTimeout(() => {
      setIsPitching(false);

      if (res.isBaltimoreChop) {
        // High bounce safe at first
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 1);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) {
          setHomeScore((s) => s + runnerRes.runsScored);
          setFranchisePoints((pts) => pts + runnerRes.runsScored * 50);
        }
        setFranchisePoints((pts) => pts + 45);
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(res.description, 'chop');
      } else if (res.outcome === 'HOME_RUN') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 4);
        setBaseRunners(runnerRes.nextRunners);
        setHomeScore((s) => s + runnerRes.runsScored);
        setFranchisePoints((pts) => pts + runnerRes.runsScored * 100);
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(res.description, 'homerun');
      } else if (res.outcome === 'DOUBLE') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 2);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) {
          setHomeScore((s) => s + runnerRes.runsScored);
          setFranchisePoints((pts) => pts + runnerRes.runsScored * 50);
        }
        setFranchisePoints((pts) => pts + 30);
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(res.description, 'hit');
      } else if (res.outcome === 'SINGLE') {
        const runnerRes = AtBatEngine.advanceRunners(baseRunners, 1);
        setBaseRunners(runnerRes.nextRunners);
        if (runnerRes.runsScored > 0) {
          setHomeScore((s) => s + runnerRes.runsScored);
          setFranchisePoints((pts) => pts + runnerRes.runsScored * 50);
        }
        setFranchisePoints((pts) => pts + 20);
        setStreakCount((c) => c + 1);
        resetCount();
        addLog(res.description, 'hit');
      } else if (res.outcome === 'GROUNDOUT' || res.outcome === 'FLYOUT') {
        recordOut(res.description);
      } else {
        // Strikeout or strike
        const nextStrikes = strikes + 1;
        if (nextStrikes >= 3) {
          recordOut(res.description);
        } else {
          setStrikes(nextStrikes);
          addLog(res.description, 'out');
        }
      }

      // Dynamic Hint
      if (res.dynamicHint) {
        setDynamicHint(res.dynamicHint);
      }
    }, 450);
  };

  const recordOut = (msg: string) => {
    const nextOuts = outs + 1;
    resetCount();
    setStreakCount(0);
    if (nextOuts >= 3) {
      setOuts(0);
      setBaseRunners([false, false, false]);
      setInning((inn) => inn + 1);
      setHalfInning((half) => (half === 'TOP' ? 'BOTTOM' : 'TOP'));
      addLog('--- 3 Outs Recorded. Side Retired. Bases Cleared ---', 'out');
    } else {
      setOuts(nextOuts);
      addLog(msg, 'out');
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
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center pb-20 selection:bg-orange-600 selection:text-white">
      {/* ================= 1. iOS LIQUID GLASS TOP HEADER ================= */}
      <header className="w-full liquid-glass-header sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Orioles Wordmark with authentic Field Logo */}
          <div 
            onClick={() => {
              soundManager.playButtonClick();
              setIsPortalOpen(true);
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer group"
            title="Click to view Game Breakdown, Animated Arena, Forum & 12-Season Calendar"
          >
            <img
              src="/assets/aistudio/chopchop_085f9a0d.jpeg"
              alt="The Baltimore Chop Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border-2 border-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.5)] group-hover:scale-105 transition-transform shrink-0"
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

          {/* Center: iOS Segmented Glass Pill Switcher (Stick-to-the-board / Arena / Sets) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setMainTab('ARENA');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                mainTab === 'ARENA'
                  ? 'glass-pill-active'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                mainTab === 'DRAFT_BOARD'
                  ? 'glass-pill-active'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                mainTab === 'SETS'
                  ? 'glass-pill-active'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🎴</span> Seasonal Sets (8)
            </button>
          </div>

          {/* Right Header Controls: PWA Install, Rip Pack, Operations (892308), Guide */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Quick Rip Foil Pack Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsPackRipOpen(true);
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
              title="Topps Collect Foil Pack Rip"
            >
              <span>⚡</span> <span className="hidden sm:inline">Rip</span> Pack
            </button>

            {/* Master Teams, Players & Cards Almanac / Verification Checklist */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsAlmanacOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-display font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              title="Confirm & Inspect All 7 Teams, 29 Players & 8 Topps Sets"
            >
              <span>🗂️</span> <span className="hidden sm:inline">Cards</span> Checklist
            </button>

            {/* 5-in-7 Days Login Streak Tracker Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setStreakStatus(getSevenDayStreakStatus());
                setIsStreakOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              title="5-in-7 Days Login Streak Tracker & Rewards"
            >
              <span className="text-amber-400">🔥</span>
              <span>{streakStatus.activeDaysCount}/5 <span className="hidden sm:inline">Streak</span></span>
              {streakStatus.canClaimReward && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            {/* Player Account, Google/Apple Link & Handle Pill */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsAccountModalOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Player Account Profile, Linked Accounts & Handle"
            >
              <span className="text-orange-400">👤</span>
              <span className="text-[11px] truncate max-w-[75px] sm:max-w-[110px]">
                @{userProfile?.username || 'Player'}
              </span>
              {userProfile && !userProfile.isAnonymous && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsDraftOpen(true)}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-display font-bold text-xs uppercase transition-all"
            >
              <span>🎰</span> Draft
            </button>

            {/* First Enter Portal & Breakdown Trigger */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsPortalOpen(true);
              }}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-display font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 hover:brightness-110 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.35)] flex items-center gap-1"
              title="Game Breakdown, Live Animation Loop, Knowledge Base, Community Forum & 12-Season Calendar"
            >
              <span>🏟️</span> <span className="hidden sm:inline">Game</span> Portal
            </button>

            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-display font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md flex items-center gap-1"
            >
              <span>❓</span> <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Segmented View Switcher */}
      <div className="w-full md:hidden bg-slate-950/90 border-b border-white/10 px-3 py-2 flex items-center justify-center gap-1 text-[11px] font-display font-bold uppercase">
        <button
          onClick={() => setMainTab('ARENA')}
          className={`flex-1 py-1.5 rounded-lg text-center ${
            mainTab === 'ARENA' ? 'glass-pill-active' : 'text-slate-400 bg-slate-900/60'
          }`}
        >
          🏟️ Arena
        </button>
        <button
          onClick={() => setMainTab('DRAFT_BOARD')}
          className={`flex-1 py-1.5 rounded-lg text-center ${
            mainTab === 'DRAFT_BOARD' ? 'glass-pill-active' : 'text-slate-400 bg-slate-900/60'
          }`}
        >
          📋 Board Grid
        </button>
        <button
          onClick={() => setMainTab('SETS')}
          className={`flex-1 py-1.5 rounded-lg text-center ${
            mainTab === 'SETS' ? 'glass-pill-active' : 'text-slate-400 bg-slate-900/60'
          }`}
        >
          🗓️ Seasons (12)
        </button>
      </div>

      {/* ================= 2. MAIN DASHBOARD CONTENT ================= */}
      <main className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
        {/* Ballpark Scoreboard (Present across views) */}
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
              ? 'At-Bat Showdown · Bottom 9th Clutch Matchup'
              : mainTab === 'DRAFT_BOARD'
              ? 'Stick-To-The-Board Matrix · 26-Man Baltimore Depth Chart'
              : 'Seasonal Sets Vault · 8 Mimicked Topps Baseball Sets'
          }
        />

        {/* VIEW 1: ARENA SHOWDOWN (3D Card Stage + Strike Zone Arena) */}
        {mainTab === 'ARENA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 3D Inspectable Card Stage with 3D Textured Borders */}
            <div className="lg:col-span-4 flex flex-col items-center liquid-glass-panel rounded-3xl p-5 shadow-2xl">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-orange-400">
                    Active Card · 3D Tactile Stage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSetsOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
                >
                  Calendar & Lore 📅
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
                          ? 'A&G'
                          : set.id === 'STADIUM_CLUB'
                          ? 'Stadium'
                          : set.id === 'UPDATE_SERIES'
                          ? 'Update'
                          : set.name.replace('Chop ', '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The 3D Tactile Card with active set border applied */}
              <Card3D
                card={activeBatter}
                overrideSetId={activeSetId}
                size="normal"
                className="my-1"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono text-center mt-2.5">
                <span>🔄</span>
                <span>Move cursor / tilt device for refractor foil. Click flip button for career stats!</span>
              </div>

              {/* Quick Actions under card */}
              <div className="w-full mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMainTab('DRAFT_BOARD')}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>📋</span> Open Stick-To-The-Board Roster
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgeOpen(true)}
                    className="py-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-display font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>✨</span> Refractor Forge
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDraftOpen(true)}
                    className="py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-display font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🎰</span> Casino Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: At-Bat Showdown Arena */}
            <div className="lg:col-span-8 liquid-glass-panel rounded-3xl p-5 shadow-2xl">
              <AtBatArena
                currentBatter={activeBatter}
                currentPitcher={opposingPitcher}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                selectedPitchType={selectedPitchType}
                onSelectPitchType={setSelectedPitchType}
                activeSkill={activeSkill}
                onSelectSkill={setActiveSkill}
                onSwing={handleSwing}
                isPitching={isPitching}
                pitchSequence={pitchSequence}
                activeHint={dynamicHint}
                streakCount={streakCount}
                playByPlay={playByPlay}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: STICK-TO-THE-BOARD DRAFT MATRIX */}
        {mainTab === 'DRAFT_BOARD' && (
          <DraftBoardGrid
            roster={roster}
            activeBatterId={activeBatter.id}
            onSelectActiveBatter={(player) => {
              const idx = roster.findIndex((p) => p.id === player.id);
              if (idx !== -1) setActiveBatterIndex(idx);
              addLog(`${player.name} slotted into batter's box.`, 'info');
            }}
            onInspectCard={(player) => {
              const idx = roster.findIndex((p) => p.id === player.id);
              if (idx !== -1) setActiveBatterIndex(idx);
              if (player.cardSetId) setActiveSetId(player.cardSetId);
              setMainTab('ARENA');
            }}
            onOpenForge={() => setIsForgeOpen(true)}
            onOpenDraft={() => setIsDraftOpen(true)}
          />
        )}

        {/* VIEW 3: SEASONAL SETS VAULT & EXPIRATION CALENDAR */}
        {mainTab === 'SETS' && (
          <div className="liquid-glass-panel rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  2024–2025 RELEASE ROADMAP
                </span>
                <h2 className="text-2xl font-display font-black tracking-wide text-white uppercase mt-1">
                  8 OFFICIAL TOPPS-MIMICKED SEASONAL SETS
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Unique physical 3D card textures, authentic print borders, and timed drop windows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSetsOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>🎴</span> Open Full Set Inspector
              </button>
            </div>

            {/* 8 Sets Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CARD_SETS.map((set) => {
                const isCurrentActive = activeSetId === set.id;
                return (
                  <div
                    key={set.id}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setActiveSetId(set.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isCurrentActive
                        ? 'bg-slate-900/90 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]'
                        : 'bg-slate-950/70 border-white/10 hover:border-orange-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
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
                        <div className="text-slate-400 text-[9.5px]">
                          {set.lore}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {set.totalCards} Cards
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSetId(set.id);
                            setIsPackRipOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg text-[10px] font-display font-bold uppercase bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-sm transition-all flex items-center gap-1"
                          title="Rip a sealed pack from this set"
                        >
                          <span>⚡</span> Rip Pack
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSetId(set.id);
                            setMainTab('ARENA');
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-display font-bold uppercase transition-all ${
                            isCurrentActive
                              ? 'bg-white/20 text-white border border-white/30'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          {isCurrentActive ? 'Selected' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Discreet Platform Footer with Hidden Ops Backdoor */}
      <footer className="w-full py-4 text-center text-slate-500 text-[11px] font-mono select-none flex items-center justify-center gap-2 pb-24">
        <span>BALTIMORE CHOP™ · OFFICIAL SHOWDOWN & TOPPS CARDS</span>
        <button
          type="button"
          onClick={() => {
            setIsOperationsOpen(true);
            soundManager.playButtonClick();
          }}
          className="text-slate-700 hover:text-slate-400 transition-colors p-1"
          title="Terminal Access"
          aria-label="Secure terminal console"
        >
          🔒
        </button>
      </footer>

      {/* ================= 3. FLOATING iOS LIQUID GLASS DOCK ================= */}
      <aside aria-label="Quick Actions Dock" className="fixed bottom-4 z-40 liquid-glass-dock rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setMainTab('ARENA');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
            mainTab === 'ARENA' ? 'glass-pill-active' : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>🏟️</span> Arena
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setMainTab('DRAFT_BOARD');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
            mainTab === 'DRAFT_BOARD' ? 'glass-pill-active' : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>📋</span> Board
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Topps Collect Foil Rip Quick Action */}
        <button
          type="button"
          onClick={() => {
            soundManager.playButtonClick();
            setIsPackRipOpen(true);
          }}
          className="px-3 py-1.5 rounded-full text-xs font-display font-black uppercase bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
          title="Rip Foil Pack"
        >
          <span>⚡</span> <span className="font-black">Rip Pack</span>
        </button>

        <span className="w-px h-4 bg-white/20 mx-0.5" />

        <button
          type="button"
          onClick={() => setIsDraftOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-amber-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          title="Casino Jackpot Draft"
        >
          <span>🎰</span> <span className="hidden sm:inline">Draft</span>
        </button>

        <button
          type="button"
          onClick={() => setIsVendingOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-emerald-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
          title="Equipment Vending"
        >
          <span>🥫</span> <span className="hidden sm:inline">Vending</span>
        </button>

        <button
          type="button"
          onClick={() => setIsForgeOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase text-yellow-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1"
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
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-display font-bold uppercase transition-all flex items-center gap-1 ${
            mainTab === 'SETS' ? 'glass-pill-active' : 'text-orange-400 hover:text-white hover:bg-white/10'
          }`}
          title="Seasonal Sets"
        >
          <span>🎴</span> <span className="hidden sm:inline">Sets</span>
        </button>
      </aside>

      {/* ================= 3. MODALS ================= */}
      <JackpotDraftModal
        isOpen={isDraftOpen}
        onClose={() => setIsDraftOpen(false)}
        currentRoster={roster}
        onDraftComplete={(newRoster) => setRoster(newRoster)}
        activeSetId={activeSetId}
      />

      <SeasonalSetsModal
        isOpen={isSetsOpen}
        onClose={() => setIsSetsOpen(false)}
        activeSetId={activeSetId}
        onSelectActiveSet={(setId) => setActiveSetId(setId)}
        roster={roster}
        samplePlayer={activeBatter}
      />

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

      <FranchiseSeasonModal
        isOpen={isFranchiseOpen}
        onClose={() => setIsFranchiseOpen(false)}
        seasonRecord={seasonRecord}
        onSimulateGames={handleSimulateGames}
        teamArchetype={teamArchetype}
        franchisePoints={franchisePoints}
        roster={roster}
      />

      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* ================= 4. NEW TOPPS COLLECT, OPERATIONS (892308) & SPLASH MODALS ================= */}
      {/* Interactive Foil Pack Ripping Ceremony */}
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

      {/* Passcode Protected Operations & Backend Console (Code 892308) */}
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

      {/* Opening Stadium Splash Screen */}
      <SplashScreenModal
        isOpen={isSplashOpen}
        onEnterGame={() => setIsSplashOpen(false)}
      />

      {/* 5-in-7 Days Login Streak Modal */}
      <LoginStreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        onClaimReward={handleClaimStreakReward}
      />

      {/* Google/Apple Account Linking & Username Management Modal */}
      <AccountProfileModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onBroadcastLog={addLog}
      />

      {/* Master Teams, Players & Cards Verification Almanac */}
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

      {/* First Enter Portal: Game Breakdown, Looping Animated Arena, Knowledge Base, Community Forum & 12 Seasons */}
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
      />
    </div>
  );
}
