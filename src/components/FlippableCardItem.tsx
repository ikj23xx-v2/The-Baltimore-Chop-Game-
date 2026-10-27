// src/components/FlippableCardItem.tsx
import React, { useState } from 'react';
import { PlayerCard } from '../types/game';
import { BaseballDiamondBadge } from './BaseballDiamondBadge';
import { LosslessWarBadge } from './LosslessWarBadge';
import { soundManager } from '../services/audio';
import { RotateCw, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { getPlayerBRefUrl } from '../utils/cardIconsAndNicknames';

interface FlippableCardItemProps {
  card: PlayerCard;
  onInspect?: (card: PlayerCard) => void;
  format?: 'binder' | 'sleeved' | 'slab';
}

export const FlippableCardItem: React.FC<FlippableCardItemProps> = ({
  card,
  onInspect,
  format = 'sleeved'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playCardWhoosh();
    setIsFlipped(!isFlipped);
  };

  const bRefUrl = getPlayerBRefUrl(card.name);

  // Parallel styling
  const isSuper = card.refractorTier === 'SUPERFRACTOR_1_OF_1';
  const isGold = card.refractorTier === 'GOLD_WAVE';
  const isSapphire = card.refractorTier === 'SAPPHIRE';
  const isAtomic = card.refractorTier === 'ATOMIC_MOJO';

  return (
    <div className="relative group perspective-1000 w-full select-none">
      {/* Outer Card Container */}
      <div
        className={`relative w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } ${
          format === 'slab'
            ? 'p-2 bg-gradient-to-b from-white/20 via-white/5 to-slate-900 border-2 border-slate-300/50 shadow-2xl'
            : format === 'sleeved'
            ? 'p-1.5 bg-slate-900/90 border border-amber-500/30 shadow-lg hover:border-amber-400'
            : 'p-1 bg-slate-950/80 border border-slate-800'
        }`}
        style={{ minHeight: '380px' }}
      >
        {/* ================= FRONT OF CARD ================= */}
        <div
          className={`w-full h-full flex flex-col justify-between rounded-xl overflow-hidden [backface-visibility:hidden] ${
            isFlipped ? 'pointer-events-none' : ''
          } ${
            isSuper
              ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-slate-950 border-2 border-yellow-200 shadow-[0_0_20px_rgba(253,224,71,0.5)]'
              : isGold
              ? 'bg-gradient-to-br from-amber-700 via-yellow-600 to-amber-900 text-amber-100 border border-amber-400'
              : isSapphire
              ? 'bg-gradient-to-br from-blue-900 via-cyan-900 to-indigo-950 text-cyan-100 border border-cyan-400'
              : isAtomic
              ? 'bg-gradient-to-br from-fuchsia-950 via-purple-900 to-slate-950 text-fuchsia-100 border border-fuchsia-400'
              : 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border border-white/10'
          }`}
        >
          {/* Card Front Header */}
          <div className="p-3 pb-1 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400">
                CHOP #{card.cardNo || 42}
              </span>
              {card.serialStamp && (
                <span className="text-[9px] font-mono font-black bg-black/60 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/40">
                  {card.serialStamp}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFlip}
                title="Flip to view card back biography & stats"
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-mono"
              >
                <RotateCw className="w-3 h-3" />
                <span>FLIP</span>
              </button>
            </div>
          </div>

          {/* Front Visual Body: Avatar & Position Field */}
          <div className="p-4 flex flex-col items-center justify-center relative flex-1">
            {/* Holographic light reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

            {/* Position Diamond Badge (P1-P10) */}
            <div className="absolute top-2 left-2 z-10">
              <BaseballDiamondBadge position={card.position} />
            </div>

            {/* WAR Pill Badge */}
            <div className="absolute top-2 right-2 z-10">
              <LosslessWarBadge card={card} />
            </div>

            {/* Avatar Icon */}
            <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform">
              {card.avatarIcon || '⚾'}
            </div>

            {/* Cardholder name & era */}
            <div className="text-center mt-2 z-10">
              <h4 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-white drop-shadow">
                {card.name}
              </h4>
              <p className="text-[10.5px] font-mono text-amber-300/90 font-bold">
                {card.team} · {card.era}
              </p>
            </div>
          </div>

          {/* Front Bottom Attributes */}
          <div className="p-2.5 bg-black/40 border-t border-white/10 text-[10px] font-mono flex items-center justify-between">
            <div className="flex gap-2">
              <span>CON: <strong className="text-amber-400">{card.stats.contact}</strong></span>
              <span>POW: <strong className="text-amber-400">{card.stats.power}</strong></span>
              <span>SPD: <strong className="text-amber-400">{card.stats.speed}</strong></span>
            </div>
            {onInspect && (
              <button
                type="button"
                onClick={() => onInspect(card)}
                className="text-amber-400 hover:text-amber-200 underline text-[9.5px] font-bold"
              >
                Inspect
              </button>
            )}
          </div>
        </div>

        {/* ================= BACK OF CARD (Detailed Description & B-Ref) ================= */}
        <div
          className={`absolute inset-0 p-3.5 rounded-xl flex flex-col justify-between bg-gradient-to-b from-[#0c1424] via-[#080d19] to-[#04070e] text-slate-200 border border-amber-500/40 shadow-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-display font-black text-[11px] text-amber-400 tracking-wide uppercase">
                OFFICIAL CARD BACK
              </span>
            </div>
            <button
              type="button"
              onClick={handleFlip}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[9px] font-mono"
            >
              <RotateCw className="w-3 h-3" />
              <span>FRONT</span>
            </button>
          </div>

          {/* Player Bio & Card Lore */}
          <div className="flex-1 overflow-y-auto py-2 space-y-2 text-xs scrollbar-thin">
            <div>
              <h5 className="font-display font-black text-xs text-white uppercase">{card.name}</h5>
              <p className="text-[10px] font-mono text-amber-300">{card.position} · {card.team}</p>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[9.5px] font-mono">
              <div>
                <span className="text-slate-400">BATS/THROWS:</span> <strong className="text-slate-100">{card.cardVitals?.batsThrows || 'R / R'}</strong>
              </div>
              <div>
                <span className="text-slate-400">HT / WT:</span> <strong className="text-slate-100">{card.cardVitals?.height || "6'1\""} / {card.cardVitals?.weight || '200 lbs'}</strong>
              </div>
              <div>
                <span className="text-slate-400">ERA / SEASON:</span> <strong className="text-slate-100">{card.era}</strong>
              </div>
              <div>
                <span className="text-slate-400">PARALLEL:</span> <strong className="text-amber-400">{card.refractorTier.replace(/_/g, ' ')}</strong>
              </div>
            </div>

            {/* Career / Season Stats */}
            <div className="p-2 rounded-lg bg-slate-950/90 border border-slate-800 text-[9.5px] font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 mb-1 font-bold">
                <span>HISTORICAL SABERMETRICS</span>
                <span className="text-emerald-400 font-bold">{card.bRefWar.toFixed(1)} bRef WAR</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div>
                  <span className="text-slate-500 block text-[8px]">AVG</span>
                  <strong className="text-white">{card.careerStats?.avg || '.305'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">HR</span>
                  <strong className="text-white">{card.careerStats?.homeRuns || '34'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">RBI</span>
                  <strong className="text-white">{card.careerStats?.rbi || '114'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">OPS</span>
                  <strong className="text-white">{card.careerStats?.ops || '.942'}</strong>
                </div>
              </div>
            </div>

            {/* Written Biography Lore */}
            <p className="text-[10.5px] font-sans text-slate-300 leading-relaxed italic bg-slate-900/40 p-2 rounded-lg border border-white/5">
              "{card.bio || `${card.name} remains one of the iconic franchise anchors in baseball history, known for defensive excellence and clutch contact on the diamond.`}"
            </p>
          </div>

          {/* Footer with Baseball-Reference button & Certificate */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono">
            <a
              href={bRefUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline font-bold"
            >
              <span>⚾ B-Ref Record</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>AUTHENTIC CHOP™</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
