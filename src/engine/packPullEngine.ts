// src/engine/packPullEngine.ts
import { RefractorTier } from '../types/refractors';

export interface ChecklistCardEntry {
  checklistId: string;
  playerName: string;
  team: string;
  basePrintRun: number; // e.g., 1 for Superfractor, 25 for Gold Wave, 150 for Mojo
  historicalWar: number;
}

export interface PackPullParams {
  userId: string;
  setYear: number; // e.g., 1983 or 2026
  recentlyPulledCardIds: string[]; // Anti-duplicate suppression list
  userTokenBalance: number;
}

/**
 * Calculates weighted probability based on authentic series checklist print runs 
 * and applies duplicate suppression for numbered cards.
 */
export function rollAuthenticPackPull(
  checklist: ChecklistCardEntry[],
  params: PackPullParams
): { pulledCard: ChecklistCardEntry; assignedTier: RefractorTier; isDuplicateProtected: boolean } {
  
  // Filter out recently pulled cards to eliminate repetitive duplicate fatigue
  const availableChecklist = checklist.filter(
    (c) => !params.recentlyPulledCardIds.includes(c.checklistId)
  );

  const fallbackChecklist = availableChecklist.length > 0 ? availableChecklist : checklist;

  // Weighted random roll based on print runs
  const totalWeight = fallbackChecklist.reduce((sum, card) => sum + (1000 / Math.max(1, card.basePrintRun)), 0);
  let randomWeightRoll = Math.random() * totalWeight;

  let selectedEntry = fallbackChecklist[0];
  for (const card of fallbackChecklist) {
    const weight = 1000 / Math.max(1, card.basePrintRun);
    if (randomWeightRoll < weight) {
      selectedEntry = card;
      break;
    }
    randomWeightRoll -= weight;
  }

  // Determine Tier based on historical print run
  let assignedTier: RefractorTier = 'BASE';
  if (selectedEntry.basePrintRun === 1) assignedTier = 'SUPERFRACTOR';
  else if (selectedEntry.basePrintRun <= 25) assignedTier = 'GOLD_WAVE';
  else if (selectedEntry.basePrintRun <= 75) assignedTier = 'SAPPHIRE';
  else if (selectedEntry.basePrintRun <= 150) assignedTier = 'ATOMIC_MOJO';
  else if (selectedEntry.basePrintRun <= 500) assignedTier = 'SILVER_REFRACTOR';

  return {
    pulledCard: selectedEntry,
    assignedTier,
    isDuplicateProtected: availableChecklist.length < checklist.length,
  };
}
