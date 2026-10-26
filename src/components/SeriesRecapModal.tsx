// src/components/SeriesRecapModal.tsx
import React from 'react';
import { SeriesRecapReport } from '../engine/seriesAnalysisEngine';
import { Trophy, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface SeriesRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recap: SeriesRecapReport;
  onAdvanceToNextSeries: () => void;
}

export const SeriesRecapModal: React.FC<SeriesRecapModalProps> = ({
  isOpen,
  onClose,
  recap,
  onAdvanceToNextSeries,
}) => {
  if (!isOpen) return null;

  const isWin = recap.seriesResult === 'SWEEP_WIN' || recap.seriesResult === 'SERIES_WON';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-black text-amber-400 tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>3-GAME SERIES POST-MORTEM</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Series {recap.seriesId} Outcome: <strong className="text-slate-100">{recap.record.wins}W - {recap.record.losses}L</strong> ({recap.seriesResult.replace('_', ' ')})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Series Outcome Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isWin
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : 'bg-red-950/40 border-red-500/50 text-red-300'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest block font-bold">
              SERIES VERDICT
            </span>
            <span className="text-lg font-black tracking-wide block">
              {recap.seriesResult === 'SWEEP_WIN' ? '🧹 3-0 CLEAN SWEEP VICTORY!' :
               recap.seriesResult === 'SERIES_WON' ? '🏆 2-1 SERIES WIN' :
               recap.seriesResult === 'SWEPT' ? '❌ 0-3 SWEPT BY OPPONENT' : '⚠️ 1-2 SERIES DEFEAT'}
            </span>
          </div>

          <div className="text-right font-mono">
            <span className="text-2xl font-black">
              {recap.record.wins} - {recap.record.losses}
            </span>
          </div>
        </div>

        {/* Strengths & Vulnerabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Key Strengths */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>KEY STRENGTHS</span>
            </span>
            <ul className="space-y-1 text-slate-300">
              {recap.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vulnerabilities */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>AREAS FOR DRILL WORK</span>
            </span>
            <ul className="space-y-1 text-slate-300">
              {recap.vulnerabilities.map((vuln, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Opponent Scouting Intel */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              🔭 SCOUTING REPORT: UPCOMING OPPONENT
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-400/40">
              {recap.upcomingOpponentIntel.starterPitchTypeBias.replace(/_/g, ' ')}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {recap.upcomingOpponentIntel.opponentName} Rotation Breakdown
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {recap.upcomingOpponentIntel.recommendedTactic}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Review Box Scores
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onAdvanceToNextSeries();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Advance to Next Series</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
