// src/engine/managerSimEngine.ts
import { ManagerCard } from '../types/managerCards';

export function applyManagerAutoplayTactics(
  baseSimWinProbability: number,
  manager: ManagerCard,
  teamRosterDepth: number
): number {
  let adjustedProbability = baseSimWinProbability;

  // Apply archetype-specific simulation modifiers during quick-sims
  switch (manager.archetype) {
    case 'SMALL_BALL':
      // Rewards teams with high speed/contact stats
      adjustedProbability += 0.03;
      break;
    case 'ANALYTICS_SAVVY':
      // Rewards deep rosters with strong platoon options
      adjustedProbability += (teamRosterDepth > 24 ? 0.04 : 0.01);
      break;
    case 'AGGRESSIVE_PITCHING':
      // Suppresses opponent scoring in simulated late innings
      adjustedProbability += 0.025;
      break;
    default:
      break;
  }

  return Math.min(0.95, Math.max(0.05, adjustedProbability));
}
