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

  // Social Media Sharing Bonuses (Earn for sharing site to friends)
  SOCIAL_SHARE_BONUS_TOKENS: 250,   // Per share on X, Instagram, Facebook, Threads
  REFERRAL_INVITE_BONUS_TOKENS: 500,// Awarded per friend invited via unique referral link
  DAILY_FREE_TOKENS: 100,           // Daily login baseline grant

  // Anti-Gambling Responsible Gaming Caps
  DAILY_SPEND_CAP_USD: 25.00,
  MONTHLY_SPEND_CAP_USD: 100.00,
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
