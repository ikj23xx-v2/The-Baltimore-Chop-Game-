import * as fs from 'fs';
import * as path from 'path';

interface RawPlayer {
  name: string;
  pos: string;
  war: number;
  isLegend?: boolean;
  era?: string;
  pwr?: number;
  con?: number;
  spd?: number;
  fld?: number;
  bio?: string;
  icon?: string;
}

interface TeamRosterDef {
  teamName: string;
  code: string;
  starters: RawPlayer[];
  bench: RawPlayer[];
  pitchers: RawPlayer[];
}

const SET_IDS = [
  'SERIES_1',
  'SERIES_2',
  'HERITAGE',
  'CHROME',
  'STADIUM_CLUB',
  'ALLEN_GINTER',
  'BOWMAN',
  'UPDATE_SERIES'
];

const TEAMS_DATA: TeamRosterDef[] = [
  {
    teamName: 'Baltimore Orioles',
    code: 'BAL',
    starters: [
      { name: 'Adley Rutschman', pos: 'C', war: 8.5, era: '2024 • ALL-STAR', con: 92, pwr: 80, spd: 65, fld: 94, icon: '🧢', bio: 'Franchise cornerstone catcher with switch-hitting power and elite game calling.' },
      { name: 'Ryan Mountcastle', pos: '1B', war: 6.2, era: '2024 • SLUGGER', con: 82, pwr: 86, spd: 62, fld: 80, icon: '🏰', bio: 'Powerhouse first baseman with opposite-field thunder and Gold Glove defense.' },
      { name: 'Jackson Holliday', pos: '2B', war: 2.5, era: '2024 • 1ST BOWMAN', con: 85, pwr: 78, spd: 88, fld: 82, icon: '⚡', bio: 'MLB No. 1 overall prospect with pure line-drive stroke and blazing speed.' },
      { name: 'Jordan Westburg', pos: '3B', war: 5.2, era: '2024 • ALL-STAR', con: 84, pwr: 84, spd: 80, fld: 86, icon: '💥', bio: 'Aggressive gap-to-gap run producer and defensive rock on the hot corner.' },
      { name: 'Gunnar Henderson', pos: 'SS', war: 11.5, era: '2024 • MVP SILVER SLUGGER', con: 95, pwr: 94, spd: 90, fld: 92, icon: '⭐', bio: 'Superstar five-tool shortstop: 37 HRs, lethal arm, and small-ball Baltimore Chop mastery.' },
      { name: 'Colton Cowser', pos: 'LF', war: 4.8, era: '2024 • ROOKIE ACE', con: 80, pwr: 85, spd: 82, fld: 90, icon: '🐮', bio: 'Electric rookie outfielder with clutch power and defensive range.' },
      { name: 'Cedric Mullins', pos: 'CF', war: 14.8, era: '2024 • SPEED DEMON', con: 82, pwr: 78, spd: 92, fld: 94, icon: '🦅', bio: 'Camden Yards centerfield stalwart with 30/30 pedigree and highlight-reel catches.' },
      { name: 'Anthony Santander', pos: 'RF', war: 10.4, era: '2024 • 44 HR ALL-STAR', con: 84, pwr: 95, spd: 64, fld: 82, icon: '🥔', bio: 'Switch-hitting power dynamo who slugged 44 home runs into Camden stands.' },
      { name: 'Cal Ripken Jr.', pos: 'SS', war: 95.9, isLegend: true, era: '1996 • ALL-STAR', con: 96, pwr: 88, spd: 70, fld: 99, icon: '👑', bio: 'The Iron Man: 2,632 consecutive games, 3,184 hits, and legendary Baltimore Chop master.' }
    ],
    bench: [
      { name: 'Brooks Robinson', pos: '3B', war: 78.4, isLegend: true, era: '1970 • GOLD GLOVE', con: 88, pwr: 76, spd: 62, fld: 99, icon: '🧤', bio: 'The Human Vacuum Cleaner: 16 consecutive Gold Gloves and World Series MVP.' },
      { name: 'Eddie Murray', pos: '1B', war: 68.7, isLegend: true, era: '1983 • 500 HR CLUB', con: 90, pwr: 92, spd: 60, fld: 88, icon: '🥇', bio: 'Steady Eddie: 3,255 hits, 504 home runs, and ultimate clutch postseason switch-hitter.' },
      { name: 'Frank Robinson', pos: 'RF', war: 107.2, isLegend: true, era: '1966 • TRIPLE CROWN', con: 95, pwr: 96, spd: 78, fld: 90, icon: '🏆', bio: 'Historic MVP in both leagues, 1966 Triple Crown winner, and fierce leader.' },
      { name: 'Boog Powell', pos: '1B', war: 39.1, isLegend: true, era: '1970 • AL MVP', con: 85, pwr: 94, spd: 50, fld: 75, icon: '🍖', bio: 'Legendary slugging first baseman and 1970 AL MVP beloved at Eutaw Street.' }
    ],
    pitchers: [
      { name: 'Corbin Burnes', pos: 'SP', war: 18.2, era: '2024 • CY YOUNG ACE', con: 40, pwr: 30, spd: 55, fld: 80, icon: '🎯', bio: 'Master of the 97 MPH cut fastball with unhittable spin and swing-and-miss stuff.' },
      { name: 'Grayson Rodriguez', pos: 'SP', war: 5.6, era: '2024 • FLAMETHROWER', con: 35, pwr: 25, spd: 50, fld: 75, icon: '🚀', bio: 'Triple-digit fastball and wicked changeup that overpowers opposing sluggers.' },
      { name: 'Dean Kremer', pos: 'SP', war: 4.8, era: '2024 • ROTATION ACE', con: 30, pwr: 20, spd: 50, fld: 75, icon: '⚾', bio: 'Crafty right-hander with sweeping cutter and high-spin curveball.' },
      { name: 'Kyle Bradish', pos: 'SP', war: 8.4, era: '2024 • CY CONTENDER', con: 30, pwr: 20, spd: 50, fld: 78, icon: '🔥', bio: 'Nasty slider and turbo sinker with elite chase rates across MLB.' },
      { name: 'Jim Palmer', pos: 'SP', war: 68.5, isLegend: true, era: '1975 • 3X CY YOUNG', con: 45, pwr: 25, spd: 55, fld: 90, icon: '🏛️', bio: 'Three-time Cy Young Award winner with 268 wins and zero grand slams allowed.' },
      { name: 'Mike Mussina', pos: 'SP', war: 82.8, isLegend: true, era: '1996 • KNUCKLE-CURVE', con: 40, pwr: 25, spd: 50, fld: 95, icon: '🧠', bio: 'Hall of Fame cerebral tactician with devastating knuckle-curve and 270 wins.' },
      { name: 'Albert Suárez', pos: 'SP', war: 3.2, era: '2024 • ROTATION HERO', con: 25, pwr: 20, spd: 45, fld: 70, icon: '🛡️', bio: 'Resilient veteran starter who stabilized the rotation with pinpoint command.' },
      { name: 'Félix Bautista', pos: 'RP', war: 6.8, era: '2024 • THE MOUNTAIN', con: 20, pwr: 20, spd: 40, fld: 75, icon: '🏔️', bio: '103 MPH fastball and 90 MPH splitter: MLB most terrifying closer.' },
      { name: 'Yennier Cano', pos: 'RP', war: 4.2, era: '2024 • SINKER DEMON', con: 25, pwr: 20, spd: 45, fld: 82, icon: '🌀', bio: 'Turbo heavy sinker generating endless ground balls and clutch double plays.' },
      { name: 'Cionel Pérez', pos: 'RP', war: 3.5, era: '2024 • LEFTY BULLET', con: 20, pwr: 20, spd: 50, fld: 75, icon: '⚡', bio: 'High-leverage southpaw with 98 MPH heat and sharp slider.' },
      { name: 'Danny Coulombe', pos: 'RP', war: 3.8, era: '2024 • SWEEPER MASTER', con: 20, pwr: 20, spd: 45, fld: 78, icon: '🪄', bio: 'Deceptive lefty with devastating sweeping slider and strikeout punch.' },
      { name: 'Seranthony Domínguez', pos: 'RP', war: 3.6, era: '2024 • FIREBALLER', con: 20, pwr: 20, spd: 50, fld: 72, icon: '🔥', bio: 'High-octane trade acquisition bringing late-inning power heat.' },
      { name: 'Ken Singleton', pos: 'DH', war: 41.0, isLegend: true, era: '1979 • SWITCH SLUGGER', con: 92, pwr: 85, spd: 55, fld: 75, icon: '🎙️', bio: 'Switch-hitting on-base wizard with 2,029 hits and legendary Orioles broadcaster.' }
    ]
  },
  {
    teamName: 'New York Yankees',
    code: 'NYY',
    starters: [
      { name: 'Austin Wells', pos: 'C', war: 3.6, era: '2024 • ROOKIE STAR', con: 82, pwr: 80, spd: 65, fld: 85, icon: '🧢', bio: 'Left-handed power-hitting catcher with exceptional pitch framing.' },
      { name: 'Anthony Rizzo', pos: '1B', war: 34.2, era: '2024 • GOLD GLOVE', con: 80, pwr: 82, spd: 55, fld: 94, icon: '🏆', bio: 'Veteran champion with sweet swing and elite scoop ability at first base.' },
      { name: 'Gleyber Torres', pos: '2B', war: 14.8, era: '2024 • LEADOFF ANCHOR', con: 84, pwr: 80, spd: 70, fld: 80, icon: '⚡', bio: 'Disciplined leadoff presence with postseason clutch hitting history.' },
      { name: 'Jazz Chisholm Jr.', pos: '3B', war: 10.5, era: '2024 • FLASH & POWER', con: 82, pwr: 88, spd: 92, fld: 84, icon: '🎷', bio: 'Electric speed and pop who revitalized the Bronx with dynamic flair.' },
      { name: 'Anthony Volpe', pos: 'SS', war: 6.8, era: '2024 • GOLD GLOVE SS', con: 80, pwr: 78, spd: 90, fld: 95, icon: '🧤', bio: 'Hometown kid: Gold Glove shortstop with elite base-stealing instincts.' },
      { name: 'Alex Verdugo', pos: 'LF', war: 11.2, era: '2024 • LASER ARM', con: 82, pwr: 76, spd: 72, fld: 90, icon: '🎯', bio: 'Gritty contact hitter with rocket outfield arm and postseason defense.' },
      { name: 'Aaron Judge', pos: 'CF', war: 53.1, era: '2024 • 58 HR MVP', con: 96, pwr: 99, spd: 75, fld: 92, icon: '⚖️', bio: 'Colossal captain: 58 home runs, 144 RBIs, and unmatched light-tower power.' },
      { name: 'Juan Soto', pos: 'RF', war: 36.4, era: '2024 • GENERATIONAL BAT', con: 98, pwr: 96, spd: 70, fld: 84, icon: '👑', bio: 'Generational plate discipline, the Soto Shuffle, and 41 home runs.' },
      { name: 'Giancarlo Stanton', pos: 'DH', war: 44.5, era: '2024 • ALCS MVP', con: 78, pwr: 99, spd: 50, fld: 70, icon: '💣', bio: 'Record exit velocities: crushed mammoth postseason homers into the Bronx night.' }
    ],
    bench: [
      { name: 'Babe Ruth', pos: 'DH', war: 162.2, isLegend: true, era: '1927 • MURDERERS ROW', con: 99, pwr: 99, spd: 65, fld: 82, icon: '👑', bio: 'The Sultan of Swat: 714 HRs, .690 SLG, and baseball immortal icon.' },
      { name: 'Jose Trevino', pos: 'C', war: 6.4, era: '2024 • PLATINUM GLOVE', con: 76, pwr: 68, spd: 50, fld: 98, icon: '🛡️', bio: 'Platinum Glove defensive catcher with textbook game management.' },
      { name: 'Oswaldo Cabrera', pos: 'UTIL', war: 2.8, era: '2024 • SUPER UTILITY', con: 78, pwr: 74, spd: 80, fld: 85, icon: '🔄', bio: 'Switch-hitting fan favorite capable of playing every position on the diamond.' },
      { name: 'Trent Grisham', pos: 'OF', war: 11.0, era: '2024 • GOLD GLOVE OF', con: 75, pwr: 80, spd: 82, fld: 94, icon: '🦅', bio: 'Two-time Gold Glove outfielder with power and defensive range.' }
    ],
    pitchers: [
      { name: 'Gerrit Cole', pos: 'SP', war: 42.5, era: '2024 • CY YOUNG ACE', con: 40, pwr: 25, spd: 50, fld: 82, icon: '🔥', bio: 'Reigning Cy Young ace with 99 MPH fastball and biting slider.' },
      { name: 'Carlos Rodón', pos: 'SP', war: 19.8, era: '2024 • SOUTHPAW ACE', con: 30, pwr: 20, spd: 45, fld: 75, icon: '⚡', bio: 'Fiery power lefty with 16 wins and dominant swing-and-miss strikeout stuff.' },
      { name: 'Marcus Stroman', pos: 'SP', war: 22.4, era: '2024 • SINKER ACE', con: 35, pwr: 20, spd: 55, fld: 92, icon: '🌀', bio: 'High-energy groundball artist with Gold Glove athleticism.' },
      { name: 'Nestor Cortes', pos: 'SP', war: 10.8, era: '2024 • NASTY NESTOR', con: 30, pwr: 20, spd: 45, fld: 78, icon: '🥸', bio: 'Deceptive southpaw with hesitation deliveries and pinpoint cut fastballs.' },
      { name: 'Clarke Schmidt', pos: 'SP', war: 6.2, era: '2024 • BREAKING BALL ACE', con: 30, pwr: 20, spd: 50, fld: 75, icon: '🎯', bio: 'Elite sweeper and cutter keeping righties completely off balance.' },
      { name: 'Luis Gil', pos: 'SP', war: 4.2, era: '2024 • AL ROOKIE OF YEAR', con: 25, pwr: 20, spd: 50, fld: 70, icon: '🚀', bio: 'Electric rookie flamethrower with triple-digit velocity and devastating changeup.' },
      { name: 'Mariano Rivera', pos: 'RP', war: 56.3, isLegend: true, era: '1999 • ENTER SANDMAN', con: 35, pwr: 20, spd: 50, fld: 92, icon: '🚪', bio: 'The Sandman: 652 saves, 0.70 postseason ERA, and unhittable cut fastball.' },
      { name: 'Luke Weaver', pos: 'RP', war: 4.8, era: '2024 • CLUTCH CLOSER', con: 25, pwr: 20, spd: 50, fld: 78, icon: '❄️', bio: 'Ice-water closer who locked down the American League pennant.' },
      { name: 'Clay Holmes', pos: 'RP', war: 7.2, era: '2024 • TURBO SINKER', con: 20, pwr: 20, spd: 45, fld: 76, icon: '⚓', bio: 'Heavy 98 MPH sinker generating endless weak groundball contact.' },
      { name: 'Tommy Kahnle', pos: 'RP', war: 6.4, era: '2024 • CHANGEUP ACE', con: 20, pwr: 20, spd: 45, fld: 72, icon: '💨', bio: '80% changeup usage with devastating fade and strikeout mastery.' },
      { name: 'Ian Hamilton', pos: 'RP', war: 3.2, era: '2024 • SLUMBER ACE', con: 20, pwr: 20, spd: 45, fld: 75, icon: '🪄', bio: 'Devastating "slambio" breaking ball that neutralizes lefties and righties.' },
      { name: 'Tim Hill', pos: 'RP', war: 4.5, era: '2024 • SUBMARINE LEFTY', con: 20, pwr: 20, spd: 40, fld: 78, icon: '🦀', bio: 'Sidearm groundball specialist with pinpoint strike-throwing ability.' },
      { name: 'Jake Cousins', pos: 'RP', war: 2.4, era: '2024 • SWEEPER DEMON', con: 20, pwr: 20, spd: 45, fld: 70, icon: '🌪️', bio: 'Wicked lateral sweep on his slider generating high swing-and-miss rates.' }
    ]
  }
];

export { TEAMS_DATA, SET_IDS };
