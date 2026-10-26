import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  ShieldAlert, 
  Award, 
  Trophy, 
  Zap, 
  MapPin, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  Play, 
  TrendingUp, 
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../services/audio';
import { 
  GAUNTLET_BOSSES, 
  GRID_CONQUEST_NODES, 
  MOMENTS_OF_INFAMY, 
  DRAFT_MATRIX_RULES,
  GauntletBossPitcher,
  MomentOfInfamy
} from '../data/chopExtremePillars';
import { 
  EXTREME_100_PATH_MILESTONES, 
  INITIAL_EXTREME_STATE, 
  ExtremeProgramState,
  calculateLeverageIndex,
  computeChopIndexScore,
  LINEAR_WEIGHT_POINTS
} from '../data/chopExtremeAnalytics';

interface ChopExtremeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardExtremePoints?: (points: number, reason: string) => void;
}

export const ChopExtremeHubModal: React.FC<ChopExtremeHubModalProps> = ({
  isOpen,
  onClose,
  onAwardExtremePoints
}) => {
  const [activePillar, setActivePillar] = useState<'PATH_100' | 'PILLAR_A' | 'PILLAR_B' | 'PILLAR_C' | 'PILLAR_D' | 'RE24_SIMULATOR'>('PILLAR_A');
  const [extremeState, setExtremeState] = useState<ExtremeProgramState>(INITIAL_EXTREME_STATE);
  const [selectedBossIndex, setSelectedBossIndex] = useState(0);
  const [simResult, setSimResult] = useState<string | null>(null);

  // Live RE24 / Leverage Interactive Simulator State
  const [simInning, setSimInning] = useState(9);
  const [simScoreDiff, setSimScoreDiff] = useState(-1);
  const [simRunners, setSimRunners] = useState({ first: true, second: true, third: false });
  const [simOuts, setSimOuts] = useState(2);
  const [simEvent, setSimEvent] = useState<'OUT' | 'STRIKEOUT' | 'WALK' | 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HOME_RUN'>('HOME_RUN');
  const [simBarrel, setSimBarrel] = useState(true);

  if (!isOpen) return null;

  const currentBoss = GAUNTLET_BOSSES[selectedBossIndex] || GAUNTLET_BOSSES[0];

  // Calculate live RE24 calculation in simulator
  const liveLeverage = calculateLeverageIndex(simInning, simScoreDiff, simRunners, simOuts);
  const liveScore = computeChopIndexScore(simEvent, liveLeverage, { barrelContact: simBarrel });

  const handleSimulateBossAtBat = () => {
    soundManager.playBatCrack(true);
    const win = Math.random() > 0.4;
    if (win) {
      const pts = 3;
      setExtremeState((prev) => ({
        ...prev,
        totalExtremePoints: Math.min(100, prev.totalExtremePoints + pts),
        gauntletCompletedBosses: Math.min(10, prev.gauntletCompletedBosses + 1)
      }));
      setSimResult(`✅ VICTORIOUS AT-BAT! You stacked barrel contact on ${currentBoss.name}'s heater. +${pts} Extreme Points awarded!`);
      if (onAwardExtremePoints) onAwardExtremePoints(pts, `Defeated Boss ${currentBoss.name}`);
    } else {
      setSimResult(`❌ OUT RECORDED! ${currentBoss.name} executed his ${currentBoss.bossQuirk}. Stamina pool drained by 1 out.`);
      soundManager.playUmpireCall(true);
    }
  };

  const handleCompleteMoment = (moment: MomentOfInfamy) => {
    if (extremeState.momentsCompletedIds.includes(moment.id)) return;
    soundManager.playJackpotChime();
    setExtremeState((prev) => ({
      ...prev,
      totalExtremePoints: Math.min(100, prev.totalExtremePoints + moment.pointsAwarded),
      momentsCompletedIds: [...prev.momentsCompletedIds, moment.id]
    }));
    if (onAwardExtremePoints) onAwardExtremePoints(moment.pointsAwarded, `Completed Moment: ${moment.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-2xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-6xl shadow-[0_25px_60px_-15px_rgba(234,88,12,0.5)] relative overflow-hidden flex flex-col max-h-[96vh] border-2 border-orange-500/60">
        
        {/* Top Metallic Orange/Cyan Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-400" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 bg-slate-950/85">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 border border-orange-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,88,12,0.6)] shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-wide uppercase">
                  CHOP EXTREME
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase bg-red-600 text-white shadow">
                  THE SABERMETRIC PURIST MODE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase bg-slate-800 text-amber-300 border border-amber-500/40">
                  {extremeState.totalExtremePoints}/100 PTS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Four Pillars of Extreme Strategy · RE24 Run Expectancy · WPA Leverage Index · 100-Point Path
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
            aria-label="Close Chop Extreme"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 100-POINT EXTREME PROGRESS BAR STRIP */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/95 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              The Extreme 100-Point Path
            </span>
            <span className="text-amber-400 font-black">
              {extremeState.totalExtremePoints} / 100 Points Earned
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-slate-900 rounded-full h-3 relative overflow-hidden border border-white/10 shadow-inner">
            <div
              className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              style={{ width: `${Math.min(100, extremeState.totalExtremePoints)}%` }}
            />
          </div>

          {/* Milestone Badges */}
          <div className="grid grid-cols-5 gap-1.5 mt-2 text-center text-[10px] font-mono">
            {EXTREME_100_PATH_MILESTONES.map((m) => {
              const reached = extremeState.totalExtremePoints >= m.pointsRequired;
              return (
                <div
                  key={m.pointsRequired}
                  className={`p-1 rounded-lg border transition-all ${
                    reached
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                      : 'bg-black/30 border-white/5 text-slate-500'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    {reached ? <CheckCircle2 className="w-3 h-3 text-amber-400" /> : <Lock className="w-2.5 h-2.5" />}
                    <span>{m.pointsRequired} pts</span>
                  </div>
                  <span className="text-[9px] block truncate">{m.badgeLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs for the Four Pillars + RE24 Calculator */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2 border-b border-white/10 bg-slate-900/60 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActivePillar('PILLAR_A');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activePillar === 'PILLAR_A'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🔥</span> Pillar A: The Gauntlet Showdown
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActivePillar('PILLAR_B');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activePillar === 'PILLAR_B'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🗺️</span> Pillar B: Grid Conquest
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActivePillar('PILLAR_C');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activePillar === 'PILLAR_C'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⏳</span> Pillar C: Moments of Infamy
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActivePillar('PILLAR_D');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activePillar === 'PILLAR_D'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎰</span> Pillar D: Draft Matrix
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActivePillar('RE24_SIMULATOR');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              activePillar === 'RE24_SIMULATOR'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🧮</span> Live RE24 & Leverage Calculator
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* =========================================================================
              PILLAR A: THE GAUNTLET SHOWDOWN ("THE 9TH INNING CRISIS")
              ========================================================================= */}
          {activePillar === 'PILLAR_A' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-white uppercase text-sm tracking-wider flex items-center gap-2">
                    <span>🔥</span> Pillar A: The Gauntlet Showdown ("The 9th Inning Crisis")
                  </span>
                  <span className="text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    Stage {selectedBossIndex + 1} of 10 Bosses
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  <strong>The Twist:</strong> You start down 4–0 in the 7th inning against sequential historical pitching monsters. You face a randomized, depleted bench of common and silver cards. Every out recorded against you permanently drains your team's stamina pool and reduces card-draw hand size for the next boss.
                </p>
                <p className="text-amber-300 leading-relaxed text-[11px]">
                  <strong>Stat Nerd Hook:</strong> Exploit deep vertical-release metrics, spin rates, and pitch trajectories. Stack left-handed bats with high barrel rates against high-velocity, high-spin vertical release pitchers!
                </p>
              </div>

              {/* Boss Selector Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {GAUNTLET_BOSSES.map((boss, idx) => (
                  <button
                    key={boss.stage}
                    type="button"
                    onClick={() => {
                      soundManager.playButtonClick();
                      setSelectedBossIndex(idx);
                      setSimResult(null);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 shrink-0 transition-all ${
                      selectedBossIndex === idx
                        ? 'bg-orange-600 text-white border-amber-300 shadow-md scale-105'
                        : 'bg-slate-950/80 border-white/10 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{boss.avatarIcon}</span>
                    <div className="text-left">
                      <span className="text-[9px] font-mono font-bold block opacity-75">Boss #{boss.stage}</span>
                      <span className="text-xs font-display font-bold uppercase truncate max-w-[130px] block leading-none">
                        {boss.name.split('(')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Boss Detailed Dossier */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-950/85 border border-white/10">
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-6xl mb-2">{currentBoss.avatarIcon}</span>
                  <h3 className="text-lg font-display font-black text-white uppercase">{currentBoss.name}</h3>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{currentBoss.eraTeam}</span>
                  <p className="text-xs text-slate-400 mt-2 italic">"{currentBoss.reputation}"</p>
                </div>

                <div className="lg:col-span-8 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Fastball Velo</span>
                      <span className="text-sm font-black text-red-400">{currentBoss.fastballVelo} MPH</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Spin Rate</span>
                      <span className="text-sm font-black text-cyan-400">{currentBoss.spinRateRpm} RPM</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Vertical Break</span>
                      <span className="text-sm font-black text-amber-400">{currentBoss.verticalBreakInches}" Ride</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/20">
                    <span className="text-red-400 font-bold block">Boss Signature Quirk:</span>
                    <span className="text-slate-300 text-[11px]">{currentBoss.bossQuirk}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
                    <span className="text-cyan-400 font-bold block">Sabermetric Exploit:</span>
                    <span className="text-slate-300 text-[11px]">{currentBoss.statNerdHook}</span>
                  </div>

                  {simResult && (
                    <div className="p-3 rounded-xl bg-orange-950/80 border border-orange-500 text-amber-200 text-xs font-bold animate-fade-in">
                      {simResult}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSimulateBossAtBat}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4 fill-slate-950" /> Simulate High-Leverage At-Bat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PILLAR B: THE DIAMOND GRID CONQUEST ("TERRITORIAL WAR")
              ========================================================================= */}
          {activePillar === 'PILLAR_B' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-white uppercase text-sm tracking-wider flex items-center gap-2">
                    <span>🗺️</span> Pillar B: The Diamond Grid Conquest ("Territorial WAR")
                  </span>
                  <span className="text-emerald-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    Territory Map Nodes
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  <strong>The Twist:</strong> You cannot just overpower nodes with a stacked 99 OVR deck! Nodes impose strict statistical constraints: <em>"Lineup must consist entirely of players with an OPS under .700 against LHP"</em>, or <em>"Pitching staff restricted to sub-93 mph sinkerballers."</em>
                </p>
                <p className="text-emerald-300 leading-relaxed text-[11px]">
                  <strong>Stat Nerd Hook:</strong> Rewards collectors who know hidden-gem metrics rather than just chasing meta ratings.
                </p>
              </div>

              {/* Grid Nodes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {GRID_CONQUEST_NODES.map((node) => (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      node.conquered
                        ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md'
                        : node.unlocked
                        ? 'bg-slate-950/80 border-white/10 hover:border-emerald-500/40'
                        : 'bg-black/40 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{node.icon}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          node.conquered ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {node.conquered ? 'CONQUERED' : `+${node.rewardPoints} PTS`}
                        </span>
                      </div>

                      <h4 className="text-xs font-display font-black text-white uppercase">{node.name}</h4>
                      <p className="text-[10.5px] font-mono text-slate-300 leading-tight">
                        {node.restrictionRule}
                      </p>
                      <p className="text-[9.5px] font-mono text-slate-400 italic">
                        {node.statRequirement}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-white/5">
                      {node.conquered ? (
                        <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Territory Held
                        </div>
                      ) : node.unlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playJackpotChime();
                            node.conquered = true;
                            setExtremeState((p) => ({
                              ...p,
                              totalExtremePoints: Math.min(100, p.totalExtremePoints + node.rewardPoints)
                            }));
                          }}
                          className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          Deploy & Conquer
                        </button>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PILLAR C: PURE-SIM "MOMENTS OF INFAMY"
              ========================================================================= */}
          {activePillar === 'PILLAR_C' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-white uppercase text-sm tracking-wider flex items-center gap-2">
                    <span>⏳</span> Pillar C: Pure-Sim "Moments of Infamy"
                  </span>
                  <span className="text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    10 Historical Scenarios · 30 Pts Total
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  <strong>The Twist:</strong> Scenarios pulled from historical data where a single swing or pitch changed a season's WAR standings. Drop into exact historical leverage states on Legend difficulty with zero retries without spending currency!
                </p>
              </div>

              {/* Moments List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOMENTS_OF_INFAMY.map((m) => {
                  const isDone = extremeState.momentsCompletedIds.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        isDone
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                          : 'bg-slate-950/80 border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{m.icon}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            isDone ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'
                          }`}>
                            {isDone ? 'COMPLETED' : `+${m.pointsAwarded} PTS`}
                          </span>
                        </div>
                        <h4 className="text-xs font-display font-black text-white uppercase mt-1">{m.title}</h4>
                        <span className="text-[10px] font-mono text-amber-400 font-bold block">{m.historicalGame}</span>
                        <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-white/5 text-[10.5px] font-mono text-slate-300">
                          <strong>Situation:</strong> {m.leverageState}
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 mt-1.5 italic leading-tight">
                          {m.statPuristContext}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        {isDone ? (
                          <div className="text-[10px] font-mono text-amber-400 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Moment Re-created & Cleared
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCompleteMoment(m)}
                            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition-all shadow"
                          >
                            Step In & Execute Moment (+{m.pointsAwarded} Pts)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              PILLAR D: THE REFRACTOR DRAFT MATRIX (DRAFT-TO-GLORY)
              ========================================================================= */}
          {activePillar === 'PILLAR_D' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-white uppercase text-sm tracking-wider flex items-center gap-2">
                    <span>🎰</span> Pillar D: The Refractor Draft Matrix (Draft-to-Glory)
                  </span>
                  <span className="text-cyan-400 font-bold bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    ${DRAFT_MATRIX_RULES.salaryCapMillionDollars}M Analytical Cap
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  <strong>The Twist:</strong> Build a 26-man roster under a strict salary cap calculated using modern analytical valuation metrics (like <strong>dollar-per-WAR (${DRAFT_MATRIX_RULES.dollarPerWarRate}M/WAR)</strong> or projected arbitration values).
                </p>
                <p className="text-cyan-300 leading-relaxed text-[11px]">
                  <strong>The Dilemma:</strong> Choose between current steady 4-WAR production versus volatile 9-WAR single-season anomalies whose variance can swing a game by +/- 15 runs!
                </p>
              </div>

              {/* Roster Rules Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <span className="text-slate-400 text-[10px] block uppercase">Analytical Salary Cap</span>
                  <span className="text-xl font-display font-black text-white">${DRAFT_MATRIX_RULES.salaryCapMillionDollars}M</span>
                  <span className="text-[10px] text-slate-500 block mt-1">@ ${DRAFT_MATRIX_RULES.dollarPerWarRate}M per 1.0 bRef WAR</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <span className="text-slate-400 text-[10px] block uppercase">Roster Size</span>
                  <span className="text-xl font-display font-black text-amber-400">{DRAFT_MATRIX_RULES.rosterSize} Cards</span>
                  <span className="text-[10px] text-slate-500 block mt-1">9 Lineup + 5 SP + 8 Bullpen + 4 Bench</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <span className="text-slate-400 text-[10px] block uppercase">Anomaly Cards Allowed</span>
                  <span className="text-xl font-display font-black text-cyan-400">Max {DRAFT_MATRIX_RULES.maxOutlierSeasonAnomalyCards}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Volatile 9+ WAR Outlier Seasons</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              INTERACTIVE RE24 & LEVERAGE CALCULATOR PLAYGROUND
              ========================================================================= */}
          {activePillar === 'RE24_SIMULATOR' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 to-slate-900 border border-orange-500/40 text-xs font-mono space-y-2">
                <span className="font-display font-black text-white uppercase text-sm tracking-wider flex items-center gap-2">
                  <span>🧮</span> Interactive Run Expectancy (RE24) & Leverage Index Playground
                </span>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  Adjust the game situation below to see the exact real-time <strong>Leverage Index (LI)</strong>, <strong>Linear Weights Run Value</strong>, and <strong>Chop Index Points</strong> computed by the in-game engine!
                </p>
              </div>

              {/* Situation Controls */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  
                  {/* Inning */}
                  <div>
                    <label className="text-slate-400 block mb-1">Inning: {simInning}</label>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={simInning}
                      onChange={(e) => setSimInning(parseInt(e.target.value, 10))}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  {/* Score Diff */}
                  <div>
                    <label className="text-slate-400 block mb-1">Score Margin: {simScoreDiff > 0 ? `+${simScoreDiff}` : simScoreDiff}</label>
                    <input
                      type="range"
                      min={-6}
                      max={6}
                      value={simScoreDiff}
                      onChange={(e) => setSimScoreDiff(parseInt(e.target.value, 10))}
                      className="w-full accent-orange-500"
                    />
                  </div>

                  {/* Outs */}
                  <div>
                    <label className="text-slate-400 block mb-1">Outs: {simOuts}</label>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setSimOuts(o)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                            simOuts === o ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {o} Out
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Base Runners */}
                  <div>
                    <label className="text-slate-400 block mb-1">Base Runners</label>
                    <div className="flex gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSimRunners((r) => ({ ...r, first: !r.first }))}
                        className={`flex-1 py-1 rounded font-bold ${simRunners.first ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}
                      >
                        1B
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimRunners((r) => ({ ...r, second: !r.second }))}
                        className={`flex-1 py-1 rounded font-bold ${simRunners.second ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}
                      >
                        2B
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimRunners((r) => ({ ...r, third: !r.third }))}
                        className={`flex-1 py-1 rounded font-bold ${simRunners.third ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}
                      >
                        3B
                      </button>
                    </div>
                  </div>
                </div>

                {/* Event Selector */}
                <div className="pt-2 border-t border-white/10">
                  <label className="text-slate-400 text-xs font-mono block mb-1.5">Outcome Event:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['HOME_RUN', 'TRIPLE', 'DOUBLE', 'SINGLE', 'WALK', 'STRIKEOUT', 'OUT'] as const).map((ev) => (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => setSimEvent(ev)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                          simEvent === ev ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ev} ({LINEAR_WEIGHT_POINTS[ev] > 0 ? `+${LINEAR_WEIGHT_POINTS[ev]}` : LINEAR_WEIGHT_POINTS[ev]} pts)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Calculation Output Display */}
              <div className="p-4 rounded-2xl bg-black/60 border border-orange-500/50 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Computed Leverage Index:</span>
                    <span className="text-lg font-bold text-amber-400">
                      {liveLeverage.leverageIndex}x ({liveLeverage.tier} LEVERAGE)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Chop Index Score:</span>
                    <span className="text-2xl font-black text-orange-400">
                      {liveScore.totalChopIndex > 0 ? `+${liveScore.totalChopIndex}` : liveScore.totalChopIndex} Points
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  {liveScore.calculationBreakdown.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span>•</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
