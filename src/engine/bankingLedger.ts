// src/engine/bankingLedger.ts
import { BankAccountState, BankTransaction, CurrencyType, TransactionCategory } from '../types/banking';

const STORAGE_KEY = 'chop_bank_ledger_state_v1';

import { REWARD_CONFIG } from '../config/rewardsConfig';

export function getInitialBankAccount(userId: string = 'manager_player_1'): BankAccountState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.vendingTokenBalance === 'number') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  const initialTokens = REWARD_CONFIG.STARTER_BASE_TOKENS + REWARD_CONFIG.GOOGLE_SIGNUP_BONUS_TOKENS;
  const initialCredits = REWARD_CONFIG.STARTER_BASE_CREDITS;

  const initialAccount: BankAccountState = {
    userId,
    vendingTokenBalance: initialTokens,
    leagueCreditBalance: initialCredits,
    transactions: [
      {
        id: 'tx_init_tokens',
        timestamp: Date.now() - 86400000,
        type: 'CREDIT',
        currency: 'VENDING_TOKENS',
        amount: initialTokens,
        category: 'ADMIN_ADJUSTMENT',
        description: 'New GM Franchise Welcome Grant (Tokens for Hobby Box Rips)',
        balanceAfter: initialTokens,
      },
      {
        id: 'tx_init_credits',
        timestamp: Date.now() - 86400000,
        type: 'CREDIT',
        currency: 'LEAGUE_CREDITS',
        amount: initialCredits,
        category: 'ADMIN_ADJUSTMENT',
        description: 'Franchise Operations & 26-Man Lineup Credit Reserve',
        balanceAfter: initialCredits,
      },
    ],
  };

  saveBankAccount(initialAccount);
  return initialAccount;
}

export function saveBankAccount(account: BankAccountState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch (err) {
    console.error('Failed to save bank account state:', err);
  }
}

export function recordTransaction(
  account: BankAccountState,
  params: {
    type: 'CREDIT' | 'DEBIT';
    currency: CurrencyType;
    amount: number;
    category: TransactionCategory;
    description: string;
  }
): { updatedAccount: BankAccountState; transaction: BankTransaction } {
  const isToken = params.currency === 'VENDING_TOKENS';
  const currentBalance = isToken ? account.vendingTokenBalance : account.leagueCreditBalance;

  let newBalance = currentBalance;
  if (params.type === 'DEBIT') {
    if (currentBalance < params.amount) {
      throw new Error(`Insufficient funds: needed ${params.amount} ${params.currency}, available ${currentBalance}`);
    }
    newBalance = currentBalance - params.amount;
  } else {
    newBalance = currentBalance + params.amount;
  }

  const newTx: BankTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type: params.type,
    currency: params.currency,
    amount: params.amount,
    category: params.category,
    description: params.description,
    balanceAfter: newBalance,
  };

  const updatedAccount: BankAccountState = {
    ...account,
    vendingTokenBalance: isToken ? newBalance : account.vendingTokenBalance,
    leagueCreditBalance: !isToken ? newBalance : account.leagueCreditBalance,
    transactions: [newTx, ...account.transactions].slice(0, 100), // Keep 100 latest
  };

  saveBankAccount(updatedAccount);
  return { updatedAccount, transaction: newTx };
}
