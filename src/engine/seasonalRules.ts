// src/engine/seasonalRules.ts

export interface SeasonRulesConfig {
  seasonNumber: number;
  isPostseasonOrClimax: boolean;
  allowVaultedRefractors: boolean;
  activeDeckBuildingCap: number | null; // null = unrestricted
}

export function getActiveSeasonRules(currentSeason: number): SeasonRulesConfig {
  const isClimaxEra = currentSeason >= 11;

  return {
    seasonNumber: currentSeason,
    isPostseasonOrClimax: isClimaxEra,
    // In Seasons 11 & 12, vault restrictions lift for the ultimate endgame showdown
    allowVaultedRefractors: isClimaxEra, 
    activeDeckBuildingCap: isClimaxEra ? null : 26, // Strict 26-man limits for regular seasons
  };
}
