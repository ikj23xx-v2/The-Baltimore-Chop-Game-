// src/types/postseasonRewards.ts

export type SeasonAwardType = 
  | 'MVP' 
  | 'ACE_PITCHER' 
  | 'FIREMAN_RELIEF' 
  | 'DIAMOND_GLOVE' 
  | 'SILVER_SLUGGER';

export interface NextSeasonVoucher {
  voucherId: string;
  targetSeason: number; // e.g., Season 2
  type: 'EARLY_CARD_ACCESS' | 'EQUIPMENT_REPAIR' | 'LUMBER_SUPPLY';
  description: string;
  isRedeemed: boolean;
}

export interface PostseasonMilestoneReward {
  roundReached: 'WILD_CARD' | 'DIVISION' | 'CHAMPIONSHIP' | 'WORLD_SERIES_CHAMPION';
  tokensAwarded: number;
  vouchersAwarded: NextSeasonVoucher[];
  exclusiveOneOfOneAwarded?: {
    cardInstanceId: string;
    cardName: string;
    serial: '1/1';
    title: string; // e.g., "Season 1 World Championship Climax 1/1"
    stampedManager: string;
  };
}

/**
 * Resolves playoff rewards based on how deep the franchise advanced.
 */
export function grantPostseasonRewards(
  roundReached: PostseasonMilestoneReward['roundReached'],
  managerUsername: string,
  targetSeason: number
): PostseasonMilestoneReward {
  switch (roundReached) {
    case 'WORLD_SERIES_CHAMPION':
      return {
        roundReached,
        tokensAwarded: 25_000,
        vouchersAwarded: [
          {
            voucherId: `vch_${Date.now()}_1`,
            targetSeason,
            type: 'EARLY_CARD_ACCESS',
            description: 'Redeem any upcoming season release 7 days prior to pack drops.',
            isRedeemed: false,
          },
          {
            voucherId: `vch_${Date.now()}_2`,
            targetSeason,
            type: 'LUMBER_SUPPLY',
            description: 'Pristine Tier-3 Signature Wood Bat for Season Opening Day.',
            isRedeemed: false,
          },
        ],
        exclusiveOneOfOneAwarded: {
          cardInstanceId: `ws_1of1_${Date.now()}`,
          cardName: 'World Series Climax MVP',
          serial: '1/1',
          title: `Season ${targetSeason - 1} World Champion Crown 1/1`,
          stampedManager: managerUsername,
        },
      };

    case 'CHAMPIONSHIP':
      return {
        roundReached,
        tokensAwarded: 10_000,
        vouchersAwarded: [
          {
            voucherId: `vch_${Date.now()}_champ`,
            targetSeason,
            type: 'EQUIPMENT_REPAIR',
            description: '3 free workshop gear overhauls in upcoming season.',
            isRedeemed: false,
          },
        ],
      };

    default:
      return {
        roundReached,
        tokensAwarded: 5_000,
        vouchersAwarded: [],
      };
  }
}
