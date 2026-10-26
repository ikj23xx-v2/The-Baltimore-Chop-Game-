import React, { useState, useEffect, useRef } from 'react';
import { ALL_PLAYERS } from '../data/players';
import { PlayerCard } from '../types/game';
import { soundManager } from '../services/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Sparkles, 
  Flame, 
  Trophy, 
  ChevronRight,
  ShieldAlert,
  Award
} from 'lucide-react';

interface GameScenario {
  id: string;
  batterName: string;
  batterTeam: string;
  avatarIcon: string;
  pitcherName: string;
  pitchType: string;
  velocity: number;
  zone: string;
  outcomeType: 'CHOP' | 'HOMERUN' | 'STEAL_CHOP' | 'STRIKEOUT' | 'WALKOFF';
  headline: string;
  description: string;
  statGain: string;
  jumbotronBanner: string;
}

const SCENARIOS: GameScenario[] = [
  {
    id: 'sc-1',
    batterName: 'Cal Ripken Jr.',
    batterTeam: 'Baltimore Orioles',
    avatarIcon: '👑',
    pitcherName: 'Sandy Koufax',
    pitchType: 'SINKER',
    velocity: 96,
    zone: 'DOWN_MID',
    outcomeType: 'WALKOFF',
    headline: 'Bottom 9th Walk-Off Baltimore Chop',
    description: 'Down 0-2 in the count. Ripken drives a low sinking fastball downward off hard Georgia clay, vaulting 32 feet over the leaping third baseman as the winning run scores!',
    statGain: '+350 Franchise Points · 162-Game Win',
    jumbotronBanner: '🔥 IRON MAN CLUTCH CHOP · WALK-OFF VICTORY! 🔥'
  },
  {
    id: 'sc-2',
    batterName: 'Babe Ruth',
    batterTeam: 'New York Yankees',
    avatarIcon: '⚾',
    pitcherName: 'Jim Palmer',
    pitchType: '4-SEAM',
    velocity: 98,
    zone: 'UP_MID',
    outcomeType: 'HOMERUN',
    headline: '450-FT Eutaw Street Upper Deck Blast',
    description: 'Ruth sits dead-red on high heat. Crushed high over the right field scoreboard onto Eutaw Street pavement.',
    statGain: '+500 Points · Statcast Exit Velo 114 MPH',
    jumbotronBanner: '💣 SULTAN OF SWAT · 450 FT EUTAW ST HOMERUN! 💣'
  },
  {
    id: 'sc-3',
    batterName: 'Rickey Henderson',
    batterTeam: 'Oakland Athletics',
    avatarIcon: '⚡',
    pitcherName: 'Mike Mussina',
    pitchType: 'SLIDER',
    velocity: 89,
    zone: 'DOWN_IN',
    outcomeType: 'STEAL_CHOP',
    headline: 'Infield Dirt Rocket & Stolen Second',
    description: 'Rickey chops a sharp slider straight into the dirt, beats the pitcher to first base in 3.4 seconds, then immediately steals second base on the next pitch.',
    statGain: '+250 Points · +20 Team Speed',
    jumbotronBanner: '⚡ MAN OF STEAL · CHOP INFIELD SINGLE & SWIPE! ⚡'
  },
  {
    id: 'sc-4',
    batterName: 'Gunnar Henderson',
    batterTeam: 'Baltimore Orioles',
    avatarIcon: '⭐',
    pitcherName: 'Corbin Burnes',
    pitchType: 'CUTTER',
    velocity: 95,
    zone: 'MID_IN',
    outcomeType: 'CHOP',
    headline: 'Next-Gen Baltimore Small-Ball',
    description: 'Gunnar reads the inside cutter and chops downward with 78 MPH bat speed. The towering hop freezes the shortstop for an RBI single.',
    statGain: '+200 Points · RBI Single',
    jumbotronBanner: '✨ GUNNAR HENDERSON · CLUTCH RBI INFIELD HOP! ✨'
  },
  {
    id: 'sc-5',
    batterName: 'Jackie Robinson',
    batterTeam: 'Brooklyn Dodgers',
    avatarIcon: '🏆',
    pitcherName: 'Jim Palmer',
    pitchType: 'CHANGEUP',
    velocity: 84,
    zone: 'DOWN_OUT',
    outcomeType: 'CHOP',
    headline: 'Pioneer Squeeze Chop & Base-Running Magic',
    description: 'Suicide squeeze execution. Robinson lays down a stinging chop downward, allowing the tie-breaking run to slide under the catcher tag.',
    statGain: '+300 Points · Trailblazer Clutch',
    jumbotronBanner: '💎 JACKIE ROBINSON · TACTICAL SQUEEZE CHOP! 💎'
  }
];

export const AnimatedGameLoop: React.FC = () => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [gamePhase, setGamePhase] = useState<'WINDUP' | 'PITCH' | 'SWING_CHOP' | 'BOUNCE_RUN' | 'SCORE'>('WINDUP');
  
  const currentScenario = SCENARIOS[activeScenarioIdx];
  const reqRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const loopDuration = 6000; // 6 seconds per loop

  useEffect(() => {
    let lastTime = Date.now();
    const tick = () => {
      if (isPlaying) {
        const now = Date.now();
        const elapsed = (now - startTimeRef.current) % loopDuration;
        const pct = (elapsed / loopDuration) * 100;
        setProgress(pct);

        if (pct < 20) {
          setGamePhase('WINDUP');
        } else if (pct < 45) {
          setGamePhase('PITCH');
        } else if (pct < 60) {
          setGamePhase('SWING_CHOP');
        } else if (pct < 85) {
          setGamePhase('BOUNCE_RUN');
        } else {
          setGamePhase('SCORE');
        }
      }
      reqRef.current = requestAnimationFrame(tick);
    };

    reqRef.current = requestAnimationFrame(tick);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying]);

  const handleNextScenario = () => {
    setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    startTimeRef.current = Date.now();
    soundManager.playButtonClick();
  };

  const handleSelectScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
    startTimeRef.current = Date.now();
    soundManager.playButtonClick();
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Stadium Simulation Canvas Box */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-orange-500/40 shadow-[0_0_40px_rgba(234,88,12,0.25)] flex flex-col justify-between p-4 select-none">
        
        {/* Background Field Graphic with Camden Yards Dusk Skyline */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/aistudio/chopchop_085f9a0d.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />

        {/* Stadium Retro Jumbotron Header */}
        <div className="relative z-10 w-full flex items-center justify-between bg-black/80 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
              CAMDEN YARDS LIVE AT-BAT SIMULATION
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-orange-400 border border-orange-500/30 font-bold">
              {currentScenario.pitchType} · {currentScenario.velocity} MPH
            </span>
            <span className="text-slate-400">ZONE: <strong className="text-white">{currentScenario.zone}</strong></span>
          </div>
        </div>

        {/* Dynamic Ballpark Field Diamond with Animated Elements */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <svg className="w-full max-w-md h-full max-h-[220px]" viewBox="0 0 400 240">
            {/* Outfield Grass Arc */}
            <path
              d="M 40,160 Q 200,20 360,160 L 360,200 L 40,200 Z"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="2"
            />
            
            {/* Infield Dirt Diamond */}
            <polygon
              points="200,60 270,130 200,200 130,130"
              fill="rgba(180, 83, 9, 0.25)"
              stroke="rgba(245, 158, 11, 0.5)"
              strokeWidth="2"
            />

            {/* Base Paths & Bases */}
            <circle cx="200" cy="200" r="6" fill="#fff" stroke="#f97316" strokeWidth="2" /> {/* Home Plate */}
            <circle cx="270" cy="130" r="5" fill="#fff" /> {/* 1st Base */}
            <circle cx="200" cy="60" r="5" fill="#fff" />  {/* 2nd Base */}
            <circle cx="130" cy="130" r="5" fill="#fff" /> {/* 3rd Base */}

            {/* Pitcher's Mound */}
            <circle cx="200" cy="130" r="8" fill="rgba(245, 158, 11, 0.5)" />
            <rect x="195" y="128" width="10" height="4" fill="#fff" />

            {/* Pitch Delivery Animation */}
            {gamePhase === 'PITCH' && (
              <g>
                <circle cx="200" cy={130 + (progress - 20) * 2.8} r="5" fill="#fff" className="drop-shadow-[0_0_8px_#fff]">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="0.2s" repeatCount="indefinite" />
                </circle>
                <line
                  x1="200"
                  y1="130"
                  x2="200"
                  y2={130 + (progress - 20) * 2.8}
                  stroke="rgba(255,255,255,0.4)"
                  strokeDasharray="4 2"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* The Baltimore Chop Downward Impact & Georgia Clay Explosion */}
            {gamePhase === 'SWING_CHOP' && (
              <g>
                {/* Bat Swing Arc */}
                <path
                  d="M 180,180 Q 195,195 215,202"
                  stroke="#f97316"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                {/* Clay Dust Particle Ring */}
                <circle cx="200" cy="200" r="14" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.8">
                  <animate attributeName="r" values="4;22" dur="0.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="0.3s" repeatCount="indefinite" />
                </circle>
                <text x="200" y="185" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900" fontFamily="monospace">
                  *CHOP IMPACT!*
                </text>
              </g>
            )}

            {/* Ball Bouncing 35 Feet in the Air Over Third Baseman */}
            {gamePhase === 'BOUNCE_RUN' && (
              <g>
                {/* Parabolic High-Bounce Trajectory */}
                <path
                  d="M 200,200 Q 150,40 120,130"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                {/* High Bouncing Ball */}
                <circle cx="155" cy="80" r="6" fill="#fff" stroke="#38bdf8" strokeWidth="2">
                  <animate attributeName="cy" values="180;60;130" dur="0.8s" repeatCount="indefinite" />
                </circle>
                {/* Runner sprinting to 1st base */}
                <circle cx="240" cy="160" r="4" fill="#f97316" />
                {/* Runner scoring from 3rd to Home */}
                <circle cx="160" cy="170" r="4" fill="#10b981" />
                <text x="135" y="65" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  +35 FT BOUNCE
                </text>
              </g>
            )}

            {/* Score & Safe Celebration */}
            {gamePhase === 'SCORE' && (
              <g>
                <circle cx="200" cy="200" r="18" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="3" />
                <text x="200" y="204" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900" fontFamily="monospace">
                  SAFE!
                </text>
                <text x="200" y="110" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="900" fontFamily="monospace">
                  +1 RUN SCORED!
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Live Jumbotron Ticker Banner */}
        <div className="relative z-10 w-full bg-slate-900/95 border border-orange-500/50 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500 flex items-center justify-center text-xl shrink-0">
              {currentScenario.avatarIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-white text-sm uppercase">
                  {currentScenario.batterName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-600/30 text-orange-300 border border-orange-500/30">
                  {currentScenario.outcomeType}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-mono font-bold">
                {currentScenario.jumbotronBanner}
              </p>
            </div>
          </div>

          {/* Progress / Play Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isPlaying ? 'Pause Loop' : 'Play Loop'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                startTimeRef.current = Date.now();
                setProgress(0);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Restart At-Bat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextScenario}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-black text-xs uppercase flex items-center gap-1 transition-all"
            >
              Next Scenario <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Loop Timeline Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scrolling Scenario Cards Reel */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-display font-black text-white uppercase tracking-wider">
              Explore Gameplay Scenarios & Card Synergies
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Click any scenario to simulate in the arena
          </span>
        </div>

        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {SCENARIOS.map((sc, idx) => {
            const isSelected = activeScenarioIdx === idx;
            return (
              <div
                key={sc.id}
                onClick={() => handleSelectScenario(idx)}
                className={`min-w-[260px] sm:min-w-[280px] p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-950/40 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)] scale-[1.02]'
                    : 'bg-slate-950/70 border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sc.avatarIcon}</span>
                      <div>
                        <span className="text-xs font-display font-bold text-white block leading-none">
                          {sc.batterName}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {sc.batterTeam}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      sc.outcomeType === 'WALKOFF'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : sc.outcomeType === 'HOMERUN'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {sc.outcomeType}
                    </span>
                  </div>

                  <h5 className="text-[11px] font-display font-bold text-amber-400 uppercase leading-snug mb-1">
                    {sc.headline}
                  </h5>
                  <p className="text-[10px] text-slate-300 font-sans leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{sc.statGain}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                    {isSelected ? 'Active ▶' : 'Simulate'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
