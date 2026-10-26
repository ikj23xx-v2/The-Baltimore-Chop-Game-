// src/engine/storageEngine.ts
import { RefractorTier } from '../types/refractors';

export interface CardInventoryItem {
  cardId: string;
  playerName: string;
  tier: RefractorTier;
  isNumbered: boolean;
  serialNumber?: string; // e.g., "14/25"
  storageLocation: 'BINDER_PAGE' | 'TOP_LOADER_SLEEVE' | 'STORAGE_BOX_1ROW' | 'STORAGE_BOX_3ROW';
}

export interface BinderPageAccount {
  userId: string;
  unlockedPages: number; // Base is 5 pages (40 slots)
  maxBinderSlots: number;
  storedCardIds: string[];
}

export const CARDS_PER_BINDER_PAGE = 8;
export const COST_PER_EXTRA_BINDER_PAGE_CREDITS = 250; // League Tokens / Vending Credits
export const COST_PER_TOP_LOADER_ROW = 1_000;

export function validateBinderStorage(
  card: CardInventoryItem,
  currentBinderCount: number,
  maxBinderSlots: number
): { allowed: boolean; error?: string; requiredAction?: string } {
  
  // Rule: Cards can only be stored in the binder until they reach Refractor status
  const isEligibleForBinder = card.tier === 'BASE';

  if (!isEligibleForBinder && card.storageLocation === 'BINDER_PAGE') {
    return {
      allowed: false,
      error: `Card '${card.playerName}' has achieved [${card.tier}] status and can no longer reside in the Chop Binder.`,
      requiredAction: 'MOVE_TO_TOP_LOADER_AND_STORAGE_BOX',
    };
  }

  // Check binder capacity
  if (card.storageLocation === 'BINDER_PAGE' && currentBinderCount >= maxBinderSlots) {
    return {
      allowed: false,
      error: 'Chop Binder is full. You must purchase additional pages with League Tokens or clear space by upgrading/recycling cards.',
      requiredAction: 'PURCHASE_PAGE_OR_RECYCLE',
    };
  }

  return { allowed: true };
}

export function recycleNumberedCard(card: CardInventoryItem): { tokenRebate: number; success: boolean } {
  if (!card.isNumbered) {
    return { success: false, tokenRebate: 0 };
  }

  // Numbered cards yield high currency rebates when recycled due to overflow
  const rebateMap: Record<string, number> = {
    'SUPERFRACTOR': 10_000,
    'GOLD_WAVE': 2_500,
    'SAPPHIRE': 1_000,
    'ATOMIC_MOJO': 500,
  };

  return {
    success: true,
    tokenRebate: rebateMap[card.tier] || 100,
  };
}
