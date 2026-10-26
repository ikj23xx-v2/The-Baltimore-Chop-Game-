import React, { useState, useEffect } from 'react';
import { MLB_TEAMS, MLB_DIVISIONS, MLBTeamInfo } from '../data/mlbTeams';
import { teamThemeService, ActiveTeamTheme, NEGRO_LEAGUES_TEAM_INFO } from '../services/teamThemeService';
import { NEGRO_LEAGUE_LEGENDS } from '../data/negroLeagues';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';
import { 
  Sparkles, 
  MapPin, 
  Shield, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Users, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Flame,
  ChevronRight,
  Eye,
  Zap
} from 'lucide-react';

interface StadiumTunnelEntranceProps {
  isOpen: boolean;
  onComplete: (selectedTeam: ActiveTeamTheme) => void;
  onClose?: () => void;
}

export const StadiumTunnelEntrance: React.FC<StadiumTunnelEntranceProps> = ({
  isOpen,
  onComplete,
  onClose
}) => {
  // Cinematic Walkout Stages: 'TUNNEL_DEPTH' -> 'WALKING_FORWARD' -> 'FIELD_BURST' -> 'TEAM_SELECTION'
  const [cinematicStage, setCinematicStage] = useState<'TUNNEL_DEPTH' | 'WALKING_FORWARD' | 'FIELD_BURST' | 'TEAM_SELECTION'>('TUNNEL_DEPTH');
  const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%
  
  // League Filter for Team Selection: 'ALL' | 'AL' | 'NL' | 'NEGRO_LEAGUES'
  const [leagueFilter, setLeagueFilter] = useState<'ALL' | 'AL' | 'NL' | 'NEGRO_LEAGUES'>('ALL');
  
  // Currently Chosen Team
  const [selectedTeamName, setSelectedTeamName] = useState<string>(() => teamThemeService.getActiveTeam().name);
  const [activeTheme, setActiveTheme] = useState<ActiveTeamTheme>(() => teamThemeService.getActiveTeam());

  // Subscribe to theme updates
  useEffect(() => {
    return teamThemeService.subscribe((theme) => {
      setActiveTheme(theme);
    });
  }, []);

  // Handle Walking Forward Cinematic Animation
  useEffect(() => {
    if (cinematicStage === 'WALKING_FORWARD') {
      const interval = setInterval(() => {
        setWalkProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setCinematicStage('FIELD_BURST');
            soundManager.playBatCrack(true);
            triggerHapticFeedback('HEAVY');
            setTimeout(() => {
              setCinematicStage('TEAM_SELECTION');
              soundManager.playJackpotChime();
            }, 900);
            return 100;
          }
          // Walking step audio pacing
          if (prev % 20 === 0) {
            soundManager.playButtonClick();
            triggerHapticFeedback('LIGHT');
          }
          return prev + 2.5;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [cinematicStage]);

  if (!isOpen) return null;

  // Trigger Walkout Animation
  const handleStartWalkout = () => {
    soundManager.playCardWhoosh();
    triggerHapticFeedback('SNAP');
    setCinematicStage('WALKING_FORWARD');
    setWalkProgress(0);
  };

  // Skip straight to Team Selection
  const handleSkipCinematic = () => {
    soundManager.playButtonClick();
    setCinematicStage('TEAM_SELECTION');
    setWalkProgress(100);
  };

  // Select Favorite Team
  const handleSelectTeam = (teamName: string) => {
    soundManager.playButtonClick();
    triggerHapticFeedback('LIGHT');
    setSelectedTeamName(teamName);
    const updated = teamThemeService.setFavoriteTeam(teamName);
    setActiveTheme(updated);
  };

  // Final confirmation: Lock in team and enter game
  const handleLockInAndPlay = () => {
    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setTimeout(() => {
      soundManager.playBaltimoreChop();
    }, 150);
    const finalTeam = teamThemeService.setFavoriteTeam(selectedTeamName);
    onComplete(finalTeam);
  };

  // Filtered teams list
  const filteredTeams = MLB_TEAMS.filter((team) => {
    if (leagueFilter === 'ALL') return true;
    if (leagueFilter === 'AL') return team.league === 'AL';
    if (leagueFilter === 'NL') return team.league === 'NL';
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black select-none overflow-hidden animate-fade-in">
      
      {/* ============================================================== */}
      {/* CINEMATIC STAGES 1 & 2: FIRST-PERSON MLB STADIUM TUNNEL WALKOUT */}
      {/* ============================================================== */}
      {(cinematicStage === 'TUNNEL_DEPTH' || cinematicStage === 'WALKING_FORWARD' || cinematicStage === 'FIELD_BURST') && (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* 3D Perspective Tunnel Wrapper */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{
              perspective: '1000px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {/* TUNNEL WALLS & CEILING ARCH (Deep Concrete & Subway Brick Textures) */}
            <div 
              className="absolute inset-0 transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${1 + walkProgress * 0.02}) translateZ(${walkProgress * 8}px)`,
                background: `
                  radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(10,12,16,0.92) 80%),
                  repeating-linear-gradient(90deg, #181d26 0px, #181d26 80px, #0f131a 80px, #0f131a 82px),
                  linear-gradient(180deg, #11151c 0%, #202734 50%, #0b0e13 100%)
                `
              }}
            >
              {/* Overhead Industrial Pendant Lights passing overhead */}
              <div 
                className="absolute top-0 left-0 right-0 h-28 pointer-events-none flex justify-around opacity-60"
                style={{
                  transform: `translateY(${walkProgress * 0.4}px)`
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1 h-12 bg-slate-600" />
                    <div className="w-8 h-4 rounded-full bg-amber-400/80 shadow-[0_10px_25px_rgba(245,158,11,0.9)]" />
                  </div>
                ))}
              </div>

              {/* Tunnel Side Rails & Dugout Pipes */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black via-slate-900 to-transparent border-r border-slate-700/30" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black via-slate-900 to-transparent border-l border-slate-700/30" />

              {/* Concrete Floor with Field Yard Marker line */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #1e2530 0px, #1e2530 30px, #0f131a 30px, #0f131a 32px)'
                }}
              />
            </div>

            {/* TUNNEL PORTAL OPENING (THE MOUTH OF THE DUGOUT LEADING ONTO THE FIELD) */}
            <div 
              className={`relative z-10 w-72 sm:w-96 h-80 sm:h-[420px] rounded-t-full border-t-8 border-x-8 border-slate-800 flex flex-col items-center justify-end overflow-hidden shadow-[0_0_120px_rgba(255,255,255,0.7)] transition-all duration-300 ${
                cinematicStage === 'FIELD_BURST' ? 'scale-150 brightness-200' : 'scale-100'
              }`}
              style={{
                transform: `scale(${1 + walkProgress * 0.04}) translateY(${-walkProgress * 0.5}px)`
              }}
            >
              {/* Field Grass & Warning Track Dirt Background through the opening */}
              <div 
                className="absolute inset-0 bg-cover bg-bottom flex flex-col justify-between p-4"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 20%, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.6) 30%, rgba(22,101,52,0.9) 70%),
                    linear-gradient(180deg, #38bdf8 0%, #166534 60%, #854d0e 95%)
                  `
                }}
              >
                {/* Stadium Light Tower Flare */}
                <div className="w-full flex justify-between items-start opacity-80 animate-pulse">
                  <div className="w-12 h-6 bg-white/80 rounded-full blur-md shadow-[0_0_40px_#fff]" />
                  <div className="w-12 h-6 bg-white/80 rounded-full blur-md shadow-[0_0_40px_#fff]" />
                </div>

                {/* Stadium Upper Deck Silhouette */}
                <div className="text-center my-auto">
                  <span className="text-3xl sm:text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    🏟️
                  </span>
                  <span className="text-xs font-display font-black text-white uppercase tracking-widest block drop-shadow-md">
                    {activeTheme.ballpark}
                  </span>
                </div>

                {/* Dirt Warning Track Steps */}
                <div className="h-10 w-full bg-gradient-to-t from-amber-900 to-amber-700/80 rounded-t-xl border-t border-amber-500/50 flex items-center justify-center text-[10px] font-mono font-black text-amber-200 tracking-wider">
                  STEP ONTO DIAMOND ⬆️
                </div>
              </div>
            </div>

            {/* Radiant Sunburst / Floodlight Flare effect that blinds camera on exit */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 bg-radial from-amber-100 via-yellow-200 to-transparent"
              style={{
                opacity: cinematicStage === 'FIELD_BURST' ? 0.95 : walkProgress > 70 ? (walkProgress - 70) * 0.03 : 0
              }}
            />
          </div>

          {/* HUD Overlay in Tunnel Mode */}
          <div className="relative z-30 flex flex-col items-center text-center p-6 max-w-md w-full">
            {/* Overhead Stadium Signage */}
            <div className="px-4 py-2 rounded-2xl bg-black/80 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-6 backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                MLB CLUBHOUSE ACCESS TUNNEL
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                {activeTheme.name}
              </h2>
              <span className="text-xs text-slate-300 font-mono flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> {activeTheme.ballpark}
              </span>
            </div>

            {/* Prompt Action: Walk out or skip */}
            {cinematicStage === 'TUNNEL_DEPTH' && (
              <div className="space-y-3 w-full">
                <button
                  type="button"
                  onClick={handleStartWalkout}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-base uppercase tracking-wider shadow-[0_0_35px_rgba(249,115,22,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>WALK OUT ONTO THE FIELD</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleSkipCinematic}
                  className="text-xs text-slate-400 hover:text-white font-mono underline uppercase tracking-wider transition-colors"
                >
                  Skip Directly to Team Selection & Roster
                </button>
              </div>
            )}

            {/* Walking Progress Bar */}
            {cinematicStage === 'WALKING_FORWARD' && (
              <div className="w-full space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                  <span>EMERGING FROM TUNNEL...</span>
                  <span>{Math.round(walkProgress)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-75"
                    style={{ width: `${walkProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Listen for the crowd roar as the lights break over the diamond
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAGE 4: ON-FIELD GAME SETUP & FAVORITE TEAM CUSTOMIZER HUB      */}
      {/* ============================================================== */}
      {cinematicStage === 'TEAM_SELECTION' && (
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col liquid-glass-panel rounded-3xl border-2 border-orange-500/60 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in mx-3">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20"
                style={{
                  backgroundColor: activeTheme.primaryColor || '#DF4601'
                }}
              >
                {activeTheme.logoIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                    CHOOSE YOUR FRANCHISE & TAKE THE FIELD
                  </h2>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  Select your home club. The app theme, ballpark, colors, and 26-man starting roster will adapt to your franchise!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  setCinematicStage('TUNNEL_DEPTH');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                title="Replay stadium tunnel walkout animation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-orange-400" /> Replay Walkout
              </button>
            </div>
          </div>

          {/* League Filter Navigation Tabs */}
          <div className="flex items-center gap-2 py-3 border-b border-white/10 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setLeagueFilter('ALL');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap ${
                leagueFilter === 'ALL'
                  ? 'bg-orange-600 text-white shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All 30 MLB Teams
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setLeagueFilter('AL');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap ${
                leagueFilter === 'AL'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              American League (AL)
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setLeagueFilter('NL');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap ${
                leagueFilter === 'NL'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              National League (NL)
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playButtonClick();
                setLeagueFilter('NEGRO_LEAGUES');
                handleSelectTeam('Negro League Legends');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                leagueFilter === 'NEGRO_LEAGUES'
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-amber-950/40 text-amber-300 hover:text-white border border-amber-500/40'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Negro League Legends (Top 50 WAR)
            </button>
          </div>

          {/* Active Chosen Franchise Feature Box */}
          <div 
            className="my-3 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
            style={{
              backgroundColor: `${activeTheme.primaryColor}25`,
              borderColor: activeTheme.primaryColor || '#f97316'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeTheme.logoIcon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10">
                    CURRENT SELECTION
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {activeTheme.division}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider">
                  {activeTheme.name}
                </h3>
                <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Home Field: <strong>{activeTheme.ballpark}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLockInAndPlay}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-[0_4px_25px_rgba(249,115,22,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>LOCK IN & PLAY BALL ⚾</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Teams Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {leagueFilter === 'NEGRO_LEAGUES' ? (
              /* Negro Leagues Spotlight Showcase */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 to-slate-950 border border-amber-500/40">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h4 className="text-base font-display font-black text-white uppercase">
                      Top 50 Negro League Legends (Historical Immortals)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    Unassigned historical immortals from the Kansas City Monarchs, Homestead Grays, Pittsburgh Crawfords, and Newark Eagles. Includes Josh Gibson, Satchel Paige, Oscar Charleston, Cool Papa Bell, Buck Leonard, and more!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {NEGRO_LEAGUE_LEGENDS.slice(0, 18).map((legend) => (
                    <div
                      key={legend.id}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{legend.avatarIcon}</span>
                        <div>
                          <h5 className="text-xs font-display font-black text-white uppercase group-hover:text-amber-300 transition-colors">
                            {legend.name}
                          </h5>
                          <span className="text-[10px] font-mono text-amber-400 block">
                            {legend.position} · {legend.era.split('•')[0]}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-mono">
                        <span className="text-slate-400 block">WAR</span>
                        <span className="text-white font-bold">{legend.bRefWar.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* MLB 30 Franchises Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredTeams.map((team) => {
                  const isSelected = selectedTeamName === team.name;

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleSelectTeam(team.name)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-950 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.02]'
                          : 'bg-slate-950/70 border-white/10 hover:border-white/30 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                          style={{ backgroundColor: `${team.primaryColor}30`, borderColor: team.primaryColor }}
                        >
                          {team.logoIcon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                              {team.league} {team.division}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-orange-400" />
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wide">
                            {team.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[150px]">
                            {team.ballpark}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-300 border border-white/5">
                          26-Man
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
