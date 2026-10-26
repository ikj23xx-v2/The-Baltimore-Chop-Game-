import React from 'react';
import { X, Play, Smartphone, Globe, Sparkles, HelpCircle } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl w-full max-w-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Accent Top Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/chopchop_085f9a0d.jpeg"
              alt="The Baltimore Chop"
              className="w-10 h-10 rounded-xl object-cover border border-orange-500 shadow-md shrink-0"
            />
            <div>
              <h2 className="text-xl font-display font-black text-white tracking-wide flex items-center gap-2">
                THE BALTIMORE CHOP: BEGINNER'S PLAYBOOK
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                How to test, play, and build this game with zero prior coding experience!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Guide Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 overflow-y-auto pr-1 text-slate-300 text-xs leading-relaxed font-sans">
          {/* Section 1: Testing in Google AI Studio */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-display font-black text-orange-400 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Play className="w-4 h-4 text-orange-500" />
              1. Can You Test It in Google AI Studio? YES!
            </h3>
            <p className="mb-2">
              You are looking at and playing the live app right now! In Google AI Studio Build mode:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
              <li><strong className="text-white">Interactive Preview:</strong> The window right here is a real, live web browser running your game. Every click, swing, and card tilt works in real time.</li>
              <li><strong className="text-white">No External Software Needed:</strong> You do NOT need Xcode, Android Studio, or any local programming setups to play and design your game right now.</li>
              <li><strong className="text-white">Plain English Prompts:</strong> To change rules, add players, or tune odds, just tell AI Studio in plain English. We handle 100% of the code for you!</li>
            </ul>
          </div>

          {/* Section 2: Core Gameplay Mechanics */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-display font-black text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. How to Play The Baltimore Chop
            </h3>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div>
                <strong className="text-white block font-display text-xs">💥 What is a "Baltimore Chop"?</strong>
                A signature baseball strategy where a batter hits down violently onto home plate clay, sending the ball soaring 30+ feet into the air so the batter easily beats the throw to first base.
              </div>
              <div>
                <strong className="text-white block font-display text-xs">🎯 The At-Bat Showdown:</strong>
                Select which plate zone you are targeting in the 3x3 grid, guess the pitch type (4-seam, slider, sinker), and toggle "The Baltimore Chop" to crush low pitches!
              </div>
              <div>
                <strong className="text-white block font-display text-xs">🎰 26-Man Casino Jackpot Draft:</strong>
                Spin the 3-reel tumbler to draft your squad. Hitting a Cooperstown Hall of Fame legend triggers jackpot bells and confetti!
              </div>
              <div>
                <strong className="text-white block font-display text-xs">🥫 Task Vending Machine:</strong>
                Complete in-game challenges (like hitting 3 Chops or 2 Homers) to earn tokens and dispense vintage bats, dirt jars, and coaching manuals.
              </div>
              <div>
                <strong className="text-white block font-display text-xs">✨ 5-Tier Refractor Forge:</strong>
                Spend your earned Victory Points to upgrade cards from Base to Rainbow, Gold Wave, Sapphire, Atomic Mojo, and the elusive 1/1 Gold Superfractor!
              </div>
            </div>
          </div>

          {/* Section 3: Releasing on iOS, Android & Chrome Extension */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-display font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              3. Taking it to iOS, Android & Chrome Extension
            </h3>
            <div className="space-y-2 text-[11px] text-slate-400">
              <p>
                Because this game is built with modern responsive web standards, you can deploy it everywhere with one codebase:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <Globe className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <strong className="text-white block">1. Website / PWA</strong>
                  <span>Instant public URL you can bookmark on your iPhone/Android home screen.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <Smartphone className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <strong className="text-white block">2. iOS & Android</strong>
                  <span>Capacitor wraps this exact app into an Xcode and Android Studio package with native haptics.</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <strong className="text-white block">3. Chrome Extension</strong>
                  <span>Adds a manifest file so it runs right inside Google Chrome's native Side Panel while browsing.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-display font-bold text-xs uppercase rounded-xl transition-colors"
          >
            Got It! Let's Play Ball ⚾
          </button>
        </div>
      </div>
    </div>
  );
};
