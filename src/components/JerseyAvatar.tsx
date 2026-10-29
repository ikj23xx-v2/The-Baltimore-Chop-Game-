// src/components/JerseyAvatar.tsx
import React from 'react';
import { TEAM_JERSEY_THEMES, TeamId } from '../data/teamJerseyThemes';

interface JerseyAvatarProps {
  teamId: TeamId | string;
  username: string;
  jerseyNumber?: number | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDirt?: boolean;
  className?: string;
}

export const JerseyAvatar: React.FC<JerseyAvatarProps> = ({
  teamId,
  username,
  jerseyNumber = '99',
  size = 'md',
  showDirt = true,
  className = '',
}) => {
  const theme = (TEAM_JERSEY_THEMES as Record<string, any>)[teamId] || TEAM_JERSEY_THEMES.BAL;

  const sizeDimensions = {
    sm: { width: 40, height: 44, fontSizeName: 4.5, fontSizeNum: 16 },
    md: { width: 64, height: 70, fontSizeName: 5.5, fontSizeNum: 22 },
    lg: { width: 120, height: 130, fontSizeName: 7.5, fontSizeNum: 36 },
    xl: { width: 220, height: 240, fontSizeName: 10, fontSizeNum: 56 },
  }[size];

  const displayName = username.toUpperCase().slice(0, 12);
  const pathId = `arch_${teamId}_${Math.random().toString(36).substr(2, 5)}`;
  const filterId = `wrinkles_${teamId}_${Math.random().toString(36).substr(2, 5)}`;
  const dirtId = `dirt_${teamId}_${Math.random().toString(36).substr(2, 5)}`;

  const torsoPath = `M 32,8 
             L 20,20 L 4,32 L 14,48 L 24,40 
             L 24,102 Q 50,106 76,102 
             L 76,40 L 86,48 L 96,32 L 80,20 L 68,8 
             Q 50,14 32,8 Z`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none filter drop-shadow-md ${className}`}
      style={{ width: sizeDimensions.width, height: sizeDimensions.height }}
    >
      <svg
        viewBox="0 0 100 110"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Authentic Radial Fabric Drop Shadow */}
          <linearGradient id={`grad_${teamId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primaryColor} />
            <stop offset="100%" stopColor={theme.primaryColor} stopOpacity="0.88" />
          </linearGradient>

          {/* Arched Path for Player Nameplate */}
          <path
            id={pathId}
            d="M 18,36 Q 50,23 82,36"
            fill="none"
          />

          {/* Pinstripe Pattern */}
          {theme.hasPinstripes && (
            <pattern id={`pins_${teamId}`} width="8" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke={theme.pinstripeColor} strokeWidth="1" />
            </pattern>
          )}

          {/* 1. Fabric Wrinkle Displacement Filter */}
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.09" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* 2. Infield Dirt & Sliding Stain Gradient */}
          <radialGradient id={dirtId} cx="50%" cy="85%" r="40%">
            <stop offset="0%" stopColor="#784421" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#542e11" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Jersey Torso Silhouette with Fabric Wrinkles */}
        <g filter={`url(#${filterId})`}>
          <path
            d={torsoPath}
            fill={`url(#grad_${teamId})`}
            stroke={theme.pipingColor}
            strokeWidth="1.5"
          />

          {/* Pinstripe Overlay */}
          {theme.hasPinstripes && (
            <path
              d={torsoPath}
              fill={`url(#pins_${teamId})`}
              opacity="0.35"
            />
          )}

          {/* Infield Sliding Dirt Overlay on Hem & Shoulders */}
          {showDirt && (
            <path
              d={torsoPath}
              fill={`url(#${dirtId})`}
              style={{ mixBlendMode: 'multiply' }}
            />
          )}
        </g>

        {/* 2. Neck Collar Piping */}
        <path
          d="M 32,8 Q 50,14 68,8"
          fill="none"
          stroke={theme.pipingColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 3. Sleeve Stripe Details */}
        <line x1="6" y1="35" x2="16" y2="46" stroke={theme.pipingColor} strokeWidth="2" />
        <line x1="94" y1="35" x2="84" y2="46" stroke={theme.pipingColor} strokeWidth="2" />

        {/* 4. Arched Nameplate (Radial Text on Path) */}
        <text
          fill={theme.fontFillColor}
          stroke={theme.fontStrokeColor}
          strokeWidth="0.8"
          fontSize={sizeDimensions.fontSizeName}
          fontFamily={theme.fontFamily}
          fontWeight="900"
          letterSpacing="0.8px"
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {displayName}
          </textPath>
        </text>

        {/* 5. Dual-Layer Tackle-Twill Number */}
        {/* Outline / Drop-Shadow Layer */}
        <text
          x="50"
          y="76"
          textAnchor="middle"
          fontSize={sizeDimensions.fontSizeNum}
          fontFamily={theme.fontFamily}
          fontWeight="900"
          fill={theme.fontStrokeColor}
          stroke={theme.fontStrokeColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        >
          {jerseyNumber}
        </text>
        {/* Core Foreground Layer */}
        <text
          x="50"
          y="76"
          textAnchor="middle"
          fontSize={sizeDimensions.fontSizeNum}
          fontFamily={theme.fontFamily}
          fontWeight="900"
          fill={theme.fontFillColor}
        >
          {jerseyNumber}
        </text>
      </svg>
    </div>
  );
};
