import React, { useState, useRef, useEffect } from 'react';
import { PlayerCard, CardSetId } from '../types/game';
import { soundManager } from '../services/audio';
import { RotateCw, ShieldCheck, Award, Star, Flame, Trophy, Sparkles, Orbit } from 'lucide-react';

import { BaseballDiamondBadge } from './BaseballDiamondBadge';
import { MiniFieldTracker } from './MiniFieldTracker';
import { LosslessWarBadge } from './LosslessWarBadge';

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
  
  // 360-Degree Continuous Rotation State
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialRotY: 0, initialRotX: 0 });
  const [foilPos, setFoilPos] = useState({ x: 50, y: 50 });
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);

  const setId: CardSetId = overrideSetId || card.cardSetId || 'SERIES_1';
  const isBase = card.refractorTier === 'BASE';
  const cardNo = card.cardNo ?? (card.id ? parseInt(card.id.replace(/\D/g, '') || '8', 10) : 8);

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

  // Auto 360° Continuous Orbit Loop
  useEffect(() => {
    if (!isAutoSpinning) return;
    let animId: number;
    const spinStep = () => {
      setRotY((prev) => (prev + 1.2) % 360);
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
      
      // Free 360° horizontal rotation and ±35° vertical tilt
      const nextRotY = (dragStart.initialRotY + deltaX * 0.95);
      const nextRotX = Math.max(-35, Math.min(35, dragStart.initialRotX - deltaY * 0.5));
      
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
      const gentleY = ((x - midX) / midX) * 14;
      const gentleX = -((y - midY) / midY) * 14;
      
      // Apply subtle tilt without disrupting current 360 face angle
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
    
    const nextRotY = dragStart.initialRotY + deltaX * 1.1;
    const nextRotX = Math.max(-35, Math.min(35, dragStart.initialRotX - deltaY * 0.6));
    
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

  // Toggle Instant 180° Card Flip
  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playRefractorShine();
    setIsAutoSpinning(false);
    // Smoothly flip to the opposite side
    setRotY((prev) => prev + 180);
  };

  // Toggle Continuous 360° Auto-Orbit Spin
  const toggleAutoSpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playButtonClick();
    setIsAutoSpinning((prev) => !prev);
  };

  // Dimensions
  const dimClasses = size === 'compact' 
    ? 'w-[210px] h-[300px]'
    : size === 'large'
    ? 'w-[330px] h-[470px]'
    : 'w-[270px] h-[390px]';

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

  // SET-SPECIFIC BORDER THEME (Original collector styling)
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
              <span>1975 THROWBACK</span>
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

      case 'STADIUM_CLUB':
        return {
          outerCardClass: 'card-3d-slab texture-stadium-fullbleed p-0 border border-amber-500/50',
          innerPhotoClass: 'bg-gradient-to-b from-black/20 via-slate-950/70 to-black border-0',
          teamHeaderClass: 'text-amber-300 font-display font-black uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]',
          nameplateClass: 'bg-black/90 text-white border border-amber-500/50 backdrop-blur-md shadow-2xl',
          positionClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border border-amber-200 font-black',
          backClass: 'bg-[#0a0a0c] border border-amber-500/40 text-slate-100',
          backStatBoxClass: 'bg-black/80 border border-amber-500/30 text-amber-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-black/85 text-amber-300 border border-amber-400/90 rounded font-display font-black text-[10.5px] tracking-wider uppercase backdrop-blur-md flex items-center gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <span className="text-amber-400">📷</span>
              <span>BALLPARK CLUB</span>
            </div>
          ),
          setNameLabel: 'BALLPARK CLUB'
        };

      case 'ALLEN_GINTER':
        return {
          outerCardClass: 'card-3d-slab texture-ginter-parchment p-1.5 border border-[#bfa57b]',
          innerPhotoClass: 'bg-[#e8dec7] border border-[#a1875c] shadow-[inset_0_1px_4px_rgba(0,0,0,0.35)]',
          teamHeaderClass: 'text-[#381e05] font-display font-black uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]',
          nameplateClass: 'bg-[#faf6eb] text-[#3e2723] border border-[#a1885f] shadow-sm',
          positionClass: 'bg-[#78350f] text-[#fef3c7] border border-[#decba4]',
          backClass: 'texture-ginter-parchment border border-[#bfa57b] text-[#3e2723]',
          backStatBoxClass: 'bg-[#eee4cf] border border-[#a1885f] text-[#3e2723]',
          chopBadge: (
            <div className="px-2 py-0.5 bg-[#451a03] text-[#fef3c7] rounded border border-[#b45309] shadow flex items-center gap-1 font-serif text-[10px] tracking-tight">
              <span>⚜️</span>
              <span className="font-bold">CHOP TOBACCO ERA</span>
              <span className="text-[7px] font-mono opacity-80">1887</span>
            </div>
          ),
          setNameLabel: 'TOBACCO ERA 1887'
        };

      case 'SERIES_2':
        return {
          outerCardClass: 'card-3d-slab texture-series2-solar p-1.5 border border-red-500/70',
          innerPhotoClass: 'bg-gradient-to-b from-orange-950 via-slate-900 to-black border border-red-500/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-orange-400 font-display font-black tracking-widest drop-shadow-[0_2px_0_#000]',
          nameplateClass: 'bg-slate-950 text-white border border-red-500/80 shadow-md',
          positionClass: 'bg-gradient-to-br from-red-600 to-amber-600 text-white border border-white font-black',
          backClass: 'bg-[#150a0a] border border-red-500/40 text-slate-100',
          backStatBoxClass: 'bg-[#220d0d] border border-red-700/60 text-red-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded font-display font-black text-[10.5px] tracking-wider uppercase border border-amber-300 shadow">
              <span>☀️</span>
              <span>SERIES 2</span>
            </div>
          ),
          setNameLabel: '2024 SERIES 2'
        };

      case 'UPDATE_SERIES':
        return {
          outerCardClass: 'card-3d-slab texture-update-midnight p-1.5 border border-amber-400/80',
          innerPhotoClass: 'bg-gradient-to-b from-[#071328] via-slate-950 to-[#040914] border border-amber-500/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]',
          teamHeaderClass: 'text-amber-300 font-display font-black tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]',
          nameplateClass: 'bg-[#09152b] text-amber-100 border border-amber-400 shadow-md',
          positionClass: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border border-white font-black',
          backClass: 'bg-[#060e1d] border border-amber-500/40 text-slate-100',
          backStatBoxClass: 'bg-[#0d1d38] border border-amber-600/60 text-amber-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded font-display font-black text-[10.5px] tracking-wider uppercase border border-white shadow">
              <span>🏆</span>
              <span>UPDATE SERIES</span>
            </div>
          ),
          setNameLabel: 'UPDATE SERIES'
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
              <Flame className="w-3 h-3 fill-slate-950" />
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
        className="absolute -inset-4 sm:-inset-6 rounded-3xl pointer-events-none transition-transform duration-200 -z-10 blur-2xl opacity-75 group-hover/card-wrapper:opacity-100"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.55) 0%, rgba(234, 88, 12, 0.3) 40%, rgba(217, 119, 6, 0.12) 65%, transparent 75%)',
          transform: `translate3d(${Math.sin((rotY * Math.PI) / 180) * 15}px, ${-rotX * 1.2}px, -25px)`
        }}
      />

      {/* The 3D Rotating Card Container with 360° preserve-3d */}
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
          ['--foil-x' as string]: `${foilPos.x}%`,
          ['--foil-y' as string]: `${foilPos.y}%`
        }}
        className={`${dimClasses} preserve-3d relative rounded-2xl cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? 'duration-0' : 'duration-150'
        } ease-out shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85),0_0_25px_rgba(249,115,22,0.25)]`}
        title="Click to view Accumulated Stats, Game Modes & Community Leaderboard. Drag to rotate 360°!"
      >
        {/* Specular Bevel & Dynamic Light Sheen */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-200"
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

              {/* CARD TOP BAR: TEAM ARCH & CHOP LOGO */}
              <div className="relative z-20 pt-2 px-2.5 flex items-start justify-between">
                <div className="flex flex-col">
                  <span className={`text-[12px] uppercase leading-none drop-shadow-md ${setBorder.teamHeaderClass}`}>
                    {card.team.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono font-bold text-slate-300">
                      {card.era.split('•')[0]}
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

              {/* CENTER: PLAYER AVATAR & ON-CARD AUTOGRAPH */}
              <div className="my-auto relative flex flex-col items-center justify-center p-2 z-10">
                <div className="relative flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] select-none transform hover:scale-110 transition-transform duration-300">
                    {card.avatarIcon}
                  </span>

                  {card.refractorTier !== 'BASE' && (
                    <span className="absolute -top-1 -right-2 text-xs font-mono font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white/20 bg-orange-600 text-white animate-pulse">
                      ✨
                    </span>
                  )}
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
                    <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block leading-none">
                      {card.team}
                    </span>
                    <h3 className="text-sm font-display font-black tracking-wide uppercase leading-tight truncate">
                      {card.name}
                    </h3>
                  </div>

                  <div className="shrink-0">
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

          {/* Controls Bar: Continuous 360° Auto-Orbit + Quick Flip 180° */}
          <div className="absolute bottom-2.5 right-3 z-30 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleAutoSpin}
              title={isAutoSpinning ? 'Pause 360° Orbit' : 'Continuous 360° Auto-Orbit Spin'}
              aria-label="360 Orbit Spin"
              className={`p-1.5 rounded-full transition-all shadow-md border ${
                isAutoSpinning
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 border-amber-200 ring-2 ring-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                  : 'bg-black/80 hover:bg-slate-800 text-amber-300 border-white/20'
              }`}
            >
              <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isAutoSpinning ? '3s' : '12s' }} />
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
          {/* Top Bar: Card Number, Name, Position */}
          <div className="border-b border-current/25 pb-1.5 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm">
                #{cardNo}
              </div>
              <div>
                <h4 className="text-xs font-display font-black uppercase tracking-tight leading-none">
                  {card.name}
                </h4>
                <span className="text-[9px] font-mono font-bold opacity-80 block mt-0.5">
                  {card.team} · {card.position} · {setBorder.setNameLabel}
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

          {/* Vitals Line */}
          <div className="py-1 border-b border-current/20 text-[8.5px] font-mono opacity-85 flex justify-between">
            <span>{card.cardVitals?.batsThrows || 'BATS: R · THROWS: R'}</span>
            <span>{card.cardVitals?.height ? `${card.cardVitals.height}, ${card.cardVitals.weight}` : `HT: 6'2" · WT: 210`}</span>
          </div>

          {/* Major League Record Table */}
          <div className={`my-1 rounded-md p-1 shadow-inner ${setBorder.backStatBoxClass}`}>
            <span className="text-[7.5px] font-mono font-black text-slate-700 uppercase tracking-wider block mb-0.5 text-center">
              COMPLETE MAJOR LEAGUE RECORD
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

          {/* Illustrated Trivia Box */}
          <div className="my-auto bg-[#faf8f2] border border-slate-400 rounded-lg p-2 text-[10px] leading-relaxed shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-900 font-display font-black text-[10px] uppercase mb-0.5">
              <span>⚾</span>
              <span>{setBorder.setNameLabel} TRIVIA & BIO</span>
            </div>
            <p className="text-slate-800 text-[9.5px] italic leading-tight">
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
