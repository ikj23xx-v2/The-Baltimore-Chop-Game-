// src/config/rewardsConfig.ts
/**
 * The Baltimore Chop™ Economy & Rewards Configuration
 * All parameters here can be adjusted for balance tuning, promotions, and pack odds.
 */

export const REWARD_CONFIG = {
  // Initial New Account Welcome Grants
  STARTER_BASE_TOKENS: 1500,        // Ample starting tokens to afford at least 1-2 Hobby Boxes
  STARTER_BASE_CREDITS: 3000,       // League credits for contract operations & drafting
  
  // Auth Provider Signup Bonuses (Earn more for Google/Apple)
  GOOGLE_SIGNUP_BONUS_TOKENS: 1000, // +1,000 extra tokens for Google 1-Tap sign-in
  APPLE_SIGNUP_BONUS_TOKENS: 1000,  // +1,000 extra tokens for Apple ID sign-in
  EMAIL_SIGNUP_BONUS_TOKENS: 500,   // +500 extra tokens for email sign-up

  // Social Media Sharing Bonuses (Earn for sharing site to friends - unlimited potential)
  SOCIAL_SHARE_BONUS_TOKENS: 250,   // Per share on X, Instagram, Facebook, Threads
  REFERRAL_INVITE_BONUS_TOKENS: 500,// Awarded per friend invited via unique referral link
  DAILY_FREE_TOKENS: 100,           // Daily login baseline grant

  // Anti-Gambling Responsible Gaming Caps
  DAILY_SPEND_CAP_USD: 25.00,
  MONTHLY_SPEND_CAP_USD: 100.00,
};

/**
 * Real-Money In-App Currency Purchase Packages (Loaded via PayPal / Apple Pay / Cards)
 */
export interface TokenBundle {
  id: string;
  name: string;
  price: number;       // USD price
  tokens: number;      // Tokens received
  desc: string;
  bonusPercentage?: number;
  badge?: string;
}

export const TOKEN_PURCHASE_BUNDLES: TokenBundle[] = [
  {
    id: 'single_rip',
    name: 'Single Pack Pass',
    price: 2.99,
    tokens: 300,
    desc: 'Enough for 6 individual Foil Pack rips (50 🪙 each)',
    badge: 'ENTRY'
  },
  {
    id: 'blaster_bundle',
    name: 'Value Blaster Bundle',
    price: 9.99,
    tokens: 1250,
    desc: 'Enough for 1 Hobby Box (950 🪙) or 5 Retail Blasters (250 🪙 each)',
    bonusPercentage: 25,
    badge: 'POPULAR'
  },
  {
    id: 'hobby_case_pass',
    name: 'Hobby Breaker Pass',
    price: 24.99,
    tokens: 3500,
    desc: 'Full case rip allowance (Reaches maximum daily responsible cap of $25.00)',
    bonusPercentage: 40,
    badge: 'DAILY MAX'
  }
];

/**
 * Packs, Boxes & Cases Store Pricing (Purchased with Vending Tokens)
 */
export const ITEM_STORE_PRICING = {
  // Individual Foil Packs
  SINGLE_PACK: {
    sku: 'SINGLE_PACK',
    name: 'Individual Foil Pack',
    tokenCost: 50,
    packCount: 1,
    cardsPerPack: 10,
    totalCards: 10,
    guarantees: '1 Guaranteed Silver Refractor or Legend Insert',
    desc: 'Fresh foil rip from a factory-sealed counter box. Pure organic pull thrill.'
  },
  // Retail Blaster Box
  BLASTER_BOX: {
    sku: 'BLASTER_BOX',
    name: 'Retail Blaster Box',
    tokenCost: 250,
    packCount: 6,
    cardsPerPack: 10,
    totalCards: 60,
    guarantees: '1 Exclusive Blue Wave Refractor Pack + 2 Silver Refractors',
    desc: 'Classic retail box fixture. 6 packs with guaranteed exclusive parallel packs.'
  },
  // Retail Mega Box
  MEGA_BOX: {
    sku: 'MEGA_BOX',
    name: 'Retail Mega Box',
    tokenCost: 450,
    packCount: 10,
    cardsPerPack: 10,
    totalCards: 100,
    guarantees: '2 Exclusive Mojo Chrome Packs + 4 Refractor Parallels',
    desc: 'Loaded retail jumbo box with vibrant cracked-ice mojo inserts in every box.'
  },
  // Official Hobby Box
  HOBBY_BOX: {
    sku: 'HOBBY_BOX',
    name: 'Official Hobby Box',
    tokenCost: 950,
    packCount: 24,
    cardsPerPack: 10,
    totalCards: 240,
    guarantees: '1 Guaranteed On-Card Autograph or Relic + 1 Serial-Numbered Card (/150) + 8 Refractors',
    desc: 'The golden standard of card collecting. Certified serial numbers and authentic signatures.'
  },
  // HTA Jumbo Hobby Box
  JUMBO_BOX: {
    sku: 'JUMBO_BOX',
    name: 'HTA Jumbo Hobby Box',
    tokenCost: 1800,
    packCount: 12,
    cardsPerPack: 36,
    totalCards: 432,
    guarantees: '3 Guaranteed Hits (1 Autograph + 2 Relics) + 3 Serial-Numbered Parallels + 24 Refractors',
    desc: 'Giant 36-card packs with triple hit security and massive base depth.'
  },
  // Group Breaker Delight Case
  BREAKER_BOX: {
    sku: 'BREAKER_BOX',
    name: 'Group Breaker Delight Case',
    tokenCost: 3600,
    packCount: 8,
    cardsPerPack: 15,
    totalCards: 120,
    guarantees: '5 Autographs or Encased Slabs · All Cards Chrome Finish · Zero Base Paper',
    desc: 'Streamer-ready ultra hit showcase. High velocity, high octane case-level action.'
  },
  // Ultra Grail Vault Box
  CHOP_DELIGHT: {
    sku: 'CHOP_DELIGHT',
    name: 'The Baltimore Chop™ 1-of-1 Vault Box',
    tokenCost: 7500,
    packCount: 1,
    cardsPerPack: 5,
    totalCards: 5,
    guarantees: '1 Pre-Graded Gem Mint Slab (/25 or 1/1) + 4 Multi-Color Dual Patch Autos',
    desc: 'The pinnacle of Baltimore Chop collecting. Vault-preserved museum relics and 1-of-1 artifacts.'
  }
};

/**
 * Task-Based Equipment Vending Dispense Costs (in Vending Tokens)
 */
export const VENDING_DISPENSE_COSTS = {
  STANDARD_EQUIPMENT: 1,  // 1 Token -> Common/Rare bat, cleats, or eye black
  SPECIALIST_EQUIPMENT: 3,// 3 Tokens -> Rare equipment with clutch contact multipliers
  LEGENDARY_RELIC: 5      // 5 Tokens -> Legendary/Vintage equipment relic
};

/**
 * Refractor Forge Parallels Upgrade Costs (in Franchise Points earned through gameplay)
 */
export const REFRACTOR_FORGE_PRICING = {
  RAINBOW: { cost: 250, label: 'Rainbow Prism', desc: 'Lustrous diagonal chromatic light refraction' },
  GOLD_WAVE: { cost: 750, label: 'Gold Wave', desc: '24k gold undulating wave shimmer' },
  SAPPHIRE: { cost: 1500, label: 'Sapphire Cracked-Ice', desc: 'Deep crystalline blue multi-faceted gloss' },
  ATOMIC_MOJO: { cost: 3500, label: 'Atomic Mojo Prism', desc: 'Hyper-shattered prism diffraction' },
  SUPERFRACTOR_1_OF_1: { cost: 10000, label: 'Superfractor 1 of 1', minWar: 7.0, desc: 'Gold concentric spirals with 1/1 stamped seal' }
};

export const SOCIAL_PLATFORMS = [
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: '𝕏',
    color: '#000000',
    shareUrl: (url: string, text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    color: '#101010',
    shareUrl: (url: string, text: string) => `https://www.threads.net/intent/post?text=${encodeURIComponent(text + ' ' + url)}`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    shareUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    id: 'instagram',
    name: 'Instagram Stories',
    icon: '📷',
    color: '#e1306c',
    shareUrl: () => `https://www.instagram.com/` // Opens Instagram for story pasting
  }
];
