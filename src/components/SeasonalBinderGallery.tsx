// src/components/SeasonalBinderGallery.tsx
import React, { useState, useMemo } from 'react';
import { MASTER_SEASONAL_CATALOG, SeasonPeriod, SeasonalCardItem } from '../data/seasonalHolidayCatalog';
import { HolidayCardCanvasRenderer } from './HolidayPackCanvasRenderer';

interface SeasonalBinderGalleryProps {
  onClose?: () => void;
}

const PERIODS: { id: SeasonPeriod | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Periods' },
  { id: 'SEASON_1_SPRING', label: 'S1 Spring' },
  { id: 'SEASON_2_SUMMER', label: 'S2 Summer' },
  { id: 'SEASON_3_AUTUMN', label: 'S3 Autumn' },
  { id: 'PLAYOFFS_PENNANT_CHASE', label: 'Pennant Chase' },
  { id: 'PLAYOFFS_FALL_CLASSIC_HOLIDAY', label: 'Fall Classic' },
];

export const SeasonalBinderGallery: React.FC<SeasonalBinderGalleryProps> = ({ onClose }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<SeasonPeriod | 'ALL'>('ALL');
  const [holidayOnly, setHolidayOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedCard, setInspectedCard] = useState<SeasonalCardItem | null>(null);

  const filteredCards = useMemo(() => {
    return MASTER_SEASONAL_CATALOG.filter((card) => {
      const matchesPeriod = selectedPeriod === 'ALL' || card.seasonPeriod === selectedPeriod;
      const matchesHoliday = !holidayOnly || card.holidayTheme !== 'NONE';
      const matchesSearch =
        !searchQuery ||
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.catalogId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.visualEffect.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPeriod && matchesHoliday && matchesSearch;
    });
  }, [selectedPeriod, holidayOnly, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎃❄️</span>
            <h1 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
              SEASONAL & HOLIDAY REFRACTOR VAULT
            </h1>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto md:hidden text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse regular season refractors, October Halloween foils, and Winter Holiday editions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search refractor or effect..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setHolidayOnly(!holidayOnly)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              holidayOnly
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {holidayOnly ? '🎃 Showing Holiday Only' : 'Filter Holiday Sets (Halloween / Winter)'}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="hidden md:flex bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Period Filter Row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">
          Stage:
        </span>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPeriod(p.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
              selectedPeriod === p.id
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}

        <span className="text-[10px] font-mono text-slate-500 ml-auto">
          Showing {filteredCards.length} of {MASTER_SEASONAL_CATALOG.length} Editions
        </span>
      </div>

      {/* Grid Display */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-24 text-slate-500 text-xs font-mono">
          No seasonal refractors matched your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setInspectedCard(card)}
              className={`relative rounded-2xl border p-3 sm:p-4 flex flex-col justify-between transition-all cursor-pointer select-none ${
                card.isLocked
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-85'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-400/60 shadow-xl hover:scale-[1.02]'
              }`}
            >
              {card.isLocked && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-3 text-center z-10 pointer-events-none">
                  <span className="text-2xl mb-1">🔒</span>
                  <span className="text-[10px] font-bold text-amber-400 tracking-wider">
                    {card.seasonPeriod.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[9px] text-slate-400">Locked Until Season Stage</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
                  <span className="truncate mr-1">{card.catalogId}</span>
                  {card.serialLimit && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 shrink-0">
                      #{card.serialLimit}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{card.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{card.visualEffect}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[9.5px] text-emerald-400 font-mono line-clamp-2">
                {card.statBonusDescription}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Detail Inspection Modal */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {inspectedCard.catalogId} • {inspectedCard.seasonPeriod.replace(/_/g, ' ')}
                </span>
                <h2 className="text-lg font-black text-white mt-1.5">{inspectedCard.name}</h2>
                {inspectedCard.holidayTheme !== 'NONE' && (
                  <span className="inline-block text-[10px] font-mono text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded mt-1 border border-orange-500/30">
                    🎉 {inspectedCard.holidayTheme.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center py-2">
              <HolidayCardCanvasRenderer
                cardName={inspectedCard.name}
                catalogId={inspectedCard.catalogId}
                holidayTheme={inspectedCard.holidayTheme === 'NONE' ? 'WINTER_SNOWFLAKE' : inspectedCard.holidayTheme}
                serialLimit={inspectedCard.serialLimit}
                isSSP={inspectedCard.holidayTheme === 'OCTOBER_HALLOWEEN'}
                hiddenElement={inspectedCard.holidayTheme === 'OCTOBER_HALLOWEEN' ? 'PUMPKIN' : 'SNOWMAN'}
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block">VISUAL REFRACTOR EFFECT</span>
              <p className="text-slate-200 font-medium">{inspectedCard.visualEffect}</p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">BUFF & PASSIVE ADVANTAGE</span>
              <p className="text-slate-200 font-mono text-[11px]">{inspectedCard.statBonusDescription}</p>
            </div>

            <div className="flex justify-between items-center text-xs font-mono p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">SERIAL PRINT RUN:</span>
              <span className="font-bold text-amber-400">
                {inspectedCard.serialLimit ? `Limited to #${inspectedCard.serialLimit}` : 'Unnumbered Open Run'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setInspectedCard(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
