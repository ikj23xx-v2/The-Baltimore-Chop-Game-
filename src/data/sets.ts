import { CardSet, CardSetId } from '../types/game';

export const CARD_SETS: CardSet[] = [
  {
    id: 'SERIES_1',
    name: 'Topps 2024 Series 1 Flagship',
    seasonName: 'Spring Training & Opening Day Edition',
    dropWindow: 'February (Spring Training Launch)',
    status: 'ACTIVE',
    daysRemaining: 14,
    totalCards: 125,
    borderTheme: 'Flagship Smoky Dark Fade & Team Color Neon Framing',
    colorAccents: 'Black, Neon Team Hue & Crisp White Cardstock',
    lore: 'Real-World Counterpart: Topps Flagship Series 1. The quintessential foundation of the baseball collecting year, released every February featuring active 30-team MLB stars, veteran aces, and early rookie debuts.'
  },
  {
    id: 'HERITAGE',
    name: 'Topps Heritage 1975 Vintage',
    seasonName: 'Vintage 50-Year Nostalgia Homage',
    dropWindow: 'March / April (Opening Month)',
    status: 'ACTIVE',
    daysRemaining: 28,
    totalCards: 109,
    borderTheme: 'Split Two-Tone 1975 Colorblock & Kraft Cardboard',
    colorAccents: 'Mustard Gold / Vintage Olive / Cardboard Cream',
    lore: 'Real-World Counterpart: Topps Heritage. Celebrates iconic 50-year retrospective designs on authentic unpolished kraft cardboard stock with retro cartoon stats and 1975 colorblock borders.'
  },
  {
    id: 'BOWMAN',
    name: 'Bowman 1st Prospect Edition',
    seasonName: '1st Bowman Prospects & Rising Phenoms',
    dropWindow: 'May (Prospect Season)',
    status: 'ACTIVE',
    daysRemaining: 35,
    totalCards: 98,
    borderTheme: 'Futuristic Angular Chevrons & "1st Bowman" Crest',
    colorAccents: 'Electric Cyan, Dark Steel & White Trim',
    lore: 'Real-World Counterpart: Bowman Baseball. The premier hobby destination for top draft picks and international future stars before their big-league debuts, stamped with the iconic 1st Bowman emblem.'
  },
  {
    id: 'SERIES_2',
    name: 'Topps 2024 Series 2 Flagship',
    seasonName: 'Mid-Season Pennant Races & Summer Heat',
    dropWindow: 'June (Mid-Season Expansion)',
    status: 'ACTIVE',
    daysRemaining: 48,
    totalCards: 105,
    borderTheme: 'Sunburst Heatwave & Dual-Color Corner Notches',
    colorAccents: 'Solar Amber, Fiery Crimson & White Slate',
    lore: 'Real-World Counterpart: Topps Series 2. Released mid-summer to continue the flagship checklist (#331-660), featuring early-season call-ups, traded stars, and pennant race battles.'
  },
  {
    id: 'STADIUM_CLUB',
    name: 'Topps Stadium Club Ballpark Lens',
    seasonName: 'Cinematic Full-Bleed Action Photography',
    dropWindow: 'July (All-Star Break)',
    status: 'ACTIVE',
    daysRemaining: 62,
    totalCards: 103,
    borderTheme: '100% Borderless Full-Bleed Action Lens',
    colorAccents: 'Full-Bleed Photographic Edge & Floating Gold Foil',
    lore: 'Real-World Counterpart: Stadium Club. Acclaimed for pure, raw on-field photography with zero restrictive border frames—capturing airborne wall climbs, dirt sprays, and dugouts in stunning detail.'
  },
  {
    id: 'CHROME',
    name: 'Topps Chromium Specular',
    seasonName: 'High-End Metallic Refractor Parallels',
    dropWindow: 'Late July / August (Summer Dog Days)',
    status: 'ACTIVE',
    daysRemaining: 76,
    totalCards: 107,
    borderTheme: 'Platinum Chromium Beveled Plate Mirror',
    colorAccents: 'Polished Mirror Silver & Spectrum Iridescence',
    lore: 'Real-World Counterpart: Topps Chrome. The collector pinnacle of metallic substrate printing, featuring atomic mojo (/150), sapphire (/75), gold wave (/25), and true 1/1 Superfractor parallels.'
  },
  {
    id: 'ALLEN_GINTER',
    name: '1887 Allen & Ginter Tobacco Heritage',
    seasonName: 'Victorian Antiquities & Framed Relics',
    dropWindow: 'September (Pennant Chase)',
    status: 'ACTIVE',
    daysRemaining: 92,
    totalCards: 104,
    borderTheme: 'Aged Ivory Parchment & Ornate Filigree Corners',
    colorAccents: 'Sepia Ivory, Ornate Gold Scrollwork & Deep Umber',
    lore: 'Real-World Counterpart: Allen & Ginter. Homage to the world’s very first 1887 tobacco baseball cards, styled with delicate sepia parchment, Victorian corner filigree, miniature cards, and historic oddities.'
  },
  {
    id: 'UPDATE_SERIES',
    name: 'Topps 2024 Update Series',
    seasonName: 'Playoff Drama, Traded Stars & World Series',
    dropWindow: 'October / November (Postseason Finale)',
    status: 'ACTIVE',
    daysRemaining: 110,
    totalCards: 104,
    borderTheme: 'Postseason Midnight Navy & Gold Foil Piping',
    colorAccents: 'Midnight Navy Blue, Metallic Gold & Pennant Red',
    lore: 'Real-World Counterpart: Topps Update Series. The ultimate capstone of the baseball calendar, documenting mid-season trade deadline rosters in new uniforms, rookie breakouts, and World Series champions.'
  }
];

export function getCardSetById(id?: CardSetId): CardSet {
  return CARD_SETS.find((s) => s.id === id) || CARD_SETS[0];
}

export function getActiveSets(): CardSet[] {
  return CARD_SETS.filter((s) => s.status === 'ACTIVE');
}

export function getUpcomingSets(): CardSet[] {
  return CARD_SETS.filter((s) => s.status === 'UPCOMING');
}
