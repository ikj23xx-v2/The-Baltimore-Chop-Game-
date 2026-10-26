import { NonPlayerCard, TaskRequirement } from '../types/game';
import { EquipmentCard } from '../types/equipment';

export const INITIAL_EQUIPMENT_CARDS: NonPlayerCard[] = [
  // ==========================================
  // BATTING GLOVES
  // ==========================================
  {
    id: 'EQ_BG_01',
    name: 'Franklin Pro Classic Cabretta Batting Gloves',
    type: 'BATTING_GLOVES',
    rarity: 'RARE',
    description: '+6 Contact and +15% grip friction on inside fastballs.',
    lore: 'The classic one-piece spandex back with Pittards Digital sheepskin palm chosen by Hall of Famers since 1983.',
    icon: '🧤',
    buffStats: { contactBonus: 6, chopBounceBonus: 12 },
    equipped: true
  },
  {
    id: 'EQ_BG_02',
    name: 'Bruce Bolt Premium Pro Gold Series Gloves',
    type: 'BATTING_GLOVES',
    rarity: 'LEGENDARY',
    description: '+8 Power, +5 Contact, and eliminates bat sting on mis-hits.',
    lore: '0.9mm handmade Cabretta leather with conical wrist wrap technology designed to prevent wrist roll during high-torque swings.',
    icon: '⚡',
    buffStats: { powerBonus: 8, contactBonus: 5 },
    equipped: false
  },
  {
    id: 'EQ_BG_03',
    name: 'Marucci Pittards Reserve Batting Gloves',
    type: 'BATTING_GLOVES',
    rarity: 'COMMON',
    description: '+4 Contact on 2-strike counts.',
    lore: 'Breathable diamond stretch mesh back with sheepskin palm for pure barrel tactile feedback.',
    icon: '🧤',
    buffStats: { contactBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_BG_04',
    name: 'Nike Huarache Elite Pro Batting Gloves',
    type: 'BATTING_GLOVES',
    rarity: 'RARE',
    description: '+5 Contact and +8% exit velocity off breaking pitches.',
    lore: 'Engineered chrome accents and textured leather palms crafted for big-league leadoff catalysts.',
    icon: '👟',
    buffStats: { contactBonus: 5, speedBonus: 3 },
    equipped: false
  },

  // ==========================================
  // FIELDING GLOVES
  // ==========================================
  {
    id: 'EQ_GL_01',
    name: 'Rawlings Heart of the Hide 11.5" Pro I-Web',
    type: 'FIELDING_GLOVE',
    rarity: 'RARE',
    description: '+7 Fielding and accelerates double-play transfer speed by 25%.',
    lore: 'Cut from the top 5% of steer hides. The quintessential middle-infield leather of gold glovers for seven decades.',
    icon: '⚾',
    buffStats: { fieldingBonus: 7, chopBounceBonus: 15 },
    equipped: true
  },
  {
    id: 'EQ_GL_02',
    name: 'Wilson A2000 1786 11.5" Infield Glove',
    type: 'FIELDING_GLOVE',
    rarity: 'LEGENDARY',
    description: '+9 Fielding, +4 Contact composure, and shallow pocket snap.',
    lore: 'Pro Stock leather with Dual Welting that retains its shape through hundreds of diving backhands in October.',
    icon: '🛡️',
    buffStats: { fieldingBonus: 9, contactBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_GL_03',
    name: 'Brooks Robinson Gold Trapper 3B Glove',
    type: 'FIELDING_GLOVE',
    rarity: 'VINTAGE',
    description: '+10 Fielding and vacuums up all groundballs hit down the third base line.',
    lore: 'Custom pocket replica of the 16-time Gold Glover who turned third base into a fortress during the 1970 World Series.',
    icon: '🧤',
    buffStats: { fieldingBonus: 10, contactBonus: 6 },
    equipped: false
  },
  {
    id: 'EQ_GL_04',
    name: 'All-Star Pro Elite 33.5" Catcher\'s Mitt',
    type: 'FIELDING_GLOVE',
    rarity: 'RARE',
    description: '+6 Pitch Framing Control and steals bottom-edge strikes.',
    lore: 'Japanese tanned steerhide that produces an audible pop pitchers love on low-and-away fastballs.',
    icon: '🥊',
    buffStats: { controlBonus: 6, pitchHintAccuracy: 12 },
    equipped: false
  },
  {
    id: 'EQ_GL_05',
    name: 'Wilson A2K 2820 12.25" First Base Mitt',
    type: 'FIELDING_GLOVE',
    rarity: 'RARE',
    description: '+6 Fielding on errant dirt throws from shortstop.',
    lore: 'Double Palm construction provides pocket stability for scooping short-hops in high-leverage innings.',
    icon: '🦞',
    buffStats: { fieldingBonus: 6 },
    equipped: false
  },

  // ==========================================
  // GAME-USED & PRO BATS
  // ==========================================
  {
    id: 'EQ_BAT_01',
    name: 'Victus V243 Pro Reserve Hard Maple Bat (33.5")',
    type: 'BAT',
    rarity: 'RARE',
    description: '+9 Power and +3.5 mph exit velocity on pull-side drives.',
    lore: 'End-loaded monster cut from rock maple with a high-gloss finish designed for middle-of-the-order sluggers.',
    icon: '🏏',
    buffStats: { powerBonus: 9 },
    equipped: true
  },
  {
    id: 'EQ_BAT_02',
    name: 'Marucci AP5 Pro Model Maple Bat',
    type: 'BAT',
    rarity: 'LEGENDARY',
    description: '+8 Power, +5 Contact, and expanded sweet spot barrel.',
    lore: 'Tapered knob and flared handle favored by modern home run champions for barrel whip through the hitting zone.',
    icon: '🏏',
    buffStats: { powerBonus: 8, contactBonus: 5 },
    equipped: false
  },
  {
    id: 'EQ_BAT_03',
    name: 'Louisville Slugger Prime C271 Birch Bat',
    type: 'BAT',
    rarity: 'RARE',
    description: '+7 Contact, +4 Speed, and supreme bat-to-ball flex.',
    lore: 'Balanced swing weight with MLB prime grade birch that offers more forgiveness on off-center contact.',
    icon: '🏏',
    buffStats: { contactBonus: 7, speedBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_BAT_04',
    name: 'Cupped Maple 33-Inch Bat',
    type: 'BAT',
    rarity: 'COMMON',
    description: '+5 Power on pitches in the upper third.',
    lore: 'Dense rock maple crafted with a deep cup for maximum whip through the hitting zone.',
    icon: '🏏',
    buffStats: { powerBonus: 5 },
    equipped: false
  },
  {
    id: 'EQ_BAT_05',
    name: 'Old Hickory MT27 Flared Profile Bat',
    type: 'BAT',
    rarity: 'LEGENDARY',
    description: '+10 Power and generates explosive flyball carry into the power alleys.',
    lore: 'Hand-split steel-pressed wood favored by generational MVP centerfielders.',
    icon: '🏏',
    buffStats: { powerBonus: 10, chopBounceBonus: 10 },
    equipped: false
  },

  // ==========================================
  // CLEATS & RUNNING GEAR
  // ==========================================
  {
    id: 'EQ_CL_01',
    name: 'New Balance Fresh Foam 3000v6 Metal Cleats',
    type: 'CLEATS',
    rarity: 'RARE',
    description: '+6 Speed on basepaths and improves jump on stolen base attempts.',
    lore: 'Plush Fresh Foam cushioning with an 8-spike configuration tuned for first-step acceleration.',
    icon: '👟',
    buffStats: { speedBonus: 6 },
    equipped: false
  },
  {
    id: 'EQ_CL_02',
    name: 'Nike Vapor Ultrafly 4 Keystone Metal Spikes',
    type: 'CLEATS',
    rarity: 'LEGENDARY',
    description: '+8 Speed, +4 Fielding range, and cuts tight turns around second base.',
    lore: 'Ultralight hybrid plate engineered for maximum traction on clay and artificial turf.',
    icon: '⚡',
    buffStats: { speedBonus: 8, fieldingBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_CL_03',
    name: 'Under Armour Harper 8 Low ST Cleats',
    type: 'CLEATS',
    rarity: 'RARE',
    description: '+5 Power and torque stability when planting back foot.',
    lore: 'Charged Cushioning midsole that converts impact energy into rotational swing power.',
    icon: '👟',
    buffStats: { powerBonus: 5, speedBonus: 3 },
    equipped: false
  },

  // ==========================================
  // PROTECTIVE ARMOR & GUARDS
  // ==========================================
  {
    id: 'EQ_AR_01',
    name: 'EvoShield Pro-SRZ 2.0 Batter\'s Elbow Guard',
    type: 'ARMOR',
    rarity: 'RARE',
    description: '+5 Contact confidence against inside 99+ mph sinkers.',
    lore: 'Gel-to-Shell custom molding technology that transforms from soft gel to protective shield in 30 minutes.',
    icon: '🛡️',
    buffStats: { contactBonus: 5 },
    equipped: false
  },
  {
    id: 'EQ_AR_02',
    name: 'EvoShield Pro-SRZ Batter\'s Leg & Shin Guard',
    type: 'ARMOR',
    rarity: 'COMMON',
    description: 'Prevents foul-ball sting and protects front lead foot.',
    lore: 'Full-coverage ergonomic protection against 100 mph foul balls off the shin bone.',
    icon: '🦵',
    buffStats: { contactBonus: 3 },
    equipped: false
  },
  {
    id: 'EQ_AR_03',
    name: 'Bruce Bolt Protective Sliding Mitt (The Oven Mitt)',
    type: 'ARMOR',
    rarity: 'RARE',
    description: '+6 Stolen Base success and prevents hand jam on head-first dives.',
    lore: 'Reinforced thermoplastic plates protecting wrist and fingers during aggressive head-first slides.',
    icon: '🧤',
    buffStats: { speedBonus: 6 },
    equipped: false
  },
  {
    id: 'EQ_AR_04',
    name: 'Pro C-Flap Extended Ear Helmet Flap',
    type: 'ARMOR',
    rarity: 'RARE',
    description: '+4 Contact against high-and-tight brushback fastballs.',
    lore: 'Lexan resin face protection giving hitters fear-free plate discipline against high-spin relievers.',
    icon: '🪖',
    buffStats: { contactBonus: 4, pitchHintAccuracy: 10 },
    equipped: false
  },

  // ==========================================
  // GAME-USED RELICS & HISTORICAL ARTIFACTS
  // ==========================================
  {
    id: 'EQ_RELIC_01',
    name: '1970 Memorial Stadium Infield Clay Relic Jar',
    type: 'RELIC',
    rarity: 'VINTAGE',
    description: 'Increases Baltimore Chop bounce height by +40% and adds +6 Contact.',
    lore: 'Authentic clay scooped from the 33rd Street shortstop dirt where Mark Belanger and Brooks Robinson turned historic double plays.',
    icon: '🏺',
    buffStats: { chopBounceBonus: 40, contactBonus: 6 },
    relicDetails: {
      gameDate: 'October 15, 1970',
      authenticationId: 'CHOP-RELIC-1970-DIRT',
      materialType: 'Ballpark Clay Soil',
      gameLocation: 'Memorial Stadium, Baltimore, MD'
    },
    equipped: true
  },
  {
    id: 'EQ_RELIC_02',
    name: 'Babe Ruth Game-Used Ash Bat Wood Sliver Relic',
    type: 'RELIC',
    rarity: 'LEGENDARY',
    description: '+12 Power bonus and unlocks legendary tape-measure flyball distance.',
    lore: 'Certified micro-swatch of genuine 36-ounce hickory ash swung by the Sultan of Swat during the 1923 championship season.',
    icon: '🪵',
    buffStats: { powerBonus: 12 },
    relicDetails: {
      gameDate: 'October 10, 1923',
      authenticationId: 'CHOP-RELIC-1923-RUTH-01',
      materialType: 'Game-Used Hickory Bat Fiber',
      gameLocation: 'Yankee Stadium (The House That Ruth Built)'
    },
    equipped: false
  },
  {
    id: 'EQ_RELIC_03',
    name: 'Cal Ripken Jr. 2,131 Consecutive Game Patch Swatch',
    type: 'RELIC',
    rarity: 'LEGENDARY',
    description: '+8 Contact, +8 Fielding, and eliminates player fatigue decay in Gauntlet Showdown.',
    lore: 'Authentic uniform swatch worn on September 6, 1995, when the Iron Man shattered Lou Gehrig’s record.',
    icon: '🧵',
    buffStats: { contactBonus: 8, fieldingBonus: 8 },
    relicDetails: {
      gameDate: 'September 6, 1995',
      authenticationId: 'CHOP-RELIC-2131-RIPKEN',
      materialType: 'Game-Worn Knit Jersey Swatch',
      gameLocation: 'Oriole Park at Camden Yards'
    },
    equipped: false
  },
  {
    id: 'EQ_RELIC_04',
    name: 'Jackie Robinson Ebbets Field Dugout Bench Splinter',
    type: 'RELIC',
    rarity: 'LEGENDARY',
    description: '+10 Speed, +6 Contact, and +2.0x Momentum bonus in high-leverage moments.',
    lore: 'Reclaimed wood artifact from the Brooklyn Dodgers home dugout at Bedford and Sullivan St.',
    icon: '🪑',
    buffStats: { speedBonus: 10, contactBonus: 6 },
    relicDetails: {
      gameDate: 'April 15, 1947',
      authenticationId: 'CHOP-RELIC-42-EBBETS',
      materialType: 'Dugout Bench Pine Heartwood',
      gameLocation: 'Ebbets Field, Brooklyn, NY'
    },
    equipped: false
  },
  {
    id: 'EQ_RELIC_05',
    name: '1956 World Series Game 5 Perfect Game Ball Yarn',
    type: 'RELIC',
    rarity: 'VINTAGE',
    description: '+10 Pitch Control and eliminates pitcher walk frequency.',
    lore: 'Yarn strand harvested from an authenticated foul ball from Don Larsen’s 97-pitch October gem.',
    icon: '🧶',
    buffStats: { controlBonus: 10, pitchHintAccuracy: 20 },
    relicDetails: {
      gameDate: 'October 8, 1956',
      authenticationId: 'CHOP-RELIC-1956-LARSEN',
      materialType: 'Rawlings Spalding Wool Yarn',
      gameLocation: 'Yankee Stadium, Bronx, NY'
    },
    equipped: false
  },
  {
    id: 'EQ_RELIC_06',
    name: 'Roberto Clemente Forbes Field Right Field Wall Brick Fragment',
    type: 'RELIC',
    rarity: 'LEGENDARY',
    description: '+8 Fielding, +6 Contact, and triples throw velocity from deep right field.',
    lore: 'Salvaged red masonry brick from the outfield perimeter where The Great One threw out runners at home plate.',
    icon: '🧱',
    buffStats: { fieldingBonus: 8, contactBonus: 6 },
    relicDetails: {
      gameDate: 'October 13, 1960',
      authenticationId: 'CHOP-RELIC-21-FORBES',
      materialType: 'Forbes Field Red Brick',
      gameLocation: 'Forbes Field, Pittsburgh, PA'
    },
    equipped: false
  },

  // ==========================================
  // RITUALS, GRIPS & DUGOUT LORE
  // ==========================================
  {
    id: 'EQ_RITUAL_01',
    name: 'Lizard Skins DSP Ultra 1.1mm Bat Grip Wrap',
    type: 'RITUAL',
    rarity: 'RARE',
    description: '+5 Contact and absorbs vibration in cold night games.',
    lore: 'Durasoft polymer wrap engineered for the perfect balance of cushion and tackiness in wet weather.',
    icon: '🦎',
    buffStats: { contactBonus: 5, chopBounceBonus: 10 },
    equipped: false
  },
  {
    id: 'EQ_RITUAL_02',
    name: 'Pelican Bat Wax Pine Tar Stick',
    type: 'RITUAL',
    rarity: 'COMMON',
    description: '+4 Contact on high-velocity outside pitches.',
    lore: 'All-natural beeswax and pine rosin blend hand-poured in small batches for pro ballplayers.',
    icon: '🪵',
    buffStats: { contactBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_RITUAL_03',
    name: 'Old-School Sticky Pine Tar Rag',
    type: 'RITUAL',
    rarity: 'COMMON',
    description: '+3 Contact and gives the bat handle that authentic amber tack.',
    lore: 'Tacky rag passed around the dugout on humid midsummer doubleheaders.',
    icon: '🧻',
    buffStats: { contactBonus: 3 },
    equipped: false
  },
  {
    id: 'EQ_RITUAL_04',
    name: 'Anti-Glare Carbon Eye Black Strips',
    type: 'RITUAL',
    rarity: 'COMMON',
    description: '+15% Pitch Hint Accuracy against sunny afternoon flyballs.',
    lore: 'Matte carbon glare-reducing strips worn under the eyes to track white baseballs against cloudless skies.',
    icon: '👁️',
    buffStats: { pitchHintAccuracy: 15 },
    equipped: false
  },
  {
    id: 'EQ_RITUAL_05',
    name: 'Double Bubble Pink Dugout Bubblegum Tub',
    type: 'RITUAL',
    rarity: 'COMMON',
    description: '+2 Speed and settles player nerves in extra innings.',
    lore: 'Unending tub of sugary pink gum that keeps the dugout loud and buzzing during late-inning rallies.',
    icon: '🍬',
    buffStats: { speedBonus: 2, contactBonus: 2 },
    equipped: false
  },

  // ==========================================
  // BALLPARKS & STADIUMS
  // ==========================================
  {
    id: 'EQ_STAD_01',
    name: 'Oriole Park at Camden Yards (Eutaw St Warehouse)',
    type: 'STADIUM',
    rarity: 'RARE',
    description: 'Historic warehouse backdrop. Right field pulled fly balls travel +15 extra feet.',
    lore: 'Opened in 1992, the retro-classic ballpark that revolutionized American baseball architecture.',
    icon: '🏟️',
    buffStats: { powerBonus: 5, pitchHintAccuracy: 15 },
    equipped: false
  },
  {
    id: 'EQ_STAD_02',
    name: 'Fenway Park (Green Monster & Pesky Pole)',
    type: 'STADIUM',
    rarity: 'VINTAGE',
    description: '37-foot wall in left transforms routine flyballs into sharp line-drive doubles.',
    lore: 'Built in 1912, home of the legendary hand-operated scoreboard and the red seat in right field.',
    icon: '🧱',
    buffStats: { contactBonus: 7, powerBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_STAD_03',
    name: 'Yankee Stadium (Short Porch in Right)',
    type: 'STADIUM',
    rarity: 'RARE',
    description: 'Right field short porch gives pulled flyballs +18 ft carry for left-handed sluggers.',
    lore: 'Monument Park and cathedral limestone arches where 27 World Championships were forged.',
    icon: '🗽',
    buffStats: { powerBonus: 8 },
    equipped: false
  },
  {
    id: 'EQ_STAD_04',
    name: 'Wrigley Field (Ivy-Covered Brick & W-Flag)',
    type: 'STADIUM',
    rarity: 'VINTAGE',
    description: 'Wind blowing out to Lake Michigan boosts flyball distance by +25 feet.',
    lore: 'The Friendly Confines on Clark and Addison, where the scoreboard is turned by hand under summer sunshine.',
    icon: '🌿',
    buffStats: { powerBonus: 6, contactBonus: 4 },
    equipped: false
  },

  // ==========================================
  // COACHES & SABERMETRIC TACTICIANS
  // ==========================================
  {
    id: 'EQ_COACH_01',
    name: 'Earl Weaver 3-Run Homer Manifesto',
    type: 'COACH',
    rarity: 'VINTAGE',
    description: '+10 Power when base runners are aboard. No sacrifice bunts allowed!',
    lore: 'Earl Weaver famously believed pitching, defense, and the 3-run homer won ballgames.',
    icon: '📋',
    buffStats: { powerBonus: 10 },
    equipped: false
  },
  {
    id: 'EQ_COACH_02',
    name: 'Vintage Pitch Trajectory Ledger',
    type: 'COACH',
    rarity: 'LEGENDARY',
    description: '+25% Dynamic predictive hint accuracy on pitch type and location.',
    lore: 'Handwritten binder documenting sequences, arm slots, and release cues for every opposing hurler.',
    icon: '📓',
    buffStats: { pitchHintAccuracy: 25 },
    equipped: false
  },
  {
    id: 'EQ_COACH_03',
    name: 'Modern Statcast High-Speed Hawkeye Camera Rig',
    type: 'COACH',
    rarity: 'LEGENDARY',
    description: '+30% Pitch break trajectory prediction and reveals optimal swing path zone.',
    lore: '12-camera optical tracking array operating at 300 frames per second to calculate seam orientation and vertical drop.',
    icon: '📹',
    buffStats: { pitchHintAccuracy: 30, contactBonus: 4 },
    equipped: false
  }
];

export const INITIAL_TASKS: TaskRequirement[] = [
  {
    id: 'TASK_01',
    name: 'The Chop Master',
    category: 'CHOP',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardTokens: 2,
    description: 'Hit 3 Baltimore Chops down into the dirt that bounce high for an infield single.'
  },
  {
    id: 'TASK_02',
    name: 'Bleacher Creature',
    category: 'HOMERUN',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    rewardTokens: 2,
    description: 'Crush 2 Home Runs over 400 feet with clean barrel predictions.'
  },
  {
    id: 'TASK_03',
    name: 'Ace Hurler Ks',
    category: 'STRIKEOUT',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    rewardTokens: 1,
    description: 'Record 5 strikeout pitches during showdowns.'
  },
  {
    id: 'TASK_04',
    name: 'Clutch Pennant Streak',
    category: 'SEASON',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardTokens: 3,
    description: 'Win 3 games or series in Franchise mode.'
  }
];

export const TIERED_EQUIPMENT_CARDS: EquipmentCard[] = [
  // BATS
  {
    id: 'TIER_BAT_01',
    name: 'Ash Wood Sanded Fungo Bat',
    category: 'BAT',
    tier: 1,
    statBoosts: { contact: 3 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+3 Contact across all counts.',
    tokenVendingCost: 1,
    icon: '🏏',
    lore: 'Lightweight fungo ash model for contact drilling.'
  },
  {
    id: 'TIER_BAT_02',
    name: 'Victus V243 Pro Maple Sledge',
    category: 'BAT',
    tier: 2,
    statBoosts: { power: 6, contact: 2 },
    environmentalCondition: 'HIGH_LEVERAGE',
    perkDescription: '+6 Power and +2 Contact when tying or go-ahead run is at plate.',
    tokenVendingCost: 3,
    icon: '🏏',
    lore: 'End-loaded powerhouse for clutch moment heroics.'
  },
  {
    id: 'TIER_BAT_03',
    name: 'Old Hickory Flame-Treated MT27',
    category: 'BAT',
    tier: 3,
    statBoosts: { power: 10, contact: 5, discipline: 4 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+10 Power, +5 Contact, +4 Discipline, and eliminates foul-tip strike three.',
    tokenVendingCost: 5,
    icon: '🏏',
    lore: 'Hand-pressed rock maple favored by historic MVP centerfielders.'
  },

  // BATTING GLOVES
  {
    id: 'TIER_BG_01',
    name: 'Franklin Neo Classic Gloves',
    category: 'BATTING_GLOVES',
    tier: 1,
    statBoosts: { contact: 3 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+3 Contact and eliminates bat-handle slip.',
    tokenVendingCost: 1,
    icon: '🧤',
    lore: 'Standard pro issue sheepskin batting gloves.'
  },
  {
    id: 'TIER_BG_02',
    name: 'Bruce Bolt Long Cuff Cabretta',
    category: 'BATTING_GLOVES',
    tier: 2,
    statBoosts: { contact: 5, power: 3 },
    environmentalCondition: 'SUMMER_HEAT',
    perkDescription: '+5 Contact and +3 Power during daytime and summer heat games.',
    tokenVendingCost: 3,
    icon: '⚡',
    lore: 'Double-reinforced palm designed for zero torque loss.'
  },
  {
    id: 'TIER_BG_03',
    name: 'Gold Series 1-of-1 Chrome Cabretta',
    category: 'BATTING_GLOVES',
    tier: 3,
    statBoosts: { contact: 8, power: 6, discipline: 4 },
    environmentalCondition: 'HIGH_LEVERAGE',
    perkDescription: '+8 Contact, +6 Power, and automatic check-swing discipline in 9th inning.',
    tokenVendingCost: 5,
    icon: '🧤',
    lore: 'Hand-tailored for October championship showdowns.'
  },

  // FIELDING GLOVES
  {
    id: 'TIER_FG_01',
    name: 'Rawlings GG Elite 11.5"',
    category: 'FIELDING_GLOVE',
    tier: 1,
    statBoosts: { defense: 4 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+4 Defense and faster exchange time.',
    tokenVendingCost: 1,
    icon: '⚾',
    lore: 'Reliable cowhide glove with deep pocket.'
  },
  {
    id: 'TIER_FG_02',
    name: 'Wilson A2000 1786 Infield Mitt',
    category: 'FIELDING_GLOVE',
    tier: 2,
    statBoosts: { defense: 7, speed: 2 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+7 Defense and +2 Speed on lateral groundball reactions.',
    tokenVendingCost: 3,
    icon: '🛡️',
    lore: 'Pro Stock leather favored by big league double-play tandems.'
  },
  {
    id: 'TIER_FG_03',
    name: 'Brooks Robinson 16-Gold-Glove Heritage Trapper',
    category: 'FIELDING_GLOVE',
    tier: 3,
    statBoosts: { defense: 12, discipline: 6 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+12 Defense, +6 Discipline, and converts tough smashes into outs.',
    tokenVendingCost: 5,
    icon: '🏆',
    lore: 'The Human Vacuum Cleaner gold standard.'
  },

  // OPTICS & EYE BLACK
  {
    id: 'TIER_OPT_01',
    name: 'Oakley Radar EV Path Prizm Field',
    category: 'OPTICS',
    tier: 2,
    statBoosts: { discipline: 5, pitchControl: 3 },
    environmentalCondition: 'DAY',
    perkDescription: '+5 Plate Discipline and +3 Pitch Tracking in bright afternoon sunlight.',
    tokenVendingCost: 3,
    icon: '🕶️',
    lore: 'Prizm Field lenses accentuate flyball contrast against sky.'
  },
  {
    id: 'TIER_EB_01',
    name: 'Cross-Hatch War Paint Eye Black',
    category: 'EYE_BLACK',
    tier: 1,
    statBoosts: { discipline: 3 },
    environmentalCondition: 'DAY',
    perkDescription: '+3 Discipline against high-and-away fastballs in day games.',
    tokenVendingCost: 1,
    icon: '👁️',
    lore: 'Matte carbon glare absorption applied in classic cross-hatch style.'
  },

  // CLEATS
  {
    id: 'TIER_CL_01',
    name: 'New Balance Fresh Foam 3000 Spikes',
    category: 'CLEATS',
    tier: 2,
    statBoosts: { speed: 6, defense: 3 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+6 Speed on basepaths and +3 Defensive range.',
    tokenVendingCost: 3,
    icon: '👟',
    lore: 'Ultra-cushioned metal spikes for explosive first-step quickness.'
  },

  // PROTECTIVE ARMOR
  {
    id: 'TIER_ARM_01',
    name: 'EvoShield Pro-SRZ 2.0 Elbow Shield',
    category: 'PROTECTIVE_ARMOR',
    tier: 2,
    statBoosts: { contact: 5, discipline: 4 },
    environmentalCondition: 'ALWAYS',
    perkDescription: '+5 Contact and +4 Discipline against high-and-tight 100 mph heat.',
    tokenVendingCost: 3,
    icon: '🛡️',
    lore: 'Custom molded Gel-to-Shell shield for crowding the plate fearlessly.'
  },

  // DUGOUT RELIC
  {
    id: 'TIER_RELIC_01',
    name: '1970 Memorial Stadium Dirt & Infield Clay Core',
    category: 'DUGOUT_RELIC',
    tier: 3,
    statBoosts: { contact: 8, defense: 6, power: 4 },
    environmentalCondition: 'HIGH_LEVERAGE',
    perkDescription: '+8 Contact, +6 Defense, and doubles Baltimore Chop high-bounce infield single chance.',
    tokenVendingCost: 5,
    icon: '🏺',
    lore: 'Certified clay relic from the 33rd Street ballpark where dynasties were born.'
  }
];

