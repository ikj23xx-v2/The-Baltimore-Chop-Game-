import React, { useState } from 'react';
import { PlayerCard } from '../types/game';
import { getCardAccumulatedStats, CardCompleteStatsProfile } from '../data/cardAccumulatedStats';
import { Card3D } from './Card3D';
import { RainbowChaseTracker } from './RainbowChaseTracker';
import { soundManager } from '../services/audio';
import { 
  X, 
  Trophy, 
  TrendingUp, 
  Flame, 
  Shield, 
  RotateCw, 
  Award, 
  CheckCircle2, 
  BarChart2, 
  Users, 
  Zap, 
  Sparkles,
  Layers
} from 'lucide-react';

interface CardStatsDetailModalProps {
  card: PlayerCard | null;
  isOpen: boolean;
  onClose: () => void;
  onDeployCard?: (card: PlayerCard, role: 'STARTING_LINEUP' | 'PINCH_HITTER' | 'ACE_STARTER' | 'BULLPEN_CLOSER' | 'FRANCHISE_ANCHOR') => void;
}

export const CardStatsDetailModal: React.FC<CardStatsDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onDeployCard
}) => {
  const [activeTab, setActiveTab] = useState<'SEASONS' | 'GAME_MODES' | 'COMMUNITY_RANK' | 'DEPLOY'>('SEASONS');
  const [deployedRole, setDeployedRole] = useState<string | null>(null);

  if (!isOpen || !card) return null;

  const statsProfile: CardCompleteStatsProfile = getCardAccumulatedStats(card);
  const isPitcher = card.position === 'SP' || card.position === 'RP';

  const handleDeploy = (role: 'STARTING_LINEUP' | 'PINCH_HITTER' | 'ACE_STARTER' | 'BULLPEN_CLOSER' | 'FRANCHISE_ANCHOR') => {
    soundManager.playBatCrack(true);
    setDeployedRole(role);
    if (onDeployCard) {
      onDeployCard(card, role);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-5xl shadow-[0_25px_60px_-15px_rgba(234,88,12,0.4)] relative overflow-hidden flex flex-col max-h-[95vh] border-2 border-orange-500/50">
        
        {/* Top Metallic Orange/Cyan Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(234,88,12,0.4)] shrink-0">
              {card.avatarIcon || '⚾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-display font-black text-white tracking-wide uppercase">
                  {card.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-amber-500 text-slate-950 shadow">
                  #{card.cardNo || 8} · {card.position}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-slate-800 text-cyan-300 border border-cyan-500/30">
                  {card.bRefWar} bRef WAR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {card.team} · {card.era} · In-Game Accumulated Sabermetrics & Community Standing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left 3D Card Stage + Right Detailed Analytical Dashboard */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Full 3D Interactive Card Stage with 360° Drag & Orbit */}
          <div className="lg:col-span-5 flex flex-col items-center liquid-glass-panel rounded-2xl p-4 border border-white/10 shadow-xl">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <span>🔄</span> 360° Interactive 3D Card
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">
                Drag to spin 360° or click flip
              </span>
            </div>

            {/* 3D Card Component with 360 drag support */}
            <div className="py-2 flex justify-center">
              <Card3D card={card} interactive={true} size="normal" />
            </div>

            {/* Quick Card Vitals Bar */}
            <div className="w-full mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Card Refractor Tier:</span>
                <span className="font-bold text-amber-300">{card.refractorTier.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Autograph Status:</span>
                <span className="font-bold text-emerald-400">
                  {card.hasAutograph ? '✓ Certified On-Card Signature' : 'Standard Collector Issue'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Synergy Trait:</span>
                <span className="font-bold text-orange-400">{statsProfile.synergyBuffSummary}</span>
              </div>
            </div>

            {/* Rainbow Chase Collection Carousel (Base -> Superfractor) */}
            <div className="w-full mt-3">
              <RainbowChaseTracker card={card} />
            </div>
          </div>

          {/* Right Column: Tabbed Analytical Breakdown */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('SEASONS');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'SEASONS' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> Accumulated Season Stats
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('GAME_MODES');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'GAME_MODES' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Stats Per Game Mode
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('COMMUNITY_RANK');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'COMMUNITY_RANK' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" /> You vs Community
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setActiveTab('DEPLOY');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'DEPLOY' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Deploy Card
              </button>
            </div>

            {/* TAB 1: ACCUMULATED STATS PER SEASON */}
            {activeTab === 'SEASONS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    In-Game Accumulated Performance By Season
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    ● Live Tracked
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-white/10">
                      <tr>
                        <th className="p-2.5">Season</th>
                        <th className="p-2.5">G</th>
                        <th className="p-2.5">PA</th>
                        <th className="p-2.5">AB</th>
                        <th className="p-2.5">H</th>
                        <th className="p-2.5">2B</th>
                        <th className="p-2.5 text-amber-400">HR</th>
                        <th className="p-2.5">RBI</th>
                        <th className="p-2.5">AVG</th>
                        <th className="p-2.5">OBP</th>
                        <th className="p-2.5">SLG</th>
                        <th className="p-2.5 text-cyan-300">OPS</th>
                        <th className="p-2.5 text-orange-400">Chops</th>
                        <th className="p-2.5 text-emerald-400">In-Game WAR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {statsProfile.seasons.map((s) => (
                        <tr key={s.seasonNumber} className="hover:bg-white/5 transition-colors font-medium">
                          <td className="p-2.5 font-bold text-amber-300 whitespace-nowrap">{s.seasonLabel}</td>
                          <td className="p-2.5">{s.games}</td>
                          <td className="p-2.5">{s.plateAppearances}</td>
                          <td className="p-2.5">{s.atBats}</td>
                          <td className="p-2.5 font-bold text-white">{s.hits}</td>
                          <td className="p-2.5">{s.doubles}</td>
                          <td className="p-2.5 font-bold text-amber-400">{s.homeRuns}</td>
                          <td className="p-2.5">{s.rbi}</td>
                          <td className="p-2.5 font-bold text-white">{s.battingAvg}</td>
                          <td className="p-2.5">{s.onBasePct}</td>
                          <td className="p-2.5">{s.sluggingPct}</td>
                          <td className="p-2.5 font-bold text-cyan-300">{s.ops}</td>
                          <td className="p-2.5 font-black text-orange-400">{s.baltimoreChopsCount}</td>
                          <td className="p-2.5 font-black text-emerald-400">+{s.inGameWarAccumulated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Analytical Sabermetric Summary Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/30 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span>Linear Weights & Value Generation</span>
                    <span>wOBA Index: .418 · Run Value Generated: +14.6 Runs</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Every plate appearance logged with this card contributes to your total franchise value using real MLB linear weights (+89 pts for singles, +127 pts for doubles, +210 pts for HRs, modified by situational Leverage Index).
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: STATS ATTAINED PER GAME MODE */}
            {activeTab === 'GAME_MODES' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    Stats Attained Using Card Per Game Mode
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">5 Active Modes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {statsProfile.gameModes.map((gm) => (
                    <div
                      key={gm.modeKey}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-orange-500/50 transition-all shadow-md space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{gm.modeIcon}</span>
                          <span className="font-display font-bold text-xs uppercase text-white truncate max-w-[170px]">
                            {gm.modeTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {gm.winRatePct}% Win Rate
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-slate-500 block">Attempts</span>
                          <span className="font-bold text-white text-xs">{gm.gamesOrAttempts}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-slate-500 block">Clutch Hits</span>
                          <span className="font-bold text-amber-400 text-xs">{gm.clutchHits}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-slate-500 block">Chop Rate</span>
                          <span className="font-bold text-orange-400 text-xs">{gm.chopSuccessRate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10.5px] font-mono pt-1 border-t border-white/5">
                        <span className="text-slate-400">Points Earned:</span>
                        <span className="font-bold text-amber-300">+{gm.userPointsEarned.toLocaleString()} Pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: YOU RANKED VS THE COMMUNITY */}
            {activeTab === 'COMMUNITY_RANK' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/50 border border-orange-500/40 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                        Global Card Owner Leaderboard
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xl font-display font-black text-amber-400">
                          Rank #{statsProfile.communityRanking.userGlobalRank}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          of {statsProfile.communityRanking.totalCardHolders.toLocaleString()} card owners
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-black bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow">
                        {statsProfile.communityRanking.topPercentileRank} Worldwide
                      </span>
                      <span className="block text-[10px] font-mono text-cyan-300 mt-1 font-bold">
                        {statsProfile.communityRanking.cardAffinityTier}
                      </span>
                    </div>
                  </div>

                  {/* Visual Benchmark Comparison Table */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                      Your Metrics vs Community Average & Top 1%:
                    </span>

                    {statsProfile.communityRanking.userStatsVsCommunity.map((metric) => (
                      <div key={metric.statName} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300 font-bold">{metric.statName}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[10px]">Avg: {metric.communityAvg}</span>
                            <span className="text-cyan-400 text-[10px]">Top 1%: {metric.topOnePercent}</span>
                            <span className="text-amber-400 font-black">{metric.yourStat}</span>
                          </div>
                        </div>

                        {/* Percentile Progress Bar */}
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(30, 70 + metric.userPctVsAvg))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TACTICAL DEPLOYMENT CONTROLS */}
            {activeTab === 'DEPLOY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Decide When & How to Deploy {card.name}
                  </h3>
                  {deployedRole && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Deployed as {deployedRole}
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  Choose a tactical role for this card in your active 26-man roster. Your deployment choice impacts lineup leverage, bench depth, and in-match clutch multipliers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {!isPitcher ? (
                    <>
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-orange-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs uppercase text-white">Starting Lineup</span>
                          <span className="text-[9px] font-mono text-amber-400 font-bold">Every Inning</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Takes regular at-bats as starting {card.position}. Generates full baseline linear weights points on every plate appearance.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeploy('STARTING_LINEUP')}
                          className="w-full py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
                        >
                          Deploy to Active Lineup
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-amber-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs uppercase text-white">Late-Inning Pinch Hitter</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">+2.5x Leverage Bonus</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Held on the bench for 8th/9th inning high-leverage situations ($LI \ge 2.0$). Gains +18 exit velocity on two-strike counts.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeploy('PINCH_HITTER')}
                          className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow transition-all"
                        >
                          Set as Pinch Hitter
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs uppercase text-white">Ace Rotation Starter</span>
                          <span className="text-[9px] font-mono text-cyan-300 font-bold">Game 1 Anchor</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Starts against opposing aces. Controls stamina decay and earns +30 pts for strikeouts.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeploy('ACE_STARTER')}
                          className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
                        >
                          Deploy as Ace Starter
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-red-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs uppercase text-white">Bullpen High-Leverage Closer</span>
                          <span className="text-[9px] font-mono text-red-400 font-bold">9th Inning Lockdown</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Enters in the 9th inning to protect leads. Immune to platoon blunder penalties.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeploy('BULLPEN_CLOSER')}
                          className="w-full py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow transition-all"
                        >
                          Deploy as Bullpen Closer
                        </button>
                      </div>
                    </>
                  )}

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 hover:border-yellow-500/50 transition-all col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs uppercase text-white">Franchise Anchor (Passive Synergy)</span>
                      <span className="text-[9px] font-mono text-yellow-300 font-bold">Roster-Wide Aura</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      Anchors your 26-man club with an all-roster buff (+5 Contact across the team and +10% higher Baltimore Chop bounce rate).
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeploy('FRANCHISE_ANCHOR')}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow transition-all"
                    >
                      Set as Franchise Anchor
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
