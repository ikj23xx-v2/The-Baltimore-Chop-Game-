// src/types/rankings.ts

export type LeaderboardWindow = 'DAILY' | 'WEEKLY' | 'SEASON';

export interface ManagerLeaderboardEntry {
  rank: number;
  managerId: string;
  username: string;
  divisionTier: 'ROOKIE' | 'VETERAN' | 'ALL_STAR' | 'HOF_ELITE';
  record: {
    wins: number;
    losses: number;
    winPct: number;
  };
  advancedMetrics: {
    teamWRCPlus: number;
    teamFIP: number;
    chopSuccessRate: number; // percentage
    clutchRating: number;
  };
  leagueTokensEarnedTotal: number;
  updatedAt: number;
}

export interface LeaderboardQueryFilter {
  window: LeaderboardWindow;
  seasonNumber: number;
  division?: string;
}
