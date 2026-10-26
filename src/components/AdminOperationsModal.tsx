import React, { useState, useMemo } from 'react';
import { PlayerCard, CardSetId, RefractorTier } from '../types/game';
import { ALL_PLAYERS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { telemetry, CrashReport, UserSessionData } from '../services/telemetry';
import { soundManager } from '../services/audio';
import { Card3D } from './Card3D';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Coins, 
  Users, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Trash2, 
  Download, 
  Plus, 
  RefreshCw,
  Terminal,
  Activity,
  Sliders,
  Search,
  Eye,
  Shield
} from 'lucide-react';

interface AdminOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Currency controls
  franchisePoints: number;
  onSetFranchisePoints: (newVal: number) => void;
  vendingTokens: number;
  onSetVendingTokens: (newVal: number) => void;
  // Roster controls
  roster: PlayerCard[];
  onAddCardToRoster: (card: PlayerCard) => void;
  onUpdateRoster: (newRoster: PlayerCard[]) => void;
  // Match & game state overrides
  homeScore: number;
  awayScore: number;
  onSetScores: (home: number, away: number) => void;
  seasonRecord: { wins: number; losses: number; gamesPlayed: number };
  onSetSeasonRecord: (rec: { wins: number; losses: number; gamesPlayed: number; mode: '162_SEASON' }) => void;
  onBroadcastLog: (text: string, type: 'chop' | 'hit' | 'out' | 'info' | 'homerun') => void;
}

export const AdminOperationsModal: React.FC<AdminOperationsModalProps> = ({
  isOpen,
  onClose,
  franchisePoints,
  onSetFranchisePoints,
  vendingTokens,
  onSetVendingTokens,
  roster,
  onAddCardToRoster,
  onUpdateRoster,
  homeScore,
  awayScore,
  onSetScores,
  seasonRecord,
  onSetSeasonRecord,
  onBroadcastLog
}) => {
  // Passcode gate state: strictly requires 892308
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Operations Sub-Tab
  const [activeTab, setActiveTab] = useState<'CRASH_REPORTS' | 'USER_DATA' | 'CURRENCY' | 'CARD_MINTING' | 'BALLPARK_STATE' | 'DIAGNOSTICS' | 'CARDS_REGISTRY'>('CARDS_REGISTRY');

  // Crash Reports State
  const [crashReports, setCrashReports] = useState<CrashReport[]>(telemetry.getCrashReports());
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(null);

  // Cards & Teams Registry State
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryTeam, setRegistryTeam] = useState('ALL');
  const [registrySet, setRegistrySet] = useState('ALL');
  const [registryPos, setRegistryPos] = useState('ALL');
  const [registryInspectedCard, setRegistryInspectedCard] = useState<PlayerCard | null>(null);

  // Registry memoized lists
  const registryTeams = useMemo(() => {
    const set = new Set<string>();
    ALL_PLAYERS.forEach((p) => set.add(p.team));
    return Array.from(set).sort();
  }, []);

  const filteredRegistryPlayers = useMemo(() => {
    return ALL_PLAYERS.filter((card) => {
      const matchSearch =
        registrySearch === '' ||
        card.name.toLowerCase().includes(registrySearch.toLowerCase()) ||
        card.team.toLowerCase().includes(registrySearch.toLowerCase()) ||
        card.position.toLowerCase().includes(registrySearch.toLowerCase()) ||
        (card.cardNo && card.cardNo.toString().includes(registrySearch));
      const matchTeam = registryTeam === 'ALL' || card.team === registryTeam;
      const matchSet = registrySet === 'ALL' || (card.cardSetId || 'SERIES_1') === registrySet;
      const matchPos = registryPos === 'ALL' || card.position === registryPos;
      return matchSearch && matchTeam && matchSet && matchPos;
    });
  }, [registrySearch, registryTeam, registrySet, registryPos]);

  // Currency adjustment forms
  const [pointDelta, setPointDelta] = useState<number>(1000);
  const [tokenDelta, setTokenDelta] = useState<number>(5);
  const [auditLog, setAuditLog] = useState<string[]>([
    'System initialization: Default player balances verified.',
    'Currency gateway: Local state ready for operations overrides.'
  ]);

  // Card Minting form
  const [mintPlayerId, setMintPlayerId] = useState<string>(ALL_PLAYERS[0].id);
  const [mintTier, setMintTier] = useState<RefractorTier>('SUPERFRACTOR_1_OF_1');
  const [mintSetId, setMintSetId] = useState<CardSetId>('SERIES_1');
  const [mintSerial, setMintSerial] = useState('1/1');
  const [mintSuccessMsg, setMintSuccessMsg] = useState('');

  // Ballpark Override Form
  const [editHome, setEditHome] = useState(homeScore);
  const [editAway, setEditAway] = useState(awayScore);
  const [editWins, setEditWins] = useState(seasonRecord.wins);
  const [editLosses, setEditLosses] = useState(seasonRecord.losses);

  if (!isOpen) return null;

  // Handle Passcode Unlock
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === '892308') {
      setIsAuthorized(true);
      setAuthError(false);
      soundManager.playJackpotChime();
    } else {
      setAuthError(true);
      soundManager.playUmpireCall(true);
    }
  };

  const handleLock = () => {
    setIsAuthorized(false);
    setPasscode('');
    setAuthError(false);
    soundManager.playButtonClick();
  };

  const logAudit = (msg: string) => {
    setAuditLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 20)]);
  };

  // Currency Adjustments
  const applyPointAdjustment = (delta: number, reason: string) => {
    const next = Math.max(0, franchisePoints + delta);
    onSetFranchisePoints(next);
    logAudit(`Franchise Points adjusted by ${delta > 0 ? '+' : ''}${delta} (${reason}). New balance: ${next}`);
    onBroadcastLog(`🪙 Operations adjustment: ${delta > 0 ? '+' : ''}${delta} Franchise Points applied.`, 'info');
    soundManager.playJackpotChime();
  };

  const applyTokenAdjustment = (delta: number, reason: string) => {
    const next = Math.max(0, vendingTokens + delta);
    onSetVendingTokens(next);
    logAudit(`Vending Tokens adjusted by ${delta > 0 ? '+' : ''}${delta} (${reason}). New balance: ${next}`);
    onBroadcastLog(`🥫 Operations adjustment: ${delta > 0 ? '+' : ''}${delta} Vending Tokens applied.`, 'info');
    soundManager.playJackpotChime();
  };

  // Card Minting Execution
  const handleMintCard = () => {
    const base = ALL_PLAYERS.find((p) => p.id === mintPlayerId) || ALL_PLAYERS[0];
    const minted: PlayerCard = {
      ...base,
      id: `MINT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      refractorTier: mintTier,
      cardSetId: mintSetId,
      serialStamp: mintSerial.trim() || undefined
    };
    onAddCardToRoster(minted);
    logAudit(`Minted card #${minted.cardNo} ${minted.name} (${mintTier}, Set: ${mintSetId}, Stamp: ${mintSerial})`);
    onBroadcastLog(`✨ Operations Mint: ${minted.name} (${mintTier}) added to 26-man roster!`, 'chop');
    soundManager.playRefractorShine();
    setMintSuccessMsg(`Successfully minted & added ${minted.name} (${mintTier})!`);
    setTimeout(() => setMintSuccessMsg(''), 4000);
  };

  // Simulate Crash Test
  const handleSimulateCrash = () => {
    telemetry.logCrash({
      id: `CR-${Date.now().toString().slice(-4)}`,
      timestamp: Date.now(),
      message: 'Simulated exception test: WebGL context lost during high-refractor 3D tilt',
      severity: 'CRITICAL',
      deviceInfo: telemetry.getDeviceString(),
      source: 'Operations.SimulateCrashTest:handleSimulateCrash',
      stack: 'Error: Simulated WebGL loss\n  at Card3D.tsx:render:342\n  at AtBatArena.tsx:188',
      resolved: false
    });
    setCrashReports([...telemetry.getCrashReports()]);
    soundManager.playUmpireCall(true);
  };

  const handleResolveCrash = (id: string) => {
    telemetry.resolveCrash(id);
    setCrashReports([...telemetry.getCrashReports()]);
  };

  const handleClearCrashes = () => {
    telemetry.clearCrashes();
    setCrashReports([]);
    setSelectedCrash(null);
  };

  const exportJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-5xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] border border-orange-500/40">
        
        {/* Top Metallic Orange/Cyan System Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-cyan-500" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500 flex items-center justify-center text-orange-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                  OPERATIONS & BACKEND COMMAND
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-red-600/80 text-white border border-red-400">
                  SECURE GM CONSOLE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-time crash reporting, user sessions, economy adjustments, and card minting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button
                type="button"
                onClick={handleLock}
                className="px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Console
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Operations Modal"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= IF LOCKED: PASSCODE GATE (892308) ================= */}
        {!isAuthorized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border-2 border-orange-500/60 flex items-center justify-center text-orange-400 mb-4 shadow-[0_0_25px_rgba(234,88,12,0.3)]">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-display font-black text-white uppercase tracking-wide mb-1">
              OPERATIONS ACCESS RESTRICTED
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-5">
              Enter your authorized 6-digit administrator code to access live crash logs, user session databases, and economy controls.
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="••••••"
                  className="w-full bg-slate-950/80 border-2 border-slate-700 focus:border-orange-500 rounded-2xl py-3 px-4 text-center text-2xl font-mono tracking-widest text-white outline-none shadow-inner transition-colors placeholder:text-slate-600 placeholder:text-sm placeholder:tracking-normal"
                />
              </div>

              {authError && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-red-400 bg-red-950/40 py-1.5 rounded-lg border border-red-800">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Access Denied: Invalid passcode.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Secure Authenticate
              </button>
            </form>
          </div>
        ) : (
          /* ================= IF AUTHENTICATED: OPERATIONS CENTER ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('CARDS_REGISTRY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'CARDS_REGISTRY'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> Teams & Cards Registry ({ALL_PLAYERS.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CRASH_REPORTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'CRASH_REPORTS'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Crash Reports ({crashReports.filter((c) => !c.resolved).length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('USER_DATA')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'USER_DATA'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> User Sign-Up Data
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CURRENCY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'CURRENCY'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Coins className="w-3.5 h-3.5" /> Adjust Currency
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CARD_MINTING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'CARD_MINTING'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Card Minting GM
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BALLPARK_STATE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'BALLPARK_STATE'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Ballpark State
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DIAGNOSTICS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'DIAGNOSTICS'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Diagnostics & PWA
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="flex-1 overflow-y-auto pr-1">

              {/* ================= TAB 0: TEAMS & CARDS REGISTRY ================= */}
              {activeTab === 'CARDS_REGISTRY' && (
                <div className="space-y-4 animate-fade-in pb-4">
                  {/* Registry Header & Stats Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-display font-black text-white uppercase flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-400" />
                          Master Teams, Players & Cards Registry
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                          VERIFIED MLB ROSTER
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Authoritative game catalog: All 30 MLB franchises, official 26-man active rosters (780 total cards), and authentic collectible sets.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => exportJSON(ALL_PLAYERS, `the-baltimore-chop-master-players-${Date.now()}.json`)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Master JSON
                      </button>
                    </div>
                  </div>

                  {/* Summary Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Players</span>
                      <span className="text-lg font-mono font-black text-white">{ALL_PLAYERS.length} Cards</span>
                      <span className="text-[10px] text-emerald-400 font-mono block">26 Players / Team</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">MLB Franchises</span>
                      <span className="text-lg font-mono font-black text-orange-400">{registryTeams.length} Teams</span>
                      <span className="text-[10px] text-slate-400 font-mono block">AL & NL 6 Divisions</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Card Sets</span>
                      <span className="text-lg font-mono font-black text-cyan-400">{CARD_SETS.length} Sets</span>
                      <span className="text-[10px] text-slate-400 font-mono block">Series 1 to Ginter</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Highest bRef WAR</span>
                      <span className="text-lg font-mono font-black text-amber-400">162.2</span>
                      <span className="text-[10px] text-slate-400 font-mono block">Babe Ruth (DH/P)</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Active 26-Man Roster</span>
                      <span className="text-lg font-mono font-black text-purple-400">{roster.length} / 26</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{26 - roster.length} Open Slots</span>
                    </div>
                  </div>

                  {/* Filters & Search Toolbar */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={registrySearch}
                        onChange={(e) => setRegistrySearch(e.target.value)}
                        placeholder="Search player, team, #, or position..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-500 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <select
                      value={registryTeam}
                      onChange={(e) => setRegistryTeam(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">All Franchises ({registryTeams.length})</option>
                      {registryTeams.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={registryPos}
                      onChange={(e) => setRegistryPos(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">All Positions</option>
                      <option value="C">Catcher (C)</option>
                      <option value="1B">First Base (1B)</option>
                      <option value="2B">Second Base (2B)</option>
                      <option value="3B">Third Base (3B)</option>
                      <option value="SS">Shortstop (SS)</option>
                      <option value="LF">Left Field (LF)</option>
                      <option value="CF">Center Field (CF)</option>
                      <option value="RF">Right Field (RF)</option>
                      <option value="DH">Designated Hitter (DH)</option>
                      <option value="SP">Starting Pitcher (SP)</option>
                      <option value="RP">Relief Pitcher (RP)</option>
                    </select>

                    <select
                      value={registrySet}
                      onChange={(e) => setRegistrySet(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                    >
                      <option value="ALL">All Sets ({CARD_SETS.length})</option>
                      {CARD_SETS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>

                    {(registrySearch || registryTeam !== 'ALL' || registryPos !== 'ALL' || registrySet !== 'ALL') && (
                      <button
                        type="button"
                        onClick={() => {
                          setRegistrySearch('');
                          setRegistryTeam('ALL');
                          setRegistryPos('ALL');
                          setRegistrySet('ALL');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Master Players Registry Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/70">
                    <div className="overflow-x-auto max-h-[380px]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] sticky top-0 z-10 border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Card #</th>
                            <th className="py-2.5 px-3">Player</th>
                            <th className="py-2.5 px-3">Franchise</th>
                            <th className="py-2.5 px-3">POS</th>
                            <th className="py-2.5 px-3">bRef WAR</th>
                            <th className="py-2.5 px-3">Attributes (PWR/CON/DEF/SPD)</th>
                            <th className="py-2.5 px-3">Set</th>
                            <th className="py-2.5 px-3">Roster</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {filteredRegistryPlayers.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-8 text-center text-slate-500 font-mono text-xs">
                                No cards matched the specified filters.
                              </td>
                            </tr>
                          ) : (
                            filteredRegistryPlayers.map((player) => {
                              const inRoster = roster.some((c) => c.name === player.name);
                              const rosterCount = roster.filter((c) => c.name === player.name).length;
                              const matchingSet = CARD_SETS.find((s) => s.id === player.cardSetId);

                              return (
                                <tr key={player.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="py-2.5 px-3 font-bold text-amber-400">
                                    #{player.cardNo || '00'}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shadow shrink-0">
                                        {player.avatarIcon}
                                      </div>
                                      <div>
                                        <div className="font-bold text-white flex items-center gap-1.5">
                                          {player.name}
                                          {player.isHistorical ? (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                                              Legend
                                            </span>
                                          ) : (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                                              Active
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          {player.era || (player.isHistorical ? 'Historical HOF' : '2024 MLB')}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                                      {player.team}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="font-black px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
                                      {player.position}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 font-black">
                                    <span className={
                                      player.bRefWar >= 100
                                        ? 'text-amber-400 font-extrabold'
                                        : player.bRefWar >= 60
                                        ? 'text-emerald-400'
                                        : player.bRefWar >= 20
                                        ? 'text-cyan-400'
                                        : 'text-slate-300'
                                    }>
                                      {player.bRefWar > 0 ? `+${player.bRefWar.toFixed(1)}` : player.bRefWar.toFixed(1)}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <span title="Power" className="text-orange-400 font-bold">{player.stats.power}P</span>
                                      <span title="Contact" className="text-cyan-400 font-bold">{player.stats.contact}C</span>
                                      <span title="Fielding" className="text-emerald-400 font-bold">{player.stats.fielding}D</span>
                                      <span title="Speed" className="text-purple-400 font-bold">{player.stats.speed}S</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-400">
                                    {matchingSet?.name || player.cardSetId || 'Series 1'}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    {inRoster ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                                        <CheckCircle2 className="w-3 h-3" /> {rosterCount}x
                                      </span>
                                    ) : (
                                      <span className="text-slate-600 text-[10px]">Bench</span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRegistryInspectedCard(player);
                                          soundManager.playButtonClick();
                                        }}
                                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors"
                                        title="Inspect in 3D"
                                      >
                                        <Eye className="w-3 h-3 text-cyan-400" /> 3D
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const cardCopy: PlayerCard = {
                                            ...player,
                                            id: `ROSTER-${player.id}-${Date.now().toString().slice(-4)}`
                                          };
                                          onAddCardToRoster(cardCopy);
                                          logAudit(`Added #${player.cardNo} ${player.name} to 26-man roster`);
                                          onBroadcastLog(`⚾ Operations: Added ${player.name} to active roster!`, 'info');
                                          soundManager.playJackpotChime();
                                        }}
                                        disabled={roster.length >= 26}
                                        className="px-2 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 disabled:opacity-40 text-orange-300 border border-orange-500/30 text-[11px] font-mono flex items-center gap-1 transition-colors"
                                        title="Add card to active roster"
                                      >
                                        <Plus className="w-3 h-3" /> Add
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3D Card Inspector Modal Overlay */}
                  {registryInspectedCard && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                      <div className="bg-slate-950 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl relative">
                        <button
                          type="button"
                          onClick={() => setRegistryInspectedCard(null)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-[200px] h-[280px] shrink-0">
                            <Card3D
                              card={registryInspectedCard}
                              interactive={true}
                              size="normal"
                            />
                          </div>

                          <div className="flex-1 space-y-3 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-black text-amber-400">
                                CARD #{registryInspectedCard.cardNo || '00'}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase">
                                {registryInspectedCard.position}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-slate-900 text-slate-300 border border-slate-700">
                                {registryInspectedCard.team}
                              </span>
                            </div>

                            <h3 className="text-xl font-display font-black text-white">
                              {registryInspectedCard.name}
                            </h3>

                            <p className="text-xs text-slate-300 font-sans leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                              "{registryInspectedCard.bio}"
                            </p>

                            <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">WAR</span>
                                <span className="text-sm font-bold text-amber-400">
                                  {registryInspectedCard.bRefWar.toFixed(1)}
                                </span>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">PWR</span>
                                <span className="text-sm font-bold text-orange-400">
                                  {registryInspectedCard.stats.power}
                                </span>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">CON</span>
                                <span className="text-sm font-bold text-cyan-400">
                                  {registryInspectedCard.stats.contact}
                                </span>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">FLD</span>
                                <span className="text-sm font-bold text-emerald-400">
                                  {registryInspectedCard.stats.fielding}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const cardCopy: PlayerCard = {
                                    ...registryInspectedCard,
                                    id: `ROSTER-${registryInspectedCard.id}-${Date.now().toString().slice(-4)}`
                                  };
                                  onAddCardToRoster(cardCopy);
                                  logAudit(`Added #${registryInspectedCard.cardNo} ${registryInspectedCard.name} to 26-man roster`);
                                  onBroadcastLog(`⚾ Operations: Added ${registryInspectedCard.name} to active roster!`, 'info');
                                  soundManager.playJackpotChime();
                                  setRegistryInspectedCard(null);
                                }}
                                disabled={roster.length >= 26}
                                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-slate-950 font-display font-black text-xs uppercase transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-4 h-4" /> Add Card to Active 26-Man Roster
                              </button>
                              <button
                                type="button"
                                onClick={() => setRegistryInspectedCard(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 1: CRASH REPORTS & LOGS ================= */}
              {activeTab === 'CRASH_REPORTS' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-display font-black text-white uppercase">
                        Application Crash & Exception Logs
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Captures uncaught runtime errors, unhandled promise rejections, and browser compatibility notices.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSimulateCrash}
                        className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-mono transition-colors"
                      >
                        + Simulate Crash Test
                      </button>
                      <button
                        type="button"
                        onClick={() => exportJSON(crashReports, 'chop-crash-reports.json')}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-mono flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Export JSON
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCrashes}
                        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                        title="Clear all logs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {crashReports.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-950/60 rounded-2xl border border-white/5">
                      No active crash reports. System health is optimal (0 exceptions).
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {crashReports.map((report) => (
                        <div
                          key={report.id}
                          className={`p-3 rounded-2xl border transition-all ${
                            report.resolved
                              ? 'bg-slate-950/40 border-slate-800 opacity-60'
                              : report.severity === 'CRITICAL'
                              ? 'bg-red-950/20 border-red-600/50'
                              : 'bg-amber-950/20 border-amber-500/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded uppercase ${
                                  report.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                                }`}>
                                  {report.severity}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-300">
                                  {report.id}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {new Date(report.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 rounded">
                                  {report.deviceInfo}
                                </span>
                              </div>
                              <p className="text-xs font-mono text-white mb-1">
                                {report.message}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                Source: {report.source}
                              </span>
                              {report.stack && (
                                <pre className="mt-2 p-2 rounded bg-black/60 text-[9px] font-mono text-slate-400 overflow-x-auto max-h-24">
                                  {report.stack}
                                </pre>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleResolveCrash(report.id)}
                              className={`px-2 py-1 rounded text-[10px] font-mono shrink-0 transition-colors ${
                                report.resolved
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {report.resolved ? 'Resolved ✓' : 'Mark Resolved'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: USER SIGN-UP DATA ================= */}
              {activeTab === 'USER_DATA' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-display font-black text-white uppercase">
                        Registered Users & Active Player Sessions
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        User account tracking, device types, win records, and economy balances.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => exportJSON(telemetry.getUsers(), 'chop-users-data.json')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-mono flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Users JSON
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3">User ID</th>
                          <th className="p-3">Handle</th>
                          <th className="p-3">Device / Browser</th>
                          <th className="p-3">Record / Win%</th>
                          <th className="p-3">Franchise Points</th>
                          <th className="p-3">Tokens</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {telemetry.getUsers().map((u) => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-amber-400">{u.id}</td>
                            <td className="p-3 font-bold text-white flex items-center gap-1.5">
                              <span>👑</span> {u.username}
                            </td>
                            <td className="p-3 text-slate-300">
                              {u.device} · <span className="text-slate-500">{u.browser}</span>
                            </td>
                            <td className="p-3 text-emerald-400 font-bold">
                              {u.gamesPlayed} G · {u.winRate}
                            </td>
                            <td className="p-3 font-bold text-yellow-300">🪙 {u.franchisePoints}</td>
                            <td className="p-3 font-bold text-cyan-300">🥫 {u.vendingTokens}</td>
                            <td className="p-3">
                              <span className={`text-[9px] px-2 py-0.5 rounded font-black ${
                                u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: ADJUST CURRENCY ================= */}
              {activeTab === 'CURRENCY' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-display font-black text-white uppercase">
                      In-Game Currency & Economy Adjuster
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Fix currency issues, credit missing tokens, grant compensation packs, or deduct balances with full audit logging.
                    </p>
                  </div>

                  {/* Current Balances Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-400 uppercase">Franchise Points Balance</span>
                        <Coins className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-3xl font-display font-black text-amber-400 mb-3">
                        🪙 {franchisePoints.toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => applyPointAdjustment(500, 'Operations Grant')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-mono"
                        >
                          +500
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPointAdjustment(2500, 'Pack Refund / Compensation')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-mono"
                        >
                          +2,500
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPointAdjustment(10000, 'Tournament Admin Reward')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-mono"
                        >
                          +10,000
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPointAdjustment(-1000, 'Admin Correction')}
                          className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-mono"
                        >
                          -1,000
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-400 uppercase">Vending Machine Tokens</span>
                        <span className="text-xl">🥫</span>
                      </div>
                      <div className="text-3xl font-display font-black text-emerald-400 mb-3">
                        🥫 {vendingTokens} Tokens
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => applyTokenAdjustment(1, 'Daily Token Bonus')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono"
                        >
                          +1 Token
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTokenAdjustment(5, 'Task Completion Compensation')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono"
                        >
                          +5 Tokens
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTokenAdjustment(20, 'Master Pack Bundle Grant')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-mono"
                        >
                          +20 Tokens
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTokenAdjustment(-1, 'Deduction Override')}
                          className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-mono"
                        >
                          -1 Token
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Compensation Pack */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/30 flex items-center justify-between">
                    <div>
                      <h5 className="font-display font-black text-white text-sm uppercase">
                        Issue Starter Compensation Bundle
                      </h5>
                      <p className="text-xs text-slate-400 font-mono">
                        Instantly credits +3,000 Franchise Points & +5 Vending Tokens to resolve user support tickets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        applyPointAdjustment(3000, 'Starter Compensation Bundle');
                        applyTokenAdjustment(5, 'Starter Compensation Bundle');
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-display font-black text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
                    >
                      Issue Bundle 🎁
                    </button>
                  </div>

                  {/* Currency Audit Log */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
                      Live Currency Operations Audit Trail
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto text-[11px] font-mono text-slate-300">
                      {auditLog.map((log, i) => (
                        <div key={i} className="text-slate-400">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: CARD MINTING GM TOOL ================= */}
              {activeTab === 'CARD_MINTING' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-display font-black text-white uppercase">
                      Game Master Card Minting & Set Drops
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Mint custom cards with refractor finishes, customized serial numbers (#/25, 1/1), and inject directly into the 26-man roster.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-3">
                      <div>
                        <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                          Select Player
                        </label>
                        <select
                          value={mintPlayerId}
                          onChange={(e) => setMintPlayerId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-purple-400"
                        >
                          {ALL_PLAYERS.map((p) => (
                            <option key={p.id} value={p.id}>
                              #{p.cardNo || 0} {p.name} ({p.position} · WAR {p.bRefWar.toFixed(1)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                            Refractor Tier
                          </label>
                          <select
                            value={mintTier}
                            onChange={(e) => setMintTier(e.target.value as RefractorTier)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-purple-400"
                          >
                            <option value="BASE">BASE</option>
                            <option value="RAINBOW">RAINBOW</option>
                            <option value="GOLD_WAVE">GOLD WAVE</option>
                            <option value="SAPPHIRE">SAPPHIRE</option>
                            <option value="ATOMIC_MOJO">ATOMIC MOJO</option>
                            <option value="SUPERFRACTOR_1_OF_1">SUPERFRACTOR 1/1</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                            Card Set Release
                          </label>
                          <select
                            value={mintSetId}
                            onChange={(e) => setMintSetId(e.target.value as CardSetId)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-purple-400"
                          >
                            {CARD_SETS.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                          Serial Stamp Stamp (Optional)
                        </label>
                        <input
                          type="text"
                          value={mintSerial}
                          onChange={(e) => setMintSerial(e.target.value)}
                          placeholder="e.g. 1/1, #/25, #/50"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-purple-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleMintCard}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-display font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" /> Mint & Add To Roster
                      </button>

                      {mintSuccessMsg && (
                        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-xs text-center animate-fade-in">
                          {mintSuccessMsg}
                        </div>
                      )}
                    </div>

                    {/* Preview of Card to be Minted */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                        Live Mint Preview
                      </span>
                      {(() => {
                        const base = ALL_PLAYERS.find((p) => p.id === mintPlayerId) || ALL_PLAYERS[0];
                        return (
                          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 flex flex-col items-center max-w-xs w-full">
                            <span className="text-4xl mb-1">{base.avatarIcon}</span>
                            <h5 className="font-display font-black text-white text-base uppercase">
                              {base.name}
                            </h5>
                            <span className="text-xs font-mono text-amber-400 font-bold">
                              {base.position} · bRef WAR: {base.bRefWar.toFixed(1)}
                            </span>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-600 text-white uppercase">
                                {mintTier.replace(/_/g, ' ')}
                              </span>
                              {mintSerial && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                                  {mintSerial}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 5: BALLPARK & GAME STATE ================= */}
              {activeTab === 'BALLPARK_STATE' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-display font-black text-white uppercase">
                      Ballpark & Franchise Match Overrides
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Directly set home/away runs, override season wins/losses, or broadcast live broadcast announcements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Score Control */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-3">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                        Match Score Override
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">
                            BALTIMORE (HOME)
                          </label>
                          <input
                            type="number"
                            value={editHome}
                            onChange={(e) => setEditHome(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-lg font-black text-orange-400 text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">
                            VISITOR (AWAY)
                          </label>
                          <input
                            type="number"
                            value={editAway}
                            onChange={(e) => setEditAway(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-lg font-black text-slate-300 text-center"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSetScores(editHome, editAway);
                          logAudit(`Score set to BAL ${editHome} - ${editAway} OPP`);
                        }}
                        className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-display font-black text-xs uppercase"
                      >
                        Apply Score Override
                      </button>
                    </div>

                    {/* Season Record Control */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-3">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                        162-Game Season Record Override
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">
                            WINS
                          </label>
                          <input
                            type="number"
                            value={editWins}
                            onChange={(e) => setEditWins(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-lg font-black text-emerald-400 text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">
                            LOSSES
                          </label>
                          <input
                            type="number"
                            value={editLosses}
                            onChange={(e) => setEditLosses(parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-lg font-black text-red-400 text-center"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSetSeasonRecord({
                            wins: editWins,
                            losses: editLosses,
                            gamesPlayed: editWins + editLosses,
                            mode: '162_SEASON'
                          });
                          logAudit(`Season record set to ${editWins}-${editLosses}`);
                        }}
                        className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-display font-black text-xs uppercase"
                      >
                        Apply Season Record
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 6: DIAGNOSTICS & PWA ================= */}
              {activeTab === 'DIAGNOSTICS' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-display font-black text-white uppercase">
                      Client Diagnostics, PWA & Storage Health
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Service worker inspection, memory caching, and device hardware capabilities.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        PWA Service Worker
                      </span>
                      <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto-Update Active
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Workbox precaches fonts & assets
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Web Audio Engine
                      </span>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {typeof window !== 'undefined' && 'AudioContext' in window ? 'Synthesizer Ready' : 'Fallback'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Procedural sound without audio lag
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Haptic Engine
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-400">
                        {typeof navigator !== 'undefined' && 'vibrate' in navigator ? 'Hardware Vibration Active' : 'DOM Shake Active'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Tactile feedback on hits & rips
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-display font-black text-white text-xs uppercase">
                        Clear Cache & Reset Client Storage
                      </h5>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Forces a clean service worker refresh and reloads local assets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.localStorage.clear();
                          window.sessionStorage.clear();
                          logAudit('Local and session storage cleared.');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                    >
                      Clear Storage
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
