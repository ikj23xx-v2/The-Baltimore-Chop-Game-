import React from 'react';
import { getSevenDayStreakStatus, claimStreakBonus } from '../utils/loginStreak';
import { soundManager } from '../services/audio';
import { Calendar, Flame, Gift, CheckCircle2, X, Sparkles, Award } from 'lucide-react';

interface LoginStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (reward: { points: number; tokens: number; packReward: boolean }) => void;
}

export const LoginStreakModal: React.FC<LoginStreakModalProps> = ({
  isOpen,
  onClose,
  onClaimReward
}) => {
  if (!isOpen) return null;

  const streak = getSevenDayStreakStatus();

  const handleClaim = () => {
    if (!streak.canClaimReward) return;
    const reward = claimStreakBonus(streak.currentWindowKey);
    soundManager.playJackpotChime();
    onClaimReward(reward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(249,115,22,0.35)] relative overflow-hidden border border-orange-500/40">
        
        {/* Ambient Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                5-in-7 Day Streak
              </h2>
              <p className="text-xs text-orange-200/80 font-mono">
                Log in 5 days within any 7-day window to earn franchise crates!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Streak Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Status Hero Banner */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900/90 via-[#131d2c] to-slate-950 border border-orange-500/30 relative overflow-hidden mb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">
                Current 7-Day Window
              </span>
              <div className="text-3xl font-display font-black text-white mt-0.5 flex items-baseline gap-1.5">
                <span>{streak.activeDaysCount}</span>
                <span className="text-sm text-slate-400 font-normal">/ {streak.target} Days Logged In</span>
              </div>
            </div>

            <div className="text-right">
              {streak.isTargetReached ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Goal Reached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {streak.remainingDaysNeeded} more {streak.remainingDaysNeeded === 1 ? 'day' : 'days'} needed
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full mt-3 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
              style={{ width: `${Math.min(100, (streak.activeDaysCount / streak.target) * 100)}%` }}
            />
          </div>
        </div>

        {/* 7-Day Calendar Tracker Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" /> Rolling 7-Day Check-in History
            </span>
            <span className="text-[10px] font-mono text-slate-500">Auto-synced</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {streak.daysTimeline.map((day) => (
              <div
                key={day.date}
                className={`rounded-xl p-2 flex flex-col items-center justify-between transition-all border ${
                  day.loggedIn
                    ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                    : 'bg-slate-900/60 border-white/5 opacity-60'
                } ${day.isToday ? 'ring-2 ring-amber-400' : ''}`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {day.dayLabel}
                </span>

                <div className="my-1.5">
                  {day.loggedIn ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                      ⚾
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                      ○
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono font-extrabold text-slate-400">
                  {day.loggedIn ? 'IN' : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Rewards Box */}
        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-amber-500/30 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-display font-bold uppercase tracking-wider text-amber-200">
              5-Day Streak Milestone Bundle:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-black/40 p-2 border border-white/10">
              <span className="text-xs text-amber-400 font-display font-black block">+1,500</span>
              <span className="text-[9px] font-mono text-slate-400">Franchise Pts</span>
            </div>
            <div className="rounded-xl bg-black/40 p-2 border border-white/10">
              <span className="text-xs text-cyan-300 font-display font-black block">+5 Tokens</span>
              <span className="text-[9px] font-mono text-slate-400">Vending Dispenser</span>
            </div>
            <div className="rounded-xl bg-black/40 p-2 border border-white/10">
              <span className="text-xs text-amber-300 font-display font-black block">1x Foil Pack</span>
              <span className="text-[9px] font-mono text-slate-400">Topps Collect</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {streak.canClaimReward ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" /> Claim 5-Day Streak Reward!
            </button>
          ) : streak.isRewardClaimed ? (
            <div className="w-full py-3 rounded-2xl bg-slate-900/80 text-emerald-300 border border-emerald-500/40 text-center font-display font-bold text-xs uppercase flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> This Week's Streak Reward Already Claimed
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-2xl bg-slate-800/60 text-slate-500 font-display font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>🔒</span> Need {streak.remainingDaysNeeded} More Day(s) to Unlock Reward
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
