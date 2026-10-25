import React, { useState } from 'react';
import { PlayerCard } from '../types/game';
import { soundManager } from '../services/audio';
import { X, Trophy, FastForward, Play, TrendingUp, CheckCircle } from 'lucide-react';

interface FranchiseSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasonRecord: { wins: number; losses: number; gamesPlayed: number; mode: '162_SEASON' | 'MINI_SERIES' };
  onSimulateGames: (count: number) => { winsAdded: number; pointsEarned: number };
  teamArchetype: string;
  franchisePoints: number;
  roster: PlayerCard[];
}

interface TeamStanding {
  name: string;
  wins: number;
  losses: number;
  gb: string;
  runDiff: number;
}

export const FranchiseSeasonModal: React.FC<FranchiseSeasonModalProps> = ({
  isOpen,
  onClose,
  seasonRecord,
  onSimulateGames,
  teamArchetype,
  franchisePoints,
  roster
}) => {
  const [simMessage, setSimMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalGames = seasonRecord.mode === '162_SEASON' ? 162 : 10;
  const gamesRemaining = Math.max(0, totalGames - seasonRecord.gamesPlayed);
  const winPct = seasonRecord.gamesPlayed > 0 
    ? (seasonRecord.wins / seasonRecord.gamesPlayed).toFixed(3).replace(/^0/, '')
    : '.000';

  // Division Standings
  const standings: TeamStanding[] = [
    {
      name: 'Baltimore Orioles (You)',
      wins: seasonRecord.wins,
      losses: seasonRecord.losses,
      gb: '-',
      runDiff: (seasonRecord.wins - seasonRecord.losses) * 2
    },
    {
      name: 'New York Yankees',
      wins: Math.round(seasonRecord.gamesPlayed * 0.58),
      losses: Math.round(seasonRecord.gamesPlayed * 0.42),
      gb: '1.5',
      runDiff: +18
    },
    {
      name: 'Boston Red Sox',
      wins: Math.round(seasonRecord.gamesPlayed * 0.51),
      losses: Math.round(seasonRecord.gamesPlayed * 0.49),
      gb: '3.0',
      runDiff: +4
    },
    {
      name: 'Tampa Bay Rays',
      wins: Math.round(seasonRecord.gamesPlayed * 0.48),
      losses: Math.round(seasonRecord.gamesPlayed * 0.52),
      gb: '4.5',
      runDiff: -10
    },
    {
      name: 'Toronto Blue Jays',
      wins: Math.round(seasonRecord.gamesPlayed * 0.44),
      losses: Math.round(seasonRecord.gamesPlayed * 0.56),
      gb: '6.0',
      runDiff: -22
    }
  ];

  const handleSim = (count: number) => {
    const res = onSimulateGames(count);
    soundManager.playBatCrack(true);
    setSimMessage(
      `⚾ Simulated ${count} games! Won ${res.winsAdded} of ${count}. Earned +${res.pointsEarned} Franchise Victory Points!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                FRANCHISE SEASON SIMULATION
                <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-bold font-mono">
                  {seasonRecord.mode === '162_SEASON' ? '162-GAME CHAMPIONSHIP' : '10-GAME MINI-PENNANT'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Model full season schedule, pennant standings, and playoff qualification.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Franchise Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Simulation Ticker Message */}
          {simMessage && (
            <div className="p-3 rounded-xl bg-orange-950/50 border border-orange-500/50 text-orange-200 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{simMessage}</span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-slate-400 block">RECORD</span>
              <strong className="text-xl font-display font-black text-white tabular-nums">
                {seasonRecord.wins}W - {seasonRecord.losses}L
              </strong>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-slate-400 block">WIN %</span>
              <strong className="text-xl font-display font-black text-amber-400 tabular-nums">
                {winPct}
              </strong>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-slate-400 block">GAMES LEFT</span>
              <strong className="text-xl font-display font-black text-emerald-400 tabular-nums">
                {gamesRemaining}
              </strong>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] font-mono text-slate-400 block">TEAM ARCHETYPE</span>
              <strong className="text-xs font-display font-bold text-orange-400 block truncate mt-1">
                {teamArchetype}
              </strong>
            </div>
          </div>

          {/* AL East Division Standings Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              AL East Division Standings
            </span>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="py-2">CLUB</th>
                  <th className="py-2 text-center">W</th>
                  <th className="py-2 text-center">L</th>
                  <th className="py-2 text-center">PCT</th>
                  <th className="py-2 text-center">GB</th>
                  <th className="py-2 text-center">DIFF</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((t, idx) => {
                  const isOrioles = idx === 0;
                  const pct = t.wins + t.losses > 0 ? (t.wins / (t.wins + t.losses)).toFixed(3).replace(/^0/, '') : '.000';
                  return (
                    <tr
                      key={t.name}
                      className={`border-b border-slate-900 ${
                        isOrioles ? 'bg-orange-950/20 text-orange-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2 flex items-center gap-2">
                        {isOrioles && <span className="text-orange-500">⚾</span>}
                        {t.name}
                      </td>
                      <td className="py-2 text-center tabular-nums">{t.wins}</td>
                      <td className="py-2 text-center tabular-nums">{t.losses}</td>
                      <td className="py-2 text-center tabular-nums">{pct}</td>
                      <td className="py-2 text-center tabular-nums">{t.gb}</td>
                      <td className="py-2 text-center tabular-nums">{t.runDiff > 0 ? `+${t.runDiff}` : t.runDiff}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Simulation Controls */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              disabled={gamesRemaining < 1}
              onClick={() => handleSim(1)}
              className="py-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-center text-xs font-display font-bold uppercase text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Play className="w-4 h-4 text-orange-400" />
              Simulate 1 Game
            </button>
            <button
              type="button"
              disabled={gamesRemaining < 3}
              onClick={() => handleSim(Math.min(3, gamesRemaining))}
              className="py-3 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-xl text-center text-xs font-display font-bold uppercase text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              Simulate 3-Game Series
            </button>
            <button
              type="button"
              disabled={gamesRemaining < 10}
              onClick={() => handleSim(Math.min(10, gamesRemaining))}
              className="py-3 bg-orange-600/30 hover:bg-orange-600 border border-orange-500/50 rounded-xl text-center text-xs font-display font-bold uppercase text-orange-200 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              Simulate Month (10 Games)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
