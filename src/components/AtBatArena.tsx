import React from 'react';
import { 
  PitchType, 
  StrikeZone, 
  SpecialSkill, 
  PlayerCard, 
  PlayByPlayEntry, 
  PitchDelivery 
} from '../types/game';
import { Target, Zap, Sparkles, Activity } from 'lucide-react';
import { RetroPlayByPlayJumbotron } from './RetroPlayByPlayJumbotron';

interface AtBatArenaProps {
  currentBatter: PlayerCard;
  currentPitcher: PlayerCard;
  selectedZone: StrikeZone;
  onSelectZone: (zone: StrikeZone) => void;
  selectedPitchType: PitchType;
  onSelectPitchType: (pitch: PitchType) => void;
  activeSkill?: SpecialSkill;
  onSelectSkill: (skill?: SpecialSkill) => void;
  onSwing: () => void;
  isPitching: boolean;
  pitchSequence: PitchDelivery[];
  activeHint?: string;
  streakCount: number;
  playByPlay: PlayByPlayEntry[];
}

const ZONES: { id: StrikeZone; label: string; sub: string }[] = [
  { id: 'UP_IN', label: 'Up-In', sub: 'High & Tight' },
  { id: 'UP_MID', label: 'High', sub: 'Elevated' },
  { id: 'UP_OUT', label: 'Up-Away', sub: 'High Outside' },
  { id: 'MID_IN', label: 'In', sub: 'Belt-In' },
  { id: 'MIDDLE', label: 'Heart', sub: 'Wheelhouse' },
  { id: 'MID_OUT', label: 'Away', sub: 'Belt-Out' },
  { id: 'DOWN_IN', label: 'Low-In', sub: 'Chop Target' },
  { id: 'DOWN_MID', label: 'Low', sub: 'Dirt Plate' },
  { id: 'DOWN_OUT', label: 'Low-Away', sub: 'Chop Target' },
];

const PITCH_OPTIONS: { id: PitchType; name: string; tag: string }[] = [
  { id: '4-SEAM', name: '4-Seam Fastball', tag: '96+ MPH Gas' },
  { id: 'SLIDER', name: 'Slider', tag: 'Sharp Lateral Tilt' },
  { id: 'CURVEBALL', name: '12-6 Curve', tag: 'Vertical Plunge' },
  { id: 'CHANGEUP', name: 'Changeup', tag: 'Off-Speed Fade' },
  { id: 'SINKER', name: 'Sinker / Turbo', tag: 'Heavy Grounder' },
  { id: 'CUTTER', name: 'Cutter', tag: 'Late Darting Saw' },
];

export const AtBatArena: React.FC<AtBatArenaProps> = ({
  currentBatter,
  currentPitcher,
  selectedZone,
  onSelectZone,
  selectedPitchType,
  onSelectPitchType,
  activeSkill,
  onSelectSkill,
  onSwing,
  isPitching,
  pitchSequence,
  activeHint,
  streakCount,
  playByPlay
}) => {
  const [selectedLogEntry, setSelectedLogEntry] = React.useState<PlayByPlayEntry | undefined>(undefined);

  return (
    <div id="atbat-arena-container" className="flex flex-col gap-4">
      {/* Pitcher Matchup Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl">
            {currentPitcher.avatarIcon || '⚾'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                ON THE MOUND
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                bRef WAR: {currentPitcher.bRefWar}
              </span>
            </div>
            <h3 className="text-base font-display font-bold text-white leading-tight">
              {currentPitcher.name} ({currentPitcher.team})
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Stuff: <span className="text-white">{currentPitcher.stats.stuff ?? 85}</span> · Control: <span className="text-white">{currentPitcher.stats.control ?? 82}</span>
            </p>
          </div>
        </div>

        {/* 3-Pitch Sequence Buffer */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-orange-500" />
            Pitch Buffer (Last Deliveries)
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => {
              const p = pitchSequence[idx];
              return (
                <div
                  key={`pitch-buf-${idx}`}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-[10px] font-mono"
                >
                  {p ? (
                    <div>
                      <span className="text-orange-400 font-bold block truncate">{p.type}</span>
                      <span className="text-slate-400 block">{p.velocity} mph</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 block py-1">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Scouting Hint (Earned via Streaks or Equipment) */}
      {activeHint && (
        <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/40 to-slate-900 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-400 font-bold font-display uppercase tracking-wide block">
              Dynamic Scouting Insight (Streak: {streakCount})
            </strong>
            <span>{activeHint}</span>
          </div>
        </div>
      )}

      {/* Interactive Batter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* 9-Zone Strike Plate Grid */}
        <div className="md:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-orange-500" />
              Target Strike Zone (3x3 Grid)
            </label>
            <span className="text-[10px] font-mono text-orange-400 font-bold">
              {selectedZone.replace('_', ' ')}
            </span>
          </div>

          {/* 3x3 Plate Matrix */}
          <div className="grid grid-cols-3 gap-2 aspect-square max-w-[260px] mx-auto w-full my-auto">
            {ZONES.map((z) => {
              const isSelected = selectedZone === z.id;
              const isChopTarget = z.id.startsWith('DOWN');
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => onSelectZone(z.id)}
                  className={`rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white border-white shadow-[0_0_15px_rgba(234,88,12,0.8)] scale-105 z-10'
                      : isChopTarget
                      ? 'bg-amber-950/30 border-amber-700/40 text-amber-200 hover:border-amber-500 hover:bg-amber-900/40'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-display font-bold leading-none">{z.label}</span>
                  <span className={`text-[9px] mt-1 font-mono ${isSelected ? 'text-orange-200' : 'text-slate-400'}`}>
                    {z.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
            *Low zones unlock maximum Baltimore Chop dirt-bounce trajectory
          </p>
        </div>

        {/* Pitch Type & Special Counter Skills */}
        <div className="md:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div>
            <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Guess Pitch Type (Predict Hurler Delivery):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PITCH_OPTIONS.map((p) => {
                const isSelected = selectedPitchType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPitchType(p.id)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-xs font-display font-bold block">{p.name}</span>
                    <span className={`text-[10px] font-mono block ${isSelected ? 'text-amber-950' : 'text-slate-400'}`}>
                      {p.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Signature Counter Perks */}
          <div>
            <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Counter-Card Special Skill:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectSkill(activeSkill === 'BALTIMORE_CHOP' ? undefined : 'BALTIMORE_CHOP')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  activeSkill === 'BALTIMORE_CHOP'
                    ? 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_15px_rgba(5,150,105,0.7)]'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-600/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💥</span>
                  <strong className="text-xs font-display font-bold">The Baltimore Chop</strong>
                </div>
                <span className="text-[10px] text-emerald-200/90 font-mono block mt-0.5">
                  Top-spin dirt smash over IF head
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectSkill(activeSkill === 'SIT_DEAD_RED' ? undefined : 'SIT_DEAD_RED')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  activeSkill === 'SIT_DEAD_RED'
                    ? 'bg-red-600 border-red-300 text-white shadow-[0_0_15px_rgba(220,38,38,0.7)]'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-red-600/50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🎯</span>
                  <strong className="text-xs font-display font-bold">Sit Dead Red</strong>
                </div>
                <span className="text-[10px] text-red-200/90 font-mono block mt-0.5">
                  +Power on fastballs in zone
                </span>
              </button>
            </div>
          </div>

          {/* Primary Swing CTA */}
          <button
            type="button"
            disabled={isPitching}
            onClick={onSwing}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display text-base font-black tracking-wider uppercase rounded-xl shadow-xl transition-all transform active:scale-98 disabled:opacity-50"
          >
            {isPitching ? 'Pitch Delivered...' : 'Swing & Resolve Showdown!'}
          </button>
        </div>
      </div>

      {/* Retro 8-Bit Stadium Jumbotron Animated Screen */}
      <RetroPlayByPlayJumbotron latestEntry={selectedLogEntry || playByPlay[0]} />

      {/* Play-by-Play Narrative Broadcast Feed */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>📻</span> Ballpark Play-by-Play Narrative Log
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Click any entry to replay retro animation
          </span>
        </div>

        <div className="h-32 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
          {playByPlay.length === 0 ? (
            <div className="text-slate-500 italic py-2">Game ready. Bottom of the 9th. Cal Ripken Jr. steps into the batter's box...</div>
          ) : (
            playByPlay.map((item) => {
              let badge = '⚾ PLAY';
              let colorClass = 'text-slate-300 bg-slate-900/60 border-slate-800 hover:border-slate-600';
              if (item.type === 'chop') {
                badge = '💥 CHOP';
                colorClass = 'text-emerald-400 font-bold bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-950/60';
              } else if (item.type === 'homerun') {
                badge = '🚀 HOMERUN';
                colorClass = 'text-amber-300 font-bold bg-amber-950/40 border-amber-600/60 hover:bg-amber-950/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
              } else if (item.type === 'hit') {
                badge = '⚡ BASE HIT';
                colorClass = 'text-yellow-300 font-semibold bg-yellow-950/30 border-yellow-800/40 hover:bg-yellow-950/50';
              } else if (item.type === 'out') {
                badge = '🛑 OUT';
                colorClass = 'text-rose-400 bg-rose-950/25 border-rose-900/40 hover:bg-rose-950/40';
              }

              const isSelected = selectedLogEntry?.id === item.id;

              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedLogEntry(item)}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 ${colorClass} ${
                    isSelected ? 'ring-2 ring-orange-500 shadow-md' : ''
                  }`}
                  title="Click to replay retro animation on Jumbotron"
                >
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/60 shrink-0">
                    {badge}
                  </span>
                  <div className="flex-1 leading-snug">
                    {item.text}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
