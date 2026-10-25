import React from 'react';
import { Position } from '../types/game';

interface MiniFieldTrackerProps {
  position: Position;
  playerName?: string;
  cardNo?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface PosDetail {
  code: string; // e.g. 'SS 6', 'P 1', '1B 3'
  shortCode: string;
  numberCode: string;
  name: string;
  x: number; // percentage in SVG (0 - 100)
  y: number; // percentage in SVG (0 - 100)
}

const FIELD_POSITIONS: Record<Position, PosDetail> = {
  'SP': { code: 'P 1', shortCode: 'P', numberCode: '1', name: 'Starting Pitcher', x: 50, y: 55 },
  'RP': { code: 'RP 1', shortCode: 'RP', numberCode: '1', name: 'Relief Pitcher', x: 50, y: 55 },
  'C':  { code: 'C 2', shortCode: 'C', numberCode: '2', name: 'Catcher', x: 50, y: 84 },
  '1B': { code: '1B 3', shortCode: '1B', numberCode: '3', name: 'First Base', x: 74, y: 54 },
  '2B': { code: '2B 4', shortCode: '2B', numberCode: '4', name: 'Second Base', x: 63, y: 38 },
  '3B': { code: '3B 5', shortCode: '3B', numberCode: '5', name: 'Third Base', x: 26, y: 54 },
  'SS': { code: 'SS 6', shortCode: 'SS', numberCode: '6', name: 'Shortstop', x: 37, y: 38 },
  'LF': { code: 'LF 7', shortCode: 'LF', numberCode: '7', name: 'Left Field', x: 23, y: 22 },
  'CF': { code: 'CF 8', shortCode: 'CF', numberCode: '8', name: 'Center Field', x: 50, y: 15 },
  'RF': { code: 'RF 9', shortCode: 'RF', numberCode: '9', name: 'Right Field', x: 77, y: 22 },
  'DH': { code: 'DH 10', shortCode: 'DH', numberCode: '10', name: 'Designated Hitter', x: 41, y: 79 }
};

export const MiniFieldTracker: React.FC<MiniFieldTrackerProps> = ({
  position,
  playerName,
  cardNo,
  size = 'md',
  className = ''
}) => {
  const pos = FIELD_POSITIONS[position] || FIELD_POSITIONS['1B'];

  const dims = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }[size];

  return (
    <div
      className={`relative rounded-2xl p-1 bg-gradient-to-b from-slate-900/90 via-[#0a1520] to-black border-2 border-orange-500/50 shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.25)] select-none overflow-hidden group ${dims} ${className}`}
      title={`${pos.name} (${pos.code}) - Statcast Game Tracker Field`}
    >
      {/* Field Glass Surface Bevel Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none z-20" />

      {/* SVG Live Statcast Baseball Field */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' }}
      >
        <defs>
          {/* Outfield Turf Gradient */}
          <radialGradient id="mini-turf" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1f542b" />
            <stop offset="60%" stopColor="#143e1d" />
            <stop offset="100%" stopColor="#0a2310" />
          </radialGradient>

          {/* Infield Dirt Gradient */}
          <radialGradient id="mini-dirt" cx="50%" cy="58%" r="40%">
            <stop offset="0%" stopColor="#a3693e" />
            <stop offset="70%" stopColor="#7a4622" />
            <stop offset="100%" stopColor="#4d2911" />
          </radialGradient>

          {/* Animated Glow for Position Pin */}
          <filter id="pos-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stadium Outfield Grass Arc */}
        <path
          d="M 6 82 A 58 58 0 0 1 94 82 L 50 86 Z"
          fill="url(#mini-turf)"
          stroke="#2d6e3c"
          strokeWidth="0.8"
        />

        {/* Outfield Wall Fence Border */}
        <path
          d="M 6 82 A 58 58 0 0 1 94 82"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.2"
          strokeDasharray="2,1.5"
          opacity="0.8"
        />

        {/* Infield Dirt Circle & Running Keyholes */}
        <circle cx="50" cy="58" r="28" fill="url(#mini-dirt)" stroke="#381d0b" strokeWidth="0.8" />

        {/* Baselines Dirt Diamond */}
        <polygon
          points="50,84 75,56 50,34 25,56"
          fill="none"
          stroke="#8d562b"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Infield Inner Grass Diamond */}
        <polygon
          points="50,42 66,57 50,73 34,57"
          fill="#174421"
          stroke="#265a31"
          strokeWidth="0.8"
        />

        {/* Chalk Foul Lines from Home */}
        <line x1="50" y1="84" x2="6" y2="38" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />
        <line x1="50" y1="84" x2="94" y2="38" stroke="#ffffff" strokeWidth="0.8" opacity="0.85" />

        {/* Pitcher's Mound & Rubber */}
        <circle cx="50" cy="56" r="4.5" fill="#8d562b" stroke="#542e12" strokeWidth="0.6" />
        <rect x="48" y="55.2" width="4" height="1.2" fill="#ffffff" rx="0.3" />

        {/* Home Plate */}
        <polygon points="50,84 48,82 48,80.5 52,80.5 52,82" fill="#ffffff" stroke="#000" strokeWidth="0.3" />

        {/* 1st, 2nd, 3rd Bases (Rotated Diamonds) */}
        <rect x="73.5" y="54.5" width="3.2" height="3.2" fill="#ffffff" transform="rotate(45 75 56)" stroke="#000" strokeWidth="0.3" />
        <rect x="48.5" y="32.5" width="3.2" height="3.2" fill="#ffffff" transform="rotate(45 50 34)" stroke="#000" strokeWidth="0.3" />
        <rect x="23.5" y="54.5" width="3.2" height="3.2" fill="#ffffff" transform="rotate(45 25 56)" stroke="#000" strokeWidth="0.3" />

        {/* RADAR SWEEP / PULSE RING AROUND ACTIVE POSITION */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r="8"
          fill="none"
          stroke="#f97316"
          strokeWidth="0.8"
          opacity="0.4"
          className="animate-ping"
          style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '2.5s' }}
        />

        {/* ILLUMINATED STATCAST POSITION PIN */}
        <g filter="url(#pos-glow)">
          {/* Pin Shadow */}
          <ellipse cx={pos.x} cy={pos.y + 2.5} rx="4" ry="1.8" fill="rgba(0,0,0,0.6)" />

          {/* Pin Outer Ring */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r="6"
            fill="#ea580c"
            stroke="#ffffff"
            strokeWidth="1.2"
          />

          {/* Inner Core */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r="4.2"
            fill="#0f172a"
          />

          {/* Position Number inside the Pin */}
          <text
            x={pos.x}
            y={pos.y + 2}
            textAnchor="middle"
            fill="#ffedd5"
            fontSize="5.2"
            fontWeight="900"
            fontFamily="ui-monospace, monospace"
          >
            {pos.numberCode}
          </text>
        </g>
      </svg>

      {/* Mini HUD Badge Label in Corner */}
      <div className="absolute bottom-1 left-1 right-1 z-20 flex items-center justify-between pointer-events-none px-1">
        <span className="text-[8px] font-mono font-black text-amber-300 bg-black/85 px-1 py-0.2 rounded border border-orange-500/50 leading-none">
          {pos.code}
        </span>
        <span className="text-[7px] font-mono font-bold text-slate-300 bg-black/80 px-1 py-0.2 rounded leading-none">
          TRACK
        </span>
      </div>
    </div>
  );
};
