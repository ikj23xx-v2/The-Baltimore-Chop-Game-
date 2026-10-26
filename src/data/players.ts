import { PlayerCard } from '../types/game';
import { ALL_PLAYERS as MASTER_PLAYERS } from './allMlbPlayers';
import { NEGRO_LEAGUE_LEGENDS } from './negroLeagues';

export const ALL_PLAYERS: PlayerCard[] = [...MASTER_PLAYERS, ...NEGRO_LEAGUE_LEGENDS];

// Official 26-man active roster for default starting deck (Baltimore or chosen team)
export const INITIAL_ROSTER: PlayerCard[] = MASTER_PLAYERS.filter(p => p.team === 'Baltimore Orioles');

export function getPlayersByPosition(pos: string): PlayerCard[] {
  return ALL_PLAYERS.filter(p => p.position === pos);
}

export function getPlayersByTeam(teamName: string): PlayerCard[] {
  return ALL_PLAYERS.filter(p => p.team === teamName);
}

export function getRosterForTeam(teamName: string): PlayerCard[] {
  const teamCards = ALL_PLAYERS.filter(p => p.team === teamName);
  if (teamCards.length >= 26) return teamCards.slice(0, 26);
  if (teamCards.length > 0) return teamCards;
  return INITIAL_ROSTER;
}

export { NEGRO_LEAGUE_LEGENDS };
