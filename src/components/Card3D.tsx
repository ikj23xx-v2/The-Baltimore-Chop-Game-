import React, { useState, useRef, useEffect } from 'react';
import { PlayerCard, CardSetId } from '../types/game';
import { soundManager } from '../services/audio';
import { RotateCw, ShieldCheck, Award, Star, Flame, Trophy, Sparkles } from 'lucide-react';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [foilPos, setFoilPos] = useState({ x: 50, y: 50 });
  const [gyroActive, setGyroActive] = useState(false);

  const setId: CardSetId = overrideSetId || card.cardSetId || 'SERIES_1';
  const isBase = card.refractorTier === 'BASE';
  const cardNo = card.cardNo ?? (card.id ? parseInt(card.id.replace(/\D/g, '') || '8', 10) : 8);
  const isHistoricalOrLegend = card.isHistorical || card.bRefWar >= 50 || cardNo % 2 === 0;

  // Desktop Mouse Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotY = ((x - midX) / midX) * 16;
    const rotX = -((y - midY) / midY) * 16;
    setRotation({ x: rotX, y: rotY });

    const pX = (x / rect.width) * 100;
    const pY = (y / rect.height) * 100;
    setFoilPos({ x: pX, y: pY });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotation({ x: 0, y: 0 });
  };

  // Mobile Touch Drag Tilt (Safari & Chrome on iOS / Android)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || isFlipped) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotY = Math.max(-22, Math.min(22, ((x - midX) / midX) * 20));
    const rotX = Math.max(-22, Math.min(22, -((y - midY) / midY) * 20));
    setRotation({ x: rotX, y: rotY });

    const pX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setFoilPos({ x: pX, y: pY });
  };

  const handleTouchEnd = () => {
    if (!interactive) return;
    setTimeout(() => {
      setRotation((prev) => ({ x: prev.x * 0.25, y: prev.y * 0.25 }));
    }, 150);
  };

  const toggleFlip = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    soundManager.playRefractorShine();
    setIsFlipped(!isFlipped);
  };

  // iOS Safari 13+ Device Motion Permission Request helper
  const requestGyroPermission = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setGyroActive(true);
          soundManager.playButtonClick();
        }
      } catch (err) {
        console.warn('Gyro permission request rejected', err);
      }
    } else {
      setGyroActive((prev) => !prev);
    }
  };

  // Device orientation / gyro on mobile (Safari & Chrome)
  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isFlipped || e.gamma === null || e.beta === null) return;
      const rotY = Math.min(Math.max(e.gamma, -24), 24);
      const rotX = Math.min(Math.max(-e.beta + 45, -24), 24);
      setRotation({ x: rotX, y: rotY });
      setFoilPos({ x: (rotY + 24) * 2.08, y: (rotX + 24) * 2.08 });
      setGyroActive(true);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [interactive, isFlipped]);

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

  // =========================================================================
  // SET-SPECIFIC BORDER & ARCHITECTURE ENGINE (MIMICS THIS YEAR'S TOPPS SETS)
  // =========================================================================
  // =========================================================================
  // SET-SPECIFIC BORDER & ARCHITECTURE ENGINE (AUTHENTIC 3D TEXTURED PRINT)
  // Slim authentic margins, 3D cardstock depth, no bulky white slabs
  // =========================================================================
  const getSetBorderTheme = () => {
    switch (setId) {
      case 'HERITAGE':
        // 1975 Vintage Two-Tone Split Colorblock on Rough Kraft Chipboard
        return {
          outerCardClass: 'card-3d-slab texture-heritage-kraft p-1.5 border border-[#997950]',
          innerPhotoClass: 'bg-[#1b2f22] border border-[#52412b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]',
          teamHeaderClass: 'text-[#fef08a] font-display font-black tracking-widest drop-shadow-[0_2px_0_#000]',
          nameplateClass: 'bg-[#fef9c3] text-slate-950 border border-[#422006] shadow-sm',
          positionClass: 'bg-[#dc2626] text-white border border-[#422006] shadow',
          backClass: 'texture-heritage-kraft border border-[#997950] text-slate-900',
          backStatBoxClass: 'bg-[#e5d4bc] border border-[#a88a62] text-slate-900',
          chopBadge: (
            <div className="px-2 py-0.5 bg-[#dc2626] text-white rounded-full border border-yellow-300 shadow-md flex items-center gap-1 font-display font-black italic text-[10.5px]">
              <span className="text-[10px]">⚾</span>
              <span>CHOP</span>
              <span className="text-[7px] font-mono font-normal opacity-90">’75</span>
            </div>
          ),
          setNameLabel: '1975 HERITAGE'
        };

      case 'BOWMAN':
        // Modern 1st Prospect: Dark Carbon Weave, Metallic Cyan Bevels
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
              <span>CHOP</span>
            </div>
          ),
          setNameLabel: 'BOWMAN 1st'
        };

      case 'CHROME':
        // High-End Chromium: Platinum Mirror Specular Rim, Pristine Bevels
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
              <span>CHOP</span>
              <span className="text-[7.5px] font-mono text-slate-600 tracking-tighter">CHROME</span>
            </div>
          ),
          setNameLabel: 'CHOP CHROME'
        };

      case 'STADIUM_CLUB':
        // 100% Borderless Action Photography - Seamless Full Bleed
        return {
          outerCardClass: 'card-3d-slab texture-stadium-fullbleed p-0 border border-amber-500/50',
          innerPhotoClass: 'bg-gradient-to-b from-black/20 via-slate-950/70 to-black border-0', // Full bleed
          teamHeaderClass: 'text-amber-300 font-display font-black uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]',
          nameplateClass: 'bg-black/90 text-white border border-amber-500/50 backdrop-blur-md shadow-2xl',
          positionClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border border-amber-200 font-black',
          backClass: 'bg-[#0a0a0c] border border-amber-500/40 text-slate-100',
          backStatBoxClass: 'bg-black/80 border border-amber-500/30 text-amber-100',
          chopBadge: (
            <div className="px-2 py-0.5 bg-black/85 text-amber-300 border border-amber-400/90 rounded font-display font-black text-[10.5px] tracking-wider uppercase backdrop-blur-md flex items-center gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <span className="text-amber-400">📷</span>
              <span>CHOP CLUB</span>
            </div>
          ),
          setNameLabel: 'STADIUM CLUB'
        };

      case 'ALLEN_GINTER':
        // 1887 Victorian Aged Laid Parchment & Filigree Corners
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
              <span className="font-bold">CHOP & CO.</span>
              <span className="text-[7px] font-mono opacity-80">1887</span>
            </div>
          ),
          setNameLabel: 'GINTER 1887'
        };

      case 'SERIES_2':
        // Summer Heat: Solar Ember Gradient, Fiery Ruby Inner Notches
        return {
          outerCardClass: 'card-3d-slab texture-series2-solar p-1.5 border border-red-500/70',
          innerPhotoClass: 'bg-gradient-to-b from-orange-950 via-slate-900 to-black border border-red-500/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-orange-400 font-display font-black tracking-widest drop-shadow-[0_2px_0_#000]',
          nameplateClass: 'bg-slate-950/95 text-white border border-red-500 shadow-md',
          positionClass: 'bg-gradient-to-br from-red-600 to-orange-600 text-white border border-yellow-200 font-black',
          backClass: 'bg-[#150a0d] border border-red-500/50 text-slate-100',
          backStatBoxClass: 'bg-[#241014] border border-red-900/80 text-orange-200',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white rounded font-display font-black italic border border-yellow-200 shadow-[0_0_10px_rgba(239,68,68,0.5)] flex items-center gap-1 text-[10.5px]">
              <Flame className="w-3 h-3 text-yellow-300" />
              <span>CHOP</span>
              <span className="text-[7.5px] font-mono">SERIES 2</span>
            </div>
          ),
          setNameLabel: '2024 SERIES 2'
        };

      case 'UPDATE_SERIES':
        // Autumn Postseason: Midnight Navy & Brushed Gold Leaf Piping
        return {
          outerCardClass: 'card-3d-slab texture-update-goldleaf p-1.5 border border-amber-400',
          innerPhotoClass: 'bg-gradient-to-b from-[#050b14] via-[#0c182a] to-[#050b14] border border-amber-400/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-amber-300 font-display font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
          nameplateClass: 'bg-[#0c1a2d] text-amber-200 border border-amber-400 shadow-md',
          positionClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border border-white font-black',
          backClass: 'bg-[#08101a] border border-amber-400/60 text-slate-100',
          backStatBoxClass: 'bg-[#0d1d32] border border-amber-600/60 text-amber-200',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 rounded font-display font-black border border-white shadow-[0_0_12px_rgba(251,191,36,0.55)] flex items-center gap-1 text-[10.5px]">
              <Trophy className="w-3 h-3 text-blue-950" />
              <span>CHOP UPDATE</span>
            </div>
          ),
          setNameLabel: 'UPDATE SERIES'
        };

      case 'SERIES_1':
      default:
        // 2024 Flagship: Matte Carbon Graphite Cardstock, Electric Orange Foil Inlay, Slim Chamfers
        return {
          outerCardClass: 'card-3d-slab texture-series1 p-1.5 border border-orange-500/50',
          innerPhotoClass: 'bg-gradient-to-b from-[#080d14] via-[#101722] to-[#080d14] border border-orange-500/35 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]',
          teamHeaderClass: 'text-orange-400 font-display font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]',
          nameplateClass: 'bg-slate-950/90 text-white border border-slate-700 shadow-md',
          positionClass: 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border border-orange-300 font-black',
          backClass: 'bg-[#0c121c] border border-slate-700 text-slate-100',
          backStatBoxClass: 'bg-[#141d2c] border border-slate-700 text-slate-200',
          chopBadge: (
            <div className="px-2 py-0.5 bg-gradient-to-br from-amber-300 via-orange-500 to-amber-600 rounded shadow-[0_2px_8px_rgba(249,115,22,0.5)] border border-amber-200 flex items-center gap-1">
              <span className="text-[10px] leading-none select-none">⚾</span>
              <span className="font-display font-black italic tracking-tighter text-slate-950 text-xs leading-none">
                CHOP
              </span>
              <span className="text-[7px] font-mono font-extrabold text-amber-950 leading-none">
                ™
              </span>
            </div>
          ),
          setNameLabel: '2024 SERIES 1'
        };
    }
  };

  const setBorder = getSetBorderTheme();

  return (
    <div className={`perspective-1000 select-none group/card-wrapper relative ${className}`}>
      {/* AMBIENT ORANGE / AMBER GRADIENT BACKLIGHT GLOW (3D LIQUID GLASS AURA) */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-3xl pointer-events-none transition-transform duration-200 -z-10 blur-2xl opacity-75 group-hover/card-wrapper:opacity-100"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.55) 0%, rgba(234, 88, 12, 0.3) 40%, rgba(217, 119, 6, 0.12) 65%, transparent 75%)',
          transform: `translate3d(${rotation.y * 1.5}px, ${-rotation.x * 1.5}px, -25px)`
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onInspect}
        style={{
          transform: isFlipped 
            ? 'rotateY(180deg)' 
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.025, 1.025, 1.025)`,
          ['--foil-x' as string]: `${foilPos.x}%`,
          ['--foil-y' as string]: `${foilPos.y}%`
        }}
        className={`${dimClasses} preserve-3d relative rounded-2xl cursor-pointer transition-transform duration-150 ease-out shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85),0_0_25px_rgba(249,115,22,0.25)]`}
      >
        {/* LIQUID GLASS SURFACE SPECULAR BEVEL & REFRACTION SHEEN */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-200"
          style={{
            background: `linear-gradient(${115 + rotation.y * 1.5}deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 38%, transparent 55%, rgba(249,115,22,0.14) 100%)`,
            boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.6)'
          }}
        />

        {/* ================= CARD FRONT ================= */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl flex flex-col justify-between overflow-hidden backdrop-blur-sm ${setBorder.outerCardClass} ${
            isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          {/* Holographic Refractor Foil Layer (for parallels) */}
          {!isBase && (
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${refStyle.foilClass}`}
              style={{
                opacity: 0.78,
                backgroundPosition: `${foilPos.x}% ${foilPos.y}%`
              }}
            />
          )}

          {/* INNER CARD STRUCTURE WITH THE SET'S PHOTO BEZEL */}
          <div className={`w-full h-full ${setId === 'STADIUM_CLUB' ? 'p-0' : 'p-1 sm:p-1.5'} flex flex-col justify-between relative z-20`}>
            {/* PHOTO WINDOW & ATMOSPHERE */}
            <div className={`w-full h-full rounded-xl flex flex-col justify-between overflow-hidden relative ${setBorder.innerPhotoClass}`}>
              
              {/* Ballpark Field Texture Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.4) 0%, transparent 60%), linear-gradient(0deg, #0d381e 0%, transparent 80%)'
                }}
              />

              {/* CARD TOP BAR: TEAM ARCH & THE "CHOP" BRAND STAMP IN TOP RIGHT */}
              <div className="relative z-20 pt-2 px-2.5 flex items-start justify-between">
                {/* Team Name Banner */}
                <div className="flex flex-col">
                  <span 
                    className={`text-[12px] uppercase leading-none drop-shadow-md ${setBorder.teamHeaderClass}`}
                  >
                    {card.team.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono font-bold text-slate-300">
                      {card.era.split('•')[0]}
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-amber-300 font-bold border border-amber-500/30">
                      {setBorder.setNameLabel}
                    </span>
                    {!isBase && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${refStyle.badgeBg}`}>
                        {card.refractorTier.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* THE "CHOP" BRAND LOGO IN THE TOP RIGHT CORNER (ALWAYS PRESENT ON ALL CARDS) */}
                <div className="flex flex-col items-end">
                  {setBorder.chopBadge}
                  <span className="text-[6.5px] font-mono tracking-widest text-amber-200/90 font-black uppercase mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    OFFICIAL SET
                  </span>
                </div>
              </div>

              {/* CARD CENTER: MINI FIELD GAME TRACKER & REAL BLUE INK SIGNATURE */}
              <div className="relative z-20 my-auto flex flex-col items-center justify-center px-1.5 py-1">
                {/* MINI BASEBALL FIELD GAME TRACKER (Replaces Crown Emoji with Live Infield Tracker and Illuminated Position Pin) */}
                <div className="relative transform hover:scale-105 transition-transform duration-200">
                  <MiniFieldTracker
                    position={card.position}
                    playerName={card.name}
                    cardNo={cardNo}
                    size={size === 'compact' ? 'sm' : 'md'}
                  />
                  {card.bRefWar >= 50 && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-white flex items-center justify-center shadow-md z-30">
                      <Star className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                    </div>
                  )}
                </div>

                {/* Real Blue Ballpoint Pen Signature (#183cba) with Certified Autograph Stamp */}
                <div className="mt-1 w-full flex flex-col items-center text-center">
                  <span
                    className="font-signature text-2xl font-bold text-[#183cba] inline-block transform -rotate-2 tracking-wide select-none filter transition-transform hover:scale-105"
                    style={{
                      textShadow: '0 0.5px 1px rgba(24, 60, 186, 0.65), 0.5px 0.5px 0px #0e2782',
                      filter: 'drop-shadow(0 1px 1px rgba(24, 60, 186, 0.45))'
                    }}
                  >
                    {card.name}
                  </span>

                  {/* Autograph Authentication Badge: On-Card vs. Chop Certified Issue */}
                  {isHistoricalOrLegend ? (
                    <div className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded bg-black/65 border border-amber-400/50 shadow-sm">
                      <span className="text-[7px] font-mono font-black tracking-wider uppercase text-amber-300 drop-shadow">
                        ★ CHOP™ CERTIFIED ON-CARD AUTOGRAPH ★
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-white to-slate-200 text-slate-950 border border-slate-400 shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-[6.5px] font-mono font-black tracking-widest text-slate-800 uppercase">
                        CHOP™ CERTIFIED ISSUE AUTOGRAPH
                      </span>
                    </div>
                  )}
                </div>

                {/* Apple Music Lossless-Style Clickable bRef WAR Metric Pill */}
                <div className="mt-1.5">
                  <LosslessWarBadge card={card} />
                </div>
              </div>

              {/* BOTTOM NAMEPLATE & RAISED 3D BASEBALL DIAMOND POSITION GRAPHIC */}
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

                  {/* RAISED 3D BASEBALL DIAMOND GRAPHIC WITH SCORECARD NUMBER */}
                  <div className="shrink-0">
                    <BaseballDiamondBadge
                      position={card.position}
                      playerName={card.name}
                      size="sm"
                      interactive={true}
                    />
                  </div>
                </div>

                {/* In-Game At-Bat Stats */}
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

          {/* Numbered Parallel Serial Stamp */}
          {card.serialStamp && (
            <div className="absolute bottom-2.5 left-3 z-30">
              <span className="text-[9px] font-mono font-black bg-black/90 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/60 shadow">
                {card.serialStamp}
              </span>
            </div>
          )}

          {/* Motion / Gyro Toggle Button */}
          <button
            type="button"
            onClick={requestGyroPermission}
            title={gyroActive ? '3D Gyro Tilt Active' : 'Tap to Enable Mobile Gyroscope / Tilt'}
            aria-label="Toggle Gyroscope Motion"
            className={`absolute bottom-2.5 right-11 z-30 p-1.5 rounded-full transition-all shadow-md border ${
              gyroActive 
                ? 'bg-amber-500 text-slate-950 border-yellow-200 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                : 'bg-black/70 hover:bg-slate-800 text-slate-300 border-white/20'
            }`}
          >
            <span className="text-[11px] block leading-none">📱</span>
          </button>

          {/* Flip Button */}
          <button
            type="button"
            onClick={toggleFlip}
            aria-label="Flip card to back"
            className="absolute bottom-2.5 right-3 z-30 p-1.5 rounded-full bg-black/70 hover:bg-orange-600 text-slate-200 hover:text-white transition-colors shadow-md border border-white/20"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ================= CARD BACK ================= */}
        <div
          className={`absolute inset-0 rotate-y-180 backface-hidden rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-2xl card-3d-slab ${setBorder.backClass} ${
            !isFlipped ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          {/* Top Bar: Card Number, Name, Position, Vitals */}
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
              {/* Back 3D Diamond Mini Stamp */}
              <BaseballDiamondBadge
                position={card.position}
                size="sm"
                interactive={false}
              />
              <button
                type="button"
                onClick={toggleFlip}
                aria-label="Flip card back to front"
                className="p-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition-colors"
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
                  <td>{card.careerStats?.games || 2632}</td>
                  <td>{card.careerStats?.hits || 3184}</td>
                  <td className="text-amber-800">{card.careerStats?.homeRuns || 431}</td>
                  <td>{card.careerStats?.rbi || 1695}</td>
                  <td>{card.careerStats?.avg || '.280'}</td>
                  <td>{card.careerStats?.ops || '.820'}</td>
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
