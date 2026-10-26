// src/components/ArtOfChopBanner.tsx
import React from 'react';
import { generateMasterGameGuidePDF } from '../services/masterMasterGuidePdfGenerator';

export const ArtOfChopBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl select-none">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <h2 className="text-xl font-black text-amber-400 tracking-wider">
            THE ART OF CHOP
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            OFFICIAL HANDBOOK
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          The definitive field manual for 26-man roster management, low-zone bounce mechanics, 
          grading rubrics, and authentic pack odds.
        </p>
      </div>

      <button
        type="button"
        onClick={generateMasterGameGuidePDF}
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
      >
        <span>📄</span> Download "The Art of Chop" (PDF)
      </button>
    </div>
  );
};
