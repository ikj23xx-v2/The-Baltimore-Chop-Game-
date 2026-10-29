import React, { useState, useMemo } from 'react';
import { PlayerCard, CardSetId, RefractorTier } from '../types/game';
import { CARD_SETS } from '../data/sets';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { 
  Sparkles, 
  Award, 
  Search, 
  Eye, 
  CheckCircle2, 
  ArrowUpDown, 
  SlidersHorizontal,
  Flame,
  ShieldAlert,
  Zap,
  UserPlus,
  Plus
} from 'lucide-react';

interface DraftBoardGridProps {
  roster: PlayerCard[];
  activeBatterId: string;
  onSelectActiveBatter: (player: PlayerCard) => void;
  onInspectCard: (player: PlayerCard) => void;
  onOpenForge: () => void;
  onOpenDraft: () => void;
  onAutoDraft?: () => void;
  onClearRoster?: () => void;
  teamName?: string;
}

type PositionFilter = 'ALL' | 'INFIELD' | 'OUTFIELD' | 'PITCHER' | 'REFRACTORS';
type ViewFormat = 'BOARD' | 'TABLE';

export const DraftBoardGrid: React.FC<DraftBoardGridProps> = ({
  roster,
  activeBatterId,
  onSelectActiveBatter,
  onInspectCard,
  onOpenForge,
  onOpenDraft,
  onAutoDraft,
  onClearRoster,
  teamName = 'All-MLB All-Stars',
}) => {
  const [filter, setFilter] = useState<PositionFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'WAR' | 'NAME' | 'POWER' | 'CONTACT'>('WAR');
  const [viewFormat, setViewFormat] = useState<ViewFormat>('BOARD');

  // Filtered & Sorted players
  const filteredPlayers = useMemo(() => {
    return roster
      .filter((p) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchPos = p.position.toLowerCase().includes(q);
          const matchSkill = p.signatureSkill?.toLowerCase().includes(q);
          if (!matchName && !matchPos && !matchSkill) return false;
        }

        // Category filter
        if (filter === 'REFRACTORS') return p.refractorTier !== 'BASE';
        if (filter === 'INFIELD') return ['1B', '2B', '3B', 'SS', 'C'].includes(p.position);
        if (filter === 'OUTFIELD') return ['OF', 'LF', 'CF', 'RF'].includes(p.position);
        if (filter === 'PITCHER') return ['SP', 'RP', 'CP'].includes(p.position);
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'WAR') return b.bRefWar - a.bRefWar;
        if (sortBy === 'POWER') return b.stats.power - a.stats.power;
        if (sortBy === 'CONTACT') return b.stats.contact - a.stats.contact;
        return a.name.localeCompare(b.name);
      });
  }, [roster, filter, searchQuery, sortBy]);

  // Position groupings for Stick-to-the-board columns with target counts
  const positionColumns: { title: string; positions: string[]; color: string; targetCount: number }[] = [
    { title: 'CATCHER', positions: ['C'], color: 'from-amber-600/30 to-amber-900/10 text-amber-300', targetCount: 1 },
    { title: 'CORNER INFIELD', positions: ['1B', '3B'], color: 'from-orange-600/30 to-orange-900/10 text-orange-300', targetCount: 4 },
    { title: 'MIDDLE INFIELD', positions: ['2B', 'SS'], color: 'from-red-600/30 to-red-900/10 text-red-300', targetCount: 3 },
    { title: 'OUTFIELD', positions: ['OF', 'LF', 'CF', 'RF'], color: 'from-blue-600/30 to-blue-900/10 text-blue-300', targetCount: 4 },
    { title: 'PITCHING STAFF', positions: ['SP', 'RP', 'CP'], color: 'from-emerald-600/30 to-emerald-900/10 text-emerald-300', targetCount: 13 },
  ];

  const handleSelect = (player: PlayerCard) => {
    soundManager.playButtonClick();
    triggerHapticFeedback('LIGHT');
    onSelectActiveBatter(player);
  };

  const handleInspect = (e: React.MouseEvent, player: PlayerCard) => {
    e.stopPropagation();
    soundManager.playCardWhoosh();
    onInspectCard(player);
  };

  const getRefractorBadge = (tier: RefractorTier) => {
    switch (tier) {
      case 'SUPERFRACTOR_1_OF_1':
        return (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 text-slate-950 shadow-sm border border-amber-200">
            1/1 SUPERFRACTOR
          </span>
        );
      case 'ATOMIC_MOJO':
        return (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-purple-900/80 text-fuchsia-300 border border-fuchsia-500/40">
            ATOMIC MOJO
          </span>
        );
      case 'SAPPHIRE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            SAPPHIRE
          </span>
        );
      case 'GOLD_WAVE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            GOLD WAVE
          </span>
        );
      case 'RAINBOW':
        return (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-900 text-slate-200 border border-slate-700">
            RAINBOW FOIL
          </span>
        );
      default:
        return null;
    }
  };

  const isRosterBlank = roster.length === 0;
  const isRosterComplete = roster.length >= 26;

  return (
    <div className="w-full space-y-4">
      {/* ================= STICKTOTHEBOARD.COM DRAFT TICKER / HEADER ================= */}
      <div className="liquid-glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-orange-600/30 text-orange-400 border border-orange-500/40">
              STICK TO THE BOARD • MLB DRAFT MATRIX
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              isRosterBlank
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40 animate-pulse'
                : isRosterComplete
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
            }`}>
              {isRosterBlank
                ? '0 / 26 PLAYERS (BOARD IS BLANK)'
                : isRosterComplete
                ? '26 / 26 OFFICIAL ROSTER COMPLETE'
                : `${roster.length} / 26 DRAFTED (IN PROGRESS)`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-wide text-white uppercase mt-1">
            {teamName} BIG BOARD & DEPTH CHART
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Sleeper-style player card metrics · Authentic collectible sets · 1-Click 3D card inspect & active lineup toggle
          </p>
        </div>

        {/* View Format Switcher & Quick Draft Trigger */}
        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 flex-wrap">
          <div className="bg-slate-950/80 p-1 rounded-xl border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewFormat('BOARD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                viewFormat === 'BOARD'
                  ? 'glass-pill-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Draft Grid
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                viewFormat === 'TABLE'
                  ? 'glass-pill-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Data Table
            </button>
          </div>

          {/* Primary Draft Actions */}
          <button
            type="button"
            onClick={onOpenDraft}
            className={`px-4 py-2 text-white font-display font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isRosterBlank
                ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_20px_rgba(234,88,12,0.6)] animate-pulse'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
            }`}
          >
            <span>🎰</span> {isRosterBlank ? 'Start 26-Man Draft' : 'Open Draft Room'}
          </button>

          {onAutoDraft && isRosterBlank && (
            <button
              type="button"
              onClick={onAutoDraft}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/40 font-display font-bold text-xs uppercase rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Instantly generate a balanced 26-man roster"
            >
              <span>⚡</span> Auto-Draft
            </button>
          )}

          {onClearRoster && !isRosterBlank && (
            <button
              type="button"
              onClick={onClearRoster}
              className="px-2.5 py-2 bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/40 font-mono font-bold text-[11px] uppercase rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              title="Reset board to blank"
            >
              <span>🔄</span> Reset Blank
            </button>
          )}
        </div>
      </div>

      {/* ================= HERO DRAFT AREA (SHOWN PROMINENTLY WHEN BOARD IS BLANK) ================= */}
      {isRosterBlank && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-orange-950/40 p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <span>📋</span> MLB 26-MAN FRANCHISE DRAFT ROOM
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wide">
            YOUR FRANCHISE BIG BOARD IS BLANK
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-2xl mx-auto leading-relaxed">
            No players have been pre-populated before you start. Start your draft to select 26 active MLB stars, historic Baseball-Reference WAR legends, and rare refractors for each position slot.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenDraft}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(234,88,12,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>🎰</span> START YOUR 26-MAN DRAFT
            </button>
            {onAutoDraft && (
              <button
                type="button"
                onClick={onAutoDraft}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 hover:text-white font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span> QUICK AUTO-DRAFT
              </button>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Target Quota: 1 Catcher · 4 Corner Infield · 3 Middle Infield · 4 Outfield · 13 Pitching Staff (Rotation + Bullpen)
          </div>
        </div>
      )}

      {/* ================= CONTROLS & FILTER BAR (SLEEPER / iOS GLASS) ================= */}
      <div className="liquid-glass-panel rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-display font-bold uppercase">
          {(
            [
              { id: 'ALL', label: 'All Players' },
              { id: 'INFIELD', label: 'Infield' },
              { id: 'OUTFIELD', label: 'Outfield' },
              { id: 'PITCHER', label: 'Pitchers' },
              { id: 'REFRACTORS', label: '✨ Refractors' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setFilter(item.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filter === item.id
                  ? 'glass-pill-active'
                  : 'glass-pill text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search & Sort by */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roster..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/80 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-300 shrink-0">
            <ArrowUpDown className="w-3 h-3 text-orange-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none font-mono text-xs cursor-pointer"
            >
              <option value="WAR" className="bg-slate-900 text-white">Sort by WAR</option>
              <option value="POWER" className="bg-slate-900 text-white">Sort by Power</option>
              <option value="CONTACT" className="bg-slate-900 text-white">Sort by Contact</option>
              <option value="NAME" className="bg-slate-900 text-white">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: STICKTOTHEBOARD.COM DRAFT COLUMNS ================= */}
      {viewFormat === 'BOARD' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {positionColumns.map((col) => {
            const playersInCol = filteredPlayers.filter((p) =>
              col.positions.includes(p.position)
            );

            return (
              <div
                key={col.title}
                className="liquid-glass-panel rounded-2xl p-3 flex flex-col gap-2.5 min-h-[380px]"
              >
                {/* Column Header */}
                <div className={`p-2 rounded-xl bg-gradient-to-b ${col.color} border border-white/10 flex items-center justify-between`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span className="text-xs font-display font-black tracking-wider uppercase">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 font-bold border border-white/10 text-slate-300">
                    {playersInCol.length}
                  </span>
                </div>

                {/* Player Cards & Empty Draft Slots in Column */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[580px] pr-1">
                  {/* Drafted players in this column */}
                  {playersInCol.map((player, idx) => {
                    const isActive = player.id === activeBatterId;
                    const setMeta = CARD_SETS.find((s) => s.id === player.cardSetId);

                    return (
                      <div
                        key={player.id}
                        onClick={() => handleSelect(player)}
                        className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                          isActive
                            ? 'bg-orange-950/40 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.35)]'
                            : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/10 hover:border-orange-500/50'
                        }`}
                      >
                        {/* Top: Rank / Active Status & Actions */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-black text-slate-400 bg-black/50 px-1 rounded">
                              #{idx + 1}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-orange-600/30 text-orange-400 border border-orange-500/30 text-[9px] font-mono font-bold">
                              {player.position}
                            </span>
                            {isActive && (
                              <span className="text-[9px] font-mono font-extrabold text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                ACTIVE
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleInspect(e, player)}
                            title="Inspect in 3D Stage"
                            className="p-1 rounded-md bg-white/5 hover:bg-orange-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Sleeper App Style Player Profile */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-400/60 flex items-center justify-center text-lg shrink-0 shadow-sm">
                            {player.avatarIcon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-display font-bold text-white uppercase truncate group-hover:text-orange-400 transition-colors">
                              {player.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                              <span>{player.team}</span>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">WAR: {player.bRefWar}</span>
                            </div>
                          </div>
                        </div>

                        {/* Set Badge & Refractor */}
                        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                          <span className="text-slate-400 truncate max-w-[100px]">
                            {setMeta?.name.replace('Chop ', '') || 'Series 1'}
                          </span>
                          {getRefractorBadge(player.refractorTier)}
                        </div>

                        {/* Mini Stat Bar */}
                        <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                          <span>CON: <strong className="text-white">{player.stats.contact}</strong></span>
                          <span>POW: <strong className="text-amber-400">{player.stats.power}</strong></span>
                          {player.signatureSkill && (
                            <span className="text-orange-400 font-bold truncate max-w-[70px]">
                              {player.signatureSkill.split('_')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Slot Placeholders to reach target count */}
                  {playersInCol.length < col.targetCount && (
                    Array.from({ length: col.targetCount - playersInCol.length }).map((_, emptyIdx) => {
                      const slotNum = playersInCol.length + emptyIdx + 1;
                      return (
                        <div
                          key={`empty-slot-${col.title}-${emptyIdx}`}
                          onClick={onOpenDraft}
                          className="p-3.5 rounded-xl border-2 border-dashed border-slate-800/80 hover:border-amber-500/80 bg-slate-950/40 hover:bg-slate-900/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 group select-none shadow-inner"
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/80 group-hover:border-amber-400 flex items-center justify-center text-slate-500 group-hover:text-amber-400 transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-display font-bold text-slate-400 group-hover:text-amber-300 uppercase block">
                              Draft {col.title} #{slotNum}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400 block mt-0.5">
                              {col.positions.join('/')} · Click to draft
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= VIEW 2: HIGH-DENSITY BIG BOARD DATA TABLE ================= */}
      {viewFormat === 'TABLE' && (
        <div className="liquid-glass-panel rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Rank / Player</th>
                  <th className="py-3 px-2">Pos</th>
                  <th className="py-3 px-2">Era</th>
                  <th className="py-3 px-2 text-amber-400">bRef WAR</th>
                  <th className="py-3 px-2">Contact</th>
                  <th className="py-3 px-2">Power</th>
                  <th className="py-3 px-2">Card Set</th>
                  <th className="py-3 px-2">Parallel</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <span className="text-4xl block">📋</span>
                        <h4 className="font-display font-black text-white text-base uppercase tracking-wider">
                          Franchise Big Board is Blank
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          No players currently populated. Start your official draft to select 26 active stars and historical legends!
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={onOpenDraft}
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display font-black text-xs uppercase rounded-xl transition-all shadow cursor-pointer"
                          >
                            🎰 Start 26-Man Draft
                          </button>
                          {onAutoDraft && (
                            <button
                              type="button"
                              onClick={onAutoDraft}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-display font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                            >
                              ⚡ Quick Auto-Draft
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, idx) => {
                    const isActive = player.id === activeBatterId;
                    const setMeta = CARD_SETS.find((s) => s.id === player.cardSetId);

                    return (
                      <tr
                        key={player.id}
                        onClick={() => handleSelect(player)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isActive ? 'bg-orange-950/30 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] text-slate-500 font-bold w-5">
                              #{idx + 1}
                            </span>
                            <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-400/60 flex items-center justify-center text-sm shrink-0">
                              {player.avatarIcon}
                            </div>
                            <div>
                              <span className="font-display font-bold uppercase text-white tracking-wide block">
                                {player.name}
                              </span>
                              <span className="text-[9px] text-slate-400">{player.team}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                            {player.position}
                          </span>
                        </td>

                        <td className="py-2.5 px-2 text-slate-400 text-[10px]">
                          {player.era}
                        </td>

                        <td className="py-2.5 px-2 font-bold text-amber-400">
                          {player.bRefWar.toFixed(1)}
                        </td>

                        <td className="py-2.5 px-2 text-white font-bold">
                          {player.stats.contact}
                        </td>

                        <td className="py-2.5 px-2 text-amber-300 font-bold">
                          {player.stats.power}
                        </td>

                        <td className="py-2.5 px-2 text-slate-300 text-[10px]">
                          {setMeta?.name || 'Series 1'}
                        </td>

                        <td className="py-2.5 px-2">
                          {getRefractorBadge(player.refractorTier) || (
                            <span className="text-slate-500 text-[10px]">Base Print</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                ACTIVE BATTER
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelect(player);
                                }}
                                className="px-2 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-display font-bold uppercase cursor-pointer"
                              >
                                Equip
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleInspect(e, player)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                              title="Inspect 3D Card"
                            >
                              <Eye className="w-3.5 h-3.5" />
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
      )}
    </div>
  );
};
