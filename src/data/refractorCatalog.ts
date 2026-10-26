// src/data/refractorCatalog.ts

export type RefractorTier = 
  | 'SILVER_CHROME' 
  | 'ATOMIC_MOJO' 
  | 'SAPPHIRE' 
  | 'GOLD_WAVE' 
  | 'SUPERFRACTOR_1_OF_1'
  // Playoff Exclusive Tiers
  | 'PENNANT_LASER_FOIL' 
  | 'FALL_CLASSIC_LIQUID_GOLD';

export interface RefractorVariant {
  id: string;
  catalogId: string;
  playerId: string;
  tier: RefractorTier;
  serialLimit: number | null; // null for unnumbered
  seasonPhase: 'REGULAR_SEASON' | 'PENNANT_CHASE' | 'FALL_CLASSIC';
  clutchBuffDescription: string;
  isUnlocked: boolean;
}

// 1. Core Regular Season Variants (150 Total = 1,500 / 10)
export const REGULAR_SEASON_VARIANTS: RefractorVariant[] = [
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `ref_silver_${i + 1}`,
    catalogId: `REF-SILVER-${String(i + 1).padStart(3, '0')}`,
    playerId: `player_${(i % 100) + 1}`,
    tier: 'SILVER_CHROME' as RefractorTier,
    serialLimit: null,
    seasonPhase: 'REGULAR_SEASON' as const,
    clutchBuffDescription: '+2% Contact & Infield Bounce Accuracy',
    isUnlocked: true,
  })),
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `ref_mojo_${i + 1}`,
    catalogId: `REF-MOJO-${String(i + 1).padStart(3, '0')}`,
    playerId: `player_${(i % 100) + 1}`,
    tier: 'ATOMIC_MOJO' as RefractorTier,
    serialLimit: 150,
    seasonPhase: 'REGULAR_SEASON' as const,
    clutchBuffDescription: '+4% Contact, +2% Arm Strength',
    isUnlocked: true,
  })),
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `ref_sapphire_${i + 1}`,
    catalogId: `REF-SAPH-${String(i + 1).padStart(3, '0')}`,
    playerId: `player_${(i % 100) + 1}`,
    tier: 'SAPPHIRE' as RefractorTier,
    serialLimit: 75,
    seasonPhase: 'REGULAR_SEASON' as const,
    clutchBuffDescription: '+6% Base Stealing & Infield Speed',
    isUnlocked: true,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `ref_gold_${i + 1}`,
    catalogId: `REF-GOLD-${String(i + 1).padStart(3, '0')}`,
    playerId: `player_${(i % 100) + 1}`,
    tier: 'GOLD_WAVE' as RefractorTier,
    serialLimit: 25,
    seasonPhase: 'REGULAR_SEASON' as const,
    clutchBuffDescription: '+8% Clutch Multiplier in High Leverage Situations',
    isUnlocked: true,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ref_super_${i + 1}`,
    catalogId: `REF-SUPER-${String(i + 1).padStart(3, '0')}`,
    playerId: `player_${(i % 100) + 1}`,
    tier: 'SUPERFRACTOR_1_OF_1' as RefractorTier,
    serialLimit: 1,
    seasonPhase: 'REGULAR_SEASON' as const,
    clutchBuffDescription: '+10% Overall Attribute Rating & Custom Aura',
    isUnlocked: true,
  })),
];

// 2. Playoff Round 1: Pennant Laser Foil (#/10) (25 Total)
export const PENNANT_CHASE_VARIANTS: RefractorVariant[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ref_pennant_${i + 1}`,
  catalogId: `REF-PENNANT-${String(i + 1).padStart(2, '0')}`,
  playerId: `player_${(i % 50) + 1}`,
  tier: 'PENNANT_LASER_FOIL' as RefractorTier,
  serialLimit: 10,
  seasonPhase: 'PENNANT_CHASE' as const,
  clutchBuffDescription: 'Cold-Zone Immunity: Negates pitcher quadrant penalties in elimination games.',
  isUnlocked: false, // Locked until franchise reaches postseason
}));

// 3. Playoff Round 2: Fall Classic Liquid Gold (#/5 & 1/1s) (15 Total)
export const FALL_CLASSIC_VARIANTS: RefractorVariant[] = Array.from({ length: 15 }, (_, i) => ({
  id: `ref_fallclassic_${i + 1}`,
  catalogId: `REF-CLASSIC-${String(i + 1).padStart(2, '0')}`,
  playerId: `player_${(i % 25) + 1}`,
  tier: 'FALL_CLASSIC_LIQUID_GOLD' as RefractorTier,
  serialLimit: i < 3 ? 1 : 5, // Top 3 are 1-of-1 World Series Crown editions
  seasonPhase: 'FALL_CLASSIC' as const,
  clutchBuffDescription: 'Fall Classic Surge: +15% Exit Velocity on Game 7 walk-off situations.',
  isUnlocked: false, // Locked until World Series round
}));

// Master export
export const MASTER_REFRACTOR_CATALOG = [
  ...REGULAR_SEASON_VARIANTS,
  ...PENNANT_CHASE_VARIANTS,
  ...FALL_CLASSIC_VARIANTS,
];
