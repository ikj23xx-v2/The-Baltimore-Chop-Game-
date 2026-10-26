// src/components/DigitalCardShop3D.tsx
import React, { useState } from 'react';
import { hobbyAudio } from '../utils/hobbySoundEngine';

export type ShopArea = 'WALL_PACKS' | 'SHELF_BOXES' | 'DISPLAY_CASES' | 'SUPPLIES_COUNTER' | 'VENDOR_TRADING_FLOOR';

export interface StoreItem {
  id: string;
  name: string;
  category: ShopArea;
  priceTokens: number;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  personality: string;
  cashRate: number; // multiplier paid out for selling cards/duplicates
  storeCreditRate: number; // higher multiplier for store credit
  trustLevel: number; // 1 to 5 RPG progression tier
  totalTrades: number;
  avatar: string;
}

export const STORE_CATALOG: StoreItem[] = [
  { id: 'p1', name: '1983 Foil Pack (Single)', category: 'WALL_PACKS', priceTokens: 250, description: 'Single foil pack with guaranteed foil refractor.' },
  { id: 'b1', name: 'Value Blaster Box (24 Packs)', category: 'SHELF_BOXES', priceTokens: 750, description: 'Contains 24 packs with 3 guaranteed mojos.' },
  { id: 'c1', name: 'Gem Mint 10 Slugger #44', category: 'DISPLAY_CASES', priceTokens: 1200, description: 'Encapsulated in high-clarity acrylic slab.' },
  { id: 's1', name: 'Leather-Bound 9-Pocket Binder', category: 'SUPPLIES_COUNTER', priceTokens: 400, description: 'Customizable leather card binder.' },
];

export const DigitalCardShop3D: React.FC<{
  userTokens: number;
  onCheckout: (cart: StoreItem[]) => void;
  onExit: () => void;
}> = ({ userTokens, onCheckout, onExit }) => {
  const [currentArea, setCurrentArea] = useState<ShopArea>('WALL_PACKS');
  const [cart, setCart] = useState<StoreItem[]>([]);
  
  // RPG Vendor Progression State
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'v1',
      name: 'Old-Timer Sal',
      specialty: 'Vintage Paper & Set Completers',
      personality: 'Gruff, nostalgic, hates modern chrome but pays top dollar for set fillers.',
      cashRate: 0.65,
      storeCreditRate: 0.85,
      trustLevel: 1,
      totalTrades: 0,
      avatar: '🧢',
    },
    {
      id: 'v2',
      name: 'Chrome Charlie',
      specialty: 'Refractors, Mojos & Superfractors',
      personality: 'High-energy, fast-talking speculator obsessed with numbered parallels and shiny slabs.',
      cashRate: 0.75,
      storeCreditRate: 1.10, // Gives bonus credit for repeat business
      trustLevel: 1,
      totalTrades: 0,
      avatar: '🕶️',
    },
    {
      id: 'v3',
      name: 'Madam Beckett',
      specialty: 'Raw Autographs & Graded Slabs',
      personality: 'Calculated, strict grader who looks closely at centering and corners. Rewards loyalty.',
      cashRate: 0.70,
      storeCreditRate: 1.00,
      trustLevel: 1,
      totalTrades: 0,
      avatar: '📜',
    },
  ]);

  const [tradeNotification, setTradeNotification] = useState<string | null>(null);

  const handleAreaSelect = (area: ShopArea) => {
    hobbyAudio.playCardShuffleFlick();
    setCurrentArea(area);
  };

  const handleAddToCart = (item: StoreItem) => {
    hobbyAudio.playPennySleeveSlide();
    setCart((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // RPG Vendor Trade Execution
  const executeTradeWithVendor = (vendorId: string, tradeType: 'CASH' | 'CREDIT') => {
    hobbyAudio.playSlabHandlingClack();

    setVendors((prevVendors) =>
      prevVendors.map((v) => {
        if (v.id === vendorId) {
          const newTrades = v.totalTrades + 1;
          // RPG Trust Level Up every 3 successful trades
          const newTrust = Math.min(5, Math.floor(newTrades / 3) + 1);

          setTradeNotification(
            `Trade successful with ${v.name}! Trust Level increased to Tier ${newTrust}. Payout rate boosted!`
          );

          setTimeout(() => setTradeNotification(null), 4000);

          return {
            ...v,
            totalTrades: newTrades,
            trustLevel: newTrust,
            storeCreditRate: Number((v.storeCreditRate + (tradeType === 'CREDIT' ? 0.02 : 0)).toFixed(2)),
          };
        }
        return v;
      })
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.priceTokens, 0);
  const activeItems = STORE_CATALOG.filter((i) => i.category === currentArea);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-amber-100 font-mono select-none flex flex-col justify-between overflow-y-auto animate-fadeIn">
      
      {/* 3D Walk-In Card Shop Ambient Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25 pointer-events-none filter blur-[0.5px]" 
        style={{ backgroundImage: "radial-gradient(circle at 50% 20%, #3a220b 0%, #030712 80%)" }} 
      />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

      {/* Top HUD */}
      <header className="relative z-10 border-b-2 border-amber-600/60 bg-[#120a04]/95 backdrop-blur-md px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center shadow-2xl gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400 flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
            🏪
          </div>
          <div>
            <h1 className="text-base font-black text-amber-400 tracking-wider">
              MEMORIAL 3D WALK-IN CARD SHOP & VENDOR FLOOR
            </h1>
            <p className="text-[10px] text-amber-200/60 uppercase">
              Explore shelves, talk to specialized vendors, and build trade trust
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#24170a] border border-amber-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm">🪙</span>
            <div>
              <span className="text-[9px] text-amber-300/80 block leading-tight">VENDING TOKENS</span>
              <span className="text-xs font-black text-amber-400 font-mono">{userTokens.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Exit Shop ✕
          </button>
        </div>
      </header>

      {/* Store Navigation Bar */}
      <nav className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => handleAreaSelect('WALL_PACKS')}
          className={`p-2.5 rounded-xl border-2 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            currentArea === 'WALL_PACKS' 
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-102' 
              : 'bg-slate-900/90 text-amber-200 border-amber-900/60 hover:border-amber-500'
          }`}
        >
          <span>🏷️</span> Wall Packs
        </button>

        <button
          type="button"
          onClick={() => handleAreaSelect('SHELF_BOXES')}
          className={`p-2.5 rounded-xl border-2 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            currentArea === 'SHELF_BOXES' 
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-102' 
              : 'bg-slate-900/90 text-amber-200 border-amber-900/60 hover:border-amber-500'
          }`}
        >
          <span>📦</span> Shelves
        </button>

        <button
          type="button"
          onClick={() => handleAreaSelect('DISPLAY_CASES')}
          className={`p-2.5 rounded-xl border-2 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            currentArea === 'DISPLAY_CASES' 
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-102' 
              : 'bg-slate-900/90 text-amber-200 border-amber-900/60 hover:border-amber-500'
          }`}
        >
          <span>💎</span> Cases
        </button>

        <button
          type="button"
          onClick={() => handleAreaSelect('SUPPLIES_COUNTER')}
          className={`p-2.5 rounded-xl border-2 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            currentArea === 'SUPPLIES_COUNTER' 
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-102' 
              : 'bg-slate-900/90 text-amber-200 border-amber-900/60 hover:border-amber-500'
          }`}
        >
          <span>📚</span> Supplies
        </button>

        <button
          type="button"
          onClick={() => handleAreaSelect('VENDOR_TRADING_FLOOR')}
          className={`p-2.5 rounded-xl border-2 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-1 cursor-pointer ${
            currentArea === 'VENDOR_TRADING_FLOOR' 
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg animate-pulse scale-102' 
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-500'
          }`}
        >
          <span>🤝</span> Vendor Floor (RPG)
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* Left 2 Cols: Store Items or RPG Vendor Floor */}
        <div className="md:col-span-2 space-y-4">
          
          {tradeNotification && (
            <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs font-bold animate-bounce shadow-lg">
              ✨ {tradeNotification}
            </div>
          )}

          {currentArea === 'VENDOR_TRADING_FLOOR' ? (
            /* RPG VENDOR FLOOR INTERACTION INTERFACE */
            <div className="space-y-4">
              <div className="bg-[#181007] border border-amber-800/40 px-4 py-3 rounded-xl">
                <span className="text-xs font-bold text-emerald-400 uppercase block">
                  TRADING FLOOR — VENDOR RELATIONS & REPUTATION
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Different vendors specialize in different card tiers. Build trust to unlock higher store credit multipliers and exclusive buy-backs!
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {vendors.map((v) => (
                  <div key={v.id} className="bg-[#160d05] border-2 border-amber-900/60 rounded-2xl p-4 relative shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
                          {v.avatar}
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-white">{v.name}</h3>
                          <span className="text-[9.5px] text-amber-400 font-bold">{v.specialty}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-amber-500/30 px-2.5 py-1 rounded-xl text-right">
                        <span className="text-[8.5px] text-slate-400 block">Trust Tier</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">Level {v.trustLevel} / 5</span>
                      </div>
                    </div>

                    <p className="text-[9.5px] text-slate-300 italic mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                      &ldquo;{v.personality}&rdquo;
                    </p>

                    <div className="mt-4 pt-3 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[9.5px] text-slate-300 space-x-3 font-mono">
                        <span>Cash Payout: <strong className="text-amber-400">{Math.round(v.cashRate * 100)}%</strong></span>
                        <span>Store Credit: <strong className="text-emerald-400">{Math.round(v.storeCreditRate * 100)}%</strong></span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => executeTradeWithVendor(v.id, 'CASH')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9.5px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer active:scale-95 transition-all"
                        >
                          Trade for Cash
                        </button>
                        <button
                          type="button"
                          onClick={() => executeTradeWithVendor(v.id, 'CREDIT')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[9.5px] font-black px-3 py-1.5 rounded-lg shadow cursor-pointer active:scale-95 transition-all"
                        >
                          Trade for Store Credit ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* STANDARD STORE INVENTORY */
            <>
              <div className="flex justify-between items-center bg-[#181007] border border-amber-800/40 px-4 py-2.5 rounded-xl">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Viewing Zone: {currentArea.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400">Click item to inspect & add to basket</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#181007]/90 border-2 border-[#8b4513]/60 hover:border-amber-400 rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xl relative"
                  >
                    <div>
                      <div className="w-full h-28 bg-slate-950/80 rounded-xl border border-amber-500/20 flex items-center justify-center text-4xl mb-3 shadow-inner">
                        {item.category === 'WALL_PACKS' ? '🎴' : item.category === 'SHELF_BOXES' ? '📦' : item.category === 'DISPLAY_CASES' ? '🛡️' : '📚'}
                      </div>
                      <h3 className="text-xs font-black text-white">{item.name}</h3>
                      <p className="text-[9.5px] text-amber-200/60 mt-1">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 font-mono">🪙 {item.priceTokens} Tokens</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] px-3 py-1.5 rounded-lg shadow transition-transform active:scale-95 cursor-pointer"
                      >
                        + Add to Basket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* Right Col: Register & Shopping Cart Basket */}
        <div className="bg-[#140c04] border-2 border-amber-600/60 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-amber-900/50 pb-3 mb-3">
              <span className="text-xs font-black text-amber-400">SHOPPING BASKET ({cart.length})</span>
              <span className="text-[9px] text-slate-400">Register Desk</span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-[10px] text-slate-500">
                Basket is empty.<br/>Browse store shelves or visit the Vendor Floor to make card trades!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((cartItem, idx) => (
                  <div key={`${cartItem.id}-${idx}`} className="bg-slate-900 border border-amber-900/40 p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                    <div>
                      <div className="font-bold text-white">{cartItem.name}</div>
                      <div className="text-amber-400 font-mono">🪙 {cartItem.priceTokens} Tokens</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(cartItem.id)}
                      className="text-red-400 hover:text-red-300 font-bold px-1.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-amber-900/50 pt-4 mt-4">
            <div className="flex justify-between text-xs font-bold text-amber-200 mb-3 font-mono">
              <span>Total Cost:</span>
              <span className="text-amber-400 font-black">🪙 {cartTotal} Tokens</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0 || userTokens < cartTotal}
              onClick={() => {
                hobbyAudio.playBoxOpen();
                onCheckout(cart);
              }}
              className={`w-full py-3 rounded-xl font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                cart.length > 0 && userTokens >= cartTotal
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>💳</span> Proceed to Register Checkout
            </button>
          </div>
        </div>

      </main>

      {/* Footer Notice */}
      <footer className="relative z-10 border-t border-amber-900/40 bg-[#0d0702] px-6 py-3 text-center text-[9px] text-amber-200/40">
        RPG Vendor System Active • Higher trust levels grant boosted store credit exchange rates.
      </footer>

    </div>
  );
};
