/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { INITIAL_EQUIPMENT_CARDS, INITIAL_TASKS, TIERED_EQUIPMENT_CARDS } from './data/equipment';
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

// Parallels, Managers & Simulation Engines
import { 
  RefractorTier, 
  REFRACTOR_REGISTRY, 
  ALL_REFRACTOR_TIERS, 
  getAuthenticSerialStamp,
  calculateCardTierFromWAR
} from './types/refractors';
import { 
  ManagerCard, 
  ManagerCardInstance, 
  FAMOUS_MANAGERS, 
  validateManagerUsage, 
  consumeManagerUse 
} from './types/managerCards';
import { evaluatePlayoffEligibility, SeasonProgressTracker, PlayoffStatus } from './engine/playoffEligibility';
import { simulateSeriesGame, SeriesConfig } from './engine/seriesSimEngine';
import { TEAM_TOP_25_WAR_SEASONS, convertWarSeasonToCard, FranchiseWarSeasonEntry } from './data/teamTopWarLegends';
import { fetchActiveRosterFromMlbApi, getTeamIdByName, MLB_API_TEAM_IDS, MlbApiRosterPlayer } from './services/mlbRosterService';

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
import { OfficialHomepageGate } from './components/OfficialHomepageGate';
import { teamThemeService, ActiveTeamTheme } from './services/teamThemeService';
import { getRosterForTeam } from './data/players';
import { LoginStreakModal } from './components/LoginStreakModal';
import { CardAlmanacModal } from './components/CardAlmanacModal';
import { FirstEnterPortalModal } from './components/FirstEnterPortalModal';
import { ChopExtremeHubModal } from './components/ChopExtremeHubModal';
import { CardStatsDetailModal } from './components/CardStatsDetailModal';
import { ChopHouseForum } from './components/ChopHouseForum';
import { RainbowChaseTracker } from './components/RainbowChaseTracker';
import { JerseyAvatar } from './components/JerseyAvatar';
import { CommunityRankBadge } from './components/CommunityRankBadge';
import { recordDailyLogin, getSevenDayStreakStatus } from './utils/loginStreak';
import { authService, UserAccountProfile } from './services/authService';
import { LofiPlayerToggle } from './components/LofiPlayerToggle';
import { ChopVaultBankModal } from './components/ChopVaultBankModal';
import { HobbyShopCatalogue } from './components/HobbyShopCatalogue';
import { SeriesRecapModal } from './components/SeriesRecapModal';
import { BetaFeedbackModal } from './components/BetaFeedbackModal';
import { ChopCardDeckNavigator, DeckNavigationTab } from './components/ChopCardDeckNavigator';
import { ArtOfChopBanner } from './components/ArtOfChopBanner';
import { ArtOfChopGallery } from './components/ArtOfChopGallery';
import { SeasonalBinderGallery } from './components/SeasonalBinderGallery';
import { ChopWalletModal } from './components/ChopWalletModal';
import { ChopControlCenter } from './components/ChopControlCenter';
import { MLB_TEAMS } from './data/mlbTeams';
import { GuestLimitModal } from './components/GuestLimitModal';
import { guestPlayLimitService } from './services/guestPlayLimitService';
import { DigitalCardShop3D, StoreItem } from './components/DigitalCardShop3D';
import { CardRipWorkbench } from './components/CardRipWorkbench';
import { REWARD_CONFIG } from './config/rewardsConfig';
import { ChopSlabCase } from './components/ChopSlabCase';
import { getInitialBankAccount, recordTransaction } from './engine/bankingLedger';
import { BankAccountState } from './types/banking';
import { ProductSKU, PRODUCT_CATALOG } from './types/boxProducts';
import { analyzeSeriesPerformance, SeriesGameBoxScore, SeriesRecapReport } from './engine/seriesAnalysisEngine';
import { ChopBatterCardIcon } from './components/ChopBatterCardIcon';
import { CardVaultView } from './components/CardVaultView';

// Contract navigation tab type
export type ActiveTab = 
  | 'ARENA'
  | 'DEPTH_CHART'
  | 'REFRAC_FORGE'
  | 'MARKETPLACE'
  | 'CHOP_HOUSE' // Community Forum Hub
  | 'GM_CONSOLE'
  | 'HOBBY_OUTPOST';

export default function App() {
  // --- NAVIGATION VIEW TABS ---
  // Default landing tab is "26-Man Draft" (Tab 1 in navigation order)
  const [mainTab, setMainTab] = useState<ActiveTab>('DEPTH_CHART');

  // --- ROSTER & PLAYERS ---
  // Roster starts BLANK by default so the user drafts their lineup from scratch
  const [roster, setRoster] = useState<PlayerCard[]>(() => {
    try {
      const saved = localStorage.getItem('baltimore_chop_user_roster_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return []; // Blank before the user starts their draft!
  });

  // Keep roster state synced to localStorage
  useEffect(() => {
    try {
      if (roster.length > 0) {
        localStorage.setItem('baltimore_chop_user_roster_v2', JSON.stringify(roster));
      } else {
        localStorage.removeItem('baltimore_chop_user_roster_v2');
      }
    } catch {
      // ignore
    }
  }, [roster]);

  const [activeBatterIndex, setActiveBatterIndex] = useState(0);
  const activeBatter = roster[activeBatterIndex] || roster[0] || ALL_PLAYERS[0];
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

  // --- USER PROFILE ---
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

  // --- BANKING LEDGER & SERIES RECAP STATE ---
  const [bankAccount, setBankAccount] = useState<BankAccountState>(() => getInitialBankAccount());
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isSeriesRecapOpen, setIsSeriesRecapOpen] = useState(false);
  const [seriesRecapData, setSeriesRecapData] = useState<SeriesRecapReport | null>(null);
  const [isBetaFeedbackOpen, setIsBetaFeedbackOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSeasonalBinderOpen, setIsSeasonalBinderOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletSpent, setWalletSpent] = useState<{ daily: number; monthly: number }>({ daily: 0, monthly: 0 });
  // --- PRIMARY SPLASH SCREEN & GM AUTHENTICATION GATE ---
  // Starts directly on the splash page for signing up on app launch
  const [isSplashLoginOpen, setIsSplashLoginOpen] = useState<boolean>(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [guestLimitExpiredType, setGuestLimitExpiredType] = useState<'DAILY_LIMIT' | 'TOTAL_LIMIT' | null>(null);
  const [is3DShopOpen, setIs3DShopOpen] = useState(false);
  const [isRipBenchOpen, setIsRipBenchOpen] = useState(false);

  // --- AT-BAT GAMEPLAY ACTIVE STATE ---
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isShowdownSetupOpen, setIsShowdownSetupOpen] = useState<boolean>(false);
  const [gameDifficulty, setGameDifficulty] = useState<'ROOKIE' | 'VETERAN' | 'HALL_OF_FAME'>('VETERAN');
  const [gameInnings, setGameInnings] = useState<number>(9);
  const [pitchSpeed, setPitchSpeed] = useState<'STANDARD' | 'HIGH_HEAT'>('STANDARD');

  // --- REFRACTOR FORGE INLINE STATE ---
  const [forgeSelectedCard, setForgeSelectedCard] = useState<PlayerCard>(() => roster[0] || ALL_PLAYERS[0]);
  const [forgeTierPreview, setForgeTierPreview] = useState<RefractorTier>('SILVER_REFRACTOR');

  // --- GM CONSOLE & VAULT STATE ---
  const [vaultSelectedTeam, setVaultSelectedTeam] = useState<string>('Baltimore Orioles');
  const [liveMlbRoster, setLiveMlbRoster] = useState<MlbApiRosterPlayer[]>([]);
  const [isLoadingMlbRoster, setIsLoadingMlbRoster] = useState(false);
  const [mlbRosterError, setMlbRosterError] = useState<string | null>(null);

  // Series simulation state
  const [simSeriesNumber, setSimSeriesNumber] = useState<number>(18);
  const [simOpponent, setSimOpponent] = useState<string>('New York Yankees');
  const [simOffensiveDirective, setSimOffensiveDirective] = useState<'SMALL_BALL' | 'BALANCED' | 'POWER_HUNT'>('BALANCED');
  const [simDefensiveAlignment, setSimDefensiveAlignment] = useState<'STANDARD' | 'NO_DOUBLES' | 'INFIELD_IN' | 'SHIFT'>('STANDARD');
  const [simSeriesFeedback, setSimSeriesFeedback] = useState<string | null>(null);

  // Manager Card instances
  const [managerInstances, setManagerInstances] = useState<ManagerCardInstance[]>([
    {
      instanceId: 'inst_weaver_01',
      managerId: 'mgr_earl_weaver',
      managerName: 'Earl Weaver',
      archetype: 'THREE_TRUE_OUTCOMES',
      seasonLocked: 1,
      usesRemaining: 5,
      maxUses: 5,
      isExhausted: false
    },
    {
      instanceId: 'inst_herzog_01',
      managerId: 'mgr_whitey_herzog',
      managerName: 'Whitey Herzog',
      archetype: 'SMALL_BALL',
      seasonLocked: 1,
      usesRemaining: 4,
      maxUses: 5,
      isExhausted: false
    },
    {
      instanceId: 'inst_hyde_01',
      managerId: 'mgr_brandon_hyde',
      managerName: 'Brandon Hyde',
      archetype: 'ANALYTICS_SAVVY',
      seasonLocked: 1,
      usesRemaining: 5,
      maxUses: 5,
      isExhausted: false
    }
  ]);
  const [selectedManagerInstance, setSelectedManagerInstance] = useState<ManagerCardInstance>(managerInstances[0]);

  // Playoff Tracker State
  const [seasonProgress, setSeasonProgress] = useState<SeasonProgressTracker>({
    managerId: userProfile?.uid || 'mgr-01',
    seasonNumber: 1,
    regularSeasonGamesPlayed: seasonRecord.gamesPlayed,
    rankedWins: seasonRecord.wins,
    rankedLosses: seasonRecord.losses,
    currentWinStreak: streakCount,
    bankedMatchesRemaining: 4
  });

  // --- ACTIVE THEME STATE (Dynamic Team Styling) ---
  const [currentTeamTheme, setCurrentTeamTheme] = useState<ActiveTeamTheme>(() => teamThemeService.getActiveTheme());

  // Subscribe to team theme updates
  useEffect(() => {
    return teamThemeService.subscribe((newTheme) => {
      setCurrentTeamTheme(newTheme);
      setVaultSelectedTeam(newTheme.name);
    });
  }, []);

  // Subscribe to auth updates
  useEffect(() => {
    return authService.subscribe((profile) => {
      setUserProfile(profile);
    });
  }, []);

  // Synchronize Live MLB 26-Man Active Roster from official MLB Stats API
  const syncLiveMlbRoster = async (teamName: string) => {
    setIsLoadingMlbRoster(true);
    setMlbRosterError(null);
    try {
      const teamId = getTeamIdByName(teamName);
      const players = await fetchActiveRosterFromMlbApi(teamId);
      setLiveMlbRoster(players);
      addLog(`📡 Synced live 26-man roster from MLB Stats API for ${teamName} (${players.length} active players).`, 'info');
    } catch (err) {
      setMlbRosterError('Unable to connect to live MLB Stats API. Showing cached franchise records.');
    } finally {
      setIsLoadingMlbRoster(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'GM_CONSOLE') {
      syncLiveMlbRoster(vaultSelectedTeam);
    }
  }, [mainTab, vaultSelectedTeam]);

  // Handle franchise team selection
  const handleTeamSelected = (teamTheme: ActiveTeamTheme) => {
    teamThemeService.setActiveTheme(teamTheme);
    setCurrentTeamTheme(teamTheme);
    setVaultSelectedTeam(teamTheme.name);

    // Keep roster blank if user hasn't drafted yet
    setActiveBatterIndex(0);

    const aces = ALL_PLAYERS.filter(p => p.team !== teamTheme.name && (p.position === 'SP' || p.position === 'RP'));
    if (aces.length > 0) {
      setOpposingPitcher(aces[Math.floor(Math.random() * aces.length)]);
    }

    setIsSplashOpen(false);
    addLog(`🏟️ Welcome to ${teamTheme.ballpark}! You are managing the ${teamTheme.name}!`, 'chop');
    soundManager.playBatCrack(true);
  };

  // Auto-Draft balanced 26-man roster
  const handleAutoDraft = () => {
    soundManager.playJackpotChime();
    const DRAFT_POSITIONS = [
      'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH',
      'SP', 'SP', 'SP', 'SP', 'SP',
      'RP', 'RP', 'RP', 'RP', 'RP', 'RP', 'RP',
      'C', '1B', '2B', 'SS', 'CF'
    ];
    const newRoster: PlayerCard[] = [];
    const usedIds = new Set<string>();

    for (const pos of DRAFT_POSITIONS) {
      const teamCandidates = ALL_PLAYERS.filter(
        (p) => p.team === currentTeamTheme.name && p.position === pos && !usedIds.has(p.id)
      ).sort((a, b) => b.bRefWar - a.bRefWar);

      const generalCandidates = ALL_PLAYERS.filter(
        (p) => p.position === pos && !usedIds.has(p.id)
      ).sort((a, b) => b.bRefWar - a.bRefWar);

      const pick =
        teamCandidates[0] ||
        generalCandidates[0] ||
        ALL_PLAYERS.find((p) => !usedIds.has(p.id)) ||
        ALL_PLAYERS[0];

      usedIds.add(pick.id);
      newRoster.push(pick);
    }

    setRoster(newRoster);
    setActiveBatterIndex(0);
    setForgeSelectedCard(newRoster[0]);
    soundManager.playHomeRunFanfare();
    addLog(`📋 Complete 26-Man Official Roster Drafted for ${currentTeamTheme.name}!`, 'chop');
  };

  // Reset/Clear roster back to blank
  const handleClearRoster = () => {
    soundManager.playButtonClick();
    setRoster([]);
    setActiveBatterIndex(0);
    try {
      localStorage.removeItem('baltimore_chop_user_roster_v2');
    } catch {
      // ignore
    }
    addLog(`🧹 Roster cleared. Big Board reset to blank for a fresh draft!`, 'info');
  };

  // Record daily login on launch
  useEffect(() => {
    const res = recordDailyLogin();
    setStreakStatus(getSevenDayStreakStatus());
    if (res.isNewDay) {
      addLog(`📅 Daily Login recorded! Keep your 5-in-7 streak alive!`, 'info');
    }
  }, []);

  // Listen for hidden Ops shortcut (Ctrl+Shift+O or Cmd+Shift+O) or URL hash #ops
  useEffect(() => {
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

  // Sound toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // --- RESOLVE AT-BAT SHOWDOWN WITH RE24 & LEVERAGE SCORING ---
  const handleSwing = () => {
    if (isPitching) return;
    setIsPitching(true);

    const pitch = AtBatEngine.generatePitch(opposingPitcher);
    setPitchSequence((prev) => [pitch, ...prev.slice(0, 2)]);

    const isZoneGuess = selectedZone === pitch.zone;
    const isPitchGuess = selectedPitchType === pitch.type;
    const isBaltimoreChop = activeSkill === 'BALTIMORE_CHOP';

    setTimeout(() => {
      const outcome = AtBatEngine.resolvePitch(
        pitch,
        {
          guessType: selectedPitchType,
          guessZone: selectedZone,
          specialSkill: activeSkill,
        },
        activeBatter,
        opposingPitcher,
        {},
        streakCount
      );

      triggerHapticFeedback(outcome.hapticPattern || 'HEAVY');

      if (outcome.outcome === 'HOME_RUN') {
        soundManager.playHomeRunFanfare();
        setFranchisePoints((p) => p + 500);
        setHomeScore((s) => s + 2);
        setStreakCount((s) => s + 1);
        addLog(`💥 CRUSHED! ${activeBatter.name} launches a game-tying 2-run home run! (+500 pts)`, 'homerun');
      } else if (outcome.isBaltimoreChop || outcome.outcome === 'INFIELD_SINGLE_CHOP' || outcome.outcome === 'SINGLE' || outcome.outcome === 'DOUBLE' || outcome.outcome === 'TRIPLE') {
        soundManager.playBatCrack(true);
        setFranchisePoints((p) => p + 250);
        setStreakCount((s) => s + 1);
        if (outcome.isBaltimoreChop || outcome.outcome === 'INFIELD_SINGLE_CHOP') {
          addLog(`🪓 BALTIMORE CHOP! High-bounce single over third base! Runner scores! (+250 pts)`, 'chop');
          setHomeScore((s) => s + 1);
        } else {
          addLog(`⚡ CLEAN HIT! ${activeBatter.name} ropes a base hit! (+200 pts)`, 'hit');
        }
      } else {
        soundManager.playUmpireCall(true);
        setOuts((o) => (o >= 2 ? 0 : o + 1));
        setStreakCount(0);
        addLog(`💨 OUT: ${outcome.description} (${opposingPitcher.name} nasty ${pitch.type}).`, 'out');
      }

      setIsPitching(false);
    }, 450);
  };

  // Simulate franchise games
  const handleSimulateGames = (gameCount: number): { winsAdded: number; pointsEarned: number } => {
    const wins = Math.floor(gameCount * 0.6);
    const losses = gameCount - wins;
    const pointsEarned = wins * 80;
    setSeasonRecord(prev => ({
      ...prev,
      wins: prev.wins + wins,
      losses: prev.losses + losses,
      gamesPlayed: prev.gamesPlayed + gameCount
    }));
    setSeasonProgress(prev => ({
      ...prev,
      regularSeasonGamesPlayed: prev.regularSeasonGamesPlayed + gameCount,
      rankedWins: prev.rankedWins + wins,
      rankedLosses: prev.rankedLosses + losses
    }));
    setFranchisePoints(p => p + pointsEarned);
    addLog(`⚡ Simulated ${gameCount} franchise games: +${wins}W -${losses}L (+${pointsEarned} pts)`, 'info');
    return { winsAdded: wins, pointsEarned };
  };

  // Run Quick-Sim Series Game in GM Console
  const handleSimulateQuickSeries = () => {
    const directiveBonus = simOffensiveDirective === 'SMALL_BALL' ? 0.04 : simOffensiveDirective === 'POWER_HUNT' ? 0.02 : 0.0;
    const userRating = 88;
    const oppRating = 85;

    const game1 = simulateSeriesGame(userRating, oppRating, directiveBonus);
    const game2 = simulateSeriesGame(userRating, oppRating, directiveBonus);
    const game3 = simulateSeriesGame(userRating, oppRating, directiveBonus);
    const wonCount = (game1.won ? 1 : 0) + (game2.won ? 1 : 0) + (game3.won ? 1 : 0);

    setSeasonRecord(prev => ({
      ...prev,
      wins: prev.wins + wonCount,
      losses: prev.losses + (3 - wonCount),
      gamesPlayed: prev.gamesPlayed + 3
    }));
    setSeasonProgress(prev => ({
      ...prev,
      regularSeasonGamesPlayed: prev.regularSeasonGamesPlayed + 3,
      rankedWins: prev.rankedWins + wonCount,
      rankedLosses: prev.rankedLosses + (3 - wonCount)
    }));

    // Generate comprehensive series box scores
    const boxScores: SeriesGameBoxScore[] = [
      {
        gameNumber: 1,
        userRuns: game1.userRuns,
        cpuRuns: game1.oppRuns,
        userHits: game1.won ? 8 : 5,
        cpuHits: game1.won ? 4 : 7,
        userErrors: game1.won ? 0 : 1,
        rispOpportunities: 4,
        rispHits: game1.won ? 2 : 1,
        startersInningsPitched: 6.2,
        chopHitsAttempted: 3,
        chopHitsConverted: 2,
      },
      {
        gameNumber: 2,
        userRuns: game2.userRuns,
        cpuRuns: game2.oppRuns,
        userHits: game2.won ? 9 : 6,
        cpuHits: game2.won ? 3 : 8,
        userErrors: 0,
        rispOpportunities: 5,
        rispHits: game2.won ? 3 : 1,
        startersInningsPitched: 7.0,
        chopHitsAttempted: 4,
        chopHitsConverted: 3,
      },
      {
        gameNumber: 3,
        userRuns: game3.userRuns,
        cpuRuns: game3.oppRuns,
        userHits: game3.won ? 7 : 4,
        cpuHits: game3.won ? 5 : 9,
        userErrors: game3.won ? 0 : 2,
        rispOpportunities: 3,
        rispHits: game3.won ? 2 : 0,
        startersInningsPitched: 5.1,
        chopHitsAttempted: 2,
        chopHitsConverted: 1,
      },
    ];

    const recap = analyzeSeriesPerformance(
      `S-${simSeriesNumber}`,
      boxScores,
      {
        name: simOpponent,
        bias: simOffensiveDirective === 'SMALL_BALL' ? 'SINKER_HEAVY' : 'SLIDER_SPECIALIST'
      }
    );

    setSeriesRecapData(recap);
    setIsSeriesRecapOpen(true);

    // Record bank winnings if series won
    if (wonCount >= 2) {
      try {
        const reward = wonCount === 3 ? 150 : 75;
        const { updatedAccount } = recordTransaction(bankAccount, {
          type: 'CREDIT',
          currency: 'VENDING_TOKENS',
          amount: reward,
          category: 'SERIES_WIN_REWARD',
          description: `Series ${simSeriesNumber} Victory Purse vs ${simOpponent}`,
        });
        setBankAccount(updatedAccount);
        setVendingTokens(updatedAccount.vendingTokenBalance);
      } catch {
        // ignore
      }
    }

    setSimSeriesFeedback(
      `Series ${simSeriesNumber} vs ${simOpponent} Complete: ${wonCount}W - ${3 - wonCount}L. Recap Generated!`
    );
    addLog(`⚔️ Series ${simSeriesNumber} post-mortem ready vs ${simOpponent}: ${wonCount}-3 finish.`, 'info');
    soundManager.playButtonClick();
  };

  // Purchase hobby/retail box with vending tokens via double-entry ledger
  const handlePurchaseBox = (sku: ProductSKU) => {
    const prod = PRODUCT_CATALOG[sku];
    if (!prod) return;
    if (bankAccount.vendingTokenBalance < prod.tokenCost) {
      addLog(`Insufficient Vending Tokens for ${prod.name}! Required: ${prod.tokenCost} tokens.`, 'info');
      return;
    }
    try {
      const { updatedAccount } = recordTransaction(bankAccount, {
        type: 'DEBIT',
        currency: 'VENDING_TOKENS',
        amount: prod.tokenCost,
        category: 'BOX_PURCHASE',
        description: `Factory Sealed Rip: ${prod.name} (${prod.packCount} Packs)`,
      });
      setBankAccount(updatedAccount);
      setVendingTokens(updatedAccount.vendingTokenBalance);
      soundManager.playPackRip();
      addLog(`📦 Unsealed ${prod.name}! ${prod.guarantees.join(', ')}`, 'homerun');
      setIsPackRipOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Transaction Failed: ${msg}`, 'info');
    }
  };

  // Deposit real funds for token replenishment via Chop Wallet with responsible caps
  const handleInitiateWalletPayment = (tierId: string, amount: number, tokens: number) => {
    setWalletSpent((prev) => ({
      daily: prev.daily + amount,
      monthly: prev.monthly + amount,
    }));
    try {
      const { updatedAccount } = recordTransaction(bankAccount, {
        type: 'CREDIT',
        currency: 'VENDING_TOKENS',
        amount: tokens,
        category: 'TOKEN_PURCHASE',
        description: `Wallet Replenishment: $${amount.toFixed(2)} deposit (+${tokens} Tokens)`,
      });
      setBankAccount(updatedAccount);
      setVendingTokens(updatedAccount.vendingTokenBalance);
      soundManager.playRefractorShine();
      addLog(`🪙 WALLET REPLENISHED: +${tokens} Tokens credited to vault ($${amount.toFixed(2)})!`, 'chop');
      setIsWalletOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Wallet Credit Failed: ${msg}`, 'info');
    }
  };

  // Complete onboarding signup, tutorial & starting mode selection
  const handleOnboardingComplete = (
    newProfile: UserAccountProfile,
    bonusTokens: number,
    startingCredits: number,
    selectedMode: string
  ) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
    } catch {
      // ignore
    }

    const totalStartingTokens = REWARD_CONFIG.STARTER_BASE_TOKENS + bonusTokens;
    try {
      const { updatedAccount } = recordTransaction(bankAccount, {
        type: 'CREDIT',
        currency: 'VENDING_TOKENS',
        amount: totalStartingTokens,
        category: 'ADMIN_ADJUSTMENT',
        description: `Welcome Grant: ${REWARD_CONFIG.STARTER_BASE_TOKENS} Base + ${bonusTokens} Provider Bonus`,
      });
      setBankAccount(updatedAccount);
      setVendingTokens(updatedAccount.vendingTokenBalance);
    } catch {
      // ignore
    }

    if (['ARENA', 'DEPTH_CHART', 'REFRAC_FORGE', 'MARKETPLACE', 'CHOP_HOUSE', 'GM_CONSOLE', 'HOBBY_OUTPOST'].includes(selectedMode)) {
      setMainTab(selectedMode as ActiveTab);
    }

    setIsSplashLoginOpen(false);
    soundManager.playHomeRunFanfare();
    addLog(`🎉 Welcome GM @${newProfile.username}! Granted +${totalStartingTokens} Tokens & ${startingCredits} Credits.`, 'chop');
  };

  // Live guest playtime tracking (1 hour daily, 5 hours total per IP limit)
  useEffect(() => {
    if (userProfile?.isAnonymous && !isSplashLoginOpen) {
      const cleanup = guestPlayLimitService.startLiveTracking((reason) => {
        setGuestLimitExpiredType(reason);
        soundManager.playUmpireCall(true);
        addLog(`⏱️ GUEST TRIAL EXPIRED: ${reason === 'TOTAL_LIMIT' ? '5-Hour IP limit reached' : '1-Hour daily limit reached'}. Sign up required to continue!`, 'info');
      });
      return cleanup;
    }
  }, [userProfile?.isAnonymous, isSplashLoginOpen]);

  // Deploy manager tactical card
  const handleDeployManagerCard = () => {
    const validation = validateManagerUsage(selectedManagerInstance, seasonProgress.seasonNumber, simSeriesNumber);
    if (!validation.canUse) {
      alert(validation.error);
      return;
    }
    const updated = consumeManagerUse(selectedManagerInstance);
    setSelectedManagerInstance(updated);
    setManagerInstances(prev => prev.map(m => m.instanceId === updated.instanceId ? updated : m));
    soundManager.playRefractorShine();
    addLog(`🎖️ TACTICAL DEPLOYMENT: Manager ${updated.managerName} activated! (${updated.usesRemaining} uses remaining this season).`, 'chop');
  };

  // Refractor Forge parallel upgrade
  const handleUpgradeCardParallel = (targetTier: RefractorTier) => {
    const config = REFRACTOR_REGISTRY[targetTier];
    const cost = targetTier === 'SUPERFRACTOR' ? 5 : targetTier === 'GOLD_WAVE' ? 3 : 1;
    if (vendingTokens < cost) {
      alert(`Need ${cost} Vending Tokens to forge ${config.displayName}! Visit equipment vending or challenges.`);
      return;
    }

    setVendingTokens(tok => tok - cost);
    soundManager.playRefractorShine();

    const serialStamp = getAuthenticSerialStamp(targetTier, forgeSelectedCard.cardNo || 42);
    const updatedCard: PlayerCard = {
      ...forgeSelectedCard,
      refractorTier: targetTier === 'SUPERFRACTOR' ? 'SUPERFRACTOR_1_OF_1' : targetTier === 'GOLD_WAVE' ? 'GOLD_WAVE' : targetTier === 'SAPPHIRE' ? 'SAPPHIRE' : targetTier === 'ATOMIC_MOJO' ? 'ATOMIC_MOJO' : targetTier === 'SILVER_REFRACTOR' ? 'RAINBOW' : 'BASE',
      serialStamp
    };

    setForgeSelectedCard(updatedCard);
    setRoster(prev => prev.map(p => p.id === updatedCard.id ? updatedCard : p));
    addLog(`✨ FORGED: ${updatedCard.name} upgraded to ${config.displayName}! Stamped: ${serialStamp || 'Core'}`, 'chop');
  };

  // Playoff status computation
  const playoffStatus: PlayoffStatus = evaluatePlayoffEligibility(seasonProgress);

  // If splash login gate is open, render the exact homepage as the top-level view!
  if (isSplashLoginOpen) {
    return (
      <OfficialHomepageGate
        isOpen={true}
        onEnterGame={(profile, bonusTokens, chosenTeam) => {
          const finalProfile = profile || {
            uid: `gm_${Date.now()}`,
            email: 'manager@thebaltimorechop.app',
            displayName: 'Baltimore GM',
            username: 'ChopMaster',
            photoURL: null,
            isAnonymous: false,
            linkedProviders: ['password'],
            createdAt: Date.now(),
            lastUsernameChangeAt: null,
            usernameHistory: []
          };
          const bonus = bonusTokens ?? 0;
          if (chosenTeam) {
            const theme = teamThemeService.setFavoriteTeam(chosenTeam);
            if (theme) {
              handleTeamSelected(theme);
            }
          }
          handleOnboardingComplete(finalProfile, bonus, REWARD_CONFIG.STARTER_BASE_CREDITS, 'DEPTH_CHART');
          setIsSplashLoginOpen(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white pb-28">
      
      {/* ================= 1. COMPACT SLEEK BALLPARK HEADER ================= */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Top-Left: Selected Username & Chop Batter Card Silhouette Icon */}
          {/* Top-Left: Selected Username & Chop Batter Card Silhouette Icon */}
          <div
            className="flex items-center gap-2.5 text-left"
            title="Active Franchise Manager"
          >
            <ChopBatterCardIcon size={28} />
            <div className="flex flex-col">
              <span className="font-display font-black text-xs sm:text-sm tracking-wider text-amber-300 uppercase truncate max-w-[130px] sm:max-w-none">
                @{userProfile?.username || 'CamdenSlugger'}
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 truncate">
                {currentTeamTheme.name}
              </span>
            </div>
          </div>

          {/* Center: Lo-Fi Radio Soundscape & iOS / Android Style Control Center */}
          <div className="flex items-center gap-2">
            <LofiPlayerToggle />

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsControlCenterOpen(!isControlCenterOpen);
              }}
              className="px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-mono text-[11px] sm:text-xs font-bold shadow-[0_0_15px_rgba(251,191,36,0.18)] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Pull down iOS/Android Control Center"
            >
              <span className="text-xs sm:text-sm">🎛️</span>
              <span className="hidden xs:inline">Control Center</span>
              <span className="text-amber-400 text-[10px]">⌄</span>
            </button>
          </div>

          {/* Right: Balance, Social Share & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Tokens Balance Pill */}
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setIsWalletOpen(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              title="Open Chop Wallet (Tokens & Deposits)"
            >
              <span>🪙</span>
              <span className="font-mono font-black">{bankAccount.vendingTokenBalance.toLocaleString()}</span>
              <span className="hidden md:inline text-[9px] text-slate-400">TOKENS</span>
            </button>

            {/* Guest Pass Badge if playing as anonymous guest */}
            {userProfile?.isAnonymous && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setIsSplashLoginOpen(true);
                }}
                className="px-2 py-1 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Guest Mode. Click to Sign Up and unlock unlimited GM play!"
              >
                <span>🕒</span>
                <span>Guest Pass</span>
                <span className="text-amber-400 underline ml-0.5">Sign Up</span>
              </button>
            )}

            {/* User Profile */}
            <div
              className="px-2 py-1 rounded-xl bg-slate-900 text-slate-200 border border-white/10 text-xs font-mono font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
              title="Official GM Identity"
            >
              <JerseyAvatar
                teamId="BAL"
                username={userProfile?.username || 'Player'}
                jerseyNumber={8}
                size="sm"
                className="w-5 h-5"
              />
              <span className="text-[11px] truncate max-w-[65px] sm:max-w-[90px]">
                @{userProfile?.username || 'GM'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* ================= 3. MAIN DASHBOARD CONTENT ================= */}
      <main className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-6 pt-4">
        
        {/* Ballpark Scoreboard (Active Game Only) */}
        {isGameActive && (
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
            gameModeLabel={`At-Bat Showdown · ${currentTeamTheme.ballpark} · ${gameDifficulty} (${pitchSpeed})`}
          />
        )}

        {/* ---------------- VIEW 1: DASHBOARD & ARENA SHOWDOWN ---------------- */}
        {mainTab === 'ARENA' && roster.length === 0 && (
          <div className="bg-amber-950/70 border border-amber-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-display font-bold text-sm text-white uppercase">
                  Franchise Roster is Blank (0 / 26 Drafted)
                </h4>
                <p className="text-xs text-amber-300/80 font-mono">
                  Draft your 26-man lineup on the Big Board before taking the field in the At-Bat Arena!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMainTab('DEPTH_CHART');
                  setIsDraftOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase shadow transition-transform active:scale-95 cursor-pointer"
              >
                🎰 Start Draft Now
              </button>
              <button
                type="button"
                onClick={handleAutoDraft}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-display font-bold text-xs uppercase cursor-pointer"
              >
                ⚡ Quick Auto-Draft
              </button>
            </div>
          </div>
        )}

        {mainTab === 'ARENA' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 3D Inspectable Card Stage with 360° Drag & Click-to-Inspect */}
            <div className="lg:col-span-4 flex flex-col items-center liquid-glass-panel rounded-3xl p-5 shadow-2xl">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isGameActive ? 'bg-emerald-400 animate-pulse' : 'bg-orange-500'}`} />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-orange-400">
                    {isGameActive ? 'At-Bat Batter in Box' : 'Active Batter · 360° Stage'}
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
                  <span>📋</span> Lineup Roster
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

            {/* Right Column: Pre-Game Configuration OR Active At-Bat Showdown */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              {isGameActive ? (
                <div className="space-y-4">
                  {/* Active Matchup Bar with Exit Button */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-display font-black text-xs sm:text-sm uppercase text-amber-300">
                        SHOWDOWN ACTIVE: {activeBatter.name} vs {opposingPitcher.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setIsGameActive(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>⏹️</span> Exit to Dashboard
                    </button>
                  </div>

                  {/* Active Interactive Batting Arena */}
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
              ) : isShowdownSetupOpen ? (
                /* Pre-Game Setup Splash Screen (Active when user clicks to enter Showdown) */
                <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-6 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                          BALLPARK DASHBOARD · PRE-GAME SHOWDOWN SETUP
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                        Configure At-Bat Showdown
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                        Set up your game conditions, choose difficulty and opposing ace, then step into the batter's box.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setIsShowdownSetupOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Return to Manager Dashboard"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Matchup Preview Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                        {activeBatter.avatarIcon || '🏏'}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Scheduled Batter</span>
                        <h4 className="font-display font-black text-sm text-white uppercase">{activeBatter.name}</h4>
                        <span className="text-[10px] font-mono text-amber-400">{activeBatter.position} · {activeBatter.bRefWar.toFixed(1)} bRef WAR</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:border-l sm:border-slate-800 sm:pl-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl">
                        {opposingPitcher.avatarIcon || '⚾'}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Opposing Ace</span>
                        <h4 className="font-display font-black text-sm text-white uppercase">{opposingPitcher.name}</h4>
                        <span className="text-[10px] font-mono text-blue-400">{opposingPitcher.team} · {opposingPitcher.bRefWar.toFixed(1)} WAR</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty, Inning & Pitch Velocity Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    {/* Difficulty */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <label className="text-slate-400 text-[10px] uppercase font-bold block">Difficulty Tier</label>
                      <select
                        value={gameDifficulty}
                        onChange={(e) => setGameDifficulty(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                      >
                        <option value="ROOKIE">Rookie (+20% timing)</option>
                        <option value="VETERAN">Veteran (Standard)</option>
                        <option value="HALL_OF_FAME">Hall of Fame (High Deception)</option>
                      </select>
                    </div>

                    {/* Innings */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <label className="text-slate-400 text-[10px] uppercase font-bold block">Regulation Length</label>
                      <select
                        value={gameInnings}
                        onChange={(e) => setGameInnings(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                      >
                        <option value={3}>3-Inning Blitz</option>
                        <option value={9}>9-Inning Regulation</option>
                      </select>
                    </div>

                    {/* Pitch Velocity */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <label className="text-slate-400 text-[10px] uppercase font-bold block">Pitch Velocity</label>
                      <select
                        value={pitchSpeed}
                        onChange={(e) => setPitchSpeed(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                      >
                        <option value="STANDARD">Standard 94 MPH</option>
                        <option value="HIGH_HEAT">High-Heat 102 MPH</option>
                      </select>
                    </div>
                  </div>

                  {/* Opponent Pitcher Ace Dropdown */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
                    <label className="text-slate-400 text-[10px] uppercase font-bold block">Select Opposing Ace Hurler</label>
                    <select
                      value={opposingPitcher.id}
                      onChange={(e) => {
                        const found = ALL_PLAYERS.find(p => p.id === e.target.value);
                        if (found) setOpposingPitcher(found);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                    >
                      {ALL_PLAYERS.filter(p => p.position === 'SP' || p.position === 'RP').map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.team} · {p.era}) — {p.bRefWar.toFixed(1)} bRef WAR
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Big Glowing Start Button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setIsShowdownSetupOpen(false);
                      }}
                      className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playBatCrack(true);
                        setBalls(0);
                        setStrikes(0);
                        setOuts(1);
                        setIsGameActive(true);
                        setIsShowdownSetupOpen(false);
                        addLog(`⚾ STEPPED INTO THE BOX: ${activeBatter.name} vs ${opposingPitcher.name} (${gameDifficulty} difficulty)!`, 'chop');
                      }}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-display font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>⚾</span>
                      <span>START AT-BAT SHOWDOWN</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Clean Franchise Manager Dashboard (Showdown Overlay is hidden when no active game) */
                <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                          FRANCHISE HEADQUARTERS · DASHBOARD
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                        {currentTeamTheme.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Home Ballpark: {currentTeamTheme.ballpark} · 26-Man Roster Active
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playButtonClick();
                          setIsShowdownSetupOpen(true);
                        }}
                        className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                        <span>⚔️</span>
                        <span>Play At-Bat Showdown</span>
                      </button>
                    </div>
                  </div>

                  {/* Franchise Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                      <span className="text-[10px] text-slate-500 uppercase block">SEASON RECORD</span>
                      <span className="text-base sm:text-lg font-black text-white">{seasonRecord.wins}W - {seasonRecord.losses}L</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                      <span className="text-[10px] text-slate-500 uppercase block">WIN STREAK</span>
                      <span className="text-base sm:text-lg font-black text-emerald-400">🔥 {streakCount} Games</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                      <span className="text-[10px] text-slate-500 uppercase block">VENDING TOKENS</span>
                      <span className="text-base sm:text-lg font-black text-amber-300">🪙 {bankAccount.vendingTokenBalance.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10">
                      <span className="text-[10px] text-slate-500 uppercase block">FRANCHISE POINTS</span>
                      <span className="text-base sm:text-lg font-black text-orange-400">⭐ {franchisePoints.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Today's Scheduled Game Matchup */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        TODAY'S SCHEDULED MATCHUP
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        CRISIS 9TH INNING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                          {activeBatter.avatarIcon || '🏏'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-slate-400 uppercase">Leadoff Slugger</span>
                          <h4 className="font-display font-bold text-sm text-white uppercase truncate">{activeBatter.name}</h4>
                          <span className="text-[10px] font-mono text-amber-400">{activeBatter.position} · {activeBatter.bRefWar.toFixed(1)} bRef WAR</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl shrink-0">
                          {opposingPitcher.avatarIcon || '⚾'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-slate-400 uppercase">Opposing Hurler</span>
                          <h4 className="font-display font-bold text-sm text-white uppercase truncate">{opposingPitcher.name}</h4>
                          <span className="text-[10px] font-mono text-blue-400">{opposingPitcher.team} · {opposingPitcher.bRefWar.toFixed(1)} WAR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Navigation Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setMainTab('DEPTH_CHART');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">📋</span>
                        <span className="font-display font-bold text-xs text-white uppercase group-hover:text-amber-300 transition-colors">
                          26-Man Big Board
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">
                        Review all 26 drafted cards and manage depth chart.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setMainTab('HOBBY_OUTPOST');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">📦</span>
                        <span className="font-display font-bold text-xs text-white uppercase group-hover:text-amber-300 transition-colors">
                          Hobby Outpost
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">
                        Unseal Foil Packs, Blasters & Official Hobby Boxes.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playButtonClick();
                        setIsFranchiseOpen(true);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🏟️</span>
                        <span className="font-display font-bold text-xs text-white uppercase group-hover:text-amber-300 transition-colors">
                          162-0 Franchise
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">
                        Simulate series games and deploy managerial cards.
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- VIEW 2: STICK-TO-THE-BOARD DEPTH CHART ---------------- */}
        {mainTab === 'DEPTH_CHART' && (
          <DraftBoardGrid
            roster={roster}
            activeBatterId={activeBatter?.id || ''}
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
            onAutoDraft={handleAutoDraft}
            onClearRoster={handleClearRoster}
            teamName={currentTeamTheme.name}
          />
        )}

        {/* ---------------- VIEW 3: REFRACTOR FORGE & RAINBOW CHASE TRACKER ---------------- */}
        {mainTab === 'REFRAC_FORGE' && (
          <div className="space-y-6">
            <div className="liquid-glass-panel rounded-3xl p-6 border border-yellow-500/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                    <span>✨</span> The Refractor Forge & Rainbow Chase
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                    Upgrade cards across 6 authentic parallels: Base Paper, Silver Refractor, Atomic Mojo (/150), Sapphire (/75), Gold Wave (/25), and 1/1 Superfractor.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl text-amber-400 font-bold">
                    🪙 {vendingTokens} Vending Tokens
                  </span>
                </div>
              </div>
            </div>

            {/* Forge Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Card Selector & 3D Tactile Stage */}
              <div className="lg:col-span-5 liquid-glass-panel rounded-3xl p-5 flex flex-col items-center shadow-xl">
                <div className="w-full flex items-center justify-between mb-3">
                  <span className="text-xs font-display font-bold uppercase text-slate-400">
                    Selected Card in Anvil
                  </span>
                  <select
                    value={forgeSelectedCard.id}
                    onChange={(e) => {
                      const found = roster.find(p => p.id === e.target.value);
                      if (found) setForgeSelectedCard(found);
                    }}
                    className="text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white focus:outline-none"
                  >
                    {roster.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.position})</option>
                    ))}
                  </select>
                </div>

                <Card3D
                  card={forgeSelectedCard}
                  interactive={true}
                  overrideSetId={activeSetId}
                  onInspect={() => setInspectedCardForStats(forgeSelectedCard)}
                />

                <div className="w-full mt-4 p-3 bg-slate-900/80 rounded-2xl border border-white/5 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Parallel:</span>
                    <span className="font-bold text-amber-300">{forgeSelectedCard.refractorTier || 'BASE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stamped Serial:</span>
                    <span className="font-bold text-cyan-400">{forgeSelectedCard.serialStamp || 'Core Core Core'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 6 Parallels Matrix & Action Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* Rainbow Chase Carousel */}
                <RainbowChaseTracker
                  card={forgeSelectedCard}
                  selectedTier={forgeTierPreview}
                  onSelectTier={(tier) => setForgeTierPreview(tier)}
                  onRainbowCompleted={(cardName) => {
                    addLog(`🌈 MASTER RAINBOW UNLOCKED for ${cardName}! All 6 parallels assembled!`, 'chop');
                  }}
                />

                {/* Parallel Upgrade Options */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <h3 className="text-xs font-display font-black text-amber-400 uppercase tracking-wider">
                    Forge Parallel Upgrade Anvil
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_REFRACTOR_TIERS.map(tier => {
                      const cfg = REFRACTOR_REGISTRY[tier];
                      const isCurrent = (forgeSelectedCard.refractorTier === 'SUPERFRACTOR_1_OF_1' && tier === 'SUPERFRACTOR') ||
                                        (forgeSelectedCard.refractorTier === 'GOLD_WAVE' && tier === 'GOLD_WAVE') ||
                                        (forgeSelectedCard.refractorTier === 'SAPPHIRE' && tier === 'SAPPHIRE') ||
                                        (forgeSelectedCard.refractorTier === 'ATOMIC_MOJO' && tier === 'ATOMIC_MOJO') ||
                                        (forgeSelectedCard.refractorTier === 'RAINBOW' && tier === 'SILVER_REFRACTOR') ||
                                        (!forgeSelectedCard.refractorTier && tier === 'BASE');

                      const tokenCost = tier === 'SUPERFRACTOR' ? 5 : tier === 'GOLD_WAVE' ? 3 : tier === 'BASE' ? 0 : 1;

                      return (
                        <div
                          key={tier}
                          onClick={() => setForgeTierPreview(tier)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            forgeTierPreview === tier
                              ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-400'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-display font-bold text-xs text-white">
                                {cfg.displayName}
                              </span>
                              {cfg.serialMax && (
                                <span className="text-[10px] font-mono font-bold text-amber-400 bg-black/60 px-1.5 py-0.5 rounded border border-white/5">
                                  {cfg.serialMax === 1 ? '1/1' : `/${cfg.serialMax}`}
                                </span>
                              )}
                            </div>
                            <p className="text-[10.5px] font-mono text-slate-400">
                              +{cfg.attributeBoost} OVR Boost · {cfg.pointMultiplier}x Multiplier
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400">
                              {tokenCost === 0 ? 'Free Base' : `🪙 ${tokenCost} Token${tokenCost > 1 ? 's' : ''}`}
                            </span>
                            {isCurrent ? (
                              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                Current
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpgradeCardParallel(tier);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-[10px] uppercase shadow"
                              >
                                Forge
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- VIEW 4: CARD VAULT & PHYSICAL SHOWROOM ---------------- */}
        {mainTab === 'MARKETPLACE' && (
          <CardVaultView
            roster={roster}
            inventory={inventory}
            activeSetId={activeSetId}
            onSelectActiveSet={setActiveSetId}
            onOpenVending={() => setIsVendingOpen(true)}
            onOpenPackRip={() => setIsPackRipOpen(true)}
            onOpenHobbyShop={() => setMainTab('HOBBY_OUTPOST')}
            onInspectCard={(card) => setInspectedCardForStats(card)}
            vendingTokens={bankAccount.vendingTokenBalance}
            franchisePoints={franchisePoints}
          />
        )}

        {/* ---------------- VIEW 5: THE CHOP HOUSE FORUM & LEADERBOARDS ---------------- */}
        {mainTab === 'CHOP_HOUSE' && (
          <ChopHouseForum />
        )}

        {/* ---------------- VIEW 6: GM CONSOLE & 30 FRANCHISES TOP 25 WAR VAULT ---------------- */}
        {mainTab === 'GM_CONSOLE' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="liquid-glass-panel rounded-3xl p-6 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                  <span>💼</span> GM Operations & 30 Franchises WAR Vault
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                  Access official Top 25 single-season WAR records for all 30 MLB franchises, synchronize live 26-man active rosters via MLB Stats API, and manage 52-series simulation directives.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPortalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase shadow"
                >
                  Launch Vault Modal
                </button>
              </div>
            </div>

            {/* Top Section: Playoff Eligibility & Manager Deployments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Playoff Eligibility Evaluator */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                    <span>🏆</span> Playoff Eligibility Tracker
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    playoffStatus.isQualified ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}>
                    {playoffStatus.isQualified ? 'QUALIFIED' : `${playoffStatus.gamesNeeded} GAMES NEEDED`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">PLAYED</span>
                    <p className="text-base font-bold text-white">{seasonProgress.regularSeasonGamesPlayed}/60</p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">RECORD</span>
                    <p className="text-base font-bold text-emerald-400">{seasonProgress.rankedWins}W-{seasonProgress.rankedLosses}L</p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">PVP MODE</span>
                    <p className="text-[11px] font-bold text-amber-300 truncate">{playoffStatus.pvpMode}</p>
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-400 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <strong>Rules:</strong> {playoffStatus.rulesDescription}
                </p>
              </div>

              {/* Tactical Manager Card Deployments */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                    <span>🎖️</span> Tactical Manager Deployments
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400">
                    Max 5 Uses Before Postseason
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedManagerInstance.instanceId}
                    onChange={(e) => {
                      const found = managerInstances.find(m => m.instanceId === e.target.value);
                      if (found) setSelectedManagerInstance(found);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 text-xs font-mono text-white p-2 rounded-xl focus:outline-none"
                  >
                    {managerInstances.map(m => (
                      <option key={m.instanceId} value={m.instanceId}>
                        {m.managerName} ({m.archetype}) — {m.usesRemaining} Uses Left
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleDeployManagerCard}
                    disabled={selectedManagerInstance.usesRemaining === 0}
                    className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-display font-bold text-xs uppercase tracking-wider"
                  >
                    Deploy
                  </button>
                </div>

                <p className="text-xs font-mono text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <strong>Active Trait:</strong> {FAMOUS_MANAGERS.find(f => f.managerName === selectedManagerInstance.managerName)?.signatureTrait.description || 'Applies simulation modifiers.'}
                </p>
              </div>
            </div>

            {/* 30 Franchises Top 25 WAR Records & Live MLB API Sync View */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-base text-amber-400 uppercase flex items-center gap-2">
                    <span>🏛️</span> 30 MLB Franchises Top 25 WAR Vault
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Official single-season franchise bRef WAR records alongside live active 26-man roster synchronization.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={vaultSelectedTeam}
                    onChange={(e) => setVaultSelectedTeam(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs font-mono text-amber-300 p-2 rounded-xl focus:outline-none"
                  >
                    {Object.keys(TEAM_TOP_25_WAR_SEASONS).map(teamName => (
                      <option key={teamName} value={teamName}>{teamName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => syncLiveMlbRoster(vaultSelectedTeam)}
                    disabled={isLoadingMlbRoster}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5"
                    title="Force refresh from MLB Stats API"
                  >
                    <span>🔄</span> {isLoadingMlbRoster ? 'Syncing...' : 'Sync Live'}
                  </button>
                </div>
              </div>

              {/* Side-by-Side: Top 25 WAR Records vs Live 26-Man MLB Roster */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Top 25 WAR Records */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display font-bold text-amber-400 uppercase">
                      Top 25 Single-Season WAR Records
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {TEAM_TOP_25_WAR_SEASONS[vaultSelectedTeam]?.length || 25} Records Indexed
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {(TEAM_TOP_25_WAR_SEASONS[vaultSelectedTeam] || TEAM_TOP_25_WAR_SEASONS['Baltimore Orioles']).map((entry) => (
                      <div
                        key={`${entry.playerName}-${entry.year}-${entry.rank}`}
                        onClick={() => {
                          const card = convertWarSeasonToCard(entry, vaultSelectedTeam);
                          setInspectedCardForStats(card);
                        }}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-amber-500/40 transition-colors flex items-center justify-between cursor-pointer text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center font-bold text-amber-400">#{entry.rank}</span>
                          <span className="text-base">{entry.avatarIcon}</span>
                          <div>
                            <span className="font-bold text-white">{entry.playerName}</span>
                            <span className="text-slate-400 ml-1.5">({entry.year} · {entry.position})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-amber-300">{entry.bRefWar.toFixed(1)} WAR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Live 26-Man Active Roster (MLB Stats API) */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display font-bold text-emerald-400 uppercase">
                      Official Live 26-Man Roster (MLB Stats API)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Synchronized
                    </span>
                  </div>

                  {isLoadingMlbRoster ? (
                    <div className="py-12 text-center text-xs font-mono text-slate-400 animate-pulse">
                      📡 Connecting to https://statsapi.mlb.com/api/v1/teams/...
                    </div>
                  ) : mlbRosterError ? (
                    <div className="py-8 text-center text-xs font-mono text-amber-400">
                      {mlbRosterError}
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                      {liveMlbRoster.map((player) => (
                        <div
                          key={player.id}
                          className="p-2 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 text-center text-slate-400 font-bold">#{player.jerseyNumber}</span>
                            <span className="font-bold text-slate-200">{player.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                              {player.position}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID:{player.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 52-Series Simulation Engine Interactive Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                <span>⚔️</span> 52-Series Quick-Simulation Engine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">SERIES NUMBER</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={simSeriesNumber}
                    onChange={(e) => setSimSeriesNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">OPPONENT</label>
                  <input
                    type="text"
                    value={simOpponent}
                    onChange={(e) => setSimOpponent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">OFFENSIVE DIRECTIVE</label>
                  <select
                    value={simOffensiveDirective}
                    onChange={(e) => setSimOffensiveDirective(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-white"
                  >
                    <option value="BALANCED">Balanced Hitting</option>
                    <option value="SMALL_BALL">Small Ball (High Speed)</option>
                    <option value="POWER_HUNT">Power Hunt (Slugger)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSimulateQuickSeries}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase shadow"
                  >
                    Simulate Series
                  </button>
                </div>
              </div>

              {simSeriesFeedback && (
                <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 text-xs font-mono text-amber-300">
                  {simSeriesFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- VIEW 7: HOBBY & RETAIL BOX OUTPOST ---------------- */}
        {mainTab === 'HOBBY_OUTPOST' && (
          <div className="space-y-6">
            <ArtOfChopBanner 
              onOpenGallery={() => setIsGalleryOpen(true)} 
              onOpenSeasonalBinder={() => setIsSeasonalBinderOpen(true)}
            />
            <HobbyShopCatalogue
              userTokenBalance={bankAccount.vendingTokenBalance}
              onPurchaseBox={handlePurchaseBox}
              onOpen3DShop={() => setIs3DShopOpen(true)}
              onOpenRipBench={() => setIsRipBenchOpen(true)}
            />
          </div>
        )}

      </main>

      {/* ================= 4. RESPONSIVE FLOATING DECK NAVIGATOR ================= */}
      <ChopCardDeckNavigator
        activeTab={
          mainTab === 'ARENA' ? 'ARENA' :
          mainTab === 'DEPTH_CHART' ? 'ROSTER' :
          mainTab === 'HOBBY_OUTPOST' ? 'HOBBY' :
          mainTab === 'MARKETPLACE' ? 'BINDER' :
          mainTab === 'CHOP_HOUSE' ? 'CLUBHOUSE' :
          'ARENA'
        }
        onSelectTab={(tab: DeckNavigationTab) => {
          soundManager.playButtonClick();
          if (tab === 'ARENA') setMainTab('ARENA');
          else if (tab === 'ROSTER') setMainTab('DEPTH_CHART');
          else if (tab === 'HOBBY') setMainTab('HOBBY_OUTPOST');
          else if (tab === 'BINDER') setMainTab('MARKETPLACE');
          else if (tab === 'CLUBHOUSE') setMainTab('CHOP_HOUSE');
          else if (tab === 'BANK') setIsBankModalOpen(true);
          else if (tab === 'SEASON') setIsFranchiseOpen(true);
          else if (tab === 'ALMANAC') setIsAlmanacOpen(true);
        }}
      />

      {/* ================= 5. COMPLETE MODALS SUITE ================= */}
      
      {/* Chop Vault & Mini-Banking Ledger Modal */}
      <ChopVaultBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankAccount={bankAccount}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* Chop Leather Wallet Modal (Responsible Gaming & Refills) */}
      <ChopWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentBalance={bankAccount.vendingTokenBalance}
        dailySpent={walletSpent.daily}
        monthlySpent={walletSpent.monthly}
        onInitiatePayment={handleInitiateWalletPayment}
      />

      {/* 3-Game Series Post-Mortem Diagnostic & Scouting Report Modal */}
      {seriesRecapData && (
        <SeriesRecapModal
          isOpen={isSeriesRecapOpen}
          onClose={() => setIsSeriesRecapOpen(false)}
          recap={seriesRecapData}
          onAdvanceToNextSeries={() => {
            setSimSeriesNumber((prev) => prev + 1);
            setIsSeriesRecapOpen(false);
            addLog(`🚀 Advanced to Series ${simSeriesNumber + 1}! Opponent scouting intel active.`, 'chop');
          }}
        />
      )}

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


      {/* 5-in-7 Days Login Streak Modal */}
      <LoginStreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        onClaimReward={handleClaimStreakReward}
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

      {/* Beta Feedback & Scouting Report Dispatch Modal */}
      <BetaFeedbackModal
        isOpen={isBetaFeedbackOpen}
        onClose={() => setIsBetaFeedbackOpen(false)}
        currentUser={{
          uid: userProfile?.uid || 'gm_guest',
          email: userProfile?.email || 'spizike23@gmail.com',
          displayName: userProfile?.displayName || userProfile?.username || 'Baltimore GM',
        }}
        seasonInfo={{
          seasonNumber: seasonProgress.seasonNumber,
          gamesPlayed: seasonProgress.regularSeasonGamesPlayed,
          difficulty: 'VETERAN',
        }}
      />

      {/* Art of Chop: Master 564-Card Catalog Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md animate-fadeIn">
          <ArtOfChopGallery
            onClose={() => setIsGalleryOpen(false)}
            activeSeason={seasonProgress.seasonNumber}
          />
        </div>
      )}

      {/* Seasonal & Holiday Refractor Vault Binder Modal */}
      {isSeasonalBinderOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md animate-fadeIn">
          <SeasonalBinderGallery
            onClose={() => setIsSeasonalBinderOpen(false)}
          />
        </div>
      )}

      {/* iOS / Android Style Drop-Down Control Center */}
      <ChopControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        teamTheme={currentTeamTheme}
        bankAccount={bankAccount}
        userProfile={userProfile}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenFeedback={() => setIsBetaFeedbackOpen(true)}
        onOpenSplashGate={() => setIsSplashLoginOpen(true)}
        onSelectMode={(mode) => {
          if (['ARENA', 'DEPTH_CHART', 'REFRAC_FORGE', 'MARKETPLACE', 'CHOP_HOUSE', 'GM_CONSOLE', 'HOBBY_OUTPOST'].includes(mode)) {
            setMainTab(mode as ActiveTab);
          }
        }}
      />

      {/* Guest Trial Expiration Modal (1 hr daily / 5 hr total IP limit reached) */}
      {guestLimitExpiredType && (
        <GuestLimitModal
          isOpen={true}
          limitType={guestLimitExpiredType}
          onAccountCreated={(profile) => {
            setUserProfile(profile);
            setGuestLimitExpiredType(null);
            addLog(`🎖️ GM ACCOUNT CREATED! Unlimited franchise GM play unlocked for @${profile.username}!`, 'chop');
          }}
        />
      )}

      {/* 3D Walk-In Card Shop & RPG Vendor Trading Floor */}
      {is3DShopOpen && (
        <DigitalCardShop3D
          userTokens={bankAccount.vendingTokenBalance}
          onCheckout={(cart: StoreItem[]) => {
            const total = cart.reduce((sum, item) => sum + item.priceTokens, 0);
            if (bankAccount.vendingTokenBalance >= total) {
              const { updatedAccount } = recordTransaction(bankAccount, {
                type: 'DEBIT',
                currency: 'VENDING_TOKENS',
                amount: total,
                category: 'BOX_PURCHASE',
                description: `3D Card Shop Checkout (${cart.length} items)`,
              });
              setBankAccount(updatedAccount);
              setVendingTokens(updatedAccount.vendingTokenBalance);
              addLog(`🛒 CARD SHOP: Checked out ${cart.length} item(s) for ${total} tokens!`, 'chop');
              setIs3DShopOpen(false);
            }
          }}
          onExit={() => setIs3DShopOpen(false)}
        />
      )}

      {/* Hobby Shop Card Rip Workbench with Tactile Audio */}
      {isRipBenchOpen && (
        <CardRipWorkbench
          onClose={() => setIsRipBenchOpen(false)}
        />
      )}

    </div>
  );
}
