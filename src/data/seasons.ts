import { CardSetId } from '../types/game';

export interface SeasonInfo {
  seasonNumber: number;
  monthName: string; // e.g. "NOV", "DEC", "JAN"
  fullMonth: string;
  startDate: string; // "11/1", "12/1", etc.
  releaseYear: number;
  toppsLikenessSet: string;
  actualHobbyReleaseDate: string;
  setId: CardSetId;
  status: 'ACTIVE' | 'UPCOMING';
  isUnlocked: boolean;
  theme: string;
  lore: string;
  colorTheme: string;
  medallionCoords: { col: number; row: number }; // 4 cols (0-3), 3 rows (0-2) in watermarked_img_1431752454010944403_ad0e9d0c.jpg
  featuredPlayers: string[];
}

export const TWELVE_SEASONS: SeasonInfo[] = [
  {
    seasonNumber: 1,
    monthName: 'NOV',
    fullMonth: 'November',
    startDate: '11/1',
    releaseYear: 2026,
    toppsLikenessSet: 'Topps Update Series Flagship',
    actualHobbyReleaseDate: 'November 1 (Late Autumn Drop)',
    setId: 'UPDATE_SERIES',
    status: 'ACTIVE',
    isUnlocked: true,
    theme: 'Autumn Postseason Gold, Navy Piping & Rookie Debuts',
    lore: 'The official inaugural season of The Baltimore Chop! Honors playoff clutch drama, traded star acquisitions, and the coveted rookie debuts from October pennant races.',
    colorTheme: 'from-blue-900 to-indigo-950 border-cyan-400',
    medallionCoords: { col: 0, row: 0 }, // JAN-S1 icon position
    featuredPlayers: ['Cal Ripken Jr.', 'Gunnar Henderson', 'Adley Rutschman', 'Jackie Robinson']
  },
  {
    seasonNumber: 2,
    monthName: 'DEC',
    fullMonth: 'December',
    startDate: '12/1',
    releaseYear: 2026,
    toppsLikenessSet: 'Topps Heritage High Number / Winter Special',
    actualHobbyReleaseDate: 'December 6 (Winter Warm-Up Drop)',
    setId: 'HERITAGE',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Split Two-Tone Vintage 1975 Colorblock & Kraft Stock',
    lore: 'Authentic 1970s retro nostalgia on thick unpolished kraft paperboard. Features late-season rookie additions and classic throwback franchise heroes.',
    colorTheme: 'from-amber-900 to-stone-950 border-amber-500',
    medallionCoords: { col: 1, row: 0 },
    featuredPlayers: ['Brooks Robinson', 'Boog Powell', 'Frank Robinson']
  },
  {
    seasonNumber: 3,
    monthName: 'JAN',
    fullMonth: 'January',
    startDate: '1/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Stadium Club Action Photography',
    actualHobbyReleaseDate: 'January 15 (Mid-Winter Showcase)',
    setId: 'STADIUM_CLUB',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: '100% Full-Bleed Borderless Action Photography',
    lore: 'Pure photographic emotion with zero border clutter: high-speed dirt spray, leaping wall robberies at Camden Yards, and floating gold foil typography.',
    colorTheme: 'from-slate-900 to-black border-orange-500',
    medallionCoords: { col: 2, row: 0 },
    featuredPlayers: ['Willie Mays', 'Rickey Henderson', 'Cedric Mullins']
  },
  {
    seasonNumber: 4,
    monthName: 'FEB',
    fullMonth: 'February',
    startDate: '2/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Series 1 Flagship',
    actualHobbyReleaseDate: 'February 14 (Spring Training Flagship)',
    setId: 'SERIES_1',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Smoky Dark Upper Fade & Dual Electric Neon Piping',
    lore: 'The cornerstone flagship of baseball card collecting. Crisp white cardstock framed in neon team colors that rings in the start of Spring Training.',
    colorTheme: 'from-orange-950 to-slate-950 border-orange-400',
    medallionCoords: { col: 3, row: 0 },
    featuredPlayers: ['Corbin Burnes', 'Anthony Santander', 'Jordan Westburg']
  },
  {
    seasonNumber: 5,
    monthName: 'MAR',
    fullMonth: 'March',
    startDate: '3/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Heritage Flagship',
    actualHobbyReleaseDate: 'March 20 (Opening Day Retro)',
    setId: 'HERITAGE',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: '1975 Classic Split Colorblock & Hand-Drawn Cartoons',
    lore: 'Celebrates Opening Day with vintage cardboard aroma, authentic 1970s typography, and back-of-the-card humorous baseball comic illustrations.',
    colorTheme: 'from-yellow-950 to-stone-900 border-yellow-400',
    medallionCoords: { col: 0, row: 1 },
    featuredPlayers: ['Jim Palmer', 'Eddie Murray', 'Mike Mussina']
  },
  {
    seasonNumber: 6,
    monthName: 'APR',
    fullMonth: 'April',
    startDate: '4/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Bowman Baseball (1st Bowman Prospect Crest)',
    actualHobbyReleaseDate: 'April 24 (Prospect Premier)',
    setId: 'BOWMAN',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Aggressive Angular Chevrons & "1st CHOP" Prospect Crest',
    lore: 'The premier launching pad for baseball card prospects. Fast-paced, high-tech chevron borders dedicated to rookie phenoms and future Hall of Famers.',
    colorTheme: 'from-cyan-950 to-blue-950 border-cyan-400',
    medallionCoords: { col: 1, row: 1 },
    featuredPlayers: ['Jackson Holliday', 'Colton Cowser', 'Grayson Rodriguez']
  },
  {
    seasonNumber: 7,
    monthName: 'MAY',
    fullMonth: 'May',
    startDate: '5/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Series 2 Flagship',
    actualHobbyReleaseDate: 'June 5 (Summer Pennant Race Drop)',
    setId: 'SERIES_2',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Sunburst Heatwave & Dual-Color Corner Notches',
    lore: 'Celebrates early summer pennant chases, rookie call-ups, and All-Star ballot inserts as the temperature rises across Camden Yards.',
    colorTheme: 'from-red-950 to-orange-950 border-red-500',
    medallionCoords: { col: 2, row: 1 },
    featuredPlayers: ['Ryan Mountcastle', 'Félix Bautista', 'Yennier Cano']
  },
  {
    seasonNumber: 8,
    monthName: 'JUN',
    fullMonth: 'June',
    startDate: '6/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Chrome Flagship',
    actualHobbyReleaseDate: 'July 24 (Midsummer Chromium Drop)',
    setId: 'CHROME',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Diamond-Beveled Mirror Plate & Refractor Rainbows',
    lore: 'The ultimate high-end chromium experience. Heavy metallic cardstock with prismatic light diffraction, rainbow specular shine, and Superfractor 1/1s.',
    colorTheme: 'from-indigo-950 to-violet-950 border-purple-400',
    medallionCoords: { col: 3, row: 1 },
    featuredPlayers: ['Shohei Ohtani', 'Aaron Judge', 'Mookie Betts']
  },
  {
    seasonNumber: 9,
    monthName: 'JUL',
    fullMonth: 'July',
    startDate: '7/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Finest Midsummer Classic',
    actualHobbyReleaseDate: 'August 7 (All-Star Classic Showcase)',
    setId: 'CHROME',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Futuristic 1990s Prismatic High-Tech Die-Cuts',
    lore: 'Inspired by the game-changing 1993 Topps Finest launch: protective peel coating, hyper-gloss finish, and geometric refractor surfaces.',
    colorTheme: 'from-fuchsia-950 to-purple-950 border-pink-500',
    medallionCoords: { col: 0, row: 2 },
    featuredPlayers: ['Babe Ruth', 'Johnny Bench', 'Sandy Koufax']
  },
  {
    seasonNumber: 10,
    monthName: 'AUG',
    fullMonth: 'August',
    startDate: '8/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Allen & Ginter (1887 Victorian Tobacco)',
    actualHobbyReleaseDate: 'September 15 (Victorian Antiquities Drop)',
    setId: 'ALLEN_GINTER',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Sepia Ivory Parchment, Ornate Filigree & Mini Tobacco Inserts',
    lore: 'Tribute to 19th-century tobacco card trading. Aged parchment border treatments, delicate gold filigree, calligraphic typefaces, and mini card inserts.',
    colorTheme: 'from-stone-900 to-amber-950 border-amber-300',
    medallionCoords: { col: 1, row: 2 },
    featuredPlayers: ['Wee Willie Keeler', 'Ken Singleton', 'Frank Robinson']
  },
  {
    seasonNumber: 11,
    monthName: 'SEP',
    fullMonth: 'September',
    startDate: '9/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Cosmic Chrome / Gold Label',
    actualHobbyReleaseDate: 'October 2 (Galaxy Chromium Premier)',
    setId: 'CHROME',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Interstellar Starburst Refractors & Framed Gold Medallions',
    lore: 'Galactic black space cardstock embedded with micro-glitter starfields and 24K gold-framed class portraits for playoff contenders.',
    colorTheme: 'from-blue-950 to-black border-cyan-300',
    medallionCoords: { col: 2, row: 2 },
    featuredPlayers: ['Gunnar Henderson', 'Adley Rutschman', 'Cal Ripken Jr.']
  },
  {
    seasonNumber: 12,
    monthName: 'OCT',
    fullMonth: 'October',
    startDate: '10/1',
    releaseYear: 2027,
    toppsLikenessSet: 'Topps Dynasty Postseason Championship',
    actualHobbyReleaseDate: 'Late October / World Series Drop',
    setId: 'UPDATE_SERIES',
    status: 'UPCOMING',
    isUnlocked: false,
    theme: 'Encased Postseason Patch Gold Ingot & Championship Filigree',
    lore: 'The apex of luxury baseball cards: ultra-thick 130pt encased stock, game-worn patch swatches, and World Series championship ring inlays.',
    colorTheme: 'from-amber-950 to-yellow-950 border-yellow-400',
    medallionCoords: { col: 3, row: 2 },
    featuredPlayers: ['Babe Ruth', 'Cal Ripken Jr.', 'Frank Robinson']
  }
];

export function getSeasonByNumber(num: number): SeasonInfo {
  return TWELVE_SEASONS.find((s) => s.seasonNumber === num) || TWELVE_SEASONS[0];
}

export function getActiveSeason(): SeasonInfo {
  return TWELVE_SEASONS.find((s) => s.status === 'ACTIVE') || TWELVE_SEASONS[0];
}

export function isSeasonUnlocked(seasonNumber: number): boolean {
  const s = TWELVE_SEASONS.find((item) => item.seasonNumber === seasonNumber);
  return s ? s.isUnlocked : false;
}
