// src/components/HobbyShopCatalogue.tsx
import React, { useState } from 'react';
import { PRODUCT_CATALOG, ProductSKU } from '../types/boxProducts';
import { generateProductChecklistPDF } from '../services/checklistPdfGenerator';
import { Package, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { hobbyAudio } from '../utils/hobbySoundEngine';

interface HobbyShopCatalogueProps {
  userTokenBalance: number;
  onPurchaseBox: (sku: ProductSKU) => void;
  onOpen3DShop?: () => void;
  onOpenRipBench?: () => void;
}

export const HobbyShopCatalogue: React.FC<HobbyShopCatalogueProps> = ({
  userTokenBalance,
  onPurchaseBox,
  onOpen3DShop,
  onOpenRipBench,
}) => {
  const [activeSku, setActiveSku] = useState<ProductSKU>('HOBBY_BOX');
  const selectedProduct = PRODUCT_CATALOG[activeSku];

  const handleBoxPurchaseWithAudio = (sku: ProductSKU) => {
    hobbyAudio.playBoxOpen();
    onPurchaseBox(sku);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-2xl font-black text-amber-400 tracking-wider">
              CHOP HOBBY & RETAIL BOX OUTPOST
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Official odds and print runs anchored to authentic real-life Topps configurations.
            Every box contains guaranteed hits, refractor parallels, and certified coach inserts.
          </p>
        </div>

        {/* User Token Balance & Experience Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onOpen3DShop && (
            <button
              type="button"
              onClick={() => {
                hobbyAudio.playCardShuffleFlick();
                onOpen3DShop();
              }}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
            >
              <span>🏪</span>
              <span>3D Walk-In Shop</span>
            </button>
          )}

          {onOpenRipBench && (
            <button
              type="button"
              onClick={() => {
                hobbyAudio.playFoilPackRip();
                onOpenRipBench();
              }}
              className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
            >
              <span>✂️</span>
              <span>Rip Bench</span>
            </button>
          )}

          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Token Vault</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {userTokenBalance.toLocaleString()} Vending Tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SKU Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {(Object.keys(PRODUCT_CATALOG) as ProductSKU[]).map((sku) => {
          const item = PRODUCT_CATALOG[sku];
          const isSelected = activeSku === sku;
          return (
            <button
              key={sku}
              type="button"
              onClick={() => setActiveSku(sku)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <div>
                <span className="text-[9px] font-mono font-bold block text-amber-400/80 truncate">
                  {item.accentBadge}
                </span>
                <span className="text-xs font-black truncate block mt-0.5">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-mono font-black text-amber-400 mt-2 block">
                {item.tokenCost} 🪙
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Product Showcase Card */}
      <div className={`rounded-3xl border border-slate-700/80 p-6 md:p-8 bg-gradient-to-br ${selectedProduct.boxImageTint} shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center`}>
        
        {/* Left Side: 3D Box Rendering Mockup */}
        <div className="w-full md:w-80 shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/10 shadow-2xl text-center space-y-4">
          <div className="w-32 h-44 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-300 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/40 flex flex-col justify-between text-slate-950 font-black">
            <div className="text-[10px] font-mono tracking-widest uppercase border-b border-black/20 pb-1">
              THE BALTIMORE CHOP™
            </div>
            <div className="my-auto space-y-1">
              <span className="text-3xl block">📦</span>
              <span className="text-xs uppercase tracking-tight block">
                {selectedProduct.name}
              </span>
            </div>
            <div className="text-[9px] font-mono bg-black text-amber-300 py-0.5 rounded uppercase">
              {selectedProduct.accentBadge}
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-amber-400 block">
              {selectedProduct.tokenCost} TOKENS
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {selectedProduct.packCount} Packs · {selectedProduct.cardsPerPack} Cards/Pack
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleBoxPurchaseWithAudio(activeSku)}
            disabled={userTokenBalance < selectedProduct.tokenCost}
            className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              userTokenBalance >= selectedProduct.tokenCost
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Rip {selectedProduct.name}</span>
          </button>
        </div>

        {/* Right Side: Guarantees & Published Odds Matrix */}
        <div className="flex-1 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
              {selectedProduct.accentBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
              {selectedProduct.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Guarantees Box */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FACTORY-SEALED GUARANTEES</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              {selectedProduct.guarantees.map((g, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Odds Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
              PUBLISHED TOPPS-CALIBRATED HIT ODDS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(selectedProduct.hitOdds).map(([tier, odds]) => (
                <div key={tier} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    {tier}
                  </span>
                  <span className="text-xs font-bold font-mono text-amber-300 mt-0.5 block">
                    {odds}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Download Trigger */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => generateProductChecklistPDF(activeSku)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable Checklist (PDF)</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              Includes full 99-card manager & coach matrix
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
