/**
 * MLB Roster Service
 * Implements real-time 26-man active roster synchronization via official MLB Stats API
 * Endpoint: https://statsapi.mlb.com/api/v1/teams/{teamId}/roster?rosterType=active
 */

export interface MlbApiRosterPlayer {
  id: number;
  fullName: string;
  position: string;
  status: string;
  jerseyNumber?: string;
}

export interface MlbFranchiseMeta {
  teamId: number;
  teamCode: string;
  teamName: string;
  city: string;
  league: 'AL' | 'NL';
  division: 'EAST' | 'CENTRAL' | 'WEST';
}

// Official MLB Stats API Franchise IDs
export const MLB_API_TEAM_IDS: Record<string, number> = {
  // AL East
  'Baltimore Orioles': 110,
  'Boston Red Sox': 111,
  'New York Yankees': 147,
  'Tampa Bay Rays': 139,
  'Toronto Blue Jays': 141,

  // AL Central
  'Chicago White Sox': 145,
  'Cleveland Guardians': 114,
  'Detroit Tigers': 116,
  'Kansas City Royals': 118,
  'Minnesota Twins': 142,

  // AL West
  'Houston Astros': 117,
  'Los Angeles Angels': 108,
  'Oakland Athletics': 133,
  'Seattle Mariners': 136,
  'Texas Rangers': 140,

  // NL East
  'Atlanta Braves': 144,
  'Miami Marlins': 146,
  'New York Mets': 121,
  'Philadelphia Phillies': 143,
  'Washington Nationals': 120,

  // NL Central
  'Chicago Cubs': 112,
  'Cincinnati Reds': 113,
  'Milwaukee Brewers': 158,
  'Pittsburgh Pirates': 134,
  'St. Louis Cardinals': 138,

  // NL West
  'Arizona Diamondbacks': 109,
  'Colorado Rockies': 115,
  'Los Angeles Dodgers': 119,
  'San Diego Padres': 135,
  'San Francisco Giants': 137,
};

/**
 * Fetch 26-man active roster for a given MLB franchise ID using official MLB Stats API
 */
export async function fetchTeamRoster(teamId: number): Promise<MlbApiRosterPlayer[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(
      `https://statsapi.mlb.com/api/v1/teams/${teamId}/roster?rosterType=active`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`MLB Stats API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.roster || !Array.isArray(data.roster)) {
      throw new Error('Invalid roster response payload from MLB Stats API');
    }

    return data.roster.map((player: any) => ({
      id: player.person.id,
      fullName: player.person.fullName,
      position: player.position?.abbreviation || 'UTIL',
      status: player.status?.description || 'Active',
      jerseyNumber: player.jerseyNumber || '--'
    }));
  } catch (error) {
    console.warn(`[MLB API] Live fetch failed for team ${teamId}, using cached fallback.`, error);
    throw error;
  }
}

/**
 * Get Team ID by Team Name
 */
export function getTeamIdByName(teamName: string): number {
  return MLB_API_TEAM_IDS[teamName] || 110; // Default to Orioles (110)
}

export const fetchActiveRosterFromMlbApi = fetchTeamRoster;

