import React, { useState } from 'react';
import { Position } from '../types/game';

export type ScoringSystem = 'OFFICIAL_SCORECARD' | 'BASE_NUMBERING';

interface BaseballDiamondBadgeProps {
  position: Position;
  playerName?: string;
  size?: 'sm' | 'md' | 'lg';
  themeAccent?: string; // Hex or tailwind class
  className?: string;
  interactive?: boolean;
}

interface PositionCoords {
  scorecardNum: string;
  baseNum: string;
  label: string;
  fullName: string;
  x: number; // percentage in SVG (0-100)
  y: number; // percentage in SVG (0-100)
}

const POSITION_MAP: Record<Position, PositionCoords> = {
  'SP': { scorecardNum: '1', baseNum: 'P', label: 'SP', fullName: 'Starting Pitcher', x: 50, y: 55 },
  'RP': { scorecardNum: '1', baseNum: 'RP', label: 'RP', fullName: 'Relief Pitcher', x: 50, y: 55 },
  'C':  { scorecardNum: '2', baseNum: 'C', label: 'C', fullName: 'Catcher', x: 50, y: 88 },
  '1B': { scorecardNum: '3', baseNum: '1', label: '1B', fullName: 'First Base', x: 74, y: 55 },
  '2B': { scorecardNum: '4', baseNum: '2', label: '2B', fullName: 'Second Base', x: 62, y: 38 },
  '3B': { scorecardNum: '5', baseNum: '3', label: '3B', fullName: 'Third Base', x: 26, y: 55 },
  'SS': { scorecardNum: '6', baseNum: '4', label: 'SS', fullName: 'Shortstop', x: 38, y: 38 },
  'LF': { scorecardNum: '7', baseNum: '7', label: 'LF', fullName: 'Left Field', x: 22, y: 22 },
  'CF': { scorecardNum: '8', baseNum: '8', label: 'CF', fullName: 'Center Field', x: 50, y: 14 },
  'RF': { scorecardNum: '9', baseNum: '9', label: 'RF', fullName: 'Right Field', x: 78, y: 22 },
  'DH': { scorecardNum: '10', baseNum: 'DH', label: 'DH', fullName: 'Designated Hitter', x: 50, y: 72 }
};

export const BaseballDiamondBadge: React.FC<BaseballDiamondBadgeProps> = ({
  position,
  playerName,
  size = 'md',
  className = '',
  interactive = true
}) => {
  // Support toggling between Official Scorecard (1=P, 2=C, 3=1B... 9=RF) and Base Numbering (1=1B, 2=2B, 3=3B)
  const [scoringMode, setScoringMode] = useState<ScoringSystem>('OFFICIAL_SCORECARD');
  const [isHovered, setIsHovered] = useState(false);

  const posData = POSITION_MAP[position] || POSITION_MAP['1B'];
  const displayNum = scoringMode === 'OFFICIAL_SCORECARD' ? posData.scorecardNum : posData.baseNum;

  // Sizing tokens
  const dimensions = {
    sm: { container: 'w-10 h-10', badge: 'w-4 h-4 text-[9px]', tag: 'text-[7px]' },
    md: { container: 'w-14 h-14', badge: 'w-5 h-5 text-[10px]', tag: 'text-[8px]' },
    lg: { container: 'w-20 h-20', badge: 'w-7 h-7 text-xs', tag: 'text-[9.5px]' }
  }[size];

  const handleToggle = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    setScoringMode((prev) => (prev === 'OFFICIAL_SCORECARD' ? 'BASE_NUMBERING' : 'OFFICIAL_SCORECARD'));
  };

  return (
    <div
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${posData.fullName} (#${displayNum} on ${scoringMode === 'OFFICIAL_SCORECARD' ? 'Scorecard' : 'Diamond'}). Click to toggle notation.`}
      className={`relative group cursor-pointer select-none ${dimensions.container} ${className}`}
    >
      {/* 3D RAISED EMBOSSED BEZEL CONTAINER */}
      <div 
        className="w-full h-full rounded-xl overflow-hidden relative shadow-[0_6px_12px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.9)] border border-amber-500/40 bg-gradient-to-br from-[#121c2b] via-[#09101a] to-[#04070c] transition-transform duration-200 group-hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 4px 8px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -2px rgba(0, 0, 0, 0.5), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.25), inset 0 -2px 3px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Subtle Metallic Bevel Ring */}
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-amber-400/20" />

        {/* SVG BASEBALL DIAMOND & INFIELD */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full p-1"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}
        >
          <defs>
            {/* Turf Gradient */}
            <radialGradient id="turf-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e4620" />
              <stop offset="100%" stopColor="#0b2410" />
            </radialGradient>
            
            {/* Dirt Arc Gradient */}
            <radialGradient id="dirt-grad" cx="50%" cy="60%" r="45%">
              <stop offset="0%" stopColor="#8d5b32" />
              <stop offset="100%" stopColor="#5c381c" />
            </radialGradient>

            {/* Embossed Base Filter */}
            <filter id="base-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Outfield Grass Arc */}
          <path
            d="M 10 75 A 60 60 0 0 1 90 75 L 50 90 Z"
            fill="url(#turf-grad)"
            opacity="0.8"
          />

          {/* Infield Dirt Circle */}
          <circle cx="50" cy="58" r="28" fill="url(#dirt-grad)" stroke="#3a2211" strokeWidth="0.8" />

          {/* Infield Grass Diamond */}
          <polygon
            points="50,40 68,58 50,76 32,58"
            fill="url(#turf-grad)"
            stroke="#ffffff"
            strokeWidth="0.4"
            opacity="0.9"
          />

          {/* Foul Lines & Basepaths (Chalk) */}
          <line x1="50" y1="88" x2="10" y2="48" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" strokeDasharray="1.5,1.5" />
          <line x1="50" y1="88" x2="90" y2="48" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" strokeDasharray="1.5,1.5" />
          <line x1="50" y1="88" x2="74" y2="55" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="74" y1="55" x2="50" y2="38" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="50" y1="38" x2="26" y2="55" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <line x1="26" y1="55" x2="50" y2="88" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />

          {/* Pitcher's Mound & Rubber */}
          <ellipse cx="50" cy="56" rx="4.5" ry="3.5" fill="#a46d3e" stroke="#482914" strokeWidth="0.6" />
          <rect x="48" y="55.2" width="4" height="1.2" fill="#ffffff" rx="0.3" />

          {/* Inactive Base Bags (White 3D Diamonds) */}
          {/* Home Plate */}
          <polygon points="50,89 53,86 53,84 47,84 47,86" fill="#ffffff" opacity="0.85" filter="url(#base-shadow)" />
          {/* 1st Base */}
          <rect x="71.5" y="52.5" width="4.5" height="4.5" fill="#f8fafc" transform="rotate(45 74 55)" opacity="0.75" filter="url(#base-shadow)" />
          {/* 2nd Base */}
          <rect x="47.8" y="36" width="4.5" height="4.5" fill="#f8fafc" transform="rotate(45 50 38)" opacity="0.75" filter="url(#base-shadow)" />
          {/* 3rd Base */}
          <rect x="23.8" y="52.5" width="4.5" height="4.5" fill="#f8fafc" transform="rotate(45 26 55)" opacity="0.75" filter="url(#base-shadow)" />
        </svg>

        {/* 3D RAISED ENAMEL PIN FOR ACTIVE PLAYER POSITION WITH SCORECARD NUMBER */}
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-300"
          style={{
            left: `${posData.x}%`,
            top: `${posData.y}%`
          }}
        >
          {/* Pulse Ripple on active player */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-35 bg-orange-500 scale-125" />

          {/* 3D Raised Coin / Enamel Medallion */}
          <div 
            className={`${dimensions.badge} rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-700 text-slate-950 font-display font-black flex items-center justify-center shadow-lg border border-yellow-200`}
            style={{
              boxShadow: '0 3px 6px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.8)'
            }}
          >
            <span className="leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
              {displayNum}
            </span>
          </div>
        </div>

        {/* Micro Scorecard Mode Stamp at Bottom */}
        <div className="absolute bottom-0.5 inset-x-0 flex items-center justify-center pointer-events-none">
          <span className="text-[6.5px] font-mono font-black text-amber-300/80 tracking-tighter bg-black/70 px-1 rounded-sm leading-tight border border-amber-500/20 shadow-sm">
            {posData.label} #{displayNum}
          </span>
        </div>
      </div>

      {/* Hover Floating Tooltip */}
      {isHovered && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 bg-black/95 text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-xl border border-orange-500/50 pointer-events-none">
          {playerName ? `${playerName} · ` : ''}{posData.fullName} (Scorecard #{posData.scorecardNum})
        </div>
      )}
    </div>
  );
};
