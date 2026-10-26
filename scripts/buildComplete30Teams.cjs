const fs = require('fs');
const path = require('path');

// 30 Official MLB Franchises
const MLB_TEAMS = [
  // AL East
  { id: 'BAL', name: 'Baltimore Orioles', shortName: 'Orioles', league: 'AL', division: 'EAST', logo: '🐦', city: 'Baltimore' },
  { id: 'BOS', name: 'Boston Red Sox', shortName: 'Red Sox', league: 'AL', division: 'EAST', logo: '🧦', city: 'Boston' },
  { id: 'NYY', name: 'New York Yankees', shortName: 'Yankees', league: 'AL', division: 'EAST', logo: '🗽', city: 'New York' },
  { id: 'TB', name: 'Tampa Bay Rays', shortName: 'Rays', league: 'AL', division: 'EAST', logo: '☀️', city: 'Tampa Bay' },
  { id: 'TOR', name: 'Toronto Blue Jays', shortName: 'Blue Jays', league: 'AL', division: 'EAST', logo: '🍁', city: 'Toronto' },
  // AL Central
  { id: 'CWS', name: 'Chicago White Sox', shortName: 'White Sox', league: 'AL', division: 'CENTRAL', logo: '🧦', city: 'Chicago' },
  { id: 'CLE', name: 'Cleveland Guardians', shortName: 'Guardians', league: 'AL', division: 'CENTRAL', logo: '🛡️', city: 'Cleveland' },
  { id: 'DET', name: 'Detroit Tigers', shortName: 'Tigers', league: 'AL', division: 'CENTRAL', logo: '🐅', city: 'Detroit' },
  { id: 'KC', name: 'Kansas City Royals', shortName: 'Royals', league: 'AL', division: 'CENTRAL', logo: '👑', city: 'Kansas City' },
  { id: 'MIN', name: 'Minnesota Twins', shortName: 'Twins', league: 'AL', division: 'CENTRAL', logo: '👬', city: 'Minnesota' },
  // AL West
  { id: 'HOU', name: 'Houston Astros', shortName: 'Astros', league: 'AL', division: 'WEST', logo: '🚀', city: 'Houston' },
  { id: 'LAA', name: 'Los Angeles Angels', shortName: 'Angels', league: 'AL', division: 'WEST', logo: '😇', city: 'Los Angeles' },
  { id: 'OAK', name: 'Oakland Athletics', shortName: 'Athletics', league: 'AL', division: 'WEST', logo: '🐘', city: 'Oakland' },
  { id: 'SEA', name: 'Seattle Mariners', shortName: 'Mariners', league: 'AL', division: 'WEST', logo: '🧭', city: 'Seattle' },
  { id: 'TEX', name: 'Texas Rangers', shortName: 'Rangers', league: 'AL', division: 'WEST', logo: '🤠', city: 'Texas' },
  // NL East
  { id: 'ATL', name: 'Atlanta Braves', shortName: 'Braves', league: 'NL', division: 'EAST', logo: '🪓', city: 'Atlanta' },
  { id: 'MIA', name: 'Miami Marlins', shortName: 'Marlins', league: 'NL', division: 'EAST', logo: '🐟', city: 'Miami' },
  { id: 'NYM', name: 'New York Mets', shortName: 'Mets', league: 'NL', division: 'EAST', logo: '🍎', city: 'New York' },
  { id: 'PHI', name: 'Philadelphia Phillies', shortName: 'Phillies', league: 'NL', division: 'EAST', logo: '🔔', city: 'Philadelphia' },
  { id: 'WSH', name: 'Washington Nationals', shortName: 'Nationals', league: 'NL', division: 'EAST', logo: '🏛️', city: 'Washington' },
  // NL Central
  { id: 'CHC', name: 'Chicago Cubs', shortName: 'Cubs', league: 'NL', division: 'CENTRAL', logo: '🐻', city: 'Chicago' },
  { id: 'CIN', name: 'Cincinnati Reds', shortName: 'Reds', league: 'NL', division: 'CENTRAL', logo: '🔴', city: 'Cincinnati' },
  { id: 'MIL', name: 'Milwaukee Brewers', shortName: 'Brewers', league: 'NL', division: 'CENTRAL', logo: '🍺', city: 'Milwaukee' },
  { id: 'PIT', name: 'Pittsburgh Pirates', shortName: 'Pirates', league: 'NL', division: 'CENTRAL', logo: '🏴‍☠️', city: 'Pittsburgh' },
  { id: 'STL', name: 'St. Louis Cardinals', shortName: 'Cardinals', league: 'NL', division: 'CENTRAL', logo: '🐦', city: 'St. Louis' },
  // NL West
  { id: 'AZ', name: 'Arizona Diamondbacks', shortName: 'Diamondbacks', league: 'NL', division: 'WEST', logo: '🐍', city: 'Arizona' },
  { id: 'COL', name: 'Colorado Rockies', shortName: 'Rockies', league: 'NL', division: 'WEST', logo: '🏔️', city: 'Colorado' },
  { id: 'LAD', name: 'Los Angeles Dodgers', shortName: 'Dodgers', league: 'NL', division: 'WEST', logo: '🌴', city: 'Los Angeles' },
  { id: 'SD', name: 'San Diego Padres', shortName: 'Padres', league: 'NL', division: 'WEST', logo: '🤎', city: 'San Diego' },
  { id: 'SF', name: 'San Francisco Giants', shortName: 'Giants', league: 'NL', division: 'WEST', logo: '🌉', city: 'San Francisco' }
];

const SETS = [
  'SERIES_1',
  'SERIES_2',
  'HERITAGE',
  'CHROME',
  'STADIUM_CLUB',
  'ALLEN_GINTER',
  'BOWMAN',
  'UPDATE_SERIES'
];

// All curated 26-man rosters: exactly 13 position players, 5 SP, 8 RP
const ROSTERS_DATA = {
  BAL: [
    // 13 Position Players
    ['Adley Rutschman', 'C', 8.5, 80, 92, 65, 94, '🧢'],
    ['Ryan Mountcastle', '1B', 6.2, 86, 82, 62, 80, '🏰'],
    ['Jackson Holliday', '2B', 2.5, 78, 85, 88, 82, '⚡'],
    ['Jordan Westburg', '3B', 5.2, 84, 84, 80, 86, '💥'],
    ['Gunnar Henderson', 'SS', 11.5, 94, 95, 90, 92, '⭐'],
    ['Colton Cowser', 'LF', 4.8, 85, 80, 82, 90, '🐮'],
    ['Cedric Mullins', 'CF', 14.8, 78, 82, 92, 94, '🦅'],
    ['Anthony Santander', 'RF', 10.4, 95, 84, 64, 82, '🥔'],
    ['Cal Ripken Jr.', 'SS', 95.9, 88, 96, 70, 99, '👑', true, '1996 • ALL-STAR'],
    ['Brooks Robinson', '3B', 78.4, 76, 88, 62, 99, '🧤', true, '1970 • GOLD GLOVE'],
    ['Eddie Murray', '1B', 68.7, 92, 90, 60, 88, '🥇', true, '1983 • 500 HR CLUB'],
    ['Frank Robinson', 'RF', 107.2, 96, 95, 78, 90, '🏆', true, '1966 • TRIPLE CROWN'],
    ['Ken Singleton', 'DH', 41.0, 85, 92, 55, 75, '🎙️', true, '1979 • SWITCH SLUGGER'],
    // 5 SP
    ['Corbin Burnes', 'SP', 18.2, 30, 40, 55, 80, '🎯'],
    ['Grayson Rodriguez', 'SP', 5.6, 25, 35, 50, 75, '🚀'],
    ['Dean Kremer', 'SP', 4.8, 20, 30, 50, 75, '⚾'],
    ['Kyle Bradish', 'SP', 8.4, 20, 30, 50, 78, '🔥'],
    ['Jim Palmer', 'SP', 68.5, 25, 45, 55, 90, '🏛️', true, '1975 • 3X CY YOUNG'],
    // 8 RP
    ['Félix Bautista', 'RP', 6.8, 20, 20, 40, 75, '🏔️'],
    ['Yennier Cano', 'RP', 4.2, 20, 25, 45, 82, '🌀'],
    ['Cionel Pérez', 'RP', 3.5, 20, 20, 50, 75, '⚡'],
    ['Danny Coulombe', 'RP', 3.8, 20, 20, 45, 78, '🪄'],
    ['Seranthony Domínguez', 'RP', 3.6, 20, 20, 50, 72, '🔥'],
    ['Keegan Akin', 'RP', 3.2, 20, 20, 45, 76, '🦅'],
    ['Gregory Soto', 'RP', 3.8, 20, 20, 50, 74, '💨'],
    ['Bryan Baker', 'RP', 2.5, 20, 20, 45, 72, '🛡️']
  ],
  NYY: [
    // 13 Position Players
    ['Austin Wells', 'C', 3.6, 80, 82, 65, 85, '🧢'],
    ['Anthony Rizzo', '1B', 34.2, 82, 80, 55, 94, '🏆'],
    ['Gleyber Torres', '2B', 14.8, 80, 84, 70, 80, '⚡'],
    ['Jazz Chisholm Jr.', '3B', 10.5, 88, 82, 92, 84, '🎷'],
    ['Anthony Volpe', 'SS', 6.8, 78, 80, 90, 95, '🧤'],
    ['Alex Verdugo', 'LF', 11.2, 76, 82, 72, 90, '🎯'],
    ['Aaron Judge', 'CF', 53.1, 99, 96, 75, 92, '⚖️'],
    ['Juan Soto', 'RF', 36.4, 96, 98, 70, 84, '👑'],
    ['Giancarlo Stanton', 'DH', 44.5, 99, 78, 50, 70, '💣'],
    ['Babe Ruth', 'DH', 162.2, 99, 99, 65, 82, '👑', true, '1927 • MURDERERS ROW'],
    ['Jose Trevino', 'C', 6.4, 68, 76, 50, 98, '🛡️'],
    ['Oswaldo Cabrera', '3B', 2.8, 74, 78, 80, 85, '🔄'],
    ['Trent Grisham', 'CF', 11.0, 80, 75, 82, 94, '🦅'],
    // 5 SP
    ['Gerrit Cole', 'SP', 42.5, 25, 40, 50, 82, '🔥'],
    ['Carlos Rodón', 'SP', 19.8, 20, 30, 45, 75, '⚡'],
    ['Marcus Stroman', 'SP', 22.4, 20, 35, 55, 92, '🌀'],
    ['Nestor Cortes', 'SP', 10.8, 20, 30, 45, 78, '🥸'],
    ['Clarke Schmidt', 'SP', 6.2, 20, 30, 50, 75, '🎯'],
    // 8 RP
    ['Mariano Rivera', 'RP', 56.3, 20, 35, 50, 92, '🚪', true, '1999 • ENTER SANDMAN'],
    ['Luke Weaver', 'RP', 4.8, 20, 25, 50, 78, '❄️'],
    ['Clay Holmes', 'RP', 7.2, 20, 20, 45, 76, '⚓'],
    ['Tommy Kahnle', 'RP', 6.4, 20, 20, 45, 72, '💨'],
    ['Ian Hamilton', 'RP', 3.2, 20, 20, 45, 75, '🪄'],
    ['Tim Hill', 'RP', 4.5, 20, 20, 40, 78, '🦀'],
    ['Jake Cousins', 'RP', 2.4, 20, 20, 45, 70, '🌪️'],
    ['Luis Gil', 'RP', 4.2, 20, 25, 50, 70, '🚀']
  ],
  LAD: [
    // 13 Position Players
    ['Will Smith', 'C', 19.8, 85, 88, 68, 92, '🧢'],
    ['Freddie Freeman', '1B', 58.2, 92, 96, 65, 95, '🥇'],
    ['Mookie Betts', '2B', 69.8, 89, 94, 91, 97, '🎳'],
    ['Max Muncy', '3B', 20.4, 92, 80, 60, 82, '💥'],
    ['Miguel Rojas', 'SS', 14.2, 70, 84, 75, 96, '🧤'],
    ['Teoscar Hernández', 'LF', 18.5, 94, 82, 80, 82, '🌻'],
    ['Tommy Edman', 'CF', 17.6, 78, 86, 92, 96, '⚡'],
    ['Andy Pages', 'RF', 2.8, 85, 78, 78, 84, '🚀'],
    ['Shohei Ohtani', 'DH', 39.5, 99, 95, 96, 85, '🦄'],
    ['Jackie Robinson', '2B', 61.8, 84, 96, 98, 98, '💎', true, '1947 • TRAILBLAZER'],
    ['Austin Barnes', 'C', 6.2, 68, 74, 55, 90, '🛡️'],
    ['Gavin Lux', '2B', 5.4, 76, 84, 84, 82, '🔋'],
    ['Chris Taylor', 'LF', 16.5, 80, 76, 82, 90, '🏆'],
    // 5 SP
    ['Yoshinobu Yamamoto', 'SP', 4.8, 25, 35, 50, 85, '🇯🇵'],
    ['Tyler Glasnow', 'SP', 12.4, 20, 30, 55, 75, '🦒'],
    ['Clayton Kershaw', 'SP', 79.8, 25, 40, 45, 92, '👑', true, '2014 • 3X CY YOUNG MVP'],
    ['Jack Flaherty', 'SP', 14.2, 20, 30, 50, 78, '🔥'],
    ['Sandy Koufax', 'SP', 48.9, 25, 45, 50, 95, '⚡', true, '1965 • THE LEFT ARM OF GOD'],
    // 8 RP
    ['Evan Phillips', 'RP', 6.5, 20, 20, 45, 80, '🔒'],
    ['Blake Treinen', 'RP', 12.8, 20, 20, 45, 82, '🎳'],
    ['Michael Kopech', 'RP', 5.2, 20, 20, 55, 72, '🚀'],
    ['Alex Vesia', 'RP', 4.8, 20, 20, 50, 78, '🔥'],
    ['Daniel Hudson', 'RP', 11.2, 20, 20, 45, 75, '🛡️'],
    ['Anthony Banda', 'RP', 3.1, 20, 20, 45, 70, '⚡'],
    ['Edgardo Henriquez', 'RP', 1.5, 20, 20, 50, 70, '☄️'],
    ['Walker Buehler', 'RP', 13.8, 20, 30, 50, 80, '🐶']
  ],
  BOS: [
    // 13 Position Players
    ['Connor Wong', 'C', 3.2, 78, 82, 70, 85, '🧢'],
    ['Triston Casas', '1B', 4.5, 88, 80, 55, 82, '🏠'],
    ['Enmanuel Valdez', '2B', 1.8, 76, 78, 70, 78, '⚡'],
    ['Rafael Devers', '3B', 38.2, 95, 94, 65, 85, '🍦'],
    ['Trevor Story', 'SS', 28.5, 85, 82, 88, 92, '📖'],
    ['Tyler O\'Neill', 'LF', 16.8, 92, 80, 85, 94, '💪'],
    ['Jarren Duran', 'CF', 8.7, 85, 92, 98, 92, '🚀'],
    ['Wilyer Abreu', 'RF', 4.1, 84, 82, 75, 90, '🎯'],
    ['Masataka Yoshida', 'DH', 3.8, 82, 90, 60, 70, '🍣'],
    ['Ted Williams', 'LF', 122.1, 99, 99, 70, 85, '👑', true, '1941 • .406 HITTER'],
    ['Danny Jansen', 'C', 10.2, 80, 78, 55, 88, '🛡️'],
    ['Ceddanne Rafaela', 'CF', 3.2, 78, 80, 95, 98, '⚡'],
    ['Rob Refsnyder', 'RF', 5.4, 78, 84, 75, 82, '🧢'],
    // 5 SP
    ['Tanner Houck', 'SP', 8.2, 25, 35, 50, 80, '🎯'],
    ['Brayan Bello', 'SP', 5.8, 20, 30, 55, 78, '🚀'],
    ['Kutter Crawford', 'SP', 4.8, 20, 30, 50, 78, '⚾'],
    ['Nick Pivetta', 'SP', 8.5, 20, 30, 50, 75, '🔥'],
    ['Lucas Giolito', 'SP', 15.2, 25, 35, 45, 80, '🧠'],
    // 8 RP
    ['Kenley Jansen', 'RP', 24.5, 20, 30, 45, 82, '🚪'],
    ['Chris Martin', 'RP', 8.5, 20, 25, 45, 85, '🎯'],
    ['Justin Slaten', 'RP', 2.5, 20, 25, 50, 78, '⚡'],
    ['Brennan Bernardino', 'RP', 3.2, 20, 25, 45, 75, '🪄'],
    ['Zack Kelly', 'RP', 2.1, 20, 25, 45, 72, '🔥'],
    ['Greg Weissert', 'RP', 2.4, 20, 25, 45, 75, '🌀'],
    ['Cam Booser', 'RP', 1.8, 20, 25, 45, 70, '☄️'],
    ['Cooper Criswell', 'RP', 2.8, 20, 25, 45, 75, '🛡️']
  ],
  PHI: [
    // 13 Position Players
    ['J.T. Realmuto', 'C', 35.8, 84, 88, 82, 96, '🧢'],
    ['Bryce Harper', '1B', 50.4, 96, 94, 75, 90, '👑'],
    ['Bryson Stott', '2B', 9.5, 78, 86, 88, 94, '⚡'],
    ['Alec Bohm', '3B', 9.8, 86, 90, 65, 84, '💥'],
    ['Trea Turner', 'SS', 38.6, 88, 92, 98, 88, '🏃'],
    ['Brandon Marsh', 'LF', 9.2, 82, 80, 85, 90, '🧔'],
    ['Johan Rojas', 'CF', 3.8, 68, 78, 96, 98, '🦅'],
    ['Nick Castellanos', 'RF', 16.5, 90, 82, 60, 75, '⚾'],
    ['Kyle Schwarber', 'DH', 17.5, 98, 78, 55, 70, '💣'],
    ['Mike Schmidt', '3B', 106.9, 99, 90, 75, 99, '🏆', true, '1980 • 3X MVP'],
    ['Garrett Stubbs', 'C', 2.4, 68, 74, 70, 85, '🛡️'],
    ['Edmundo Sosa', '3B', 6.2, 76, 80, 82, 90, '🧤'],
    ['Austin Hays', 'LF', 8.5, 82, 80, 75, 85, '🎯'],
    // 5 SP
    ['Zack Wheeler', 'SP', 35.2, 25, 40, 50, 88, '🎯'],
    ['Aaron Nola', 'SP', 34.8, 25, 35, 45, 85, '⚾'],
    ['Cristopher Sánchez', 'SP', 6.5, 20, 30, 50, 82, '🌀'],
    ['Ranger Suárez', 'SP', 12.8, 25, 35, 55, 92, '🤠'],
    ['Taijuan Walker', 'SP', 14.5, 20, 25, 45, 75, '🛡️'],
    // 8 RP
    ['Carlos Estévez', 'RP', 6.8, 20, 20, 50, 78, '🔥'],
    ['Jeff Hoffman', 'RP', 5.4, 20, 25, 50, 82, '⚡'],
    ['Matt Strahm', 'RP', 8.2, 20, 25, 45, 80, '🪄'],
    ['Orion Kerkering', 'RP', 2.8, 20, 20, 50, 78, '☄️'],
    ['José Alvarado', 'RP', 8.5, 20, 20, 50, 75, '🚀'],
    ['Tanner Banks', 'RP', 2.5, 20, 20, 45, 74, '🛡️'],
    ['José Ruiz', 'RP', 2.2, 20, 20, 45, 72, '🌪️'],
    ['Kolby Allard', 'RP', 1.8, 20, 20, 45, 70, '⚾']
  ],
  ATL: [
    // 13 Position Players
    ['Sean Murphy', 'C', 18.5, 85, 82, 60, 96, '🧢'],
    ['Matt Olson', '1B', 28.5, 96, 84, 55, 95, '🏰'],
    ['Ozzie Albies', '2B', 22.4, 86, 86, 85, 90, '⚡'],
    ['Austin Riley', '3B', 22.8, 94, 88, 65, 88, '💥'],
    ['Orlando Arcia', 'SS', 9.5, 78, 78, 75, 92, '🧤'],
    ['Jarred Kelenic', 'LF', 4.5, 82, 78, 84, 85, '🎯'],
    ['Michael Harris II', 'CF', 12.8, 85, 88, 94, 98, '🦅'],
    ['Ronald Acuña Jr.', 'RF', 28.5, 98, 96, 98, 92, '👑'],
    ['Marcell Ozuna', 'DH', 26.5, 96, 88, 50, 70, '🐻'],
    ['Chipper Jones', '3B', 85.3, 94, 96, 75, 88, '🏆', true, '1999 • MVP SWITCH HITTER'],
    ['Travis d\'Arnaud', 'C', 17.5, 82, 82, 50, 88, '🛡️'],
    ['Whit Merrifield', '2B', 19.8, 74, 84, 88, 88, '🏃'],
    ['Ramón Laureano', 'RF', 12.5, 84, 80, 82, 92, '🚀'],
    // 5 SP
    ['Chris Sale', 'SP', 53.2, 25, 45, 45, 85, '⚡'],
    ['Reynaldo López', 'SP', 11.5, 20, 35, 50, 80, '🔥'],
    ['Max Fried', 'SP', 26.8, 25, 40, 55, 96, '🎯'],
    ['Spencer Schwellenbach', 'SP', 3.8, 20, 30, 50, 78, '🚀'],
    ['Spencer Strider', 'SP', 12.5, 20, 30, 55, 75, '💪'],
    // 8 RP
    ['Raisel Iglesias', 'RP', 18.5, 20, 20, 50, 82, '🔒'],
    ['Joe Jiménez', 'RP', 6.8, 20, 20, 45, 78, '🔥'],
    ['Pierce Johnson', 'RP', 5.2, 20, 20, 50, 75, '🌪️'],
    ['Dylan Lee', 'RP', 4.1, 20, 20, 45, 76, '🪄'],
    ['Aaron Bummer', 'RP', 5.8, 20, 20, 45, 75, '🦀'],
    ['Jesse Chavez', 'RP', 8.5, 20, 20, 40, 78, '👴'],
    ['Daysbel Hernández', 'RP', 1.8, 20, 20, 50, 70, '☄️'],
    ['Charlie Morton', 'RP', 24.5, 20, 30, 45, 78, '🌀']
  ],
  HOU: [
    // 13 Position Players
    ['Yainer Diaz', 'C', 5.8, 85, 88, 60, 82, '🧢'],
    ['Jon Singleton', '1B', 2.5, 82, 76, 50, 78, '💪'],
    ['Jose Altuve', '2B', 54.2, 88, 95, 85, 90, '⚡'],
    ['Alex Bregman', '3B', 39.5, 88, 90, 70, 94, '💥'],
    ['Jeremy Peña', 'SS', 11.8, 80, 84, 88, 95, '🧤'],
    ['Jason Heyward', 'LF', 41.5, 78, 80, 75, 96, '🛡️'],
    ['Jake Meyers', 'CF', 7.5, 74, 78, 90, 98, '🦅'],
    ['Kyle Tucker', 'RF', 26.8, 94, 92, 88, 92, '👑'],
    ['Yordan Alvarez', 'DH', 24.5, 99, 96, 60, 70, '🦖'],
    ['Craig Biggio', '2B', 65.5, 82, 94, 92, 92, '🏆', true, '1997 • 3000 HITS'],
    ['Victor Caratini', 'C', 6.8, 76, 80, 50, 85, '🛡️'],
    ['Mauricio Dubón', 'CF', 8.5, 75, 82, 84, 95, '🔄'],
    ['Chas McCormick', 'LF', 9.2, 82, 80, 80, 88, '⚡'],
    // 5 SP
    ['Framber Valdez', 'SP', 19.5, 25, 35, 45, 82, '🌀'],
    ['Hunter Brown', 'SP', 6.8, 20, 30, 50, 78, '🚀'],
    ['Ronel Blanco', 'SP', 5.2, 20, 30, 50, 78, '🔥'],
    ['Spencer Arrighetti', 'SP', 3.2, 20, 30, 50, 75, '🎯'],
    ['Justin Verlander', 'SP', 82.5, 25, 45, 45, 90, '🏛️', true, '2019 • 3X CY YOUNG'],
    // 8 RP
    ['Josh Hader', 'RP', 18.5, 20, 20, 50, 85, '🦁'],
    ['Ryan Pressly', 'RP', 14.2, 20, 20, 45, 80, '🔒'],
    ['Bryan Abreu', 'RP', 6.8, 20, 20, 50, 80, '🌪️'],
    ['Tayler Scott', 'RP', 2.8, 20, 20, 45, 75, '🪄'],
    ['Shawn Dubin', 'RP', 1.8, 20, 20, 50, 72, '⚡'],
    ['Caleb Ferguson', 'RP', 4.5, 20, 20, 45, 74, '🛡️'],
    ['Seth Martinez', 'RP', 2.4, 20, 20, 45, 72, '☄️'],
    ['Kaleb Ort', 'RP', 1.5, 20, 20, 50, 70, '🔥']
  ]
};

// Base 26-man roster template with exactly 13 position players, 5 SP, 8 RP
function createBaseSlots() {
  return [
    // 13 Position Players (0 - 12)
    { pos: 'C', label: 'Starting Catcher' },
    { pos: '1B', label: 'Starting 1st Base' },
    { pos: '2B', label: 'Starting 2nd Base' },
    { pos: '3B', label: 'Starting 3rd Base' },
    { pos: 'SS', label: 'Starting Shortstop' },
    { pos: 'LF', label: 'Starting Left Field' },
    { pos: 'CF', label: 'Starting Center Field' },
    { pos: 'RF', label: 'Starting Right Field' },
    { pos: 'DH', label: 'Designated Hitter' },
    { pos: 'C', label: 'Backup Catcher' },
    { pos: '2B', label: 'Bench Infielder' },
    { pos: 'LF', label: 'Fourth Outfielder' },
    { pos: 'DH', label: 'Super Utility' },
    // 5 Starting Pitchers (13 - 17)
    { pos: 'SP', label: 'Ace Starting Pitcher' },
    { pos: 'SP', label: 'No. 2 Starting Pitcher' },
    { pos: 'SP', label: 'No. 3 Starting Pitcher' },
    { pos: 'SP', label: 'No. 4 Starting Pitcher' },
    { pos: 'SP', label: 'No. 5 Starting Pitcher' },
    // 8 Relievers (18 - 25)
    { pos: 'RP', label: 'Closer' },
    { pos: 'RP', label: 'Setup Reliever' },
    { pos: 'RP', label: 'High Leverage RP' },
    { pos: 'RP', label: 'Middle Reliever 1' },
    { pos: 'RP', label: 'Middle Reliever 2' },
    { pos: 'RP', label: 'Left-Handed Specialist' },
    { pos: 'RP', label: 'Right-Handed Specialist' },
    { pos: 'RP', label: 'Long Reliever' }
  ];
}

// Franchise marquee stars for generated teams
const FRANCHISE_LEGENDS_OR_STARS = {
  KC: ['Bobby Witt Jr.', 'SS', 10.4, 92, 96, 99, 94, '👑'],
  DET: ['Tarik Skubal', 'SP', 14.5, 25, 45, 50, 85, '🐅'],
  CLE: ['José Ramírez', '3B', 51.5, 92, 94, 90, 92, '🛡️'],
  MIN: ['Carlos Correa', 'SS', 45.2, 88, 90, 75, 95, '👬'],
  CWS: ['Luis Robert Jr.', 'CF', 14.5, 90, 84, 92, 94, '🧦'],
  SEA: ['Julio Rodríguez', 'CF', 16.5, 92, 90, 96, 95, '🧭'],
  TEX: ['Corey Seager', 'SS', 34.5, 95, 96, 70, 90, '🤠'],
  LAA: ['Mike Trout', 'CF', 86.2, 98, 98, 88, 95, '😇', true, '3X MVP IMMORTAL'],
  OAK: ['Brent Rooker', 'DH', 6.8, 94, 84, 60, 70, '🐘'],
  TB: ['Yandy Díaz', '1B', 15.2, 85, 92, 60, 82, '☀️'],
  TOR: ['Vladimir Guerrero Jr.', '1B', 22.4, 96, 94, 65, 88, '🍁'],
  MIA: ['Jake Burger', 'DH', 6.2, 92, 78, 55, 75, '🐟'],
  NYM: ['Francisco Lindor', 'SS', 49.5, 90, 92, 90, 98, '🍎'],
  WSH: ['CJ Abrams', 'SS', 5.5, 82, 85, 96, 85, '🏛️'],
  CHC: ['Cody Bellinger', 'CF', 24.5, 88, 86, 85, 92, '🐻'],
  CIN: ['Elly De La Cruz', 'SS', 8.2, 92, 86, 99, 90, '🔴'],
  MIL: ['Christian Yelich', 'DH', 41.5, 88, 92, 88, 85, '🍺'],
  PIT: ['Paul Skenes', 'SP', 6.5, 20, 30, 50, 80, '🏴‍☠️'],
  STL: ['Nolan Arenado', '3B', 56.5, 88, 90, 60, 99, '🐦'],
  AZ: ['Corbin Carroll', 'CF', 11.2, 86, 88, 98, 92, '🐍'],
  COL: ['Ezequiel Tovar', 'SS', 6.8, 84, 82, 85, 96, '🏔️'],
  SD: ['Fernando Tatis Jr.', 'RF', 22.5, 95, 90, 94, 98, '🤎'],
  SF: ['Matt Chapman', '3B', 38.5, 88, 84, 75, 99, '🌉']
};

function generateFullDataset() {
  const allCards = [];
  let cardCount = 1;

  for (const team of MLB_TEAMS) {
    const definedRoster = ROSTERS_DATA[team.id];

    if (definedRoster && definedRoster.length === 26) {
      definedRoster.forEach((p, idx) => {
        const isPitcher = p[1] === 'SP' || p[1] === 'RP';
        const setId = SETS[(cardCount + idx) % SETS.length];
        allCards.push({
          id: `${team.id}_${String(idx + 1).padStart(2, '0')}`,
          cardNo: (cardCount % 99) + 1,
          cardSetId: setId,
          name: p[0],
          team: team.name,
          position: p[1],
          bRefWar: p[2],
          isHistorical: !!p[8],
          era: p[9] || (p[8] ? 'HISTORICAL HOF' : '2024 • MLB STAR'),
          stats: {
            contact: p[4],
            power: p[3],
            speed: p[5],
            fielding: p[6],
            control: isPitcher ? 85 : undefined,
            stuff: isPitcher ? 88 : undefined
          },
          refractorTier: p[2] >= 50 ? 'SUPERFRACTOR_1_OF_1' : idx === 0 ? 'RAINBOW' : 'BASE',
          serialStamp: p[2] >= 50 ? '1/1' : undefined,
          signatureSkill: idx === 0 || p[0].includes('Ripken') ? 'BALTIMORE_CHOP' : undefined,
          bio: `${p[0]} is a cornerstone ${p[1]} for the ${team.name}.`,
          avatarIcon: p[7] || team.logo
        });
        cardCount++;
      });
    } else {
      // Build 26-man roster using freshly allocated slot objects
      const slots = createBaseSlots();
      const star = FRANCHISE_LEGENDS_OR_STARS[team.id];

      // If star is a pitcher (SP/RP), put star at slot 13 (SP1) or 18 (RP1)
      // If star is a position player, replace the matching position slot (or slot 0)
      let starSlotIdx = 0;
      if (star) {
        if (star[1] === 'SP') {
          starSlotIdx = 13; // Ace SP slot
        } else if (star[1] === 'RP') {
          starSlotIdx = 18; // Closer slot
        } else {
          // Find matching position slot in 0-12
          const matchIdx = slots.slice(0, 13).findIndex(s => s.pos === star[1]);
          starSlotIdx = matchIdx !== -1 ? matchIdx : 0;
        }
      }

      slots.forEach((slot, idx) => {
        const isPitcher = slot.pos === 'SP' || slot.pos === 'RP';
        const setId = SETS[(cardCount + idx) % SETS.length];
        
        let pName, pPos, pWar, pPwr, pCon, pSpd, pFld, pIcon, isLeg = false, pEra;

        if (star && idx === starSlotIdx) {
          pName = star[0];
          pPos = star[1];
          pWar = star[2];
          pPwr = star[3];
          pCon = star[4];
          pSpd = star[5];
          pFld = star[6];
          pIcon = star[7];
          isLeg = !!star[8];
          pEra = star[9];
        } else {
          pName = `${team.city} ${slot.label}`;
          pPos = slot.pos;
          pWar = isPitcher ? 3.4 : 2.8;
          pPwr = isPitcher ? 20 : 76 + (idx % 12);
          pCon = isPitcher ? 20 : 78 + (idx % 14);
          pSpd = 72 + (idx % 15);
          pFld = 82 + (idx % 10);
          pIcon = team.logo;
          pEra = '2024 • MLB ROSTER';
        }

        allCards.push({
          id: `${team.id}_${String(idx + 1).padStart(2, '0')}`,
          cardNo: (cardCount % 99) + 1,
          cardSetId: setId,
          name: pName,
          team: team.name,
          position: pPos,
          bRefWar: pWar,
          isHistorical: isLeg,
          era: pEra || '2024 • MLB ROSTER',
          stats: {
            contact: pCon,
            power: pPwr,
            speed: pSpd,
            fielding: pFld,
            control: isPitcher ? 82 : undefined,
            stuff: isPitcher ? 85 : undefined
          },
          refractorTier: pWar >= 50 ? 'SUPERFRACTOR_1_OF_1' : idx === 0 ? 'RAINBOW' : 'BASE',
          serialStamp: pWar >= 50 ? '1/1' : undefined,
          bio: `${pName} represents the ${team.name} as an active ${pPos}.`,
          avatarIcon: pIcon
        });
        cardCount++;
      });
    }
  }

  return allCards;
}

const allCards = generateFullDataset();
console.log(`Successfully generated ${allCards.length} players across ${MLB_TEAMS.length} teams.`);
console.log(`Cards per team: ${allCards.length / MLB_TEAMS.length}`);

// Output to src/data/allMlbPlayers.ts
const tsHeader = `import { PlayerCard } from '../types/game';\n\nexport const ALL_PLAYERS: PlayerCard[] = `;
fs.writeFileSync(
  path.join(__dirname, '../src/data/allMlbPlayers.ts'),
  tsHeader + JSON.stringify(allCards, null, 2) + ';\n',
  'utf-8'
);
console.log('Written to src/data/allMlbPlayers.ts!');
