// src/components/ArtOfChopBanner.tsx
import React from 'react';
import { generateMasterGameGuidePDF } from '../services/masterMasterGuidePdfGenerator';

interface ArtOfChopBannerProps {
  onOpenGallery?: () => void;
  onOpenSeasonalBinder?: () => void;
}

export const ArtOfChopBanner: React.FC<ArtOfChopBannerProps> = ({ 
  onOpenGallery,
  onOpenSeasonalBinder,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 shadow-md select-none text-xs">
      <div className="flex items-center gap-2">
        <span className="text-lg">📖</span>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xs sm:text-sm font-black text-amber-400 tracking-wide uppercase">
            THE ART OF CHOP
          </h2>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            OFFICIAL HANDBOOK
          </span>
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            • 26-man roster regulations, low-zone bounce mechanics & authentic pack odds
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
        {onOpenGallery && (
          <button
            type="button"
            onClick={onOpenGallery}
            className="bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <span>🗂️</span> Master 564
          </button>
        )}
        {onOpenSeasonalBinder && (
          <button
            type="button"
            onClick={onOpenSeasonalBinder}
            className="bg-slate-800 hover:bg-slate-750 text-orange-300 border border-orange-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <span>🎃❄️</span> Holiday Vault
          </button>
        )}
        <button
          type="button"
          onClick={generateMasterGameGuidePDF}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl transition-transform hover:scale-105 shadow flex items-center gap-1 whitespace-nowrap cursor-pointer active:scale-95"
        >
          <span>📄</span> PDF
        </button>
      </div>
    </div>
  );
};
