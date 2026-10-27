// src/components/SocialShareModal.tsx
import React, { useState } from 'react';
import { REWARD_CONFIG, SOCIAL_PLATFORMS } from '../config/rewardsConfig';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userHandle: string;
  onAwardShareTokens: (amount: number, platformName: string) => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  userHandle,
  onAwardShareTokens,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState<string[]>([]);

  const currentUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost:3000')
    ? window.location.origin
    : 'https://ais-pre-wufuplv7mdmrtiszfyaxof-138824501190.us-west2.run.app';
  const shareText = `⚾ Join me on The Baltimore Chop™! Rip official hobby refractors, assemble a 26-man legendary squad, and execute 9th-inning high bounce hits! Use my invite code @${userHandle}:`;
  const referralLink = `${currentUrl}?ref=${encodeURIComponent(userHandle)}`;

  const handleShareClick = (platformId: string, platformName: string, shareUrlFn: (url: string, text: string) => string) => {
    const url = shareUrlFn(referralLink, shareText);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Award bonus tokens for sharing
    onAwardShareTokens(REWARD_CONFIG.SOCIAL_SHARE_BONUS_TOKENS, platformName);
    if (!sharedPlatforms.includes(platformId)) {
      setSharedPlatforms((prev) => [...prev, platformId]);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onAwardShareTokens(REWARD_CONFIG.SOCIAL_SHARE_BONUS_TOKENS, 'Direct Link Referral');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans select-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📣</span>
            <div>
              <h2 className="text-base font-black text-amber-400 tracking-wide uppercase">
                SHARE & EARN REWARDS
              </h2>
              <p className="text-[10px] text-slate-400">
                Earn +{REWARD_CONFIG.SOCIAL_SHARE_BONUS_TOKENS} Vending Tokens for every share! Unlimited potential.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Bonus Earn Callout Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/10 border border-amber-500/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-300 block uppercase">
              VIRAL SCOUTING INCENTIVE
            </span>
            <span className="text-xs font-bold text-white">
              +{REWARD_CONFIG.SOCIAL_SHARE_BONUS_TOKENS} Free Tokens Per Share
            </span>
          </div>
          <span className="text-2xl">🪙</span>
        </div>

        {/* Social Platforms Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Social Platform to Share
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => {
              const alreadyShared = sharedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => handleShareClick(platform.id, platform.name, platform.shareUrl)}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-left cursor-pointer hover:scale-[1.02] ${
                    alreadyShared
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 hover:border-amber-400 text-slate-200'
                  }`}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{platform.name}</span>
                    <span className="text-[9px] text-amber-400 font-mono">
                      {alreadyShared ? '✓ Claimed (+250)' : `+${REWARD_CONFIG.SOCIAL_SHARE_BONUS_TOKENS} Tokens`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Referral Link Copy */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Your Unique Franchise Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{copied ? '✓ Copied!' : '📋 Copy'}</span>
            </button>
          </div>
        </div>

        <div className="text-[9px] text-center text-slate-500 font-mono pt-1">
          Parameters configurable in <span className="text-amber-400">src/config/rewardsConfig.ts</span>
        </div>
      </div>
    </div>
  );
};
