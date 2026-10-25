import React, { useState, useEffect } from 'react';
import { PlayerCard, Position, CardSetId } from '../types/game';
import { ALL_PLAYERS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { soundManager } from '../services/audio';
import { Card3D } from './Card3D';
import { X, Sparkles, Award } from 'lucide-react';

interface JackpotDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraftComplete: (newRoster: PlayerCard[]) => void;
  currentRoster: PlayerCard[];
  activeSetId?: CardSetId;
}

const DRAFT_POSITIONS: Position[] = [
  'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH',
  'SP', 'SP', 'SP', 'SP', 'SP',
  'RP', 'RP', 'RP', 'RP', 'RP', 'RP', 'RP',
  'C', '1B', '2B', 'SS', 'CF'
];

export const JackpotDraftModal: React.FC<JackpotDraftModalProps> = ({
  isOpen,
  onClose,
  onDraftComplete,
  currentRoster,
  activeSetId = 'SERIES_1'
}) => {
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [selectedSetFilter, setSelectedSetFilter] = useState<string>('ALL');
  const [isSpinning, setIsSpinning] = useState(false);
  const [reel1, setReel1] = useState<PlayerCard>(ALL_PLAYERS[0]);
  const [reel2, setReel2] = useState<PlayerCard>(ALL_PLAYERS[1]);
  const [reel3, setReel3] = useState<PlayerCard>(ALL_PLAYERS[2]);
  const [selectedCard, setSelectedCard] = useState<PlayerCard | null>(null);
  const [isJackpot, setIsJackpot] = useState(false);
  const [draftedRoster, setDraftedRoster] = useState<PlayerCard[]>(currentRoster);

  useEffect(() => {
    if (isOpen) {
      setDraftedRoster(currentRoster);
    }
  }, [isOpen, currentRoster]);

  if (!isOpen) return null;

  const targetPosition = DRAFT_POSITIONS[currentSlotIndex] || 'SS';
  const eligiblePool = ALL_PLAYERS.filter(p => {
    const posMatch = p.position === targetPosition;
    if (selectedSetFilter === 'ALL') return posMatch;
    return posMatch && (p.cardSetId || 'SERIES_1') === selectedSetFilter;
  });
  const pool = eligiblePool.length > 0 ? eligiblePool : ALL_PLAYERS.filter(p => p.position === targetPosition);

  const spinSlot = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsJackpot(false);
    setSelectedCard(null);

    let counter = 0;
    const interval = setInterval(() => {
      soundManager.playSlotTick();
      const r1 = pool[Math.floor(Math.random() * pool.length)];
      const r2 = pool[Math.floor(Math.random() * pool.length)];
      const r3 = pool[Math.floor(Math.random() * pool.length)];
      setReel1(r1);
      setReel2(r2);
      setReel3(r3);
      counter++;

      if (counter >= 16) {
        clearInterval(interval);
        // Final selection
        const finalPool = [r1, r2, r3];
        const winner = finalPool.reduce((max, c) => (c.bRefWar > max.bRefWar ? c : max));
        setSelectedCard(winner);
        setIsSpinning(false);

        // Check if jackpot triggered (high WAR historical legend)
        const hit = winner.bRefWar >= 8.0 || winner.isHistorical;
        if (hit) {
          setIsJackpot(true);
          soundManager.playJackpotChime();
        }

        // Add to roster
        const updated = [...draftedRoster];
        const existingIdx = updated.findIndex(p => p.position === targetPosition);
        if (existingIdx !== -1) {
          updated[existingIdx] = winner;
        } else {
          updated.push(winner);
        }
        setDraftedRoster(updated);
        onDraftComplete(updated);
      }
    }, 80);
  };

  const autoDraftAll = () => {
    if (isSpinning) return;
    soundManager.playJackpotChime();
    const newRoster: PlayerCard[] = [];
    for (const pos of DRAFT_POSITIONS) {
      const posPool = ALL_PLAYERS.filter(p => p.position === pos);
      const chosen = posPool.length > 0 
        ? posPool[Math.floor(Math.random() * posPool.length)]
        : ALL_PLAYERS[Math.floor(Math.random() * ALL_PLAYERS.length)];
      newRoster.push(chosen);
    }
    setDraftedRoster(newRoster);
    onDraftComplete(newRoster);
    setSelectedCard(newRoster[0]);
    setIsJackpot(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎰</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                26-MAN CASINO JACKPOT DRAFT
                <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold uppercase">
                  Slot #{currentSlotIndex + 1}/26: {targetPosition}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Spin 3-reel casino tumbler to draft active stars and historical Baseball-Reference WAR legends.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Draft Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: 3-Reel Casino Tumbler */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* Jackpot Banner */}
            {isJackpot && (
              <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black p-3 rounded-2xl text-center font-display font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-bounce">
                🎉 JACKPOT HIT! TOP HISTORICAL LEGEND DRAFTED!
              </div>
            )}

            {/* Seasonal Set Pack Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
              <span className="text-slate-400 font-bold shrink-0">PACK:</span>
              <button
                type="button"
                onClick={() => setSelectedSetFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg border font-bold shrink-0 transition-colors ${
                  selectedSetFilter === 'ALL'
                    ? 'bg-amber-500 text-black border-yellow-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Sets
              </button>
              {CARD_SETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSetFilter(s.id)}
                  className={`px-2 py-1 rounded-lg border font-bold shrink-0 transition-colors ${
                    selectedSetFilter === s.id
                      ? 'bg-amber-500 text-black border-yellow-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.id.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* 3-Reel Tumbler Slots */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 shadow-inner">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 text-center tracking-widest">
                — CASINO SLOT TUMBLER ({selectedSetFilter === 'ALL' ? 'ALL SETS' : selectedSetFilter}) —
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[reel1, reel2, reel3].map((r, i) => (
                  <div
                    key={`reel-${i}`}
                    className={`bg-slate-900 border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${
                      isSpinning
                        ? 'border-amber-400 scale-95 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'border-slate-800'
                    }`}
                  >
                    <span className="text-3xl mb-1">{r.avatarIcon}</span>
                    <span className="text-xs font-display font-bold text-white truncate w-full">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-mono text-orange-400">
                      {r.position} · {r.era.split('•')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold mt-1">
                      WAR: {r.bRefWar}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Draft Controls */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={isSpinning}
                onClick={spinSlot}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-lg tracking-wider uppercase rounded-2xl shadow-xl transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {isSpinning ? 'Tumbling Reels...' : `Pull Reel for [${targetPosition}]`}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentSlotIndex((prev) => (prev + 1) % DRAFT_POSITIONS.length)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase rounded-xl transition-colors"
                >
                  Skip to Next Slot ({DRAFT_POSITIONS[(currentSlotIndex + 1) % DRAFT_POSITIONS.length]})
                </button>
                <button
                  type="button"
                  onClick={autoDraftAll}
                  className="py-2 px-4 bg-orange-600/30 hover:bg-orange-600 border border-orange-500/50 text-orange-300 hover:text-white font-display font-bold text-xs uppercase rounded-xl transition-colors"
                >
                  ⚡ Auto-Draft 26 Roster
                </button>
              </div>
            </div>

            {/* Position Depth Checklist */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">
                ROSTER PROGRESS: {draftedRoster.length}/26 PLAYERS FILLED
              </span>
              <div className="flex flex-wrap gap-1">
                {DRAFT_POSITIONS.map((pos, idx) => (
                  <span
                    key={`slot-badge-${idx}`}
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      idx === currentSlotIndex
                        ? 'bg-amber-500 text-black border-yellow-300 font-bold'
                        : idx < draftedRoster.length
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Selected Card 3D Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Latest Draft Reveal
            </span>
            {selectedCard ? (
              <div className="flex flex-col items-center">
                <Card3D card={selectedCard} size="normal" />
                <span className="text-xs text-emerald-400 font-mono mt-2 font-bold">
                  ✓ Successfully added to 26-Man Roster
                </span>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 font-mono text-xs">
                <span className="text-4xl block mb-2">🎰</span>
                Pull the slot tumbler lever to reveal your draft pick!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
