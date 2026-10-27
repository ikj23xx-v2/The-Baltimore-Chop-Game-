// src/components/ChopBatterCardIcon.tsx
import React from 'react';

interface ChopBatterCardIconProps {
  className?: string;
  size?: number;
}

export const ChopBatterCardIcon: React.FC<ChopBatterCardIconProps> = ({ 
  className = '', 
  size = 32 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-md border-2 border-amber-400 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.35)] overflow-hidden ${className}`}
      style={{ width: size, height: Math.round(size * 1.25) }}
      title="Verified Chop Batter Profile"
    >
      {/* Holographic light streak across card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/15 to-transparent pointer-events-none" />

      {/* Batter silhouette poised for a chop */}
      <svg
        viewBox="0 0 24 30"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow backdrop */}
        <circle cx="12" cy="14" r="8" fill="#f59e0b" fillOpacity="0.2" />

        {/* Bat poised high for a chop swing */}
        <path
          d="M6 5 L17 14"
          stroke="#fde047"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Bat knob & grip */}
        <path
          d="M5 4 L7 6"
          stroke="#ff9e00"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Batter Helmet / Head */}
        <circle cx="14" cy="9" r="3.2" fill="#ffffff" />
        <path d="M12.5 8 H16.5" stroke="#ff9e00" strokeWidth="1.2" />

        {/* Coiled Torso in batting stance */}
        <path
          d="M13 12 L11 18 L15 17"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Batting Arms grasping bat */}
        <path
          d="M13 13 L15 12 L13 8"
          stroke="#ffd166"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Front & Back Legs in planted chop stance */}
        <path
          d="M11 18 L7 25"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M13 18 L17 25"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Cleats on Home Plate */}
        <path d="M5 25.5 H9" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 25.5 H19" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        
        {/* Home Plate base marker */}
        <path
          d="M10 27 L14 27 L12 29 Z"
          fill="#94a3b8"
        />
      </svg>
    </div>
  );
};
