// src/components/ChopWalletModal.tsx
import React, { useState } from 'react';
import { TOKEN_PURCHASE_BUNDLES, REWARD_CONFIG, TokenBundle } from '../config/rewardsConfig';

export interface ChopWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  monthlySpent: number; // Max $100/mo anti-gambling cap
  dailySpent: number;   // Max $25/day anti-gambling cap
  onInitiatePayment: (tierId: string, amount: number, tokens: number) => void;
}

export const ChopWalletModal: React.FC<ChopWalletModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  monthlySpent,
  dailySpent,
  onInitiatePayment,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<TokenBundle>(TOKEN_PURCHASE_BUNDLES[0]);
  const DAILY_LIMIT = REWARD_CONFIG.DAILY_SPEND_CAP_USD;
  const MONTHLY_LIMIT = REWARD_CONFIG.MONTHLY_SPEND_CAP_USD;

  if (!isOpen) return null;

  const isDailyCapped = dailySpent + selectedBundle.price > DAILY_LIMIT;
  const isMonthlyCapped = monthlySpent + selectedBundle.price > MONTHLY_LIMIT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#231a10] border-4 border-[#8b4513] rounded-3xl p-6 shadow-2xl relative text-amber-100">
        
        {/* Leather Stitching Styling Accent */}
        <div className="border border-dashed border-[#daa520]/50 rounded-2xl p-4 bg-[#1b130b]">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#8b4513] pb-3 mb-4">
            <div>
              <span className="text-xl">👝</span>
              <h2 className="text-base font-black text-amber-400 inline ml-2 tracking-wider">
                THE CHOP LEATHER WALLET
              </h2>
              <p className="text-[10px] text-amber-200/60 mt-0.5">Official Franchise Token Reserve</p>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-amber-400 hover:text-white font-bold p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Current Balance & Responsible Gaming Status */}
          <div className="bg-[#2c2215] p-3 rounded-xl border border-[#daa520]/30 mb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-amber-300/80 block">AVAILABLE BALANCE</span>
              <span className="text-lg font-black text-amber-400">{currentBalance.toLocaleString()} TOKENS</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block">MONTHLY SPEND CAP</span>
              <span className="text-xs font-bold text-amber-200">${monthlySpent.toFixed(2)} / ${MONTHLY_LIMIT}</span>
            </div>
          </div>

          {/* Token Tier Selections */}
          <div className="space-y-2 mb-4">
            <label className="text-[10px] font-bold text-amber-300/80">SELECT REPLENISHMENT BUNDLE</label>
            {TOKEN_PURCHASE_BUNDLES.map(bundle => (
              <div
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  selectedBundle.id === bundle.id
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow'
                    : 'bg-[#150e07] border-[#8b4513]/50 text-amber-200/70 hover:border-amber-400/50'
                }`}
              >
                <div>
                  <div className="text-xs font-black text-amber-300">{bundle.name}</div>
                  <div className="text-[9px] text-amber-200/50">{bundle.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-amber-400">${bundle.price.toFixed(2)}</div>
                  <div className="text-[9px] text-emerald-400">+{bundle.tokens} Tokens</div>
                </div>
              </div>
            ))}
          </div>

          {/* Responsible Limit Warning if Capped */}
          {isDailyCapped || isMonthlyCapped ? (
            <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl mb-4 text-center">
              <span className="text-[11px] text-red-300 font-bold block">⚠️ DEPOSIT CEILING REACHED</span>
              <span className="text-[9px] text-red-400">
                To prevent compulsive spending, accounts are capped at $25/day and $100/mo. Please return after cooldown.
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onInitiatePayment(selectedBundle.id, selectedBundle.price, selectedBundle.tokens)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>💳</span> Load via PayPal / Apple Pay / Cash App (${selectedBundle.price.toFixed(2)})
            </button>
          )}

          <div className="text-[8.5px] text-center text-amber-200/40 mt-3">
            Anti-Pay-to-Win Charter: Real funds are strictly limited to cosmetics, slab aesthetics, and time-savers.
          </div>
        </div>
      </div>
    </div>
  );
};
