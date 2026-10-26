// src/components/CommunityRankBadge.tsx
import React from 'react';

export type CommunityRankTier = 
  | 'BATBOY_ROOKIE'
  | 'SINGLE_A_GRINDER'
  | 'DOUBLE_A_PROSPECT'
  | 'TRIPLE_A_BALLPLAYER'
  | 'BIG_LEAGUE_REGULAR'
  | 'ALL_STAR_STARTER'
  | 'GOLD_GLOVE_ANCHOR'
  | 'MVP_CONTENDER'
  | 'WORLD_SERIES_LEGEND'
  | 'HOF_IMMORTAL';

export interface RankConfig {
  tier: CommunityRankTier;
  title: string;
  minXp: number;
  badgeColor: string;
  borderColor: string;
  iconSymbol: string;
}

export const COMMUNITY_RANKS: Record<CommunityRankTier, RankConfig> = {
  BATBOY_ROOKIE: {
    tier: 'BATBOY_ROOKIE',
    title: 'Batboy / Rookie',
    minXp: 0,
    badgeColor: 'bg-slate-800 text-slate-300',
    borderColor: 'border-slate-600',
    iconSymbol: '🧢',
  },
  SINGLE_A_GRINDER: {
    tier: 'SINGLE_A_GRINDER',
    title: 'Single-A Grinder',
    minXp: 1000,
    badgeColor: 'bg-amber-950/80 text-amber-300',
    borderColor: 'border-amber-800',
    iconSymbol: '⚾',
  },
  DOUBLE_A_PROSPECT: {
    tier: 'DOUBLE_A_PROSPECT',
    title: 'Double-A Prospect',
    minXp: 3500,
    badgeColor: 'bg-amber-900/60 text-amber-200',
    borderColor: 'border-amber-600',
    iconSymbol: '🪵',
  },
  TRIPLE_A_BALLPLAYER: {
    tier: 'TRIPLE_A_BALLPLAYER',
    title: 'Triple-A Ballplayer',
    minXp: 8000,
    badgeColor: 'bg-slate-700 text-slate-100',
    borderColor: 'border-slate-400',
    iconSymbol: '🏟️',
  },
  BIG_LEAGUE_REGULAR: {
    tier: 'BIG_LEAGUE_REGULAR',
    title: 'Big League Regular',
    minXp: 16000,
    badgeColor: 'bg-blue-950 text-blue-300',
    borderColor: 'border-blue-500',
    iconSymbol: '⭐',
  },
  ALL_STAR_STARTER: {
    tier: 'ALL_STAR_STARTER',
    title: 'All-Star Starter',
    minXp: 30000,
    badgeColor: 'bg-amber-500/20 text-amber-300',
    borderColor: 'border-amber-400',
    iconSymbol: '🌟',
  },
  GOLD_GLOVE_ANCHOR: {
    tier: 'GOLD_GLOVE_ANCHOR',
    title: 'Gold Glove Anchor',
    minXp: 55000,
    badgeColor: 'bg-yellow-500/20 text-yellow-300',
    borderColor: 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
    iconSymbol: '🧤',
  },
  MVP_CONTENDER: {
    tier: 'MVP_CONTENDER',
    title: 'League MVP Contender',
    minXp: 90000,
    badgeColor: 'bg-purple-950/80 text-purple-300',
    borderColor: 'border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]',
    iconSymbol: '🏆',
  },
  WORLD_SERIES_LEGEND: {
    tier: 'WORLD_SERIES_LEGEND',
    title: 'World Series Legend',
    minXp: 140000,
    badgeColor: 'bg-cyan-950/80 text-cyan-300',
    borderColor: 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.6)]',
    iconSymbol: '💍',
  },
  HOF_IMMORTAL: {
    tier: 'HOF_IMMORTAL',
    title: 'Hall of Fame Immortal',
    minXp: 220000,
    badgeColor: 'bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 text-amber-200',
    borderColor: 'border-yellow-300 ring-2 ring-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.8)] animate-pulse',
    iconSymbol: '🏛️',
  },
};

export function getUserRankFromXP(totalXp: number): RankConfig {
  const tiers = Object.values(COMMUNITY_RANKS).sort((a, b) => b.minXp - a.minXp);
  for (const tier of tiers) {
    if (totalXp >= tier.minXp) return tier;
  }
  return COMMUNITY_RANKS.BATBOY_ROOKIE;
}

interface CommunityRankBadgeProps {
  xp: number;
  showTitle?: boolean;
}

export const CommunityRankBadge: React.FC<CommunityRankBadgeProps> = ({ xp, showTitle = true }) => {
  const rank = getUserRankFromXP(xp);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${rank.badgeColor} ${rank.borderColor} text-xs font-bold shadow-sm select-none`}
    >
      <span>{rank.iconSymbol}</span>
      {showTitle && <span>{rank.title}</span>}
    </div>
  );
};
