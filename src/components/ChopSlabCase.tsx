// src/components/ChopSlabCase.tsx
import React, { useState } from 'react';
import { PlayerCard } from '../types/game';
import { CertifiedSlabReport, evaluateCardGrading } from '../engine/cardGradingEngine';
import { Card3D } from './Card3D';
import { ShieldCheck, ChevronDown, ChevronUp, Sparkles, QrCode } from 'lucide-react';

interface ChopSlabCaseProps {
  card: PlayerCard;
  report?: CertifiedSlabReport;
  customStickerNote?: string;
  className?: string;
}

export const ChopSlabCase: React.FC<ChopSlabCaseProps> = ({
  card,
  report: initialReport,
  customStickerNote,
  className = '',
}) => {
  const [showSubgrades, setShowSubgrades] = useState(false);
  const report = initialReport || evaluateCardGrading(card);

  const isGemOrPristine = report.gradeTier === 'PRISTINE_10' || report.gradeTier === 'GEM_MINT_10';

  return (
    <div className={`relative max-w-sm mx-auto p-4 select-none font-sans ${className}`}>
      {/* Heavy Sonic-Welded Outer Beveled Acrylic Casing */}
      <div className="relative rounded-3xl p-3.5 bg-gradient-to-b from-white/20 via-white/5 to-white/10 backdrop-blur-md border-4 border-slate-300/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.5)]">
        
        {/* Sonic Welded Corner Rivets */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-slate-400 bg-slate-300/60 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-slate-400 bg-slate-300/60 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-slate-400 bg-slate-300/60 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-slate-400 bg-slate-300/60 shadow-inner" />

        {/* 1. Official BGS/PSA Style Frosted Header Label */}
        <div className="relative z-20 mb-3 rounded-xl overflow-hidden border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-2.5 shadow-lg">
          
          {/* Top Row: Year, Set & Brand */}
          <div className="flex justify-between items-center text-[9px] font-mono border-b border-slate-800 pb-1 mb-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              {card.era ? card.era.split('•')[0] : '2024'} THE BALTIMORE CHOP™
            </span>
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>CERT #{report.certId}</span>
            </div>
          </div>

          {/* Middle Row: Player Name, Team, and Giant Numeric Grade */}
          <div className="flex justify-between items-center py-0.5">
            <div>
              <h3 className="font-display font-black text-sm text-white tracking-wide uppercase">
                {card.name}
              </h3>
              <p className="text-[10px] font-mono text-amber-400/90 font-bold">
                {card.team} · #{card.cardNo || 8}
              </p>
              <span className="inline-block text-[8px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase mt-0.5">
                {card.refractorTier.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Huge Composite Grade Badge */}
            <div className="text-right flex flex-col items-end">
              <div className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 shadow-md ${
                isGemOrPristine
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-amber-200 font-black'
                  : 'bg-slate-800 text-amber-400 border-amber-500/40'
              }`}>
                {isGemOrPristine && <Sparkles className="w-3.5 h-3.5 fill-black" />}
                <span className="text-2xl font-black font-display tracking-tight leading-none">
                  {report.compositeGrade.toFixed(1)}
                </span>
              </div>
              <span className="text-[8px] font-mono font-black tracking-widest text-slate-300 uppercase mt-0.5">
                {report.gradeTier.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Subgrade Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowSubgrades(!showSubgrades)}
            className="w-full mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[8px] font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>SUBGRADES & POPULATION REPORT</span>
            {showSubgrades ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Collapsible Subgrade Drawer */}
          {showSubgrades && (
            <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[8px] font-mono bg-slate-900/80 p-2 rounded-lg">
              <div>
                <span className="text-slate-400">CENTERING:</span> <strong className="text-white">{report.subgrades.centering.toFixed(1)}</strong>
              </div>
              <div>
                <span className="text-slate-400">CORNERS:</span> <strong className="text-white">{report.subgrades.corners.toFixed(1)}</strong>
              </div>
              <div>
                <span className="text-slate-400">EDGES:</span> <strong className="text-white">{report.subgrades.edges.toFixed(1)}</strong>
              </div>
              <div>
                <span className="text-slate-400">SURFACE:</span> <strong className="text-white">{report.subgrades.surface.toFixed(1)}</strong>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800 flex justify-between text-[7.5px] text-slate-400">
                <span>HISTORICAL WAR: {report.subgrades.historicalWarGrade.toFixed(1)}/10</span>
                <span>POP HIGHER: {report.populationHigher} | EQUAL: {report.populationEqual}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Embedded 3D Card Inside Recessed Acrylic Well */}
        <div className="rounded-2xl p-1 bg-black/40 border-2 border-white/10 shadow-inner flex items-center justify-center">
          <Card3D card={card} size="normal" interactive={true} />
        </div>

        {/* 3. Optional Custom Authenticator Sticker / Seal */}
        {customStickerNote && (
          <div className="mt-3 p-2 rounded-xl bg-amber-950/70 border border-amber-500/50 flex items-center gap-2 text-[9px] font-mono text-amber-200">
            <span className="text-sm">⭐</span>
            <span className="font-bold">{customStickerNote}</span>
          </div>
        )}

      </div>
    </div>
  );
};
