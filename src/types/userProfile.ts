// src/types/userProfile.ts
import { TeamId } from '../data/teamJerseyThemes';

export interface LinkedGamerTags {
  psn?: string;
  xboxGamertag?: string;
  nintendoSwitch?: string;
  steamId?: string;
  discordHandle?: string;
  xTwitter?: string;
}

export interface UserSeasonMetrics {
  seasonNumber: number;
  gamesPlayed: number;
  record: { wins: number; losses: number };
  teamBattingAvg: number;
  teamOPS: number;
  chopSinglesHit: number;
  teamERA: number;
  clutchWinRate: number; // Late-inning high-leverage win %
  topWARPlayerName: string;
}

export interface UserPublicProfile {
  userId: string;
  username: string;
  favoriteTeam: TeamId;
  jerseyNumber: number | string;
  currentSeasonStats: UserSeasonMetrics;
  gamerTags: LinkedGamerTags;
  trophies: {
    hasWorldSeriesCrown: boolean;
    trueRainbowCompleted: boolean;
  };
}
