// src/data/coachCardDatabase.ts

export type CoachTier = 'TACTICAL_BRONZE' | 'FIELD_SILVER' | 'DUGOUT_GOLD' | 'LEGEND_IMMORTAL';
export type CoachSpecialty = 
  | 'PITCHING_GURU'       // Boosts K/9 and suppresses late-inning ERAs
  | 'SMALL_BALL_TACTICIAN'// Increases bunt success and stolen base efficiency
  | 'SLUGGING_COACH'      // Multiplies ISO and extra-base hit probability
  | 'ANALYTICS_SCOUT'     // Maximizes platoon advantages (+5% OBP)
  | 'BULLPEN_WHISPERER'   // Increases reliever stamina and strand rate
  | 'GOLD_GLOVE_INFIELD';  // Drastically cuts infield errors and turn-two DP rate

export interface CoachCardDefinition {
  cardNo: number; // #1 to #99
  name: string;
  era: string;
  tier: CoachTier;
  specialty: CoachSpecialty;
  autoplayTacticalBonus: string;
  statMultiplier: number;
}

// 99-card complete registry:
// - 9 Immortal Legends (#1 to #9)
// - 20 Dugout Gold (#10 to #29)
// - 30 Field Silver (#30 to #59)
// - 40 Tactical Bronze (#60 to #99)
export const COACH_CARD_REGISTRY: CoachCardDefinition[] = [
  // Legendary Immortals (9 Cards: #1 - #9)
  { cardNo: 1, name: 'Earl Weaver', era: '1979 Era', tier: 'LEGEND_IMMORTAL', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: '3-Run HR Probability +18% on full counts', statMultiplier: 1.25 },
  { cardNo: 2, name: 'Casey Stengel', era: '1953 Era', tier: 'LEGEND_IMMORTAL', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Platoon substitution boost +22% clutch contact', statMultiplier: 1.25 },
  { cardNo: 3, name: 'John McGraw', era: '1911 Era', tier: 'LEGEND_IMMORTAL', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Hit-and-run and suicide squeeze 98% execution rate', statMultiplier: 1.25 },
  { cardNo: 4, name: 'Connie Mack', era: '1930 Era', tier: 'LEGEND_IMMORTAL', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Complete game stamina loss reduced by 40%', statMultiplier: 1.25 },
  { cardNo: 5, name: 'Sparky Anderson', era: '1975 Era', tier: 'LEGEND_IMMORTAL', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Captain Hook hook speed: inherited runner strand 85%', statMultiplier: 1.24 },
  { cardNo: 6, name: 'Walter Alston', era: '1965 Era', tier: 'LEGEND_IMMORTAL', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Infield range +15%, double play conversion +30%', statMultiplier: 1.24 },
  { cardNo: 7, name: 'Tony La Russa', era: '1989 Era', tier: 'LEGEND_IMMORTAL', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Specialist match-up strikeout modifier +20%', statMultiplier: 1.23 },
  { cardNo: 8, name: 'Billy Martin', era: '1977 Era', tier: 'LEGEND_IMMORTAL', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Aggressive baseline baserunning chaos +25% wild throws', statMultiplier: 1.22 },
  { cardNo: 9, name: 'Tommy Lasorda', era: '1988 Era', tier: 'LEGEND_IMMORTAL', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Dodger Blue grit: 9th inning pinch-hit clutch +35%', statMultiplier: 1.22 },

  // Dugout Gold (20 Cards: #10 - #29)
  { cardNo: 10, name: 'Leo Durocher', era: '1951 Era', tier: 'DUGOUT_GOLD', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Infield chatter prevents mental fielding errors', statMultiplier: 1.15 },
  { cardNo: 11, name: 'Dick Williams', era: '1972 Era', tier: 'DUGOUT_GOLD', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Aggressive double steals on 1st and 3rd counts', statMultiplier: 1.15 },
  { cardNo: 12, name: 'Whitey Herzog', era: '1982 Era', tier: 'DUGOUT_GOLD', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Whiteyball turf speed: +2 extra bases taken per game', statMultiplier: 1.15 },
  { cardNo: 13, name: 'Terry Francona', era: '2004 Era', tier: 'DUGOUT_GOLD', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Late-inning bullpen leverage index optimization', statMultiplier: 1.14 },
  { cardNo: 14, name: 'Bruce Bochy', era: '2014 Era', tier: 'DUGOUT_GOLD', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Even-year magic: Postseason win bonus +15%', statMultiplier: 1.14 },
  { cardNo: 15, name: 'Joe Torre', era: '1998 Era', tier: 'DUGOUT_GOLD', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Core composure: Lineup strikeout rates drop 12%', statMultiplier: 1.14 },
  { cardNo: 16, name: 'Buck Showalter', era: '2014 Era', tier: 'DUGOUT_GOLD', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Defensive shifting eliminates pull-field singles', statMultiplier: 1.13 },
  { cardNo: 17, name: 'Davey Johnson', era: '1986 Era', tier: 'DUGOUT_GOLD', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Early computer sabermetric matchups +10% wOBA', statMultiplier: 1.13 },
  { cardNo: 18, name: 'Jim Leyland', era: '1997 Era', tier: 'DUGOUT_GOLD', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Ace mound presence: Starters pitch +1.2 deeper IP', statMultiplier: 1.13 },
  { cardNo: 19, name: 'Lou Piniella', era: '2001 Era', tier: 'DUGOUT_GOLD', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Sweet Lou fire: Bat exit velocities +3.5 mph after walks', statMultiplier: 1.12 },
  { cardNo: 20, name: 'Gene Mauch', era: '1964 Era', tier: 'DUGOUT_GOLD', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Sacrifice bunt success rate elevated to 92%', statMultiplier: 1.12 },
  { cardNo: 21, name: 'Paul Richards', era: '1954 Era', tier: 'DUGOUT_GOLD', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Oversized catcher mitt knuckleball control bonus', statMultiplier: 1.12 },
  { cardNo: 22, name: 'Al Lopez', era: '1959 Era', tier: 'DUGOUT_GOLD', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Go-Go White Sox pitching ERA suppressed to 2.85', statMultiplier: 1.11 },
  { cardNo: 23, name: 'Chuck Tanner', era: '1979 Era', tier: 'DUGOUT_GOLD', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'We Are Family: Speedster stolen base success +18%', statMultiplier: 1.11 },
  { cardNo: 24, name: 'Ralph Houk', era: '1961 Era', tier: 'DUGOUT_GOLD', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'The Major: Middle order extra base hit launch angle boost', statMultiplier: 1.11 },
  { cardNo: 25, name: 'Tom Kelly', era: '1987 Era', tier: 'DUGOUT_GOLD', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Dome field turf defense: Ground balls converted +14%', statMultiplier: 1.10 },
  { cardNo: 26, name: 'Bobby Cox', era: '1995 Era', tier: 'DUGOUT_GOLD', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Big Three rotation synergy: First-pitch strikes +15%', statMultiplier: 1.10 },
  { cardNo: 27, name: 'Miller Huggins', era: '1927 Era', tier: 'DUGOUT_GOLD', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Murderers Row: Lineup home run ceiling +20%', statMultiplier: 1.10 },
  { cardNo: 28, name: 'Joe McCarthy', era: '1936 Era', tier: 'DUGOUT_GOLD', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Yankee perfection: Scoring margin bonus +1.5 runs', statMultiplier: 1.10 },
  { cardNo: 29, name: 'Dusty Baker', era: '2022 Era', tier: 'DUGOUT_GOLD', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Toothpick calm: Relief pitchers resist fatigue penalties', statMultiplier: 1.10 },

  // Field Silver (30 Cards: #30 - #59)
  { cardNo: 30, name: 'Ray Miller', era: '1983 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: '"Work Fast, Change Speeds, Throw Strikes" command boost', statMultiplier: 1.08 },
  { cardNo: 31, name: 'Charlie Lau', era: '1976 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Weight-shift contact hitting: Batting average +18 pts', statMultiplier: 1.08 },
  { cardNo: 32, name: 'George Bamberger', era: '1970 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Orioles pitching factory: Slider break +12%', statMultiplier: 1.08 },
  { cardNo: 33, name: 'Walt Hriniak', era: '1985 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Bottom-hand release: Line drive spray distribution', statMultiplier: 1.07 },
  { cardNo: 34, name: 'Johnny Pesky', era: '1962 Era', tier: 'FIELD_SILVER', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Shortstop turn-two footwork execution bonus', statMultiplier: 1.07 },
  { cardNo: 35, name: 'Don Zimmer', era: '1989 Era', tier: 'FIELD_SILVER', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Popeye gamble: Suicide squeeze call with RISP', statMultiplier: 1.07 },
  { cardNo: 36, name: 'Leo Mazzone', era: '1995 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Rocking chair rhythm: Low and away corner command +14%', statMultiplier: 1.07 },
  { cardNo: 37, name: 'Dave Duncan', era: '2006 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Heavy sinker specialist: Infield ground-ball rate +22%', statMultiplier: 1.06 },
  { cardNo: 38, name: 'Cal Ripken Sr.', era: '1983 Era', tier: 'FIELD_SILVER', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'The Ripken Way fundamentals: Zero fielding errors on routine hops', statMultiplier: 1.06 },
  { cardNo: 39, name: 'Art Howe', era: '2000 Era', tier: 'FIELD_SILVER', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Moneyball base on balls discipline +12%', statMultiplier: 1.06 },
  { cardNo: 40, name: 'Dave Bristol', era: '1968 Era', tier: 'FIELD_SILVER', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Third-base windmill waving runners home aggressively', statMultiplier: 1.06 },
  { cardNo: 41, name: 'Rudy Jaramillo', era: '1999 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Power stroke mechanic: Home run distance +15 ft', statMultiplier: 1.05 },
  { cardNo: 42, name: 'Dave Righetti', era: '2010 Era', tier: 'FIELD_SILVER', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Left-on-base percentage during high leverage +15%', statMultiplier: 1.05 },
  { cardNo: 43, name: 'Bryan Price', era: '2012 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Strikeout-to-walk ratio optimization +10%', statMultiplier: 1.05 },
  { cardNo: 44, name: 'Hal McRae', era: '1980 Era', tier: 'FIELD_SILVER', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Hard-nosed takeout slide breaking up double plays', statMultiplier: 1.05 },
  { cardNo: 45, name: 'Cookie Rojas', era: '1988 Era', tier: 'FIELD_SILVER', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Middle infield glove transfer speed +20%', statMultiplier: 1.05 },
  { cardNo: 46, name: 'Rich Donnelly', era: '1997 Era', tier: 'FIELD_SILVER', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Third base box communication: Tag-up efficiency +12%', statMultiplier: 1.04 },
  { cardNo: 47, name: 'Milt May', era: '1992 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Two-strike situational contact hitting +14%', statMultiplier: 1.04 },
  { cardNo: 48, name: 'Larry Rothschild', era: '2003 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Starting pitcher arm slot consistency +10%', statMultiplier: 1.04 },
  { cardNo: 49, name: 'Jim Frey', era: '1984 Era', tier: 'FIELD_SILVER', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Day game wind out at Wrigley slugging bonus +10%', statMultiplier: 1.04 },
  { cardNo: 50, name: 'Dallas Green', era: '1980 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Mound toughness: Strikeouts with bases loaded +15%', statMultiplier: 1.04 },
  { cardNo: 51, name: 'Herm Schneider', era: '2005 Era', tier: 'FIELD_SILVER', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Stamina regeneration: Recovery between series +25%', statMultiplier: 1.03 },
  { cardNo: 52, name: 'Jim Colborn', era: '2002 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Pitch tracking and release point deception', statMultiplier: 1.03 },
  { cardNo: 53, name: 'Ron Washington', era: '2010 Era', tier: 'FIELD_SILVER', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Fungo bat mastery: Infield error reduction 25%', statMultiplier: 1.03 },
  { cardNo: 54, name: 'Don Baylor', era: '1995 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Crowd the plate: Hit-by-pitch and grit on-base lift', statMultiplier: 1.03 },
  { cardNo: 55, name: 'Ron Gardenhire', era: '2006 Era', tier: 'FIELD_SILVER', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Piranha baserunning: First-to-third advances +15%', statMultiplier: 1.03 },
  { cardNo: 56, name: 'John Farrell', era: '2008 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Boston rotation pitch count stamina ceiling +8 pitches', statMultiplier: 1.02 },
  { cardNo: 57, name: 'Rick Honeycutt', era: '2017 Era', tier: 'FIELD_SILVER', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Left-handed specialist matchup suppression', statMultiplier: 1.02 },
  { cardNo: 58, name: 'Chili Davis', era: '2015 Era', tier: 'FIELD_SILVER', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Opposite-field gap driving situational hitting', statMultiplier: 1.02 },
  { cardNo: 59, name: 'Dan Warthen', era: '2015 Era', tier: 'FIELD_SILVER', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Warthen slider: Velocity and bite on full count pitches', statMultiplier: 1.02 },

  // Tactical Bronze (40 Cards: #60 - #99)
  { cardNo: 60, name: 'Bobby Valentine', era: '2000 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Dugout trickery: Decoy signs confuse opposing steal attempts', statMultiplier: 1.02 },
  { cardNo: 61, name: 'Ozzie Guillen', era: '2005 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Ozzie-ball: Bunt-and-run execution bonus +8%', statMultiplier: 1.02 },
  { cardNo: 62, name: 'Jimy Williams', era: '1999 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Relay throw accuracy from outfield to home plate', statMultiplier: 1.02 },
  { cardNo: 63, name: 'Clint Hurdle', era: '2013 Era', tier: 'TACTICAL_BRONZE', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Pitch-framing catcher pitch strike call rate +5%', statMultiplier: 1.02 },
  { cardNo: 64, name: 'Bob Melvin', era: '2012 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Optimized defensive shift positioning against pull hitters', statMultiplier: 1.02 },
  { cardNo: 65, name: 'Bud Black', era: '2010 Era', tier: 'TACTICAL_BRONZE', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Pitcher sequencing: Low changeup chase rate +8%', statMultiplier: 1.01 },
  { cardNo: 66, name: 'Ned Yost', era: '2015 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'HDH 7-8-9 bullpen lockdown protection', statMultiplier: 1.01 },
  { cardNo: 67, name: 'Manny Acta', era: '2008 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Platoon optimization for bench pinch hitters', statMultiplier: 1.01 },
  { cardNo: 68, name: 'Ken Macha', era: '2003 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Patience at the plate: Opposing starter pitch count +6', statMultiplier: 1.01 },
  { cardNo: 69, name: 'Felipe Alou', era: '1994 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Youth development: Rookie card performance boost +6%', statMultiplier: 1.01 },
  { cardNo: 70, name: 'Terry Collins', era: '2015 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Late-inning rally motivation: Comeback run odds +7%', statMultiplier: 1.01 },
  { cardNo: 71, name: 'Brad Mills', era: '2010 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Cutoff alignment cuts extra bases taken by 10%', statMultiplier: 1.01 },
  { cardNo: 72, name: 'Lloyd McClendon', era: '2002 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'First base steal protest: Umpire strike zone shrinks slightly', statMultiplier: 1.01 },
  { cardNo: 73, name: 'John Gibbons', era: '2015 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Slugger freedom: Green light on 3-0 fastball counts', statMultiplier: 1.01 },
  { cardNo: 74, name: 'Jim Tracy', era: '2009 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Speed on the bases: Rundown evasion rate +6%', statMultiplier: 1.01 },
  { cardNo: 75, name: 'Jeff Banister', era: '2015 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'One-run game grit: Defensive concentration in the 9th', statMultiplier: 1.01 },
  { cardNo: 76, name: 'Mike Scioscia', era: '2002 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Rally Monkey rally cap: Multirun innings trigger +8%', statMultiplier: 1.01 },
  { cardNo: 77, name: 'Charlie Manuel', era: '2008 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Hitting whisperer: Sweet-spot contact rate +6%', statMultiplier: 1.01 },
  { cardNo: 78, name: 'Dave Martinez', era: '2019 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Baby Shark momentum: Dugout morale shields stamina', statMultiplier: 1.01 },
  { cardNo: 79, name: 'A.J. Hinch', era: '2017 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Advanced scouting report pitch tracking assist', statMultiplier: 1.01 },
  { cardNo: 80, name: 'Torey Lovullo', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Desert speed: Aggressive extra base turns on gap singles', statMultiplier: 1.01 },
  { cardNo: 81, name: 'Kevin Cash', era: '2020 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'The Stable: 98+ mph opener bullpen tactics', statMultiplier: 1.01 },
  { cardNo: 82, name: 'Craig Counsell', era: '2018 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Out-getter usage: Relievers enter clean in high leverage', statMultiplier: 1.01 },
  { cardNo: 83, name: 'Brian Snitker', era: '2021 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Night bomb power: Outfield carry distance +5 ft', statMultiplier: 1.01 },
  { cardNo: 84, name: 'Rob Thomson', era: '2022 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Philly vibe check: Extra base hit cascade probability +6%', statMultiplier: 1.01 },
  { cardNo: 85, name: 'Oliver Marmol', era: '2022 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Defensive metrics: Ground ball positioning efficiency +5%', statMultiplier: 1.00 },
  { cardNo: 86, name: 'Brandon Hyde', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Baby Birds speed & contact: High hustle on weak dribblers', statMultiplier: 1.00 },
  { cardNo: 87, name: 'Skip Schumaker', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'One-run game defensive security', statMultiplier: 1.00 },
  { cardNo: 88, name: 'Mark Kotsay', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'PITCHING_GURU', autoplayTacticalBonus: 'Pitch-to-contact Coliseum grounders +6%', statMultiplier: 1.00 },
  { cardNo: 89, name: 'Pedro Grifol', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Basic situational coverage on stolen base throws', statMultiplier: 1.00 },
  { cardNo: 90, name: 'Derek Shelton', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Base running hustle: Steal jump accuracy +5%', statMultiplier: 1.00 },
  { cardNo: 91, name: 'David Bell', era: '2023 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Aggressive send on shallow outfield flies', statMultiplier: 1.00 },
  { cardNo: 92, name: 'Rocco Baldelli', era: '2019 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Bomba Squad: Team barrel rate increase +4%', statMultiplier: 1.00 },
  { cardNo: 93, name: 'Dave Roberts', era: '2020 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Deep roster substitution match-up leverage', statMultiplier: 1.00 },
  { cardNo: 94, name: 'Aaron Boone', era: '2019 Era', tier: 'TACTICAL_BRONZE', specialty: 'SLUGGING_COACH', autoplayTacticalBonus: 'Savages in the box: Hard contact frequency +5%', statMultiplier: 1.00 },
  { cardNo: 95, name: 'Scott Servais', era: '2022 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Chaos ball: One-run game win probability +5%', statMultiplier: 1.00 },
  { cardNo: 96, name: 'Alex Cora', era: '2018 Era', tier: 'TACTICAL_BRONZE', specialty: 'ANALYTICS_SCOUT', autoplayTacticalBonus: 'Green Monster line-drive trajectory tuning', statMultiplier: 1.00 },
  { cardNo: 97, name: 'Carlos Mendoza', era: '2024 Era', tier: 'TACTICAL_BRONZE', specialty: 'GOLD_GLOVE_INFIELD', autoplayTacticalBonus: 'Fundamental footwork on double play pivots', statMultiplier: 1.00 },
  { cardNo: 98, name: 'Matt Quatraro', era: '2024 Era', tier: 'TACTICAL_BRONZE', specialty: 'SMALL_BALL_TACTICIAN', autoplayTacticalBonus: 'Aggressive first-to-third baserunning reads', statMultiplier: 1.00 },
  { cardNo: 99, name: 'Pat Murphy', era: '2024 Era', tier: 'TACTICAL_BRONZE', specialty: 'BULLPEN_WHISPERER', autoplayTacticalBonus: 'Murph grit: Relievers inherit runners with strikeout edge', statMultiplier: 1.00 },
];
