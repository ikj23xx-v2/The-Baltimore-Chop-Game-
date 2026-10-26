// src/types/banking.ts

export type CurrencyType = 'VENDING_TOKENS' | 'LEAGUE_CREDITS';

export type TransactionCategory =
  | 'PACK_PURCHASE'
  | 'BOX_PURCHASE'
  | 'MARKETPLACE_SALE'
  | 'MARKETPLACE_BUY'
  | 'MARKETPLACE_TAX_BURN'
  | 'SERIES_WIN_REWARD'
  | 'BINDER_PAGE_EXPANSION'
  | 'STORAGE_BOX_UNLOCK'
  | 'EQUIPMENT_REPAIR'
  | 'ADMIN_ADJUSTMENT';

export interface BankTransaction {
  id: string;
  timestamp: number;
  type: 'CREDIT' | 'DEBIT';
  currency: CurrencyType;
  amount: number;
  category: TransactionCategory;
  description: string;
  balanceAfter: number;
}

export interface BankAccountState {
  userId: string;
  vendingTokenBalance: number;
  leagueCreditBalance: number;
  transactions: BankTransaction[];
}
