// src/types/boxProducts.ts

export type ProductSKU = 
  | 'SINGLE_PACK' 
  | 'BLASTER_BOX' 
  | 'MEGA_BOX' 
  | 'HOBBY_BOX' 
  | 'JUMBO_BOX' 
  | 'BREAKER_BOX' 
  | 'CHOP_DELIGHT';

export interface ProductBoxConfig {
  sku: ProductSKU;
  name: string;
  tokenCost: number;
  packCount: number;
  cardsPerPack: number;
  totalCards: number;
  guarantees: string[];
  hitOdds: Record<string, string>;
  description: string;
  boxImageTint: string;
  accentBadge: string;
}

export const PRODUCT_CATALOG: Record<ProductSKU, ProductBoxConfig> = {
  SINGLE_PACK: {
    sku: 'SINGLE_PACK',
    name: 'Individual Foil Pack',
    tokenCost: 50,
    packCount: 1,
    cardsPerPack: 10,
    totalCards: 10,
    guarantees: ['1 Guaranteed Silver Refractor or Legend Insert'],
    hitOdds: {
      'Silver Refractor': '1:3 Packs',
      'Atomic Mojo (/150)': '1:12 Packs',
      'Sapphire Chrome (/75)': '1:36 Packs',
      'Gold Wave (/25)': '1:120 Packs',
      'Superfractor 1/1': '1:2,400 Packs',
    },
    description: 'Fresh foil rip from a factory-sealed counter box. Pure organic pull thrill.',
    boxImageTint: 'from-slate-800 to-slate-900',
    accentBadge: 'RETAIL PACK',
  },
  BLASTER_BOX: {
    sku: 'BLASTER_BOX',
    name: 'Retail Blaster Box',
    tokenCost: 250,
    packCount: 6,
    cardsPerPack: 10,
    totalCards: 60,
    guarantees: ['1 Exclusive Blue Wave Refractor Bonus Pack', '2 Silver Refractors'],
    hitOdds: {
      'Silver Refractor': '1:2 Packs',
      'Atomic Mojo (/150)': '1:6 Blasters',
      'Sapphire Chrome (/75)': '1:18 Blasters',
      'Gold Wave (/25)': '1:60 Blasters',
      'Superfractor 1/1': '1:1,200 Blasters',
    },
    description: 'Target & Walmart hobby fixture staple. Great entry point for set builders.',
    boxImageTint: 'from-blue-900 to-indigo-950',
    accentBadge: 'VALUE BLASTER',
  },
  MEGA_BOX: {
    sku: 'MEGA_BOX',
    name: 'Retail Mega Box',
    tokenCost: 450,
    packCount: 10,
    cardsPerPack: 10,
    totalCards: 100,
    guarantees: ['2 Exclusive Mojo Chrome Packs', '4 Refractor Parallels'],
    hitOdds: {
      'Atomic Mojo (/150)': '1:3 Mega Boxes',
      'Sapphire Chrome (/75)': '1:9 Mega Boxes',
      'Gold Wave (/25)': '1:30 Mega Boxes',
      'Superfractor 1/1': '1:600 Mega Boxes',
    },
    description: 'Loaded retail jumbo box with vibrant cracked-ice mojo inserts in every box.',
    boxImageTint: 'from-cyan-900 to-slate-950',
    accentBadge: 'MEGA CRACKED ICE',
  },
  HOBBY_BOX: {
    sku: 'HOBBY_BOX',
    name: 'Official Hobby Box',
    tokenCost: 950,
    packCount: 24,
    cardsPerPack: 10,
    totalCards: 240,
    guarantees: ['1 Guaranteed On-Card Autograph or Relic', '1 Serial-Numbered Card (/150 or better)', '8 Refractors'],
    hitOdds: {
      'On-Card Signature': '1:1 Hobby Box (Guaranteed)',
      'Atomic Mojo (/150)': '1:2 Hobby Boxes',
      'Sapphire Chrome (/75)': '1:4 Hobby Boxes',
      'Gold Wave (/25)': '1:12 Hobby Boxes',
      'Superfractor 1/1': '1:240 Hobby Boxes',
    },
    description: 'The golden standard of card collecting. Certified serial numbers and authentic signatures.',
    boxImageTint: 'from-amber-950 via-slate-900 to-black',
    accentBadge: '1 HIT GUARANTEE',
  },
  JUMBO_BOX: {
    sku: 'JUMBO_BOX',
    name: 'HTA Jumbo Hobby Box',
    tokenCost: 1800,
    packCount: 12,
    cardsPerPack: 36,
    totalCards: 432,
    guarantees: ['3 Guaranteed Hits: 1 Autograph + 2 Relics', '3 Serial-Numbered Parallels', '24 Refractors'],
    hitOdds: {
      'Autograph Hit': '1:1 Jumbo (Guaranteed)',
      'Relic Memorabilia': '2:1 Jumbo (Guaranteed)',
      'Sapphire Chrome (/75)': '1:2 Jumbo Boxes',
      'Gold Wave (/25)': '1:6 Jumbo Boxes',
      'Superfractor 1/1': '1:120 Jumbo Boxes',
    },
    description: 'High-volume Hobby Town America exclusive. Giant 36-card packs with triple hit security.',
    boxImageTint: 'from-red-950 via-slate-900 to-slate-950',
    accentBadge: 'TRIPLE HIT HTA',
  },
  BREAKER_BOX: {
    sku: 'BREAKER_BOX',
    name: 'Group Breaker Delight Case',
    tokenCost: 3600,
    packCount: 8,
    cardsPerPack: 15,
    totalCards: 120,
    guarantees: ['5 Autographs or Encased Slabs', 'All Cards Chrome or Refractor Finish', 'Zero Base Paper'],
    hitOdds: {
      'Encased 10 Slab': '1:2 Breakers',
      'Gold Wave (/25)': '1:3 Breakers',
      'Superfractor 1/1': '1:48 Breakers',
    },
    description: 'Streamer-ready ultra hit showcase. High velocity, high octane case-level action.',
    boxImageTint: 'from-purple-950 via-slate-900 to-black',
    accentBadge: 'ALL-CHROME BREAKER',
  },
  CHOP_DELIGHT: {
    sku: 'CHOP_DELIGHT',
    name: 'The Baltimore Chop™ 1-of-1 Vault Box',
    tokenCost: 7500,
    packCount: 1,
    cardsPerPack: 5,
    totalCards: 5,
    guarantees: ['1 Pre-Graded Gem Mint Slab (/25 or 1/1)', '4 Multi-Color Dual Patch Autos', 'Vault Certificate of Authenticity'],
    hitOdds: {
      'Gold Wave (/25) Slab': '80% Chance',
      'Superfractor 1/1 Slab': '20% Chance',
    },
    description: 'The pinnacle of Baltimore Chop collecting. Vault-preserved museum relics and 1-of-1 artifacts.',
    boxImageTint: 'from-yellow-700 via-amber-900 to-black',
    accentBadge: 'ULTRA GRAIL TIER',
  },
};
