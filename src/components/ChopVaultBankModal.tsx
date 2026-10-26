// src/components/ChopVaultBankModal.tsx
import React, { useState } from 'react';
import { BankAccountState, TransactionCategory, CurrencyType } from '../types/banking';
import { ChopModalPopup } from './ChopModalPopup';
import { ArrowDownRight, ArrowUpRight, Filter, Wallet } from 'lucide-react';

interface ChopVaultBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccount: BankAccountState;
  onOpenWallet?: () => void;
}

export const ChopVaultBankModal: React.FC<ChopVaultBankModalProps> = ({
  isOpen,
  onClose,
  bankAccount,
  onOpenWallet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'ALL'>('ALL');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType | 'ALL'>('ALL');

  const filteredTx = bankAccount.transactions.filter((tx) => {
    if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) return false;
    if (selectedCurrency !== 'ALL' && tx.currency !== selectedCurrency) return false;
    return true;
  });

  return (
    <ChopModalPopup
      isOpen={isOpen}
      onClose={onClose}
      title="THE CHOP VAULT & LEDGER"
      subtitle="Double-entry franchise banking ledger tracking tokens and league credits"
      maxWidth="3xl"
      icon="🏛️"
    >
      <div className="space-y-5">
        {/* Balances Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/40 shadow-lg flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                VENDING TOKEN BALANCE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-amber-400">
                  {bankAccount.vendingTokenBalance.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-300">TOKENS</span>
              </div>
            </div>
            {onOpenWallet && (
              <button
                type="button"
                onClick={onOpenWallet}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>👝</span>
                <span>Wallet</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/40 shadow-lg">
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
              LEAGUE CREDIT BALANCE
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-cyan-400">
                {bankAccount.leagueCreditBalance.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-300">CREDITS</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>FILTER:</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(['ALL', 'PACK_PURCHASE', 'BOX_PURCHASE', 'SERIES_WIN_REWARD', 'ADMIN_ADJUSTMENT'] as (TransactionCategory | 'ALL')[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-[10px] uppercase font-mono ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Itemized Transaction History Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60 max-h-80 overflow-y-auto">
          {filteredTx.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No transactions found matching active filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[9px]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredTx.map((tx) => {
                  const isCredit = tx.type === 'CREDIT';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          isCredit ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {isCredit ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200">
                        {tx.description}
                      </td>
                      <td className="p-3">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                          {tx.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-black ${
                        isCredit ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency === 'VENDING_TOKENS' ? '🪙' : '💎'}
                      </td>
                      <td className="p-3 text-right text-slate-400 font-bold">
                        {tx.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ChopModalPopup>
  );
};
