import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../services/audio';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, suppress button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundManager.playButtonClick();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="Install Web App on Home Screen (PWA)"
        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-display font-black tracking-wide uppercase transition-all flex items-center gap-1.5 border shadow-sm ${
          isInstallable
            ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white border-yellow-300 shadow-[0_0_12px_rgba(234,88,12,0.4)] hover:brightness-110'
            : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-500/30'
        } ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install</span> App
      </button>

      {/* Guided iOS / Browser Install Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="liquid-glass-panel rounded-3xl w-full max-w-sm p-5 shadow-2xl relative border border-orange-500/40 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📲</span>
                <h4 className="font-display font-black text-white text-base uppercase">
                  Install On Mobile Device
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-body text-slate-300">
              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                <div className="w-7 h-7 rounded-full bg-orange-600/30 border border-orange-500 flex items-center justify-center text-orange-400 font-mono font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                    Tap Share in Safari / Chrome <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Open the bottom or top browser menu in your mobile browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                <div className="w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-amber-300 font-mono font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                    Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-amber-400" />
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-white/5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300 font-mono font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                    Launch Fullscreen PWA <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Launches without browser URL bars, with offline caching, gyroscope tilt, and 60fps haptics!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-display font-black text-xs uppercase tracking-wider transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
