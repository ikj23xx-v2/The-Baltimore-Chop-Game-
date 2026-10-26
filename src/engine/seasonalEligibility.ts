// src/engine/seasonalEligibility.ts
import { RefractorTier } from '../types/refractors';

export interface RosterCard {
  instanceId: string;
  playerId: number;
  playerName: string;
  tier: RefractorTier;
  releaseSeason: number; // e.g., Season 1
  isWildCard?: boolean;
}

export interface SeasonEligibilityResult {
  isEligible: boolean;
  reason?: string;
  requiresWildCard?: boolean;
}

/**
 * Checks whether a card can be fielded in the current competitive season.
 * Base cards are permanent; refractors adhere to a 2-season rolling window.
 */
export function checkCardSeasonalEligibility(
  card: RosterCard,
  currentSeason: number,
  currentWildCardId: string | null
): SeasonEligibilityResult {
  // 1. Base cards are permanent core assets usable all year
  if (card.tier === 'BASE') {
    return { isEligible: true };
  }

  // 2. In-season or previous-season refractors remain active
  const isWithinWindow =
    card.releaseSeason === currentSeason ||
    card.releaseSeason === currentSeason - 1;

  if (isWithinWindow) {
    return { isEligible: true };
  }

  // 3. Out-of-season refractors require an open Wild Card slot
  if (card.instanceId === currentWildCardId) {
    return { isEligible: true, requiresWildCard: true };
  }

  if (!currentWildCardId) {
    return {
      isEligible: true,
      requiresWildCard: true,
      reason: 'Requires activating your team’s single Wild Card slot.',
    };
  }

  return {
    isEligible: false,
    reason: `Vaulted Refractor (Season ${card.releaseSeason}). Your Wild Card slot is already occupied.`,
  };
}

/**
 * Warns users if forging will consume their only permanent year-round copy.
 */
export function getCraftingRiskWarning(
  baseCopiesCount: number,
  targetTier: RefractorTier,
  activeSeason: number
): { safeToCraft: boolean; warningMessage?: string } {
  if (baseCopiesCount <= 1) {
    return {
      safeToCraft: false,
      warningMessage: `Warning: This is your ONLY Base copy. Forging to ${targetTier} will cause this card to rotate out after Season ${activeSeason + 1}. You will lose your permanent year-round version!`,
    };
  }

  return { safeToCraft: true };
}
