import { PlayerCard, RefractorTier } from '../types/game';

export interface ForgeCostConfig {
  cost: number;
  label: string;
  minWar?: number;
  description: string;
}

export class RefractorForgeEngine {
  public static readonly FORGE_TIERS: Record<Exclude<RefractorTier, 'BASE'>, ForgeCostConfig> = {
    RAINBOW: {
      cost: 250,
      label: 'Rainbow Prism',
      description: 'Lustrous diagonal chromatic light refraction.'
    },
    GOLD_WAVE: {
      cost: 750,
      label: 'Gold Wave',
      description: '24k gold undulating wave shimmer.'
    },
    SAPPHIRE: {
      cost: 1500,
      label: 'Sapphire Cracked-Ice',
      description: 'Deep crystalline blue multi-faceted gloss.'
    },
    ATOMIC_MOJO: {
      cost: 3500,
      label: 'Atomic Mojo Prism',
      description: 'Hyper-shattered prism diffraction with intense sparkle.'
    },
    SUPERFRACTOR_1_OF_1: {
      cost: 10000,
      label: 'Superfractor 1 of 1',
      minWar: 7.0,
      description: 'Legendary gold concentric circles with official 1/1 stamped seal (Requires 7.0+ WAR).'
    }
  };

  /**
   * Upgrades a player card finish
   */
  public static upgradeCard(
    card: PlayerCard,
    targetTier: RefractorTier,
    availablePoints: number
  ): { success: boolean; updatedCard?: PlayerCard; cost: number; error?: string } {
    if (targetTier === 'BASE') {
      return { success: false, cost: 0, error: 'Cannot downgrade to Base.' };
    }

    const config = this.FORGE_TIERS[targetTier];
    if (availablePoints < config.cost) {
      return { success: false, cost: config.cost, error: `Need ${config.cost} Franchise Points (you have ${availablePoints}).` };
    }

    if (config.minWar && card.bRefWar < config.minWar) {
      return { success: false, cost: config.cost, error: `Card bRef WAR is ${card.bRefWar}. Must be >= ${config.minWar} to forge a 1/1 Superfractor!` };
    }

    const updatedCard: PlayerCard = {
      ...card,
      refractorTier: targetTier,
      serialStamp: targetTier === 'SUPERFRACTOR_1_OF_1' ? '1/1' : card.serialStamp
    };

    return {
      success: true,
      updatedCard,
      cost: config.cost
    };
  }

  /**
   * Burn cards for limited numbered print redemption
   */
  public static redeemBurnCards(
    cardsToBurn: PlayerCard[],
    targetLimit: 1000 | 500 | 10 | 5
  ): { success: boolean; serialStamp?: string; burnedCount: number; error?: string } {
    const requiredTier: RefractorTier = targetLimit <= 10 ? 'ATOMIC_MOJO' : 'GOLD_WAVE';
    const requiredBurns = targetLimit <= 10 ? 3 : 2;

    const validBurns = cardsToBurn.filter(c => c.refractorTier === requiredTier);
    if (validBurns.length < requiredBurns) {
      return {
        success: false,
        burnedCount: 0,
        error: `Requires sacrificing at least ${requiredBurns} ${requiredTier} cards to forge a /${targetLimit} print.`
      };
    }

    const serialNum = Math.floor(Math.random() * targetLimit) + 1;
    const formattedNum = String(serialNum).padStart(String(targetLimit).length, '0');
    const stamp = `#${formattedNum}/${targetLimit}`;

    return {
      success: true,
      serialStamp: stamp,
      burnedCount: requiredBurns
    };
  }
}
