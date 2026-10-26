import React, { useState } from 'react';
import { CardSet, CardSetId, PlayerCard } from '../types/game';
import { CARD_SETS } from '../data/sets';
import { TWELVE_SEASONS, SeasonInfo } from '../data/seasons';
import { Card3D } from './Card3D';
import { soundManager } from '../services/audio';
import { 
  X, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ShieldAlert,
  Flame,
  Layers
} from 'lucide-react';

interface SeasonalSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSetId: CardSetId;
  onSelectActiveSet: (setId: CardSetId) => void;
  roster: PlayerCard[];
  samplePlayer: PlayerCard;
}

export const SeasonalSetsModal: React.FC<SeasonalSetsModalProps> = ({
  isOpen,
  onClose,
  activeSetId,
  onSelectActiveSet,
  roster,
  samplePlayer
}) => {
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);
  const [inspectedSetId, setInspectedSetId] = useState<CardSetId>(activeSetId);

  if (!isOpen) return null;

  const currentSeason = TWELVE_SEASONS.find((s) => s.seasonNumber === selectedSeasonNum) || TWELVE_SEASONS[0];
  const inspectedSet = CARD_SETS.find((s) => s.id === inspectedSetId) || CARD_SETS[0];

  // Calculate collection progress per set
  const getCollectedCount = (setId: CardSetId) => {
    return roster.filter((p) => (p.cardSetId || 'SERIES_1') === setId).length;
  };

  const handleSelectSeason = (season: SeasonInfo) => {
    setSelectedSeasonNum(season.seasonNumber);
    if (season.isUnlocked) {
      setInspectedSetId(season.setId);
    }
    soundManager.playButtonClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/88 backdrop-blur-md animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-5xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[94vh] border border-orange-500/40">
        
        {/* Top Gold/Amber Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎴</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-white tracking-wide uppercase">
                  12-SEASON CARD RELEASES & TOPPS LIKENESS CALENDAR
                </h2>
                <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                  STARTS 11/1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Season 1 kicks off November 1 (11/1). Upcoming seasons lock cards and sets until their official hobby release date.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sets Modal"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12-Season Medallions Graphic Banner */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950 mb-4 shrink-0 relative">
          <img
            src="/assets/aistudio/watermarked_img_1431752454010944403_ad0e9d0c.jpg"
            alt="Official 12 Seasonal Medallions"
            className="w-full object-cover max-h-[140px] opacity-90 hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-slate-300">
            <span className="text-amber-400 font-bold">
              ★ Official 12-Month Medallion System (S1 Active · S2-S12 Locked by Release Date)
            </span>
            <span className="text-emerald-400 font-bold">First Season Starts 11/1</span>
          </div>
        </div>

        {/* Content Body: 12 Seasons List (Left) + 3D Preview & Lock Inspection (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto pr-1 flex-1">
          
          {/* Left: 12 Seasons List */}
          <div className="md:col-span-7 space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
            {TWELVE_SEASONS.map((season) => {
              const isSelected = selectedSeasonNum === season.seasonNumber;
              const matchingSet = CARD_SETS.find((s) => s.id === season.setId);
              const isActivePack = activeSetId === season.setId && season.isUnlocked;

              return (
                <div
                  key={season.seasonNumber}
                  onClick={() => handleSelectSeason(season)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : season.isUnlocked
                      ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/50'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-400">
                          SEASON {season.seasonNumber} ({season.monthName})
                        </span>
                        <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase">
                          {season.toppsLikenessSet}
                        </h4>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-mono block">
                        Starts {season.startDate} ({season.fullMonth}) · Hobby: {season.actualHobbyReleaseDate}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0">
                      {season.isUnlocked ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                          <Unlock className="w-2.5 h-2.5" /> UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-400" /> LOCKED ({season.startDate})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-xl border border-white/5">
                    {season.theme}
                  </div>

                  {season.isUnlocked && matchingSet && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-slate-400">
                        Roster Cards: <strong className="text-white">{getCollectedCount(season.setId)} / {matchingSet.totalCards}</strong>
                      </span>
                      {isActivePack ? (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active At-Bat Border
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectActiveSet(season.setId);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white rounded-lg text-[10px] font-bold transition-colors"
                        >
                          Use {matchingSet.name}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Selected Season & Locked Card Safeguard */}
          <div className="md:col-span-5 flex flex-col items-center justify-between bg-slate-950/70 border border-slate-800 rounded-3xl p-4">
            <div className="w-full text-center space-y-1 mb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-black">
                {currentSeason.isUnlocked ? '★ UNLOCKED LAUNCH SET' : '🔒 LOCKED UPCOMING SEASON'}
              </span>
              <h3 className="text-sm sm:text-base font-display font-black text-white uppercase">
                {currentSeason.toppsLikenessSet}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Starts {currentSeason.startDate} · {currentSeason.actualHobbyReleaseDate}
              </p>
            </div>

            {/* If Season is Unlocked: Show 3D Card Preview */}
            {currentSeason.isUnlocked ? (
              <div className="flex flex-col items-center">
                <Card3D
                  card={samplePlayer}
                  overrideSetId={currentSeason.setId}
                  size="normal"
                />

                <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center w-full max-w-xs text-xs space-y-2">
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-bold">
                    {inspectedSet.borderTheme}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Cards and packs from this set are available in draft boards and foil ripping ceremony!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectActiveSet(currentSeason.setId);
                      soundManager.playJackpotChime();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white font-display font-black text-xs uppercase rounded-xl transition-all shadow"
                  >
                    Activate Border for At-Bats
                  </button>
                </div>
              </div>
            ) : (
              /* If Season is Locked: Show Locked Vault Padlock Interface */
              <div className="flex flex-col items-center text-center p-6 bg-slate-950/90 border border-amber-500/40 rounded-2xl w-full max-w-xs space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                  <Lock className="w-8 h-8" />
                </div>
                
                <h4 className="text-sm font-display font-black text-white uppercase">
                  CARDS & PACKS LOCKED
                </h4>

                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Cards for Season {currentSeason.seasonNumber} ({currentSeason.toppsLikenessSet}) will automatically unlock for all collectors on <strong>{currentSeason.startDate}</strong>!
                </p>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 w-full text-left font-mono text-[10px] space-y-1">
                  <div>Release Window: <strong className="text-amber-400">{currentSeason.actualHobbyReleaseDate}</strong></div>
                  <div>Assigned Set: <strong className="text-cyan-400">{currentSeason.setId}</strong></div>
                  <div>Headliners: <strong className="text-white">{currentSeason.featuredPlayers.join(', ')}</strong></div>
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  Countdown active: Opens {currentSeason.startDate}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
