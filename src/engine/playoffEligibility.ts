// src/engine/playoffEligibility.ts

export interface SeasonProgressTracker {
  managerId: string;
  seasonNumber: number; // 1 through 12
  regularSeasonGamesPlayed: number; // Min: 20, Max: 60
  rankedWins: number;
  rankedLosses: number;
  currentWinStreak: number;
  bankedMatchesRemaining: number; // 0 to 9
}

export interface PlayoffStatus {
  isQualified: boolean;
  gamesNeeded: number;
  pvpMode: 'OFFLINE_SIM' | 'SYNC_PVP_TRIAL' | 'UNRESTRICTED_CLIMAX';
  rulesDescription: string;
}

export function evaluatePlayoffEligibility(progress: SeasonProgressTracker): PlayoffStatus {
  const MIN_GAMES_REQUIRED = 20;
  const isQualified = progress.regularSeasonGamesPlayed >= MIN_GAMES_REQUIRED;
  const gamesNeeded = Math.max(0, MIN_GAMES_REQUIRED - progress.regularSeasonGamesPlayed);

  // Seasons 1-10: Standard regular seasons
  if (progress.seasonNumber <= 10) {
    return {
      isQualified,
      gamesNeeded,
      pvpMode: 'OFFLINE_SIM',
      rulesDescription: 'Standard franchise play. Rolling 2-season refractor limits apply.',
    };
  }

  // Season 11: The PvP Trial (Wild Card & Division rounds)
  if (progress.seasonNumber === 11) {
    return {
      isQualified,
      gamesNeeded,
      pvpMode: 'SYNC_PVP_TRIAL',
      rulesDescription: 'Live Opponent vs. Opponent Trial (Best-of-3). 8-second simultaneous card turns.',
    };
  }

  // Season 12: The Grand Finale
  return {
    isQualified,
    gamesNeeded,
    pvpMode: 'UNRESTRICTED_CLIMAX',
    rulesDescription: 'The Championship Climax (Best-of-5). All historical refractors from all seasons are fully unlocked!',
  };
}
