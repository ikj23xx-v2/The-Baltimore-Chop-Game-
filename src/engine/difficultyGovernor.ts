// src/engine/difficultyGovernor.ts

export type CPUDifficultyTier = 'ROOKIE' | 'VETERAN' | 'ALL_STAR' | 'HALL_OF_FAME';

export interface DifficultyConfig {
  tier: CPUDifficultyTier;
  displayName: string;
  reactionSpeedMs: number; // Pitch reading reaction window
  pitchGuessTolerance: number;
  cpuAgressiveness: number;
  tokenMultiplier: number; // Higher difficulty awards higher token payout
  description: string;
}

export const DIFFICULTY_SPECS: Record<CPUDifficultyTier, DifficultyConfig> = {
  ROOKIE: {
    tier: 'ROOKIE',
    displayName: 'Rookie (Recreational)',
    reactionSpeedMs: 650,
    pitchGuessTolerance: 2,
    cpuAgressiveness: 0.8,
    tokenMultiplier: 1.0,
    description: 'Generous timing windows and forgiving strike zone penalties. Ideal for casual pack opening.',
  },
  VETERAN: {
    tier: 'VETERAN',
    displayName: 'Veteran (Balanced)',
    reactionSpeedMs: 450,
    pitchGuessTolerance: 1,
    cpuAgressiveness: 1.0,
    tokenMultiplier: 1.25,
    description: 'Authentic MLB speed. Balanced pitcher break and realistic Baltimore Chop bounce rates.',
  },
  ALL_STAR: {
    tier: 'ALL_STAR',
    displayName: 'All-Star (Challenger)',
    reactionSpeedMs: 320,
    pitchGuessTolerance: 0,
    cpuAgressiveness: 1.2,
    tokenMultiplier: 1.6,
    description: 'Sharp breaking balls and tight pitch anticipation. Serious franchise test.',
  },
  HALL_OF_FAME: {
    tier: 'HALL_OF_FAME',
    displayName: 'Hall of Fame (Simulation Purist)',
    reactionSpeedMs: 220,
    pitchGuessTolerance: 0,
    cpuAgressiveness: 1.45,
    tokenMultiplier: 2.2,
    description: 'Unforgiving major-league velocity. Pure sabermetric execution required for wins.',
  },
};

export interface DifficultyGovernorState {
  currentTier: CPUDifficultyTier;
  changesThisSeason: number;
  maxChangesAllowed: number; // Max 3 per season
  lastChangedTimestamp: number;
  cooldownDays: number; // 9-day cooldown
}

const STORAGE_KEY = 'chop_difficulty_governor_v1';
const MS_PER_DAY = 86400000;

export function getDifficultyGovernorState(): DifficultyGovernorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.currentTier) return parsed;
    }
  } catch {
    // fallback
  }

  const initial: DifficultyGovernorState = {
    currentTier: 'VETERAN',
    changesThisSeason: 0,
    maxChangesAllowed: 3,
    lastChangedTimestamp: 0,
    cooldownDays: 9,
  };
  saveDifficultyGovernorState(initial);
  return initial;
}

export function saveDifficultyGovernorState(state: DifficultyGovernorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save difficulty governor state:', err);
  }
}

export function canChangeDifficulty(
  state: DifficultyGovernorState,
  nowMs: number = Date.now()
): { allowed: boolean; remainingCooldownDays?: number; reason?: string } {
  if (state.changesThisSeason >= state.maxChangesAllowed) {
    return {
      allowed: false,
      reason: `Season adjustment limit reached (${state.changesThisSeason}/${state.maxChangesAllowed}). Locks in for integrity.`,
    };
  }

  const cooldownMs = state.cooldownDays * MS_PER_DAY;
  const elapsed = nowMs - state.lastChangedTimestamp;

  if (state.lastChangedTimestamp > 0 && elapsed < cooldownMs) {
    const remainingDays = Math.ceil((cooldownMs - elapsed) / MS_PER_DAY);
    return {
      allowed: false,
      remainingCooldownDays: remainingDays,
      reason: `Mandatory 9-day cooldown active. ${remainingDays} day(s) remaining before next adjustment.`,
    };
  }

  return { allowed: true };
}

export function applyDifficultyChange(
  state: DifficultyGovernorState,
  newTier: CPUDifficultyTier,
  nowMs: number = Date.now()
): DifficultyGovernorState {
  const check = canChangeDifficulty(state, nowMs);
  if (!check.allowed) {
    throw new Error(check.reason);
  }

  const updated: DifficultyGovernorState = {
    ...state,
    currentTier: newTier,
    changesThisSeason: state.changesThisSeason + 1,
    lastChangedTimestamp: nowMs,
  };

  saveDifficultyGovernorState(updated);
  return updated;
}
