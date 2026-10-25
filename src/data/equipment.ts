import { NonPlayerCard, TaskRequirement } from '../types/game';

export const INITIAL_EQUIPMENT_CARDS: NonPlayerCard[] = [
  {
    id: 'EQ_01',
    name: '1970 Memorial Stadium Infield Dirt Jar',
    type: 'RITUAL',
    rarity: 'VINTAGE',
    description: 'Authentic clay from the 33rd Street ballpark. Increases bounce trajectory by 40%.',
    lore: 'Scooped from the shortstop dirt where Mark Belanger and Brooks Robinson turned historic double plays.',
    icon: '🏺',
    buffStats: { chopBounceBonus: 40, contactBonus: 5 },
    equipped: true
  },
  {
    id: 'EQ_02',
    name: 'Cupped Maple 33-Inch Bat',
    type: 'BAT',
    rarity: 'RARE',
    description: '+8 Power and increased exit velocity on middle pitches.',
    lore: 'Dense rock maple crafted with a deep cup for maximum whip through the hitting zone.',
    icon: '🏏',
    buffStats: { powerBonus: 8 },
    equipped: true
  },
  {
    id: 'EQ_03',
    name: 'Brooks Robinson Gold Trapper Mitt',
    type: 'GLOVE',
    rarity: 'LEGENDARY',
    description: '+6 Contact and steadies the batter with 2 strikes.',
    lore: 'Modeled after the historic web that vacuumed up anything hit down the third-base line.',
    icon: '🧤',
    buffStats: { contactBonus: 6 },
    equipped: true
  },
  {
    id: 'EQ_04',
    name: 'Oriole Park at Camden Yards (Eutaw St)',
    type: 'STADIUM',
    rarity: 'RARE',
    description: 'Historic warehouse backdrop. Right field pulled fly balls travel +15 extra feet.',
    lore: 'Opened in 1992, the retro-classic ballpark that revolutionized American baseball architecture.',
    icon: '🏟️',
    buffStats: { powerBonus: 5, pitchHintAccuracy: 15 },
    equipped: false
  },
  {
    id: 'EQ_05',
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
    id: 'EQ_06',
    name: 'Pine Tar Rag & Resin Bag',
    type: 'RITUAL',
    rarity: 'COMMON',
    description: '+4 Contact on breaking pitches away.',
    lore: 'Tacky grip passed around the dugout during humid midsummer doubleheaders.',
    icon: '🪵',
    buffStats: { contactBonus: 4 },
    equipped: false
  },
  {
    id: 'EQ_07',
    name: 'Vintage Pitch Trajectory Ledger',
    type: 'COACH',
    rarity: 'LEGENDARY',
    description: '+25% Dynamic predictive hint accuracy on pitch type and location.',
    lore: 'Handwritten binder documenting sequences and release cues for every opposing hurler.',
    icon: '📓',
    buffStats: { pitchHintAccuracy: 25 },
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
