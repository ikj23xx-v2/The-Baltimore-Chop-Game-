// src/engine/seriesAnalysisEngine.ts

export interface SeriesGameBoxScore {
  gameNumber: 1 | 2 | 3;
  userRuns: number;
  cpuRuns: number;
  userHits: number;
  cpuHits: number;
  userErrors: number;
  rispOpportunities: number;
  rispHits: number;
  startersInningsPitched: number;
  chopHitsAttempted: number;
  chopHitsConverted: number;
}

export interface SeriesRecapReport {
  seriesId: string;
  seriesResult: 'SWEEP_WIN' | 'SERIES_WON' | 'SERIES_LOST' | 'SWEPT';
  record: { wins: number; losses: number };
  keyStrengths: string[];
  vulnerabilities: string[];
  upcomingOpponentIntel: {
    opponentName: string;
    starterPitchTypeBias: 'SINKER_HEAVY' | 'HIGH_FASTBALL' | 'SLIDER_SPECIALIST';
    recommendedTactic: string;
  };
}

export function analyzeSeriesPerformance(
  seriesId: string,
  scores: SeriesGameBoxScore[],
  upcomingOpponent: { name: string; bias: 'SINKER_HEAVY' | 'HIGH_FASTBALL' | 'SLIDER_SPECIALIST' }
): SeriesRecapReport {
  let wins = 0;
  let losses = 0;
  let totalRispHits = 0;
  let totalRispAtBats = 0;
  let totalChopsAttempted = 0;
  let totalChopsConverted = 0;
  let totalErrors = 0;
  let totalRunsScored = 0;
  let totalRunsAllowed = 0;

  scores.forEach((g) => {
    if (g.userRuns > g.cpuRuns) wins++;
    else losses++;
    totalRispHits += g.rispHits;
    totalRispAtBats += g.rispOpportunities;
    totalChopsAttempted += g.chopHitsAttempted;
    totalChopsConverted += g.chopHitsConverted;
    totalErrors += g.userErrors;
    totalRunsScored += g.userRuns;
    totalRunsAllowed += g.cpuRuns;
  });

  const seriesResult: SeriesRecapReport['seriesResult'] =
    wins === 3 ? 'SWEEP_WIN' :
    wins === 2 ? 'SERIES_WON' :
    losses === 3 ? 'SWEPT' : 'SERIES_LOST';

  const strengths: string[] = [];
  const vulnerabilities: string[] = [];

  const rispRate = totalRispAtBats > 0 ? totalRispHits / totalRispAtBats : 0;
  const chopEfficiency = totalChopsAttempted > 0 ? totalChopsConverted / totalChopsAttempted : 0;

  if (rispRate >= 0.30) {
    strengths.push(`Clutch RISP Execution: ${(rispRate * 100).toFixed(0)}% (${totalRispHits}/${totalRispAtBats})`);
  } else {
    vulnerabilities.push(`Stranded Runners: Only ${(rispRate * 100).toFixed(0)}% RISP conversion`);
  }

  if (chopEfficiency >= 0.5) {
    strengths.push(`Baltimore Chop Mastery: ${totalChopsConverted}/${totalChopsAttempted} high-bouncers beat out`);
  } else if (totalChopsAttempted > 0) {
    vulnerabilities.push(`Weak Chop Timing: Grounders didn't achieve sufficient bounce clearance`);
  }

  if (totalErrors === 0) {
    strengths.push('Pristine Infield Defense: 0 errors across 3-game series');
  } else if (totalErrors >= 2) {
    vulnerabilities.push(`Fielding Lapses: ${totalErrors} defensive errors cost unearned runs`);
  }

  if (totalRunsScored >= 18) {
    strengths.push(`High Octane Offense: Averaged ${(totalRunsScored / 3).toFixed(1)} runs per game`);
  } else if (totalRunsAllowed >= 18) {
    vulnerabilities.push(`Pitching Fatigue: Bullpen surrendered ${(totalRunsAllowed / 3).toFixed(1)} runs per game`);
  }

  // Scouting intel recommendation
  let recommendedTactic = 'Sit dead red in the strike zone and push pitches opposite field.';
  if (upcomingOpponent.bias === 'SINKER_HEAVY') {
    recommendedTactic = 'Expect heavy sinkers down in the zone. Prime conditions for the Baltimore Chop high bounce!';
  } else if (upcomingOpponent.bias === 'HIGH_FASTBALL') {
    recommendedTactic = 'High heat expected. Lay off elevated pitches out of zone and protect with contact swings.';
  } else if (upcomingOpponent.bias === 'SLIDER_SPECIALIST') {
    recommendedTactic = 'Bite on low-and-away sliders is sharp. Watch for 2-strike break and guess low-outside.';
  }

  return {
    seriesId,
    seriesResult,
    record: { wins, losses },
    keyStrengths: strengths.length ? strengths : ['Stable baseline performance'],
    vulnerabilities: vulnerabilities.length ? vulnerabilities : ['No critical system weaknesses detected'],
    upcomingOpponentIntel: {
      opponentName: upcomingOpponent.name,
      starterPitchTypeBias: upcomingOpponent.bias,
      recommendedTactic,
    },
  };
}
