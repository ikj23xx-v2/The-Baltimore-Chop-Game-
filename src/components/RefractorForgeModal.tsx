import React, { useState } from 'react';
import { PlayerCard, RefractorTier } from '../types/game';
import { RefractorForgeEngine } from '../game/refractorEngine';
import { soundManager } from '../services/audio';
import { Card3D } from './Card3D';
import { X, Sparkles, Flame, ShieldAlert, Award } from 'lucide-react';

interface RefractorForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchisePoints: number;
  onDeductPoints: (pts: number) => boolean;
  roster: PlayerCard[];
  onUpdateCard: (updated: PlayerCard) => void;
}

export const RefractorForgeModal: React.FC<RefractorForgeModalProps> = ({
  isOpen,
  onClose,
  franchisePoints,
  onDeductPoints,
  roster,
  onUpdateCard
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(roster[0]?.id || '');
  const [targetTier, setTargetTier] = useState<Exclude<RefractorTier, 'BASE'>>('RAINBOW');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const selectedCard = roster.find((c) => c.id === selectedCardId) || roster[0];
  const tierConfig = RefractorForgeEngine.FORGE_TIERS[targetTier];

  const handleUpgrade = () => {
    if (!selectedCard) return;

    const res = RefractorForgeEngine.upgradeCard(selectedCard, targetTier, franchisePoints);
    if (!res.success || !res.updatedCard) {
      setFeedbackMsg({ text: res.error || 'Upgrade failed.', error: true });
      soundManager.playUmpireCall(true);
      return;
    }

    const deducted = onDeductPoints(res.cost);
    if (deducted) {
      onUpdateCard(res.updatedCard);
      soundManager.playRefractorShine();
      setFeedbackMsg({
        text: `✨ Successfully forged ${res.updatedCard.name} into a dazzling ${targetTier.replace(/_/g, ' ')}!`,
        error: false
      });
    }
  };

  const handleBurnRedemption = (limit: 500 | 10) => {
    const res = RefractorForgeEngine.redeemBurnCards(roster, limit);
    if (!res.success || !res.serialStamp) {
      setFeedbackMsg({ text: res.error || 'Burn redemption requirement not met.', error: true });
      soundManager.playUmpireCall(true);
      return;
    }

    if (selectedCard) {
      const stampedCard: PlayerCard = {
        ...selectedCard,
        serialStamp: res.serialStamp
      };
      onUpdateCard(stampedCard);
      soundManager.playJackpotChime();
      setFeedbackMsg({
        text: `🔥 CARD FORGE SEALED: Burned ${res.burnedCount} cards to stamp ${selectedCard.name} with official Serial ${res.serialStamp}!`,
        error: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-yellow-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Shimmer Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                5-TIER REFRACTOR FORGE & BURN VAULT
                <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded font-bold font-mono">
                  PTS: {franchisePoints.toLocaleString()}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Transform base cards into prismatic refractors, 1/1 Superfractors, or burn duplicates for limited serial stamps.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Forge Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center gap-2 ${
              feedbackMsg.error
                ? 'bg-rose-950/60 border border-rose-700 text-rose-300'
                : 'bg-emerald-950/60 border border-emerald-700 text-emerald-300'
            }`}
          >
            {feedbackMsg.error ? <ShieldAlert className="w-4 h-4 shrink-0" /> : <Award className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: Card Picker & Tier Selector */}
          <div className="md:col-span-7 space-y-4">
            {/* Step 1: Select Roster Player */}
            <div>
              <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Select Card to Upgrade:
              </label>
              <select
                value={selectedCardId}
                onChange={(e) => {
                  setSelectedCardId(e.target.value);
                  setFeedbackMsg(null);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              >
                {roster.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.position}) · WAR: {p.bRefWar} · Current: {p.refractorTier} {p.serialStamp ? `[${p.serialStamp}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Choose 5-Tier Refractor Finish */}
            <div>
              <label className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Choose Target Refractor Finish:
              </label>
              <div className="space-y-2">
                {(Object.keys(RefractorForgeEngine.FORGE_TIERS) as Array<Exclude<RefractorTier, 'BASE'>>).map((tierKey) => {
                  const cfg = RefractorForgeEngine.FORGE_TIERS[tierKey];
                  const isSelected = targetTier === tierKey;
                  const isSuper = tierKey === 'SUPERFRACTOR_1_OF_1';
                  const canAfford = franchisePoints >= cfg.cost;

                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setTargetTier(tierKey)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-display font-bold text-white">
                            {cfg.label}
                          </strong>
                          {isSuper && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-500 text-black rounded font-black">
                              1 OF 1 CUT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cfg.description}</p>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span className={`text-xs font-mono font-bold block ${canAfford ? 'text-amber-400' : 'text-slate-500'}`}>
                          {cfg.cost.toLocaleString()} PTS
                        </span>
                        {cfg.minWar && (
                          <span className="text-[9px] text-slate-500 font-mono block">
                            WAR ≥ {cfg.minWar}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forge Action */}
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={franchisePoints < tierConfig.cost}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-base tracking-wider uppercase rounded-xl shadow-xl transition-all transform active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Forge to {tierConfig.label} ({tierConfig.cost.toLocaleString()} PTS)
            </button>

            {/* Limited Edition Card-Burn Vault */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Burn Vault: Sacrifice Refractors for Serial Prints
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleBurnRedemption(500)}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-left text-xs transition-colors"
                >
                  <strong className="text-white block font-display">Stamp /500 Limited Edition</strong>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Burn 2 Gold Waves → Get /500 Serial
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBurnRedemption(10)}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-purple-500 rounded-xl text-left text-xs transition-colors"
                >
                  <strong className="text-amber-400 block font-display">Stamp /10 Ultra Exclusive</strong>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Burn 3 Atomic Mojos → Get /10 Serial
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Card Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-2">
              Card Preview & Holographic Finish
            </span>
            {selectedCard && (
              <div className="flex flex-col items-center">
                <Card3D card={selectedCard} size="normal" />
                <span className="text-[11px] text-slate-400 font-mono text-center mt-3">
                  Move mouse or tilt device to inspect dynamic refractor foil reflections! Click 🔄 icon on card to view back.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
