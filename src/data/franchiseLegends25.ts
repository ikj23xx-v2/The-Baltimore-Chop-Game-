// src/data/franchiseLegends25.ts

export interface LegendCardConfig {
  rank: number; // 1 to 25
  playerName: string;
  season: number;
  position: string;
  war: number;
  archetype: string;
  basePointsMultiplier: number;
  keyFeat?: string;
}

export const YANKEES_TOP_25: LegendCardConfig[] = [
  { rank: 1, playerName: "Babe Ruth", season: 1923, position: "RF", war: 14.1, archetype: "Apex Slugging", basePointsMultiplier: 2.5, keyFeat: "41 HR, .393 AVG, 1.309 OPS, 170 BB" },
  { rank: 2, playerName: "Babe Ruth", season: 1921, position: "RF", war: 12.8, archetype: "Pure Power", basePointsMultiplier: 2.4, keyFeat: "59 HR, 168 RBI, 457 Total Bases" },
  { rank: 3, playerName: "Babe Ruth", season: 1927, position: "RF", war: 12.5, archetype: "Home Run Crown", basePointsMultiplier: 2.4, keyFeat: "60 HR, Murderers' Row Icon" },
  { rank: 4, playerName: "Aaron Judge", season: 2022, position: "CF", war: 10.8, archetype: "Modern Titan", basePointsMultiplier: 2.3, keyFeat: "62 HR (AL Record), 131 RBI, AL MVP" },
  { rank: 5, playerName: "Mickey Mantle", season: 1957, position: "CF", war: 11.3, archetype: "Triple Crown Switch-Hitter", basePointsMultiplier: 2.3, keyFeat: "34 HR, .365 AVG, .512 OBP, AL MVP" },
  { rank: 6, playerName: "Mickey Mantle", season: 1956, position: "CF", war: 11.2, archetype: "MVP Speed-Power", basePointsMultiplier: 2.2, keyFeat: "52 HR, .353 AVG, Triple Crown" },
  { rank: 7, playerName: "Lou Gehrig", season: 1927, position: "1B", war: 11.8, archetype: "Iron Horse RBI Machine", basePointsMultiplier: 2.2, keyFeat: "47 HR, .373 AVG, 173 RBI, AL MVP" },
  { rank: 8, playerName: "Lou Gehrig", season: 1930, position: "1B", war: 10.2, archetype: "Slash-Line Master", basePointsMultiplier: 2.1, keyFeat: "41 HR, .379 AVG, 173 RBI, .473 OBP" },
  { rank: 9, playerName: "Alex Rodriguez", season: 2007, position: "3B", war: 9.4, archetype: "Peak Production", basePointsMultiplier: 2.1, keyFeat: "54 HR, 156 RBI, 143 R, AL MVP" },
  { rank: 10, playerName: "Rickey Henderson", season: 1985, position: "LF", war: 9.9, archetype: "Stolen Base Terror", basePointsMultiplier: 2.0, keyFeat: "80 SB, 24 HR, 146 R, Leadoff God" },
  { rank: 11, playerName: "Babe Ruth", season: 1928, position: "RF", war: 10.1, archetype: "Late-Era Slugger", basePointsMultiplier: 2.0, keyFeat: "54 HR, 146 RBI, .709 SLG" },
  { rank: 12, playerName: "Lou Gehrig", season: 1934, position: "1B", war: 10.0, archetype: "Triple Crown Anchor", basePointsMultiplier: 1.9, keyFeat: "49 HR, .363 AVG, 166 RBI, Triple Crown" },
  { rank: 13, playerName: "Mickey Mantle", season: 1961, position: "CF", war: 10.4, archetype: "Home Run Chase", basePointsMultiplier: 1.9, keyFeat: "54 HR, .687 SLG, M&M Boys Legend" },
  { rank: 14, playerName: "Joe Gordon", season: 1942, position: "2B", war: 8.2, archetype: "Clutch Profiler", basePointsMultiplier: 1.8, keyFeat: "18 HR, 103 RBI, AL MVP 2B" },
  { rank: 15, playerName: "Joe DiMaggio", season: 1941, position: "CF", war: 9.0, archetype: "The 56-Game Streak", basePointsMultiplier: 1.8, keyFeat: "56-Game Hit Streak, 30 HR, 125 RBI, MVP" },
  { rank: 16, playerName: "Lou Gehrig", season: 1931, position: "1B", war: 9.3, archetype: "Consistent Excellence", basePointsMultiplier: 1.7, keyFeat: "46 HR, 185 RBI (AL Record)" },
  { rank: 17, playerName: "Mickey Mantle", season: 1955, position: "CF", war: 9.5, archetype: "Dynamic Centerfielder", basePointsMultiplier: 1.7, keyFeat: "37 HR, .306 AVG, 113 BB, 1.042 OPS" },
  { rank: 18, playerName: "Alex Rodriguez", season: 2005, position: "SS", war: 9.4, archetype: "MVP Range Specialist", basePointsMultiplier: 1.6, keyFeat: "48 HR, 130 RBI, 124 R, AL MVP" },
  { rank: 19, playerName: "Robinson Canó", season: 2012, position: "2B", war: 8.4, archetype: "Silken Swing 2B", basePointsMultiplier: 1.6, keyFeat: "33 HR, .313 AVG, 48 2B, Gold Glove" },
  { rank: 20, playerName: "Don Mattingly", season: 1986, position: "1B", war: 8.2, archetype: "Hit-Tool Maestro", basePointsMultiplier: 1.5, keyFeat: "238 H, 31 HR, 53 2B, .352 AVG" },
  { rank: 21, playerName: "Graig Nettles", season: 1972, position: "3B", war: 8.2, archetype: "Hot-Corner Glove", basePointsMultiplier: 1.5, keyFeat: "28 HR, 86 RBI, Legendary 3B Glove" },
  { rank: 22, playerName: "Ron Guidry", season: 1978, position: "SP", war: 9.6, archetype: "Louisiana Lightning", basePointsMultiplier: 1.5, keyFeat: "25-3, 1.74 ERA, 248 SO, Cy Young" },
  { rank: 23, playerName: "Whitey Ford", season: 1954, position: "SP", war: 8.5, archetype: "Ace Command", basePointsMultiplier: 1.4, keyFeat: "16-8, 2.82 ERA, WS Ace Hurler" },
  { rank: 24, playerName: "Derek Jeter", season: 1999, position: "SS", war: 7.5, archetype: "Captain Clutch", basePointsMultiplier: 1.4, keyFeat: "219 H, 24 HR, .349 AVG, WS Champion" },
  { rank: 25, playerName: "Aaron Judge", season: 2024, position: "CF", war: 10.9, archetype: "Modern OPS God", basePointsMultiplier: 2.5, keyFeat: "58 HR, .322 AVG, 144 RBI, 1.159 OPS" }
];

export const ORIOLES_TOP_25: LegendCardConfig[] = [
  { rank: 1, playerName: "Cal Ripken Jr.", season: 1991, position: "SS", war: 11.5, archetype: "Iron Man Apex", basePointsMultiplier: 2.5, keyFeat: "34 HR, .323 AVG, 114 RBI, AL MVP & Gold Glove" },
  { rank: 2, playerName: "Brooks Robinson", season: 1964, position: "3B", war: 8.0, archetype: "Vacuum Hot Corner", basePointsMultiplier: 2.3, keyFeat: "28 HR, .317 AVG, 118 RBI, AL MVP" },
  { rank: 3, playerName: "Jim Palmer", season: 1975, position: "SP", war: 8.4, archetype: "High Heat Ace", basePointsMultiplier: 2.3, keyFeat: "23-11, 2.09 ERA, 10 SHO, Cy Young" },
  { rank: 4, playerName: "Frank Robinson", season: 1966, position: "RF", war: 7.7, archetype: "Triple Crown Victor", basePointsMultiplier: 2.2, keyFeat: "49 HR, .316 AVG, 122 RBI, Triple Crown & MVP" },
  { rank: 5, playerName: "Cal Ripken Jr.", season: 1983, position: "SS", war: 8.2, archetype: "World Series Champion MVP", basePointsMultiplier: 2.2, keyFeat: "27 HR, .318 AVG, 102 RBI, AL MVP" },
  { rank: 6, playerName: "Mike Mussina", season: 1992, position: "SP", war: 8.2, archetype: "Knuckle-Curve Surgeon", basePointsMultiplier: 2.1, keyFeat: "18-5, 2.54 ERA, 1.08 WHIP" },
  { rank: 7, playerName: "Eddie Murray", season: 1984, position: "1B", war: 7.3, archetype: "Steady Eddie Switch-Hitter", basePointsMultiplier: 2.1, keyFeat: "29 HR, .306 AVG, 110 RBI, .410 OBP" },
  { rank: 8, playerName: "Gunnar Henderson", season: 2024, position: "SS", war: 9.1, archetype: "Five-Tool Prodigy", basePointsMultiplier: 2.1, keyFeat: "37 HR, 21 SB, .893 OPS, Silver Slugger" },
  { rank: 9, playerName: "Brady Anderson", season: 1996, position: "CF", war: 7.0, archetype: "50-Homer Leadoff Anomaly", basePointsMultiplier: 2.0, keyFeat: "50 HR, 110 RBI, 21 SB, 117 R" },
  { rank: 10, playerName: "Paul Blair", season: 1969, position: "CF", war: 6.8, archetype: "Gold Glove Shallow CF", basePointsMultiplier: 2.0, keyFeat: "26 HR, .285 AVG, Platinum Range" },
  { rank: 11, playerName: "Manny Machado", season: 2013, position: "3B", war: 6.7, archetype: "Platinum Range Cannon", basePointsMultiplier: 1.9, keyFeat: "51 2B, 14 HR, Platinum Glove at Age 20" },
  { rank: 12, playerName: "Chris Davis", season: 2013, position: "1B", war: 7.0, archetype: "Crush Raw Power", basePointsMultiplier: 1.9, keyFeat: "53 HR, 138 RBI, .634 SLG, MLB HR Leader" },
  { rank: 13, playerName: "Jim Palmer", season: 1973, position: "SP", war: 6.9, archetype: "Cy Young Rotation Anchor", basePointsMultiplier: 1.8, keyFeat: "22-9, 2.40 ERA, 19 CG, Cy Young" },
  { rank: 14, playerName: "Dave McNally", season: 1969, position: "SP", war: 6.4, archetype: "20-Win Postseason Lefty", basePointsMultiplier: 1.8, keyFeat: "20-7, 2.79 ERA, 15 CG, 4 SHO" },
  { rank: 15, playerName: "Mike Cuellar", season: 1969, position: "SP", war: 6.1, archetype: "Screwball Artist", basePointsMultiplier: 1.7, keyFeat: "23-11, 2.38 ERA, Cy Young Co-Winner" },
  { rank: 16, playerName: "Ken Singleton", season: 1979, position: "RF", war: 5.8, archetype: "Disciplined Switch-Bat", basePointsMultiplier: 1.7, keyFeat: "35 HR, 111 RBI, 109 BB, .405 OBP" },
  { rank: 17, playerName: "Rafael Palmeiro", season: 1998, position: "1B", war: 6.3, archetype: "Sweet Stroke 1B", basePointsMultiplier: 1.6, keyFeat: "43 HR, .296 AVG, 121 RBI, Gold Glove" },
  { rank: 18, playerName: "Corbin Burnes", season: 2024, position: "SP", war: 5.4, archetype: "Cutter Ace Machine", basePointsMultiplier: 1.6, keyFeat: "15-9, 2.92 ERA, 181 SO, 194.1 IP" },
  { rank: 19, playerName: "Steve Stone", season: 1980, position: "SP", war: 5.3, archetype: "Curveball 25-Game Winner", basePointsMultiplier: 1.5, keyFeat: "25-7, 3.23 ERA, AL Cy Young" },
  { rank: 20, playerName: "Adley Rutschman", season: 2023, position: "C", war: 5.1, archetype: "Switch-Hitting Field General", basePointsMultiplier: 1.5, keyFeat: "20 HR, 92 BB, .277 AVG, All-Star" },
  { rank: 21, playerName: "Boog Powell", season: 1970, position: "1B", war: 5.1, archetype: "World Series MVP Slugger", basePointsMultiplier: 1.5, keyFeat: "35 HR, .297 AVG, 114 RBI, AL MVP" },
  { rank: 22, playerName: "Mark Belanger", season: 1976, position: "SS", war: 4.8, archetype: "The Blade Defensive King", basePointsMultiplier: 1.4, keyFeat: "8 Gold Gloves, +35 Defensive Runs Saved" },
  { rank: 23, playerName: "Al Bumbry", season: 1980, position: "CF", war: 4.8, archetype: "The Bee Table Setter", basePointsMultiplier: 1.4, keyFeat: "205 H, 44 SB, 118 R, .318 AVG" },
  { rank: 24, playerName: "Gregg Olson", season: 1989, position: "RP", war: 3.5, archetype: "Downer Curve Closer", basePointsMultiplier: 1.4, keyFeat: "27 SV, 1.69 ERA, 90 SO, AL ROY" },
  { rank: 25, playerName: "B.J. Surhoff", season: 1999, position: "LF", war: 4.3, archetype: "Iron-Grit Contact Machine", basePointsMultiplier: 1.3, keyFeat: "28 HR, 107 RBI, .284 AVG, 184 H" }
];

export const RED_SOX_TOP_25: LegendCardConfig[] = [
  { rank: 1, playerName: "Carl Yastrzemski", season: 1967, position: "LF", war: 12.5, archetype: "Triple Crown Impossible Dream", basePointsMultiplier: 2.5, keyFeat: "44 HR, .326 AVG, 121 RBI, AL MVP" },
  { rank: 2, playerName: "Pedro Martinez", season: 2000, position: "SP", war: 11.7, archetype: "Untouchable WHIP King", basePointsMultiplier: 2.5, keyFeat: "18-6, 1.74 ERA, 284 SO, 0.74 WHIP (MLB Record)" },
  { rank: 3, playerName: "Pedro Martinez", season: 1999, position: "SP", war: 10.7, archetype: "Peak Strikeout Fire", basePointsMultiplier: 2.4, keyFeat: "23-4, 2.07 ERA, 313 SO, Cy Young" },
  { rank: 4, playerName: "Ted Williams", season: 1946, position: "LF", war: 10.6, archetype: "Splendid Splinter", basePointsMultiplier: 2.4, keyFeat: "38 HR, .342 AVG, 156 BB, .497 OBP, AL MVP" },
  { rank: 5, playerName: "Ted Williams", season: 1941, position: "LF", war: 10.4, archetype: "The .406 Legend", basePointsMultiplier: 2.3, keyFeat: ".406 AVG, 37 HR, 120 RBI, .553 OBP" },
  { rank: 6, playerName: "Mookie Betts", season: 2018, position: "RF", war: 10.7, archetype: "Five-Tool MVP Champion", basePointsMultiplier: 2.3, keyFeat: "32 HR, .346 AVG, 30 SB, AL MVP, WS Ring" },
  { rank: 7, playerName: "Roger Clemens", season: 1990, position: "SP", war: 10.4, archetype: "The Rocket Command", basePointsMultiplier: 2.2, keyFeat: "21-6, 1.93 ERA, 209 SO, Cy Young" },
  { rank: 8, playerName: "Roger Clemens", season: 1986, position: "SP", war: 8.9, archetype: "20-Strikeout Phenom", basePointsMultiplier: 2.2, keyFeat: "24-4, 2.48 ERA, 238 SO, AL MVP & Cy Young" },
  { rank: 9, playerName: "Wade Boggs", season: 1985, position: "3B", war: 9.1, archetype: "240-Hit Hit Collector", basePointsMultiplier: 2.1, keyFeat: "240 H, .368 AVG, .450 OBP, Batting Title" },
  { rank: 10, playerName: "Tris Speaker", season: 1912, position: "CF", war: 10.1, archetype: "The Grey Eagle", basePointsMultiplier: 2.1, keyFeat: "53 2B, .383 AVG, 52 SB, AL MVP" },
  { rank: 11, playerName: "Jim Rice", season: 1978, position: "LF", war: 7.6, archetype: "400 Total Bases Terror", basePointsMultiplier: 2.0, keyFeat: "46 HR, 139 RBI, 406 TB, AL MVP" },
  { rank: 12, playerName: "Nomar Garciaparra", season: 2000, position: "SS", war: 7.4, archetype: "Back-to-Back Batting King", basePointsMultiplier: 2.0, keyFeat: ".372 AVG, 21 HR, 51 2B, Batting Title" },
  { rank: 13, playerName: "Fred Lynn", season: 1975, position: "CF", war: 7.4, archetype: "Rookie MVP Miracle", basePointsMultiplier: 1.9, keyFeat: "21 HR, 47 2B, .331 AVG, ROY & MVP" },
  { rank: 14, playerName: "Carlton Fisk", season: 1972, position: "C", war: 7.3, archetype: "Pudge Backstop Wall", basePointsMultiplier: 1.9, keyFeat: "22 HR, 9 3B, Gold Glove Catcher, ROY" },
  { rank: 15, playerName: "David Ortiz", season: 2006, position: "DH", war: 5.8, archetype: "Big Papi Walk-Off Clutch", basePointsMultiplier: 1.8, keyFeat: "54 HR (Team Record), 137 RBI, 1.049 OPS" },
  { rank: 16, playerName: "Dustin Pedroia", season: 2008, position: "2B", war: 6.9, archetype: "Laser Show Grinder", basePointsMultiplier: 1.8, keyFeat: "213 H, 54 2B, .326 AVG, AL MVP" },
  { rank: 17, playerName: "Rico Petrocelli", season: 1969, position: "SS", war: 8.1, archetype: "40-Homer Shortstop", basePointsMultiplier: 1.7, keyFeat: "40 HR, 97 RBI, 98 BB, .403 OBP" },
  { rank: 18, playerName: "Babe Ruth", season: 1916, position: "SP", war: 8.8, archetype: "Southpaw Mound Ace", basePointsMultiplier: 1.7, keyFeat: "23-12, 1.75 ERA, 9 SHO, World Series Win" },
  { rank: 19, playerName: "Jarren Duran", season: 2024, position: "CF", war: 8.7, archetype: "All-Star Speedster", basePointsMultiplier: 1.6, keyFeat: "48 2B, 14 3B, 21 HR, 34 SB, ASG MVP" },
  { rank: 20, playerName: "Ellis Burks", season: 1990, position: "CF", war: 5.9, archetype: "Five-Tool Centerfielder", basePointsMultiplier: 1.6, keyFeat: "21 HR, 89 RBI, Gold Glove & Silver Slugger" },
  { rank: 21, playerName: "Jonathan Papelbon", season: 2006, position: "RP", war: 5.0, archetype: "Sub-1.00 ERA Closer", basePointsMultiplier: 1.5, keyFeat: "35 SV, 0.92 ERA, 0.78 WHIP" },
  { rank: 22, playerName: "Curt Schilling", season: 2004, position: "SP", war: 4.4, archetype: "Bloody Sock Postseason Hero", basePointsMultiplier: 1.5, keyFeat: "21-6, 3.26 ERA, Postseason Legend" },
  { rank: 23, playerName: "Manny Ramirez", season: 2004, position: "LF", war: 4.1, archetype: "World Series MVP Hitter", basePointsMultiplier: 1.4, keyFeat: "43 HR, 130 RBI, WS MVP, Pure Stroke" },
  { rank: 24, playerName: "Mo Vaughn", season: 1995, position: "1B", war: 4.3, archetype: "Hit Dog Power", basePointsMultiplier: 1.4, keyFeat: "39 HR, 126 RBI, .300 AVG, AL MVP" },
  { rank: 25, playerName: "Rafael Devers", season: 2021, position: "3B", war: 4.4, archetype: "Baby Faced Assassin", basePointsMultiplier: 1.4, keyFeat: "38 HR, 113 RBI, 37 2B, Silver Slugger" }
];

export const DODGERS_TOP_25: LegendCardConfig[] = [
  { rank: 1, playerName: "Sandy Koufax", season: 1965, position: "SP", war: 10.7, archetype: "Left Arm of God", basePointsMultiplier: 2.5, keyFeat: "26-8, 2.04 ERA, 382 SO (NL Record), Perfect Game" },
  { rank: 2, playerName: "Sandy Koufax", season: 1966, position: "SP", war: 10.3, archetype: "Triple Crown Finale", basePointsMultiplier: 2.4, keyFeat: "27-9, 1.73 ERA, 317 SO, Triple Crown Cy Young" },
  { rank: 3, playerName: "Jackie Robinson", season: 1949, position: "2B", war: 9.3, archetype: "Barrier Breaker MVP", basePointsMultiplier: 2.4, keyFeat: "16 HR, .342 AVG, 124 RBI, 37 SB, NL MVP" },
  { rank: 4, playerName: "Shohei Ohtani", season: 2024, position: "DH", war: 9.2, archetype: "50/50 Pioneer", basePointsMultiplier: 2.4, keyFeat: "54 HR, 59 SB, 130 RBI, Historic 50/50 Club" },
  { rank: 5, playerName: "Duke Snider", season: 1953, position: "CF", war: 9.2, archetype: "Duke of Flatbush", basePointsMultiplier: 2.3, keyFeat: "42 HR, 126 RBI, 132 R, .336 AVG" },
  { rank: 6, playerName: "Clayton Kershaw", season: 2013, position: "SP", war: 8.4, archetype: "12-6 Curveball Master", basePointsMultiplier: 2.2, keyFeat: "16-9, 1.83 ERA, 232 SO, Cy Young" },
  { rank: 7, playerName: "Clayton Kershaw", season: 2014, position: "SP", war: 7.7, archetype: "MVP & Cy Young Double", basePointsMultiplier: 2.2, keyFeat: "21-3, 1.77 ERA, 239 SO, 0.86 WHIP, NL MVP" },
  { rank: 8, playerName: "Adrian Beltre", season: 2004, position: "3B", war: 9.6, archetype: "Hot Corner Gold Standard", basePointsMultiplier: 2.1, keyFeat: "48 HR, 121 RBI, .334 AVG, Platinum Glove" },
  { rank: 9, playerName: "Mike Piazza", season: 1997, position: "C", war: 8.7, archetype: "Offensive Catcher Apex", basePointsMultiplier: 2.1, keyFeat: "40 HR, 124 RBI, .362 AVG, .431 OBP" },
  { rank: 10, playerName: "Orel Hershiser", season: 1988, position: "SP", war: 7.2, archetype: "Bulldog 59-Inning Streak", basePointsMultiplier: 2.0, keyFeat: "59 Consecutive Scoreless IP, Cy Young, WS MVP" },
  { rank: 11, playerName: "Roy Campanella", season: 1953, position: "C", war: 7.1, archetype: "142-RBI Backstop Legend", basePointsMultiplier: 2.0, keyFeat: "41 HR, 142 RBI (Catcher Record), NL MVP" },
  { rank: 12, playerName: "Davey Lopes", season: 1979, position: "2B", war: 6.7, archetype: "Power-Speed Catalyst", basePointsMultiplier: 1.9, keyFeat: "28 HR, 44 SB, 109 R, All-Star" },
  { rank: 13, playerName: "Pee Wee Reese", season: 1949, position: "SS", war: 6.5, archetype: "Captain of the Boys of Summer", basePointsMultiplier: 1.9, keyFeat: "16 HR, 116 BB, .396 OBP, Shortstop General" },
  { rank: 14, playerName: "Kirk Gibson", season: 1988, position: "LF", war: 6.5, archetype: "Clutch Fist-Pump Icon", basePointsMultiplier: 1.8, keyFeat: "25 HR, 31 SB, NL MVP, Legendary Walk-Off" },
  { rank: 15, playerName: "Freddie Freeman", season: 2023, position: "1B", war: 6.5, archetype: "59-Double Machine", basePointsMultiplier: 1.8, keyFeat: "211 H, 59 2B, 29 HR, 23 SB, .331 AVG" },
  { rank: 16, playerName: "Zack Greinke", season: 2015, position: "SP", war: 9.3, archetype: "1.66 ERA Precision", basePointsMultiplier: 1.8, keyFeat: "19-3, 1.66 ERA, 0.84 WHIP, 45.2 Scoreless IP" },
  { rank: 17, playerName: "Don Drysdale", season: 1968, position: "SP", war: 6.2, archetype: "Sidearm Intimidation", basePointsMultiplier: 1.7, keyFeat: "58.2 Scoreless Innings, 8 Shutouts" },
  { rank: 18, playerName: "Walker Buehler", season: 2021, position: "SP", war: 6.2, archetype: "Big-Game Flame Thrower", basePointsMultiplier: 1.7, keyFeat: "16-4, 2.47 ERA, 212 SO" },
  { rank: 19, playerName: "Ron Cey", season: 1977, position: "3B", war: 5.8, archetype: "The Penguin Power", basePointsMultiplier: 1.6, keyFeat: "30 HR, 110 RBI, World Series Co-MVP" },
  { rank: 20, playerName: "Gil Hodges", season: 1954, position: "1B", war: 5.5, archetype: "Iron-Grip First Base", basePointsMultiplier: 1.6, keyFeat: "42 HR, 130 RBI, .304 AVG" },
  { rank: 21, playerName: "Fernando Valenzuela", season: 1981, position: "SP", war: 4.8, archetype: "Fernandomania Screwball", basePointsMultiplier: 1.5, keyFeat: "13-7, 2.48 ERA, 8 SHO, ROY & Cy Young" },
  { rank: 22, playerName: "Don Newcombe", season: 1956, position: "SP", war: 4.8, archetype: "First Triple Award Winner", basePointsMultiplier: 1.5, keyFeat: "27-7, 3.06 ERA, Cy Young & MVP" },
  { rank: 23, playerName: "Steve Garvey", season: 1974, position: "1B", war: 4.4, archetype: "Mr. Clean 200 Hits", basePointsMultiplier: 1.4, keyFeat: "21 HR, 111 RBI, .312 AVG, 200 H, NL MVP" },
  { rank: 24, playerName: "Eric Gagne", season: 2003, position: "RP", war: 3.7, archetype: "Game Over 84-Save Streak", basePointsMultiplier: 1.4, keyFeat: "55/55 Saves, 1.20 ERA, 137 SO, Cy Young" },
  { rank: 25, playerName: "Mookie Betts", season: 2020, position: "RF", war: 3.6, archetype: "Championship Culture Shift", basePointsMultiplier: 1.4, keyFeat: "16 HR, 10 SB, Gold Glove, WS Ring" }
];

// Helper to fetch any franchise's top 25 single-season WAR records
export function getFranchiseTop25War(teamName: string): LegendCardConfig[] {
  if (teamName.includes('Yankees') || teamName === 'New York Yankees') return YANKEES_TOP_25;
  if (teamName.includes('Orioles') || teamName === 'Baltimore Orioles') return ORIOLES_TOP_25;
  if (teamName.includes('Red Sox') || teamName === 'Boston Red Sox') return RED_SOX_TOP_25;
  if (teamName.includes('Dodgers') || teamName === 'Los Angeles Dodgers') return DODGERS_TOP_25;

  // Fallback generator for other teams with realistic single season records
  const sampleRoster = [
    { name: "Franchise Legend #1", pos: "CF", peakWar: 10.4, arch: "All-Time Anchor" },
    { name: "Franchise Legend #2", pos: "SP", peakWar: 9.8, arch: "Ace Hurler" },
    { name: "Franchise Legend #3", pos: "RF", peakWar: 9.1, arch: "Cleanup Slugger" },
    { name: "Franchise Legend #4", pos: "3B", peakWar: 8.6, arch: "Hot Corner Glove" },
    { name: "Franchise Legend #5", pos: "SS", peakWar: 8.2, arch: "Range General" },
  ];

  return Array.from({ length: 25 }, (_, i) => {
    const template = sampleRoster[i % sampleRoster.length];
    const calcWar = Math.max(4.0, +(template.peakWar - i * 0.24).toFixed(1));
    return {
      rank: i + 1,
      playerName: `${teamName} Legend #${i + 1}`,
      season: 2024 - (i * 3 + 1),
      position: template.pos,
      war: calcWar,
      archetype: template.arch,
      basePointsMultiplier: +(Math.max(1.2, 2.5 - i * 0.05).toFixed(1)),
      keyFeat: `Single-Season WAR: ${calcWar} • Franchise Rank #${i + 1}`
    };
  });
}
