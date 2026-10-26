// src/data/masterCardCatalog.ts

export type CardCategory = 
  | 'PLAYER_BASE' 
  | 'EQUIPMENT_RELIC' 
  | 'STADIUM' 
  | 'COACH' 
  | 'MANAGER_STRATEGY';

export type RefractorTier = 
  | 'BASE' 
  | 'SILVER' 
  | 'ATOMIC_MOJO' 
  | 'SAPPHIRE' 
  | 'GOLD_WAVE' 
  | 'SUPERFRACTOR_1_OF_1';

export type RelicCategory = 
  | 'GAME_BAT' 
  | 'BATTING_GLOVES' 
  | 'CLEATS' 
  | 'PINE_TAR_CONE' 
  | 'BASEBALL_COLLARS' 
  | 'EYE_BLACK' 
  | 'ARM_SLEEVE' 
  | 'GAME_BALL_RELIC' 
  | 'STADIUM_CHAIR_RELIC' 
  | 'WORLD_SERIES_BASE';

export interface CatalogItem {
  id: string;
  catalogNumber: string;
  name: string;
  category: CardCategory;
  subType?: string;
  season: 1 | 2 | 3;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'MYTHIC_1_OF_1';
  refractorTiersAvailable: RefractorTier[];
  hasAutographVariant: boolean;
  flavorText: string;
  statBonus?: {
    contact?: number;
    power?: number;
    chopBounceAccuracy?: number;
    eraSuppression?: number;
    tacticalWinRateBoost?: number;
    contactBoost?: number;
  };
}

// Deterministic seed PRNG (Mulberry32) ensuring consistent season allocation
function createSeededRandom(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createSeededRandom(19831016); // Anchored to 1983 World Series date

function assignSeason(index: number, total: number): 1 | 2 | 3 {
  // Evenly divides exactly one third to Season 1, Season 2, and Season 3
  const third = Math.floor(total / 3);
  if (index < third) return 1;
  if (index < third * 2) return 2;
  return 3;
}

// 1. Generate 300 Base Player Cards
const PLAYER_POSITIONS = ['SP', 'RP', 'CP', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
const BASE_PLAYERS: CatalogItem[] = Array.from({ length: 300 }, (_, i) => {
  const playerNum = i + 1;
  const pos = PLAYER_POSITIONS[i % PLAYER_POSITIONS.length];
  return {
    id: `card_player_${playerNum}`,
    catalogNumber: `TBC-${String(playerNum).padStart(3, '0')}`,
    name: `Chop Prospect / Veteran #${playerNum}`,
    category: 'PLAYER_BASE',
    subType: pos,
    season: 1, // Will be shuffled
    rarity: playerNum % 50 === 0 ? 'MYTHIC_1_OF_1' : playerNum % 10 === 0 ? 'RARE' : 'COMMON',
    refractorTiersAvailable: ['BASE', 'SILVER', 'ATOMIC_MOJO', 'SAPPHIRE', 'GOLD_WAVE', 'SUPERFRACTOR_1_OF_1'],
    hasAutographVariant: playerNum <= 75,
    flavorText: `Card #${playerNum} in the foundational 300-card Baltimore Chop collection.`
  };
});

// 2. Generate 120 Relic & Equipment Items
const RELIC_TYPES: RelicCategory[] = [
  'GAME_BAT', 'BATTING_GLOVES', 'CLEATS', 'PINE_TAR_CONE', 'BASEBALL_COLLARS',
  'EYE_BLACK', 'ARM_SLEEVE', 'GAME_BALL_RELIC', 'STADIUM_CHAIR_RELIC', 'WORLD_SERIES_BASE'
];

const EQUIPMENT_RELICS: CatalogItem[] = Array.from({ length: 120 }, (_, i) => {
  const relicNum = i + 1;
  const relicType = RELIC_TYPES[i % RELIC_TYPES.length];
  return {
    id: `relic_${relicNum}`,
    catalogNumber: `RELIC-${String(relicNum).padStart(3, '0')}`,
    name: `${relicType.replace(/_/g, ' ')} #${relicNum}`,
    category: 'EQUIPMENT_RELIC',
    subType: relicType,
    season: 1,
    rarity: relicNum % 25 === 0 ? 'MYTHIC_1_OF_1' : relicNum % 5 === 0 ? 'EPIC' : 'UNCOMMON',
    refractorTiersAvailable: ['BASE', 'SILVER', 'GOLD_WAVE'],
    hasAutographVariant: false,
    flavorText: `Certified game-used authentic memorabilia piece #${relicNum}.`,
    statBonus: {
      chopBounceAccuracy: 2.0 + (relicNum % 8),
      contactBoost: 1.5 + (relicNum % 5)
    }
  };
});

// 3. Generate 30 Stadium Cards
const STADIUM_NAMES = [
  'Memorial Stadium (1983)', 'Camden Yards (1992)', 'Exhibition Stadium',
  'Polo Grounds', 'Tiger Stadium', 'County Stadium', 'Forbes Field',
  'Crosley Field', "Sportsman's Park", 'Shibe Park'
];

const STADIUMS: CatalogItem[] = Array.from({ length: 30 }, (_, i) => {
  const stadiumNum = i + 1;
  const venueName = STADIUM_NAMES[i % STADIUM_NAMES.length];
  return {
    id: `stadium_${stadiumNum}`,
    catalogNumber: `PARK-${String(stadiumNum).padStart(2, '0')}`,
    name: `${venueName} (Edition ${Math.floor(i / 10) + 1})`,
    category: 'STADIUM',
    season: 1,
    rarity: stadiumNum % 10 === 0 ? 'MYTHIC_1_OF_1' : 'RARE',
    refractorTiersAvailable: ['BASE', 'SILVER', 'SUPERFRACTOR_1_OF_1'],
    hasAutographVariant: false,
    flavorText: `Historic ballpark venue with custom wind current, grass friction, and chop bounce dynamics.`
  };
});

// 4. Generate 99 Coaching Staff Cards
const COACHES: CatalogItem[] = Array.from({ length: 99 }, (_, i) => {
  const coachNum = i + 1;
  const tier = coachNum <= 9 ? 'Immortal Legend' : coachNum <= 29 ? 'Dugout Gold' : coachNum <= 59 ? 'Field Silver' : 'Tactical Bronze';
  return {
    id: `coach_${coachNum}`,
    catalogNumber: `COACH-${String(coachNum).padStart(2, '0')}`,
    name: `Strategist Staff #${coachNum} (${tier})`,
    category: 'COACH',
    subType: tier,
    season: 1,
    rarity: coachNum <= 9 ? 'MYTHIC_1_OF_1' : coachNum <= 29 ? 'EPIC' : 'UNCOMMON',
    refractorTiersAvailable: ['BASE', 'SILVER', 'GOLD_WAVE'],
    hasAutographVariant: coachNum <= 9,
    flavorText: `Staff member offering distinct tactical autoplay biases and player stamina preservation.`,
    statBonus: {
      tacticalWinRateBoost: coachNum <= 9 ? 1.15 : coachNum <= 29 ? 1.08 : 1.04
    }
  };
});

// 5. Generate 15 Manager Strategy Cards
const MANAGERS: CatalogItem[] = Array.from({ length: 15 }, (_, i) => {
  const managerNum = i + 1;
  return {
    id: `manager_strategy_${managerNum}`,
    catalogNumber: `MGR-${String(managerNum).padStart(2, '0')}`,
    name: `Manager Tactical Card #${managerNum}`,
    category: 'MANAGER_STRATEGY',
    season: 1,
    rarity: 'EPIC',
    refractorTiersAvailable: ['BASE', 'GOLD_WAVE'],
    hasAutographVariant: true,
    flavorText: `High-leverage decision card limited to exactly 5 strategic activations per regular season.`
  };
});

// Helper function to shuffle an array deterministically
function shuffleArray<T>(array: T[], randomFn: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Distribute items evenly and randomly across Season 1, 2, and 3
function balanceSeasons(items: CatalogItem[]): CatalogItem[] {
  const shuffled = shuffleArray(items, rng);
  return shuffled.map((item, idx) => ({
    ...item,
    season: assignSeason(idx, items.length)
  }));
}

// Master compiled catalog export (564 items total)
export const MASTER_CARD_CATALOG: CatalogItem[] = [
  ...balanceSeasons(BASE_PLAYERS),
  ...balanceSeasons(EQUIPMENT_RELICS),
  ...balanceSeasons(STADIUMS),
  ...balanceSeasons(COACHES),
  ...balanceSeasons(MANAGERS),
];

/**
 * Filter items by current season
 */
export function getSeasonCards(season: 1 | 2 | 3): CatalogItem[] {
  return MASTER_CARD_CATALOG.filter(card => card.season === season);
}

/**
 * Returns all catalog cards formatted with current availability status
 */
export function getCatalogWithLockStatus(currentActiveSeason: number = 1) {
  return MASTER_CARD_CATALOG.map(card => ({
    ...card,
    isLocked: card.season > currentActiveSeason,
    unlocksInSeason: card.season,
  }));
}
