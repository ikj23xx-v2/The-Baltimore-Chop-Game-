// =========================================================================
// CHOP EXTREME ANALYTICAL SCORING ENGINE
// Rooted in Modern Baseball Analytics: Run Expectancy (RE24), WPA, & Linear Weights (wOBA)
// =========================================================================

export interface LinearWeightEvent {
  event: 'OUT' | 'STRIKEOUT' | 'WALK' | 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HOME_RUN';
  runValue: number;
  basePoints: number; // runValue * 100
}

export const LINEAR_WEIGHT_POINTS: Record<LinearWeightEvent['event'], number> = {
  OUT: -27,        // -0.27 run value relative to an out
  STRIKEOUT: -30,  // -0.30 run value (batter) / +30 (pitcher)
  WALK: 69,        // +0.69 run value (uBB / HBP)
  SINGLE: 89,      // +0.89 run value
  DOUBLE: 127,     // +1.27 run value
  TRIPLE: 162,     // +1.62 run value
  HOME_RUN: 210    // +2.10 run value
};

export type LeverageTier = 'LOW' | 'MEDIUM' | 'HIGH_EXTREME';

export interface LeverageState {
  inning: number;
  scoreDiff: number; // homeScore - awayScore
  baseRunners: { first: boolean; second: boolean; third: boolean };
  outs: number;
  leverageIndex: number; // e.g. 0.45 (low), 1.35 (med), 2.85 (extreme)
  tier: LeverageTier;
  multiplier: number; // 1.0x, 1.5x, 2.5x
}

export function calculateLeverageIndex(
  inning: number,
  scoreDiff: number,
  baseRunners: { first: boolean; second: boolean; third: boolean },
  outs: number
): LeverageState {
  let baseLI = 1.0;

  // Inning weight: late innings have dramatically higher leverage
  if (inning >= 9) baseLI += 1.2;
  else if (inning >= 7) baseLI += 0.6;
  else if (inning <= 3) baseLI -= 0.3;

  // Score differential weight (close games are high leverage)
  const absDiff = Math.abs(scoreDiff);
  if (absDiff === 0) baseLI += 0.8;
  else if (absDiff === 1) baseLI += 0.6;
  else if (absDiff === 2) baseLI += 0.3;
  else if (absDiff >= 5) baseLI -= 0.7;

  // Base runners weight
  const runnersOn = (baseRunners.first ? 1 : 0) + (baseRunners.second ? 1 : 0) + (baseRunners.third ? 1 : 0);
  if (runnersOn === 3) baseLI += 0.9;
  else if (runnersOn === 2) baseLI += 0.5;
  else if (runnersOn === 1) baseLI += 0.2;

  // 2-out leverage amplifier
  if (outs === 2) baseLI += 0.3;

  const finalLI = Math.max(0.2, Math.round(baseLI * 100) / 100);

  let tier: LeverageTier = 'LOW';
  let multiplier = 1.0;

  if (finalLI >= 2.0) {
    tier = 'HIGH_EXTREME';
    multiplier = 2.5;
  } else if (finalLI >= 0.85) {
    tier = 'MEDIUM';
    multiplier = 1.5;
  } else {
    tier = 'LOW';
    multiplier = 1.0;
  }

  return {
    inning,
    scoreDiff,
    baseRunners,
    outs,
    leverageIndex: finalLI,
    tier,
    multiplier
  };
}

// Statcast Precision Modifiers
export interface StatcastModifiers {
  chasedOutOfZone?: boolean;       // -15 pts
  elevatedFastballWhiff?: boolean;  // -20 pts
  barrelContact?: boolean;          // +50 pts (EV >= 98 mph & LA 26-30 deg)
  perfectPitchSequence?: boolean;   // +40 pts (0-2 chase executed)
  babipKarmaTax?: boolean;          // swing with xBA < .100 bloop hit gives only 20% pts
  platoonBlunder?: boolean;         // RHP vs .950 OPS with specialist in bullpen (-50 momentum)
}

export function computeChopIndexScore(
  event: LinearWeightEvent['event'],
  leverage: LeverageState,
  modifiers: StatcastModifiers
): {
  basePoints: number;
  leverageMultiplier: number;
  modifierBonus: number;
  penaltyDeduction: number;
  totalChopIndex: number;
  calculationBreakdown: string[];
} {
  let base = LINEAR_WEIGHT_POINTS[event] || 0;
  const breakdown: string[] = [];

  breakdown.push(`Base Linear Weight (${event}): ${base > 0 ? '+' : ''}${base} pts`);

  // BABIP Karma Tax
  if (modifiers.babipKarmaTax && base > 0) {
    base = Math.round(base * 0.2);
    breakdown.push(`⚠️ BABIP Karma Tax applied (<.100 xBA bloop): Reduced to ${base} pts (20%)`);
  }

  const levPoints = Math.round(base * leverage.multiplier);
  breakdown.push(`Leverage Multiplier (${leverage.tier} LI: ${leverage.leverageIndex}x): ${leverage.multiplier}x -> ${levPoints} pts`);

  let bonus = 0;
  let penalty = 0;

  if (modifiers.chasedOutOfZone) {
    penalty += 15;
    breakdown.push(`📉 Chased Out-of-Zone: -15 pts discipline penalty`);
  }
  if (modifiers.elevatedFastballWhiff) {
    penalty += 20;
    breakdown.push(`📉 Elevated High Fastball Whiff: -20 pts`);
  }
  if (modifiers.platoonBlunder) {
    penalty += 50;
    breakdown.push(`🚨 Platoon Blunder Penalty: -50 pts (RHP vs elite LHB)`);
  }
  if (modifiers.barrelContact) {
    bonus += 50;
    breakdown.push(`🔥 Statcast Barrel Contact (EV ≥98mph, LA 26°-30°): +50 pts`);
  }
  if (modifiers.perfectPitchSequence) {
    bonus += 40;
    breakdown.push(`🎯 Perfect 0-2 Pitch Sequence Execution: +40 pts`);
  }

  const total = levPoints + bonus - penalty;

  return {
    basePoints: base,
    leverageMultiplier: leverage.multiplier,
    modifierBonus: bonus,
    penaltyDeduction: penalty,
    totalChopIndex: total,
    calculationBreakdown: breakdown
  };
}

// =========================================================================
// LAYER 2: THE EXTREME 100-POINT REWARD PATH
// =========================================================================

export interface ExtremeRewardMilestone {
  pointsRequired: number;
  title: string;
  badgeLabel: string;
  rewardType: 'PROFILE_BANNER' | 'RELIEF_ACE_CARD' | 'DIAMOND_BORDER_SKIN' | 'FIVE_TOOL_SUPERFRACTOR' | 'ENDGAME_BOSS_99';
  rewardDescription: string;
  unlocked: boolean;
}

export const EXTREME_100_PATH_MILESTONES: ExtremeRewardMilestone[] = [
  {
    pointsRequired: 15,
    title: 'The Calculated Sabermetrician',
    badgeLabel: 'CALCULATED',
    rewardType: 'PROFILE_BANNER',
    rewardDescription: 'Exclusive "Calculated" Analytical Profile Banner & Golden Sabermetrics Badge.',
    unlocked: false
  },
  {
    pointsRequired: 30,
    title: 'Tier 1 Extreme Closer',
    badgeLabel: 'HIGH-LEVERAGE ACE',
    rewardType: 'RELIEF_ACE_CARD',
    rewardDescription: 'Tier 1 Extreme Card: High-leverage relief ace (Peak Mariano Rivera 1996 or Mason Miller 104mph) with maxed K/9 and 99th percentile Chase Rate.',
    unlocked: false
  },
  {
    pointsRequired: 55,
    title: 'Holographic Diamond Border Skin',
    badgeLabel: 'PRISMATIC SKIN',
    rewardType: 'DIAMOND_BORDER_SKIN',
    rewardDescription: 'Holographic Diamond Border skin applicable to any card in your binder with dynamic specular light-refraction.',
    unlocked: false
  },
  {
    pointsRequired: 75,
    title: 'Tier 2 Extreme 5-Tool Immortal',
    badgeLabel: '1/1 SUPERFRACTOR',
    rewardType: 'FIVE_TOOL_SUPERFRACTOR',
    rewardDescription: 'Tier 2 Extreme Card: Elite 5-tool player with authentic 3D superfractor gold swirl sheen and on-card certified autograph.',
    unlocked: false
  },
  {
    pointsRequired: 100,
    title: 'The Ultimate 99 OVR Endgame Card',
    badgeLabel: '99 OVR ENDGAME',
    rewardType: 'ENDGAME_BOSS_99',
    rewardDescription: 'The Ultimate 99 OVR Endgame Boss Card & permanent leaderboard trophy displayed across the web app.',
    unlocked: false
  }
];

export interface ExtremeProgramState {
  totalExtremePoints: number; // 0 to 100
  momentsCompletedIds: string[];
  gauntletCompletedBosses: number; // 0 to 10
  gridTerritoriesConquered: string[];
  statcastKsOver2500Rpm: number; // target 50
  statcastBarrelsUnder20Chase: number; // target 25
  collectionSetsLockedIn: string[];
}

export const INITIAL_EXTREME_STATE: ExtremeProgramState = {
  totalExtremePoints: 24, // Starting sample progress for immediate immersion
  momentsCompletedIds: ['MOMENT_01', 'MOMENT_02'],
  gauntletCompletedBosses: 3,
  gridTerritoriesConquered: ['NODE_01', 'NODE_02'],
  statcastKsOver2500Rpm: 18,
  statcastBarrelsUnder20Chase: 9,
  collectionSetsLockedIn: ['SERIES_1']
};
