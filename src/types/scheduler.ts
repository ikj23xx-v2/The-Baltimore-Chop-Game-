// src/types/scheduler.ts

export type OffensiveDirective = 'SMALL_BALL' | 'BALANCED' | 'POWER_HUNT';
export type DefensiveAlignment = 'STANDARD' | 'NO_DOUBLES' | 'INFIELD_IN' | 'SHIFT';

export interface SeriesGamePlan {
  seriesId: number;
  opponentTeam: string;
  targetStarterId: string;
  offensiveDirective: OffensiveDirective;
  defensiveAlignment: DefensiveAlignment;
  useBullpenAggressively: boolean;
  isLockedIn: boolean; // True once submitted by the user
}

export interface ManagerWeeklySchedule {
  managerId: string;
  startingSeriesNumber: number; // e.g., Series 18
  scheduledGamePlans: SeriesGamePlan[]; // Up to 7 days out
  lastUpdatedTimestamp: number;
}
