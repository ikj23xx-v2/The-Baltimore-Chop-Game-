// src/data/equipmentRelicsDatabase.ts
// Expanded Master Relic & Equipment Registry for The Baltimore Chop™ (120+ Items)

export type EquipmentCategory = 
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

export interface EquipmentRelicItem {
  id: string;
  name: string;
  era: string;
  category: EquipmentCategory;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'MYTHIC_1_OF_1';
  statBuffs: {
    chopBounceAccuracy?: number; // e.g. +4.5%
    contactBoost?: number;
    powerBoost?: number;
    staminaRecovery?: number;
    clutchMultiplier?: number;
  };
  framing?: string;
  flavorText: string;
}

export const MASTER_EQUIPMENT_RELICS_REGISTRY: EquipmentRelicItem[] = [
  // --- LEGENDARY GAME BATS (1–25) ---
  {
    id: 'bat_01',
    name: '1983 World Series Maple Slugger (Cal Ripken Jr. Game-Used)',
    era: '1983 Era',
    category: 'GAME_BAT',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { chopBounceAccuracy: 12.5, powerBoost: 8.0, clutchMultiplier: 1.25 },
    flavorText: 'Notched grip tape and pine tar residue from the championship run at Memorial Stadium.'
  },
  {
    id: 'bat_02',
    name: '1979 Baltimore Chop Hickory Special',
    era: '1979 Era',
    category: 'GAME_BAT',
    rarity: 'EPIC',
    statBuffs: { chopBounceAccuracy: 9.0, contactBoost: 5.0 },
    flavorText: 'Engineered with a heavy barrel taper designed exclusively for low-sinker bouncing.'
  },
  {
    id: 'bat_03',
    name: '1995 Eddie Murray 3,000th Hit Ash Bat',
    era: '1995 Era',
    category: 'GAME_BAT',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { chopBounceAccuracy: 10.0, powerBoost: 10.0, clutchMultiplier: 1.3 },
    flavorText: 'Carried during Steady Eddie\'s milestone performance.'
  },
  {
    id: 'bat_04',
    name: '1966 Frank Robinson Triple Crown Louisville Slugger',
    era: '1966 Era',
    category: 'GAME_BAT',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { powerBoost: 14.0, contactBoost: 6.0 },
    flavorText: 'Sawn-off handle favored by Frank for launching missiles out of Memorial Stadium.'
  },
  {
    id: 'bat_05',
    name: 'Early 1900s Dead-Ball Era Heavy Ash Club',
    era: '1905 Era',
    category: 'GAME_BAT',
    rarity: 'RARE',
    statBuffs: { chopBounceAccuracy: 8.5, contactBoost: 4.0 },
    flavorText: 'Uncupped barrel built for making heavy turf contact rather than fly balls.'
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `bat_${6 + i}`,
    name: `Pro Stock Hickory Model #${100 + i}`,
    era: 'Classic Era',
    category: 'GAME_BAT' as EquipmentCategory,
    rarity: (['COMMON', 'UNCOMMON', 'RARE'] as const)[i % 3],
    statBuffs: { chopBounceAccuracy: 2.0 + (i % 4), contactBoost: 1.5 },
    flavorText: 'Standard issue clubhouse timber vetted for reliable ground-ball placement.'
  })),

  // --- BATTING GLOVES & WRIST TAPE (26–55) ---
  {
    id: 'gloves_01',
    name: 'Goat-Skin Batting Gloves w/ Pine Tar Stains',
    era: 'Modern Era',
    category: 'BATTING_GLOVES',
    rarity: 'RARE',
    statBuffs: { contactBoost: 6.0, chopBounceAccuracy: 4.0 },
    flavorText: 'Stiffened with dried pine tar to eliminate bat slippage in high-humidity ninth innings.'
  },
  {
    id: 'gloves_02',
    name: '1983 Retro Double-Knit Wristbands',
    era: '1983 Era',
    category: 'BATTING_GLOVES',
    rarity: 'UNCOMMON',
    statBuffs: { staminaRecovery: 5.0 },
    flavorText: 'Soaked in ballpark sweat and vintage determination.'
  },
  ...Array.from({ length: 28 }).map((_, i) => ({
    id: `gloves_${3 + i}`,
    name: `Clubhouse Leather Gloves MK-${i + 1}`,
    era: 'Various Eras',
    category: 'BATTING_GLOVES' as EquipmentCategory,
    rarity: (['COMMON', 'UNCOMMON'] as const)[i % 2],
    statBuffs: { contactBoost: 2.0 + (i % 3) },
    flavorText: 'Reliable hand protection for daily batting practice.'
  })),

  // --- SPIKES & CLEATS (56–80) ---
  {
    id: 'cleats_01',
    name: 'Steel-Spiked Turf Cleats (Memorial Stadium Red Clay)',
    era: '1983 Era',
    category: 'CLEATS',
    rarity: 'EPIC',
    statBuffs: { chopBounceAccuracy: 7.0, staminaRecovery: 6.0 },
    flavorText: 'Encrusted with genuine 1980s infield dirt.'
  },
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `cleats_${2 + i}`,
    name: `Molded Pro Cleat Series ${i + 1}`,
    era: 'Modern Era',
    category: 'CLEATS' as EquipmentCategory,
    rarity: (['COMMON', 'UNCOMMON', 'RARE'] as const)[i % 3],
    statBuffs: { staminaRecovery: 3.0 + (i % 4) },
    flavorText: 'Optimized grip for explosive base running and batter’s box traction.'
  })),

  // --- PINE TAR, COLLARS & EYE BLACK (81–105) ---
  {
    id: 'tar_01',
    name: 'The Megaphone Pine Tar Rag',
    era: '1979 Era',
    category: 'PINE_TAR_CONE',
    rarity: 'EPIC',
    statBuffs: { chopBounceAccuracy: 11.0, contactBoost: 4.0 },
    flavorText: 'A sticky black relic that has coated hundreds of game bats.'
  },
  {
    id: 'eyeblack_01',
    name: 'War-Paint Grease Stick (Double Stripe)',
    era: 'Classic Era',
    category: 'EYE_BLACK',
    rarity: 'UNCOMMON',
    statBuffs: { clutchMultiplier: 1.1 },
    flavorText: 'Eliminates afternoon glare under the stadium lights.'
  },
  ...Array.from({ length: 23 }).map((_, i) => ({
    id: `acc_${2 + i}`,
    name: `Tactical Clubhouse Accessory #${i + 1}`,
    era: 'Various Eras',
    category: 'ARM_SLEEVE' as EquipmentCategory,
    rarity: (['COMMON', 'UNCOMMON'] as const)[i % 2],
    statBuffs: { contactBoost: 1.0 },
    flavorText: 'Standard comfort gear for the 162-game grind.'
  })),

  // --- HISTORICAL STADIUM RELICS (106–120+) ---
  {
    id: 'relic_01',
    name: 'Memorial Stadium Field Turf Swatch (1954–1991)',
    era: '1979 Era',
    category: 'STADIUM_CHAIR_RELIC',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { chopBounceAccuracy: 15.0, clutchMultiplier: 1.4 },
    framing: 'Encapsulated genuine artificial turf fiber from 33rd Street.',
    flavorText: 'The exact turf upon which decades of Baltimore Chops were bounced.'
  },
  {
    id: 'relic_02',
    name: 'Camden Yards Opening Day Seat Fragment (April 6, 1992)',
    era: '1992 Era',
    category: 'STADIUM_CHAIR_RELIC',
    rarity: 'EPIC',
    statBuffs: { powerBoost: 8.0, staminaRecovery: 8.0 },
    flavorText: 'Original green stadium seat slat from the inaugural game.'
  },
  {
    id: 'relic_03',
    name: 'Official 1983 World Series Game Ball (Signed by Earl Weaver)',
    era: '1983 Era',
    category: 'GAME_BALL_RELIC',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { chopBounceAccuracy: 14.0, clutchMultiplier: 1.35 },
    flavorText: 'Official Rawlings ball carrying the commissioner’s signature and manager’s personal blessing.'
  },
  {
    id: 'relic_04',
    name: 'Home Plate Chunk from 33rd Street Final Out',
    era: '1991 Era',
    category: 'WORLD_SERIES_BASE',
    rarity: 'MYTHIC_1_OF_1',
    statBuffs: { chopBounceAccuracy: 16.0, powerBoost: 12.0 },
    flavorText: 'The actual white rubber corner dug up following the final out at Memorial Stadium.'
  },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `stadium_relic_${5 + i}`,
    name: `Commemorative Stadium Artifact #${10 + i}`,
    era: 'Classic Era',
    category: 'GAME_BALL_RELIC' as EquipmentCategory,
    rarity: (['RARE', 'EPIC'] as const)[i % 2],
    statBuffs: { contactBoost: 3.0 + (i % 3), powerBoost: 2.5 },
    flavorText: 'Certified game-used stadium artifact retrieved by clubhouse attendants.'
  }))
];
