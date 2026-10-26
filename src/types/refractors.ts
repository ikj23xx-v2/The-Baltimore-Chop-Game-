// src/types/refractors.ts

export type RefractorTier = 
  | 'BASE'
  | 'SILVER_REFRACTOR'
  | 'ATOMIC_MOJO'
  | 'SAPPHIRE'
  | 'GOLD_WAVE'
  | 'SUPERFRACTOR';

export interface RefractorConfig {
  tier: RefractorTier;
  displayName: string;
  serialMax: number | null; // null = unnumbered
  pointMultiplier: number;
  attributeBoost: number;
  cssBorderClass: string;
  shaderEffect: 'none' | 'rainbow' | 'cracked_ice' | 'blue_sparkle' | 'gold_wave' | 'spiral_gold';
  badgeColor: string;
  glowColor: string;
}

export const REFRACTOR_REGISTRY: Record<RefractorTier, RefractorConfig> = {
  BASE: {
    tier: 'BASE',
    displayName: 'Base Paper',
    serialMax: null,
    pointMultiplier: 1.0,
    attributeBoost: 0,
    cssBorderClass: 'border-slate-700',
    shaderEffect: 'none',
    badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    glowColor: 'rgba(100, 116, 139, 0.2)'
  },
  SILVER_REFRACTOR: {
    tier: 'SILVER_REFRACTOR',
    displayName: 'Refractor',
    serialMax: null,
    pointMultiplier: 1.05,
    attributeBoost: 1,
    cssBorderClass: 'border-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]',
    shaderEffect: 'rainbow',
    badgeColor: 'bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-900 border-white',
    glowColor: 'rgba(255, 255, 255, 0.4)'
  },
  ATOMIC_MOJO: {
    tier: 'ATOMIC_MOJO',
    displayName: 'Atomic Mojo',
    serialMax: 150,
    pointMultiplier: 1.10,
    attributeBoost: 2,
    cssBorderClass: 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]',
    shaderEffect: 'cracked_ice',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.5)'
  },
  SAPPHIRE: {
    tier: 'SAPPHIRE',
    displayName: 'Sapphire Chrome',
    serialMax: 75,
    pointMultiplier: 1.15,
    attributeBoost: 3,
    cssBorderClass: 'border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)]',
    shaderEffect: 'blue_sparkle',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-500',
    glowColor: 'rgba(37, 99, 235, 0.6)'
  },
  GOLD_WAVE: {
    tier: 'GOLD_WAVE',
    displayName: 'Gold Wave',
    serialMax: 25,
    pointMultiplier: 1.25,
    attributeBoost: 4,
    cssBorderClass: 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.7)]',
    shaderEffect: 'gold_wave',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.7)'
  },
  SUPERFRACTOR: {
    tier: 'SUPERFRACTOR',
    displayName: 'Superfractor 1/1',
    serialMax: 1,
    pointMultiplier: 1.50,
    attributeBoost: 5,
    cssBorderClass: 'border-amber-300 ring-2 ring-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.9)] animate-pulse',
    shaderEffect: 'spiral_gold',
    badgeColor: 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-black border-yellow-300 font-black',
    glowColor: 'rgba(234, 179, 8, 0.9)'
  },
};

export const ALL_REFRACTOR_TIERS: RefractorTier[] = [
  'BASE',
  'SILVER_REFRACTOR',
  'ATOMIC_MOJO',
  'SAPPHIRE',
  'GOLD_WAVE',
  'SUPERFRACTOR'
];

/**
 * Generates an authentic serial stamp string according to refractor tier and card number
 */
export function getAuthenticSerialStamp(tier: RefractorTier, cardSeed: number = 42): string | undefined {
  const config = REFRACTOR_REGISTRY[tier];
  if (!config || config.serialMax === null) return undefined;
  if (config.serialMax === 1) return '1/1';
  const num = (cardSeed % config.serialMax) + 1;
  const padLen = config.serialMax >= 100 ? 3 : 2;
  return `#${String(num).padStart(padLen, '0')}/${config.serialMax}`;
}
