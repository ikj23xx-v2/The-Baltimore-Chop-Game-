import { CardSet, CardSetId } from '../types/game';

export const CARD_SETS: CardSet[] = [
  {
    id: 'SERIES_1',
    name: 'CHOP 2024 Series 1',
    seasonName: 'Spring Opening Day Edition',
    dropWindow: 'Active Season (Feb - April)',
    status: 'ACTIVE',
    daysRemaining: 14,
    totalCards: 26,
    borderTheme: 'Smoky Black Fade & Dual Neon Framing',
    colorAccents: 'Black, Neon Amber & Crisp Cardstock White',
    lore: 'Inspired by the modern flagship aesthetic: deep smoky upper dark gradient fading into crisp white cardstock, banded by electric neon team-color hairline frames.'
  },
  {
    id: 'HERITAGE',
    name: 'CHOP Heritage 1975',
    seasonName: 'Vintage Nostalgia Throwback',
    dropWindow: 'Active Season (March - May)',
    status: 'ACTIVE',
    daysRemaining: 28,
    totalCards: 20,
    borderTheme: 'Split Two-Tone 1975 Colorblock & Kraft Stock',
    colorAccents: 'Mustard Gold / Vintage Olive / Cardboard Cream',
    lore: 'Authentic 1970s two-tone split colorblock border styling on unpolished matte vintage kraft cardstock with retro cartoon illustrations.'
  },
  {
    id: 'BOWMAN',
    name: 'CHOP Bowman 1st Edition',
    seasonName: 'Top Prospects & Rookies',
    dropWindow: 'Active Season (April - June)',
    status: 'ACTIVE',
    daysRemaining: 35,
    totalCards: 18,
    borderTheme: 'Futuristic Angular Chevrons & "1st CHOP" Crest',
    colorAccents: 'Electric Cyan, Dark Steel & White Trim',
    lore: 'The premier destination for future superstars. Features aggressive geometric angular border chevrons and the coveted "1st CHOP" prospect emblem.'
  },
  {
    id: 'SERIES_2',
    name: 'CHOP 2024 Series 2',
    seasonName: 'Summer Heat & Rookie Debuts',
    dropWindow: 'Drops in Summer (June - August)',
    status: 'UPCOMING',
    daysRemaining: 48,
    totalCards: 26,
    borderTheme: 'Sunburst Heatwave & Dual-Color Corner Notches',
    colorAccents: 'Solar Amber, Fiery Crimson & White Slate',
    lore: 'Celebrates midseason pennant races and traded players with dynamic sunburst borders and fiery dual-color corner notches.'
  },
  {
    id: 'CHROME',
    name: 'CHOP Chrome Flagship',
    seasonName: 'High-End Prismatic Parallels',
    dropWindow: 'Drops in Midsummer (July - Sept)',
    status: 'UPCOMING',
    daysRemaining: 62,
    totalCards: 24,
    borderTheme: 'Platinum Chrome Beveled Plate Mirror',
    colorAccents: 'Polished Mirror Silver & Spectrum Iridescence',
    lore: 'Ultra-luxurious metallic chromium cardstock with diamond-beveled mirror borders and intense light-diffracting specular reflections.'
  },
  {
    id: 'STADIUM_CLUB',
    name: 'CHOP Stadium Club',
    seasonName: 'Cinematic Full-Bleed Photography',
    dropWindow: 'Drops in Late Summer (August - Oct)',
    status: 'UPCOMING',
    daysRemaining: 76,
    totalCards: 18,
    borderTheme: '100% Borderless Full-Bleed Action Lens',
    colorAccents: 'Full-Bleed Photographic Edge & Floating Gold Bar',
    lore: 'Celebrates pure, raw on-field photography with zero restrictive border frames—featuring high-speed dirt spray, wall climbs, and minimalist floating gold foil text.'
  },
  {
    id: 'ALLEN_GINTER',
    name: 'CHOP Ginter & Co. 1887',
    seasonName: 'Victorian Antiquities & Tobacco Era',
    dropWindow: 'Drops in Autumn (Sept - Nov)',
    status: 'UPCOMING',
    daysRemaining: 92,
    totalCards: 16,
    borderTheme: 'Aged Ivory Parchment & Ornate Filigree Corners',
    colorAccents: 'Sepia Ivory, Ornate Gold Scrollwork & Deep Umber',
    lore: 'Homage to 19th-century tobacco cards. Decked in aged parchment borders, delicate Victorian corner scrollwork, and calligraphic lettering.'
  },
  {
    id: 'UPDATE_SERIES',
    name: 'CHOP Update Postseason',
    seasonName: 'Playoff Drama & World Series Crown',
    dropWindow: 'Drops in Winter (Oct - Dec)',
    status: 'UPCOMING',
    daysRemaining: 110,
    totalCards: 24,
    borderTheme: 'Postseason Midnight Navy & Gold Foil Piping',
    colorAccents: 'Midnight Navy Blue, Metallic Gold & Pennant Red',
    lore: 'The final chapter of the season. Deep navy blue border with metallic gold championship piping, postseason pennant insignias, and clutch moment highlights.'
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
