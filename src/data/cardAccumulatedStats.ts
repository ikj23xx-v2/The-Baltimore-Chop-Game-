import { PlayerCard } from '../types/game';

export interface CardSeasonStats {
  seasonNumber: number;
  seasonLabel: string;
  games: number;
  plateAppearances: number;
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  stolenBases: number;
  walks: number;
  strikeouts: number;
  battingAvg: string;
  onBasePct: string;
  sluggingPct: string;
  ops: string;
  baltimoreChopsCount: number;
  inGameWarAccumulated: number;
}

export interface CardGameModeStats {
  modeKey: 'ARENA' | 'EXTREME_GAUNTLET' | 'GRID_CONQUEST' | 'MOMENTS' | 'DRAFT_MATRIX';
  modeTitle: string;
  modeIcon: string;
  gamesOrAttempts: number;
  winsOrClears: number;
  winRatePct: number;
  clutchHits: number;
  homeRuns: number;
  chopSuccessRate: string; // e.g. "44.2%"
  userPointsEarned: number;
}

export interface CardCommunityRanking {
  userGlobalRank: number;
  totalCardHolders: number;
  topPercentileRank: string; // e.g. "Top 0.4%"
  cardAffinityTier: string; // e.g. "DIAMOND MASTER (LVL 14)"
  homeRunsRank: number;
  exitVelocityRank: number;
  userStatsVsCommunity: {
    statName: string;
    yourStat: string | number;
    communityAvg: string | number;
    topOnePercent: string | number;
    userPctVsAvg: number; // e.g. +38%
  }[];
}

export interface CardCompleteStatsProfile {
  cardId: string;
  seasons: CardSeasonStats[];
  gameModes: CardGameModeStats[];
  communityRanking: CardCommunityRanking;
  tacticalDeploymentRoles: ('STARTING_LINEUP' | 'PINCH_HITTER' | 'ACE_STARTER' | 'BULLPEN_CLOSER' | 'FRANCHISE_ANCHOR')[];
  synergyBuffSummary: string;
}

// Generate realistic, consistent analytical stats for any card based on its contact/power/bRefWar ratings
export function getCardAccumulatedStats(card: PlayerCard): CardCompleteStatsProfile {
  const hash = Array.from(card.id || card.name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const warMultiplier = Math.max(1, card.bRefWar || 3.5);
  const pwr = card.stats?.power || 75;
  const con = card.stats?.contact || 80;

  // Season 1 (Current Active Season)
  const g1 = 28 + (hash % 16);
  const pa1 = g1 * 4 + (hash % 9);
  const ab1 = pa1 - (hash % 8) - 4;
  const h1 = Math.round(ab1 * (con / 285));
  const hr1 = Math.max(1, Math.round((ab1 * (pwr / 420)) * 0.4));
  const doubles1 = Math.max(2, Math.round(h1 * 0.22));
  const triples1 = Math.max(0, Math.round(h1 * 0.03));
  const rbi1 = Math.round(hr1 * 2.3 + (h1 * 0.35));
  const chops1 = 4 + (hash % 8);
  const avg1 = (h1 / Math.max(1, ab1)).toFixed(3).replace(/^0/, '');
  const obp1 = ((h1 + 12) / pa1).toFixed(3).replace(/^0/, '');
  const slg1 = ((h1 - doubles1 - triples1 - hr1 + doubles1 * 2 + triples1 * 3 + hr1 * 4) / Math.max(1, ab1)).toFixed(3).replace(/^0/, '');
  const ops1 = (parseFloat(obp1) + parseFloat(slg1)).toFixed(3);

  // Season 0 (Preseason / Inaugural Alpha)
  const g0 = 14 + (hash % 8);
  const pa0 = g0 * 4;
  const ab0 = pa0 - 5;
  const h0 = Math.round(ab0 * (con / 290));
  const hr0 = Math.max(1, Math.round((ab0 * (pwr / 440)) * 0.35));
  const avg0 = (h0 / Math.max(1, ab0)).toFixed(3).replace(/^0/, '');
  const obp0 = ((h0 + 6) / pa0).toFixed(3).replace(/^0/, '');
  const slg0 = ((h0 + hr0 * 3) / Math.max(1, ab0)).toFixed(3).replace(/^0/, '');
  const ops0 = (parseFloat(obp0) + parseFloat(slg0)).toFixed(3);

  const seasons: CardSeasonStats[] = [
    {
      seasonNumber: 1,
      seasonLabel: 'Season 1: 2024 Spring Opening',
      games: g1,
      plateAppearances: pa1,
      atBats: ab1,
      hits: h1,
      doubles: doubles1,
      triples: triples1,
      homeRuns: hr1,
      rbi: rbi1,
      stolenBases: 3 + (hash % 7),
      walks: 12 + (hash % 6),
      strikeouts: 14 + (hash % 8),
      battingAvg: avg1,
      onBasePct: obp1,
      sluggingPct: slg1,
      ops: ops1,
      baltimoreChopsCount: chops1,
      inGameWarAccumulated: +(warMultiplier * 0.28).toFixed(1)
    },
    {
      seasonNumber: 0,
      seasonLabel: 'Inaugural Alpha / Spring Training',
      games: g0,
      plateAppearances: pa0,
      atBats: ab0,
      hits: h0,
      doubles: Math.round(h0 * 0.2),
      triples: 1,
      homeRuns: hr0,
      rbi: Math.round(hr0 * 2.1 + (h0 * 0.3)),
      stolenBases: 2,
      walks: 6,
      strikeouts: 8,
      battingAvg: avg0,
      onBasePct: obp0,
      sluggingPct: slg0,
      ops: ops0,
      baltimoreChopsCount: 2,
      inGameWarAccumulated: +(warMultiplier * 0.14).toFixed(1)
    }
  ];

  // Game Mode Breakdown
  const gameModes: CardGameModeStats[] = [
    {
      modeKey: 'ARENA',
      modeTitle: 'Stadium Arena Showdown',
      modeIcon: '🏟️',
      gamesOrAttempts: g1,
      winsOrClears: Math.round(g1 * 0.65),
      winRatePct: 65,
      clutchHits: Math.round(h1 * 0.4),
      homeRuns: hr1,
      chopSuccessRate: `${(38 + (hash % 18)).toFixed(1)}%`,
      userPointsEarned: Math.round(h1 * 89 + hr1 * 210)
    },
    {
      modeKey: 'EXTREME_GAUNTLET',
      modeTitle: 'Chop Extreme: The 9th Inning Crisis',
      modeIcon: '⚡',
      gamesOrAttempts: 8 + (hash % 5),
      winsOrClears: 5,
      winRatePct: 62.5,
      clutchHits: 6,
      homeRuns: Math.max(1, Math.round(hr1 * 0.3)),
      chopSuccessRate: '41.8%',
      userPointsEarned: 640
    },
    {
      modeKey: 'GRID_CONQUEST',
      modeTitle: 'Diamond Grid Conquest (Territory WAR)',
      modeIcon: '🗺️',
      gamesOrAttempts: 12,
      winsOrClears: 9,
      winRatePct: 75,
      clutchHits: 8,
      homeRuns: Math.max(1, Math.round(hr1 * 0.25)),
      chopSuccessRate: '52.0%',
      userPointsEarned: 890
    },
    {
      modeKey: 'MOMENTS',
      modeTitle: 'Moments of Infamy (Historical Sim)',
      modeIcon: '⏳',
      gamesOrAttempts: 6,
      winsOrClears: 4,
      winRatePct: 66.7,
      clutchHits: 5,
      homeRuns: 2,
      chopSuccessRate: '36.5%',
      userPointsEarned: 520
    },
    {
      modeKey: 'DRAFT_MATRIX',
      modeTitle: 'Refractor Draft Matrix ($/WAR Cap)',
      modeIcon: '🎰',
      gamesOrAttempts: 5,
      winsOrClears: 4,
      winRatePct: 80,
      clutchHits: 7,
      homeRuns: Math.max(1, Math.round(hr1 * 0.35)),
      chopSuccessRate: '48.2%',
      userPointsEarned: 780
    }
  ];

  // Community Standing
  const rank = 18 + (hash % 120);
  const totalHolders = 14290 + (hash * 13);
  const pct = ((rank / totalHolders) * 100).toFixed(2);

  const communityRanking: CardCommunityRanking = {
    userGlobalRank: rank,
    totalCardHolders: totalHolders,
    topPercentileRank: `Top ${pct}%`,
    cardAffinityTier: rank < 50 ? 'DIAMOND MASTER (LVL 14)' : rank < 200 ? 'GOLD ELITE (LVL 9)' : 'SILVER SPECIALIST (LVL 5)',
    homeRunsRank: 12 + (hash % 45),
    exitVelocityRank: 7 + (hash % 30),
    userStatsVsCommunity: [
      {
        statName: 'OPS with Card',
        yourStat: ops1,
        communityAvg: '.784',
        topOnePercent: '1.095',
        userPctVsAvg: Math.round(((parseFloat(ops1) - 0.784) / 0.784) * 100)
      },
      {
        statName: 'Avg Exit Velocity (mph)',
        yourStat: `${(91.2 + (pwr / 25)).toFixed(1)} mph`,
        communityAvg: '88.5 mph',
        topOnePercent: '97.2 mph',
        userPctVsAvg: 8
      },
      {
        statName: 'High-Leverage Clutch AVG',
        yourStat: avg1,
        communityAvg: '.248',
        topOnePercent: '.342',
        userPctVsAvg: Math.round(((parseFloat(avg1) - 0.248) / 0.248) * 100)
      },
      {
        statName: 'Baltimore Chop Success Rate',
        yourStat: `${chops1} Chops`,
        communityAvg: '1.8 Chops',
        topOnePercent: '8.4 Chops',
        userPctVsAvg: 110
      }
    ]
  };

  const isPitcher = card.position === 'SP' || card.position === 'RP';

  return {
    cardId: card.id,
    seasons,
    gameModes,
    communityRanking,
    tacticalDeploymentRoles: isPitcher
      ? ['ACE_STARTER', 'BULLPEN_CLOSER', 'FRANCHISE_ANCHOR']
      : ['STARTING_LINEUP', 'PINCH_HITTER', 'FRANCHISE_ANCHOR'],
    synergyBuffSummary: isPitcher
      ? '+12% Strikeout rate on 2-strike breaking balls'
      : '+25% Baltimore Chop bounce height & +15 mph exit velocity on high-leverage situations'
  };
}
