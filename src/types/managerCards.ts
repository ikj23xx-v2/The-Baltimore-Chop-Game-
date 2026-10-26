// src/types/managerCards.ts

export type ManagerArchetype = 
  | 'SMALL_BALL'       
  | 'THREE_TRUE_OUTCOMES' 
  | 'STATION_TO_STATION' 
  | 'AGGRESSIVE_PITCHING' 
  | 'ANALYTICS_SAVVY';

export interface ManagerCard {
  id: string;
  managerName: string;
  era: string; // e.g., "1983 Era Classic"
  archetype: ManagerArchetype;
  rarity: 'COMMON' | 'SILVER' | 'GOLD' | 'LEGENDARY';
  autoplayBuffs: {
    stolenBaseAttemptRate: number; // multiplier e.g. 1.4x
    sacBuntFrequency: number;
    bullpenHookAggressiveness: number; // 1.0 to 2.0 (how fast to pull starters)
    platoonAdvantageWeight: number; // how strictly left/right splits are favored
  };
  signatureTrait: {
    name: string;
    description: string;
  };
}

export interface ManagerCardInstance {
  instanceId: string;
  managerId: string;
  managerName: string;
  archetype: ManagerArchetype;
  seasonLocked: number; // e.g., Season 1
  usesRemaining: number; // Max 5 uses per regular season before playoffs lock
  maxUses: number;
  isExhausted: boolean;
}

export function validateManagerUsage(
  manager: ManagerCardInstance,
  currentSeason: number,
  currentSeriesNumber: number // 1 to 52 across the 162-game season
): { canUse: boolean; error?: string } {
  // 1. Check season lock
  if (manager.seasonLocked !== currentSeason) {
    return { 
      canUse: false, 
      error: `Manager is locked to Season ${manager.seasonLocked} and cannot be deployed in Season ${currentSeason}.` 
    };
  }

  // 2. Enforce the half-season / 5-use limit before playoffs (Series 40+ approx or 0 uses left)
  const isPlayoffEra = currentSeriesNumber > 44; // Playoffs begin in final stretch of 162 games
  if (isPlayoffEra) {
    return {
      canUse: false,
      error: 'Manager card usage is locked during the postseason. Rosters must rely on pure team WAR and player attributes.'
    };
  }

  if (manager.usesRemaining <= 0 || manager.isExhausted) {
    return {
      canUse: false,
      error: 'This manager has exhausted all 5 tactical deployments for the regular season.'
    };
  }

  return { canUse: true };
}

export function consumeManagerUse(manager: ManagerCardInstance): ManagerCardInstance {
  const newUses = Math.max(0, manager.usesRemaining - 1);
  return {
    ...manager,
    usesRemaining: newUses,
    isExhausted: newUses === 0,
  };
}

export const FAMOUS_MANAGERS: ManagerCard[] = [
  {
    id: 'mgr_earl_weaver',
    managerName: 'Earl Weaver',
    era: '1970-1980s Orioles Classic',
    archetype: 'THREE_TRUE_OUTCOMES',
    rarity: 'LEGENDARY',
    autoplayBuffs: {
      stolenBaseAttemptRate: 0.8,
      sacBuntFrequency: 0.3,
      bullpenHookAggressiveness: 1.6,
      platoonAdvantageWeight: 1.8
    },
    signatureTrait: {
      name: 'Pitching & 3-Run Home Runs',
      description: 'Hates the sacrifice bunt. Maximizes extra-base hit probability and high-leverage bullpen matchups.'
    }
  },
  {
    id: 'mgr_whitey_herzog',
    managerName: 'Whitey Herzog',
    era: '1982 Cardinals Whiteyball',
    archetype: 'SMALL_BALL',
    rarity: 'LEGENDARY',
    autoplayBuffs: {
      stolenBaseAttemptRate: 1.8,
      sacBuntFrequency: 1.5,
      bullpenHookAggressiveness: 1.5,
      platoonAdvantageWeight: 1.4
    },
    signatureTrait: {
      name: 'Whiteyball Chaos Engine',
      description: 'High steal frequency on artificial turf, hit-and-run singles, and relentless base-running pressure.'
    }
  },
  {
    id: 'mgr_tony_la_russa',
    managerName: 'Tony La Russa',
    era: '1989 A’s / 2000s Cards',
    archetype: 'AGGRESSIVE_PITCHING',
    rarity: 'GOLD',
    autoplayBuffs: {
      stolenBaseAttemptRate: 1.1,
      sacBuntFrequency: 1.0,
      bullpenHookAggressiveness: 1.9,
      platoonAdvantageWeight: 1.7
    },
    signatureTrait: {
      name: 'Specialized Bullpen Bridge',
      description: 'Invented the one-inning closer and specialized setup man. Drastically cuts down late-inning opponent comebacks.'
    }
  },
  {
    id: 'mgr_brandon_hyde',
    managerName: 'Brandon Hyde',
    era: 'Modern Camden Renaissance',
    archetype: 'ANALYTICS_SAVVY',
    rarity: 'GOLD',
    autoplayBuffs: {
      stolenBaseAttemptRate: 1.3,
      sacBuntFrequency: 0.6,
      bullpenHookAggressiveness: 1.4,
      platoonAdvantageWeight: 1.9
    },
    signatureTrait: {
      name: 'Camden Matchup Mastery',
      description: 'Strict platoon matchups and young core speed synergies that boost extra bases and clutch comebacks.'
    }
  }
];
