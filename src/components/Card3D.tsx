import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayerCard, CardSetId } from '../types/game';
import { soundManager } from '../services/audio';
import { RotateCw, ShieldCheck, Sparkles, Orbit, Compass, Award } from 'lucide-react';

import { BaseballDiamondBadge } from './BaseballDiamondBadge';
import { LosslessWarBadge } from './LosslessWarBadge';
import { getPlayerBRefNickname, POSITION_ICON_REGISTRY } from '../utils/cardIconsAndNicknames';

interface Card3DProps {
  card: PlayerCard;
  interactive?: boolean;
  onInspect?: () => void;
  size?: 'normal' | 'compact' | 'large';
  className?: string;
  overrideSetId?: CardSetId;
}

export const Card3D: React.FC<Card3DProps> = ({
  card,
  interactive = true,
  onInspect,
  size = 'normal',
  className = '',
  overrideSetId
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 360-Degree Continuous Smooth Rotation State
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialRotY: 0, initialRotX: 0 });
  const [foilPos, setFoilPos] = useState({ x: 50, y: 50 });
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);

  const setId: CardSetId = overrideSetId || card.cardSetId || 'SERIES_1';
  const isBase = card.refractorTier === 'BASE';
  const cardNo = card.cardNo ?? (card.id ? parseInt(card.id.replace(/\D/g, '') || '8', 10) : 8);

  // Position data and authentic Baseball-Reference nickname
  const posConfig = POSITION_ICON_REGISTRY[card.position] || POSITION_ICON_REGISTRY['CF'];
  const bRefData = getPlayerBRefNickname(card.name, card.position);

  // Autograph status
  const hasAutograph = Boolean(
    card.hasAutograph ||
    card.refractorTier === 'SUPERFRACTOR_1_OF_1' ||
    (card.isHistorical && card.bRefWar >= 65)
  );

  // Compute realistic metallic hot-foil die-stamped serial number
  const effectiveSerialStamp = card.serialStamp || (
    card.refractorTier === 'SUPERFRACTOR_1_OF_1' ? '1/1' :
    card.refractorTier === 'GOLD_WAVE' ? '#04/25' :
    card.refractorTier === 'SAPPHIRE' ? '#18/50' :
    card.refractorTier === 'ATOMIC_MOJO' ? '#42/99' :
    card.refractorTier === 'RAINBOW' ? '#125/199' :
    undefined
  );

  // Ultra-Smooth Auto 360° Orbit Loop using deltaTime
  useEffect(() => {
    if (!isAutoSpinning) return;
    let animId: number;
    let lastTime = performance.now();

    const spinStep = (now: number) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      // ~45 degrees per second for a serene, buttery showcase
      setRotY((prev) => (prev + (dt * 0.045)) % 360);
      animId = requestAnimationFrame(spinStep);
    };

    animId = requestAnimationFrame(spinStep);
    return () => cancelAnimationFrame(animId);
  }, [isAutoSpinning]);

  // Mouse Drag for Continuous 360° Free Rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsAutoSpinning(false);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialRotY: rotY,
      initialRotX: rotX
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Free 360° horizontal rotation and ±35° vertical tilt with smooth ratio
      const nextRotY = dragStart.initialRotY + deltaX * 0.85;
      const nextRotX = Math.max(-35, Math.min(35, dragStart.initialRotX - deltaY * 0.45));
      
      setRotY(nextRotY);
      setRotX(nextRotX);
      setFoilPos({
        x: Math.abs(nextRotY % 100),
        y: Math.abs(50 + nextRotX)
      });
    } else if (!isAutoSpinning) {
      // Gentle subtle 3D hover response
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const gentleY = ((x - midX) / midX) * 10;
      const gentleX = -((y - midY) / midY) * 10;
      
      setRotX(gentleX);
      setFoilPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag for Mobile (Safari / Chrome iOS & Android)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsAutoSpinning(false);
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      initialRotY: rotY,
      initialRotX: rotX
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    const nextRotY = dragStart.initialRotY + deltaX * 0.9;
    const nextRotX = Math.max(-35, Math.min(35, dragStart.initialRotX - deltaY * 0.45));
    
    setRotY(nextRotY);
    setRotX(nextRotX);
    setFoilPos({
      x: Math.abs(nextRotY % 100),
      y: Math.abs(50 + nextRotX)
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Toggle Smooth 180° Card Flip
  const toggleFlip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playRefractorShine();
    setIsAutoSpinning(false);
    // Smoothly snap to opposite face
    setRotY((prev) => {
      const currentNorm = ((prev % 360) + 360) % 360;
      if (currentNorm >= 90 && currentNorm < 270) {
        // Return to front (0°)
        return prev + (180 - (currentNorm - 180));
      } else {
        // Flip to back (180°)
        return prev + 180;
      }
    });
    setRotX(0);
  }, []);

  // Reset to Pristine Center Front
  const resetToFront = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoSpinning(false);
    setRotY(0);
    setRotX(0);
    soundManager.playButtonClick();
  }, []);

  // Toggle Continuous 360° Auto-Orbit Spin
  const toggleAutoSpin = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playButtonClick();
    setIsAutoSpinning((prev) => !prev);
  }, []);

  // Dimensions
  const dimClasses = size === 'compact' 
    ? 'w-[210px] h-[310px]'
    : size === 'large'
    ? 'w-[330px] h-[480px]'
    : 'w-[270px] h-[400px]';

  // Refractor styling
  const getRefractorStyles = () => {
    switch (card.refractorTier) {
      case 'SUPERFRACTOR_1_OF_1':
        return {
          badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-black',
          foilClass: 'foil-superfractor'
        };
      case 'ATOMIC_MOJO':
        return {
          badgeBg: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white',
          foilClass: 'foil-atomic'
        };
      case 'SAPPHIRE':
        return {
          badgeBg: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white',
          foilClass: 'foil-sapphire'
        };
      case 'GOLD_WAVE':
        return {
          badgeBg: 'bg-amber-500 text-slate-950',
          foilClass: 'foil-goldwave'
        };
      case 'RAINBOW':
        return {
          badgeBg: 'bg-gradient-to-r from-red-500 via-emerald-500 to-blue-600 text-white',
          foilClass: 'foil-rainbow'
        };
      default:
        return {
          badgeBg: 'bg-slate-900 text-white',
          foilClass: ''
        };
    }
  };

  const refStyle = getRefractorStyles();

  // Set-Specific Border Theme
  const getSetBorderTheme = () => {
    switch (setId) {
      case 'HERITAGE':
        return {
          outerCardClass: 'card-3d-slab texture-heritage-kraft p-1.5 border border-[#997950]',
          innerPhotoClass: 'bg-[#f4ebe1] border-2 border-[#b59972] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]',
          teamHeaderClass: 'text-[#8b2500] font-display font-black tracking-widest drop-shadow-[0_1px_0_#fff]',
          nameplateClass: 'bg-[#d8c3a5] text-[#2b1810] border border-[#a89078] shadow-sm',
          positionClass: 'bg-[#b85d19] text-[#fff8f0] border border-[#d8c3a5] font-black',
          backClass: 'texture-heritage-kraft border-2 border-[#805a30] text-[#331c0a]',
          backStatBoxClass: 'bg-[#f2e6d6] border border-[#9c784e] text-[#2b1810]',
          chopBadge: (
            <div className="px-2 py-0.5 bg-[#8b2500] text-[#ffeedd] rounded font-display font-black border border-[#d9822b] shadow flex items-center gap-1 text-[10px] uppercase">
              <span>⭐</span>
              <span>1975 VINTAGE</span>
            </div>
          ),
          setNameLabel: 'VINTAGE 1975'
        };

      case 'BOWMAN':
        return {
          outerCardClass: 'card-3d-slab texture-bowman-carbon p-1.5 border border-cyan-400/70',
          innerPhotoClass: 'bg-gradient-to-b from-slate-950 via-[#0a1827] to-slate-950 border border-cyan-500/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-cyan-300 font-display font-black tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]',
          nameplateClass: 'bg-slate-900/95 text-white border border-cyan-400 shadow-[0_2px_10px_rgba(6,182,212,0.25)]',
          positionClass: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-950 border border-white font-black',
          backClass: 'bg-[#08111b] border border-cyan-500/50 text-slate-100',
          backStatBoxClass: 'bg-[#0e1d2c] border border-cyan-800/80 text-cyan-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-slate-950 font-display font-black rounded border border-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.6)] flex items-center gap-1 text-[10.5px] uppercase tracking-tight">
              <span className="bg-black text-cyan-300 text-[8px] px-1 rounded font-mono font-extrabold">1st</span>
              <span>PROSPECT</span>
            </div>
          ),
          setNameLabel: 'CHOP PROSPECT 1st'
        };

      case 'CHROME':
        return {
          outerCardClass: 'card-3d-slab texture-chrome-specular p-1.5 border border-white/80',
          innerPhotoClass: 'bg-gradient-to-b from-slate-950 via-[#0f1722] to-slate-950 border border-slate-300/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]',
          teamHeaderClass: 'text-white font-display font-black tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]',
          nameplateClass: 'bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-950 border border-slate-400 shadow-md',
          positionClass: 'bg-gradient-to-br from-slate-900 to-black text-white border border-slate-300',
          backClass: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 border border-slate-400 text-slate-900',
          backStatBoxClass: 'bg-white/80 border border-slate-400 text-slate-900',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-900 font-display font-black italic rounded border border-white shadow-[0_2px_8px_rgba(255,255,255,0.7)] flex items-center gap-1 text-[10.5px]">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              <span>CHOP CHROMIUM</span>
            </div>
          ),
          setNameLabel: 'CHOP CHROMIUM'
        };

      default:
        return {
          outerCardClass: 'card-3d-slab texture-series1-neon p-1.5 border border-orange-500/60',
          innerPhotoClass: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-orange-500/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-orange-400 font-display font-black tracking-widest drop-shadow-[0_2px_0_#000]',
          nameplateClass: 'bg-slate-950/95 text-white border border-white/20 shadow-md',
          positionClass: 'bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 border border-white/40 font-black',
          backClass: 'bg-[#0f172a] border border-white/10 text-slate-100',
          backStatBoxClass: 'bg-black/40 border border-white/5 text-slate-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-display font-black italic rounded border border-white shadow flex items-center gap-1 text-[10.5px]">
              <span>🔥</span>
              <span>CHOP</span>
              <span className="text-[7px] font-mono font-extrabold text-amber-950 leading-none">™</span>
            </div>
          ),
          setNameLabel: '2024 SERIES 1'
        };
    }
  };

  const setBorder = getSetBorderTheme();

  return (
    <div className={`perspective-1000 select-none group/card-wrapper relative ${className}`}>
      {/* 3D Liquid Glass Backlight Aura */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-3xl pointer-events-none transition-transform duration-300 -z-10 blur-2xl opacity-75 group-hover/card-wrapper:opacity-100"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.55) 0%, rgba(234, 88, 12, 0.3) 40%, rgba(217, 119, 6, 0.12) 65%, transparent 75%)',
          transform: `translate3d(${Math.sin((rotY * Math.PI) / 180) * 15}px, ${-rotX * 1.2}px, -25px)`
        }}
      />

      {/* The 3D Rotating Card Container with 360° preserve-3d and smooth spring damping */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onInspect}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025, 1.025, 1.025)`,
          transition: isDragging ? 'none' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
          ['--foil-x' as string]: `${foilPos.x}%`,
          ['--foil-y' as string]: `${foilPos.y}%`
        }}
        className={`${dimClasses} preserve-3d relative rounded-2xl cursor-grab active:cursor-grabbing shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85),0_0_25px_rgba(249,115,22,0.25)]`}
        title="Drag left/right to rotate 360° smoothly. Click buttons below for instant 180° flip or auto-orbit."
      >
        {/* Specular Bevel & Dynamic Light Sheen */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `linear-gradient(${115 + (rotY % 180)}deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 38%, transparent 55%, rgba(249,115,22,0.14) 100%)`,
            boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.6)'
          }}
        />

        {/* =========================================================================
            CARD FRONT (Visible from 0° to 90° and 270° to 360°)
            ========================================================================= */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl flex flex-col justify-between overflow-hidden backdrop-blur-sm ${setBorder.outerCardClass}`}
          style={{ transform: 'translateZ(1px)' }}
        >
          {/* Holographic Refractor Foil Layer */}
          {!isBase && (
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${refStyle.foilClass}`}
              style={{
                opacity: 0.82,
                backgroundPosition: `${foilPos.x}% ${foilPos.y}%`
              }}
            />
          )}

          {/* Inner Photo Window & Atmosphere */}
          <div className={`w-full h-full ${setId === 'STADIUM_CLUB' ? 'p-0' : 'p-1 sm:p-1.5'} flex flex-col justify-between relative z-20`}>
            <div className={`w-full h-full rounded-xl flex flex-col justify-between overflow-hidden relative ${setBorder.innerPhotoClass}`}>
              
              {/* Ballpark Turf Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.4) 0%, transparent 60%), linear-gradient(0deg, #0d381e 0%, transparent 80%)'
                }}
              />

              {/* AUTHENTIC ACRYLIC SLAB HEADER (Graded / Stamped Foil) */}
              <div className="relative z-30 px-2 py-0.5 bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90 border-b border-white/10 flex items-center justify-between text-[8.5px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span className="font-black text-slate-300 tracking-wider">CHOP SLAB VAULT</span>
                </div>
                {effectiveSerialStamp && (
                  <div className={`px-1.5 py-0.2 rounded font-black tracking-widest text-[8px] border shadow-sm ${
                    effectiveSerialStamp.includes('1/1') || card.refractorTier === 'SUPERFRACTOR_1_OF_1'
                      ? 'bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500 text-black border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse'
                      : card.refractorTier === 'GOLD_WAVE'
                      ? 'bg-amber-950 text-amber-300 border-amber-400'
                      : card.refractorTier === 'SAPPHIRE'
                      ? 'bg-blue-950 text-blue-300 border-blue-400'
                      : card.refractorTier === 'ATOMIC_MOJO'
                      ? 'bg-purple-950 text-cyan-300 border-fuchsia-400'
                      : 'bg-slate-800 text-slate-200 border-slate-600'
                  }`}>
                    {effectiveSerialStamp.includes('1/1') || card.refractorTier === 'SUPERFRACTOR_1_OF_1' ? '★ 1/1 GOLD FOIL ★' : effectiveSerialStamp}
                  </div>
                )}
              </div>

              {/* CARD TOP BAR: TEAM ARCH, POSITION BADGE & CHOP LOGO */}
              <div className="relative z-20 pt-1.5 px-2.5 flex items-start justify-between">
                <div className="flex flex-col">
                  <span className={`text-[12px] uppercase leading-none drop-shadow-md ${setBorder.teamHeaderClass}`}>
                    {card.team.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {/* Position Icon & Badge */}
                    <span className="text-[8px] font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                      <span>{posConfig.symbol}</span>
                      <span>{card.position}</span>
                    </span>
                    <span className="text-[7.5px] font-mono text-slate-400 bg-black/60 px-1 py-0.2 rounded border border-white/10 uppercase">
                      #{cardNo}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {setBorder.chopBadge}
                </div>
              </div>

              {/* CENTER: PLAYER AVATAR, POSITION FIELD VIGNETTE & BASEBALL REFERENCE NICKNAME */}
              <div className="my-auto relative flex flex-col items-center justify-center p-2 z-10 w-full">
                
                {/* Position-Specific Field Backdrop Frame */}
                <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-b ${posConfig.bgGradient} border-2 border-[${posConfig.accentColor}]/50 shadow-2xl flex flex-col items-center justify-center overflow-hidden group/portrait`}>
                  
                  {/* Field Watermark Silhouette */}
                  <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center justify-center">
                    {posConfig.fieldSvgType === 'PITCHER_MOUND' && (
                      <div className="w-24 h-24 rounded-full border-4 border-dashed border-amber-400/30 flex items-center justify-center">
                        <div className="w-10 h-2 bg-white/40 rounded-sm" />
                      </div>
                    )}
                    {posConfig.fieldSvgType === 'CATCHER_GEAR' && (
                      <div className="w-16 h-16 border-2 border-amber-400/40 rotate-45 flex items-center justify-center">
                        <div className="w-8 h-8 border border-white/30" />
                      </div>
                    )}
                    {(posConfig.fieldSvgType === 'INFIELD_CORNER' || posConfig.fieldSvgType === 'MIDDLE_INFIELD') && (
                      <div className="w-20 h-20 border-2 border-white/20 rotate-45" />
                    )}
                    {posConfig.fieldSvgType === 'OUTFIELD_WALL' && (
                      <div className="w-full h-8 border-t-2 border-dashed border-emerald-400/40 mt-12 bg-emerald-950/40" />
                    )}
                    {posConfig.fieldSvgType === 'BATTER_BOX' && (
                      <div className="w-12 h-20 border-2 border-red-500/30 flex items-center justify-center" />
                    )}
                  </div>

                  {/* Dual Position & Nickname Icon Art */}
                  <div className="relative z-10 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] select-none transform group-hover/portrait:scale-110 transition-transform duration-300 block">
                      {bRefData.icon || card.avatarIcon}
                    </span>

                    {/* Floating Position Gear Badge */}
                    <span 
                      title={`${card.position}: ${posConfig.roleName}`}
                      className="absolute -bottom-2 -right-3 text-xs bg-slate-950 text-amber-300 border border-amber-400 rounded-full w-6 h-6 flex items-center justify-center shadow-lg font-black"
                    >
                      {posConfig.symbol}
                    </span>
                  </div>

                  {/* Micro Position Tag */}
                  <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
                    <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-300/80 bg-black/60 px-1.5 py-0.2 rounded-full uppercase">
                      {posConfig.badge}
                    </span>
                  </div>

                  {card.refractorTier !== 'BASE' && (
                    <span className="absolute top-1 right-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shadow-lg border border-white/20 bg-orange-600 text-white animate-pulse">
                      ✨
                    </span>
                  )}
                </div>

                {/* OFFICIAL BASEBALL REFERENCE NICKNAME BANNER */}
                <div className="mt-2 relative z-20 select-none text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-amber-400/35 to-amber-500/25 border border-amber-400/80 shadow-[0_2px_10px_rgba(245,158,11,0.35)]">
                    <span className="text-[9px] text-amber-400">⚡</span>
                    <span className="text-[10px] sm:text-[11px] font-display font-black tracking-wider text-amber-200 uppercase drop-shadow">
                      "{bRefData.nickname}"
                    </span>
                    <span className="text-[7.5px] font-mono font-black text-slate-950 bg-amber-400 px-1 rounded">
                      bRef
                    </span>
                  </div>
                </div>

                {/* Certified On-Card / Immortals Signature */}
                {hasAutograph && (
                  <div className="mt-1 relative z-20 select-none pointer-events-none transform -rotate-3">
                    <span className="font-signature text-2xl sm:text-3xl font-bold tracking-wider text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      {card.name}
                    </span>
                    <span className="block text-[6.5px] font-mono uppercase tracking-widest text-amber-400/80 -mt-1 text-center font-bold">
                      ★ CERTIFIED ON-CARD SIGNATURE ★
                    </span>
                  </div>
                )}

                {/* bRef WAR Metric Pill */}
                <div className="mt-1.5">
                  <LosslessWarBadge card={card} />
                </div>
              </div>

              {/* BOTTOM NAMEPLATE & RAISED 3D DIAMOND BADGE */}
              <div className="relative z-20 p-2 bg-gradient-to-t from-black via-black/95 to-transparent">
                <div className={`rounded-lg p-1.5 shadow-md flex items-center justify-between gap-1.5 ${setBorder.nameplateClass}`}>
                  <div className="truncate pr-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] font-mono text-slate-400 uppercase">
                        {posConfig.roleName}
                      </span>
                    </div>
                    <h3 className="text-sm font-display font-black tracking-wide uppercase leading-tight truncate">
                      {card.name}
                    </h3>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <div className="text-center px-1.5 py-0.5 rounded bg-black/40 border border-current/20">
                      <span className="text-xs">{posConfig.symbol}</span>
                      <span className="block text-[7px] font-black">{card.position}</span>
                    </div>
                    <BaseballDiamondBadge
                      position={card.position}
                      playerName={card.name}
                      size="sm"
                      interactive={false}
                    />
                  </div>
                </div>

                {/* At-Bat Stats */}
                <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-300 px-1">
                  <div className="flex gap-2">
                    <span>CON: <strong className="text-white">{card.stats.contact}</strong></span>
                    <span>POW: <strong className="text-amber-400">{card.stats.power}</strong></span>
                  </div>
                  {card.signatureSkill && (
                    <span className="text-orange-400 font-bold truncate max-w-[120px]">
                      {card.signatureSkill.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 3D Metallic Foil Die-Stamped Serial Number */}
          {effectiveSerialStamp && (
            <div className="absolute bottom-2.5 left-3 z-30 transition-transform duration-300 hover:scale-110 select-none">
              <div
                className={`px-2 py-0.5 rounded flex items-center gap-1.5 border shadow-[0_2px_10px_rgba(0,0,0,0.85)] ${
                  effectiveSerialStamp.includes('1/1') || card.refractorTier === 'SUPERFRACTOR_1_OF_1'
                    ? 'bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500 text-slate-950 border-amber-200 ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                    : card.refractorTier === 'GOLD_WAVE'
                    ? 'bg-gradient-to-r from-yellow-500 via-amber-200 to-yellow-600 text-slate-950 border-amber-300 ring-1 ring-yellow-400/80 shadow-[0_0_10px_rgba(245,158,11,0.7)]'
                    : card.refractorTier === 'SAPPHIRE'
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-100 to-blue-600 text-slate-950 border-cyan-200 ring-1 ring-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                    : card.refractorTier === 'ATOMIC_MOJO'
                    ? 'bg-gradient-to-r from-fuchsia-400 via-pink-200 to-cyan-400 text-slate-950 border-pink-200 ring-1 ring-purple-400/80 shadow-[0_0_10px_rgba(217,70,239,0.7)]'
                    : 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-950 border-white ring-1 ring-white/60 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                }`}
              >
                {effectiveSerialStamp.includes('1/1') ? (
                  <span className="text-[10px] leading-none filter drop-shadow">💎</span>
                ) : (
                  <span className="text-[9px] font-mono font-black text-slate-800 leading-none">№</span>
                )}
                <span className="text-[10px] sm:text-[11px] font-mono font-black tracking-widest uppercase leading-none">
                  {effectiveSerialStamp}
                </span>
                {effectiveSerialStamp.includes('1/1') && (
                  <span className="text-[7px] font-mono font-black bg-black text-amber-300 px-1 py-0.5 rounded leading-none">
                    1 OF 1
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Controls Bar: Reset Front + Continuous 360° Auto-Orbit + Quick Flip 180° */}
          <div className="absolute bottom-2.5 right-3 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetToFront}
              title="Reset To Front (0°)"
              aria-label="Reset To Front"
              className="p-1.5 rounded-full bg-black/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shadow-md border border-white/20"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={toggleAutoSpin}
              title={isAutoSpinning ? 'Pause 360° Orbit' : 'Continuous Smooth 360° Showcase Spin'}
              aria-label="360 Orbit Spin"
              className={`p-1.5 rounded-full transition-all shadow-md border ${
                isAutoSpinning
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 border-amber-200 ring-2 ring-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                  : 'bg-black/80 hover:bg-slate-800 text-amber-300 border-white/20'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isAutoSpinning ? '4s' : '12s' }} />
            </button>

            <button
              type="button"
              onClick={toggleFlip}
              aria-label="Flip card 180 degrees"
              title="Flip 180° to back"
              className="p-1.5 rounded-full bg-black/80 hover:bg-orange-600 text-slate-200 hover:text-white transition-colors shadow-md border border-white/20"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CARD BACK (Visible from 90° to 270°)
            True 3D Backplate rotated 180 degrees with backface-hidden
            ========================================================================= */}
        <div
          className={`absolute inset-0 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-2xl card-3d-slab ${setBorder.backClass}`}
          style={{
            transform: 'rotateY(180deg) translateZ(1px)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Slab Header on Back */}
          <div className="border-b border-current/25 pb-1 mb-1 flex items-center justify-between text-[8px] font-mono">
            <div className="flex items-center gap-1.5">
              <span>{posConfig.symbol}</span>
              <span className="font-black tracking-wider uppercase opacity-75">{posConfig.badge} · {posConfig.roleName}</span>
            </div>
            {effectiveSerialStamp && (
              <span className={`px-1.5 py-0.2 rounded font-black tracking-widest border shadow-sm ${
                effectiveSerialStamp.includes('1/1') || card.refractorTier === 'SUPERFRACTOR_1_OF_1'
                  ? 'bg-amber-400 text-black border-amber-300 font-black'
                  : 'bg-black/70 text-amber-300 border-amber-500/40'
              }`}>
                {effectiveSerialStamp.includes('1/1') || card.refractorTier === 'SUPERFRACTOR_1_OF_1' ? '1/1 GOLD FOIL' : effectiveSerialStamp}
              </span>
            )}
          </div>

          {/* Top Bar: Card Number, Name, Position & bRef Moniker */}
          <div className="border-b border-current/25 pb-1.5 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm">
                #{cardNo}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-display font-black uppercase tracking-tight leading-none">
                    {card.name}
                  </h4>
                  <span className="text-[8px] font-mono font-bold text-amber-600 bg-amber-500/10 px-1 py-0.2 rounded">
                    "{bRefData.nickname}"
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold opacity-80 block mt-0.5">
                  {card.team} · {card.position} ({posConfig.symbol}) · {setBorder.setNameLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleFlip}
                aria-label="Flip card back to front"
                className="p-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition-colors"
                title="Flip back to front"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Vitals Line & Tactical Zone */}
          <div className="py-1 border-b border-current/20 text-[8px] font-mono opacity-85 flex justify-between">
            <span>{card.cardVitals?.batsThrows || 'BATS: R · THROWS: R'}</span>
            <span>ZONE: {posConfig.fieldingZone}</span>
          </div>

          {/* Major League Record Table */}
          <div className={`my-1 rounded-md p-1 shadow-inner ${setBorder.backStatBoxClass}`}>
            <span className="text-[7.5px] font-mono font-black text-slate-700 uppercase tracking-wider block mb-0.5 text-center">
              COMPLETE MAJOR LEAGUE RECORD (BASEBALL-REFERENCE VERIFIED)
            </span>
            <table className="w-full text-center text-[8px] font-mono">
              <thead>
                <tr className="border-b border-slate-400 text-slate-700 text-[7px] font-bold">
                  <th>G</th>
                  <th>H</th>
                  <th>HR</th>
                  <th>RBI</th>
                  <th>AVG</th>
                  <th>OPS</th>
                  <th>WAR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold text-slate-900">
                  <td>{card.careerStats?.games || 2480}</td>
                  <td>{card.careerStats?.hits || 2840}</td>
                  <td className="text-amber-800">{card.careerStats?.homeRuns || 380}</td>
                  <td>{card.careerStats?.rbi || 1420}</td>
                  <td>{card.careerStats?.avg || '.295'}</td>
                  <td>{card.careerStats?.ops || '.890'}</td>
                  <td className="text-emerald-800 font-black">{card.bRefWar}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Illustrated Trivia Box & Tactical Fielding Scout */}
          <div className="my-auto bg-[#faf8f2] border border-slate-400 rounded-lg p-2 text-[9.5px] leading-relaxed shadow-sm">
            <div className="flex items-center justify-between text-amber-900 font-display font-black text-[9.5px] uppercase mb-0.5">
              <div className="flex items-center gap-1">
                <span>⚾</span>
                <span>{bRefData.nickname} · {card.position} SCOUTING</span>
              </div>
              <span className="text-[8px] font-mono bg-amber-100 text-amber-900 px-1 rounded">
                {posConfig.tacticalDescription}
              </span>
            </div>
            <p className="text-slate-800 text-[9px] italic leading-tight">
              "{card.bio}"
            </p>
          </div>

          {/* Publisher Seal */}
          <div className="pt-1.5 border-t-2 border-slate-800 flex items-center justify-between text-[7.5px] font-mono text-slate-700">
            <div className="flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3 text-orange-600" />
              <span>© CHOP TRADING CARD CO. • {setBorder.setNameLabel}</span>
            </div>
            <span className="font-mono text-[8px] tracking-widest text-slate-800 font-bold">
              OFFICIAL BASEBALL CARD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
