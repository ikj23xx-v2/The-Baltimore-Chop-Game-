import { PlayerCard, SpecialSkill, Position } from '../types/game';

export interface FranchiseWarSeasonEntry {
  rank: number; // 1-25
  playerName: string;
  year: number;
  bRefWar: number;
  position: Position;
  keyStats: string;
  deploymentRole: 'ACE_STARTER' | 'CLEANUP_POWER' | 'LEADOFF_SPEED' | 'GOLD_GLOVE_ANCHOR' | 'CLUTCH_PINCH_HITTER';
  signatureSkill: SpecialSkill;
  avatarIcon: string;
  bio: string;
  ratings: {
    contact: number;
    power: number;
    speed: number;
    fielding: number;
    control?: number;
    stuff?: number;
  };
}

export const TEAM_TOP_25_WAR_SEASONS: Record<string, FranchiseWarSeasonEntry[]> = {
  // ==========================================
  // AL EAST
  // ==========================================
  'Baltimore Orioles': [
    { rank: 1, playerName: 'Cal Ripken Jr.', year: 1991, bRefWar: 11.5, position: 'SS', keyStats: '34 HR, .323 AVG, 114 RBI, AL MVP, Gold Glove', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '👑', bio: 'One of the greatest all-around shortstop seasons in history. Won AL MVP, Gold Glove, and Silver Slugger.', ratings: { contact: 96, power: 92, speed: 78, fielding: 99 } },
    { rank: 2, playerName: 'Cal Ripken Jr.', year: 1983, bRefWar: 8.2, position: 'SS', keyStats: '27 HR, .318 AVG, 102 RBI, World Series Champ', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🏆', bio: 'Led Baltimore to the 1983 World Championship while winning his first AL MVP award.', ratings: { contact: 93, power: 88, speed: 75, fielding: 96 } },
    { rank: 3, playerName: 'Brooks Robinson', year: 1964, bRefWar: 8.0, position: '3B', keyStats: '28 HR, .317 AVG, 118 RBI, AL MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧤', bio: 'The Human Vacuum Cleaner at his peak. 118 RBI and platinum defense at the hot corner.', ratings: { contact: 94, power: 86, speed: 65, fielding: 99 } },
    { rank: 4, playerName: 'Frank Robinson', year: 1966, bRefWar: 7.7, position: 'RF', keyStats: '49 HR, .316 AVG, 122 RBI, Triple Crown Winner', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚡', bio: 'Captured the AL Triple Crown and unanimous MVP in his first summer with the Orioles.', ratings: { contact: 97, power: 99, speed: 82, fielding: 90 } },
    { rank: 5, playerName: 'Jim Palmer', year: 1975, bRefWar: 8.4, position: 'SP', keyStats: '23-11, 2.09 ERA, 193 SO, 25 CG, 10 SHO, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🦅', bio: 'Complete mastery on the mound with 10 shutouts and his second of three AL Cy Young awards.', ratings: { contact: 45, power: 40, speed: 50, fielding: 92, control: 98, stuff: 96 } },
    { rank: 6, playerName: 'Jim Palmer', year: 1973, bRefWar: 6.9, position: 'SP', keyStats: '22-9, 2.40 ERA, 19 CG, 6 SHO, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🦅', bio: 'First Cy Young campaign, anchoring Weaver’s legendary rotation with textbook high fastballs.', ratings: { contact: 45, power: 40, speed: 50, fielding: 90, control: 97, stuff: 95 } },
    { rank: 7, playerName: 'Eddie Murray', year: 1984, bRefWar: 7.3, position: '1B', keyStats: '29 HR, .306 AVG, 110 RBI, 107 BB, .410 OBP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🎯', bio: 'Steady Eddie switch-hitting mastery with an on-base clinic and elite first base glove.', ratings: { contact: 95, power: 92, speed: 62, fielding: 95 } },
    { rank: 8, playerName: 'Mike Mussina', year: 1992, bRefWar: 8.2, position: 'SP', keyStats: '18-5, 2.54 ERA, 1.08 WHIP, Knuckle-Curve Ace', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '📐', bio: 'Moose carved up the AL in his first full season with pinpoint knuckle-curve command.', ratings: { contact: 40, power: 35, speed: 55, fielding: 96, control: 99, stuff: 94 } },
    { rank: 9, playerName: 'Mike Mussina', year: 1996, bRefWar: 6.9, position: 'SP', keyStats: '19-11, 243.1 IP, 204 SO, Postseason Workhorse', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '📐', bio: 'Dominated the high-offense 90s with masterclass pitching IQ.', ratings: { contact: 40, power: 35, speed: 55, fielding: 95, control: 98, stuff: 93 } },
    { rank: 10, playerName: 'Ken Singleton', year: 1979, bRefWar: 5.8, position: 'RF', keyStats: '35 HR, .295 AVG, 111 RBI, 109 BB, .405 OBP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🎙️', bio: 'Cornerstone slugger of the 1979 AL Pennant winners with disciplined switch-hitting.', ratings: { contact: 90, power: 91, speed: 60, fielding: 84 } },
    { rank: 11, playerName: 'Paul Blair', year: 1969, bRefWar: 6.8, position: 'CF', keyStats: '26 HR, .285 AVG, 76 RBI, 20 SB, Gold Glove', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '💨', bio: 'Shallowest centerfielder in history who caught everything hit in the state of Maryland.', ratings: { contact: 88, power: 82, speed: 96, fielding: 99 } },
    { rank: 12, playerName: 'Mark Belanger', year: 1976, bRefWar: 4.8, position: 'SS', keyStats: '.270 AVG, 8 Gold Gloves, Greatest Defensive SS', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🛡️', bio: 'Blade posted historical defensive runs saved, forming an impenetrable middle infield.', ratings: { contact: 80, power: 55, speed: 85, fielding: 99 } },
    { rank: 13, playerName: 'Dave McNally', year: 1969, bRefWar: 6.4, position: 'SP', keyStats: '20-7, 2.79 ERA, 15 CG, 4 SHO', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '⚾', bio: 'Anchor of the four 20-game winners rotation that swept the postseason.', ratings: { contact: 40, power: 35, speed: 50, fielding: 88, control: 95, stuff: 91 } },
    { rank: 14, playerName: 'Mike Cuellar', year: 1969, bRefWar: 6.1, position: 'SP', keyStats: '23-11, 2.38 ERA, 18 CG, 5 SHO, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌀', bio: 'Legendary screwball hurler shared the 1969 AL Cy Young with Denny McLain.', ratings: { contact: 40, power: 35, speed: 50, fielding: 86, control: 96, stuff: 94 } },
    { rank: 15, playerName: 'Steve Stone', year: 1980, bRefWar: 5.3, position: 'SP', keyStats: '25-7, 3.23 ERA, AL Cy Young Winner', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '💎', bio: 'Broke Baltimore franchise record with 25 wins on the back of his vicious curveball.', ratings: { contact: 40, power: 35, speed: 50, fielding: 88, control: 96, stuff: 95 } },
    { rank: 16, playerName: 'Rafael Palmeiro', year: 1998, bRefWar: 6.3, position: '1B', keyStats: '43 HR, .296 AVG, 121 RBI, Gold Glove', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🗡️', bio: 'Sweet left-handed stroke produced 43 homers while anchoring first base defense.', ratings: { contact: 92, power: 96, speed: 58, fielding: 94 } },
    { rank: 17, playerName: 'Brady Anderson', year: 1996, bRefWar: 7.0, position: 'CF', keyStats: '50 HR, .297 AVG, 110 RBI, 21 SB, 117 R', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚡', bio: 'Historic 50-homer season from the leadoff spot that ignited Baltimore’s wild-card run.', ratings: { contact: 91, power: 97, speed: 92, fielding: 88 } },
    { rank: 18, playerName: 'Gunnar Henderson', year: 2024, bRefWar: 9.1, position: 'SS', keyStats: '37 HR, .281 AVG, 92 RBI, 21 SB, Silver Slugger', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🔥', bio: 'Modern franchise centerpiece with rare 35+ HR and 20+ SB five-tool brilliance.', ratings: { contact: 94, power: 95, speed: 91, fielding: 92 } },
    { rank: 19, playerName: 'Corbin Burnes', year: 2024, bRefWar: 5.4, position: 'SP', keyStats: '15-9, 2.92 ERA, 181 SO, 194.1 IP', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌪️', bio: 'Dominant frontline cutter ace who led the rotation into October.', ratings: { contact: 35, power: 30, speed: 50, fielding: 88, control: 97, stuff: 98 } },
    { rank: 20, playerName: 'Manny Machado', year: 2013, bRefWar: 6.7, position: '3B', keyStats: '51 2B, 14 HR, Platinum Glove Winner', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🛡️', bio: 'All-world defensive clinic at third base coupled with 51 doubles in his age-20 season.', ratings: { contact: 91, power: 84, speed: 78, fielding: 99 } },
    { rank: 21, playerName: 'Chris Davis', year: 2013, bRefWar: 7.0, position: '1B', keyStats: '53 HR, 138 RBI, .634 SLG, MLB HR Leader', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '💣', bio: 'Crush Davis blasted 53 home runs and 138 RBI in an unforgettable slugging campaign.', ratings: { contact: 85, power: 99, speed: 55, fielding: 86 } },
    { rank: 22, playerName: 'Al Bumbry', year: 1980, bRefWar: 4.8, position: 'CF', keyStats: '205 H, .318 AVG, 44 SB, 118 R', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🏃', bio: 'The Bee collected 205 base hits and scored 118 runs setting the table for Weaver.', ratings: { contact: 93, power: 65, speed: 96, fielding: 87 } },
    { rank: 23, playerName: 'Boog Powell', year: 1970, bRefWar: 5.1, position: '1B', keyStats: '35 HR, .297 AVG, 114 RBI, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🍖', bio: 'Massive slugger carried Baltimore to the 1970 World Series title as AL MVP.', ratings: { contact: 91, power: 97, speed: 50, fielding: 85 } },
    { rank: 24, playerName: 'Adley Rutschman', year: 2023, bRefWar: 5.1, position: 'C', keyStats: '20 HR, .277 AVG, 92 BB, All-Star Catcher', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🧢', bio: 'Dynamic switch-hitting backstop guided young pitching staff to 101 victories.', ratings: { contact: 93, power: 84, speed: 68, fielding: 95 } },
    { rank: 25, playerName: 'Gregg Olson', year: 1989, bRefWar: 3.5, position: 'RP', keyStats: '27 SV, 1.69 ERA, 90 SO, AL Rookie of Year', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔒', bio: 'The Otter baffled hitters with his devastating downer curveball out of the bullpen.', ratings: { contact: 30, power: 30, speed: 50, fielding: 85, control: 95, stuff: 97 } }
  ],

  'New York Yankees': [
    { rank: 1, playerName: 'Babe Ruth', year: 1923, bRefWar: 14.1, position: 'RF', keyStats: '41 HR, .393 AVG, 130 RBI, 170 BB, 1.309 OPS', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: 'Highest single-season WAR by a position player in modern baseball history.', ratings: { contact: 99, power: 99, speed: 70, fielding: 88 } },
    { rank: 2, playerName: 'Babe Ruth', year: 1921, bRefWar: 12.8, position: 'RF', keyStats: '59 HR, .378 AVG, 168 RBI, 177 R, 457 TB', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: 'Single-season total bases record with 457 that still stands untouchable today.', ratings: { contact: 99, power: 99, speed: 72, fielding: 87 } },
    { rank: 3, playerName: 'Babe Ruth', year: 1927, bRefWar: 12.6, position: 'RF', keyStats: '60 HR, .356 AVG, 165 RBI, Murderers Row Icon', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: '60 home runs led the most legendary baseball lineup ever assembled.', ratings: { contact: 99, power: 99, speed: 68, fielding: 86 } },
    { rank: 4, playerName: 'Lou Gehrig', year: 1927, bRefWar: 11.8, position: '1B', keyStats: '47 HR, .373 AVG, 173 RBI, 52 2B, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🐴', bio: 'The Iron Horse driven 173 runs home with a .765 slugging percentage.', ratings: { contact: 99, power: 98, speed: 70, fielding: 92 } },
    { rank: 5, playerName: 'Mickey Mantle', year: 1956, bRefWar: 11.2, position: 'CF', keyStats: '52 HR, .353 AVG, 130 RBI, Triple Crown Winner', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🚀', bio: 'Triple Crown champion with 52 tape-measure blast homers from both sides of the plate.', ratings: { contact: 98, power: 99, speed: 96, fielding: 93 } },
    { rank: 6, playerName: 'Lou Gehrig', year: 1930, bRefWar: 9.6, position: '1B', keyStats: '41 HR, .379 AVG, 173 RBI, .473 OBP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🐴', bio: 'Incredible run producer who rarely struck out while obliterating AL pitching.', ratings: { contact: 98, power: 97, speed: 68, fielding: 90 } },
    { rank: 7, playerName: 'Mickey Mantle', year: 1957, bRefWar: 11.3, position: 'CF', keyStats: '34 HR, .365 AVG, 146 BB, .512 OBP, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🚀', bio: 'Reached base more than half the time while playing pristine center field defense.', ratings: { contact: 99, power: 96, speed: 95, fielding: 94 } },
    { rank: 8, playerName: 'Joe DiMaggio', year: 1941, bRefWar: 9.4, position: 'CF', keyStats: '56-Game Hit Streak, 30 HR, 125 RBI, AL MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '✨', bio: 'The Yankee Clipper carried New York with his unbreakable 56-game consecutive hit streak.', ratings: { contact: 99, power: 94, speed: 85, fielding: 97 } },
    { rank: 9, playerName: 'Aaron Judge', year: 2024, bRefWar: 10.8, position: 'CF', keyStats: '58 HR, .322 AVG, 144 RBI, 133 BB, 1.159 OPS', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚖️', bio: 'Historic modern slugging clinic with 58 homers and an astounding 223 OPS+.', ratings: { contact: 96, power: 99, speed: 76, fielding: 92 } },
    { rank: 10, playerName: 'Aaron Judge', year: 2022, bRefWar: 10.6, position: 'CF', keyStats: '62 HR (AL Record), 131 RBI, 1.111 OPS, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚖️', bio: 'Shattered Roger Maris’ 61-year AL home run record with 62 majestic moonshots.', ratings: { contact: 94, power: 99, speed: 78, fielding: 93 } },
    { rank: 11, playerName: 'Alex Rodriguez', year: 2007, bRefWar: 9.4, position: '3B', keyStats: '54 HR, .314 AVG, 156 RBI, 143 R, 24 SB, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚡', bio: 'Led the majors in homers, RBI, runs, and slugging on the way to MVP honors.', ratings: { contact: 95, power: 99, speed: 82, fielding: 93 } },
    { rank: 12, playerName: 'Ron Guidry', year: 1978, bRefWar: 9.6, position: 'SP', keyStats: '25-3, 1.74 ERA, 248 SO, 9 SHO, Unanimous Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🐊', bio: 'Louisiana Lightning went 25-3 with an electric slider and 18-K performance.', ratings: { contact: 30, power: 30, speed: 60, fielding: 90, control: 98, stuff: 99 } },
    { rank: 13, playerName: 'Derek Jeter', year: 1999, bRefWar: 8.0, position: 'SS', keyStats: '219 H, 24 HR, .349 AVG, 102 RBI, 134 R, WS Champ', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🧢', bio: 'The Captain hit .349 with 219 base knocks leading the 90s dynastic squad.', ratings: { contact: 98, power: 84, speed: 86, fielding: 88 } },
    { rank: 14, playerName: 'Rickey Henderson', year: 1985, bRefWar: 9.9, position: 'LF', keyStats: '80 SB, 24 HR, .314 AVG, 146 R, 99 BB', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '⚡', bio: 'Stole 80 bases while blasting 24 dingers and scoring an unbelievable 146 runs.', ratings: { contact: 95, power: 85, speed: 99, fielding: 94 } },
    { rank: 15, playerName: 'Yogi Berra', year: 1954, bRefWar: 5.3, position: 'C', keyStats: '22 HR, .286 AVG, 125 RBI, 10 WS Rings, AL MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧘', bio: '10-time champion and bad-ball hitting maestro drove in 125 runs behind the plate.', ratings: { contact: 94, power: 90, speed: 55, fielding: 96 } },
    { rank: 16, playerName: 'Whitey Ford', year: 1961, bRefWar: 3.7, position: 'SP', keyStats: '25-4, 3.21 ERA, 283 IP, Cy Young Winner', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧊', bio: 'The Chairman of the Board won 25 games and holds the World Series scoreless innings mark.', ratings: { contact: 35, power: 30, speed: 50, fielding: 92, control: 98, stuff: 94 } },
    { rank: 17, playerName: 'Mariano Rivera', year: 1996, bRefWar: 5.0, position: 'RP', keyStats: '107.2 IP, 2.09 ERA, 130 SO, Set-Up Perfection', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🚪', bio: 'Unmatched 107-inning relief masterclass before becoming the greatest closer ever.', ratings: { contact: 20, power: 20, speed: 50, fielding: 95, control: 99, stuff: 99 } },
    { rank: 18, playerName: 'Andy Pettitte', year: 1997, bRefWar: 5.8, position: 'SP', keyStats: '18-7, 2.88 ERA, Pickoff King, Postseason Legend', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '👀', bio: 'Tenacious lefty workhorse who shut down opposing running games with his famous move.', ratings: { contact: 35, power: 30, speed: 50, fielding: 94, control: 96, stuff: 93 } },
    { rank: 19, playerName: 'Don Mattingly', year: 1985, bRefWar: 6.4, position: '1B', keyStats: '35 HR, .324 AVG, 145 RBI, 48 2B, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🏏', bio: 'Hit Man drove in 145 runs while winning the MVP and a Gold Glove at first base.', ratings: { contact: 97, power: 92, speed: 60, fielding: 99 } },
    { rank: 20, playerName: 'Dave Winfield', year: 1982, bRefWar: 5.6, position: 'RF', keyStats: '37 HR, .280 AVG, 106 RBI, 32-Gun Arm, Gold Glove', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '💪', bio: 'Towering athletic icon with one of the most feared throwing arms from right field.', ratings: { contact: 90, power: 94, speed: 80, fielding: 95 } },
    { rank: 21, playerName: 'Thurman Munson', year: 1976, bRefWar: 5.3, position: 'C', keyStats: '17 HR, .302 AVG, 105 RBI, AL MVP, Captain', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🦁', bio: 'Tough-as-nails backstop and leader who drove the Yankees back to the World Series.', ratings: { contact: 92, power: 84, speed: 64, fielding: 95 } },
    { rank: 22, playerName: 'Graig Nettles', year: 1978, bRefWar: 5.7, position: '3B', keyStats: '27 HR, 93 RBI, World Series Defensive MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧤', bio: 'His diving stops in the 1978 World Series remain the standard for third base excellence.', ratings: { contact: 86, power: 88, speed: 60, fielding: 98 } },
    { rank: 23, playerName: 'Willie Randolph', year: 1980, bRefWar: 5.9, position: '2B', keyStats: '119 BB, .427 OBP, 30 SB, Gold Glove Second Base', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🛡️', bio: 'Supreme plate discipline and second base positioning created instant runs.', ratings: { contact: 91, power: 65, speed: 86, fielding: 97 } },
    { rank: 24, playerName: 'CC Sabathia', year: 2011, bRefWar: 6.4, position: 'SP', keyStats: '19-8, 3.00 ERA, 230 SO, 237.1 IP', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🦍', bio: 'Bulldog ace powered the Bronx rotation through deep playoff drives.', ratings: { contact: 30, power: 35, speed: 45, fielding: 88, control: 96, stuff: 96 } },
    { rank: 25, playerName: 'Roger Maris', year: 1961, bRefWar: 6.9, position: 'RF', keyStats: '61 HR, 141 RBI, 132 R, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🌟', bio: 'Broke Babe Ruth’s single-season record with 61 iconic home runs in 1961.', ratings: { contact: 88, power: 99, speed: 74, fielding: 92 } }
  ],

  'Boston Red Sox': [
    { rank: 1, playerName: 'Carl Yastrzemski', year: 1967, bRefWar: 12.5, position: 'LF', keyStats: '44 HR, .326 AVG, 121 RBI, Triple Crown, Impossible Dream', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🌟', bio: 'Led Boston to the pennant with a historic Triple Crown and 12.5 WAR.', ratings: { contact: 98, power: 97, speed: 78, fielding: 98 } },
    { rank: 2, playerName: 'Pedro Martinez', year: 1999, bRefWar: 10.7, position: 'SP', keyStats: '23-4, 2.07 ERA, 313 SO, 0.92 WHIP, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔥', bio: 'Peak Pedro during the steroid era. 313 strikeouts and microscopic 0.92 WHIP.', ratings: { contact: 30, power: 30, speed: 55, fielding: 92, control: 99, stuff: 99 } },
    { rank: 3, playerName: 'Ted Williams', year: 1946, bRefWar: 10.6, position: 'LF', keyStats: '38 HR, .342 AVG, 123 RBI, 156 BB, .497 OBP, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🎯', bio: 'The Splendid Splinter returned from WWII and promptly led Boston to the pennant.', ratings: { contact: 99, power: 98, speed: 65, fielding: 85 } },
    { rank: 4, playerName: 'Ted Williams', year: 1941, bRefWar: 10.4, position: 'LF', keyStats: '.406 AVG, 37 HR, 120 RBI, .553 OBP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎯', bio: 'The last hitter to hit over .400 in an MLB season, batting 6-for-8 on the final day.', ratings: { contact: 99, power: 98, speed: 68, fielding: 84 } },
    { rank: 5, playerName: 'Pedro Martinez', year: 2000, bRefWar: 11.7, position: 'SP', keyStats: '18-6, 1.74 ERA, 284 SO, 0.74 WHIP (MLB Record)', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔥', bio: 'Lowest WHIP in modern baseball history (0.74) and 291 ERA+.', ratings: { contact: 30, power: 30, speed: 55, fielding: 93, control: 99, stuff: 99 } },
    { rank: 6, playerName: 'Mookie Betts', year: 2018, bRefWar: 10.7, position: 'RF', keyStats: '32 HR, .346 AVG, 30 SB, AL MVP, WS Champion', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🎳', bio: 'Led Boston to 108 wins and the 2018 title while winning MVP and Gold Glove.', ratings: { contact: 98, power: 91, speed: 95, fielding: 99 } },
    { rank: 7, playerName: 'Roger Clemens', year: 1986, bRefWar: 8.9, position: 'SP', keyStats: '24-4, 2.48 ERA, 238 SO, 20-K Game, AL MVP & Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🚀', bio: 'The Rocket struck out 20 batters in a single 9-inning game and won AL MVP.', ratings: { contact: 30, power: 30, speed: 50, fielding: 88, control: 98, stuff: 99 } },
    { rank: 8, playerName: 'Roger Clemens', year: 1990, bRefWar: 10.4, position: 'SP', keyStats: '21-6, 1.93 ERA, 209 SO, 0.28 HR/9, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🚀', bio: 'Gave up just 7 homers all year across 228 innings of work.', ratings: { contact: 30, power: 30, speed: 50, fielding: 90, control: 98, stuff: 98 } },
    { rank: 9, playerName: 'David Ortiz', year: 2006, bRefWar: 5.8, position: 'DH', keyStats: '54 HR (Team Record), 137 RBI, 119 BB, 1.049 OPS', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🔨', bio: 'Big Papi clobbered a franchise record 54 homers with legendary walk-off heroics.', ratings: { contact: 94, power: 99, speed: 45, fielding: 70 } },
    { rank: 10, playerName: 'Wade Boggs', year: 1985, bRefWar: 9.1, position: '3B', keyStats: '240 H, .368 AVG, .450 OBP, 107 R', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🍗', bio: 'Master of the Green Monster who posted 240 base hits with sublime plate vision.', ratings: { contact: 99, power: 75, speed: 70, fielding: 94 } },
    { rank: 11, playerName: 'Tris Speaker', year: 1912, bRefWar: 10.1, position: 'CF', keyStats: '53 2B, 10 HR, .383 AVG, 52 SB, AL MVP', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🩶', bio: 'The Grey Eagle won the 1912 MVP while patrolling shallow center with deadly precision.', ratings: { contact: 98, power: 78, speed: 96, fielding: 99 } },
    { rank: 12, playerName: 'Jim Rice', year: 1978, bRefWar: 7.6, position: 'LF', keyStats: '46 HR, 15 3B, .315 AVG, 139 RBI, 406 TB, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '💥', bio: 'Accumulated 406 total bases, terrorizing AL pitching with raw pull-side power.', ratings: { contact: 94, power: 98, speed: 76, fielding: 86 } },
    { rank: 13, playerName: 'Manny Ramirez', year: 2004, bRefWar: 4.1, position: 'LF', keyStats: '43 HR, 130 RBI, .308 AVG, WS MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🥢', bio: 'Helped break the 86-year curse with flawless opposite-field power and World Series MVP.', ratings: { contact: 97, power: 98, speed: 52, fielding: 74 } },
    { rank: 14, playerName: 'Fred Lynn', year: 1975, bRefWar: 7.4, position: 'CF', keyStats: '21 HR, 47 2B, .331 AVG, 105 RBI, ROY & MVP', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🌟', bio: 'First player in history to win Rookie of the Year and MVP in the same season.', ratings: { contact: 95, power: 88, speed: 85, fielding: 96 } },
    { rank: 15, playerName: 'Dustin Pedroia', year: 2008, bRefWar: 6.9, position: '2B', keyStats: '213 H, 54 2B, .326 AVG, 20 SB, AL MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: 'Laser', bio: 'The Laser Show played fearless second base defense and captured AL MVP honors.', ratings: { contact: 96, power: 82, speed: 86, fielding: 98 } },
    { rank: 16, playerName: 'Carlton Fisk', year: 1972, bRefWar: 7.3, position: 'C', keyStats: '22 HR, 9 3B, .293 AVG, Gold Glove, ROY', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎣', bio: 'Pudge burst onto the scene with elite catching defense, winning ROY and Gold Glove.', ratings: { contact: 91, power: 88, speed: 66, fielding: 98 } },
    { rank: 17, playerName: 'Nomar Garciaparra', year: 2000, bRefWar: 7.4, position: 'SS', keyStats: '.372 AVG, 21 HR, 96 RBI, 51 2B, Batting Champ', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '⚡', bio: 'Back-to-back batting champion with lightning-quick wrists in the batter box.', ratings: { contact: 99, power: 86, speed: 82, fielding: 93 } },
    { rank: 18, playerName: 'Curt Schilling', year: 2004, bRefWar: 4.4, position: 'SP', keyStats: '21-6, 3.26 ERA, 203 SO, Bloody Sock Legend', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧦', bio: 'Pitched through a torn tendon in the bloody sock game to vanquish the curse.', ratings: { contact: 30, power: 30, speed: 45, fielding: 88, control: 98, stuff: 96 } },
    { rank: 19, playerName: 'Jonathan Papelbon', year: 2006, bRefWar: 5.0, position: 'RP', keyStats: '35 SV, 0.92 ERA, 0.78 WHIP, 75 SO', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎸', bio: 'Historic rookie closer season, posting a 0.92 ERA with electric high heat.', ratings: { contact: 20, power: 20, speed: 50, fielding: 90, control: 96, stuff: 99 } },
    { rank: 20, playerName: 'Rico Petrocelli', year: 1969, bRefWar: 8.1, position: 'SS', keyStats: '40 HR, 97 RBI, 98 BB, .403 OBP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🏛️', bio: 'Set the AL record for home runs by a shortstop with 40 blasts into the Fenway night.', ratings: { contact: 88, power: 94, speed: 65, fielding: 92 } },
    { rank: 21, playerName: 'Babe Ruth', year: 1916, bRefWar: 8.8, position: 'SP', keyStats: '23-12, 1.75 ERA, 9 SHO, 323.2 IP, WS Champ', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '👑', bio: 'Before becoming the Sultan of Swat, Ruth was the AL ERA champion and dominant southpaw.', ratings: { contact: 85, power: 85, speed: 65, fielding: 90, control: 95, stuff: 97 } },
    { rank: 22, playerName: 'Ellis Burks', year: 1990, bRefWar: 5.9, position: 'CF', keyStats: '21 HR, 89 RBI, 89 R, Gold Glove & Silver Slugger', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '⚡', bio: 'Dynamic five-tool talent patrolling center field with grace and power.', ratings: { contact: 89, power: 88, speed: 90, fielding: 95 } },
    { rank: 23, playerName: 'Mo Vaughn', year: 1995, bRefWar: 4.3, position: '1B', keyStats: '39 HR, 126 RBI, .300 AVG, AL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🦏', bio: 'The Hit Dog won AL MVP powering Boston to the AL East title with crushing swings.', ratings: { contact: 92, power: 97, speed: 50, fielding: 82 } },
    { rank: 24, playerName: 'Rafael Devers', year: 2021, bRefWar: 4.4, position: '3B', keyStats: '38 HR, 113 RBI, 37 2B, Silver Slugger', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🍦', bio: 'Pulverized pitches from shoe-tops to eyeballs with unmatched bat speed.', ratings: { contact: 91, power: 96, speed: 62, fielding: 80 } },
    { rank: 25, playerName: 'Jarren Duran', year: 2024, bRefWar: 8.7, position: 'CF', keyStats: '48 2B, 14 3B, 21 HR, 34 SB, ASG MVP', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '⚡', bio: 'Extra-base machine who led the majors in doubles and triples while wreaking havoc on the bases.', ratings: { contact: 93, power: 86, speed: 98, fielding: 94 } }
  ],

  // Continuing with top seasons across other key franchises
  'San Francisco Giants': [
    { rank: 1, playerName: 'Barry Bonds', year: 2001, bRefWar: 11.9, position: 'LF', keyStats: '73 HR (MLB Record), .863 SLG, 177 BB, 1.379 OPS', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: '73 homers in a single season. The ultimate peak of power and plate discipline.', ratings: { contact: 99, power: 99, speed: 85, fielding: 92 } },
    { rank: 2, playerName: 'Barry Bonds', year: 2002, bRefWar: 11.8, position: 'LF', keyStats: '46 HR, .370 AVG, 198 BB, .582 OBP, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: 'Walked 198 times and posted a .582 OBP, leading San Francisco to the World Series.', ratings: { contact: 99, power: 99, speed: 82, fielding: 91 } },
    { rank: 3, playerName: 'Barry Bonds', year: 2004, bRefWar: 10.6, position: 'LF', keyStats: '45 HR, .362 AVG, 232 BB (Record), .609 OBP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '👑', bio: 'Intentionally walked 120 times in a year where pitchers refused to throw him strikes.', ratings: { contact: 99, power: 99, speed: 78, fielding: 90 } },
    { rank: 4, playerName: 'Willie Mays', year: 1965, bRefWar: 11.2, position: 'CF', keyStats: '52 HR, .317 AVG, 112 RBI, .645 SLG, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🦅', bio: 'The Say Hey Kid at the peak of his legendary powers, blasting 52 homers in the wind.', ratings: { contact: 98, power: 99, speed: 96, fielding: 99 } },
    { rank: 5, playerName: 'Willie Mays', year: 1964, bRefWar: 11.0, position: 'CF', keyStats: '47 HR, .296 AVG, 111 RBI, Gold Glove Center Field', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🦅', bio: 'The undisputed greatest all-around centerfielder who ever lived.', ratings: { contact: 97, power: 98, speed: 97, fielding: 99 } },
    { rank: 6, playerName: 'Willie Mays', year: 1962, bRefWar: 10.5, position: 'CF', keyStats: '49 HR, 141 RBI, 130 R, NL Pennant Leader', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🦅', bio: 'Carried the Giants into the World Series with 49 home runs and 141 RBI.', ratings: { contact: 97, power: 99, speed: 96, fielding: 99 } },
    { rank: 7, playerName: 'Christy Mathewson', year: 1908, bRefWar: 11.2, position: 'SP', keyStats: '37-11, 1.43 ERA, 259 SO, 34 CG, 11 SHO', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎩', bio: 'Big Six won 37 games with his immortal fadeaway pitch.', ratings: { contact: 35, power: 30, speed: 50, fielding: 95, control: 99, stuff: 99 } },
    { rank: 8, playerName: 'Buster Posey', year: 2012, bRefWar: 7.6, position: 'C', keyStats: '.336 AVG, 24 HR, 103 RBI, NL MVP, WS Champ', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧢', bio: 'Returned from severe injury to win the NL MVP, batting title, and World Series ring.', ratings: { contact: 98, power: 88, speed: 65, fielding: 97 } },
    { rank: 9, playerName: 'Madison Bumgarner', year: 2014, bRefWar: 4.8, position: 'SP', keyStats: '18-10, 2.98 ERA, 219 SO, 0.43 WS ERA Legend', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🪓', bio: 'Recorded the most dominant postseason pitching performance in World Series history.', ratings: { contact: 65, power: 75, speed: 45, fielding: 92, control: 97, stuff: 98 } },
    { rank: 10, playerName: 'Tim Lincecum', year: 2008, bRefWar: 7.9, position: 'SP', keyStats: '18-5, 2.62 ERA, 265 SO, The Freak Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌪️', bio: 'The Freak captivated the baseball world with torque and high strikeouts.', ratings: { contact: 25, power: 25, speed: 60, fielding: 90, control: 96, stuff: 99 } },
    { rank: 11, playerName: 'Willie McCovey', year: 1969, bRefWar: 8.1, position: '1B', keyStats: '45 HR, 126 RBI, .320 AVG, 121 BB, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🌊', bio: 'Stretch launched rockets into the cove that bears his name, winning the 1969 MVP.', ratings: { contact: 94, power: 99, speed: 58, fielding: 88 } },
    { rank: 12, playerName: 'Juan Marichal', year: 1965, bRefWar: 10.3, position: 'SP', keyStats: '22-13, 2.13 ERA, 240 SO, 24 CG, 10 SHO', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🇩🇴', bio: 'The Dominican Dandy baffled batters with his famous high leg kick and 6 pitches.', ratings: { contact: 35, power: 30, speed: 50, fielding: 94, control: 99, stuff: 97 } },
    { rank: 13, playerName: 'Mel Ott', year: 1938, bRefWar: 8.9, position: 'RF', keyStats: '36 HR, .311 AVG, 118 RBI, 122 BB, Polo Grounds Icon', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '🗽', bio: 'Iconic leg-kick left-handed power hitter who blasted 511 career Polo Grounds homers.', ratings: { contact: 95, power: 96, speed: 72, fielding: 92 } },
    { rank: 14, playerName: 'Matt Cain', year: 2012, bRefWar: 4.2, position: 'SP', keyStats: '16-5, 2.79 ERA, Perfect Game Hurler, WS Champ', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🐎', bio: 'The Horse threw the first perfect game in Giants history in June 2012.', ratings: { contact: 30, power: 30, speed: 50, fielding: 92, control: 97, stuff: 95 } },
    { rank: 15, playerName: 'Will Clark', year: 1989, bRefWar: 8.6, position: '1B', keyStats: '23 HR, 111 RBI, .333 AVG, NLCS MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '💥', bio: 'Will the Thrill played with pure fire and the purest left-handed swing in the sport.', ratings: { contact: 97, power: 90, speed: 72, fielding: 96 } },
    { rank: 16, playerName: 'Kevin Mitchell', year: 1989, bRefWar: 6.9, position: 'LF', keyStats: '47 HR, 125 RBI, Barehand Catch, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🥊', bio: 'Raw, explosive bat speed produced 47 home runs and the 1989 NL MVP.', ratings: { contact: 91, power: 98, speed: 65, fielding: 84 } },
    { rank: 17, playerName: 'Brandon Crawford', year: 2021, bRefWar: 6.1, position: 'SS', keyStats: '24 HR, 90 RBI, .298 AVG, Gold Glove Shortstop', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🛡️', bio: 'Silky smooth Bay Area native anchored the defense for 107-win season.', ratings: { contact: 91, power: 86, speed: 75, fielding: 99 } },
    { rank: 18, playerName: 'Logan Webb', year: 2023, bRefWar: 5.6, position: 'SP', keyStats: '11-13, 3.25 ERA, 216.0 IP, Heavy Sinker Master', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '⚓', bio: 'MLB innings pitched leader with groundball heavy sinker precision.', ratings: { contact: 25, power: 25, speed: 50, fielding: 90, control: 98, stuff: 95 } },
    { rank: 19, playerName: 'Robb Nen', year: 2000, bRefWar: 3.8, position: 'RP', keyStats: '41 SV, 1.50 ERA, 92 SO, Triple-Digit Fastball', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔒', bio: 'Feared terminator in the 9th inning with 102 mph heat and slider.', ratings: { contact: 15, power: 15, speed: 50, fielding: 90, control: 95, stuff: 99 } },
    { rank: 20, playerName: 'Jeff Kent', year: 2000, bRefWar: 7.2, position: '2B', keyStats: '33 HR, 125 RBI, .334 AVG, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🤠', bio: 'Most home runs by a second baseman in MLB history; won 2000 MVP honors.', ratings: { contact: 94, power: 94, speed: 62, fielding: 88 } },
    { rank: 21, playerName: 'Carl Hubbell', year: 1933, bRefWar: 9.3, position: 'SP', keyStats: '23-12, 1.66 ERA, 10 SHO, Screwball Maestro, NL MVP', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌀', bio: 'King Carl struck out Ruth, Gehrig, Foxx, Simmons, and Cronin in succession in 1934.', ratings: { contact: 35, power: 30, speed: 50, fielding: 92, control: 99, stuff: 98 } },
    { rank: 22, playerName: 'Orlando Cepeda', year: 1961, bRefWar: 5.6, position: '1B', keyStats: '46 HR, 142 RBI, .311 AVG, Baby Bull', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🐂', bio: 'Baby Bull overpowered pitchers across the National League with thunderous power.', ratings: { contact: 92, power: 97, speed: 65, fielding: 86 } },
    { rank: 23, playerName: 'Bobby Bonds', year: 1973, bRefWar: 8.2, position: 'RF', keyStats: '39 HR, 43 SB, 131 R, Gold Glove', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '⚡', bio: 'One homer shy of the 40/40 club while playing gold glove right field defense.', ratings: { contact: 89, power: 94, speed: 96, fielding: 96 } },
    { rank: 24, playerName: 'Gaylord Perry', year: 1970, bRefWar: 6.9, position: 'SP', keyStats: '23-13, 3.20 ERA, 328.2 IP, 23 CG, Spitball Legend', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '💧', bio: 'Ironman hurler threw 328.2 innings and kept hitters off balance with his mystery break.', ratings: { contact: 30, power: 30, speed: 50, fielding: 90, control: 96, stuff: 96 } },
    { rank: 25, playerName: 'Hunter Pence', year: 2014, bRefWar: 3.8, position: 'RF', keyStats: '20 HR, 180 H, 106 R, 162 Games, Inspirational WS Hero', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'OPPO_FIELD_TAKE', avatarIcon: '👀', bio: 'The fiery heart and soul of the 2014 World Series championship run.', ratings: { contact: 89, power: 86, speed: 85, fielding: 92 } }
  ],

  'Los Angeles Dodgers': [
    { rank: 1, playerName: 'Sandy Koufax', year: 1965, bRefWar: 10.7, position: 'SP', keyStats: '26-8, 2.04 ERA, 382 SO (Modern NL Record), Cy Young, WS MVP', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌟', bio: 'The Left Arm of God struck out 382 batters and threw a perfect game in 1965.', ratings: { contact: 25, power: 25, speed: 50, fielding: 92, control: 99, stuff: 99 } },
    { rank: 2, playerName: 'Sandy Koufax', year: 1966, bRefWar: 10.3, position: 'SP', keyStats: '27-9, 1.73 ERA, 317 SO, 27 CG, Triple Crown Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌟', bio: 'Won the pitching Triple Crown in his final season before retiring on top.', ratings: { contact: 25, power: 25, speed: 50, fielding: 92, control: 99, stuff: 99 } },
    { rank: 3, playerName: 'Jackie Robinson', year: 1949, bRefWar: 9.3, position: '2B', keyStats: '16 HR, .342 AVG, 124 RBI, 37 SB, NL MVP', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '42', bio: 'Pioneered the modern game while winning the NL Batting Title and MVP.', ratings: { contact: 99, power: 86, speed: 99, fielding: 98 } },
    { rank: 4, playerName: 'Clayton Kershaw', year: 2014, bRefWar: 7.7, position: 'SP', keyStats: '21-3, 1.77 ERA, 239 SO, 0.86 WHIP, NL MVP & Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '👑', bio: 'Rare starting pitcher to win the NL MVP; threw a 15-strikeout no-hitter.', ratings: { contact: 30, power: 30, speed: 50, fielding: 94, control: 99, stuff: 99 } },
    { rank: 5, playerName: 'Clayton Kershaw', year: 2013, bRefWar: 8.4, position: 'SP', keyStats: '16-9, 1.83 ERA, 232 SO, 0.92 WHIP, Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '👑', bio: 'Public Enemy No. 1 for NL hitters with his iconic 12-6 curveball and slider.', ratings: { contact: 30, power: 30, speed: 50, fielding: 94, control: 99, stuff: 99 } },
    { rank: 6, playerName: 'Shohei Ohtani', year: 2024, bRefWar: 9.2, position: 'DH', keyStats: '54 HR, 59 SB, .310 AVG, 130 RBI, Historic 50/50 Club', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🦄', bio: 'Founded the 50 Home Run / 50 Stolen Base club in an unbelievable display of athleticism.', ratings: { contact: 97, power: 99, speed: 99, fielding: 80 } },
    { rank: 7, playerName: 'Duke Snider', year: 1953, bRefWar: 9.2, position: 'CF', keyStats: '42 HR, 126 RBI, 132 R, .336 AVG, The Duke of Flatbush', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '👑', bio: 'The Duke of Flatbush launched 42 home runs for the Boys of Summer.', ratings: { contact: 96, power: 97, speed: 85, fielding: 94 } },
    { rank: 8, playerName: 'Orel Hershiser', year: 1988, bRefWar: 7.2, position: 'SP', keyStats: '59 Consecutive Scoreless Innings, 23-8, Cy Young & WS MVP', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: 'Bulldog', bio: 'Bulldog shattered the MLB scoreless innings record and pitched LA to the 1988 crown.', ratings: { contact: 35, power: 30, speed: 50, fielding: 96, control: 99, stuff: 97 } },
    { rank: 9, playerName: 'Mookie Betts', year: 2020, bRefWar: 3.6, position: 'RF', keyStats: '16 HR, 10 SB, Gold Glove, World Series Champion', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🎳', bio: 'Transformed the Dodgers culture in 2020, delivering a long-awaited championship.', ratings: { contact: 97, power: 90, speed: 95, fielding: 99 } },
    { rank: 10, playerName: 'Fernando Valenzuela', year: 1981, bRefWar: 4.8, position: 'SP', keyStats: 'Fernandomania, 13-7, 2.48 ERA, 8 SHO, ROY & Cy Young', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎸', bio: 'Ignited Fernandomania with his look-to-the-heavens screwball delivery.', ratings: { contact: 45, power: 45, speed: 45, fielding: 90, control: 97, stuff: 98 } },
    { rank: 11, playerName: 'Roy Campanella', year: 1953, bRefWar: 7.1, position: 'C', keyStats: '41 HR, 142 RBI (Catcher Record), .312 AVG, NL MVP', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔔', bio: 'Campy set the all-time single-season catcher RBI record with 142 ribbies.', ratings: { contact: 95, power: 96, speed: 60, fielding: 98 } },
    { rank: 12, playerName: 'Don Drysdale', year: 1968, bRefWar: 6.2, position: 'SP', keyStats: '58.2 Scoreless Innings, 14-12, 2.15 ERA, 8 SHO', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🤠', bio: 'Intimidating sidearm hurler who strung together 6 consecutive shutouts.', ratings: { contact: 40, power: 40, speed: 50, fielding: 90, control: 96, stuff: 98 } },
    { rank: 13, playerName: 'Pee Wee Reese', year: 1949, bRefWar: 6.5, position: 'SS', keyStats: '16 HR, 116 BB, .396 OBP, Captain of the Dodgers', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '🧢', bio: 'The Little Colonel led the Brooklyn clubhouse with poise, courage, and great defense.', ratings: { contact: 92, power: 74, speed: 85, fielding: 98 } },
    { rank: 14, playerName: 'Mike Piazza', year: 1997, bRefWar: 8.7, position: 'C', keyStats: '40 HR, 124 RBI, .362 AVG, .431 OBP, Silver Slugger', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🍕', bio: 'Arguably the greatest offensive catcher season ever, batting .362 with 40 bombs.', ratings: { contact: 99, power: 98, speed: 50, fielding: 80 } },
    { rank: 15, playerName: 'Kirk Gibson', year: 1988, bRefWar: 6.5, position: 'LF', keyStats: '25 HR, 31 SB, NL MVP, Legendary Fist-Pump Walkoff', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '💪', bio: 'Pure heart and will; hit the iconic hobbled pinch-hit walkoff in Game 1 of the 1988 World Series.', ratings: { contact: 90, power: 94, speed: 85, fielding: 88 } },
    { rank: 16, playerName: 'Eric Gagne', year: 2003, bRefWar: 3.7, position: 'RP', keyStats: '55/55 Saves, 1.20 ERA, 137 SO, Cy Young Winner', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🎮', bio: 'Game Over! Converted 84 consecutive saves behind an untouchable vulcan changeup.', ratings: { contact: 15, power: 15, speed: 50, fielding: 90, control: 98, stuff: 99 } },
    { rank: 17, playerName: 'Freddie Freeman', year: 2023, bRefWar: 6.5, position: '1B', keyStats: '211 H, 59 2B, 29 HR, 102 RBI, 23 SB, .331 AVG', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🦷', bio: 'Nearly reached 60 doubles while batting .331 and stealing 23 bases.', ratings: { contact: 98, power: 92, speed: 78, fielding: 96 } },
    { rank: 18, playerName: 'Adrian Beltre', year: 2004, bRefWar: 9.6, position: '3B', keyStats: '48 HR, 121 RBI, .334 AVG, Platinum 3B Defense', deploymentRole: 'GOLD_GLOVE_ANCHOR', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🛡️', bio: 'Crushed 48 home runs while vacuuming every ball at the hot corner.', ratings: { contact: 95, power: 98, speed: 75, fielding: 99 } },
    { rank: 19, playerName: 'Don Newcombe', year: 1956, bRefWar: 4.8, position: 'SP', keyStats: '27-7, 3.06 ERA, First Cy Young & MVP Winner', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '💥', bio: 'First pitcher in history to win Rookie of the Year, Cy Young, and MVP in a career.', ratings: { contact: 65, power: 65, speed: 50, fielding: 90, control: 97, stuff: 96 } },
    { rank: 20, playerName: 'Gil Hodges', year: 1954, bRefWar: 5.5, position: '1B', keyStats: '42 HR, 130 RBI, .304 AVG, Gold Glove Pioneer', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '⚓', bio: 'Gentle giant who anchored Brooklyn’s infield with gold glove hands.', ratings: { contact: 91, power: 96, speed: 60, fielding: 97 } },
    { rank: 21, playerName: 'Davey Lopes', year: 1979, bRefWar: 6.7, position: '2B', keyStats: '28 HR, 44 SB, 109 R, All-Star Catalyst', deploymentRole: 'LEADOFF_SPEED', signatureSkill: 'BALTIMORE_CHOP', avatarIcon: '⚡', bio: 'Deadly combination of power and base-stealing prowess at second base.', ratings: { contact: 90, power: 88, speed: 96, fielding: 94 } },
    { rank: 22, playerName: 'Steve Garvey', year: 1974, bRefWar: 4.4, position: '1B', keyStats: '21 HR, 111 RBI, .312 AVG, 200 H, NL MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🌟', bio: 'Mr. Clean won the 1974 MVP as a write-in All-Star starter.', ratings: { contact: 94, power: 86, speed: 68, fielding: 95 } },
    { rank: 23, playerName: 'Zack Greinke', year: 2015, bRefWar: 9.3, position: 'SP', keyStats: '19-3, 1.66 ERA, 200 SO, 0.84 WHIP, 45.2 Scoreless Innings', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🧠', bio: 'Pitching genius posted an absurd 1.66 ERA alongside Kershaw.', ratings: { contact: 60, power: 45, speed: 60, fielding: 99, control: 99, stuff: 96 } },
    { rank: 24, playerName: 'Ron Cey', year: 1977, bRefWar: 5.8, position: '3B', keyStats: '30 HR, 110 RBI, The Penguin, WS Co-MVP', deploymentRole: 'CLEANUP_POWER', signatureSkill: 'SIT_DEAD_RED', avatarIcon: '🐧', bio: 'The Penguin drove in 110 runs with low-to-the-ground power.', ratings: { contact: 89, power: 90, speed: 52, fielding: 92 } },
    { rank: 25, playerName: 'Walker Buehler', year: 2021, bRefWar: 6.2, position: 'SP', keyStats: '16-4, 2.47 ERA, 212 SO, Big-Game Buehler', deploymentRole: 'ACE_STARTER', signatureSkill: 'CONTACT_PROTECT', avatarIcon: '🔥', bio: 'Big-game fire-thrower carried the rotation through championship pressure.', ratings: { contact: 30, power: 30, speed: 55, fielding: 90, control: 97, stuff: 98 } }
  ]
};

// Generates fallback top 25 WAR single seasons for any of the 30 MLB franchises
export function getTeamTop25WarSeasons(teamName: string): FranchiseWarSeasonEntry[] {
  if (TEAM_TOP_25_WAR_SEASONS[teamName]) {
    return TEAM_TOP_25_WAR_SEASONS[teamName];
  }

  // Curated franchise legends generator for the remaining franchises
  const franchiseStars: Record<string, { star: string; war: number; yr: number; pos: Position; icon: string }[]> = {
    'Atlanta Braves': [
      { star: 'Hank Aaron', war: 9.4, yr: 1961, pos: 'RF', icon: '👑' },
      { star: 'Greg Maddux', war: 9.7, yr: 1995, pos: 'SP', icon: '🎯' },
      { star: 'Chipper Jones', war: 7.3, yr: 1999, pos: '3B', icon: '🏹' },
      { star: 'John Smoltz', war: 7.3, yr: 1996, pos: 'SP', icon: '🔥' },
      { star: 'Tom Glavine', war: 6.1, yr: 1998, pos: 'SP', icon: '🧊' },
      { star: 'Dale Murphy', war: 7.1, yr: 1983, pos: 'CF', icon: '🌟' },
      { star: 'Ronald Acuña Jr.', war: 8.2, yr: 2023, pos: 'RF', icon: '⚡' },
      { star: 'Andruw Jones', war: 8.2, yr: 2000, pos: 'CF', icon: '🧤' }
    ],
    'Chicago Cubs': [
      { star: 'Ernie Banks', war: 10.2, yr: 1959, pos: 'SS', icon: '☀️' },
      { star: 'Ron Santo', war: 9.0, yr: 1967, pos: '3B', icon: '🐻' },
      { star: 'Ryne Sandberg', war: 8.5, yr: 1984, pos: '2B', icon: '💎' },
      { star: 'Ferguson Jenkins', war: 10.1, yr: 1971, pos: 'SP', icon: '🇨🇦' },
      { star: 'Sammy Sosa', war: 6.5, yr: 1998, pos: 'RF', icon: '💥' },
      { star: 'Kris Bryant', war: 7.3, yr: 2016, pos: '3B', icon: '🏆' }
    ],
    'St. Louis Cardinals': [
      { star: 'Rogers Hornsby', war: 12.1, yr: 1924, pos: '2B', icon: '👑' },
      { star: 'Bob Gibson', war: 11.2, yr: 1968, pos: 'SP', icon: '🔥' },
      { star: 'Stan Musial', war: 11.3, yr: 1948, pos: 'LF', icon: '🎻' },
      { star: 'Albert Pujols', war: 9.7, yr: 2009, pos: '1B', icon: '🦏' },
      { star: 'Ozzie Smith', war: 7.3, yr: 1987, pos: 'SS', icon: '🤸' }
    ],
    'Houston Astros': [
      { star: 'Craig Biggio', war: 9.4, yr: 1997, pos: '2B', icon: '🚀' },
      { star: 'Jeff Bagwell', war: 8.2, yr: 1994, pos: '1B', icon: '💪' },
      { star: 'Justin Verlander', war: 7.4, yr: 2019, pos: 'SP', icon: '🔥' },
      { star: 'Jose Altuve', war: 8.1, yr: 2017, pos: '2B', icon: '⚡' }
    ],
    'Philadelphia Phillies': [
      { star: 'Mike Schmidt', war: 8.9, yr: 1974, pos: '3B', icon: '👑' },
      { star: 'Steve Carlton', war: 12.1, yr: 1972, pos: 'SP', icon: 'Lefty' },
      { star: 'Chase Utley', war: 8.2, yr: 2008, pos: '2B', icon: '⚡' },
      { star: 'Bryce Harper', war: 5.9, yr: 2021, pos: 'RF', icon: '💥' }
    ],
    'Seattle Mariners': [
      { star: 'Ken Griffey Jr.', war: 9.7, yr: 1996, pos: 'CF', icon: '🧢' },
      { star: 'Alex Rodriguez', war: 9.4, yr: 1996, pos: 'SS', icon: '⚡' },
      { star: 'Ichiro Suzuki', war: 9.2, yr: 2004, pos: 'RF', icon: '🎯' },
      { star: 'Felix Hernandez', war: 7.2, yr: 2010, pos: 'SP', icon: '👑' },
      { star: 'Randy Johnson', war: 8.6, yr: 1995, pos: 'SP', icon: '🦒' }
    ],
    'Los Angeles Angels': [
      { star: 'Mike Trout', war: 10.5, yr: 2012, pos: 'CF', icon: '🐟' },
      { star: 'Mike Trout', war: 10.2, yr: 2013, pos: 'CF', icon: '🐟' },
      { star: 'Shohei Ohtani', war: 10.0, yr: 2023, pos: 'DH', icon: '🦄' },
      { star: 'Nolan Ryan', war: 7.7, yr: 1973, pos: 'SP', icon: '🔥' },
      { star: 'Tim Salmon', war: 5.4, yr: 1995, pos: 'RF', icon: '🎣' }
    ],
    'San Diego Padres': [
      { star: 'Tony Gwynn', war: 8.6, yr: 1987, pos: 'RF', icon: '🎯' },
      { star: 'Ken Caminiti', war: 7.6, yr: 1996, pos: '3B', icon: '💪' },
      { star: 'Dave Winfield', war: 8.3, yr: 1979, pos: 'RF', icon: '🌟' },
      { star: 'Trevor Hoffman', war: 4.1, yr: 1998, pos: 'RP', icon: '🔔' },
      { star: 'Fernando Tatis Jr.', war: 6.6, yr: 2021, pos: 'SS', icon: '⚡' }
    ]
  };

  const pool = franchiseStars[teamName] || [
    { star: `${teamName} Franchise Hero`, war: 9.5, yr: 1985, pos: 'CF' as Position, icon: '⭐' },
    { star: `${teamName} Ace Hurler`, war: 8.8, yr: 1994, pos: 'SP' as Position, icon: '🔥' },
    { star: `${teamName} Legend Slugger`, war: 8.2, yr: 2004, pos: 'RF' as Position, icon: '👑' }
  ];

  // Return a generated top 25 for this team
  return Array.from({ length: 25 }, (_, idx) => {
    const starIdx = idx % pool.length;
    const base = pool[starIdx];
    const yearOffset = idx * 2;
    const warValue = Math.max(4.2, +(base.war - idx * 0.22).toFixed(1));
    return {
      rank: idx + 1,
      playerName: `${base.star}${idx >= pool.length ? ` (Season ${idx + 1})` : ''}`,
      year: base.yr - yearOffset > 1900 ? base.yr - yearOffset : 1970 + idx,
      bRefWar: warValue,
      position: base.pos,
      keyStats: `bRef WAR: ${warValue} • Elite franchise milestone performance`,
      deploymentRole: base.pos === 'SP' ? 'ACE_STARTER' : idx % 2 === 0 ? 'CLEANUP_POWER' : 'GOLD_GLOVE_ANCHOR',
      signatureSkill: base.pos === 'SP' ? 'CONTACT_PROTECT' : 'BALTIMORE_CHOP',
      avatarIcon: base.icon,
      bio: `Ranked #${idx + 1} all-time single season in ${teamName} franchise history with ${warValue} Baseball-Reference WAR.`,
      ratings: {
        contact: Math.min(99, Math.round(80 + warValue * 1.5)),
        power: Math.min(99, Math.round(75 + warValue * 1.8)),
        speed: Math.min(99, Math.round(70 + (25 - idx))),
        fielding: Math.min(99, Math.round(85 + (25 - idx) * 0.5)),
        control: base.pos === 'SP' ? Math.min(99, Math.round(85 + warValue)) : undefined,
        stuff: base.pos === 'SP' ? Math.min(99, Math.round(88 + warValue)) : undefined
      }
    };
  });
}

// Convert a single-season WAR entry into a playable PlayerCard
export function convertWarSeasonToCard(entry: FranchiseWarSeasonEntry, teamName: string): PlayerCard {
  return {
    id: `WAR_LEGEND_${teamName.replace(/\s+/g, '_')}_${entry.rank}`,
    cardNo: 8000 + entry.rank,
    cardSetId: 'HERITAGE',
    name: entry.playerName,
    team: `${teamName} (Legends)`,
    position: entry.position,
    bRefWar: entry.bRefWar,
    isHistorical: true,
    era: `${entry.year} • #${entry.rank} Franchise Peak`,
    stats: entry.ratings,
    refractorTier: entry.rank === 1 ? 'SUPERFRACTOR_1_OF_1' : entry.rank <= 3 ? 'GOLD_WAVE' : entry.rank <= 10 ? 'SAPPHIRE' : 'RAINBOW',
    serialStamp: entry.rank === 1 ? '1/1' : `#0${entry.rank}/25`,
    hasAutograph: entry.rank <= 5,
    signatureSkill: entry.signatureSkill,
    bio: entry.bio,
    avatarIcon: entry.avatarIcon,
    careerStats: {
      games: 154,
      hits: 180,
      homeRuns: 35,
      rbi: 110,
      avg: '.315',
      ops: '.945'
    }
  };
}
