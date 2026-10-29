import React, { useState } from 'react';
import { PlayerCard } from '../types/game';
import { Card3D } from './Card3D';
import { X, Users, Sparkles } from 'lucide-react';

interface RosterManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: PlayerCard[];
  activeBatter: PlayerCard;
  onSelectActiveBatter: (player: PlayerCard) => void;
  onOpenDraft: () => void;
}

export const RosterManagerModal: React.FC<RosterManagerModalProps> = ({
  isOpen,
  onClose,
  roster,
  activeBatter,
  onSelectActiveBatter,
  onOpenDraft
}) => {
  const [filterPos, setFilterPos] = useState<string>('ALL');
  const [inspectedCard, setInspectedCard] = useState<PlayerCard>(activeBatter);

  if (!isOpen) return null;

  const totalWar = roster.reduce((acc, p) => acc + p.bRefWar, 0);

  const filteredPlayers = roster.filter((p) => {
    if (filterPos === 'ALL') return true;
    if (filterPos === 'IF') return ['C', '1B', '2B', '3B', 'SS'].includes(p.position);
    if (filterPos === 'OF') return ['LF', 'CF', 'RF', 'DH'].includes(p.position);
    if (filterPos === 'P') return ['SP', 'RP'].includes(p.position);
    return p.position === filterPos;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl w-full max-w-5xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                26-MAN FRANCHISE ROSTER
                <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded font-bold font-mono">
                  {roster.length}/26 ACTIVE
                </span>
                <span className="text-xs bg-slate-800 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold font-mono">
                  TOTAL WAR: {totalWar.toFixed(1)}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Select your starting batter for at-bat showdowns, review player cards, and manage bench depth.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDraft}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Open Jackpot Draft
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Roster Modal"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {['ALL', 'IF', 'OF', 'P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'SP', 'RP'].map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setFilterPos(pos)}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-colors shrink-0 ${
                filterPos === pos
                  ? 'bg-orange-600 text-white border-orange-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: Player Cards Grid */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto pr-1">
            {filteredPlayers.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 text-center py-16 space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
                <span className="text-4xl block">📋</span>
                <h4 className="text-white font-display font-black text-sm uppercase tracking-wide">
                  No Players on Roster (Board is Blank)
                </h4>
                <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
                  Your 26-man franchise roster is currently blank. Draft players from the draft room to populate your lineup.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenDraft}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-display font-black text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    🎰 Start 26-Man Draft
                  </button>
                </div>
              </div>
            ) : (
              filteredPlayers.map((player) => {
              const isSelected = activeBatter.id === player.id;
              const isInspected = inspectedCard.id === player.id;

              return (
                <div
                  key={player.id}
                  onClick={() => setInspectedCard(player)}
                  className={`bg-slate-950 border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                    isInspected
                      ? 'border-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.4)]'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{player.avatarIcon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-display font-bold text-white block">
                            {player.name}
                          </strong>
                          {player.serialStamp && (
                            <span className="text-[9px] font-mono font-black text-amber-400">
                              {player.serialStamp}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {player.position} · {player.refractorTier.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      WAR {player.bRefWar}
                    </span>
                  </div>

                  {/* Quick Stats Bar */}
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center my-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block text-[9px]">CON</span>
                      <span className="text-white font-bold">{player.stats.contact}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">POW</span>
                      <span className="text-amber-400 font-bold">{player.stats.power}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">SPD</span>
                      <span className="text-emerald-400 font-bold">{player.stats.speed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">FLD</span>
                      <span className="text-cyan-400 font-bold">{player.stats.fielding}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                    <span className="text-slate-400 italic truncate max-w-[140px]">
                      {player.signatureSkill ? player.signatureSkill.replace(/_/g, ' ') : player.era.split('•')[0]}
                    </span>

                    {isSelected ? (
                      <span className="px-2 py-0.5 bg-orange-600 text-white rounded font-bold font-mono">
                        ACTIVE BATTER
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActiveBatter(player);
                          setInspectedCard(player);
                        }}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white rounded font-mono transition-colors"
                      >
                        Set as Batter
                      </button>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Right: 3D Inspect Panel */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-2">
              Inspected Player Card
            </span>
            {inspectedCard && (
              <div className="flex flex-col items-center">
                <Card3D card={inspectedCard} size="normal" />
                <button
                  type="button"
                  onClick={() => onSelectActiveBatter(inspectedCard)}
                  className="mt-3 w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-display font-bold text-xs uppercase rounded-xl transition-colors"
                >
                  Step Up to Plate as Active Batter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
