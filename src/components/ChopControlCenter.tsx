// src/components/ChopControlCenter.tsx
import React from 'react';
import { ActiveTeamTheme } from '../services/teamThemeService';
import { BankAccountState } from '../types/banking';
import { UserAccountProfile } from '../services/authService';
import { LofiPlayerToggle } from './LofiPlayerToggle';

interface ChopControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  teamTheme: ActiveTeamTheme;
  bankAccount: BankAccountState;
  userProfile: UserAccountProfile | null;
  onOpenWallet: () => void;
  onOpenSwitchTeam: () => void;
  onOpenFeedback: () => void;
  onOpenSocialShare: () => void;
  onOpenSplashGate?: () => void;
  onSelectMode: (mode: string) => void;
}

export const ChopControlCenter: React.FC<ChopControlCenterProps> = ({
  isOpen,
  onClose,
  teamTheme,
  bankAccount,
  userProfile,
  onOpenWallet,
  onOpenSwitchTeam,
  onOpenFeedback,
  onOpenSocialShare,
  onOpenSplashGate,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent frosted backdrop over the rest of the site */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* iOS / Android Style Control Center Drop-down Drawer */}
      <div 
        role="dialog"
        aria-label="Control Center"
        className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-2xl border-b-2 border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[88vh] overflow-y-auto animate-slideDown select-none font-sans"
      >
        <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
          
          {/* Top Bar Header with Close */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎛️</span>
              <h2 className="text-sm sm:text-base font-black text-amber-400 tracking-wider uppercase">
                THE BALTIMORE CHOP™ CONTROL CENTER
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SYSTEM OS
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onOpenSplashGate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSplashGate();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono transition-colors cursor-pointer"
                  title="Open Splash / Sign Up Page"
                >
                  ⚾ Splash / Sign-Up
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close Control Center"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Grid of iOS-Style Control Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Tile 1: Wallet & Currency Mini-Hub */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">VAULT RESERVES</span>
                <span className="text-xs">🪙</span>
              </div>
              <div className="my-2">
                <div className="text-2xl font-black font-mono text-amber-400">
                  {bankAccount.vendingTokenBalance.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Vending Tokens Active</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWallet();
                }}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>👝</span> Open Chop Wallet
              </button>
            </div>

            {/* Tile 2: Audio & Ambience */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">BALLPARK AUDIO</span>
                <span className="text-xs">📻</span>
              </div>
              <div className="my-2 space-y-1">
                <span className="text-xs font-bold text-slate-200 block">Lo-Fi Baseball Beats</span>
                <span className="text-[10px] text-slate-400 font-mono block">Ambient stadium crowd & lo-fi tape</span>
              </div>
              <div className="flex items-center justify-center pt-1">
                <LofiPlayerToggle />
              </div>
            </div>

            {/* Tile 3: Active Franchise Theme */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE FRANCHISE</span>
                <span className="text-xs">🏟️</span>
              </div>
              <div className="my-2 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow shrink-0"
                  style={{ backgroundColor: teamTheme.primaryColor, color: teamTheme.secondaryColor }}
                >
                  {teamTheme.logoIcon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">{teamTheme.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{teamTheme.ballpark}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSwitchTeam();
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⟲</span> Switch Franchise
              </button>
            </div>

            {/* Tile 4: Social Rewards & Scout Wire */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SHARE & DISPATCH</span>
                <span className="text-xs">🎁</span>
              </div>
              <div className="my-2 space-y-0.5">
                <span className="text-xs font-bold text-amber-300 block">Earn +250 Tokens</span>
                <span className="text-[10px] text-slate-400 font-mono block">Share on X, Instagram, Facebook</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSocialShare();
                  }}
                  className="py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold text-center transition-colors cursor-pointer"
                >
                  📣 Share Site
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFeedback();
                  }}
                  className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[10px] font-bold text-center transition-colors cursor-pointer"
                >
                  📋 Dispatch
                </button>
              </div>
            </div>

          </div>

          {/* Quick-Launch Game Modes Strip */}
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-2">
              QUICK LAUNCH GAME MODES
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'ARENA', label: 'At-Bat Arena', icon: '⚔️', desc: '9th Inning Crisis' },
                { id: 'DEPTH_CHART', label: '26-Man Roster', icon: '📋', desc: 'Lineup & Defense' },
                { id: 'HOBBY_OUTPOST', label: 'Hobby Outpost', icon: '📦', desc: 'Packs & Sealed Boxes' },
                { id: 'REFRAC_FORGE', label: 'Refractor Forge', icon: '✨', desc: 'Parallel Upgrades' },
                { id: 'GM_CONSOLE', label: 'GM Console', icon: '🏛️', desc: '52-Series Simulation' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectMode(m.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 group-hover:text-amber-400">
                    <span>{m.icon}</span>
                    <span className="truncate">{m.label}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pull-Up Handle / Dismiss Bar */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-6 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            >
              <span>▲</span>
              <span>Pull Up to Close Control Center</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
