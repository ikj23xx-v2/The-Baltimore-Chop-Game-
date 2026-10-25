import React, { useState } from 'react';
import { CardSet, CardSetId, PlayerCard } from '../types/game';
import { CARD_SETS } from '../data/sets';
import { Card3D } from './Card3D';
import { X, Calendar, Clock, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface SeasonalSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSetId: CardSetId;
  onSelectActiveSet: (setId: CardSetId) => void;
  roster: PlayerCard[];
  samplePlayer: PlayerCard;
}

export const SeasonalSetsModal: React.FC<SeasonalSetsModalProps> = ({
  isOpen,
  onClose,
  activeSetId,
  onSelectActiveSet,
  roster,
  samplePlayer
}) => {
  const [inspectedSetId, setInspectedSetId] = useState<CardSetId>(activeSetId);

  if (!isOpen) return null;

  const inspectedSet = CARD_SETS.find((s) => s.id === inspectedSetId) || CARD_SETS[0];

  // Calculate collection progress per set
  const getCollectedCount = (setId: CardSetId) => {
    return roster.filter((p) => (p.cardSetId || 'SERIES_1') === setId).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-5xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎴</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                SEASONAL CARD SETS & RELEASE CALENDAR
                <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                  8 SETS PER YEAR
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Mimics this year's official baseball card sets with seasonal expirations, unique border treatments, and collection rewards.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sets Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: 8 Sets Cards List */}
          <div className="md:col-span-7 space-y-3 max-h-[62vh] overflow-y-auto pr-1">
            {CARD_SETS.map((set) => {
              const isSelected = inspectedSetId === set.id;
              const isActivePack = activeSetId === set.id;
              const collected = getCollectedCount(set.id);
              const pct = Math.min(100, Math.round((collected / set.totalCards) * 100));

              return (
                <div
                  key={set.id}
                  onClick={() => setInspectedSetId(set.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-display font-black text-white uppercase tracking-wide">
                          {set.name}
                        </h4>
                        {isActivePack && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500 text-black font-extrabold rounded">
                            ACTIVE DRAFT SET
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-amber-400 font-mono block">
                        {set.seasonName} · {set.dropWindow}
                      </span>
                    </div>

                    {/* Expiration or Countdown Badge */}
                    <div className="text-right shrink-0">
                      {set.status === 'ACTIVE' ? (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{set.daysRemaining}d Left (Active)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-full">
                          <Calendar className="w-3 h-3" />
                          <span>Drops in {set.daysRemaining}d</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Border Theme & Palette */}
                  <div className="text-[11px] text-slate-300 font-mono mb-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800/60">
                    <div><span className="text-slate-500">Border:</span> <strong className="text-slate-200">{set.borderTheme}</strong></div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{set.lore}</div>
                  </div>

                  {/* Collection Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Roster Collection Progress</span>
                      <span className="font-bold text-white">{collected} / {set.totalCards} cards ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Set Action Button */}
                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Top-Right Stamp: <strong className="text-amber-400 font-bold">CHOP™ Set Emblem</strong>
                    </span>
                    {isActivePack ? (
                      <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected for Draft
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActiveSet(set.id);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white rounded-lg font-mono text-[11px] font-bold transition-colors"
                      >
                        Set as Active Pack
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Live 3D Border Showcase */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800 rounded-3xl p-4">
            <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Border Preview: {inspectedSet.name}
            </span>

            <div className="flex flex-col items-center">
              <Card3D
                card={samplePlayer}
                overrideSetId={inspectedSetId}
                size="normal"
              />

              <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center w-full max-w-xs text-xs">
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">
                  {inspectedSet.borderTheme}
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Notice the unique border geometry, team colors, and the set-specific <strong className="text-white">CHOP</strong> emblem in the top right corner!
                </p>
                <button
                  type="button"
                  onClick={() => onSelectActiveSet(inspectedSetId)}
                  className="mt-2.5 w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display font-bold text-xs uppercase rounded-xl transition-all shadow"
                >
                  Use {inspectedSet.name} Border for At-Bat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
