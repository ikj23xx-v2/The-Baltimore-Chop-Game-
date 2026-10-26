import React from 'react';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { Sparkles, Trophy, Flame, Layers, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashScreenModalProps {
  isOpen: boolean;
  onEnterGame: () => void;
}

export const SplashScreenModal: React.FC<SplashScreenModalProps> = ({ isOpen, onEnterGame }) => {
  if (!isOpen) return null;

  const handleStart = () => {
    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setTimeout(() => {
      soundManager.playBaltimoreChop();
    }, 150);
    onEnterGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/92 backdrop-blur-2xl animate-fade-in select-none">
      {/* Stadium Field Backdrop Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(234, 88, 12, 0.4) 0%, rgba(11, 16, 23, 0.95) 75%)'
        }}
      />

      {/* Main Splash Glass Slabs */}
      <div className="liquid-glass-panel rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col items-center text-center border-2 border-orange-500/50">
        
        {/* Top Gold Trim */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-400" />

        {/* Official Field Logo */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-3 shrink-0">
          <img
            src="/assets/aistudio/chopchop_085f9a0d.jpeg"
            alt="The Baltimore Chop Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title with TM Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            THE BALTIMORE CHOP
          </h1>
          <span className="text-amber-400 font-display font-black text-base sm:text-lg -mt-3 drop-shadow">
            ™
          </span>
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold mb-4">
          OFFICIAL BASEBALL CARD BATTLER · CROSS-PLATFORM PWA
        </span>

        <p className="text-xs sm:text-sm text-slate-300 font-body max-w-md mb-6 leading-relaxed">
          Step into the bottom of the 9th. Rip authentic foil packs, manage your 26-man roster on the draft matrix, and tilt 3D refractor cards with real device gyroscope motion.
        </p>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-6 text-left">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2.5">
            <span className="text-xl">🎴</span>
            <div>
              <span className="text-[11px] font-display font-black text-white uppercase block leading-none">
                Diamond Foil Pack Rips
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">
                Tear strip swipe & refractor hits
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2.5">
            <span className="text-xl">📱</span>
            <div>
              <span className="text-[11px] font-display font-black text-white uppercase block leading-none">
                3D Gyro Motion & Tilt
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">
                Touch drag & mobile Safari tilt
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2.5">
            <span className="text-xl">💎</span>
            <div>
              <span className="text-[11px] font-display font-black text-white uppercase block leading-none">
                3D Diamond Badges
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">
                Scorecard position numbers
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <div>
              <span className="text-[11px] font-display font-black text-white uppercase block leading-none">
                Sleeper Draft Matrix
              </span>
              <span className="text-[9.5px] font-mono text-slate-400">
                26-man roster depth chart
              </span>
            </div>
          </div>
        </div>

        {/* Enter Dugout Button */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-base uppercase tracking-wider shadow-[0_4px_25px_rgba(249,115,22,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>ENTER DUGOUT & PLAY BALL</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Publisher Footnote */}
        <div className="mt-4 flex items-center justify-between w-full text-[9px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-orange-500" />
            BALTIMORE CHOP™ ENGINE v2.4
          </span>
          <span>CHROME & SAFARI COMPATIBLE</span>
        </div>
      </div>
    </div>
  );
};
