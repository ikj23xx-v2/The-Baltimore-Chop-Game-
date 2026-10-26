// src/data/seasonalHolidayCatalog.ts

export type SeasonPeriod = 
  | 'SEASON_1_SPRING' 
  | 'SEASON_2_SUMMER' 
  | 'SEASON_3_AUTUMN' 
  | 'PLAYOFFS_PENNANT_CHASE' 
  | 'PLAYOFFS_FALL_CLASSIC_HOLIDAY';

export type HolidayTheme = 
  | 'NONE'
  | 'SPRING_OPENING_DAY' 
  | 'SUMMER_FIRECRACKER' 
  | 'OCTOBER_HALLOWEEN' 
  | 'WINTER_SNOWFLAKE';

export interface SeasonalCardItem {
  id: string;
  catalogId: string;
  name: string;
  seasonPeriod: SeasonPeriod;
  holidayTheme: HolidayTheme;
  serialLimit: number | null;
  visualEffect: string;
  statBonusDescription: string;
  isLocked: boolean;
}

// 1. Regular Season Refractor Pool (150 Total = 1500 / 10)
export const CORE_SEASON_REFRACTORS: SeasonalCardItem[] = [
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `ref_s1_${i + 1}`,
    catalogId: `REF-SLV-${String(i + 1).padStart(3, '0')}`,
    name: `Silver Chrome Variant #${i + 1}`,
    seasonPeriod: 'SEASON_1_SPRING' as SeasonPeriod,
    holidayTheme: 'NONE' as HolidayTheme,
    serialLimit: null,
    visualEffect: 'Brushed Silver Refractive Sheen',
    statBonusDescription: '+2% Contact & Bunt Accuracy',
    isLocked: false,
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `ref_s2_${i + 1}`,
    catalogId: `REF-MOJO-${String(i + 1).padStart(3, '0')}`,
    name: `Atomic Mojo Variant #${i + 1}`,
    seasonPeriod: 'SEASON_2_SUMMER' as SeasonPeriod,
    holidayTheme: 'NONE' as HolidayTheme,
    serialLimit: 150,
    visualEffect: 'Cracked Ice Prismatic Refractor',
    statBonusDescription: '+4% Contact, +2% Arm Strength',
    isLocked: true,
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `ref_s3_${i + 1}`,
    catalogId: `REF-SAPH-${String(i + 1).padStart(3, '0')}`,
    name: `Sapphire Wave Variant #${i + 1}`,
    seasonPeriod: 'SEASON_3_AUTUMN' as SeasonPeriod,
    holidayTheme: 'NONE' as HolidayTheme,
    serialLimit: 75,
    visualEffect: 'Cobalt Blue Prismatic Wave',
    statBonusDescription: '+6% Base Stealing Speed',
    isLocked: true,
  })),
];

// 2. Playoff Chase Tiers (40 Total)
export const PLAYOFF_REFRACTORS: SeasonalCardItem[] = [
  // Pennant Chase (LCS Round)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `playoff_pennant_${i + 1}`,
    catalogId: `PENNANT-${String(i + 1).padStart(2, '0')}`,
    name: `Pennant Laser Foil #${i + 1}`,
    seasonPeriod: 'PLAYOFFS_PENNANT_CHASE' as SeasonPeriod,
    holidayTheme: 'NONE' as HolidayTheme,
    serialLimit: 10,
    visualEffect: 'Laser Grating Holographic Neon Refractor',
    statBonusDescription: 'Cold-Zone Immunity: Negates pitch-zone penalties on 2-strike counts.',
    isLocked: true,
  })),
  // Fall Classic (World Series Round)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `playoff_classic_${i + 1}`,
    catalogId: `CLASSIC-${String(i + 1).padStart(2, '0')}`,
    name: `Fall Classic Liquid Gold #${i + 1}`,
    seasonPeriod: 'PLAYOFFS_FALL_CLASSIC_HOLIDAY' as SeasonPeriod,
    holidayTheme: 'NONE' as HolidayTheme,
    serialLimit: i < 3 ? 1 : 5,
    visualEffect: '24K Liquid Gold Foil Stamp with Holographic Bevel',
    statBonusDescription: '+15% Exit Velocity on 9th-inning high leverage at-bats.',
    isLocked: true,
  })),
];

// 3. Holiday Chase Sets (Halloween Spooky & Winter Holiday)
export const HOLIDAY_SPECIAL_EDITIONS: SeasonalCardItem[] = [
  // October Halloween (Pennant Chase Event)
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `spooky_${i + 1}`,
    catalogId: `SPOOKY-${String(i + 1).padStart(2, '0')}`,
    name: `Jack-o'-Lantern Pumpkin Foil #${i + 1}`,
    seasonPeriod: 'PLAYOFFS_PENNANT_CHASE' as SeasonPeriod,
    holidayTheme: 'OCTOBER_HALLOWEEN' as HolidayTheme,
    serialLimit: 13,
    visualEffect: 'Black Matte Acrylic with Glowing Orange Pumpkin Lattice Foil',
    statBonusDescription: 'Night Game Terror: Pitchers induce +10% swinging strike rates under stadium lights.',
    isLocked: true,
  })),
  // December Winter Holiday (World Series & Hot Stove Event)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `holiday_${i + 1}`,
    catalogId: `SNOW-${String(i + 1).padStart(2, '0')}`,
    name: `Metallic Snowflake & Candy Cane Refractor #${i + 1}`,
    seasonPeriod: 'PLAYOFFS_FALL_CLASSIC_HOLIDAY' as SeasonPeriod,
    holidayTheme: 'WINTER_SNOWFLAKE' as HolidayTheme,
    serialLimit: 25,
    visualEffect: 'Frosted Glass Border with Raised Metallic Silver Snowflakes',
    statBonusDescription: 'Cold Weather Clutch: Batters maintain warm-zone contact ratings below 45°F.',
    isLocked: true,
  })),
];

// Master Compiled Catalog
export const MASTER_SEASONAL_CATALOG: SeasonalCardItem[] = [
  ...CORE_SEASON_REFRACTORS,
  ...PLAYOFF_REFRACTORS,
  ...HOLIDAY_SPECIAL_EDITIONS,
];

/**
 * Filter items by active franchise progression stage
 */
export function getAvailableSeasonalCards(currentStage: SeasonPeriod): SeasonalCardItem[] {
  return MASTER_SEASONAL_CATALOG.filter(card => card.seasonPeriod === currentStage);
}
