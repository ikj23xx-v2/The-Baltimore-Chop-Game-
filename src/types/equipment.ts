// src/types/equipment.ts

export type EquipmentCategory = 
  | 'BAT' 
  | 'BATTING_GLOVES' 
  | 'FIELDING_GLOVE' 
  | 'OPTICS' 
  | 'EYE_BLACK' 
  | 'CLEATS' 
  | 'PROTECTIVE_ARMOR' 
  | 'DUGOUT_RELIC';

export type EquipmentTier = 1 | 2 | 3;

export interface EquipmentCard {
  id: string;
  name: string;
  category: EquipmentCategory;
  tier: EquipmentTier;
  statBoosts: {
    contact?: number;
    power?: number;
    discipline?: number;
    defense?: number;
    speed?: number;
    pitchControl?: number;
  };
  environmentalCondition?: 'DAY' | 'NIGHT' | 'SUMMER_HEAT' | 'HIGH_LEVERAGE' | 'ALWAYS';
  perkDescription: string;
  tokenVendingCost: number; // Tier 1: 1 Token, Tier 2: 3 Tokens, Tier 3: 5 Tokens
  icon?: string;
  lore?: string;
}
