import React, { useState, useEffect } from 'react';
import { PlayByPlayEntry } from '../types/game';
import { soundManager } from '../services/audio';
import { Tv, Volume2, VolumeX, RotateCcw, Zap, Sparkles, Flame, Settings2, Pause, Play, Edit3, Sliders, Check } from 'lucide-react';

interface RetroPlayByPlayJumbotronProps {
  latestEntry?: PlayByPlayEntry;
  onSelectHistoricalEntry?: (entry: PlayByPlayEntry) => void;
}

export type RetroSceneType = 'CHOP' | 'HOMERUN' | 'HIT' | 'STRIKEOUT' | 'OUT' | 'IDLE';

const TICKER_FEEDS: Record<'OFFICIAL' | 'STRATEGY' | 'LEGENDS', string[]> = {
  OFFICIAL: [
    '⚾ BALTIMORE CHOP™ OFFICIAL MATCH ENGINE',
    '⚡ TOPPS COLLECT FOIL CARD PARALLELS',
    '🏆 162-GAME FRANCHISE SIMULATION',
    '💎 3D SCORECARD DIAMONDS',
    '🥫 TASK-BASED EQUIPMENT VENDING',
    '🔥 5-IN-7 DAY LOGIN STREAKS REWARD CRATES'
  ],
  STRATEGY: [
    '🎯 AIM FOR LOW SINKERS & BOTTOM ZONES FOR 35-FT HIGH BALTIMORE CHOPS',
    '⚡ GUESSING CORRECT PITCH TYPE BOOSTS EXIT VELOCITY BY +18 MPH',
    '🧤 STACK GOLD GLOVE 90+ DEFENDERS TO SHUT DOWN EXTRA-BASE EXTRAVAGANZAS',
    '🪙 COMPLETE EQUIPMENT CHALLENGES TO EARN VENDING TOKENS'
  ],
  LEGENDS: [
    '👑 CAL RIPKEN JR: 2,632 CONSECUTIVE GAMES PLAYED · 3,184 CAREER HITS',
    '🧤 BROOKS ROBINSON: 16 STRAIGHT GOLD GLOVES AT THE HOT CORNER',
    '🚀 FRANK ROBINSON: TRIPLE CROWN WINNER & MVP IN BOTH LEAGUES',
    '🏆 MEMORIAL STADIUM 1983 WORLD SERIES CHAMPIONSHIP'
  ]
};

export const RetroPlayByPlayJumbotron: React.FC<RetroPlayByPlayJumbotronProps> = ({
  latestEntry
}) => {
  const [activeScene, setActiveScene] = useState<RetroSceneType>('IDLE');
  const [enableScanlines, setEnableScanlines] = useState(true);
  const [retroAudio, setRetroAudio] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  // Ticker Customization State
  const [tickerSpeedSeconds, setTickerSpeedSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chop_ticker_speed');
      return saved ? parseInt(saved, 10) : 34; // default 34s (smooth and readable)
    } catch {
      return 34;
    }
  });

  const [tickerFeed, setTickerFeed] = useState<'OFFICIAL' | 'STRATEGY' | 'LEGENDS' | 'CUSTOM'>(() => {
    try {
      return (localStorage.getItem('chop_ticker_feed') as 'OFFICIAL' | 'STRATEGY' | 'LEGENDS' | 'CUSTOM') || 'OFFICIAL';
    } catch {
      return 'OFFICIAL';
    }
  });

  const [customTickerText, setCustomTickerText] = useState<string>(() => {
    try {
      return localStorage.getItem('chop_ticker_custom') || "LET'S GO O'S! · BALTIMORE CHOP ROAD TO 162 WINS · MEMORIAL STADIUM 1983";
    } catch {
      return "LET'S GO O'S! · BALTIMORE CHOP ROAD TO 162 WINS · MEMORIAL STADIUM 1983";
    }
  });

  const [tempCustomText, setTempCustomText] = useState<string>(customTickerText);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isTickerCustomizerOpen, setIsTickerCustomizerOpen] = useState(false);
  const [tickerColor, setTickerColor] = useState<'amber' | 'green' | 'cyan'>('amber');

  // Derive scene from playByPlay entry type or text
  useEffect(() => {
    if (!latestEntry) {
      setActiveScene('IDLE');
      return;
    }

    const t = latestEntry.text.toLowerCase();
    let nextScene: RetroSceneType = 'IDLE';

    if (latestEntry.type === 'chop' || t.includes('baltimore chop') || t.includes('caroms')) {
      nextScene = 'CHOP';
      if (retroAudio) soundManager.playRetro8BitChop();
    } else if (latestEntry.type === 'homerun' || t.includes('home run') || t.includes('deep drive') || t.includes('crushed')) {
      nextScene = 'HOMERUN';
      if (retroAudio) soundManager.playRetro8BitHomeRun();
    } else if (latestEntry.type === 'hit' || t.includes('double') || t.includes('single') || t.includes('line-drive')) {
      nextScene = 'HIT';
      if (retroAudio) soundManager.playRetro8BitChop();
    } else if (t.includes('strike three') || t.includes('strikeout') || t.includes('fooled completely')) {
      nextScene = 'STRIKEOUT';
      if (retroAudio) soundManager.playRetro8BitStrikeout();
    } else if (latestEntry.type === 'out' || t.includes('out') || t.includes('caught')) {
      nextScene = 'OUT';
    } else {
      nextScene = 'IDLE';
    }

    setActiveScene(nextScene);
    setAnimKey((prev) => prev + 1);
  }, [latestEntry, retroAudio]);

  // Manually trigger a preview scene
  const triggerManualScene = (scene: RetroSceneType) => {
    setActiveScene(scene);
    setAnimKey((prev) => prev + 1);

    if (retroAudio) {
      if (scene === 'CHOP') soundManager.playRetro8BitChop();
      else if (scene === 'HOMERUN') soundManager.playRetro8BitHomeRun();
      else if (scene === 'HIT') soundManager.playRetro8BitChop();
      else if (scene === 'STRIKEOUT') soundManager.playRetro8BitStrikeout();
      else if (scene === 'IDLE') soundManager.playRetro8BitOrganCharge();
    }
  };

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-slate-950 border-2 border-orange-500/40 shadow-2xl relative mb-3 select-none">
      
      {/* Top Retro Jumbotron Metal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#182335] to-slate-900 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] font-display font-black text-amber-400 tracking-wider uppercase flex items-center gap-1.5 crt-amber-glow">
            <span>📺</span> MEMORIAL JUMBOTRON 1983 · 8-BIT BROADCAST
          </span>
        </div>

        {/* Retro Display Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEnableScanlines(!enableScanlines)}
            title="Toggle CRT Scanlines"
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
              enableScanlines
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span className="hidden sm:inline">Scanlines</span>
          </button>

          <button
            type="button"
            onClick={() => setRetroAudio(!retroAudio)}
            title="Toggle 8-Bit Chiptune Sound"
            className={`p-1 rounded text-[10px] font-mono transition-all ${
              retroAudio
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                : 'bg-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            {retroAudio ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => triggerManualScene(activeScene)}
            title="Replay Current Animation"
            className="p-1 rounded bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ================= CRT SCREEN APERTURE ================= */}
      <div 
        key={animKey}
        className={`relative h-44 sm:h-48 w-full bg-[#05080e] overflow-hidden flex flex-col justify-between p-3 border-x-4 border-slate-900 ${
          enableScanlines ? 'crt-scanlines' : ''
        }`}
        style={{
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.9), inset 0 2px 8px rgba(234, 88, 12, 0.3)'
        }}
      >
        {/* Subtle CRT Curved Screen Vignette & Phosphor Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 170, 50, 0.25) 0%, rgba(0,0,0,0.85) 90%)'
          }}
        />

        {/* Top Ticker: Live Stadium Status */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold border-b border-amber-500/20 pb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="crt-green-glow">CAMDEN YARDS · 9TH INNING</span>
          </span>
          <span className="text-amber-300/80 crt-amber-glow">
            RADAR: 97 MPH FASTBALL
          </span>
        </div>

        {/* ================= DYNAMIC RETRO PIXEL SCENES ================= */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-1 text-center">
          
          {/* 1. THE BALTIMORE CHOP RETRO ANIMATION */}
          {activeScene === 'CHOP' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              {/* Animated 8-bit Infield Graphic */}
              <div className="relative w-full max-w-xs h-20 mb-1 flex items-end justify-center">
                {/* Clay Home Plate with Dust Smash */}
                <div className="absolute bottom-1 left-16 flex flex-col items-center">
                  <span className="text-xs animate-ping text-orange-400 font-black">💥</span>
                  <div className="w-8 h-2 bg-amber-700 rounded-sm shadow-md" />
                </div>

                {/* High Bouncing Baseball with Speed Trail */}
                <div className="absolute animate-retro-chop flex flex-col items-center">
                  <span className="text-2xl drop-shadow-[0_0_12px_rgba(249,115,22,1)]">⚾</span>
                  <span className="text-[9px] font-mono font-black text-amber-300 crt-amber-glow">
                    38 FT BOUNCE!
                  </span>
                </div>

                {/* Third Baseman Sprite Jumping Fruitlessly */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-85">
                  <span className="text-sm">🏃</span>
                  <span className="text-[7px] font-mono text-slate-400">3B LEAP</span>
                </div>

                {/* Batter Sprinting Safely to 1st */}
                <div className="absolute bottom-1 right-12 flex flex-col items-center">
                  <span className="text-sm animate-bounce">💨🏃</span>
                  <span className="text-[8px] font-mono font-black text-emerald-400 crt-green-glow">
                    SAFE AT 1B!
                  </span>
                </div>
              </div>

              {/* Flashing Retro Marquee */}
              <div className="px-3 py-1 bg-amber-500/20 border-2 border-amber-400 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <h4 className="text-lg sm:text-xl font-display font-black text-amber-300 uppercase tracking-widest crt-amber-glow animate-pulse">
                  ★ THE BALTIMORE CHOP! ★
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 mt-1 crt-green-glow">
                DOWNWARD DIRT SMASH CAROMS OVER INFIELD HEADS!
              </span>
            </div>
          )}

          {/* 2. HOME RUN RETRO ANIMATION */}
          {activeScene === 'HOMERUN' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              {/* Soaring Ball & Fireworks */}
              <div className="relative w-full max-w-xs h-20 mb-1 flex items-center justify-center">
                <div className="absolute top-1 left-8 text-xl animate-bounce">
                  ✨
                </div>
                <div className="absolute top-2 right-8 text-xl animate-bounce">
                  🎆
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl animate-pulse">🚀</span>
                  <span className="text-2xl animate-ping text-yellow-300">⚾</span>
                  <span className="text-xs font-mono font-black text-orange-400 crt-amber-glow">
                    438 FT
                  </span>
                </div>
              </div>

              {/* Flashing Retro Neon Banner */}
              <div className="px-4 py-1.5 bg-gradient-to-r from-red-600/30 via-orange-600/40 to-yellow-600/30 border-2 border-yellow-400 rounded-lg shadow-[0_0_20px_rgba(234,88,12,0.8)]">
                <h4 className="text-lg sm:text-2xl font-display font-black text-yellow-300 uppercase tracking-widest crt-amber-glow animate-bounce">
                  💥 TOUCH 'EM ALL! HOME RUN! 💥
                </h4>
              </div>
              <span className="text-[10px] font-mono text-yellow-200 mt-1 crt-amber-glow">
                OVER THE RIGHT-FIELD WALL ONTO EUTAW STREET!
              </span>
            </div>
          )}

          {/* 3. BASE HIT / DOUBLE RETRO ANIMATION */}
          {activeScene === 'HIT' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              <div className="flex items-center justify-center gap-4 h-16">
                <span className="text-2xl animate-pulse">⚡</span>
                <span className="text-xl animate-bounce">⚾💨</span>
                <span className="text-2xl">🏃💨</span>
              </div>
              <div className="px-3 py-1 bg-cyan-950/50 border border-cyan-400 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <h4 className="text-base sm:text-lg font-display font-black text-cyan-300 uppercase tracking-widest crt-cyan-glow">
                  ⚡ RIPPED LINE DRIVE! EXTRA BASES! ⚡
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-200 mt-1 crt-cyan-glow">
                BARRELED THROUGH THE GAP INTO SCORING POSITION!
              </span>
            </div>
          )}

          {/* 4. STRIKEOUT "K" RETRO ANIMATION */}
          {activeScene === 'STRIKEOUT' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              <div className="flex items-center justify-center gap-3 h-16">
                <span className="text-4xl font-display font-black text-red-500 animate-ping">
                  ꓘ
                </span>
                <span className="text-2xl">💨</span>
                <span className="text-2xl animate-pulse">🛑</span>
              </div>
              <div className="px-3 py-1 bg-red-950/50 border border-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]">
                <h4 className="text-base sm:text-lg font-display font-black text-red-400 uppercase tracking-widest animate-pulse">
                  STRIKE THREE! HE GONE!
                </h4>
              </div>
              <span className="text-[10px] font-mono text-red-300 mt-1">
                PUNCHOUT ON THE HIGH FASTBALL!
              </span>
            </div>
          )}

          {/* 5. OUT RETRO ANIMATION */}
          {activeScene === 'OUT' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              <div className="flex items-center justify-center gap-3 h-16">
                <span className="text-2xl">⚾</span>
                <span className="text-3xl animate-bounce">🧤</span>
              </div>
              <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg">
                <h4 className="text-base font-display font-black text-slate-200 uppercase tracking-widest">
                  DEFENSIVE PUTOUT!
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                RECORDED IN THE SCOREBOOK!
              </span>
            </div>
          )}

          {/* 6. IDLE STADIUM CHANT / RADAR ANIMATION */}
          {activeScene === 'IDLE' && (
            <div className="flex flex-col items-center justify-center animate-fade-in w-full">
              <div className="flex items-center justify-center gap-3 h-14">
                <span className="text-2xl">⚾</span>
                <span className="text-lg font-mono font-black text-amber-400 animate-pulse crt-amber-glow">
                  [ 98 MPH FASTBALL IN WHEELHOUSE ]
                </span>
                <span className="text-2xl">⚾</span>
              </div>
              <div className="px-3 py-0.5 bg-black/60 border border-amber-500/30 rounded-lg">
                <span className="text-xs font-display font-black text-amber-400 tracking-widest uppercase crt-amber-glow">
                  LET'S GO O's! 👏 👏 👏👏👏
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400 mt-1">
                Bottom of the 9th · Clutch Showdown Active
              </span>
            </div>
          )}

        </div>

        {/* ================= CUSTOMIZABLE RUNNING MARQUEE TICKER ================= */}
        <div className="relative z-10 w-full border-t border-amber-500/20 pt-1.5 pb-1 px-2 bg-black/40 flex items-center gap-2 overflow-hidden">
          
          {/* Ticker Quick Controls: Pause & Customize Toggle */}
          <div className="flex items-center gap-1 shrink-0 z-20 bg-slate-950/90 px-1.5 py-0.5 rounded-lg border border-white/10 text-[9px] font-mono">
            <button
              type="button"
              onClick={() => setIsTickerPaused(!isTickerPaused)}
              title={isTickerPaused ? 'Resume Ticker' : 'Pause Ticker'}
              aria-label={isTickerPaused ? 'Resume Ticker' : 'Pause Ticker'}
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {isTickerPaused ? <Play className="w-2.5 h-2.5 text-emerald-400" /> : <Pause className="w-2.5 h-2.5 text-amber-400" />}
            </button>

            <span className="text-[8.5px] text-slate-400 font-bold border-l border-white/10 pl-1.5 pr-1">
              {tickerSpeedSeconds}s
            </span>

            <button
              type="button"
              onClick={() => setIsTickerCustomizerOpen(!isTickerCustomizerOpen)}
              title="Customize Ticker Text & Speed"
              aria-label="Customize Ticker"
              className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-all ${
                isTickerCustomizerOpen
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-orange-400'
              }`}
            >
              <Settings2 className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

          {/* Marquee Display Container (Pauses automatically on hover) */}
          <div 
            className="flex-1 overflow-hidden whitespace-nowrap text-[10.5px] font-mono relative cursor-pointer"
            title="Hover to pause ticker. Click settings on the left to customize speed and text!"
          >
            <div
              className={`animate-retro-marquee flex items-center gap-8 ${
                tickerColor === 'green'
                  ? 'text-emerald-400 crt-green-glow'
                  : tickerColor === 'cyan'
                  ? 'text-cyan-300 crt-cyan-glow'
                  : 'text-amber-300/95 crt-amber-glow'
              }`}
              style={{
                ['--ticker-duration' as any]: `${tickerSpeedSeconds}s`,
                ['--ticker-play-state' as any]: isTickerPaused ? 'paused' : 'running'
              }}
            >
              {(tickerFeed === 'CUSTOM' ? [customTickerText, customTickerText] : TICKER_FEEDS[tickerFeed]).map((item, idx) => (
                <span key={`ticker-item-${idx}`} className="inline-flex items-center gap-2">
                  <span>{item}</span>
                  <span className="opacity-50">·</span>
                </span>
              ))}
              {/* Duplicate array for seamless infinite scroll */}
              {(tickerFeed === 'CUSTOM' ? [customTickerText, customTickerText] : TICKER_FEEDS[tickerFeed]).map((item, idx) => (
                <span key={`ticker-item-dup-${idx}`} className="inline-flex items-center gap-2">
                  <span>{item}</span>
                  <span className="opacity-50">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= EXPANDABLE TICKER CUSTOMIZATION DRAWER ================= */}
        {isTickerCustomizerOpen && (
          <div className="relative z-20 border-t border-amber-500/30 p-3 bg-slate-950/95 backdrop-blur-md animate-fade-in text-[10px] font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
              <span className="text-xs font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Jumbotron Ticker Customizer
              </span>
              <button
                type="button"
                onClick={() => setIsTickerCustomizerOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
              >
                Close ✕
              </button>
            </div>

            {/* Speed Presets & Fine Slider */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Scroll Speed: <strong>{tickerSpeedSeconds} seconds per loop</strong> (Higher = Slower)</span>
                <span className="text-orange-400 font-bold">
                  {tickerSpeedSeconds >= 40 ? '🐢 Slow & Readable' : tickerSpeedSeconds >= 28 ? '⚾ Normal' : '⚡ Brisk'}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setTickerSpeedSeconds(45);
                    localStorage.setItem('chop_ticker_speed', '45');
                  }}
                  className={`flex-1 py-1 px-2 rounded border text-center transition-all ${
                    tickerSpeedSeconds >= 42
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  🐢 Slower (45s)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTickerSpeedSeconds(32);
                    localStorage.setItem('chop_ticker_speed', '32');
                  }}
                  className={`flex-1 py-1 px-2 rounded border text-center transition-all ${
                    tickerSpeedSeconds >= 28 && tickerSpeedSeconds < 42
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  ⚾ Normal (32s)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTickerSpeedSeconds(20);
                    localStorage.setItem('chop_ticker_speed', '20');
                  }}
                  className={`flex-1 py-1 px-2 rounded border text-center transition-all ${
                    tickerSpeedSeconds < 28
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  ⚡ Fast (20s)
                </button>
              </div>

              {/* Precise Slider */}
              <input
                type="range"
                min="16"
                max="60"
                step="2"
                value={tickerSpeedSeconds}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTickerSpeedSeconds(val);
                  localStorage.setItem('chop_ticker_speed', val.toString());
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Feed Category Chooser */}
            <div className="mb-3">
              <span className="text-slate-300 block mb-1">Ticker Announcement Feed:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['OFFICIAL', 'STRATEGY', 'LEGENDS', 'CUSTOM'] as const).map((feed) => (
                  <button
                    key={feed}
                    type="button"
                    onClick={() => {
                      setTickerFeed(feed);
                      localStorage.setItem('chop_ticker_feed', feed);
                    }}
                    className={`py-1 px-2 rounded text-center border capitalize transition-all ${
                      tickerFeed === feed
                        ? 'bg-orange-600 text-white border-orange-400 font-bold shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {feed === 'CUSTOM' ? '✍️ Custom Text' : feed.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Editor (if CUSTOM is selected) */}
            {tickerFeed === 'CUSTOM' && (
              <div className="mb-3 p-2.5 rounded-xl bg-black/60 border border-orange-500/40">
                <label className="block text-orange-300 mb-1 font-bold">
                  Enter Custom Ticker Announcement:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempCustomText}
                    onChange={(e) => setTempCustomText(e.target.value)}
                    placeholder="Type stadium announcement or cheer..."
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-lg px-2.5 py-1 text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const text = tempCustomText.trim() || 'BALTIMORE CHOP™ OFFICIAL GAME';
                      setCustomTickerText(text);
                      localStorage.setItem('chop_ticker_custom', text);
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-bold rounded-lg hover:brightness-110 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>
            )}

            {/* CRT Phosphor Glow Color */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="text-slate-400">LED Phosphor Tint:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTickerColor('amber')}
                  className={`px-2 py-0.5 rounded text-[9px] border ${
                    tickerColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5'
                  }`}
                >
                  Amber CRT
                </button>
                <button
                  type="button"
                  onClick={() => setTickerColor('green')}
                  className={`px-2 py-0.5 rounded text-[9px] border ${
                    tickerColor === 'green'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5'
                  }`}
                >
                  Green CRT
                </button>
                <button
                  type="button"
                  onClick={() => setTickerColor('cyan')}
                  className={`px-2 py-0.5 rounded text-[9px] border ${
                    tickerColor === 'cyan'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5'
                  }`}
                >
                  Cyan Neon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Retro Animation Quick Preview Bar (User can click to test every retro animation directly!) */}
      <div className="bg-slate-900/90 px-3 py-2 border-t border-white/5 flex items-center justify-between gap-1.5 overflow-x-auto text-[10px] font-mono">
        <span className="text-slate-400 shrink-0 font-bold">
          🕹️ Retro Scenes:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => triggerManualScene('CHOP')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScene === 'CHOP'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
            }`}
          >
            Chop 💥
          </button>
          <button
            type="button"
            onClick={() => triggerManualScene('HOMERUN')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScene === 'HOMERUN'
                ? 'bg-yellow-500 text-slate-950 font-black shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-yellow-300'
            }`}
          >
            HR 🚀
          </button>
          <button
            type="button"
            onClick={() => triggerManualScene('HIT')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScene === 'HIT'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
            }`}
          >
            Double ⚡
          </button>
          <button
            type="button"
            onClick={() => triggerManualScene('STRIKEOUT')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScene === 'STRIKEOUT'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-red-300'
            }`}
          >
            K 💨
          </button>
          <button
            type="button"
            onClick={() => triggerManualScene('IDLE')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScene === 'IDLE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Charge 🎺
          </button>
        </div>
      </div>
    </div>
  );
};
