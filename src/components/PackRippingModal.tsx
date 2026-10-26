import React, { useState, useRef, useEffect } from 'react';
import { PlayerCard, CardSetId, RefractorTier } from '../types/game';
import { CARD_SETS } from '../data/sets';
import { ALL_PLAYERS } from '../data/players';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { Card3D } from './Card3D';
import { X, Sparkles, ChevronRight, RotateCcw, Award, CheckCircle2, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

interface PackRippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSetId: CardSetId;
  onCardsClaimed: (cards: PlayerCard[]) => void;
  tokensAvailable?: number;
  onDeductToken?: () => boolean;
}

export const PackRippingModal: React.FC<PackRippingModalProps> = ({
  isOpen,
  onClose,
  activeSetId,
  onCardsClaimed,
  tokensAvailable = 3,
  onDeductToken
}) => {
  // Stages: 'SEALED' -> 'RIPPING' -> 'REVEAL_CARDS' -> 'SUMMARY'
  const [packStage, setPackStage] = useState<'SEALED' | 'RIPPING' | 'REVEAL_CARDS' | 'SUMMARY'>('SEALED');
  const [tearProgress, setTearProgress] = useState(0); // 0 to 100%
  const [isDraggingTear, setIsDraggingTear] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [pulledCards, setPulledCards] = useState<PlayerCard[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isHitFanfare, setIsHitFanfare] = useState(false);

  const packRef = useRef<HTMLDivElement>(null);
  const tearStripRef = useRef<HTMLDivElement>(null);

  const activeSet = CARD_SETS.find((s) => s.id === activeSetId) || CARD_SETS[0];

  // Reset pack state on open
  useEffect(() => {
    if (isOpen) {
      setPackStage('SEALED');
      setTearProgress(0);
      setIsDraggingTear(false);
      setActiveCardIndex(0);
      setIsHitFanfare(false);
      generatePackCards();
    }
  }, [isOpen, activeSetId]);

  // Generate 5 authentic cards with refractor odds matching hobby collectibles
  const generatePackCards = () => {
    // 1. Filter set players or full pool fallback
    const setPlayers = ALL_PLAYERS.filter((p) => (p.cardSetId || 'SERIES_1') === activeSetId);
    const pool = setPlayers.length >= 5 ? setPlayers : ALL_PLAYERS;

    // Pick 5 distinct cards
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).map((player, idx) => {
      // Roll for parallel refractor tier (Guaranteed hit in slot 4 or 5)
      let tier: RefractorTier = 'BASE';
      const roll = Math.random();

      if (idx === 4) {
        // Guaranteed hit slot: 50% refractor, 25% gold wave, 15% sapphire, 8% atomic, 2% 1-of-1
        if (roll < 0.02) tier = 'SUPERFRACTOR_1_OF_1';
        else if (roll < 0.10) tier = 'ATOMIC_MOJO';
        else if (roll < 0.25) tier = 'SAPPHIRE';
        else if (roll < 0.55) tier = 'GOLD_WAVE';
        else tier = 'RAINBOW';
      } else if (idx === 3 && roll < 0.40) {
        tier = 'RAINBOW';
      }

      const serialStamp = tier === 'SUPERFRACTOR_1_OF_1' ? '1/1' : tier === 'ATOMIC_MOJO' ? '#/25' : tier === 'GOLD_WAVE' ? '#/50' : undefined;

      return {
        ...player,
        cardSetId: activeSetId,
        refractorTier: tier,
        serialStamp
      };
    });

    setPulledCards(selected);
  };

  if (!isOpen) return null;

  // Execute pack tear
  const triggerRipComplete = () => {
    setPackStage('RIPPING');
    setTearProgress(100);
    soundManager.playPackRip();
    triggerHapticFeedback('SNAP');

    setTimeout(() => {
      setPackStage('REVEAL_CARDS');
      setActiveCardIndex(0);
      soundManager.playCardWhoosh();

      // Check if first card is a hit
      const first = pulledCards[0];
      if (first && first.refractorTier !== 'BASE') {
        setIsHitFanfare(true);
        soundManager.playRefractorShine();
      }
    }, 700);
  };

  // Drag handlers for tear strip (mouse + touch for mobile Safari / Chrome)
  const handleTearStart = (clientX: number) => {
    setIsDraggingTear(true);
    setDragStartX(clientX);
    soundManager.playFoilCrinkle();
  };

  const handleTearMove = (clientX: number) => {
    if (!isDraggingTear || !tearStripRef.current) return;
    const stripRect = tearStripRef.current.getBoundingClientRect();
    const delta = clientX - stripRect.left;
    const pct = Math.min(100, Math.max(0, (delta / stripRect.width) * 100));
    setTearProgress(pct);

    if (pct >= 82) {
      setIsDraggingTear(false);
      triggerRipComplete();
    }
  };

  const handleTearEnd = () => {
    if (!isDraggingTear) return;
    setIsDraggingTear(false);
    if (tearProgress < 82) {
      setTearProgress(0); // Snap back if didn't tear all the way
    }
  };

  // Move to next card in pack
  const handleNextCard = () => {
    if (activeCardIndex < pulledCards.length - 1) {
      const nextIdx = activeCardIndex + 1;
      setActiveCardIndex(nextIdx);
      soundManager.playCardWhoosh();

      const nextCard = pulledCards[nextIdx];
      if (nextCard && nextCard.refractorTier !== 'BASE') {
        setIsHitFanfare(true);
        soundManager.playRefractorShine();
        triggerHapticFeedback('HEAVY');
      } else {
        setIsHitFanfare(false);
      }
    } else {
      // All cards revealed -> show pack summary
      setPackStage('SUMMARY');
      soundManager.playJackpotChime();
    }
  };

  const handleClaimAll = () => {
    onCardsClaimed(pulledCards);
    soundManager.playJackpotChime();
    onClose();
  };

  const handleRipAnother = () => {
    if (onDeductToken && !onDeductToken()) {
      return;
    }
    setPackStage('SEALED');
    setTearProgress(0);
    setActiveCardIndex(0);
    setIsHitFanfare(false);
    generatePackCards();
  };

  const currentCard = pulledCards[activeCardIndex] || pulledCards[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-4xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] border border-orange-500/30">
        {/* Top Metallic Orange/Gold Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">⚡</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                  DIAMOND FOIL PACK RIP
                </h2>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-orange-600 text-white shadow-sm">
                  5 CARDS / PACK
                </span>
              </div>
              <p className="text-xs text-amber-300 font-mono">
                {activeSet.name} · {activeSet.seasonName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Pack Ripping Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN PACK RIP ARENA */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[460px] overflow-y-auto py-2">
          
          {/* ================= STAGE 1: SEALED FOIL PACK WITH TEAR STRIP ================= */}
          {(packStage === 'SEALED' || packStage === 'RIPPING') && (
            <div className="flex flex-col items-center justify-center text-center max-w-sm w-full animate-fade-in">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                SWIPE TEAR STRIP OR TAP QUICK RIP
              </span>

              {/* FOIL PACK 3D SLAB */}
              <div
                ref={packRef}
                className={`relative w-72 h-[410px] rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 ${
                  packStage === 'RIPPING' ? 'scale-105 rotate-1 blur-[1px]' : 'hover:scale-[1.02]'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 40%, #1e1b4b 70%, #090d16 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -4px 8px rgba(0, 0, 0, 0.9)'
                }}
              >
                {/* Metallic Serrated Top Foil Crimp with Integrated Perforated Rip Header */}
                <div 
                  className="w-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-b border-black/40"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 3px, #cbd5e1 3px, #cbd5e1 6px)'
                  }}
                >
                  <div className="h-5 w-full flex items-center justify-between px-2.5">
                    <span className="text-[7.5px] font-mono font-black text-slate-800 tracking-widest uppercase">
                      ★ TOP CRIMP SEAL ★
                    </span>
                    <span className="text-[7.5px] font-mono font-bold text-slate-700">
                      5 CARDS / PACK
                    </span>
                  </div>

                  {/* PROPER TOP FOIL RIP STRIP (WHERE TRADING CARD PACKS ARE ACTUALLY RIPPED) */}
                  <div className="w-full px-1.5 pb-1.5 pt-0.5">
                    <div 
                      ref={tearStripRef}
                      onMouseDown={(e) => handleTearStart(e.clientX)}
                      onMouseMove={(e) => handleTearMove(e.clientX)}
                      onMouseUp={handleTearEnd}
                      onTouchStart={(e) => {
                        if (e.touches[0]) handleTearStart(e.touches[0].clientX);
                      }}
                      onTouchMove={(e) => {
                        if (e.touches[0]) handleTearMove(e.touches[0].clientX);
                      }}
                      onTouchEnd={handleTearEnd}
                      className="relative h-10 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 p-0.5 cursor-grab active:cursor-grabbing border-2 border-yellow-200 shadow-[0_2px_12px_rgba(245,158,11,0.6)] flex items-center overflow-hidden"
                    >
                      {/* Perforated tear notch lines */}
                      <div className="absolute inset-x-0 top-0.5 border-t border-dashed border-black/60" />
                      <div className="absolute inset-x-0 bottom-0.5 border-b border-dashed border-black/60" />

                      {/* Pull tab handle */}
                      <div 
                        className="h-8 px-2.5 rounded bg-black text-amber-300 font-display font-black text-[11px] flex items-center gap-1 shadow-md border border-yellow-300 transition-transform duration-75 select-none"
                        style={{
                          transform: `translateX(${tearProgress * 1.85}px)`
                        }}
                      >
                        <span>PULL</span>
                        <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
                      </div>

                      <span className="ml-auto pr-2 text-[9px] font-mono font-black text-slate-950 uppercase tracking-widest pointer-events-none flex items-center gap-1">
                        TEAR TOP SEAL ✂️ ➡️
                      </span>
                    </div>
                  </div>
                </div>

                {/* Foil Sheen Diagonal Light Sweep */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                  style={{
                    background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.8) 50%, transparent 80%)'
                  }}
                />

                {/* Pack Art & Set Badges */}
                <div className="p-4 flex flex-col items-center justify-between h-[310px] relative z-10">
                  <div className="w-full text-center mt-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                      OFFICIAL MLBPA LICENSED
                    </span>
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight drop-shadow-md">
                      {activeSet.name}
                    </h3>
                    <span className="text-xs font-mono text-orange-400 font-bold">
                      2026 EDITION
                    </span>
                  </div>

                  {/* Pack Central Medallion Art */}
                  <div className="my-auto flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-black/50 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                      ⚾
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 mt-2">
                      Swipe top tab across to rip foil
                    </span>
                  </div>

                  {/* Bottom Pack Features */}
                  <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-2">
                    <span>GUARANTEED REFRACTOR</span>
                    <span className="text-amber-400 font-bold">1:1 SUPERFRACTOR ODDS</span>
                  </div>
                </div>

                {/* Bottom Serrated Foil Crimp */}
                <div 
                  className="h-6 w-full absolute bottom-0 inset-x-0 flex items-center justify-between px-2 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-t border-black/40"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 3px, #cbd5e1 3px, #cbd5e1 6px)'
                  }}
                >
                  <span className="text-[7.5px] font-mono text-slate-800">
                    BALTIMORE CHOP™
                  </span>
                  <span className="text-[7.5px] font-mono text-slate-800">
                    MADE IN USA
                  </span>
                </div>
              </div>

              {/* 1-Tap Quick Rip Button */}
              <button
                type="button"
                onClick={triggerRipComplete}
                className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>⚡</span> QUICK RIP PACK
              </button>
            </div>
          )}

          {/* ================= STAGE 2: CARD-BY-CARD REVEAL ================= */}
          {packStage === 'REVEAL_CARDS' && currentCard && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full max-w-md">
              {/* Card counter pill */}
              <div className="flex items-center justify-between w-full px-4 mb-3">
                <span className="text-xs font-mono font-bold text-slate-400">
                  CARD <span className="text-amber-400 font-black text-sm">{activeCardIndex + 1}</span> OF {pulledCards.length}
                </span>

                {currentCard.refractorTier !== 'BASE' && (
                  <span className="text-xs font-display font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    HIT: {currentCard.refractorTier.replace(/_/g, ' ')}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setPackStage('SUMMARY')}
                  className="text-xs font-mono text-slate-400 hover:text-white underline underline-offset-4"
                >
                  Reveal All
                </button>
              </div>

              {/* 3D Interactive Card (Includes touch tilt, gyroscope, 3D Diamond Position badge) */}
              <div className="my-2 transform scale-95 sm:scale-100 transition-all">
                <Card3D
                  card={currentCard}
                  size="normal"
                  interactive={true}
                  overrideSetId={activeSetId}
                />
              </div>

              {/* Card Action Controls */}
              <div className="flex items-center gap-3 mt-4 w-full max-w-xs justify-center">
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-display font-black text-sm uppercase tracking-wide shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{activeCardIndex < pulledCards.length - 1 ? 'Next Card' : 'View Pack Summary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400 mt-2">
                Tip: Drag card to tilt 3D shimmer · Tap ⟳ to inspect back stats
              </span>
            </div>
          )}

          {/* ================= STAGE 3: PACK SUMMARY RECAP ================= */}
          {packStage === 'SUMMARY' && (
            <div className="w-full flex flex-col items-center text-center animate-fade-in">
              <div className="mb-4">
                <span className="text-2xl">🎉</span>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wide">
                  PACK RECAP · 5 NEW CARDS
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  All 5 cards pulled from {activeSet.name} are ready for your roster & draft board.
                </p>
              </div>

              {/* 5 Cards Row Showcase */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full mb-6">
                {pulledCards.map((card, idx) => (
                  <div 
                    key={card.id + idx}
                    className="liquid-glass-panel rounded-2xl p-2.5 flex flex-col items-center text-center border border-slate-800 hover:border-orange-500/50 transition-all"
                  >
                    <div className="text-3xl my-1">{card.avatarIcon}</div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                      {card.position}
                    </span>
                    <h5 className="text-xs font-display font-black text-white truncate w-full uppercase">
                      {card.name}
                    </h5>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[9px] font-mono text-slate-400">
                        WAR {card.bRefWar.toFixed(1)}
                      </span>
                      {card.refractorTier !== 'BASE' && (
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-400 text-slate-950 uppercase">
                          {card.refractorTier.split('_')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
                <button
                  type="button"
                  onClick={handleClaimAll}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-display font-black text-sm uppercase tracking-wide shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Claim & Add to Roster
                </button>

                <button
                  type="button"
                  onClick={handleRipAnother}
                  className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 font-display font-bold text-sm uppercase tracking-wide transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Rip Another Pack
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
