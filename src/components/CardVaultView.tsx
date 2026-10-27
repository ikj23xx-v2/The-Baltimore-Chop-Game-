// src/components/CardVaultView.tsx
import React, { useState } from 'react';
import { PlayerCard, NonPlayerCard, CardSetId } from '../types/game';
import { CARD_SETS } from '../data/sets';
import { FlippableCardItem } from './FlippableCardItem';
import { ChopSlabCase } from './ChopSlabCase';
import { TIERED_EQUIPMENT_CARDS } from '../data/equipment';
import { soundManager } from '../services/audio';
import { 
  Store, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Gem, 
  ShoppingBag, 
  Flame, 
  Box, 
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CardVaultViewProps {
  roster: PlayerCard[];
  inventory: NonPlayerCard[];
  activeSetId: CardSetId;
  onSelectActiveSet: (setId: CardSetId) => void;
  onOpenVending: () => void;
  onOpenPackRip: () => void;
  onOpenHobbyShop: () => void;
  onInspectCard: (card: PlayerCard) => void;
  vendingTokens: number;
  franchisePoints: number;
}

export const CardVaultView: React.FC<CardVaultViewProps> = ({
  roster,
  inventory,
  activeSetId,
  onSelectActiveSet,
  onOpenVending,
  onOpenPackRip,
  onOpenHobbyShop,
  onInspectCard,
  vendingTokens,
  franchisePoints
}) => {
  const [inventoryTab, setInventoryTab] = useState<'BINDERS' | 'SLEEVED' | 'SLABS'>('SLEEVED');
  const [selectedShopTable, setSelectedShopTable] = useState<number>(0);

  // Shop Tables definitions for horizontal physical card shop theme
  const SHOP_TABLES = [
    {
      id: 0,
      title: 'Table 1: Base Raw Singles',
      subtitle: 'Modern Flagship & Heritage Paper',
      tag: 'FLAGSHIP',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      description: 'Hand-collated base cards fresh from retail boxes. Pristine corners ready for penny sleeving.',
      actionLabel: 'Rip Sealed Foil',
      action: onOpenPackRip,
      icon: '📦',
      itemsCount: '564 Total Cards'
    },
    {
      id: 1,
      title: 'Table 2: Legends & Franchise HOFers',
      subtitle: 'High-WAR Historical Immortals',
      tag: 'HALL OF FAME',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      description: 'Verified single-season peak cards (Cal Ripken 1991, Babe Ruth 1923, Sandy Koufax 1965).',
      actionLabel: 'Browse Franchise Outpost',
      action: onOpenHobbyShop,
      icon: '👑',
      itemsCount: '30 MLB Franchises'
    },
    {
      id: 2,
      title: 'Table 3: Refractor Upgrading Anvil',
      subtitle: 'Parallels & Serial Numbered Stamping',
      tag: 'RAINBOW CHASE',
      color: 'border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-300',
      description: 'Exchange Vending Tokens to forge Silver Refractors, Atomic Mojo (/150), Sapphire (/75) & 1/1 Superfractor.',
      actionLabel: 'Visit Refractor Forge',
      action: onOpenVending,
      icon: '✨',
      itemsCount: '6 Parallels'
    },
    {
      id: 3,
      title: 'Table 4: Game-Used Relics Display',
      subtitle: 'Camden Dirt, Cleats & Bat Slivers',
      tag: 'AUTHENTIC MEMORABILIA',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      description: 'Certified game-used jersey patches and dugout relics embedded into thick 130pt relic cards.',
      actionLabel: 'Vending Relic Pulls',
      action: onOpenVending,
      icon: '🥫',
      itemsCount: '35+ Relic Artifacts'
    },
    {
      id: 4,
      title: 'Table 5: Diamond Equipment Table',
      subtitle: 'Pine Tar, Maple Bats & Catcher Mitts',
      tag: 'DUGOUT HARDWARE',
      color: 'border-orange-500/40 bg-orange-950/20 text-orange-300',
      description: 'Stat-boosting gear to equip your active batters for High-Leverage At-Bat Showdowns.',
      actionLabel: 'Inspect Equipment',
      action: onOpenVending,
      icon: '🧤',
      itemsCount: 'Tier 1 - 3 Boosts'
    }
  ];

  // We filter to possessed cards (the roster cards)
  const possessedCards = roster;
  const targetTotalPockets = 27; // 3 x 9-pocket page standard
  const emptySlotsCount = Math.max(0, targetTotalPockets - possessedCards.length);

  return (
    <div className="space-y-8">
      {/* ================= 1. CARD VAULT HEADER ================= */}
      <div className="liquid-glass-panel rounded-3xl p-6 border border-amber-500/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Official Collector Archive
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <span>🏛️</span> Card Vault & Physical Showroom
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 max-w-3xl">
              Browse the 5 physical card shop tables at the top, and manage your possessed inventory at the bottom across 9-pocket binders, sleeved top-loaders, and graded acrylic slabs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onOpenHobbyShop();
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>🏪</span> Hobby Shop Boxes
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                onOpenPackRip();
              }}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>⚡</span> Rip Sealed Pack
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. TOP MARKETPLACE: HORIZONTAL SCROLLING PHYSICAL CARD SHOP THEME (5 TABLES) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-black text-sm uppercase text-slate-200 tracking-wider">
              Marketplace Showroom Floor · 5 Physical Shop Tables
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Scroll horizontally to browse table offerings →
          </span>
        </div>

        {/* Horizontal Scrolling Track */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {SHOP_TABLES.map((table) => {
            const isSelected = selectedShopTable === table.id;
            return (
              <div
                key={table.id}
                onClick={() => {
                  soundManager.playButtonClick();
                  setSelectedShopTable(table.id);
                }}
                className={`min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900/95 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)] scale-[1.01]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border ${table.color}`}>
                      {table.tag}
                    </span>
                    <span className="text-2xl">{table.icon}</span>
                  </div>

                  <h4 className="font-display font-black text-base text-white uppercase tracking-tight">
                    {table.title}
                  </h4>
                  <p className="text-[11px] font-mono text-amber-400 font-bold mt-0.5">
                    {table.subtitle}
                  </p>

                  <p className="text-xs text-slate-300 font-sans mt-2.5 leading-relaxed">
                    {table.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {table.itemsCount}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playButtonClick();
                      table.action();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-[11px] uppercase shadow flex items-center gap-1 transition-all"
                  >
                    <span>{table.actionLabel}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 3. BOTTOM STRUCTURED INVENTORY (BINDERS, SLEEVED CARDS, SLABS) ================= */}
      <div className="space-y-4 pt-2">
        {/* Inventory Navigation & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-black text-base uppercase text-white tracking-wide">
              Possessed Inventory ({possessedCards.length} Cards)
            </h3>
          </div>

          {/* Three Inventory Structure Categories */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setInventoryTab('BINDERS');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                inventoryTab === 'BINDERS'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📁</span>
              <span>Binders (9-Pocket)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setInventoryTab('SLEEVED');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                inventoryTab === 'SLEEVED'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🛡️</span>
              <span>Sleeved Cards</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setInventoryTab('SLABS');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                inventoryTab === 'SLABS'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💎</span>
              <span>Graded Slabs</span>
            </button>
          </div>
        </div>

        {/* Inventory Status Note */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>
            {inventoryTab === 'BINDERS' && 'Showing 9-pocket collector pages · Displaying only possessed cards with flip-to-back analytics'}
            {inventoryTab === 'SLEEVED' && 'Showing penny-sleeved and top-loaded cards · Click "FLIP" for full biographical details'}
            {inventoryTab === 'SLABS' && 'Showing sonic-welded BGS/PSA 10 acrylic slabs with certified hologram serial numbers'}
          </span>
          <span className="text-amber-400 font-bold hidden sm:inline">
            3+ Cards Per Row Matrix
          </span>
        </div>

        {/* ---------------- 3A. BINDERS & SLEEVED CARDS VIEW (At least 3 cards per row with flip) ---------------- */}
        {(inventoryTab === 'BINDERS' || inventoryTab === 'SLEEVED') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Possessed Cards */}
            {possessedCards.map((card) => (
              <FlippableCardItem
                key={card.id}
                card={card}
                onInspect={onInspectCard}
                format={inventoryTab === 'BINDERS' ? 'binder' : 'sleeved'}
              />
            ))}

            {/* Empty Slots Promoting Hobby Box Purchases (User Requirement: leave unavailable spots blank or promote hobby box purchases) */}
            {Array.from({ length: Math.min(emptySlotsCount, 3) }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                onClick={onOpenHobbyShop}
                className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-amber-500/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition-all group"
                style={{ minHeight: '380px' }}
              >
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                  📦
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  EMPTY BINDER POCKET #{possessedCards.length + idx + 1}
                </span>
                <h4 className="font-display font-black text-sm text-slate-300 group-hover:text-amber-400 transition-colors uppercase">
                  Rip A Hobby Box
                </h4>
                <p className="text-[11px] font-mono text-slate-500 max-w-[200px] mt-1.5">
                  Expand your 26-man roster with guaranteed refractor parallels and relics.
                </p>
                <button
                  type="button"
                  className="mt-4 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-all"
                >
                  Visit Hobby Outpost →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- 3B. GRADED SLABS VIEW (Sonic-welded acrylic cases) ---------------- */}
        {inventoryTab === 'SLABS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {possessedCards.map((card) => (
              <ChopSlabCase
                key={card.id}
                card={card}
                customStickerNote="OFFICIAL BGS/PSA HERITAGE SLAB"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
