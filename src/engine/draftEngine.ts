// src/engine/draftEngine.ts

export interface DraftableCard {
  id: string;
  name: string;
  position: 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'SP' | 'RP';
  warRating: number;
  expectedRound: number; // Value tier
}

export interface TeamDraftRoster {
  selectedCards: DraftableCard[];
  tradesCompleted: number; // Max 3
}

export type DraftGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

export const MAX_DRAFT_TRADES = 3;
export const ALLOWED_TRADE_ROUNDS = [3, 6, 9];

/**
 * Calculates pick value and triggers appropriate audio reactions.
 */
export function evaluatePickQuality(
  card: DraftableCard,
  currentRound: number
): { isGoodPick: boolean; pickDiff: number } {
  // If drafted earlier than expected value by 2+ rounds, considered a reach
  const pickDiff = card.expectedRound - currentRound;
  const isGoodPick = pickDiff >= -1; // Value pick or reasonable board choice
  return { isGoodPick, pickDiff };
}

/**
 * Grades overall draft based on WAR accumulation, positional coverage, and surplus value.
 */
export function calculateFinalDraftGrade(roster: DraftableCard[]): {
  grade: DraftGrade;
  totalWAR: number;
  summary: string;
} {
  const totalWAR = roster.reduce((sum, c) => sum + c.warRating, 0);
  const uniquePositions = new Set(roster.map((c) => c.position)).size;

  let score = totalWAR;
  if (uniquePositions >= 7) score += 5; // Balanced depth bonus

  let grade: DraftGrade = 'D';
  let summary = 'Weak draft: Roster lacks balance and high-WAR impact anchors.';

  if (score >= 60) {
    grade = 'A+';
    summary = 'Championship Foundation: Elite WAR values with balanced positional coverage!';
  } else if (score >= 50) {
    grade = 'A';
    summary = 'Strong Draft: Reliable starting core with playoff-caliber depth.';
  } else if (score >= 40) {
    grade = 'B';
    summary = 'Solid Construction: Good foundation, though a few reach picks lowered the ceiling.';
  } else if (score >= 30) {
    grade = 'C';
    summary = 'Average: Noticeable gaps in rotation or key infield spots.';
  }

  return { grade, totalWAR, summary };
}

/**
 * Validates mid-draft CPU trades (restricted to specific rounds and a 3-trade ceiling).
 */
export function validateDraftTrade(
  currentRound: number,
  completedTrades: number
): { canTrade: boolean; error?: string } {
  if (completedTrades >= MAX_DRAFT_TRADES) {
    return {
      canTrade: false,
      error: `Trade limit reached. You can only execute ${MAX_DRAFT_TRADES} trades per draft event.`,
    };
  }

  if (!ALLOWED_TRADE_ROUNDS.includes(currentRound)) {
    return {
      canTrade: false,
      error: `The CPU trade window is closed. Trades are only permitted prior to Rounds ${ALLOWED_TRADE_ROUNDS.join(', ')}.`,
    };
  }

  return { canTrade: true };
}
