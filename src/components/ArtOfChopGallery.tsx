// src/components/ArtOfChopGallery.tsx
import React, { useState, useMemo } from 'react';
import { getCatalogWithLockStatus, CardCategory, CatalogItem } from '../data/masterCardCatalog';

interface ArtOfChopGalleryProps {
  onClose?: () => void;
  activeSeason?: number;
}

export const ArtOfChopGallery: React.FC<ArtOfChopGalleryProps> = ({
  onClose,
  activeSeason = 1,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'ALL'>('ALL');
  const [seasonFilter, setSeasonFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedCard, setInspectedCard] = useState<CatalogItem | null>(null);
  const [displayLimit, setDisplayLimit] = useState(48);

  const catalog = useMemo(() => getCatalogWithLockStatus(activeSeason), [activeSeason]);

  const filteredItems = useMemo(() => {
    return catalog.filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSeason = seasonFilter === 'ALL' || item.season === seasonFilter;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.catalogNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subType && item.subType.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSeason && matchesSearch;
    });
  }, [catalog, selectedCategory, seasonFilter, searchQuery]);

  const displayedList = useMemo(() => {
    return filteredItems.slice(0, displayLimit);
  }, [filteredItems, displayLimit]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h1 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
              THE ART OF CHOP: MASTER CARD CATALOG
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
            Browse all 564 core cards, stadiums, relics, and coaching staff across Seasons 1–3.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, # or position..."
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

      {/* Filter Controls Row */}
      <div className="space-y-3 mb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">
            Category:
          </span>
          {(['ALL', 'PLAYER_BASE', 'EQUIPMENT_RELIC', 'STADIUM', 'COACH', 'MANAGER_STRATEGY'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayLimit(48);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Season Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1">
            Season:
          </span>
          {(['ALL', 1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSeasonFilter(s);
                setDisplayLimit(48);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                seasonFilter === s
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              {s === 'ALL' ? 'ALL SEASONS' : `SEASON ${s}`}
            </button>
          ))}

          <span className="text-[10px] font-mono text-slate-500 ml-auto">
            Showing {filteredItems.length} of {catalog.length} items
          </span>
        </div>
      </div>

      {/* Grid Display */}
      {displayedList.length === 0 ? (
        <div className="text-center py-24 text-slate-500 text-xs font-mono">
          No cards matched your filter parameters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedList.map((card) => (
            <div
              key={card.id}
              onClick={() => setInspectedCard(card)}
              className={`relative rounded-2xl border p-3 sm:p-4 flex flex-col justify-between transition-all cursor-pointer select-none ${
                card.isLocked
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-80'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow-lg hover:scale-[1.02]'
              }`}
            >
              {card.isLocked && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-3 text-center z-10 pointer-events-none">
                  <span className="text-2xl mb-1">🔒</span>
                  <span className="text-[10px] font-bold text-amber-400 tracking-wider">
                    SEASON {card.unlocksInSeason} VAULT
                  </span>
                  <span className="text-[9px] text-slate-400">Locked Until Season Launch</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
                  <span className="truncate mr-1">{card.catalogNumber}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold shrink-0">
                    S{card.season}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{card.name}</h3>
                {card.subType && (
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/70 text-slate-300">
                    {card.subType}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{card.flavorText}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                <span className="font-mono text-amber-400/90 font-bold">{card.rarity}</span>
                {card.hasAutographVariant && (
                  <span className="text-blue-400 font-bold">✍️ Auto</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredItems.length > displayLimit && (
        <div className="mt-8 text-center pb-8">
          <button
            type="button"
            onClick={() => setDisplayLimit((prev) => prev + 48)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 transition-all hover:scale-105"
          >
            Load Next 48 Items ({filteredItems.length - displayLimit} Remaining)
          </button>
        </div>
      )}

      {/* Card Inspection Modal */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {inspectedCard.catalogNumber} • SEASON {inspectedCard.season}
                </span>
                <h2 className="text-lg font-black text-white mt-1.5">{inspectedCard.name}</h2>
                <p className="text-xs text-slate-400">Category: {inspectedCard.category.replace('_', ' ')}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 italic">
              "{inspectedCard.flavorText}"
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">RARITY</span>
                <span className="font-bold text-amber-400">{inspectedCard.rarity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">AUTOGRAPH VARIANT</span>
                <span className="font-bold text-blue-400">
                  {inspectedCard.hasAutographVariant ? 'Available ✍️' : 'None'}
                </span>
              </div>
            </div>

            {inspectedCard.statBonus && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-300 block text-[11px]">STAT BUFFS:</span>
                {Object.entries(inspectedCard.statBonus).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-slate-300 font-mono text-[11px]">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-bold text-amber-400">+{val}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono text-slate-500 block mb-1">AVAILABLE REFRACTOR PARALLELS:</span>
              <div className="flex flex-wrap gap-1">
                {inspectedCard.refractorTiersAvailable.map((tier) => (
                  <span
                    key={tier}
                    className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {tier.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
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
