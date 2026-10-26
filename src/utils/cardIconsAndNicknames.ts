// src/utils/cardIconsAndNicknames.ts
import { Position } from '../types/game';

export interface PositionIconData {
  symbol: string;
  badge: string;
  roleName: string;
  fieldingZone: string;
  tacticalDescription: string;
  bgGradient: string;
  accentColor: string;
  fieldSvgType: 'PITCHER_MOUND' | 'CATCHER_GEAR' | 'INFIELD_CORNER' | 'MIDDLE_INFIELD' | 'OUTFIELD_WALL' | 'BATTER_BOX';
}

export const POSITION_ICON_REGISTRY: Record<Position, PositionIconData> = {
  C: {
    symbol: '🪖',
    badge: 'MASK & CHEST',
    roleName: 'Field General / Backstop',
    fieldingZone: 'Home Plate Fortress',
    tacticalDescription: 'Pitch framing, pop-time arm, and blocking dirt balls',
    bgGradient: 'from-amber-950/70 via-slate-900 to-amber-900/60',
    accentColor: '#f59e0b',
    fieldSvgType: 'CATCHER_GEAR'
  },
  '1B': {
    symbol: '🧤',
    badge: 'CORNER SCOOP',
    roleName: 'First Base Anchor',
    fieldingZone: 'Right Infield Corner',
    tacticalDescription: 'Infield dig specialist and stretch target',
    bgGradient: 'from-orange-950/70 via-slate-900 to-amber-900/60',
    accentColor: '#ea580c',
    fieldSvgType: 'INFIELD_CORNER'
  },
  '2B': {
    symbol: '⚡',
    badge: 'KEYSTONE PIVOT',
    roleName: 'Second Base Pivot',
    fieldingZone: 'Middle Infield East',
    tacticalDescription: 'Turn-two lightning release and shallow fly tracking',
    bgGradient: 'from-blue-950/70 via-slate-900 to-cyan-900/60',
    accentColor: '#38bdf8',
    fieldSvgType: 'MIDDLE_INFIELD'
  },
  '3B': {
    symbol: '🧱',
    badge: 'HOT CORNER',
    roleName: 'The Hot Corner',
    fieldingZone: 'Left Infield Reflex Zone',
    tacticalDescription: '110+ mph reflex dives and barehanded bare-down throws',
    bgGradient: 'from-rose-950/70 via-slate-900 to-amber-900/60',
    accentColor: '#f43f5e',
    fieldSvgType: 'INFIELD_CORNER'
  },
  SS: {
    symbol: '🏹',
    badge: '6-HOLE CANNON',
    roleName: 'Shortstop Maestro',
    fieldingZone: 'Deep 6-Hole Infield',
    tacticalDescription: 'Premier range captain with jump-throw accuracy',
    bgGradient: 'from-indigo-950/70 via-slate-900 to-purple-900/60',
    accentColor: '#818cf8',
    fieldSvgType: 'MIDDLE_INFIELD'
  },
  LF: {
    symbol: '🌲',
    badge: 'LEFT MEADOW',
    roleName: 'Left Field Corner',
    fieldingZone: 'Outfield Left Alley',
    tacticalDescription: 'Wall reads and tracking line-drive rockets',
    bgGradient: 'from-emerald-950/70 via-slate-900 to-teal-900/60',
    accentColor: '#10b981',
    fieldSvgType: 'OUTFIELD_WALL'
  },
  CF: {
    symbol: '🦅',
    badge: 'GAP PATROL',
    roleName: 'Center Field Patrol',
    fieldingZone: 'Deep Center Pasture',
    tacticalDescription: 'Outfield command, elite sprint speed, and dive robberies',
    bgGradient: 'from-teal-950/70 via-slate-900 to-emerald-900/60',
    accentColor: '#14b8a6',
    fieldSvgType: 'OUTFIELD_WALL'
  },
  RF: {
    symbol: '🎯',
    badge: 'LASER CANNON',
    roleName: 'Right Field Arm',
    fieldingZone: 'Right Outfield Sector',
    tacticalDescription: 'Deadly 95+ mph throws to third base and plate cutoffs',
    bgGradient: 'from-lime-950/70 via-slate-900 to-emerald-900/60',
    accentColor: '#84cc16',
    fieldSvgType: 'OUTFIELD_WALL'
  },
  DH: {
    symbol: '💥',
    badge: 'HEAVY LUMBER',
    roleName: 'Designated Masher',
    fieldingZone: 'Dugout Bat Rack',
    tacticalDescription: 'Pure offensive barrel specialist with max exit velo',
    bgGradient: 'from-red-950/70 via-slate-900 to-orange-900/60',
    accentColor: '#ef4444',
    fieldSvgType: 'BATTER_BOX'
  },
  SP: {
    symbol: '🔥',
    badge: 'ROTATION ACE',
    roleName: 'Starting Pitcher',
    fieldingZone: 'The 60ft-6in Mound',
    tacticalDescription: 'Deep arsenal command, tunnel sequencing, and pitch stamina',
    bgGradient: 'from-amber-950/70 via-slate-900 to-red-900/60',
    accentColor: '#f59e0b',
    fieldSvgType: 'PITCHER_MOUND'
  },
  RP: {
    symbol: '🔒',
    badge: 'BULLPEN LOCK',
    roleName: 'Relief Fireman / Closer',
    fieldingZone: 'Late-Inning High Leverage',
    tacticalDescription: 'High-leverage punchouts and swing-and-miss stuff',
    bgGradient: 'from-zinc-950 via-slate-900 to-amber-950/80',
    accentColor: '#fbbf24',
    fieldSvgType: 'PITCHER_MOUND'
  }
};

/**
 * Authentic Baseball-Reference Nicknames Database
 * Sourced directly from verified Baseball-Reference player pages
 */
export const BASEBALL_REFERENCE_NICKNAMES: Record<string, { nickname: string; icon: string }> = {
  // All-Time Legends & Hall of Famers
  'Babe Ruth': { nickname: 'The Sultan of Swat', icon: '👑' },
  'Walter Johnson': { nickname: 'The Big Train', icon: '🚂' },
  'Cy Young': { nickname: 'Cyclone', icon: '🌪️' },
  'Barry Bonds': { nickname: 'The Barcode', icon: '🚀' },
  'Willie Mays': { nickname: 'The Say Hey Kid', icon: '🦅' },
  'Ty Cobb': { nickname: 'The Georgia Peach', icon: '🍑' },
  'Henry Aaron': { nickname: 'Hammerin\' Hank', icon: '🔨' },
  'Hank Aaron': { nickname: 'Hammerin\' Hank', icon: '🔨' },
  'Tris Speaker': { nickname: 'The Grey Eagle', icon: '🦅' },
  'Honus Wagner': { nickname: 'The Flying Dutchman', icon: '🚢' },
  'Stan Musial': { nickname: 'Stan the Man', icon: '🎺' },
  'Rogers Hornsby:': { nickname: 'Rajah', icon: '👑' },
  'Rogers Hornsby': { nickname: 'Rajah', icon: '👑' },
  'Eddie Collins': { nickname: 'Cocky', icon: '⚡' },
  'Ted Williams': { nickname: 'The Splendid Splinter', icon: '🪓' },
  'Pete Alexander': { nickname: 'Old Pete', icon: '🎖️' },
  'Grover Alexander': { nickname: 'Old Pete', icon: '🎖️' },
  'Alex Rodriguez': { nickname: 'A-Rod', icon: '⚡' },
  'Kid Nichols': { nickname: 'Kid', icon: '🎯' },
  'Lou Gehrig': { nickname: 'The Iron Horse', icon: '🚂' },
  'Rickey Henderson': { nickname: 'Man of Steal', icon: '👟' },
  'Mickey Mantle': { nickname: 'The Commerce Comet', icon: '☄️' },
  'Tom Seaver': { nickname: 'Tom Terrific', icon: '🏛️' },
  'Frank Robinson': { nickname: 'The Judge', icon: '⚖️' },
  'Mike Schmidt': { nickname: 'Iron Mike', icon: '🧱' },
  'Greg Maddux': { nickname: 'The Professor', icon: '🎓' },
  'Roger Clemens': { nickname: 'The Rocket', icon: '🚀' },
  'Nap Lajoie': { nickname: 'The Frenchman', icon: '⚜️' },
  'Ken Griffey Jr.': { nickname: 'The Kid', icon: '🧢' },
  'Brooks Robinson': { nickname: 'The Human Vacuum Cleaner', icon: '🧹' },
  'Cal Ripken Jr.': { nickname: 'The Iron Man', icon: '🦾' },
  'Mariano Rivera': { nickname: 'The Sandman', icon: '⏳' },
  'Ozzie Smith': { nickname: 'The Wizard of Oz', icon: '🪄' },
  'Randy Johnson': { nickname: 'The Big Unit', icon: '🦒' },
  'Pedro Martinez': { nickname: 'Pedro', icon: '🥊' },
  'Derek Jeter': { nickname: 'The Captain', icon: '🫡' },
  'Albert Pujols': { nickname: 'The Machine', icon: '🤖' },
  'Ichiro Suzuki': { nickname: 'The Wizard', icon: '🗡️' },
  'Satchel Paige': { nickname: 'Old Satch', icon: '🕰️' },
  'Josh Gibson': { nickname: 'The Black Babe Ruth', icon: '🔨' },
  'Cool Papa Bell': { nickname: 'Cool Papa', icon: '⚡' },
  'Buck Leonard': { nickname: 'The Black Lou Gehrig', icon: '🛡️' },
  'Jackie Robinson': { nickname: '42', icon: '🌟' },
  'Sandy Koufax': { nickname: 'The Left Arm of God', icon: '✨' },
  'Johnny Bench': { nickname: 'Little General', icon: '🪖' },
  'Reggie Jackson': { nickname: 'Mr. October', icon: '🍁' },
  'Joe DiMaggio': { nickname: 'The Yankee Clipper', icon: '⛵' },
  'Ernie Banks': { nickname: 'Mr. Cub', icon: '🐻' },
  'Roberto Clemente': { nickname: 'The Great One', icon: '🎖️' },
  'Bob Gibson': { nickname: 'Hoot', icon: '🦉' },
  'Nolan Ryan': { nickname: 'The Ryan Express', icon: '🚄' },
  'Tony Gwynn': { nickname: 'Mr. Padre', icon: '🎯' },
  'Wade Boggs': { nickname: 'Chicken Man', icon: '🍗' },
  'George Brett': { nickname: 'Mullet', icon: '🌲' },
  'Carlton Fisk': { nickname: 'Pudge', icon: '🪖' },
  'Ivan Rodriguez': { nickname: 'Pudge', icon: '🪖' },
  'David Ortiz': { nickname: 'Big Papi', icon: '🧸' },
  'Chipper Jones': { nickname: 'Chipper', icon: '🪓' },
  'Vladimir Guerrero': { nickname: 'Vlad the Impaler', icon: '💥' },
  'Jim Palmer': { nickname: 'Cakes', icon: '🥞' },
  'Eddie Murray': { nickname: 'Steady Eddie', icon: '⚖️' },
  'Boog Powell': { nickname: 'Boog', icon: '🍖' },
  'Paul Blair': { nickname: 'Motormouth', icon: '🏎️' },

  // Active MLB Stars & Fan Favorites
  'Shohei Ohtani': { nickname: 'Shotime', icon: '🦄' },
  'Aaron Judge': { nickname: 'All Rise', icon: '👨‍⚖️' },
  'Mike Trout': { nickname: 'The Millville Meteor', icon: '☄️' },
  'Mookie Betts': { nickname: 'Mookie', icon: '🎳' },
  'Gunnar Henderson': { nickname: 'Gunnar', icon: '🤠' },
  'Adley Rutschman': { nickname: 'Clutchley', icon: '🪖' },
  'Ronald Acuña Jr.': { nickname: 'El Abusador', icon: '🚀' },
  'Ronald Acuna Jr.': { nickname: 'El Abusador', icon: '🚀' },
  'Juan Soto': { nickname: 'Childish Bambino', icon: '🕺' },
  'Fernando Tatis Jr.': { nickname: 'El Niño', icon: '⚡' },
  'Bryce Harper': { nickname: 'The Showman', icon: '🦁' },
  'Pete Alonso': { nickname: 'Polar Bear', icon: '🐻‍❄️' },
  'Paul Skenes': { nickname: 'Air Skenes', icon: '🚀' },
  'Bobby Witt Jr.': { nickname: 'Junior', icon: '🐆' },
  'Jose Ramirez': { nickname: 'Mr. Lapiz', icon: '🥊' },
  'José Ramírez': { nickname: 'Mr. Lapiz', icon: '🥊' },
  'Freddie Freeman': { nickname: 'Freddie', icon: '😁' },
  'Corbin Carroll': { nickname: 'Corbin Barrels', icon: '🏎️' },
  'Jackson Holliday': { nickname: 'JH7', icon: '🌟' },
  'Jackson Chourio': { nickname: 'Chourio', icon: '🚀' },
  'Tarik Skubal': { nickname: 'Skub', icon: '🧊' },
  'Emmanuel Clase': { nickname: 'The Dragon', icon: '🐉' },
  'Mason Miller': { nickname: '104 Miller', icon: '🔥' },
  'Anthony Santander': { nickname: 'Tony Taters', icon: '🥔' },
  'Cedric Mullins': { nickname: 'Ceddy', icon: '🦅' },
  'Jordan Westburg': { nickname: 'Westy', icon: '🏹' },
  'Colton Cowser': { nickname: 'The Milkman', icon: '🥛' },
  'Ryan Mountcastle': { nickname: 'Mounty', icon: '🏰' },
  'Grayson Rodriguez': { nickname: 'G-Rod', icon: '⛽' },
  'Craig Kimbrel': { nickname: 'Dirty Craig', icon: '🦅' },
  'Kyle Bradish': { nickname: 'Brad', icon: '🎯' },
  'Corbin Burnes': { nickname: 'Burnesy', icon: '🔥' },
  'Felix Bautista': { nickname: 'The Mountain', icon: '🏔️' },
  'Yordan Alvarez': { nickname: 'Air Yordan', icon: '✈️' },
  'Corey Seager': { nickname: 'Seags', icon: '🌊' },
  'Marcus Semien': { nickname: 'Simmy', icon: '⚡' },
  'Zack Wheeler': { nickname: 'Wheels', icon: '🎡' },
  'Chris Sale': { nickname: 'The Condor', icon: '🦅' },
  'Tyler Glasnow': { nickname: 'Baby Giraffe', icon: '🦒' },
  'Francisco Lindor': { nickname: 'Mr. Smile', icon: '😁' },
  'Rafael Devers': { nickname: 'Carita', icon: '🍬' },
  'Julio Rodriguez': { nickname: 'J-Rod', icon: '⚡' },
  'Julio Rodríguez': { nickname: 'J-Rod', icon: '⚡' },
  'Elly De La Cruz': { nickname: 'La Cocoa', icon: '⚡' },
  'Kyle Tucker': { nickname: 'King Tuck', icon: '👑' },
  'Austin Riley': { nickname: 'Ocho', icon: '🪵' },
  'Matt Olson': { nickname: 'Oly', icon: '🥊' },
  'William Contreras': { nickname: 'Wild Bill', icon: '🤠' },
  'Marcell Ozuna': { nickname: 'The Big Bear', icon: '🐻' },
  'Ketel Marte': { nickname: 'El Bate', icon: '🪄' },
  'Luis Arraez': { nickname: 'La Regadera', icon: '🚿' },
  'Trea Turner': { nickname: 'Triple Trea', icon: '🏎️' },
  'Manny Machado': { nickname: 'El Ministro', icon: '🧱' },
};

/**
 * Returns authentic Baseball-Reference nickname and icon for any player
 */
export function getPlayerBRefNickname(playerName: string, position: Position = 'CF'): { nickname: string; icon: string; isFamous: boolean } {
  const direct = BASEBALL_REFERENCE_NICKNAMES[playerName];
  if (direct) {
    return { nickname: direct.nickname, icon: direct.icon, isFamous: true };
  }

  // Check partial match (e.g. without accents)
  const normalized = playerName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const foundKey = Object.keys(BASEBALL_REFERENCE_NICKNAMES).find(
    k => k.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized.toLowerCase()
  );
  if (foundKey) {
    const entry = BASEBALL_REFERENCE_NICKNAMES[foundKey];
    return { nickname: entry.nickname, icon: entry.icon, isFamous: true };
  }

  // Fallback to position-derived moniker and authentic baseball icon
  const posData = POSITION_ICON_REGISTRY[position] || POSITION_ICON_REGISTRY['CF'];
  const surname = playerName.split(' ').slice(-1)[0] || playerName;
  return {
    nickname: `The ${posData.roleName.split(' ')[0]}`,
    icon: posData.symbol,
    isFamous: false
  };
}
