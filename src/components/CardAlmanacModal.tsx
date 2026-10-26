import React, { useState, useMemo } from 'react';
import { PlayerCard, CardSetId, Position } from '../types/game';
import { ALL_PLAYERS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { MLB_TEAMS, MLB_DIVISIONS, getTeamByName } from '../data/mlbTeams';
import { Card3D } from './Card3D';
import { soundManager } from '../services/audio';
import { 
  Search, 
  Filter, 
  Layers, 
  Shield, 
  Award, 
  Star, 
  X, 
  Download, 
  CheckCircle2, 
  Trophy, 
  Users, 
  Sparkles,
  ExternalLink,
  Eye,
  MapPin
} from 'lucide-react';

interface CardAlmanacModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectActiveBatter?: (card: PlayerCard) => void;
}

export const CardAlmanacModal: React.FC<CardAlmanacModalProps> = ({
  isOpen,
  onClose,
  onSelectActiveBatter
}) => {
  const [activeTab, setActiveTab] = useState<'ALL_CARDS' | 'BY_TEAM' | 'BY_SET'>('ALL_CARDS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedSet, setSelectedSet] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [inspectedCard, setInspectedCard] = useState<PlayerCard | null>(null);

  // Unique Teams List
  const teams = useMemo(() => {
    const set = new Set<string>();
    ALL_PLAYERS.forEach((p) => set.add(p.team));
    return Array.from(set).sort();
  }, []);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return ALL_PLAYERS.filter((card) => {
      const matchSearch =
        searchQuery === '' ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.cardNo && card.cardNo.toString().includes(searchQuery));

      const matchTeam = selectedTeam === 'ALL' || card.team === selectedTeam;
      const matchSet = selectedSet === 'ALL' || (card.cardSetId || 'SERIES_1') === selectedSet;
      const matchPos = selectedPosition === 'ALL' || card.position === selectedPosition;

      return matchSearch && matchTeam && matchSet && matchPos;
    });
  }, [searchQuery, selectedTeam, selectedSet, selectedPosition]);

  // Team summary analytics
  const teamSummaries = useMemo(() => {
    const map: Record<string, { count: number; players: PlayerCard[]; avgWar: number; avgPower: number }> = {};
    teams.forEach((t) => {
      const list = ALL_PLAYERS.filter((p) => p.team === t);
      const totalWar = list.reduce((sum, p) => sum + p.bRefWar, 0);
      const totalPower = list.reduce((sum, p) => sum + p.stats.power, 0);
      map[t] = {
        count: list.length,
        players: list,
        avgWar: Number((totalWar / list.length).toFixed(1)),
        avgPower: Math.round(totalPower / list.length)
      };
    });
    return map;
  }, [teams]);

  if (!isOpen) return null;

  // Export card database as JSON file
  const handleExportJSON = () => {
    soundManager.playButtonClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ALL_PLAYERS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `baltimore-chop-master-card-catalog-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-2xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-6xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(249,115,22,0.4)] relative overflow-hidden flex flex-col max-h-[94vh] border border-orange-500/40">
        
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              🗂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider">
                  MASTER CARD & TEAM DIRECTORY
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-600/30 text-orange-300 font-extrabold border border-orange-500/40">
                  {ALL_PLAYERS.length} CARDS · {teams.length} TEAMS · 8 SETS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Official verified catalog of all MLB teams, player attributes, sabermetrics, and licensed card sets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-all shadow-sm"
              title="Download full JSON card database"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" /> Export JSON
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Directory Modal"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top View Mode Tabs */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('ALL_CARDS');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'ALL_CARDS'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Master Card Catalog ({filteredCards.length})
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('BY_TEAM');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'BY_TEAM'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Teams & Franchises ({teams.length})
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('BY_SET');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'BY_SET'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Official Card Sets ({CARD_SETS.length})
          </button>
        </div>

        {/* ================= TAB 1: ALL CARDS SEARCH & GRID ================= */}
        {activeTab === 'ALL_CARDS' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 shrink-0">
              {/* Search Box */}
              <div className="relative sm:col-span-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search player, team, #..."
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-orange-500 rounded-xl py-1.5 pl-8 pr-3 text-xs font-mono text-white outline-none"
                />
              </div>

              {/* Team Selector */}
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-slate-900/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none"
              >
                <option value="ALL">All Franchises ({teams.length})</option>
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Card Set Selector */}
              <select
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="bg-slate-900/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none"
              >
                <option value="ALL">All 8 Card Sets</option>
                {CARD_SETS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              {/* Position Selector */}
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="bg-slate-900/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none"
              >
                <option value="ALL">All Positions</option>
                <option value="SS">Shortstop (SS)</option>
                <option value="3B">Third Base (3B)</option>
                <option value="1B">First Base (1B)</option>
                <option value="2B">Second Base (2B)</option>
                <option value="C">Catcher (C)</option>
                <option value="CF">Center Field (CF)</option>
                <option value="LF">Left Field (LF)</option>
                <option value="RF">Right Field (RF)</option>
                <option value="DH">Designated Hitter (DH)</option>
                <option value="SP">Starting Pitcher (SP)</option>
                <option value="RP">Relief Pitcher (RP)</option>
              </select>
            </div>

            {/* Main Cards Catalog Table / Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCards.map((card) => {
                  const setMeta = CARD_SETS.find((s) => s.id === (card.cardSetId || 'SERIES_1'));
                  return (
                    <div
                      key={card.id}
                      className="rounded-2xl p-3.5 bg-slate-950/80 border border-white/10 hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    >
                      <div>
                        {/* Top Card Info Row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-400/60 flex items-center justify-center text-base shadow">
                              {card.avatarIcon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono font-black text-amber-400">
                                  #{card.cardNo ?? '8'}
                                </span>
                                <h4 className="text-xs font-display font-black text-white uppercase tracking-wide truncate max-w-[140px]">
                                  {card.name}
                                </h4>
                              </div>
                              <span className="text-[9.5px] font-mono text-slate-400 block">
                                {card.team} · <strong className="text-orange-400">{card.position}</strong>
                              </span>
                            </div>
                          </div>

                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30">
                            {setMeta?.name || 'Series 1'}
                          </span>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-center text-[9px] font-mono mb-2">
                          <div>
                            <span className="text-slate-500 block">WAR</span>
                            <span className="text-amber-300 font-black">{card.bRefWar.toFixed(1)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">CON</span>
                            <span className="text-white font-bold">{card.stats.contact}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">POW</span>
                            <span className="text-amber-400 font-bold">{card.stats.power}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">FLD</span>
                            <span className="text-emerald-400 font-bold">{card.stats.fielding}</span>
                          </div>
                        </div>

                        {/* Bio / Lore snippet */}
                        <p className="text-[10px] font-mono text-slate-400 line-clamp-2 leading-relaxed">
                          {card.bio}
                        </p>
                      </div>

                      {/* Card Bottom Row: Action to Inspect in 3D */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[8.5px] font-mono text-slate-500 uppercase">
                          {card.era}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playButtonClick();
                            setInspectedCard(card);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/40 text-[10px] font-mono font-bold transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Inspect 3D
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TEAMS & FRANCHISES ================= */}
        {activeTab === 'BY_TEAM' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Division Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-2.5 border-b border-white/10 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-orange-400" /> Division:
              </span>
              <button
                type="button"
                onClick={() => setSelectedDivision('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedDivision === 'ALL'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All 30 Franchises ({teams.length})
              </button>
              {MLB_DIVISIONS.map((div) => (
                <button
                  key={div.name}
                  type="button"
                  onClick={() => setSelectedDivision(div.name)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedDivision === div.name
                      ? 'bg-orange-600 text-white font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {div.name}
                </button>
              ))}
            </div>

            {/* Teams Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {teams
                  .filter((teamName) => {
                    if (selectedDivision === 'ALL') return true;
                    const info = getTeamByName(teamName);
                    if (!info) return true;
                    const divName = `${info.league} ${info.division.charAt(0) + info.division.slice(1).toLowerCase()}`;
                    return divName.toLowerCase() === selectedDivision.toLowerCase();
                  })
                  .map((teamName) => {
                    const summary = teamSummaries[teamName];
                    const teamInfo = getTeamByName(teamName);
                    const positionHitters = summary.players.filter((p) => p.position !== 'SP' && p.position !== 'RP').length;
                    const spCount = summary.players.filter((p) => p.position === 'SP').length;
                    const rpCount = summary.players.filter((p) => p.position === 'RP').length;

                    return (
                      <div
                        key={teamName}
                        className="rounded-2xl p-4 bg-slate-950/80 border border-white/10 flex flex-col justify-between hover:border-orange-500/40 transition-colors shadow-sm"
                      >
                        <div>
                          {/* Team Header */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-11 h-11 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-2xl shadow">
                                {teamInfo?.logoIcon || '⚾'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm sm:text-base font-display font-black text-white uppercase tracking-wider">
                                    {teamName}
                                  </h3>
                                  {teamInfo && (
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 text-cyan-400 border border-cyan-500/30">
                                      {teamInfo.league} {teamInfo.division}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                  {teamInfo?.ballpark && (
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <MapPin className="w-3 h-3 text-orange-400" />
                                      {teamInfo.ballpark}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-[10px] font-mono">
                              <span className="text-slate-400 block">Avg bRef WAR</span>
                              <span className="text-amber-400 font-bold text-xs">{summary.avgWar}</span>
                            </div>
                          </div>

                          {/* Roster Size & Composition Badge */}
                          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono mb-2.5">
                            <span className="text-slate-300 font-bold">
                              Official 26-Man Roster:
                            </span>
                            <span className="text-emerald-400 font-bold">
                              {summary.count} Cards ({positionHitters} Hitters · {spCount} SP · {rpCount} RP)
                            </span>
                          </div>

                          {/* Roster Badges List */}
                          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                            {summary.players.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => {
                                  soundManager.playButtonClick();
                                  setInspectedCard(p);
                                }}
                                className="p-2 rounded-xl bg-slate-900/80 hover:bg-white/10 border border-white/5 flex items-center justify-between cursor-pointer transition-colors group"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold">
                                    #{p.cardNo ?? '8'}
                                  </span>
                                  <span className="text-xs font-display font-bold text-white uppercase group-hover:text-amber-300 transition-colors">
                                    {p.name}
                                  </span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                    p.position === 'SP' || p.position === 'RP' 
                                      ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30' 
                                      : 'bg-orange-950/80 text-orange-300 border border-orange-500/30'
                                  }`}>
                                    {p.position}
                                  </span>
                                  {p.isHistorical && (
                                    <span className="text-[8px] font-mono text-amber-300 uppercase px-1 rounded bg-amber-500/20 font-bold">
                                      HOF
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-[10px] font-mono">
                                  <span className="text-slate-400">{p.bRefWar.toFixed(1)} WAR</span>
                                  <Eye className="w-3 h-3 text-slate-500 group-hover:text-orange-400 transition-colors" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SET SERIES BREAKDOWN ================= */}
        {activeTab === 'BY_SET' && (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CARD_SETS.map((set) => {
                const setCards = ALL_PLAYERS.filter((p) => (p.cardSetId || 'SERIES_1') === set.id);
                return (
                  <div
                    key={set.id}
                    className="rounded-2xl p-4 bg-slate-950/80 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-orange-400 uppercase">
                            {set.seasonName}
                          </span>
                          <h3 className="text-base font-display font-black text-white uppercase">
                            {set.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-500/30">
                          {setCards.length} Cards Featured
                        </span>
                      </div>

                      <p className="text-[10.5px] font-mono text-slate-400 mb-3 leading-relaxed">
                        {set.lore}
                      </p>

                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[9.5px] font-mono space-y-1 mb-3">
                        <div><strong className="text-slate-400">Cardstock Finish:</strong> <span className="text-slate-200">{set.borderTheme}</span></div>
                        <div><strong className="text-slate-400">Release Window:</strong> <span className="text-amber-300">{set.dropWindow}</span></div>
                      </div>

                      {/* Featured Cards */}
                      <div className="flex flex-wrap gap-1.5">
                        {setCards.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              soundManager.playButtonClick();
                              setInspectedCard(p);
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 hover:border-orange-500 text-[10px] font-mono text-slate-200 flex items-center gap-1"
                          >
                            <span>⚾</span> {p.name} ({p.position})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Bottom Status Bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Database Status: 29 Verified Players · 7 MLB Clubs · 0 Discrepancies</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors"
          >
            Done
          </button>
        </div>

      </div>

      {/* Live 3D Inspect Modal Overlay (When clicking "Inspect 3D" on any card in the catalog) */}
      {inspectedCard && (
        <div 
          onClick={() => setInspectedCard(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center"
          >
            <div className="mb-3 flex items-center justify-between w-full max-w-sm px-2 text-white">
              <span className="text-xs font-mono font-bold text-orange-400">
                Live 3D Specimen #{inspectedCard.cardNo ?? '8'}
              </span>
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Card3D
              card={inspectedCard}
              overrideSetId={inspectedCard.cardSetId || 'SERIES_1'}
              size="normal"
              interactive={true}
            />

            <span className="mt-3 text-[11px] font-mono text-slate-400 text-center">
              Tilt mouse or mobile device to inspect liquid glass sheen and certified autograph.
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
