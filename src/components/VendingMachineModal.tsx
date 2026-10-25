import React, { useState } from 'react';
import { NonPlayerCard, TaskRequirement } from '../types/game';
import { INITIAL_EQUIPMENT_CARDS } from '../data/equipment';
import { soundManager } from '../services/audio';
import { X, Sparkles, CheckCircle2, Shield, PlusCircle } from 'lucide-react';

interface VendingMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendingTokens: number;
  onUseToken: (cost: number) => boolean;
  tasks: TaskRequirement[];
  inventory: NonPlayerCard[];
  onEquipItem: (item: NonPlayerCard) => void;
}

export const VendingMachineModal: React.FC<VendingMachineModalProps> = ({
  isOpen,
  onClose,
  vendingTokens,
  onUseToken,
  tasks,
  inventory,
  onEquipItem
}) => {
  const [dispensing, setDispensing] = useState(false);
  const [dispensedCard, setDispensedCard] = useState<NonPlayerCard | null>(null);

  if (!isOpen) return null;

  const pullVendingMachine = () => {
    if (vendingTokens < 1 || dispensing) return;
    const success = onUseToken(1);
    if (!success) return;

    setDispensing(true);
    setDispensedCard(null);
    soundManager.playVendingDispense();

    setTimeout(() => {
      // Pick random equipment card
      const loot = INITIAL_EQUIPMENT_CARDS[Math.floor(Math.random() * INITIAL_EQUIPMENT_CARDS.length)];
      setDispensedCard(loot);
      setDispensing(false);
      onEquipItem(loot);
      soundManager.playRefractorShine();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-4xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥫</span>
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                TASK EQUIPMENT VENDING MACHINE
                <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded font-bold">
                  TOKENS: 🪙 {vendingTokens}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Complete at-bat tasks to earn tokens. Dispense vintage bats, stadium cards, rituals, and coach ledgers!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Vending Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Left: Vending Dispenser & Tasks */}
          <div className="md:col-span-6 space-y-4">
            {/* Task Checklist */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Challenge Tasks (Earn Tokens)
              </span>

              <div className="space-y-2">
                {tasks.map((task) => {
                  const pct = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));
                  return (
                    <div
                      key={task.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        task.completed
                          ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="font-display font-bold">{task.name}</strong>
                        <span className="font-mono text-[10px] text-amber-400 font-bold">
                          +🪙 {task.rewardTokens} Token
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-1.5">{task.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono mt-1 text-slate-500">
                        <span>Progress</span>
                        <span>{task.currentCount} / {task.targetCount} ({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dispense Lever Button */}
            <button
              type="button"
              disabled={vendingTokens < 1 || dispensing}
              onClick={pullVendingMachine}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-black text-base tracking-wider uppercase rounded-2xl shadow-xl transition-all transform active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {dispensing ? 'Rotating Mechanical Coil...' : 'Insert 🪙 1 Token & Dispense Card'}
            </button>
          </div>

          {/* Right: Dispensed Item & Active Equipped Loadout */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            {/* Dispensed Card Showcase */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[180px]">
              {dispensedCard ? (
                <div className="w-full bg-slate-900 border-2 border-emerald-500 rounded-xl p-4 shadow-lg text-center animate-fade-in">
                  <span className="text-4xl block mb-2">{dispensedCard.icon}</span>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded uppercase font-bold">
                      {dispensedCard.type} · {dispensedCard.rarity}
                    </span>
                  </div>
                  <h4 className="text-base font-display font-black text-white">{dispensedCard.name}</h4>
                  <p className="text-xs text-amber-300 font-medium my-1">{dispensedCard.description}</p>
                  <p className="text-[10px] text-slate-400 italic">"{dispensedCard.lore}"</p>
                  <span className="inline-block mt-2 text-[10px] text-emerald-400 font-mono font-bold">
                    ✓ Equipped & Active for Match Showdowns!
                  </span>
                </div>
              ) : (
                <div className="text-center text-slate-500 font-mono text-xs py-8">
                  <span className="text-4xl block mb-2">🎁</span>
                  Insert a token to dispense vintage bats, dirt jars, and coaching ledgers!
                </div>
              )}
            </div>

            {/* Currently Equipped Equipment Loadout */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-orange-400" />
                Active Non-Player Card Loadout
              </span>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-start gap-2 text-xs"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="truncate">
                      <strong className="text-white block truncate text-[11px] font-display">{item.name}</strong>
                      <span className="text-[9px] text-orange-400 block font-mono">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
