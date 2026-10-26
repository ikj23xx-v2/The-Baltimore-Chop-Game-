// src/components/CardRipWorkbench.tsx
import React, { useState } from 'react';
import { hobbyAudio } from '../utils/hobbySoundEngine';

interface PulledCard {
  id: string;
  name: string;
  parallel: string;
  isHit: boolean;
  isSlabbed?: boolean;
}

const MOCK_PACK_CARDS: PulledCard[] = [
  { id: '1', name: 'Starting Ace #34', parallel: 'Base Paper', isHit: false },
  { id: '2', name: 'Infield Chopper #11', parallel: 'Base Paper', isHit: false },
  { id: '3', name: 'Power Slugger #44', parallel: 'Silver Refractor', isHit: true },
  { id: '4', name: 'All-Star Closer #99', parallel: 'Atomic Mojo /150', isHit: true },
];

export const CardRipWorkbench: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [packRipped, setPackRipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [protectionLevel, setProtectionLevel] = useState<'RAW' | 'SLEEVED' | 'TOPLOADER' | 'SLABBED'>('RAW');

  const currentCard = MOCK_PACK_CARDS[currentIndex];

  const handleRipPack = () => {
    hobbyAudio.playFoilPackRip();
    setPackRipped(true);
  };

  const handleNextCard = () => {
    hobbyAudio.playCardShuffleFlick();
    setProtectionLevel('RAW');
    if (currentIndex < MOCK_PACK_CARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePennySleeve = () => {
    hobbyAudio.playPennySleeveSlide();
    setProtectionLevel('SLEEVED');
  };

  const handleToploader = () => {
    hobbyAudio.playToploaderSnap();
    setProtectionLevel('TOPLOADER');
  };

  const handleGradeAndSlab = () => {
    hobbyAudio.playSlabHandlingClack();
    setProtectionLevel('SLABBED');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#181109] border-2 border-[#8b4513] rounded-3xl p-6 shadow-2xl text-amber-100 flex flex-col items-center relative">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center border-b border-[#8b4513]/60 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <span className="text-xs font-black text-amber-400">HOBBY SHOP RIP BENCH</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-white text-sm font-bold p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!packRipped ? (
          /* Unopened Foil Pack View */
          <div className="text-center py-8">
            <div 
              onClick={handleRipPack}
              className="w-48 h-72 mx-auto bg-gradient-to-tr from-slate-900 via-amber-700/40 to-slate-800 border-2 border-amber-400 rounded-2xl flex flex-col items-center justify-between p-4 cursor-pointer hover:scale-105 transition-all shadow-xl shadow-amber-500/10 group active:scale-95"
            >
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                PULL & TEAR FOIL
              </span>
              <div className="text-5xl group-hover:rotate-6 transition-transform">🎴</div>
              <div className="text-center">
                <div className="text-xs font-black text-white">THE BALTIMORE CHOP™</div>
                <div className="text-[9px] text-amber-200/60 mt-1">4 CARDS • CHASE MOJOS</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRipPack}
              className="mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer active:scale-95"
            >
              ✂️ RIP PACK OPEN
            </button>
          </div>
        ) : (
          /* Card Inspection & Protective Storage Workbench */
          <div className="w-full flex flex-col items-center">
            
            {/* The Visual Card Display with Protective Sheen Overlays */}
            <div 
              onClick={protectionLevel === 'SLABBED' ? handleGradeAndSlab : undefined}
              className={`w-56 h-80 rounded-2xl transition-all relative flex flex-col justify-between p-4 mb-4 ${
                protectionLevel === 'SLABBED'
                  ? 'border-4 border-amber-400 bg-slate-900 shadow-2xl cursor-pointer ring-4 ring-amber-500/20 scale-105'
                  : protectionLevel === 'TOPLOADER'
                  ? 'border-2 border-sky-400/80 bg-slate-900/90 shadow-lg'
                  : protectionLevel === 'SLEEVED'
                  ? 'border border-slate-400/50 bg-slate-900/80 shadow-md'
                  : 'border border-amber-600/40 bg-slate-900'
              }`}
            >
              {/* Slabbed PSA/BGS-Style Grade Header */}
              {protectionLevel === 'SLABBED' && (
                <div className="bg-slate-950 border border-amber-500/60 rounded-md p-1.5 flex justify-between items-center text-[9px] font-bold">
                  <span className="text-slate-300">CHOP VAULT</span>
                  <span className="text-amber-400">GEM MT 10</span>
                </div>
              )}

              {/* Card Silhouette Image Artwork */}
              <div className="h-40 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-center text-4xl">
                🏏
              </div>

              {/* Card Metadata */}
              <div className="border-t border-slate-800 pt-2">
                <span className="text-[10px] font-bold text-amber-300 block">{currentCard.name}</span>
                <span className="text-[9px] text-emerald-400 font-mono block">{currentCard.parallel}</span>
              </div>

              {/* Toploader / Poly-sleeve border reflection indicator */}
              {protectionLevel !== 'RAW' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-2xl" />
              )}
            </div>

            {/* Current Protection Status Indicator */}
            <div className="text-[10px] text-slate-400 mb-4">
              State: <strong className="text-amber-400">{protectionLevel}</strong> • Card {currentIndex + 1} of {MOCK_PACK_CARDS.length}
            </div>

            {/* Sound Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-3">
              <button
                type="button"
                disabled={protectionLevel !== 'RAW'}
                onClick={handlePennySleeve}
                className="bg-[#24170b] hover:bg-amber-500/20 disabled:opacity-40 border border-amber-500/40 text-[9px] font-bold py-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                📥 Penny Sleeve
              </button>

              <button
                type="button"
                disabled={protectionLevel !== 'SLEEVED'}
                onClick={handleToploader}
                className="bg-[#24170b] hover:bg-sky-500/20 disabled:opacity-40 border border-sky-500/40 text-[9px] font-bold py-2 rounded-xl text-sky-300 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                🛡️ 35pt Toploader
              </button>

              <button
                type="button"
                disabled={protectionLevel !== 'TOPLOADER'}
                onClick={handleGradeAndSlab}
                className="bg-[#24170b] hover:bg-amber-400/20 disabled:opacity-40 border border-amber-400 text-[9px] font-bold py-2 rounded-xl text-amber-400 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                💎 Encapsulate Slab
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[9px] font-bold py-2 rounded-xl text-white transition-all cursor-pointer"
              >
                🃏 Shuffle Next
              </button>
            </div>

            {protectionLevel === 'SLABBED' && (
              <span className="text-[8.5px] text-amber-400/80 animate-pulse text-center">
                Tip: Click the acrylic slab to hear the thick plastic desk clack!
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
