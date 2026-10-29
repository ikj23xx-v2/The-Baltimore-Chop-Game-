import React, { useState, useEffect } from 'react';
import { PlayerCard, Position, CardSetId } from '../types/game';
import { ALL_PLAYERS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { soundManager } from '../services/audio';
import { Card3D } from './Card3D';
import { X, Sparkles, Award, RefreshCw, CheckCircle2, ChevronRight, UserPlus } from 'lucide-react';

interface JackpotDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraftComplete: (newRoster: PlayerCard[]) => void;
  currentRoster: PlayerCard[];
  activeSetId?: CardSetId;
}

export const DRAFT_POSITIONS: Position[] = [
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
  const [draftMode, setDraftMode] = useState<'SLOT_SPIN' | 'MANUAL_PICK'>('SLOT_SPIN');

  useEffect(() => {
    if (isOpen) {
      setDraftedRoster(currentRoster);
      // Auto-focus on first empty slot
      const firstEmpty = currentRoster.length < DRAFT_POSITIONS.length ? currentRoster.length : 0;
      setCurrentSlotIndex(firstEmpty);
      if (currentRoster.length > 0) {
        setSelectedCard(currentRoster[currentRoster.length - 1]);
      } else {
        setSelectedCard(null);
      }
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

  const applyDraftPick = (winner: PlayerCard) => {
    setSelectedCard(winner);
    const hit = winner.bRefWar >= 8.0 || winner.isHistorical;
    if (hit) {
      setIsJackpot(true);
      soundManager.playJackpotChime();
    } else {
      soundManager.playCardWhoosh();
    }

    const updated = [...draftedRoster];
    if (currentSlotIndex < updated.length) {
      updated[currentSlotIndex] = winner;
    } else {
      updated.push(winner);
    }
    setDraftedRoster(updated);
    onDraftComplete(updated);

    // Advance to next slot
    if (currentSlotIndex + 1 < DRAFT_POSITIONS.length) {
      setCurrentSlotIndex(currentSlotIndex + 1);
    }
  };

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
        const finalPool = [r1, r2, r3];
        const winner = finalPool.reduce((max, c) => (c.bRefWar > max.bRefWar ? c : max));
        setIsSpinning(false);
        applyDraftPick(winner);
      }
    }, 80);
  };

  const autoDraftAll = () => {
    if (isSpinning) return;
    soundManager.playJackpotChime();
    const newRoster: PlayerCard[] = [];
    const usedIds = new Set<string>();

    for (const pos of DRAFT_POSITIONS) {
      const posPool = ALL_PLAYERS.filter(p => p.position === pos && !usedIds.has(p.id));
      const chosen = posPool.length > 0 
        ? posPool.sort((a, b) => b.bRefWar - a.bRefWar)[Math.floor(Math.random() * Math.min(3, posPool.length))]
        : ALL_PLAYERS.find(p => !usedIds.has(p.id)) || ALL_PLAYERS[0];
      usedIds.add(chosen.id);
      newRoster.push(chosen);
    }
    setDraftedRoster(newRoster);
    onDraftComplete(newRoster);
    setSelectedCard(newRoster[0]);
    setIsJackpot(true);
    setCurrentSlotIndex(DRAFT_POSITIONS.length - 1);
  };

  const handleResetToBlank = () => {
    soundManager.playButtonClick();
    setDraftedRoster([]);
    onDraftComplete([]);
    setSelectedCard(null);
    setCurrentSlotIndex(0);
    setIsJackpot(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎰</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-display font-black text-white tracking-wide">
                  26-MAN FRANCHISE DRAFT ROOM
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                  draftedRoster.length === 0
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : draftedRoster.length === DRAFT_POSITIONS.length
                    ? 'bg-emerald-500 text-black font-extrabold'
                    : 'bg-amber-500 text-black font-bold'
                }`}>
                  {draftedRoster.length === 0
                    ? 'Blank Board (0/26)'
                    : `${draftedRoster.length}/26 Drafted`}
                </span>
                <span className="text-xs bg-orange-600/40 text-orange-300 border border-orange-500/50 px-2 py-0.5 rounded font-mono font-bold">
                  Slot #{currentSlotIndex + 1}: {targetPosition}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Draft each position slot using the 3-reel casino tumbler, or pick from top Baseball-Reference WAR legends.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToBlank}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 text-xs font-mono font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Wipe board back to blank"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Blank</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-display font-black uppercase transition-colors cursor-pointer"
            >
              Done & Save
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Draft Modal"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: Draft Controls & Tuner */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* Completion or Jackpot Banner */}
            {draftedRoster.length >= DRAFT_POSITIONS.length ? (
              <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 p-3 rounded-2xl text-center font-display font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>🎉 26-MAN OFFICIAL ROSTER COMPLETE & READY FOR GAME ACTION!</span>
              </div>
            ) : isJackpot ? (
              <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black p-3 rounded-2xl text-center font-display font-black text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-bounce">
                🎉 JACKPOT HIT! TOP HISTORICAL LEGEND DRAFTED!
              </div>
            ) : null}

            {/* Mode Switcher: Casino Tumbler vs Manual Pick */}
            <div className="flex items-center justify-between gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDraftMode('SLOT_SPIN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    draftMode === 'SLOT_SPIN'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎰</span> Spin Reel Tumbler
                </button>
                <button
                  type="button"
                  onClick={() => setDraftMode('MANUAL_PICK')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    draftMode === 'MANUAL_PICK'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📋</span> Manual Pick ({targetPosition})
                </button>
              </div>

              <button
                type="button"
                onClick={autoDraftAll}
                className="px-2.5 py-1 rounded-xl bg-orange-600/30 hover:bg-orange-600 border border-orange-500/50 text-orange-300 hover:text-white font-mono font-bold text-[11px] uppercase transition-colors shrink-0 cursor-pointer"
              >
                ⚡ Auto-Draft All 26
              </button>
            </div>

            {/* Seasonal Set Pack Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
              <span className="text-slate-400 font-bold shrink-0">FILTER PACK:</span>
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

            {/* DRAFT MODE 1: CASINO SLOT TUMBLER */}
            {draftMode === 'SLOT_SPIN' && (
              <div className="space-y-3">
                <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 shadow-inner">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 text-center tracking-widest">
                    — CASINO SLOT TUMBLER FOR SLOT #{currentSlotIndex + 1} [{targetPosition}] —
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

                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={spinSlot}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-lg tracking-wider uppercase rounded-2xl shadow-xl transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isSpinning ? 'Tumbling Reels...' : `Pull Reel for Slot #${currentSlotIndex + 1} [${targetPosition}]`}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentSlotIndex((prev) => (prev + 1) % DRAFT_POSITIONS.length)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      Next Slot ({DRAFT_POSITIONS[(currentSlotIndex + 1) % DRAFT_POSITIONS.length]}) ➔
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlotIndex((prev) => (prev > 0 ? prev - 1 : DRAFT_POSITIONS.length - 1))}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      ⬅ Prev Slot
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DRAFT MODE 2: MANUAL POSITION POOL BROWSER */}
            {draftMode === 'MANUAL_PICK' && (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase">
                    Available {targetPosition} Players ({pool.length}):
                  </span>
                  <span className="text-slate-500 text-[10px]">Sorted by bRef WAR</span>
                </div>
                <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                  {pool
                    .slice()
                    .sort((a, b) => b.bRefWar - a.bRefWar)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{player.avatarIcon}</span>
                          <div className="min-w-0">
                            <span className="text-xs font-display font-bold text-white uppercase block truncate">
                              {player.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {player.team} · {player.era} · CON: {player.stats.contact} POW: {player.stats.power}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-black text-amber-400">
                            WAR: {player.bRefWar}
                          </span>
                          <button
                            type="button"
                            onClick={() => applyDraftPick(player)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-display font-bold uppercase transition-transform active:scale-95 cursor-pointer"
                          >
                            Draft
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Position Depth Checklist / Slot Clicker */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span>26-MAN ROSTER SLOTS (CLICK ANY TO DRAFT):</span>
                <span className="font-bold text-amber-400">{draftedRoster.length}/26 FILLED</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1">
                {DRAFT_POSITIONS.map((pos, idx) => {
                  const isCurrent = idx === currentSlotIndex;
                  const isFilled = idx < draftedRoster.length;
                  const filledPlayer = draftedRoster[idx];

                  return (
                    <button
                      key={`slot-badge-${idx}`}
                      type="button"
                      onClick={() => setCurrentSlotIndex(idx)}
                      title={filledPlayer ? `#${idx + 1} ${pos}: ${filledPlayer.name} (WAR: ${filledPlayer.bRefWar})` : `#${idx + 1} ${pos}: Empty - Click to draft`}
                      className={`text-[9px] font-mono px-1 py-1 rounded border transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500 text-black border-yellow-300 font-extrabold ring-2 ring-amber-400/60 scale-105'
                          : isFilled
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 hover:border-emerald-400'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-bold">{pos}</span>
                      <span className="text-[7.5px] opacity-80">#{idx + 1}</span>
                    </button>
                  );
                })}
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
                <span className="text-xs text-emerald-400 font-mono mt-2 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Successfully added to 26-Man Roster
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Slot #{currentSlotIndex + 1} [{selectedCard.position}] · {selectedCard.name}
                </span>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 font-mono text-xs">
                <span className="text-4xl block mb-2">🎰</span>
                Board is blank!
                <div className="mt-1 text-slate-400">
                  Pull the slot reel or pick from the player pool to start drafting.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
