// src/components/ChopCardDeckNavigator.tsx
import React from 'react';
import { Swords, Users, Package, BookOpen, MessageSquare, Landmark, Calendar, FileText } from 'lucide-react';

export type DeckNavigationTab = 
  | 'ARENA'
  | 'ROSTER'
  | 'HOBBY'
  | 'BINDER'
  | 'CLUBHOUSE'
  | 'BANK'
  | 'SEASON'
  | 'ALMANAC';

interface ChopCardDeckNavigatorProps {
  activeTab: DeckNavigationTab;
  onSelectTab: (tab: DeckNavigationTab) => void;
  unreadClubhouseCount?: number;
}

export const ChopCardDeckNavigator: React.FC<ChopCardDeckNavigatorProps> = ({
  activeTab,
  onSelectTab,
  unreadClubhouseCount = 0,
}) => {
  const tabs: { id: DeckNavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'ARENA', label: 'At-Bat Arena', icon: <Swords className="w-4 h-4" /> },
    { id: 'ROSTER', label: '26-Man Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'HOBBY', label: 'Hobby Outpost', icon: <Package className="w-4 h-4" /> },
    { id: 'BINDER', label: 'Slab Vault', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'CLUBHOUSE', label: 'Clubhouse', icon: <MessageSquare className="w-4 h-4" />, badge: unreadClubhouseCount },
    { id: 'BANK', label: 'Bank Vault', icon: <Landmark className="w-4 h-4" /> },
    { id: 'SEASON', label: 'Franchise', icon: <Calendar className="w-4 h-4" /> },
    { id: 'ALMANAC', label: 'Almanac', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Bottom Navigation Deck"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94vw] bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex items-center justify-around select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-2 px-2.5 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-mono tracking-tight mt-1 ${isActive ? 'font-black' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
