// src/engine/cardGradingEngine.ts
import { PlayerCard } from '../types/game';

export type SlabGradeTier = 
  | 'PRISTINE_10' 
  | 'GEM_MINT_10' 
  | 'MINT_9_5' 
  | 'MINT_9' 
  | 'NEAR_MINT_8_5' 
  | 'EXCELLENT_7';

export interface SubgradeScores {
  centering: number; // 0 - 10
  corners: number;   // 0 - 10
  edges: number;     // 0 - 10
  surface: number;   // 0 - 10
  historicalWarGrade: number; // based on bRef WAR
  clutchRating: number;       // based on player contact + power stats
  authenticationScore: number;// signature or refractor tier authenticity
}

export interface CertifiedSlabReport {
  certId: string;
  cardId: string;
  playerName: string;
  team: string;
  compositeGrade: number;
  gradeTier: SlabGradeTier;
  subgrades: SubgradeScores;
  gradedDate: string;
  populationHigher: number;
  populationEqual: number;
  qrVerificationHash: string;
}

export function evaluateCardGrading(card: PlayerCard, cardSeed: number = 42): CertifiedSlabReport {
  // 1. Centering (seeded pseudo-random with high bias toward 9.5-10 for refractors)
  const isSuperfractor = card.refractorTier === 'SUPERFRACTOR_1_OF_1';
  const isGoldWave = card.refractorTier === 'GOLD_WAVE';
  const isRefractor = card.refractorTier !== 'BASE';

  const baseBonus = isSuperfractor ? 1.0 : isGoldWave ? 0.7 : isRefractor ? 0.4 : 0;
  
  // Hash seed
  const hash = (card.name.length * 37 + card.bRefWar * 11 + cardSeed) % 100;

  const rawCentering = Math.min(10, +(9.0 + (hash % 10) * 0.1 + baseBonus).toFixed(1));
  const rawCorners = Math.min(10, +(9.0 + ((hash * 3) % 10) * 0.1 + baseBonus).toFixed(1));
  const rawEdges = Math.min(10, +(9.2 + ((hash * 7) % 8) * 0.1 + baseBonus).toFixed(1));
  const rawSurface = Math.min(10, +(9.2 + ((hash * 13) % 8) * 0.1 + baseBonus).toFixed(1));

  // Historical WAR Grade (0 - 10 scale, 100 WAR = 10.0)
  const historicalWarGrade = Math.min(10, +(card.bRefWar >= 100 ? 10.0 : 6.0 + (card.bRefWar / 100) * 4.0).toFixed(1));

  // Clutch Rating
  const clutchRating = Math.min(10, +(((card.stats.contact + card.stats.power) / 198) * 10).toFixed(1));

  // Authentication Score
  const authenticationScore = card.hasAutograph ? 10.0 : isRefractor ? 9.8 : 9.5;

  // Composite Calculation: corners, centering, edges, surface
  const physicalAverage = (rawCentering + rawCorners + rawEdges + rawSurface) / 4;
  const compositeGrade = isSuperfractor ? 10.0 : Math.min(10, Math.floor(physicalAverage * 2) / 2);

  let gradeTier: SlabGradeTier = 'MINT_9';
  if (compositeGrade >= 10.0) {
    gradeTier = (rawCentering === 10 && rawCorners === 10 && rawEdges === 10 && rawSurface === 10) ? 'PRISTINE_10' : 'GEM_MINT_10';
  } else if (compositeGrade >= 9.5) {
    gradeTier = 'MINT_9_5';
  } else if (compositeGrade >= 9.0) {
    gradeTier = 'MINT_9';
  } else if (compositeGrade >= 8.5) {
    gradeTier = 'NEAR_MINT_8_5';
  } else {
    gradeTier = 'EXCELLENT_7';
  }

  const certNumber = `${10000000 + ((hash * 8923) % 89999999)}`;

  return {
    certId: `BGS-${certNumber}`,
    cardId: card.id,
    playerName: card.name,
    team: card.team,
    compositeGrade,
    gradeTier,
    subgrades: {
      centering: rawCentering,
      corners: rawCorners,
      edges: rawEdges,
      surface: rawSurface,
      historicalWarGrade,
      clutchRating,
      authenticationScore,
    },
    gradedDate: 'OCTOBER 2026',
    populationHigher: isSuperfractor ? 0 : Math.max(0, (hash % 12) - 8),
    populationEqual: isSuperfractor ? 1 : (hash % 14) + 1,
    qrVerificationHash: `chop-verify-slab://${certNumber}-${card.id}`,
  };
}
