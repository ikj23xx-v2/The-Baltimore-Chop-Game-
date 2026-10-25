import React from 'react';
import { soundManager } from '../services/audio';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface ScoreboardProps {
  homeScore: number;
  awayScore: number;
  homeTeamName?: string;
  awayTeamName?: string;
  inning: number;
  halfInning: 'TOP' | 'BOTTOM';
  balls: number;
  strikes: number;
  outs: number;
  baseRunners: [boolean, boolean, boolean]; // 1B, 2B, 3B
  franchisePoints: number;
  vendingTokens: number;
  isMuted: boolean;
  onToggleMute: () => void;
  gameModeLabel: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  homeScore,
  awayScore,
  homeTeamName = 'ORIOLES',
  awayTeamName = 'VISITORS',
  inning,
  halfInning,
  balls,
  strikes,
  outs,
  baseRunners,
  franchisePoints,
  vendingTokens,
  isMuted,
  onToggleMute,
  gameModeLabel
}) => {
  const triggerOrgan = () => {
    soundManager.playOrganCharge();
  };

  return (
    <div className="w-full liquid-glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      {/* Subtle Ballpark Neon Header Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Teams & Scores */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-mono tracking-widest text-slate-400 block">{awayTeamName}</span>
              <span className="text-3xl font-display font-black text-white tabular-nums">{awayScore}</span>
            </div>
            <span className="text-slate-600 font-display text-2xl font-bold">VS</span>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-orange-400 font-bold block">{homeTeamName}</span>
              <span className="text-3xl font-display font-black text-orange-400 tabular-nums">{homeScore}</span>
            </div>
          </div>

          {/* Inning Indicator */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono text-slate-400">INNING</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-amber-400">{halfInning === 'TOP' ? '▲' : '▼'}</span>
              <span className="text-lg font-display font-bold text-white tabular-nums">{inning}</span>
            </div>
          </div>
        </div>

        {/* Center: Diamond Base Runners & Count LEDs */}
        <div className="flex items-center gap-6 bg-black/60 px-4 py-2 rounded-xl border border-slate-900">
          {/* Visual Baseball Diamond */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* 2nd Base */}
            <div
              title="2nd Base"
              className={`absolute top-0 w-3 h-3 rotate-45 border transition-all duration-300 ${
                baseRunners[1] 
                  ? 'bg-amber-400 border-yellow-200 shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110' 
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
            {/* 3rd Base */}
            <div
              title="3rd Base"
              className={`absolute left-0 w-3 h-3 rotate-45 border transition-all duration-300 ${
                baseRunners[2] 
                  ? 'bg-amber-400 border-yellow-200 shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110' 
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
            {/* 1st Base */}
            <div
              title="1st Base"
              className={`absolute right-0 w-3 h-3 rotate-45 border transition-all duration-300 ${
                baseRunners[0] 
                  ? 'bg-amber-400 border-yellow-200 shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110' 
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
            {/* Home Plate */}
            <div
              title="Home Plate"
              className="absolute bottom-0 w-3.5 h-3.5 bg-slate-300 border border-white clip-polygon-home"
              style={{ clipPath: 'polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)' }}
            />
          </div>

          {/* Balls, Strikes, Outs LED Bulbs */}
          <div className="flex flex-col gap-1 text-[11px] font-mono">
            {/* Balls */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-3 font-bold">B</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <span
                    key={`b-${idx}`}
                    className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                      balls > idx 
                        ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.8)]' 
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Strikes */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-3 font-bold">S</span>
              <div className="flex items-center gap-1.5">
                {[0, 1].map((idx) => (
                  <span
                    key={`s-${idx}`}
                    className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                      strikes > idx 
                        ? 'bg-red-500 border-red-300 shadow-[0_0_6px_rgba(239,68,68,0.8)]' 
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Outs */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-3 font-bold">O</span>
              <div className="flex items-center gap-1.5">
                {[0, 1].map((idx) => (
                  <span
                    key={`o-${idx}`}
                    className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                      outs > idx 
                        ? 'bg-amber-400 border-yellow-200 shadow-[0_0_6px_rgba(251,191,36,0.8)]' 
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Franchise Points, Vending Tokens & Quick Audio Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">VICTORY PTS</span>
            <span className="text-base font-mono font-bold text-amber-400 tabular-nums">
              {franchisePoints.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block">TOKENS</span>
            <span className="text-base font-mono font-bold text-orange-400 tabular-nums">
              🪙 {vendingTokens}
            </span>
          </div>

          {/* Sound & Organ Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={triggerOrgan}
              title="Play Ballpark Organ 'Charge!'"
              aria-label="Play Ballpark Organ Charge Fanfare"
              className="p-2 rounded-xl bg-orange-600/30 hover:bg-orange-600 border border-orange-500/50 text-orange-300 hover:text-white transition-colors"
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Sub-ticker */}
      <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold text-orange-400">{gameModeLabel}</span>
        <span className="font-mono">Count: {balls}-{strikes} · Outs: {outs}/3</span>
      </div>
    </div>
  );
};
