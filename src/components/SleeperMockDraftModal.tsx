// src/components/SleeperMockDraftModal.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PlayerCard, Position } from '../types/game';
import { ALL_PLAYERS } from '../data/players';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { Card3D } from './Card3D';
import { 
  X, 
  Search, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Users, 
  Sliders, 
  Star, 
  Flame, 
  Shield, 
  Activity, 
  Clock, 
  Grid, 
  ListFilter 
} from 'lucide-react';

interface SleeperMockDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoster: (roster: PlayerCard[]) => void;
  userTeamName?: string;
}

interface DraftPickRecord {
  overallPick: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  teamName: string;
  isUser: boolean;
  player: PlayerCard;
}

type PositionFilter = 'ALL' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'OF' | 'SP' | 'RP' | 'DH';
type ActiveMockTab = 'PLAYERS' | 'BOARD' | 'ROSTER';

const MOCK_TEAMS_DEFAULT = [
  { id: 't1', name: 'You (Franchise GM)', isUser: true, avatar: '👑' },
  { id: 't2', name: 'Bronx Bombers', isUser: false, avatar: '🗽' },
  { id: 't3', name: 'Chavez Ravine', isUser: false, avatar: '🌴' },
  { id: 't4', name: 'Wrigley Bleachers', isUser: false, avatar: '🐻' },
  { id: 't5', name: 'Bay Bridge Crew', isUser: false, avatar: '🌉' },
  { id: 't6', name: 'South Beach Sluggers', isUser: false, avatar: '🐬' },
  { id: 't7', name: 'Lone Star Dynasty', isUser: false, avatar: '⭐' },
  { id: 't8', name: 'Charm City Chop', isUser: false, avatar: '🐦' },
  { id: 't9', name: 'Motor City Tigers', isUser: false, avatar: '🐅' },
  { id: 't10', name: 'Red Dirt Vipers', isUser: false, avatar: '🐍' },
];

const TOTAL_ROUNDS = 26;

// Position pill styling matching Sleeper's color architecture
export const getSleeperPositionBadge = (pos: string) => {
  switch (pos) {
    case 'C':
      return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' };
    case '1B':
    case '3B':
      return { bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', dot: 'bg-orange-400' };
    case '2B':
    case 'SS':
      return { bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400' };
    case 'OF':
    case 'LF':
    case 'CF':
    case 'RF':
      return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' };
    case 'SP':
      return { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dot: 'bg-purple-400' };
    case 'RP':
    case 'CP':
      return { bg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40', dot: 'bg-fuchsia-400' };
    default:
      return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dot: 'bg-blue-400' };
  }
};

export const SleeperMockDraftModal: React.FC<SleeperMockDraftModalProps> = ({
  isOpen,
  onClose,
  onApplyRoster,
  userTeamName = 'You (Franchise GM)',
}) => {
  // Setup config
  const [leagueSize, setLeagueSize] = useState<number>(10);
  const [userDraftSlot, setUserDraftSlot] = useState<number>(1); // 1-indexed (1 to 10)
  const [draftStarted, setDraftStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveMockTab>('PLAYERS');

  // Player search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('ALL');
  const [sortBy, setSortBy] = useState<'WAR' | 'NAME' | 'POWER' | 'CONTACT' | 'SPEED'>('WAR');

  // Queued targets
  const [queuePlayerIds, setQueuePlayerIds] = useState<string[]>([]);
  const [inspectedCard, setInspectedCard] = useState<PlayerCard | null>(null);

  // Draft state
  const [currentOverallPick, setCurrentOverallPick] = useState(1);
  const [completedPicks, setCompletedPicks] = useState<DraftPickRecord[]>([]);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Teams in the mock draft with user at userDraftSlot
  const mockTeams = useMemo(() => {
    const list = [...MOCK_TEAMS_DEFAULT.slice(0, leagueSize)];
    // Ensure the user is placed at userDraftSlot - 1
    const userItem = { id: 'user_team', name: userTeamName, isUser: true, avatar: '👑' };
    const bots = list.filter(t => !t.isUser);
    const result = [];
    let botIdx = 0;
    for (let i = 1; i <= leagueSize; i++) {
      if (i === userDraftSlot) {
        result.push(userItem);
      } else {
        result.push({ ...bots[botIdx % bots.length], id: `bot_${i}`, isUser: false });
        botIdx++;
      }
    }
    return result;
  }, [leagueSize, userDraftSlot, userTeamName]);

  const totalPicksInDraft = leagueSize * TOTAL_ROUNDS;
  const isDraftFinished = currentOverallPick > totalPicksInDraft;

  // Determine current round and pick team (Serpentine Snake Order)
  const { currentRound, currentPickInRound, currentTeamIndex, isUserTurn } = useMemo(() => {
    if (isDraftFinished) {
      return { currentRound: TOTAL_ROUNDS, currentPickInRound: leagueSize, currentTeamIndex: 0, isUserTurn: false };
    }
    const overall = currentOverallPick - 1; // 0-indexed
    const round = Math.floor(overall / leagueSize) + 1; // 1-indexed
    const pickInRound = (overall % leagueSize) + 1;
    
    // Snake order: odd rounds go 0 -> N-1; even rounds go N-1 -> 0
    const teamIndex = round % 2 === 1 ? (pickInRound - 1) : (leagueSize - pickInRound);
    const isUser = mockTeams[teamIndex]?.isUser || false;

    return {
      currentRound: round,
      currentPickInRound: pickInRound,
      currentTeamIndex: teamIndex,
      isUserTurn: isUser
    };
  }, [currentOverallPick, leagueSize, isDraftFinished, mockTeams]);

  // Set of drafted player IDs
  const draftedIdsSet = useMemo(() => {
    return new Set(completedPicks.map(p => p.player.id));
  }, [completedPicks]);

  // User's drafted roster
  const userRoster = useMemo(() => {
    return completedPicks.filter(p => p.isUser).map(p => p.player);
  }, [completedPicks]);

  // User total WAR drafted
  const userTotalWar = useMemo(() => {
    return userRoster.reduce((sum, p) => sum + (p.bRefWar || 0), 0);
  }, [userRoster]);

  // Filtered available players list
  const availablePlayers = useMemo(() => {
    return ALL_PLAYERS.filter(p => {
      if (draftedIdsSet.has(p.id)) return false;

      // Position filter
      if (positionFilter === 'OF') {
        if (!['OF', 'LF', 'CF', 'RF'].includes(p.position)) return false;
      } else if (positionFilter !== 'ALL') {
        if (p.position !== positionFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchTeam = p.team.toLowerCase().includes(q);
        const matchPos = p.position.toLowerCase().includes(q);
        if (!matchName && !matchTeam && !matchPos) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'WAR') return (b.bRefWar || 0) - (a.bRefWar || 0);
      if (sortBy === 'POWER') return b.stats.power - a.stats.power;
      if (sortBy === 'CONTACT') return b.stats.contact - a.stats.contact;
      if (sortBy === 'SPEED') return b.stats.speed - a.stats.speed;
      return a.name.localeCompare(b.name);
    });
  }, [draftedIdsSet, positionFilter, searchQuery, sortBy]);

  // Execute pick
  const executeDraftPick = (player: PlayerCard, isUser = false) => {
    const record: DraftPickRecord = {
      overallPick: currentOverallPick,
      round: currentRound,
      pickInRound: currentPickInRound,
      teamIndex: currentTeamIndex,
      teamName: mockTeams[currentTeamIndex]?.name || `Team ${currentTeamIndex + 1}`,
      isUser,
      player,
    };

    if (isUser) {
      soundManager.playJackpotChime();
      triggerHapticFeedback('CHOP');
    } else {
      soundManager.playSlotTick();
    }

    setCompletedPicks(prev => [...prev, record]);
    setQueuePlayerIds(prev => prev.filter(id => id !== player.id));
    setCurrentOverallPick(prev => prev + 1);
    setTimerSeconds(30);
  };

  // Bot AI selection algorithm
  const getBotPick = (): PlayerCard => {
    // If queued players exist for user, don't auto-pick user queue unless it's user turn.
    // Bot picks highest WAR player from a position of relative need
    const teamPicks = completedPicks.filter(p => p.teamIndex === currentTeamIndex).map(p => p.player);
    const hasC = teamPicks.some(p => p.position === 'C');
    const spCount = teamPicks.filter(p => p.position === 'SP').length;
    const rpCount = teamPicks.filter(p => p.position === 'RP').length;
    const ifCount = teamPicks.filter(p => ['1B', '2B', '3B', 'SS'].includes(p.position)).length;
    const ofCount = teamPicks.filter(p => ['OF', 'LF', 'CF', 'RF'].includes(p.position)).length;

    // Pick candidates
    const topCandidates = availablePlayers.slice(0, 15);
    if (topCandidates.length === 0) return ALL_PLAYERS[0];

    // Priority checks
    if (!hasC && currentRound > 8) {
      const bestC = availablePlayers.find(p => p.position === 'C');
      if (bestC) return bestC;
    }
    if (spCount < 3 && currentRound > 4) {
      const bestSp = availablePlayers.find(p => p.position === 'SP');
      if (bestSp && Math.random() > 0.4) return bestSp;
    }
    if (ofCount < 3 && currentRound > 6) {
      const bestOf = availablePlayers.find(p => ['OF', 'LF', 'CF', 'RF'].includes(p.position));
      if (bestOf && Math.random() > 0.5) return bestOf;
    }

    // Default: Pick top available with high probability
    return topCandidates[0] || ALL_PLAYERS[0];
  };

  // Automated draft loop ticker
  useEffect(() => {
    if (!draftStarted || isDraftFinished || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // If it's a bot's turn, execute automatically with realistic slight delay
    if (!isUserTurn) {
      const botTimer = setTimeout(() => {
        const botChosen = getBotPick();
        executeDraftPick(botChosen, false);
      }, 350);
      return () => clearTimeout(botTimer);
    }

    // If it's user's turn, run countdown clock
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          // Autopick for user on timeout
          const userPick = (queuePlayerIds.length > 0 
            ? availablePlayers.find(p => p.id === queuePlayerIds[0]) 
            : null) || availablePlayers[0];
          if (userPick) executeDraftPick(userPick, true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [draftStarted, isDraftFinished, isPaused, isUserTurn, currentOverallPick, availablePlayers, queuePlayerIds]);

  // Fast-forward to user's next turn
  const handleSimToUserTurn = () => {
    if (!draftStarted || isDraftFinished) return;
    soundManager.playButtonClick();

    let nextPick = currentOverallPick;
    const newPicks = [...completedPicks];
    const draftedSet = new Set(newPicks.map(p => p.player.id));

    while (nextPick <= totalPicksInDraft) {
      const overall = nextPick - 1;
      const round = Math.floor(overall / leagueSize) + 1;
      const pickInRound = (overall % leagueSize) + 1;
      const teamIdx = round % 2 === 1 ? (pickInRound - 1) : (leagueSize - pickInRound);

      if (mockTeams[teamIdx]?.isUser) {
        break; // Stop when we reach the user!
      }

      // Pick for bot
      const candidates = ALL_PLAYERS.filter(p => !draftedSet.has(p.id)).sort((a, b) => b.bRefWar - a.bRefWar);
      if (candidates.length === 0) break;
      const chosen = candidates[0];
      draftedSet.add(chosen.id);

      newPicks.push({
        overallPick: nextPick,
        round,
        pickInRound,
        teamIndex: teamIdx,
        teamName: mockTeams[teamIdx]?.name || `Team ${teamIdx + 1}`,
        isUser: false,
        player: chosen,
      });

      nextPick++;
    }

    setCompletedPicks(newPicks);
    setCurrentOverallPick(nextPick);
    setTimerSeconds(30);
  };

  // Instant finish draft
  const handleInstantFinish = () => {
    soundManager.playJackpotChime();
    let nextPick = currentOverallPick;
    const newPicks = [...completedPicks];
    const draftedSet = new Set(newPicks.map(p => p.player.id));

    while (nextPick <= totalPicksInDraft) {
      const overall = nextPick - 1;
      const round = Math.floor(overall / leagueSize) + 1;
      const pickInRound = (overall % leagueSize) + 1;
      const teamIdx = round % 2 === 1 ? (pickInRound - 1) : (leagueSize - pickInRound);
      const isUser = mockTeams[teamIdx]?.isUser;

      const candidates = ALL_PLAYERS.filter(p => !draftedSet.has(p.id)).sort((a, b) => b.bRefWar - a.bRefWar);
      if (candidates.length === 0) break;
      const chosen = candidates[0];
      draftedSet.add(chosen.id);

      newPicks.push({
        overallPick: nextPick,
        round,
        pickInRound,
        teamIndex: teamIdx,
        teamName: mockTeams[teamIdx]?.name || `Team ${teamIdx + 1}`,
        isUser: Boolean(isUser),
        player: chosen,
      });

      nextPick++;
    }

    setCompletedPicks(newPicks);
    setCurrentOverallPick(totalPicksInDraft + 1);
  };

  // Reset Mock
  const handleReset = () => {
    soundManager.playButtonClick();
    setDraftStarted(false);
    setIsPaused(false);
    setCurrentOverallPick(1);
    setCompletedPicks([]);
    setQueuePlayerIds([]);
    setTimerSeconds(30);
  };

  // Toggle player in queue
  const toggleQueue = (player: PlayerCard) => {
    soundManager.playButtonClick();
    setQueuePlayerIds(prev => 
      prev.includes(player.id) ? prev.filter(id => id !== player.id) : [...prev, player.id]
    );
  };

  // Sleeper Draft Grade Calculation
  const draftGrade = useMemo(() => {
    if (userTotalWar >= 110) return { grade: 'A+', text: 'Championship Contender · Elite Depth', color: 'text-emerald-400' };
    if (userTotalWar >= 95) return { grade: 'A', text: 'Playoff Lock · High Floor & Ceiling', color: 'text-teal-400' };
    if (userTotalWar >= 80) return { grade: 'B+', text: 'Solid Squad · Strong Rotation', color: 'text-amber-400' };
    return { grade: 'B', text: 'Competitive Roster · Balanced WAR', color: 'text-blue-400' };
  }, [userTotalWar]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in select-none font-sans">
      <div className="w-full max-w-6xl bg-[#0b1120] border-2 border-slate-700/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* ================= 1. SLEEPER ICONIC HEADER & DRAFT STATUS BAR ================= */}
        <header className="px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-display font-black tracking-wider text-white uppercase">
                  SLEEPER MOCK DRAFT ROOM
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {leagueSize}-TEAM SNAKE
                </span>
                {isDraftFinished && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500 text-slate-950 animate-pulse">
                    DRAFT COMPLETE
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Pick #{userDraftSlot} · 26 Rounds · Live Simulated AI GMs & Sleeper ADP Analytics
              </p>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            {!draftStarted ? (
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setDraftStarted(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" /> Start Mock Draft
              </button>
            ) : !isDraftFinished ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  onClick={handleSimToUserTurn}
                  disabled={isUserTurn}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Fast-forward all bot picks until it's your turn"
                >
                  <FastForward className="w-3.5 h-3.5" /> Sim to My Turn
                </button>
                <button
                  type="button"
                  onClick={handleInstantFinish}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-mono text-[11px] border border-slate-700 cursor-pointer"
                  title="Simulate all remaining rounds instantly"
                >
                  ⚡ Fast Finish
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Mock Again
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Mock Draft"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ================= 2. TICKER: ON-THE-CLOCK BANNER ================= */}
        <div className={`px-4 sm:px-6 py-2.5 flex items-center justify-between border-b transition-colors ${
          isDraftFinished
            ? 'bg-emerald-950/50 border-emerald-500/30'
            : isUserTurn
            ? 'bg-cyan-950/80 border-cyan-500/60 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)] animate-pulse'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {isDraftFinished ? '🏆' : mockTeams[currentTeamIndex]?.avatar || '⚾'}
            </span>
            <div>
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span>ROUND {currentRound} · PICK {currentPickInRound}</span>
                <span>•</span>
                <span>OVERALL #{Math.min(currentOverallPick, totalPicksInDraft)}</span>
              </div>
              <div className="text-sm font-display font-black uppercase text-white flex items-center gap-2">
                <span>ON THE CLOCK:</span>
                <span className={isUserTurn ? 'text-cyan-400' : 'text-amber-400'}>
                  {isDraftFinished 
                    ? '26-ROUND MOCK COMPLETE' 
                    : `${mockTeams[currentTeamIndex]?.name} ${isUserTurn ? '(YOU!)' : ''}`}
                </span>
              </div>
            </div>
          </div>

          {/* Clock Timer */}
          {!isDraftFinished && (
            <div className={`flex items-center gap-2 px-3.5 py-1 rounded-xl font-mono text-xs font-bold border ${
              isUserTurn 
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black scale-105'
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timerSeconds}s</span>
            </div>
          )}
        </div>

        {/* ================= 3. SLEEPER SUB-NAVIGATION PILLS ================= */}
        <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between border-b border-slate-800 bg-[#0f172a] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('PLAYERS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PLAYERS'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Available Players ({availablePlayers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BOARD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'BOARD'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Draft Board
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ROSTER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ROSTER'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> My Team ({userRoster.length}/26)
            </button>
          </div>

          {/* Quick Roster Status */}
          <div className="text-right text-xs font-mono">
            <span className="text-slate-400">Total Drafted WAR: </span>
            <strong className="text-amber-400">{userTotalWar.toFixed(1)}</strong>
          </div>
        </div>

        {/* ================= 4. MAIN TAB VIEWS ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {/* ----------------- TAB A: SLEEPER AVAILABLE PLAYERS ----------------- */}
          {activeTab === 'PLAYERS' && (
            <div className="space-y-4">
              
              {/* Position Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Sleeper Position Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {(['ALL', 'C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP'] as PositionFilter[]).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPositionFilter(pos)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                        positionFilter === pos
                          ? 'bg-slate-100 text-slate-950 font-black shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>

                {/* Search & Sort */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search player, team..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 p-1.5 rounded-xl focus:outline-none"
                  >
                    <option value="WAR">Sort by WAR</option>
                    <option value="POWER">Sort by Power</option>
                    <option value="CONTACT">Sort by Contact</option>
                    <option value="SPEED">Sort by Speed</option>
                    <option value="NAME">Sort by Name</option>
                  </select>
                </div>
              </div>

              {/* Sleeper Player Rows Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
                <div className="divide-y divide-slate-800/80">
                  {availablePlayers.slice(0, 100).map((player, idx) => {
                    const badge = getSleeperPositionBadge(player.position);
                    const isQueued = queuePlayerIds.includes(player.id);

                    return (
                      <div
                        key={player.id}
                        onClick={() => setInspectedCard(player)}
                        className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-900/80 transition-colors cursor-pointer group"
                      >
                        {/* Left: Rank, Avatar & Name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[11px] font-mono text-slate-500 font-bold w-6 text-center">
                            #{idx + 1}
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                            {player.avatarIcon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-xs uppercase text-white truncate group-hover:text-cyan-300">
                                {player.name}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold border ${badge.bg}`}>
                                {player.position}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {player.team} · {player.era.split('•')[0]} · CON: {player.stats.contact} POW: {player.stats.power} SPD: {player.stats.speed}
                            </span>
                          </div>
                        </div>

                        {/* Right: WAR, Queue & Draft Action Button */}
                        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-amber-400 block">
                              {player.bRefWar.toFixed(1)} WAR
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              ADP: {(idx + 1.2).toFixed(1)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleQueue(player)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isQueued
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                            title={isQueued ? 'Remove from draft queue' : 'Add to draft queue'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isQueued ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            type="button"
                            disabled={!isUserTurn || isDraftFinished}
                            onClick={() => executeDraftPick(player, true)}
                            className={`px-3 py-1.5 rounded-xl font-display font-black text-xs uppercase transition-all cursor-pointer ${
                              isUserTurn && !isDraftFinished
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 scale-105 active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            Draft
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB B: SLEEPER GRID DRAFT BOARD ----------------- */}
          {activeTab === 'BOARD' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  {/* Team Column Headers */}
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 text-center text-slate-500 w-12">RND</th>
                      {mockTeams.map((team, tIdx) => (
                        <th
                          key={team.id}
                          className={`p-2.5 text-center min-w-[120px] ${
                            team.isUser ? 'bg-cyan-950/60 text-cyan-300 border-x border-cyan-500/30' : ''
                          }`}
                        >
                          <div className="text-base">{team.avatar}</div>
                          <span className="font-bold truncate block">{team.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Rows for all 26 rounds */}
                  <tbody className="divide-y divide-slate-800/80">
                    {Array.from({ length: TOTAL_ROUNDS }).map((_, rIdx) => {
                      const roundNum = rIdx + 1;
                      return (
                        <tr key={`round-row-${roundNum}`}>
                          <td className="p-2 text-center text-slate-500 font-bold bg-slate-900/50">
                            R{roundNum}
                          </td>
                          {mockTeams.map((team, tIdx) => {
                            // Find pick in this round for this team
                            const pickRecord = completedPicks.find(
                              p => p.round === roundNum && p.teamIndex === tIdx
                            );
                            const isCurrentlyOnClock = !isDraftFinished && currentRound === roundNum && currentTeamIndex === tIdx;

                            return (
                              <td
                                key={`cell-${roundNum}-${tIdx}`}
                                className={`p-1.5 text-center align-middle ${
                                  team.isUser ? 'bg-cyan-950/20 border-x border-cyan-500/20' : ''
                                } ${isCurrentlyOnClock ? 'bg-amber-500/20 ring-2 ring-amber-400 rounded-lg' : ''}`}
                              >
                                {pickRecord ? (
                                  <div
                                    onClick={() => setInspectedCard(pickRecord.player)}
                                    className={`p-1.5 rounded-xl border text-left cursor-pointer transition-transform hover:scale-105 ${
                                      pickRecord.isUser
                                        ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
                                        : 'bg-slate-900 border-slate-800 text-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                                      <span>#{pickRecord.overallPick}</span>
                                      <span className="text-amber-400 font-bold">{pickRecord.player.bRefWar}w</span>
                                    </div>
                                    <div className="font-display font-bold text-[11px] truncate text-white mt-0.5">
                                      {pickRecord.player.name}
                                    </div>
                                    <div className="text-[9px] text-slate-400 truncate">
                                      {pickRecord.player.position} · {pickRecord.player.team}
                                    </div>
                                  </div>
                                ) : isCurrentlyOnClock ? (
                                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold animate-pulse">
                                    ON CLOCK
                                  </div>
                                ) : (
                                  <div className="p-2 text-[9px] text-slate-600 font-mono">
                                    —
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----------------- TAB C: MY ROSTER & DEPTH CHART ----------------- */}
          {activeTab === 'ROSTER' && (
            <div className="space-y-5">
              
              {/* Draft Grade & Report Banner (when finished or in-progress) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 flex items-center justify-center font-display font-black text-2xl text-cyan-400 shadow">
                    {draftGrade.grade}
                  </div>
                  <div>
                    <h3 className="text-base font-display font-black text-white uppercase">
                      {userTeamName} Mock Roster
                    </h3>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">
                      {draftGrade.text} · Total WAR: <strong className="text-amber-400">{userTotalWar.toFixed(1)}</strong>
                    </p>
                  </div>
                </div>

                {isDraftFinished && (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playBatCrack(true);
                      onApplyRoster(userRoster);
                      onClose();
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Apply to Active 26-Man Lineup
                  </button>
                )}
              </div>

              {/* Roster Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {userRoster.map((player, idx) => {
                  const badge = getSleeperPositionBadge(player.position);
                  return (
                    <div
                      key={player.id}
                      onClick={() => setInspectedCard(player)}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 font-bold w-4">
                          #{idx + 1}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                          {player.avatarIcon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-xs uppercase text-white truncate">
                              {player.name}
                            </span>
                            <span className={`px-1 py-0.2 rounded text-[8.5px] font-mono font-bold border ${badge.bg}`}>
                              {player.position}
                            </span>
                          </div>
                          <span className="text-[9.5px] font-mono text-slate-400 truncate block">
                            {player.team} · CON {player.stats.contact} / POW {player.stats.power}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black text-amber-400">
                          {player.bRefWar.toFixed(1)} WAR
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* ================= 5. CARD 3D PREVIEW MODAL POPUP ================= */}
        {inspectedCard && (
          <div 
            onClick={() => setInspectedCard(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center pt-2">
                <Card3D card={inspectedCard} size="normal" interactive={true} />
              </div>

              <div className="text-center">
                <h4 className="font-display font-black text-lg text-white uppercase">{inspectedCard.name}</h4>
                <p className="text-xs font-mono text-cyan-300">{inspectedCard.team} · {inspectedCard.position} · WAR {inspectedCard.bRefWar}</p>
              </div>

              {isUserTurn && !isDraftFinished && !draftedIdsSet.has(inspectedCard.id) && (
                <button
                  type="button"
                  onClick={() => {
                    executeDraftPick(inspectedCard, true);
                    setInspectedCard(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow"
                >
                  Draft {inspectedCard.name} Now
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
