import { MLBTeamInfo, MLB_TEAMS, getTeamByName } from '../data/mlbTeams';
import { PlayerCard } from '../types/game';
import { getRosterForTeam, ALL_PLAYERS } from '../data/players';

const STORAGE_KEY = 'chop_user_favorite_team';

export interface ActiveTeamTheme {
  name: string;
  shortName: string;
  city: string;
  league: 'AL' | 'NL' | 'NEGRO_LEAGUES';
  division?: string;
  ballpark: string;
  primaryColor: string;
  secondaryColor: string;
  logoIcon: string;
  isNegroLeagues?: boolean;
}

export const NEGRO_LEAGUES_TEAM_INFO: ActiveTeamTheme = {
  name: 'Negro League Legends',
  shortName: 'Legends',
  city: 'Historic Barnstormers',
  league: 'NEGRO_LEAGUES',
  division: 'HISTORICAL IMMORTALS',
  ballpark: 'Historic Greenlee Field / Forbes Field',
  primaryColor: '#8B1E0F',
  secondaryColor: '#D4AF37',
  logoIcon: '👑',
  isNegroLeagues: true
};

class TeamThemeService {
  private currentTeam: ActiveTeamTheme;
  private listeners: Array<(team: ActiveTeamTheme) => void> = [];

  constructor() {
    this.currentTeam = this.loadInitialTeam();
  }

  private loadInitialTeam(): ActiveTeamTheme {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          if (stored === 'Negro League Legends') {
            return NEGRO_LEAGUES_TEAM_INFO;
          }
          const mlb = getTeamByName(stored);
          if (mlb) return this.mapMlbToTheme(mlb);
        }
      } catch (e) {
        console.warn('Failed to load favorite team from storage', e);
      }
    }
    // Default to Baltimore Orioles
    const defMlb = getTeamByName('Baltimore Orioles') || MLB_TEAMS[0];
    return this.mapMlbToTheme(defMlb);
  }

  private mapMlbToTheme(mlb: MLBTeamInfo): ActiveTeamTheme {
    return {
      name: mlb.name,
      shortName: mlb.shortName,
      city: mlb.city,
      league: mlb.league,
      division: `${mlb.league} ${mlb.division}`,
      ballpark: mlb.ballpark,
      primaryColor: mlb.primaryColor,
      secondaryColor: mlb.secondaryColor,
      logoIcon: mlb.logoIcon
    };
  }

  public getActiveTeam(): ActiveTeamTheme {
    return this.currentTeam;
  }

  public getActiveTheme(): ActiveTeamTheme {
    return this.currentTeam;
  }

  public setActiveTheme(theme: ActiveTeamTheme): ActiveTeamTheme {
    this.currentTeam = theme;
    this.notify();
    return this.currentTeam;
  }

  public setFavoriteTeam(teamName: string): ActiveTeamTheme {
    if (teamName === 'Negro League Legends') {
      this.currentTeam = NEGRO_LEAGUES_TEAM_INFO;
    } else {
      const mlb = getTeamByName(teamName);
      if (mlb) {
        this.currentTeam = this.mapMlbToTheme(mlb);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, this.currentTeam.name);
      } catch (e) {
        console.warn('Failed to save favorite team', e);
      }
    }

    this.notify();
    return this.currentTeam;
  }

  public getStartingRosterForActiveTeam(): PlayerCard[] {
    if (this.currentTeam.isNegroLeagues) {
      const legends = ALL_PLAYERS.filter(p => p.team === 'Negro League Legends');
      return legends.slice(0, 26);
    }
    return getRosterForTeam(this.currentTeam.name);
  }

  public subscribe(listener: (team: ActiveTeamTheme) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.currentTeam));
  }
}

export const teamThemeService = new TeamThemeService();
