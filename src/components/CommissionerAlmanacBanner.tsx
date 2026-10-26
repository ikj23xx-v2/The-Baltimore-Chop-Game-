// src/components/CommissionerAlmanacBanner.tsx
import React from 'react';
import { generateMasterGameGuidePDF } from '../services/masterMasterGuidePdfGenerator';
import { generateArtOfChopPDF } from '../services/artOfChopPdfGenerator';

export const CommissionerAlmanacBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <h2 className="text-base font-black text-amber-400 tracking-wide">
            THE COMMISSIONER'S ALMANAC
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complete franchise regulations, refractor tier odds, 99-coach matrix, and beta guide.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={generateMasterGameGuidePDF}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
        >
          <span>📄</span> Download Almanac (PDF)
        </button>
        <button
          type="button"
          onClick={generateArtOfChopPDF}
          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs px-3 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          title="Download Official Vintage Scorekeeper's Ledger PDF"
        >
          <span>⚾</span> Ledger
        </button>
      </div>
    </div>
  );
};
