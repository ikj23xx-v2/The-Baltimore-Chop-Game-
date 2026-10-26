// src/engine/seriesSimEngine.ts

export interface SeriesConfig {
  seriesNumber: number; // 1 to 52
  opponentTeam: string;
  totalGames: 3 | 4;
  homeOrAway: 'HOME' | 'AWAY';
}

export interface SimDecisionPrompt {
  id: string;
  gameNumber: number;
  inning: number;
  situationText: string;
  options: {
    label: string;
    actionType: 'PULL_STARTER' | 'PINCH_HIT' | 'INTENTIONAL_WALK' | 'STEAL_BASE';
    winProbDelta: number; // e.g., +0.15 or -0.10
  }[];
}

export interface SeriesResult {
  seriesId: number;
  gamesWon: number;
  gamesLost: number;
  leverageGameScore: { userScore: number; oppScore: number };
  tokensEarned: number;
  wearApplied: number;
}

/**
 * Resolves Games 1 and 2 via quick-sim with player tactical input.
 */
export function simulateSeriesGame(
  userTeamRating: number,
  oppTeamRating: number,
  playerDirectiveBonus: number
): { userRuns: number; oppRuns: number; won: boolean } {
  // Base scoring probability driven by team WAR & ratings
  const baseRatingDiff = (userTeamRating - oppTeamRating) * 0.05;
  const roll = Math.random() + baseRatingDiff + playerDirectiveBonus;

  const won = roll > 0.48;
  const userRuns = won ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 3);
  const oppRuns = won ? Math.max(0, userRuns - Math.floor(Math.random() * 3) - 1) : userRuns + Math.floor(Math.random() * 4) + 1;

  return { userRuns, oppRuns, won };
}

/**
 * Generates the live jump-in scenario for the final rubber game.
 */
export function generateRubberMatchScenario(series: SeriesConfig): {
  startInning: number;
  userScore: number;
  oppScore: number;
  runnersOn: [boolean, boolean, boolean];
  outs: number;
} {
  return {
    startInning: 7, // Jump in at the 7th Inning Stretch
    userScore: 3,
    oppScore: 4,
    runnersOn: [true, false, true], // 1st and 3rd
    outs: 1,
  };
}
