export type PitchType = '4-SEAM' | 'SLIDER' | 'CURVEBALL' | 'CHANGEUP' | 'SINKER' | 'CUTTER';

export type StrikeZone = 
  | 'UP_IN' | 'UP_MID' | 'UP_OUT'
  | 'MID_IN' | 'MIDDLE' | 'MID_OUT'
  | 'DOWN_IN' | 'DOWN_MID' | 'DOWN_OUT';

export type SpecialSkill = 
  | 'BALTIMORE_CHOP' 
  | 'SIT_DEAD_RED' 
  | 'OPPO_FIELD_TAKE' 
  | 'CONTACT_PROTECT';

export type RefractorTier = 
  | 'BASE' 
  | 'RAINBOW' 
  | 'GOLD_WAVE' 
  | 'SAPPHIRE' 
  | 'ATOMIC_MOJO' 
  | 'SUPERFRACTOR_1_OF_1';

export type CardSetId = 
  | 'SERIES_1'       // Modern Flagship Neon & Smoke
  | 'SERIES_2'       // Flagship Summer Heat & Rookie Debuts
  | 'HERITAGE'       // 1975 Vintage Two-Tone Throwback
  | 'CHROME'         // Prismatic High-Tech Metallic Sheen
  | 'STADIUM_CLUB'   // Full-Bleed Borderless Action Photography
  | 'ALLEN_GINTER'   // 1887 Victorian Parchment Tobacco Frame
  | 'BOWMAN'         // 1st Prospect Futuristic Angular Chevrons
  | 'UPDATE_SERIES'; // Autumn Postseason Gold & Navy Championship

export interface CardSet {
  id: CardSetId;
  name: string;
  seasonName: string; // e.g. "Season 1: Spring Awakening"
  dropWindow: string; // e.g. "Drops: Feb - April"
  status: 'ACTIVE' | 'UPCOMING' | 'EXPIRED';
  daysRemaining: number;
  totalCards: number;
  borderTheme: string;
  colorAccents: string;
  lore: string;
}

export type Position = 
  | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH'
  | 'SP' | 'RP';

export interface PlayerCard {
  id: string;
  cardNo?: number;
  cardSetId?: CardSetId;
  name: string;
  team: string;
  position: Position;
  bRefWar: number;
  isHistorical: boolean;
  era: string; // e.g. "1970", "1983", "1996", "2024"
  stats: {
    contact: number; // 0-99
    power: number;   // 0-99
    speed: number;   // 0-99
    fielding: number;// 0-99
    control?: number;// 0-99 (Pitcher)
    stuff?: number;  // 0-99 (Pitcher)
  };
  cardVitals?: {
    height?: string;
    weight?: string;
    batsThrows?: string;
    born?: string;
    draft?: string;
  };
  careerStats?: {
    games: number;
    hits: number;
    homeRuns: number;
    rbi: number;
    avg: string;
    ops: string;
  };
  refractorTier: RefractorTier;
  serialStamp?: string; // e.g. "1/1", "042/500", "007/1000", "3/10", "1/5"
  hasAutograph?: boolean; // Certified on-card or sticker autograph
  signatureSkill?: SpecialSkill;
  bio: string;
  avatarIcon: string;
  activeEquipmentIds?: string[];
}

export type EquipmentType = 
  | 'BAT' 
  | 'GLOVE' 
  | 'FIELDING_GLOVE'
  | 'BATTING_GLOVES'
  | 'CLEATS'
  | 'ARMOR'
  | 'RELIC'
  | 'STADIUM' 
  | 'RITUAL' 
  | 'COACH';

export type EquipmentRarity = 'COMMON' | 'RARE' | 'VINTAGE' | 'LEGENDARY';

export interface NonPlayerCard {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  description: string;
  lore: string;
  icon: string;
  buffStats: {
    contactBonus?: number;
    powerBonus?: number;
    controlBonus?: number;
    chopBounceBonus?: number;
    pitchHintAccuracy?: number;
    speedBonus?: number;
    fieldingBonus?: number;
  };
  relicDetails?: {
    gameDate?: string;
    authenticationId?: string;
    materialType?: string;
    gameLocation?: string;
  };
  equipped?: boolean;
}

export type AtBatOutcome = 
  | 'STRIKEOUT' 
  | 'WALK' 
  | 'GROUNDOUT' 
  | 'FLYOUT' 
  | 'INFIELD_SINGLE_CHOP' 
  | 'SINGLE' 
  | 'DOUBLE' 
  | 'TRIPLE' 
  | 'HOME_RUN';

export interface PitchDelivery {
  type: PitchType;
  zone: StrikeZone;
  velocity: number;
  breakRating: number;
}

export interface BatterCounter {
  guessType: PitchType;
  guessZone: StrikeZone;
  specialSkill?: SpecialSkill;
}

export interface AtBatResult {
  outcome: AtBatOutcome;
  description: string;
  hitData?: {
    exitVelocity: number;
    launchAngle: number;
    distance: number;
    bounceHeight?: number;
  };
  isBaltimoreChop: boolean;
  dynamicHint?: string;
  hapticPattern: 'LIGHT' | 'SNAP' | 'HEAVY' | 'CHOP';
  streakMaintained: boolean;
  scoreDelta: number;
}

export interface TaskRequirement {
  id: string;
  name: string;
  category: 'CHOP' | 'STRIKEOUT' | 'SEASON' | 'HOMERUN';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardTokens: number;
  description: string;
}

export interface PlayByPlayEntry {
  id: string;
  text: string;
  type: 'chop' | 'hit' | 'out' | 'info' | 'homerun';
  timestamp: number;
}
