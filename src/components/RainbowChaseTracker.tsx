import React, { useState } from 'react';
import { RefractorTier, REFRACTOR_REGISTRY, ALL_REFRACTOR_TIERS } from '../types/refractors';
import { PlayerCard } from '../types/game';
import { soundManager } from '../services/audio';
import { Sparkles, Trophy, CheckCircle2, Lock, Flame, ShieldAlert } from 'lucide-react';

interface RainbowChaseTrackerProps {
  card: PlayerCard;
  collectedTiers?: RefractorTier[];
  selectedTier?: RefractorTier;
  onSelectTier?: (tier: RefractorTier) => void;
  onRainbowCompleted?: (cardName: string) => void;
}

export const RainbowChaseTracker: React.FC<RainbowChaseTrackerProps> = ({
  card,
  collectedTiers = ['BASE'],
  selectedTier,
  onSelectTier,
  onRainbowCompleted
}) => {
  // Demo collection state: Card starts with BASE and current tier collected
  const [userCollected, setUserCollected] = useState<Set<RefractorTier>>(() => {
    const set = new Set<RefractorTier>(collectedTiers);
    set.add('BASE');
    if (card.refractorTier === 'SUPERFRACTOR_1_OF_1') set.add('SUPERFRACTOR');
    else if (card.refractorTier === 'GOLD_WAVE') set.add('GOLD_WAVE');
    else if (card.refractorTier === 'SAPPHIRE') set.add('SAPPHIRE');
    else if (card.refractorTier === 'ATOMIC_MOJO') set.add('ATOMIC_MOJO');
    else if (card.refractorTier === 'RAINBOW') set.add('SILVER_REFRACTOR');
    return set;
  });

  const isRainbowComplete = ALL_REFRACTOR_TIERS.every(t => userCollected.has(t));

  const toggleCollectTier = (tier: RefractorTier, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playRefractorShine();
    setUserCollected(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        if (tier !== 'BASE') next.delete(tier); // keep BASE permanent
      } else {
        next.add(tier);
      }
      if (ALL_REFRACTOR_TIERS.every(t => next.has(t))) {
        soundManager.playHomeRunFanfare();
        onRainbowCompleted?.(card.name);
      }
      return next;
    });
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-700/80 p-3 sm:p-4 backdrop-blur-md shadow-xl">
      {/* Header and Progress */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wider">
                The Rainbow Chase Collection
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 font-bold">
                {userCollected.size} / 6 TIERS
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400">
              Collect all 6 parallels for <strong className="text-white">{card.name}</strong> to unlock the public Master Rainbow flex.
            </p>
          </div>
        </div>

        {/* Master Rainbow Badge */}
        {isRainbowComplete ? (
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(251,191,36,0.8)] border border-yellow-200 animate-pulse">
            <Trophy className="w-4 h-4 text-black" />
            <span>Master Rainbow Completed!</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              // Quick demo unlock all
              soundManager.playHomeRunFanfare();
              setUserCollected(new Set(ALL_REFRACTOR_TIERS));
              onRainbowCompleted?.(card.name);
            }}
            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline underline-offset-2"
            title="Complete full rainbow for demonstration"
          >
            ⚡ Test 6/6 Complete
          </button>
        )}
      </div>

      {/* 6-Slot Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {ALL_REFRACTOR_TIERS.map(tier => {
          const config = REFRACTOR_REGISTRY[tier];
          const hasUnlocked = userCollected.has(tier);
          const isCurrentActive = selectedTier === tier;

          return (
            <div
              key={tier}
              onClick={() => onSelectTier?.(tier)}
              className={`relative rounded-xl p-2.5 flex flex-col justify-between transition-all cursor-pointer border ${
                isCurrentActive
                  ? 'ring-2 ring-orange-500 scale-102 ' + config.cssBorderClass
                  : hasUnlocked
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 ' + config.cssBorderClass
                  : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-85'
              }`}
            >
              {/* Top: Serial Stamp or Base indicator */}
              <div className="flex items-center justify-between text-[9px] font-mono mb-1.5">
                <span className={`px-1.5 py-0.2 rounded font-black border text-[8px] ${config.badgeColor}`}>
                  {config.serialMax ? (config.serialMax === 1 ? '1/1' : `#/${config.serialMax}`) : 'OPEN'}
                </span>
                
                <button
                  type="button"
                  onClick={(e) => toggleCollectTier(tier, e)}
                  title={hasUnlocked ? 'Collected' : 'Click to toggle unlock'}
                  className="text-xs transition-transform hover:scale-125"
                >
                  {hasUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Center: Parallel Name & Foil Preview swatch */}
              <div className="my-1">
                <span className="text-[11px] font-display font-black text-white block leading-tight truncate">
                  {config.displayName}
                </span>
                <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                  +{config.attributeBoost} Stats · {config.pointMultiplier}x Pts
                </span>
              </div>

              {/* Mini Shader swatch line */}
              <div className="mt-1 pt-1 border-t border-slate-700/60 flex items-center justify-between text-[8px] font-mono">
                <span className="text-slate-400 uppercase">
                  {(config.shaderEffect || 'core').replace('_', ' ')}
                </span>
                {hasUnlocked && (
                  <span className="text-emerald-400 font-bold">OWNED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
