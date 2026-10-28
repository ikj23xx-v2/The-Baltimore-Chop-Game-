import React, { useState, useEffect } from 'react';
import {
  authService,
  UserAccountProfile,
  checkUsernameChangeEligibility
} from '../services/authService';
import { soundManager } from '../services/audio';
import { teamThemeService, ActiveTeamTheme } from '../services/teamThemeService';
import { MLB_TEAMS, MLBTeamInfo } from '../data/mlbTeams';
import {
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertTriangle,
  X,
  CreditCard,
  Lock,
  ArrowRight,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastLog?: (msg: string, type: 'chop' | 'info') => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  onBroadcastLog,
}) => {
  const [profile, setProfile] = useState<UserAccountProfile | null>(authService.getProfile());
  const [newUsername, setNewUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentTeam, setCurrentTeam] = useState<ActiveTeamTheme>(() => teamThemeService.getActiveTheme());

  useEffect(() => {
    const unsub = authService.subscribe((p) => {
      setProfile(p);
      if (p && !newUsername) {
        setNewUsername(p.username);
      }
    });
    return unsub;
  }, []);

  const currentProfile = profile || authService.getProfile();
  const eligibility = currentProfile
    ? checkUsernameChangeEligibility(currentProfile)
    : {
        canChange: true,
        reason: '',
        daysUntilNextMonthlyChange: 0,
        changesThisYear: 0,
        yearlyChangesRemaining: 5,
        isMonthlyCooldownActive: false,
        isYearlyLimitExceeded: false,
        requiresPaidTier: false
      };

  // Handle Username Change
  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    setStatusMessage(null);
    setIsSubmitting(true);

    const res = await authService.changeUsername(newUsername);
    setIsSubmitting(false);

    if (res.success) {
      soundManager.playJackpotChime();
      setStatusMessage({ text: `Username successfully updated to @${newUsername.trim()}!`, type: 'success' });
      if (onBroadcastLog) onBroadcastLog(`✨ Player updated handle to @${newUsername.trim()}`, 'chop');
    } else {
      soundManager.playUmpireCall(true);
      setStatusMessage({ text: res.error || 'Failed to update username.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(249,115,22,0.4)] relative overflow-hidden border border-orange-500/40 max-h-[92vh] flex flex-col">
        
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider">
                  PLAYER ACCOUNT & HANDLE
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-orange-600/30 text-orange-300 font-extrabold border border-orange-500/40">
                  {currentProfile?.isAnonymous ? 'GUEST' : 'LINKED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Manage your official franchise handle, settings, and player profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center gap-2 shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950/60 text-red-300 border border-red-500/40'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">

          {/* ================= FRANCHISE SELECTION WITHOUT REDIRECT ================= */}
          <div className="rounded-2xl p-4 bg-slate-950/70 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>⚾</span> Active Franchise Team
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {currentTeam.name}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">
              Switch your primary franchise theme instantly without redirecting to signup or losing progress.
            </p>
            <select
              value={currentTeam.name}
              onChange={(e) => {
                const newTeam = teamThemeService.setFavoriteTeam(e.target.value);
                setCurrentTeam(newTeam);
                soundManager.playButtonClick();
                if (onBroadcastLog) onBroadcastLog(`Switched favorite franchise to ${newTeam.name}!`, 'chop');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono outline-none focus:border-amber-400 cursor-pointer"
            >
              {MLB_TEAMS.map((t: MLBTeamInfo) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.city})
                </option>
              ))}
              <option value="Negro League Legends">Negro League Legends (Historic)</option>
            </select>
          </div>

          {/* ================= 2. USERNAME & RATE LIMITING RULES ================= */}
          <div className="rounded-2xl p-4 bg-slate-950/70 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" /> Game Handle & Quotas
              </span>
              <span className="text-xs font-mono font-black text-amber-300">
                @{currentProfile?.username}
              </span>
            </div>

            {/* Quota Indicators */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] font-mono">
              {/* Monthly Rule */}
              <div className={`p-2.5 rounded-xl border ${
                eligibility.isMonthlyCooldownActive
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-slate-900 border-white/10 text-slate-300'
              }`}>
                <span className="text-slate-400 block mb-0.5">Monthly Cooldown (1x / 30d):</span>
                {eligibility.isMonthlyCooldownActive ? (
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked ({eligibility.daysUntilNextMonthlyChange}d remaining)</span>
                  </div>
                ) : (
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Available Now</span>
                  </div>
                )}
              </div>

              {/* Yearly Rule */}
              <div className={`p-2.5 rounded-xl border ${
                eligibility.isYearlyLimitExceeded
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-slate-900 border-white/10 text-slate-300'
              }`}>
                <span className="text-slate-400 block mb-0.5">Annual Quota (Max 5x / yr):</span>
                <div className="flex items-center justify-between font-bold">
                  <span className={eligibility.isYearlyLimitExceeded ? 'text-red-400' : 'text-white'}>
                    {eligibility.changesThisYear} / 5 used
                  </span>
                  <span className="text-slate-400 text-[9px]">
                    ({eligibility.yearlyChangesRemaining} remaining)
                  </span>
                </div>
              </div>
            </div>

            {/* Paid Tier / Over-Quota Notice (When user reaches limits) */}
            {eligibility.requiresPaidTier && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/50 via-orange-950/40 to-slate-900 border border-amber-500/40 mb-3 animate-fade-in">
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-display font-black text-amber-200 uppercase tracking-wide">
                      Standard Change Quota Reached
                    </h4>
                    <p className="text-[10px] font-mono text-slate-300 mt-0.5 leading-relaxed">
                      {eligibility.reason}
                    </p>
                    <div className="mt-2 py-1 px-2 rounded-lg bg-black/50 border border-amber-500/30 text-[9.5px] font-mono text-amber-300 flex items-center justify-between">
                      <span>💎 Premium Name Change Pass</span>
                      <span className="text-slate-400 italic">Pricing Tier Under Conceptualization</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form to change username */}
            <form onSubmit={handleChangeUsername} className="space-y-2.5">
              <label className="block text-[11px] font-mono text-slate-400">
                Choose New Player Handle (3-20 characters, alphanumeric & underscores):
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    maxLength={20}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="NewHandle"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl py-2 pl-7 pr-3 text-white font-mono text-sm outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newUsername.trim() || newUsername.trim() === currentProfile?.username}
                  className={`px-4 py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                    eligibility.canChange
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-md cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : eligibility.canChange ? (
                    <>
                      <span>Save</span> <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> <span>Locked</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                <span>Rules: Max 1 change / month · Max 5 changes / year</span>
                <span>{newUsername.length}/20 chars</span>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Session: UID {currentProfile?.uid.slice(0, 10)}...</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
