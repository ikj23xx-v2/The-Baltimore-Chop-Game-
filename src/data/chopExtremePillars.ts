// =========================================================================
// THE FOUR PILLARS OF "CHOP EXTREME"
// Hardcore Sabermetric Mode for Baseball Stat Purists
// =========================================================================

export interface GauntletBossPitcher {
  stage: number;
  name: string;
  eraTeam: string;
  reputation: string;
  arsenal: string[];
  fastballVelo: number; // mph
  spinRateRpm: number;
  verticalBreakInches: number;
  bossQuirk: string;
  statNerdHook: string;
  outsToSurvive: number;
  initialDeficit: number; // e.g. down 4-0 in 7th
  avatarIcon: string;
}

export const GAUNTLET_BOSSES: GauntletBossPitcher[] = [
  {
    stage: 1,
    name: 'Prime Roger Clemens (1986)',
    eraTeam: '1986 Boston Red Sox • 24-4, 8.8 WAR',
    reputation: 'The Rocket. 98 mph rising heater with explosive ride and splitter down.',
    arsenal: ['4-SEAM FASTBALL', 'SPLITTER', 'HARD SLIDER', 'CURVEBALL'],
    fastballVelo: 98,
    spinRateRpm: 2540,
    verticalBreakInches: 18.2,
    bossQuirk: 'Intimidating Strikeout Presence (+20% whiff on high fastballs)',
    statNerdHook: 'Stack high-barrel lefties with sub-22% chase rates. Work the count to tire his stamina.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🚀'
  },
  {
    stage: 2,
    name: 'Peak Pedro Martinez (1999)',
    eraTeam: '1999 Boston Red Sox • 23-4, 1.74 ERA, 291 K',
    reputation: 'Greatest modern peak. Dead-fish changeup with 18 inches of late fade.',
    arsenal: ['4-SEAM', 'CIRCLE CHANGEUP', 'POWER CUTTER', 'SLURVE'],
    fastballVelo: 97,
    spinRateRpm: 2620,
    verticalBreakInches: 19.5,
    bossQuirk: 'Dead-Fish Changeup (99th percentile chase rate on 2-strike counts)',
    statNerdHook: 'Avoid chasing low-and-away changeups. Sit dead-red on 4-seam belt-high mistakes.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🎯'
  },
  {
    stage: 3,
    name: 'Big Unit Randy Johnson (2001)',
    eraTeam: '2001 Arizona Diamondbacks • 372 Strikeouts, 10.1 WAR',
    reputation: '6-foot-10 sidearm terror. 101 mph fastball and sweeping slider from first base.',
    arsenal: ['100 MPH FASTBALL', 'MR. SNAPPY SLIDER', 'SPLIT-CHANGE'],
    fastballVelo: 101,
    spinRateRpm: 2680,
    verticalBreakInches: 14.1,
    bossQuirk: 'Uncomfortable Angle (LHBs suffer -35% contact rating; righties must carry the load)',
    statNerdHook: 'Bench all left-handed pull bats. Deploy right-handed gap hitters with elite inside-out bat speed.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🦖'
  },
  {
    stage: 4,
    name: '1968 Bob Gibson (The Year of the Pitcher)',
    eraTeam: '1968 St. Louis Cardinals • 1.12 ERA, 13 Shutouts',
    reputation: 'Fiercest competitor in history. Forced MLB to lower the mound.',
    arsenal: ['HEAVY SINKER', 'TIGHT SLIDER', 'RISING 4-SEAM'],
    fastballVelo: 96,
    spinRateRpm: 2490,
    verticalBreakInches: 17.8,
    bossQuirk: 'Lower-Mound Enforcer (Generates 68% groundball rate on all pitches in zone)',
    statNerdHook: 'Execute the high-trajectory Baltimore Chop! Groundballs bounce over infielders on hard dirt.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '⚔️'
  },
  {
    stage: 5,
    name: 'Prime Nolan Ryan (1973)',
    eraTeam: '1973 California Angels • 383 Strikeouts in a Single Season',
    reputation: 'The Ryan Express. 102 mph pure unhittable gas with wild zone variability.',
    arsenal: ['102 MPH 4-SEAM', '12-6 CURVEBALL', 'CIRCLE CHANGE'],
    fastballVelo: 102,
    spinRateRpm: 2750,
    verticalBreakInches: 21.0,
    bossQuirk: 'Wild Fireballer (Walk rate is 14%; patience yields free bases and +69 pts)',
    statNerdHook: 'Take until two strikes. Capitalize on elevated walk run values (wOBA +69 pts).',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '⚡'
  },
  {
    stage: 6,
    name: 'Peak Jacob deGrom (2021)',
    eraTeam: '2021 New York Mets • 1.08 ERA, 14.3 K/9',
    reputation: 'Machine-like velocity. 101 mph fastball paired with 94 mph back-foot slider.',
    arsenal: ['101 MPH 4-SEAM', '94 MPH SLIDER', '91 MPH CHANGEUP'],
    fastballVelo: 101,
    spinRateRpm: 2580,
    verticalBreakInches: 18.0,
    bossQuirk: 'Pinpoint Triple-Digit Command (Zone walk rate under 2.8%)',
    statNerdHook: 'Look for early-count sliders left over the heart of the plate before he expands the zone.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🦾'
  },
  {
    stage: 7,
    name: 'Sandman Mariano Rivera (1996 Postseason)',
    eraTeam: '1996 New York Yankees • 0.70 Postseason ERA, 1,173 Career ERA+',
    reputation: 'One pitch, infinite despair. The legendary cut fastball that shatters maple bats.',
    arsenal: ['95 MPH CUTTER', 'RUNNING 2-SEAM', 'BACK-DOOR CUTTER'],
    fastballVelo: 95,
    spinRateRpm: 2600,
    verticalBreakInches: 15.5,
    bossQuirk: 'Bat-Saw Cutter (Contact on inside edge automatically reduces exit velocity by 25%)',
    statNerdHook: 'Take pitches on the inner third; hunt opposite-field contact on outer-half cuts.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🪚'
  },
  {
    stage: 8,
    name: 'Devin Williams Airbender (2020)',
    eraTeam: '2020 Milwaukee Brewers • 0.33 ERA, 53% Whiff Rate',
    reputation: 'Gravity-defying changeup with over 2,800 RPM screwball action.',
    arsenal: ['AIRBENDER CHANGEUP', '96 MPH 4-SEAM', 'HARD CUTTER'],
    fastballVelo: 96,
    spinRateRpm: 2840,
    verticalBreakInches: 22.4,
    bossQuirk: 'The Airbender (53% swinging strike rate on pitches below the knees)',
    statNerdHook: 'Lay off everything down. Force him to elevate the fastball.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🌪️'
  },
  {
    stage: 9,
    name: 'Mason Miller 104 MPH (2024)',
    eraTeam: '2024 Oakland Athletics • 104.2 MPH Triple-Digit Fire',
    reputation: 'Fastest relief arm in the world. 104 mph heat with 88 mph sweeper.',
    arsenal: ['104 MPH 4-SEAM', '88 MPH SWEEPER', '101 MPH SINKER'],
    fastballVelo: 104,
    spinRateRpm: 2790,
    verticalBreakInches: 19.8,
    bossQuirk: 'Triple-Digit Velocity Heatwave (Batter reaction window reduced by 30%)',
    statNerdHook: 'Commit early on fastball trajectory. Use sit-dead-red trait.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '🔥'
  },
  {
    stage: 10,
    name: 'Sandy Koufax (1965)',
    eraTeam: '1965 Los Angeles Dodgers • 2.04 ERA, 382 Strikeouts, MVP',
    reputation: 'The Left Arm of God. 12-to-6 rainbow curveball dropped from the sky.',
    arsenal: ['RISING 4-SEAM', '12-TO-6 CURVEBALL', 'SLIDER'],
    fastballVelo: 98,
    spinRateRpm: 2720,
    verticalBreakInches: 23.5,
    bossQuirk: 'Over-the-Top Release (Curveball breaks 23.5 vertical inches through the floor)',
    statNerdHook: 'The Ultimate Boss. Protect against the high fastball, choke up for contact on the curve.',
    outsToSurvive: 6,
    initialDeficit: 4,
    avatarIcon: '👑'
  }
];

// =========================================================================
// PILLAR B: THE DIAMOND GRID CONQUEST ("TERRITORIAL WAR")
// =========================================================================

export interface GridTerritoryNode {
  id: string;
  name: string;
  region: 'NORTHEAST' | 'MIDWEST' | 'SOUTHEAST' | 'SOUTHWEST' | 'WEST_COAST';
  restrictionRule: string;
  statRequirement: string;
  rewardPoints: number;
  unlocked: boolean;
  conquered: boolean;
  icon: string;
}

export const GRID_CONQUEST_NODES: GridTerritoryNode[] = [
  {
    id: 'NODE_01',
    name: 'The Low-OPS Wilderness',
    region: 'NORTHEAST',
    restrictionRule: 'Lineup Restriction: All 9 batters must sport a 2024 OPS under .700 against Left-Handed Pitching.',
    statRequirement: 'Requires digging into defensive specialists and bottom-of-the-order grind cards.',
    rewardPoints: 2,
    unlocked: true,
    conquered: true,
    icon: '🌲'
  },
  {
    id: 'NODE_02',
    name: 'Sinker-Ballers Sanctuary',
    region: 'MIDWEST',
    restrictionRule: 'Pitching Staff Restriction: Pitchers restricted to sub-93 mph average velocity with >55% groundball rate.',
    statRequirement: 'Forbids high-velocity flamethrowers; demands pinpoint pitch sequencing and soft contact.',
    rewardPoints: 2,
    unlocked: true,
    conquered: true,
    icon: '⚾'
  },
  {
    id: 'NODE_03',
    name: 'The Spin-Rate Citadel',
    region: 'WEST_COAST',
    restrictionRule: 'Pitching Staff Restriction: All arms must exceed 2,550 RPM average fastball spin rate.',
    statRequirement: 'Forces exploitation of high vertical ride metrics to blow fastballs past high-ball hitters.',
    rewardPoints: 3,
    unlocked: true,
    conquered: false,
    icon: '🏰'
  },
  {
    id: 'NODE_04',
    name: 'Plate Discipline Valley',
    region: 'SOUTHEAST',
    restrictionRule: 'Batter Restriction: Entire starting lineup must average an O-Swing (Chase Rate) under 21%.',
    statRequirement: 'Draw 3+ walks in the territory game to unlock territorial WAR victory.',
    rewardPoints: 3,
    unlocked: true,
    conquered: false,
    icon: '🎯'
  },
  {
    id: 'NODE_05',
    name: 'Hard-Hit Haven',
    region: 'SOUTHWEST',
    restrictionRule: 'Statcast Requirement: Must record at least 5 hits with Exit Velocity ≥ 95 mph.',
    statRequirement: 'Power hitters with pure barrel efficiency required.',
    rewardPoints: 3,
    unlocked: false,
    conquered: false,
    icon: '💥'
  },
  {
    id: 'NODE_06',
    name: 'The Negative Launch Angle Marsh',
    region: 'MIDWEST',
    restrictionRule: 'Chop Specialist Node: At least 3 Baltimore Chop infield singles must be executed to clear.',
    statRequirement: 'Fast runners with downward bat-angle traits.',
    rewardPoints: 3,
    unlocked: false,
    conquered: false,
    icon: '🌾'
  },
  {
    id: 'NODE_07',
    name: 'The Bullpen Specialist Island',
    region: 'NORTHEAST',
    restrictionRule: 'Relief Only: No starter may pitch more than 1 inning. 5 different pitchers required.',
    statRequirement: 'Requires deep bullpen card binder with high leverage metrics.',
    rewardPoints: 3,
    unlocked: false,
    conquered: false,
    icon: '🏝️'
  },
  {
    id: 'NODE_08',
    name: 'The Apex Diamond Capital',
    region: 'WEST_COAST',
    restrictionRule: 'Final Territory: Face the All-Decade Sabermetric All-Stars on Extreme difficulty.',
    statRequirement: 'Win without recording more than 2 outs on pitches outside the strike zone.',
    rewardPoints: 6,
    unlocked: false,
    conquered: false,
    icon: '👑'
  }
];

// =========================================================================
// PILLAR C: PURE-SIM "MOMENTS OF INFAMY"
// =========================================================================

export interface MomentOfInfamy {
  id: string;
  title: string;
  historicalGame: string;
  leverageState: string;
  objective: string;
  statPuristContext: string;
  pointsAwarded: number;
  difficulty: 'EXTREME' | 'HALL_OF_FAME';
  completed: boolean;
  icon: string;
}

export const MOMENTS_OF_INFAMY: MomentOfInfamy[] = [
  {
    id: 'MOMENT_01',
    title: 'The 1999 Pedro Martinez Bullpen Rescue',
    historicalGame: '1999 ALDS Game 5 • Boston vs Cleveland',
    leverageState: 'Top 4th, tied 8-8, bases loaded, 0 outs. Pedro enters with back injury.',
    objective: 'Pitch 3 hitless innings with 5+ strikeouts and 0 walks without allowing a run.',
    statPuristContext: 'Pedro produced a legendary 6-inning no-hit relief masterclass with a 42% whiff rate on his circle changeup.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: true,
    icon: '🔥'
  },
  {
    id: 'MOMENT_02',
    title: 'The 2014 Madison Bumgarner Game 7 Ironman',
    historicalGame: '2014 World Series Game 7 • Giants at Royals',
    leverageState: 'Bottom 5th, Giants lead 3-2. Bumgarner enters on 2 days of rest.',
    objective: 'Protect the 1-run lead across 5 scoreless innings against Kansas City’s contact-heavy lineup.',
    statPuristContext: 'Bumgarner generated a historic 0.43 WPA in a single relief appearance, throwing 68 pitches on zero rest.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: true,
    icon: '🏆'
  },
  {
    id: 'MOMENT_03',
    title: 'The 2004 Dave Roberts Stolen Base Spark',
    historicalGame: '2004 ALCS Game 4 • Red Sox vs Yankees',
    leverageState: 'Bottom 9th, down 4-3, Mariano Rivera on the mound, Kevin Millar on first.',
    objective: 'Steal second base against Rivera’s slide-step, then score the tying run on a Bill Mueller single.',
    statPuristContext: 'Rivera had blown only 5 postseason saves in his career; the steal had a +0.28 Win Probability shift.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '⚡'
  },
  {
    id: 'MOMENT_04',
    title: 'The 2016 Rajai Davis 8th Inning Shock',
    historicalGame: '2016 World Series Game 7 • Cubs at Indians',
    leverageState: 'Bottom 8th, 2 outs, runner on 2nd, down 6-4 facing Aroldis Chapman throwing 101 mph.',
    objective: 'Hit a game-tying 2-run home run over Progressive Field’s 19-foot left field wall on 100+ mph heat.',
    statPuristContext: 'Chapman threw an elevated 97.1 mph 2-seamer; Davis turned on it with a 102.3 mph exit velo, the biggest WPA swing in World Series Game 7 history (+0.37 WPA).',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '💥'
  },
  {
    id: 'MOMENT_05',
    title: '1988 Kirk Gibson Pinch-Hit Walk-Off',
    historicalGame: '1988 World Series Game 1 • Athletics at Dodgers',
    leverageState: 'Bottom 9th, 2 outs, runner on 1st, down 4-3 facing Dennis Eckersley (0.61 ERA).',
    objective: 'Battle through 3-2 count, identify the backdoor slider, and drive a walk-off home run into the right field pavilion.',
    statPuristContext: 'Gibson had two injured legs; scout Mel Didier instructed him that on 3-2 counts Eckersley always throws the backdoor slider.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '🌴'
  },
  {
    id: 'MOMENT_06',
    title: 'The 1960 Bill Mazeroski Walk-Off Game 7',
    historicalGame: '1960 World Series Game 7 • Yankees at Pirates',
    leverageState: 'Bottom 9th, tied 9-9 at Forbes Field facing Ralph Terry.',
    objective: 'Lead off the inning with a high fly over the 406-foot brick wall for baseball’s only Game 7 walk-off homer.',
    statPuristContext: 'Only walk-off home run to win Game 7 of a World Series in baseball history.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '🧱'
  },
  {
    id: 'MOMENT_07',
    title: '1927 Murderers Row 9th Inning Crisis',
    historicalGame: '1927 Yankees • Protecting the 110-win historic regular season',
    leverageState: 'Top 9th, bases loaded, 2 outs, Ruth and Gehrig coming up in the bottom half.',
    objective: 'Strike out the side on 9 pitches against a lineup sporting an aggregate .385 wOBA.',
    statPuristContext: 'Execute the immaculate inning in high leverage: 9 pitches, 9 strikes, 0 balls.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '👑'
  },
  {
    id: 'MOMENT_08',
    title: 'The 2001 Luis Gonzalez Bloop over Jeter',
    historicalGame: '2001 World Series Game 7 • Yankees at Diamondbacks',
    leverageState: 'Bottom 9th, tied 2-2, bases loaded, 1 out against prime Mariano Rivera.',
    objective: 'Fist a broken-bat flare over the drawn-in infield into shallow left-center to score Jay Bell.',
    statPuristContext: 'Rivera had allowed only 2 earned runs across his entire postseason career; Gonzalez’s broken-bat flare had an xBA of just .230.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '🌵'
  },
  {
    id: 'MOMENT_09',
    title: '1975 Carlton Fisk 12th Inning Fair Ball Wave',
    historicalGame: '1975 World Series Game 6 • Reds at Red Sox',
    leverageState: 'Bottom 12th, midnight at Fenway Park, tied 6-6 facing Pat Darcy.',
    objective: 'Pull a drive down the left field line and wave it fair off the Fenway Park foul pole.',
    statPuristContext: 'Fisk famously jumped and waved the ball fair, immortalizing the TV center-field high-angle replay.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '🔔'
  },
  {
    id: 'MOMENT_10',
    title: '1995 Edgar Martinez "The Double"',
    historicalGame: '1995 ALDS Game 5 • Yankees at Mariners',
    leverageState: 'Bottom 11th, down 5-4, Joey Cora on 3rd, Ken Griffey Jr. on 1st facing Jack McDowell.',
    objective: 'Rip a line drive down the left-field line to score Cora and Griffey all the way from first base.',
    statPuristContext: 'Griffey ran first-to-home in 10.9 seconds, saving baseball in Seattle and propelling Edgar into the Hall of Fame.',
    pointsAwarded: 3,
    difficulty: 'EXTREME',
    completed: false,
    icon: '⚓'
  }
];

// =========================================================================
// PILLAR D: THE REFRACTOR DRAFT MATRIX (DRAFT-TO-GLORY)
// =========================================================================

export interface DraftMatrixRosterRule {
  salaryCapMillionDollars: number; // e.g. $185M analytical cap
  dollarPerWarRate: number; // e.g. $8.5M per bRef WAR
  rosterSize: number; // 26-man
  maxOutlierSeasonAnomalyCards: number; // e.g. max 2 volatile 9-WAR cards
  minimumFloorWar: number; // 45.0 total team WAR
}

export const DRAFT_MATRIX_RULES: DraftMatrixRosterRule = {
  salaryCapMillionDollars: 185,
  dollarPerWarRate: 8.5,
  rosterSize: 26,
  maxOutlierSeasonAnomalyCards: 2,
  minimumFloorWar: 48.0
};
