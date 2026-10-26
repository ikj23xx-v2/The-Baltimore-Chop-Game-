export interface MLBTeamInfo {
  id: string; // e.g. 'BAL', 'NYY', 'BOS'
  name: string;
  shortName: string;
  city: string;
  league: 'AL' | 'NL';
  division: 'EAST' | 'CENTRAL' | 'WEST';
  ballpark: string;
  primaryColor: string;
  secondaryColor: string;
  logoIcon: string;
  established: number;
}

export const MLB_TEAMS: MLBTeamInfo[] = [
  // --- AL EAST ---
  {
    id: 'BAL',
    name: 'Baltimore Orioles',
    shortName: 'Orioles',
    city: 'Baltimore',
    league: 'AL',
    division: 'EAST',
    ballpark: 'Oriole Park at Camden Yards',
    primaryColor: '#DF4601',
    secondaryColor: '#000000',
    logoIcon: '🐦',
    established: 1901
  },
  {
    id: 'BOS',
    name: 'Boston Red Sox',
    shortName: 'Red Sox',
    city: 'Boston',
    league: 'AL',
    division: 'EAST',
    ballpark: 'Fenway Park',
    primaryColor: '#BD3039',
    secondaryColor: '#0D2B56',
    logoIcon: '🧦',
    established: 1901
  },
  {
    id: 'NYY',
    name: 'New York Yankees',
    shortName: 'Yankees',
    city: 'New York',
    league: 'AL',
    division: 'EAST',
    ballpark: 'Yankee Stadium',
    primaryColor: '#003087',
    secondaryColor: '#E4002B',
    logoIcon: '🗽',
    established: 1901
  },
  {
    id: 'TB',
    name: 'Tampa Bay Rays',
    shortName: 'Rays',
    city: 'St. Petersburg',
    league: 'AL',
    division: 'EAST',
    ballpark: 'Tropicana Field',
    primaryColor: '#092C5C',
    secondaryColor: '#8FBCE6',
    logoIcon: '☀️',
    established: 1998
  },
  {
    id: 'TOR',
    name: 'Toronto Blue Jays',
    shortName: 'Blue Jays',
    city: 'Toronto',
    league: 'AL',
    division: 'EAST',
    ballpark: 'Rogers Centre',
    primaryColor: '#134A8E',
    secondaryColor: '#1D2D5C',
    logoIcon: '🍁',
    established: 1977
  },

  // --- AL CENTRAL ---
  {
    id: 'CWS',
    name: 'Chicago White Sox',
    shortName: 'White Sox',
    city: 'Chicago',
    league: 'AL',
    division: 'CENTRAL',
    ballpark: 'Guaranteed Rate Field',
    primaryColor: '#27251F',
    secondaryColor: '#C4CED4',
    logoIcon: '🧦',
    established: 1901
  },
  {
    id: 'CLE',
    name: 'Cleveland Guardians',
    shortName: 'Guardians',
    city: 'Cleveland',
    league: 'AL',
    division: 'CENTRAL',
    ballpark: 'Progressive Field',
    primaryColor: '#0C2340',
    secondaryColor: '#E31937',
    logoIcon: '🛡️',
    established: 1901
  },
  {
    id: 'DET',
    name: 'Detroit Tigers',
    shortName: 'Tigers',
    city: 'Detroit',
    league: 'AL',
    division: 'CENTRAL',
    ballpark: 'Comerica Park',
    primaryColor: '#0C2340',
    secondaryColor: '#FA4616',
    logoIcon: '🐅',
    established: 1901
  },
  {
    id: 'KC',
    name: 'Kansas City Royals',
    shortName: 'Royals',
    city: 'Kansas City',
    league: 'AL',
    division: 'CENTRAL',
    ballpark: 'Kauffman Stadium',
    primaryColor: '#004687',
    secondaryColor: '#BD9B60',
    logoIcon: '👑',
    established: 1969
  },
  {
    id: 'MIN',
    name: 'Minnesota Twins',
    shortName: 'Twins',
    city: 'Minneapolis',
    league: 'AL',
    division: 'CENTRAL',
    ballpark: 'Target Field',
    primaryColor: '#002B5C',
    secondaryColor: '#D31145',
    logoIcon: '👬',
    established: 1901
  },

  // --- AL WEST ---
  {
    id: 'HOU',
    name: 'Houston Astros',
    shortName: 'Astros',
    city: 'Houston',
    league: 'AL',
    division: 'WEST',
    ballpark: 'Minute Maid Park',
    primaryColor: '#002D62',
    secondaryColor: '#EB6E1F',
    logoIcon: '🚀',
    established: 1962
  },
  {
    id: 'LAA',
    name: 'Los Angeles Angels',
    shortName: 'Angels',
    city: 'Anaheim',
    league: 'AL',
    division: 'WEST',
    ballpark: 'Angel Stadium',
    primaryColor: '#BA0021',
    secondaryColor: '#003263',
    logoIcon: '😇',
    established: 1961
  },
  {
    id: 'OAK',
    name: 'Oakland Athletics',
    shortName: 'Athletics',
    city: 'Oakland',
    league: 'AL',
    division: 'WEST',
    ballpark: 'Oakland Coliseum',
    primaryColor: '#003831',
    secondaryColor: '#EFB21E',
    logoIcon: '🐘',
    established: 1901
  },
  {
    id: 'SEA',
    name: 'Seattle Mariners',
    shortName: 'Mariners',
    city: 'Seattle',
    league: 'AL',
    division: 'WEST',
    ballpark: 'T-Mobile Park',
    primaryColor: '#0C2C56',
    secondaryColor: '#005C5C',
    logoIcon: '🧭',
    established: 1977
  },
  {
    id: 'TEX',
    name: 'Texas Rangers',
    shortName: 'Rangers',
    city: 'Arlington',
    league: 'AL',
    division: 'WEST',
    ballpark: 'Globe Life Field',
    primaryColor: '#003278',
    secondaryColor: '#C0111F',
    logoIcon: '🤠',
    established: 1961
  },

  // --- NL EAST ---
  {
    id: 'ATL',
    name: 'Atlanta Braves',
    shortName: 'Braves',
    city: 'Atlanta',
    league: 'NL',
    division: 'EAST',
    ballpark: 'Truist Park',
    primaryColor: '#CE1141',
    secondaryColor: '#13274F',
    logoIcon: '🪓',
    established: 1876
  },
  {
    id: 'MIA',
    name: 'Miami Marlins',
    shortName: 'Marlins',
    city: 'Miami',
    league: 'NL',
    division: 'EAST',
    ballpark: 'loanDepot park',
    primaryColor: '#00A3E0',
    secondaryColor: '#EF3340',
    logoIcon: '🐟',
    established: 1993
  },
  {
    id: 'NYM',
    name: 'New York Mets',
    shortName: 'Mets',
    city: 'New York',
    league: 'NL',
    division: 'EAST',
    ballpark: 'Citi Field',
    primaryColor: '#002D72',
    secondaryColor: '#FF5910',
    logoIcon: '🍎',
    established: 1962
  },
  {
    id: 'PHI',
    name: 'Philadelphia Phillies',
    shortName: 'Phillies',
    city: 'Philadelphia',
    league: 'NL',
    division: 'EAST',
    ballpark: 'Citizens Bank Park',
    primaryColor: '#E81828',
    secondaryColor: '#002D72',
    logoIcon: '🔔',
    established: 1883
  },
  {
    id: 'WSH',
    name: 'Washington Nationals',
    shortName: 'Nationals',
    city: 'Washington',
    league: 'NL',
    division: 'EAST',
    ballpark: 'Nationals Park',
    primaryColor: '#AB0003',
    secondaryColor: '#14225A',
    logoIcon: '🏛️',
    established: 1969
  },

  // --- NL CENTRAL ---
  {
    id: 'CHC',
    name: 'Chicago Cubs',
    shortName: 'Cubs',
    city: 'Chicago',
    league: 'NL',
    division: 'CENTRAL',
    ballpark: 'Wrigley Field',
    primaryColor: '#0E3386',
    secondaryColor: '#CC3433',
    logoIcon: '🐻',
    established: 1876
  },
  {
    id: 'CIN',
    name: 'Cincinnati Reds',
    shortName: 'Reds',
    city: 'Cincinnati',
    league: 'NL',
    division: 'CENTRAL',
    ballpark: 'Great American Ball Park',
    primaryColor: '#C6011F',
    secondaryColor: '#000000',
    logoIcon: '🔴',
    established: 1881
  },
  {
    id: 'MIL',
    name: 'Milwaukee Brewers',
    shortName: 'Brewers',
    city: 'Milwaukee',
    league: 'NL',
    division: 'CENTRAL',
    ballpark: 'American Family Field',
    primaryColor: '#FFC52F',
    secondaryColor: '#12284B',
    logoIcon: '🍺',
    established: 1969
  },
  {
    id: 'PIT',
    name: 'Pittsburgh Pirates',
    shortName: 'Pirates',
    city: 'Pittsburgh',
    league: 'NL',
    division: 'CENTRAL',
    ballpark: 'PNC Park',
    primaryColor: '#FDB827',
    secondaryColor: '#000000',
    logoIcon: '🏴‍☠️',
    established: 1882
  },
  {
    id: 'STL',
    name: 'St. Louis Cardinals',
    shortName: 'Cardinals',
    city: 'St. Louis',
    league: 'NL',
    division: 'CENTRAL',
    ballpark: 'Busch Stadium',
    primaryColor: '#C41E3A',
    secondaryColor: '#0C2340',
    logoIcon: '🐦',
    established: 1882
  },

  // --- NL WEST ---
  {
    id: 'AZ',
    name: 'Arizona Diamondbacks',
    shortName: 'Diamondbacks',
    city: 'Phoenix',
    league: 'NL',
    division: 'WEST',
    ballpark: 'Chase Field',
    primaryColor: '#A71930',
    secondaryColor: '#E3D4AD',
    logoIcon: '🐍',
    established: 1998
  },
  {
    id: 'COL',
    name: 'Colorado Rockies',
    shortName: 'Rockies',
    city: 'Denver',
    league: 'NL',
    division: 'WEST',
    ballpark: 'Coors Field',
    primaryColor: '#33006F',
    secondaryColor: '#C4CED4',
    logoIcon: '🏔️',
    established: 1993
  },
  {
    id: 'LAD',
    name: 'Los Angeles Dodgers',
    shortName: 'Dodgers',
    city: 'Los Angeles',
    league: 'NL',
    division: 'WEST',
    ballpark: 'Dodger Stadium',
    primaryColor: '#005A9C',
    secondaryColor: '#EF3E42',
    logoIcon: '🌴',
    established: 1883
  },
  {
    id: 'SD',
    name: 'San Diego Padres',
    shortName: 'Padres',
    city: 'San Diego',
    league: 'NL',
    division: 'WEST',
    ballpark: 'Petco Park',
    primaryColor: '#2F241D',
    secondaryColor: '#FFC425',
    logoIcon: '🤎',
    established: 1969
  },
  {
    id: 'SF',
    name: 'San Francisco Giants',
    shortName: 'Giants',
    city: 'San Francisco',
    league: 'NL',
    division: 'WEST',
    ballpark: 'Oracle Park',
    primaryColor: '#FD5A1E',
    secondaryColor: '#000000',
    logoIcon: '🌉',
    established: 1883
  }
];

export function getTeamById(id: string): MLBTeamInfo | undefined {
  return MLB_TEAMS.find((t) => t.id === id);
}

export function getTeamByName(name: string): MLBTeamInfo | undefined {
  return MLB_TEAMS.find((t) => t.name === name || t.shortName === name);
}

export function getTeamsByLeague(league: 'AL' | 'NL'): MLBTeamInfo[] {
  return MLB_TEAMS.filter((t) => t.league === league);
}

export function getTeamsByDivision(league: 'AL' | 'NL', division: 'EAST' | 'CENTRAL' | 'WEST'): MLBTeamInfo[] {
  return MLB_TEAMS.filter((t) => t.league === league && t.division === division);
}

export const MLB_DIVISIONS = [
  { league: 'AL', division: 'EAST', name: 'AL East' },
  { league: 'AL', division: 'CENTRAL', name: 'AL Central' },
  { league: 'AL', division: 'WEST', name: 'AL West' },
  { league: 'NL', division: 'EAST', name: 'NL East' },
  { league: 'NL', division: 'CENTRAL', name: 'NL Central' },
  { league: 'NL', division: 'WEST', name: 'NL West' },
] as const;

