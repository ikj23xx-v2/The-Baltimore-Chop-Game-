import React, { useState, useMemo } from 'react';
import { ALL_PLAYERS, BASE_ACTIVE_PLAYERS, TOP_25_WAR_LEGENDS, NEGRO_LEAGUE_LEGENDS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { TWELVE_SEASONS, SeasonInfo } from '../data/seasons';
import { STADIUM_CARDS, TOTAL_STADIUM_CARDS_COUNT } from '../data/stadiums';
import { INITIAL_EQUIPMENT_CARDS } from '../data/equipment';
import { MLB_TEAMS } from '../data/mlbTeams';
import { getFranchiseTop25War, LegendCardConfig } from '../data/franchiseLegends25';
import { getTeamTop25WarSeasons, convertWarSeasonToCard, FranchiseWarSeasonEntry } from '../data/teamTopWarLegends';
import { fetchTeamRoster, getTeamIdByName, MlbApiRosterPlayer } from '../services/mlbRosterService';
import { LINEAR_WEIGHT_POINTS, calculateLeverageIndex, EXTREME_100_PATH_MILESTONES } from '../data/chopExtremeAnalytics';
import { GAUNTLET_BOSSES, MOMENTS_OF_INFAMY } from '../data/chopExtremePillars';
import { forumService, ForumPost } from '../services/forumService';
import { authService, UserAccountProfile } from '../services/authService';
import { soundManager } from '../services/audio';
import { Card3D } from './Card3D';
import { RainbowChaseTracker } from './RainbowChaseTracker';
import { PlayerCard, EquipmentType } from '../types/game';
import { 
  Play, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Layers, 
  Calendar, 
  Lock, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Trophy, 
  Flame, 
  Eye, 
  X,
  Shield,
  HelpCircle,
  Video,
  BarChart2,
  Compass,
  Zap,
  Sliders,
  RefreshCw,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';

interface FirstEnterPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCardForShowdown?: (card: PlayerCard) => void;
  onOpenCardDetails?: (card: PlayerCard) => void;
}

type PortalTab = 
  | 'KNOWLEDGE_BASE_COLLECTION' // Primary Default!
  | 'FRANCHISE_TOP_25_WAR'      // 30 Franchises Top 25 WAR Seasons & Active Rosters
  | 'NON_PLAYER_CARDS'          // 36 Stadium Cards + 35+ Equipment & Relics
  | 'ALL_PLAYERS_ROSTER'        // 855 Cards: 30 Teams + Top 25 WAR Legends + Negro Leagues
  | 'CHOP_EXTREME_SABERMETRICS' // RE24, WPA, 4 Pillars & 100-Point Path
  | 'SEASONS_CALENDAR'
  | 'COMMUNITY_FORUM'
  | 'SIGNUP_LOGIN';

export const FirstEnterPortalModal: React.FC<FirstEnterPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectCardForShowdown,
  onOpenCardDetails
}) => {
  // Knowledge Base & Card Collection Hub is the front-and-center default!
  const [activeTab, setActiveTab] = useState<PortalTab>('KNOWLEDGE_BASE_COLLECTION');

  // Franchise Top 25 WAR State
  const [selectedFranchise, setSelectedFranchise] = useState<string>('Baltimore Orioles');
  const [franchiseLeagueFilter, setFranchiseLeagueFilter] = useState<'ALL' | 'AL' | 'NL'>('ALL');
  const [franchiseViewMode, setFranchiseViewMode] = useState<'TOP_25_LEGENDS' | 'ACTIVE_26_MAN'>('TOP_25_LEGENDS');
  const [liveRoster, setLiveRoster] = useState<MlbApiRosterPlayer[] | null>(null);
  const [isLoadingLiveRoster, setIsLoadingLiveRoster] = useState(false);
  const [liveRosterError, setLiveRosterError] = useState<string | null>(null);

  // Equipment & Relics Filter
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState<string>('ALL');

  // Player Cards Browser Filter
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'TOP_25_LEGENDS' | 'NEGRO_LEAGUES' | 'AL_EAST' | 'AL_CENTRAL' | 'AL_WEST' | 'NL_EAST' | 'NL_CENTRAL' | 'NL_WEST'>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [inspectedCard, setInspectedCard] = useState<PlayerCard | null>(null);

  // Stadium Filter
  const [stadiumFilter, setStadiumFilter] = useState<'ALL' | 'AL' | 'NL' | 'HISTORIC'>('ALL');
  const [stadiumSearch, setStadiumSearch] = useState('');

  // Video Glyphs / Interactive simulation demo state
  const [activeVideoGlyph, setActiveVideoGlyph] = useState<'CHOP_PHYSICS' | 'RE24_LEVERAGE' | 'ROTATION_360' | 'COUNTER_PREDICTION' | 'NINTH_INNING_CRISIS'>('CHOP_PHYSICS');
  const [glyphPlaying, setGlyphPlaying] = useState(true);

  // Seasons Calendar Inspection
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);

  // Forum State
  const [forumCategory, setForumCategory] = useState('ALL');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => forumService.getPosts('ALL'));
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'CAMDEN_CLUBHOUSE' | 'CARD_SHOW_TRADES' | 'CHOP_STRATEGY' | 'ORIOLES_LORE'>('CAMDEN_CLUBHOUSE');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserAccountProfile | null>(() => authService.getProfile());
  const [usernameInput, setUsernameInput] = useState(userProfile?.username || '');
  const [authMsg, setAuthMsg] = useState('');

  // Subscribe to auth updates
  React.useEffect(() => {
    return authService.subscribe((p) => {
      setUserProfile(p);
      if (p) setUsernameInput(p.username);
    });
  }, []);

  // Sync Live Active Roster using user's MLB Stats API function
  const handleFetchLiveRoster = async (teamName: string) => {
    const teamId = getTeamIdByName(teamName);
    setIsLoadingLiveRoster(true);
    setLiveRosterError(null);
    try {
      const roster = await fetchTeamRoster(teamId);
      setLiveRoster(roster);
      soundManager.playRefractorShine();
    } catch (err: any) {
      console.warn('Live MLB roster fetch error:', err);
      setLiveRosterError('Live API query returned cached roster (Rate-limit or network fallback).');
      // Fallback to active 26-man roster from our database
      const fallbackCards = BASE_ACTIVE_PLAYERS.filter(p => p.team === teamName);
      setLiveRoster(fallbackCards.slice(0, 26).map((p, idx) => ({
        id: 700000 + idx,
        fullName: p.name,
        position: p.position,
        status: 'Active',
        jerseyNumber: String((idx % 40) + 1)
      })));
    } finally {
      setIsLoadingLiveRoster(false);
    }
  };

  // Team list for dropdown
  const allTeamNames = useMemo(() => {
    return MLB_TEAMS.map(t => t.name).sort();
  }, []);

  if (!isOpen) return null;

  // Filtered Players Logic
  const filteredPlayers = ALL_PLAYERS.filter(p => {
    const matchesSearch = playerSearch === '' || 
      p.name.toLowerCase().includes(playerSearch.toLowerCase()) || 
      p.team.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.position.toLowerCase().includes(playerSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedSection === 'TOP_25_LEGENDS') return TOP_25_WAR_LEGENDS.some(l => l.id === p.id);
    if (selectedSection === 'NEGRO_LEAGUES') return NEGRO_LEAGUE_LEGENDS.some(n => n.id === p.id);
    if (selectedSection === 'AL_EAST') return ['Baltimore Orioles', 'Boston Red Sox', 'New York Yankees', 'Tampa Bay Rays', 'Toronto Blue Jays'].includes(p.team);
    if (selectedSection === 'AL_CENTRAL') return ['Chicago White Sox', 'Cleveland Guardians', 'Detroit Tigers', 'Kansas City Royals', 'Minnesota Twins'].includes(p.team);
    if (selectedSection === 'AL_WEST') return ['Houston Astros', 'Los Angeles Angels', 'Oakland Athletics', 'Seattle Mariners', 'Texas Rangers'].includes(p.team);
    if (selectedSection === 'NL_EAST') return ['Atlanta Braves', 'Miami Marlins', 'New York Mets', 'Philadelphia Phillies', 'Washington Nationals'].includes(p.team);
    if (selectedSection === 'NL_CENTRAL') return ['Chicago Cubs', 'Cincinnati Reds', 'Milwaukee Brewers', 'Pittsburgh Pirates', 'St. Louis Cardinals'].includes(p.team);
    if (selectedSection === 'NL_WEST') return ['Arizona Diamondbacks', 'Colorado Rockies', 'Los Angeles Dodgers', 'San Diego Padres', 'San Francisco Giants'].includes(p.team);

    if (selectedTeam !== 'ALL' && p.team !== selectedTeam) return false;

    return true;
  });

  // Filtered Stadiums
  const filteredStadiums = STADIUM_CARDS.filter(s => {
    const matchesLeague = stadiumFilter === 'ALL' || s.league === stadiumFilter;
    const matchesSearch = stadiumSearch === '' ||
      s.name.toLowerCase().includes(stadiumSearch.toLowerCase()) ||
      s.team.toLowerCase().includes(stadiumSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(stadiumSearch.toLowerCase());
    return matchesLeague && matchesSearch;
  });

  // Handle Forum Upvote
  const handleUpvote = (id: string) => {
    forumService.upvote(id);
    setForumPosts(forumService.getPosts(forumCategory));
    soundManager.playButtonClick();
  };

  // Handle Submit Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    forumService.createPost({
      category: newPostCategory,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      author: userProfile?.username || 'DiamondCollector',
      authorBadge: userProfile?.isAnonymous ? 'ROOKIE' : 'VERIFIED STATISTICIAN',
      avatarIcon: '⚾',
      tags: ['Season1', 'KnowledgeBase', 'Analytics']
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostForm(false);
    setForumPosts(forumService.getPosts(forumCategory));
    soundManager.playJackpotChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-6xl shadow-[0_25px_60px_-15px_rgba(234,88,12,0.4)] relative overflow-hidden flex flex-col max-h-[96vh] border-2 border-orange-500/50">
        
        {/* Top Metallic Orange/Cyan Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-400" />

        {/* Modal Top Bar: Game Logo + Title + Play Now CTA + Close */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 border-2 border-orange-400 flex items-center justify-center text-xl shadow-[0_0_16px_rgba(234,88,12,0.5)] shrink-0 overflow-hidden">
              <img
                src="/chop-logo.jpeg"
                alt="The Baltimore Chop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image path has issue
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-display font-black text-slate-950">⚾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-display font-black text-white tracking-wide uppercase">
                  THE BALTIMORE CHOP
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-orange-600 text-white shadow">
                  SEASON 1 VAULT
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Knowledge Base & Official Card Collection · 855 Players · 36 Stadiums · RE24 Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundManager.playBatCrack(true);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Enter Game
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b border-white/10 bg-slate-900/70 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('KNOWLEDGE_BASE_COLLECTION');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'KNOWLEDGE_BASE_COLLECTION'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Season Knowledge Base
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('FRANCHISE_TOP_25_WAR');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'FRANCHISE_TOP_25_WAR'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-amber-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👑</span> 30 Franchises Top 25 WAR Vault
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('NON_PLAYER_CARDS');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'NON_PLAYER_CARDS'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏟️</span> Non-Player Cards ({TOTAL_STADIUM_CARDS_COUNT} Stadiums + 35+ Equip & Relics)
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('ALL_PLAYERS_ROSTER');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ALL_PLAYERS_ROSTER'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-300" /> All 855 Players by Franchise
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('CHOP_EXTREME_SABERMETRICS');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CHOP_EXTREME_SABERMETRICS'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-red-400" /> Chop Extreme & RE24 Rules
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('SEASONS_CALENDAR');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SEASONS_CALENDAR'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-300" /> 12-Season Drop Calendar
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveTab('COMMUNITY_FORUM');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'COMMUNITY_FORUM'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-300" /> Community Forum
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* =========================================================================
              TAB 1: PRIMARY KNOWLEDGE BASE & CARD COLLECTION HUB
              ========================================================================= */}
          {activeTab === 'KNOWLEDGE_BASE_COLLECTION' && (
            <div className="space-y-6">
              
              {/* Comprehensive Cards Collection Count Showcase Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Total Player Cards */}
                <div 
                  onClick={() => setActiveTab('ALL_PLAYERS_ROSTER')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/60 to-slate-900 border border-orange-500/40 cursor-pointer hover:border-orange-400 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span>PLAYER CARDS</span>
                    <span className="text-orange-400 text-base group-hover:scale-110 transition-transform">⚾</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white">855 Cards</div>
                  <div className="text-[10.5px] font-mono text-slate-300 mt-1 space-y-0.5">
                    <div>• 780 Active MLB (30 Teams × 26)</div>
                    <div>• 25 Top bRef WAR Legends</div>
                    <div>• 50 Negro League Legends</div>
                  </div>
                </div>

                {/* Total Stadium Cards */}
                <div 
                  onClick={() => setActiveTab('NON_PLAYER_CARDS')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span>STADIUM CARDS</span>
                    <span className="text-emerald-400 text-base group-hover:scale-110 transition-transform">🏟️</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white">36 Ballparks</div>
                  <div className="text-[10.5px] font-mono text-slate-300 mt-1 space-y-0.5">
                    <div>• 30 Active MLB Stadiums</div>
                    <div>• 6 Historic Ballparks</div>
                    <div>• Quirks, Walls & Bounce Factors</div>
                  </div>
                </div>

                {/* Equipment & Relics */}
                <div 
                  onClick={() => setActiveTab('NON_PLAYER_CARDS')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 cursor-pointer hover:border-cyan-400 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span>EQUIPMENT & RELICS</span>
                    <span className="text-cyan-400 text-base group-hover:scale-110 transition-transform">🛡️</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white">12 Relics</div>
                  <div className="text-[10.5px] font-mono text-slate-300 mt-1 space-y-0.5">
                    <div>• 1970 Memorial Dirt Jar</div>
                    <div>• Cupped Bats & Gold Gloves</div>
                    <div>• Rituals & Coaching Cards</div>
                  </div>
                </div>

                {/* Seasonal Drop Sets */}
                <div 
                  onClick={() => setActiveTab('SEASONS_CALENDAR')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 cursor-pointer hover:border-purple-400 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                    <span>TOTAL COLLECTIBLES</span>
                    <span className="text-purple-400 text-base group-hover:scale-110 transition-transform">🎴</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-white">903 Total</div>
                  <div className="text-[10.5px] font-mono text-slate-300 mt-1 space-y-0.5">
                    <div>• 8 Flagship Drop Series</div>
                    <div>• 6 Refractor Tiers (to 1/1)</div>
                    <div>• 12-Month Calendar</div>
                  </div>
                </div>

              </div>

              {/* Video Glyphs & Interactive Analytical Visualizations */}
              <div className="p-5 rounded-3xl bg-slate-950/90 border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-display font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-orange-400" />
                      Visual Demonstration Glyphs & In-Game Mechanics
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Interactive tactical references explaining how modern baseball analytics and 3D card physics operate.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setActiveVideoGlyph('CHOP_PHYSICS')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        activeVideoGlyph === 'CHOP_PHYSICS' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ▶ Baltimore Chop
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVideoGlyph('RE24_LEVERAGE')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        activeVideoGlyph === 'RE24_LEVERAGE' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ▶ RE24 Leverage
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVideoGlyph('ROTATION_360')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        activeVideoGlyph === 'ROTATION_360' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ▶ 360° Card Spin
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVideoGlyph('COUNTER_PREDICTION')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        activeVideoGlyph === 'COUNTER_PREDICTION' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ▶ 3-Pitch Matrix
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVideoGlyph('NINTH_INNING_CRISIS')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        activeVideoGlyph === 'NINTH_INNING_CRISIS' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      ▶ 9th Inning Crisis (Sim Example)
                    </button>
                  </div>
                </div>

                {/* Animated Simulation Canvas / Video Glyph Player */}
                <div className="relative rounded-2xl bg-black/80 border border-white/10 p-5 overflow-hidden flex flex-col justify-between min-h-[220px]">
                  
                  {activeVideoGlyph === 'CHOP_PHYSICS' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-amber-400 font-bold border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                          GLYPH #1: THE BALTIMORE CHOP TRAJECTORY DYNAMICS
                        </span>
                        <span className="text-[10px] text-slate-400">Launch Angle: -12° · Apex: 24.5 ft</span>
                      </div>
                      
                      {/* Diagram */}
                      <div className="h-28 relative rounded-xl bg-gradient-to-b from-slate-900 via-emerald-950/30 to-amber-950/60 border border-white/5 flex items-center justify-center p-3">
                        <div className="absolute left-6 bottom-4 text-xs">🏏 Batter Contact</div>
                        <div className="absolute left-24 bottom-2 text-[10px] text-amber-400 font-bold">Hard-Packed Clay (Memorial Stadium / Camden Yards)</div>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange-600 text-white font-bold text-xs shadow-lg animate-bounce">
                          ⚾ Ball Rebounds 24ft into Air!
                        </div>
                        <div className="absolute right-6 bottom-4 text-xs text-slate-400">Infielders Left Helpless 🏃💨</div>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Pioneered by John McGraw's 1890s Baltimore Orioles. When the ball hits hard infield dirt with negative downward bat velocity, it rebounds skyward, giving speedy hitters time to sprint down the line before the shortstop or third baseman can field it.
                      </p>
                    </div>
                  )}

                  {activeVideoGlyph === 'RE24_LEVERAGE' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                          GLYPH #2: RUN EXPECTANCY (RE24) & LEVERAGE MULTIPLIERS
                        </span>
                        <span className="text-[10px] text-slate-400">High Leverage: 2.5x Multiplier</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                          <span className="text-slate-400 text-[10px] block">Low Leverage (LI &lt; 0.85)</span>
                          <span className="text-sm font-bold text-white">1.0x Points</span>
                          <span className="text-[9px] text-slate-500 block mt-1">Blowouts or early innings</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                          <span className="text-slate-400 text-[10px] block">Medium Leverage (0.85 - 2.0)</span>
                          <span className="text-sm font-bold text-amber-400">1.5x Points</span>
                          <span className="text-[9px] text-slate-500 block mt-1">Tied games or mid-innings</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-orange-950/60 border border-orange-500">
                          <span className="text-amber-300 text-[10px] block font-bold">Extreme Leverage (LI ≥ 2.0)</span>
                          <span className="text-sm font-black text-orange-400">2.5x Points</span>
                          <span className="text-[9px] text-slate-300 block mt-1">Late innings, runners on</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Points are anchored around actual run values: Singles (+89 pts), Doubles (+127 pts), Home Runs (+210 pts), Strikeouts (-30 pts), Walks (+69 pts), multiplied dynamically by the game's Leverage Index!
                      </p>
                    </div>
                  )}

                  {activeVideoGlyph === 'ROTATION_360' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-amber-400 font-bold border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          GLYPH #3: TRUE 360-DEGREE 3D CARD TURNING
                        </span>
                        <span className="text-[10px] text-slate-400">Front, Edges, Serial Stamp & Back</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-around">
                        <div className="text-center">
                          <span className="text-2xl block">🎴</span>
                          <span className="text-[10px] text-slate-400">Front (0° to 90°)</span>
                          <span className="text-[9px] text-amber-400 block">Specular Sheen & Foils</span>
                        </div>
                        <div className="text-amber-500 text-lg">──▶</div>
                        <div className="text-center">
                          <span className="text-2xl block">🔄</span>
                          <span className="text-[10px] text-slate-400">Edge Spin (90° - 270°)</span>
                          <span className="text-[9px] text-cyan-400 block">Die-Cut Metallic Serial</span>
                        </div>
                        <div className="text-amber-500 text-lg">──▶</div>
                        <div className="text-center">
                          <span className="text-2xl block">📋</span>
                          <span className="text-[10px] text-slate-400">Back (180° to 360°)</span>
                          <span className="text-[9px] text-emerald-400 block">Major League Record</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Cards now rotate smoothly all the way around 360 degrees via horizontal mouse drag, touch drag, or the continuous 360° auto-orbit button, revealing authentic cardstock depth and realistic debossed serial stamps!
                      </p>
                    </div>
                  )}

                  {activeVideoGlyph === 'COUNTER_PREDICTION' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-purple-400 font-bold border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                          GLYPH #4: 3-PITCH COUNTER PREDICTION ENGINE
                        </span>
                        <span className="text-[10px] text-slate-400">9-Zone Strike Matrix</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 leading-relaxed text-[11px]">
                        Pitchers deliver from 6 distinct pitch classifications (4-Seam, Slider, Curveball, Changeup, Sinker, Cutter). Correctly guessing the pitch type and zone unlocks exit velocities exceeding 105 mph and triggers the explosive barrel contact bonus (+50 pts)!
                      </div>
                    </div>
                  )}

                  {activeVideoGlyph === 'NINTH_INNING_CRISIS' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-red-400 font-bold border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                          GLYPH #5: THEORETICAL 9TH INNING CRISIS SIMULATION EXAMPLE
                        </span>
                        <span className="text-[10px] text-amber-300">Runners on 1st & 3rd · 1 Out · Bottom 9th · 2.5x Multiplier</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/40 space-y-2">
                        <div className="flex items-center justify-between text-white font-bold">
                          <span>Theoretical Matchup State: Home 4 - Away 3</span>
                          <span className="text-amber-400">Leverage Index: 2.85 (Ultra-High)</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">1 Out</span>
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">Bases: 1st & 3rd Occupied</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">Count: 2 Balls, 2 Strikes</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          This is an educational scenario model demonstrating extreme game pressure. In this situation, every run scored or conceded swings the Win Probability Added (WPA) by up to ±0.45. Hitting a sacrifice fly or a Baltimore Chop single yields a 2.5x point multiplier, while grounding into an inning-ending double play incurs a severe scoring penalty.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: 30 FRANCHISES TOP 25 SINGLE-SEASON WAR VAULT & ACTIVE ROSTERS
              ========================================================================= */}
          {activeTab === 'FRANCHISE_TOP_25_WAR' && (
            <div className="space-y-6">
              
              {/* Franchise Selector Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-black border border-amber-500/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-black text-amber-300 uppercase flex items-center gap-2">
                      <span>👑</span> All 30 MLB Franchises: All-Time Top 25 WAR Single Seasons & Active Rosters
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Explore every franchise’s 25 greatest Baseball-Reference WAR peaks or sync their official 26-man active roster via MLB Stats API.
                    </p>
                  </div>

                  {/* League Filter */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(['ALL', 'AL', 'NL'] as const).map((lg) => (
                      <button
                        key={lg}
                        type="button"
                        onClick={() => setFranchiseLeagueFilter(lg)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                          franchiseLeagueFilter === lg
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lg === 'ALL' ? 'All 30 Teams' : `${lg} (15)`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 30 MLB Franchises Carousel / Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {MLB_TEAMS
                    .filter(t => franchiseLeagueFilter === 'ALL' || t.league === franchiseLeagueFilter)
                    .map((team) => {
                      const isSelected = selectedFranchise === team.name;
                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => {
                            soundManager.playButtonClick();
                            setSelectedFranchise(team.name);
                            if (franchiseViewMode === 'ACTIVE_26_MAN') {
                              handleFetchLiveRoster(team.name);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 border ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-md font-black scale-102'
                              : 'bg-slate-800/90 text-slate-300 border-white/10 hover:text-white hover:bg-slate-700/80'
                          }`}
                        >
                          <span className="text-sm">{team.logoIcon}</span>
                          <span>{team.shortName}</span>
                          <span className="text-[9px] font-mono opacity-70">({team.division})</span>
                        </button>
                      );
                    })}
                </div>

                {/* View Mode Toggle & Live Sync Bar */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFranchiseViewMode('TOP_25_LEGENDS')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
                        franchiseViewMode === 'TOP_25_LEGENDS'
                          ? 'bg-amber-400 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>🏆</span> Top 25 Single-Season WAR Records
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFranchiseViewMode('ACTIVE_26_MAN');
                        if (!liveRoster) handleFetchLiveRoster(selectedFranchise);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 ${
                        franchiseViewMode === 'ACTIVE_26_MAN'
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      <span>Active 26-Man Roster (MLB Stats API)</span>
                    </button>
                  </div>

                  {franchiseViewMode === 'ACTIVE_26_MAN' && (
                    <button
                      type="button"
                      onClick={() => handleFetchLiveRoster(selectedFranchise)}
                      disabled={isLoadingLiveRoster}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-cyan-500/40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLiveRoster ? 'animate-spin' : ''}`} />
                      <span>{isLoadingLiveRoster ? 'Syncing with MLB API...' : `Sync ${selectedFranchise} (ID: ${getTeamIdByName(selectedFranchise)})`}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View 1: Top 25 Single-Season WAR Legends */}
              {franchiseViewMode === 'TOP_25_LEGENDS' && (() => {
                const warSeasons = getFranchiseTop25War(selectedFranchise);
                const richLegendSeasons = getTeamTop25WarSeasons(selectedFranchise);

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                      <span>Franchise: <strong className="text-amber-400">{selectedFranchise}</strong> · All-Time Top 25 Single Seasons Ranked by bRef WAR</span>
                      <span className="text-emerald-400 font-bold">25 Historic Outliers Cataloged</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {warSeasons.map((entry) => {
                        const richEntry = richLegendSeasons.find(r => r.rank === entry.rank) || richLegendSeasons[entry.rank - 1] || richLegendSeasons[0];
                        const cardObject = convertWarSeasonToCard(richEntry, selectedFranchise);

                        return (
                          <div
                            key={`${selectedFranchise}_${entry.rank}`}
                            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/60 transition-all shadow-md flex flex-col justify-between group"
                          >
                            <div>
                              {/* Top Bar: Rank, Season, Position */}
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-display font-black text-xs ${
                                    entry.rank === 1 ? 'bg-amber-400 text-slate-950 ring-2 ring-yellow-200' :
                                    entry.rank === 2 ? 'bg-slate-300 text-slate-950' :
                                    entry.rank === 3 ? 'bg-amber-700 text-white' :
                                    'bg-slate-800 text-slate-300'
                                  }`}>
                                    #{entry.rank}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-amber-300">
                                    {entry.season}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-bold">
                                    {entry.position}
                                  </span>
                                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                    {entry.war} WAR
                                  </span>
                                </div>
                              </div>

                              {/* Player Name & Archetype */}
                              <h4 className="text-sm font-display font-black text-white group-hover:text-amber-300 transition-colors uppercase leading-tight">
                                {entry.playerName}
                              </h4>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-200 border border-amber-500/30 font-bold">
                                  {entry.archetype}
                                </span>
                                <span className="text-[9.5px] font-mono text-cyan-300 font-bold">
                                  {entry.basePointsMultiplier}x RE24 Pts
                                </span>
                              </div>

                              {/* Key Feat */}
                              {entry.keyFeat && (
                                <p className="text-[10.5px] font-mono text-slate-300 mt-2 leading-relaxed bg-black/40 p-2 rounded-lg border border-white/5">
                                  {entry.keyFeat}
                                </p>
                              )}
                            </div>

                            {/* Actions: Inspect 3D & Deploy */}
                            <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  soundManager.playButtonClick();
                                  setInspectedCard(cardObject);
                                }}
                                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-300" />
                                <span>3D Card & 360°</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  soundManager.playBatCrack(true);
                                  onSelectCardForShowdown?.(cardObject);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wide flex items-center gap-1 shadow"
                              >
                                <Play className="w-3 h-3 fill-slate-950" />
                                <span>Deploy</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* View 2: Active 26-Man MLB Roster (MLB Stats API) */}
              {franchiseViewMode === 'ACTIVE_26_MAN' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">
                        Official MLB Endpoint: <code className="text-cyan-300 font-bold">https://statsapi.mlb.com/api/v1/teams/{getTeamIdByName(selectedFranchise)}/roster?rosterType=active</code>
                      </span>
                    </div>
                    {liveRosterError && (
                      <span className="text-amber-400 text-[11px]">{liveRosterError}</span>
                    )}
                  </div>

                  {/* Active Roster Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {(liveRoster || BASE_ACTIVE_PLAYERS.filter(p => p.team === selectedFranchise).slice(0, 26).map((p, idx) => ({
                      id: 700000 + idx,
                      fullName: p.name,
                      position: p.position,
                      status: 'Active',
                      jerseyNumber: String((idx % 40) + 1)
                    }))).map((player) => {
                      const matchedCard = BASE_ACTIVE_PLAYERS.find(p => p.name.toLowerCase() === player.fullName.toLowerCase() && p.team === selectedFranchise) ||
                        BASE_ACTIVE_PLAYERS.find(p => p.team === selectedFranchise) ||
                        BASE_ACTIVE_PLAYERS[0];

                      return (
                        <div
                          key={player.id}
                          className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="w-6 h-6 rounded bg-slate-800 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                                #{player.jerseyNumber}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                {player.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-display font-black text-white uppercase truncate">
                              {player.fullName}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              Position: <strong className="text-white">{player.position}</strong> · MLB ID: {player.id}
                            </span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playButtonClick();
                                setInspectedCard(matchedCard);
                              }}
                              className="text-[10px] font-mono text-amber-300 hover:underline"
                            >
                              Inspect Card
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playBatCrack(true);
                                onSelectCardForShowdown?.(matchedCard);
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-display font-black text-[10px] uppercase"
                            >
                              Field Player
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              TAB 3: NON-PLAYER CARDS (36 STADIUMS + 35+ EQUIPMENT & RELIC CARDS)
              ========================================================================= */}
          {activeTab === 'NON_PLAYER_CARDS' && (
            <div className="space-y-6">
              
              {/* Stadiums Header & Filter */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-xs font-mono space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                      <span>🏟️</span> Stadium Cards Collection ({TOTAL_STADIUM_CARDS_COUNT} Total Ballparks)
                    </h3>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      All 30 active MLB ballparks + 6 iconic Historic ballparks (Polo Grounds, Memorial Stadium, Forbes Field, Ebbets Field, Tiger Stadium, Astrodome).
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1">
                    {(['ALL', 'AL', 'NL', 'HISTORIC'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setStadiumFilter(l)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                          stadiumFilter === l ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {l} ({l === 'ALL' ? 36 : l === 'HISTORIC' ? 6 : 15})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stadiums by name, city, team, or wall quirk..."
                    value={stadiumSearch}
                    onChange={(e) => setStadiumSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Stadium Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStadiums.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-emerald-500/50 transition-all shadow-md space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          s.league === 'HISTORIC' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-emerald-400'
                        }`}>
                          {s.league === 'HISTORIC' ? 'HISTORIC LEGEND' : `${s.league} ${s.division || ''}`}
                        </span>
                      </div>

                      <h4 className="text-xs font-display font-black text-white uppercase mt-1 leading-tight">{s.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block">{s.team} · {s.city}</span>

                      {/* Dimensions & Bounce Factor */}
                      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                        <div className="p-1 rounded bg-black/40">
                          <span className="text-slate-500 block text-[8px]">LF / CF / RF</span>
                          <span className="font-bold text-white">{s.dimensions.leftField}/{s.dimensions.centerField}/{s.dimensions.rightField}</span>
                        </div>
                        <div className="p-1 rounded bg-black/40">
                          <span className="text-slate-500 block text-[8px]">Chop Bounce</span>
                          <span className="font-bold text-orange-400">+{Math.round((s.chopBounceFactor - 1) * 100)}%</span>
                        </div>
                        <div className="p-1 rounded bg-black/40">
                          <span className="text-slate-500 block text-[8px]">Park Factor</span>
                          <span className="font-bold text-cyan-300">{s.hitterParkFactor}</span>
                        </div>
                      </div>

                      <div className="mt-2 p-1.5 rounded-lg bg-black/40 border border-white/5 text-[9.5px] font-mono text-amber-300">
                        <strong>Quirk:</strong> {s.signatureQuirk}
                      </div>

                      <p className="text-[9.5px] font-mono text-slate-400 mt-1 italic leading-tight line-clamp-2">
                        "{s.lore}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Equipment & Relics Section */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                      <span>🛡️</span> Equipment, Armor & Game-Used Relic Cards ({INITIAL_EQUIPMENT_CARDS.length} Vault Items)
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Authentic batting gloves, fielding gloves, game-used bats, protective armor, cleats, and verified relics.
                    </p>
                  </div>

                  {/* Subcategory Filter Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
                    {[
                      { id: 'ALL', label: 'All Equipment' },
                      { id: 'BATTING_GLOVES', label: 'Batting Gloves' },
                      { id: 'FIELDING_GLOVE', label: 'Fielding Gloves' },
                      { id: 'BAT', label: 'Bats' },
                      { id: 'CLEATS', label: 'Cleats' },
                      { id: 'ARMOR', label: 'Armor' },
                      { id: 'RELIC', label: 'Relics' },
                      { id: 'RITUAL', label: 'Rituals' },
                      { id: 'COACH', label: 'Coaches' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setEquipmentTypeFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 ${
                          equipmentTypeFilter === cat.id
                            ? 'bg-cyan-500 text-slate-950 font-black shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INITIAL_EQUIPMENT_CARDS
                    .filter(eq => equipmentTypeFilter === 'ALL' || eq.type === equipmentTypeFilter || (equipmentTypeFilter === 'FIELDING_GLOVE' && eq.type === 'GLOVE'))
                    .map((eq) => (
                    <div
                      key={eq.id}
                      className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{eq.icon}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                            eq.rarity === 'LEGENDARY' ? 'bg-amber-950 text-amber-300 border border-amber-400/40' :
                            eq.rarity === 'VINTAGE' ? 'bg-purple-950 text-purple-300 border border-purple-400/40' :
                            eq.rarity === 'RARE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/40' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {eq.rarity} · {eq.type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <h4 className="text-xs font-display font-black text-white uppercase mt-1 leading-tight">{eq.name}</h4>
                        <p className="text-[10.5px] font-mono text-slate-300 leading-tight mt-1">{eq.description}</p>
                        
                        {/* Stat Buff Badges */}
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] font-mono">
                          {eq.buffStats.contactBonus && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                              +{eq.buffStats.contactBonus} Contact
                            </span>
                          )}
                          {eq.buffStats.powerBonus && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                              +{eq.buffStats.powerBonus} Power
                            </span>
                          )}
                          {eq.buffStats.chopBounceBonus && (
                            <span className="px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/30 font-bold">
                              +{eq.buffStats.chopBounceBonus}% Chop Bounce
                            </span>
                          )}
                          {eq.buffStats.fieldingBonus && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 font-bold">
                              +{eq.buffStats.fieldingBonus} Fielding
                            </span>
                          )}
                          {eq.buffStats.speedBonus && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                              +{eq.buffStats.speedBonus} Speed
                            </span>
                          )}
                        </div>

                        {/* Relic Specific Authentication Details */}
                        {eq.relicDetails && (
                          <div className="mt-2 p-2 rounded-xl bg-black/60 border border-amber-500/30 text-[9.5px] font-mono space-y-0.5 text-amber-200">
                            <div className="flex items-center justify-between font-bold text-amber-300">
                              <span>CERTIFIED GAME-USED RELIC</span>
                              <span className="text-[8px] bg-amber-950 px-1 rounded">{eq.relicDetails.authenticationId}</span>
                            </div>
                            <div className="text-slate-400">Date: {eq.relicDetails.gameDate}</div>
                            <div className="text-slate-400">Material: {eq.relicDetails.materialType}</div>
                            <div className="text-slate-400">Location: {eq.relicDetails.gameLocation}</div>
                          </div>
                        )}

                        <p className="text-[9.5px] font-mono text-slate-500 italic leading-tight mt-1">"{eq.lore}"</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Status: {eq.equipped ? 'Equipped in Bag' : 'In Vault'}</span>
                        <span className="text-cyan-400 font-bold">Ready to Equip</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 3: ALL 855 PLAYERS BROKEN UP BY TEAM & TOP 25 WAR LEGENDS
              ========================================================================= */}
          {activeTab === 'ALL_PLAYERS_ROSTER' && (
            <div className="space-y-4">
              
              {/* Header & Controls */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      All 855 Player Cards: 30 MLB Franchises + Top 25 WAR Legends
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Showing {filteredPlayers.length} of 855 Total Cards
                    </p>
                  </div>

                  {/* Section Selector */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSection('ALL');
                        setSelectedTeam('ALL');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'ALL' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      All (855)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('TOP_25_LEGENDS')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'TOP_25_LEGENDS' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-300 hover:text-white'
                      }`}
                    >
                      👑 Top 25 WAR Legends (25)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('NEGRO_LEAGUES')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'NEGRO_LEAGUES' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-300 hover:text-white'
                      }`}
                    >
                      🌟 Negro Leagues (50)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('AL_EAST')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'AL_EAST' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AL East
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('AL_CENTRAL')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'AL_CENTRAL' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AL Central
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('AL_WEST')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'AL_WEST' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      AL West
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('NL_EAST')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'NL_EAST' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      NL East
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('NL_CENTRAL')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'NL_CENTRAL' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      NL Central
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSection('NL_WEST')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                        selectedSection === 'NL_WEST' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      NL West
                    </button>
                  </div>
                </div>

                {/* Search Bar + Team Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by player name, team or position..."
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="ALL">Filter by All 30 MLB Franchises (All Teams)</option>
                    {allTeamNames.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Top 25 WAR Legends Spotlight Banner (when selected or on overview) */}
              {selectedSection === 'TOP_25_LEGENDS' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/50 text-xs font-mono text-amber-200">
                  <span className="font-bold text-amber-300 block mb-1">
                    👑 BASEBALL REFERENCE OFFICIAL TOP 25 CAREER / PEAK WAR IMMORTALS
                  </span>
                  These 25 immortal cards represent the highest Baseball Reference WAR totals in baseball history. Click any legend to inspect accumulated in-game stats, game-mode dominance, and decide on tactical deployment (Starter, Pinch Hitter, Ace Starter, Bullpen Closer, Franchise Anchor)!
                </div>
              )}

              {/* Player Cards Compact List with Inspect / Showdown CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredPlayers.slice(0, 75).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (onOpenCardDetails) onOpenCardDetails(card);
                    }}
                    className="p-3 rounded-2xl bg-slate-950/85 border border-white/10 hover:border-orange-500/60 transition-all flex items-center justify-between gap-2.5 cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                        {card.avatarIcon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-xs uppercase text-white truncate group-hover:text-amber-300">
                            {card.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-black/60 px-1 py-0.2 rounded shrink-0">
                            {card.position}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 truncate block">
                          {card.team} · <strong className="text-emerald-400">{card.bRefWar} WAR</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300">
                        Inspect 360° ▶
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlayers.length > 75 && (
                <div className="p-3 text-center text-xs font-mono text-slate-400 border border-white/5 rounded-xl bg-black/40">
                  Showing first 75 of {filteredPlayers.length} matching cards. Use the search bar or franchise dropdown above to narrow down to any specific player.
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              TAB 4: CHOP EXTREME SABERMETRICS & RE24 EXPLANATION
              ========================================================================= */}
          {activeTab === 'CHOP_EXTREME_SABERMETRICS' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/40 space-y-2">
                <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Modern Baseball Analytical Architecture (RE24 & WPA)
                </h3>
                <p className="text-slate-300 text-[11.5px] leading-relaxed">
                  To satisfy baseball stat purists, points in The Baltimore Chop are not arbitrary arcade scores like "+10 for a single". They are grounded in real sabermetric infrastructure: <strong>Run Expectancy 24 Base-Out States (RE24)</strong>, <strong>Win Probability Added (WPA)</strong>, and <strong>Linear Weights (wOBA)</strong>.
                </p>
              </div>

              {/* Linear Weights Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-2.5">Event</th>
                      <th className="p-2.5">Real MLB Run Value</th>
                      <th className="p-2.5">Base In-Game Points</th>
                      <th className="p-2.5">Low Leverage (1.0x)</th>
                      <th className="p-2.5 text-amber-400">High Leverage (2.5x)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="p-2.5 font-bold text-white">Out Recorded (Batter)</td>
                      <td className="p-2.5 text-red-400">-0.27</td>
                      <td className="p-2.5 font-bold text-red-400">-27 pts</td>
                      <td className="p-2.5">-27 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">-68 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Strikeout (Batter / Pitcher)</td>
                      <td className="p-2.5 text-red-400">-0.30 / +0.30</td>
                      <td className="p-2.5 font-bold text-red-400">-30 / +30 pts</td>
                      <td className="p-2.5">-30 / +30 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">-75 / +75 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Walk (uBB) / HBP</td>
                      <td className="p-2.5 text-emerald-400">+0.69</td>
                      <td className="p-2.5 font-bold text-emerald-400">+69 pts</td>
                      <td className="p-2.5">+69 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">+173 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Single (1B)</td>
                      <td className="p-2.5 text-emerald-400">+0.89</td>
                      <td className="p-2.5 font-bold text-emerald-400">+89 pts</td>
                      <td className="p-2.5">+89 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">+223 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Double (2B)</td>
                      <td className="p-2.5 text-emerald-400">+1.27</td>
                      <td className="p-2.5 font-bold text-emerald-400">+127 pts</td>
                      <td className="p-2.5">+127 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">+318 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-white">Triple (3B)</td>
                      <td className="p-2.5 text-emerald-400">+1.62</td>
                      <td className="p-2.5 font-bold text-emerald-400">+162 pts</td>
                      <td className="p-2.5">+162 pts</td>
                      <td className="p-2.5 text-amber-400 font-bold">+405 pts</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-300">Home Run (HR)</td>
                      <td className="p-2.5 text-amber-300 font-bold">+2.10</td>
                      <td className="p-2.5 font-black text-amber-300">+210 pts</td>
                      <td className="p-2.5 font-bold text-amber-300">+210 pts</td>
                      <td className="p-2.5 text-amber-400 font-black">+525 pts</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Dynamic Penalties & Statcast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <span className="font-bold text-amber-400 block text-xs">Statcast Precision Modifiers</span>
                  <div>• Chased Out-of-Zone: <strong>-15 pts</strong> (Discipline penalty)</div>
                  <div>• Elevated Fastball Whiff: <strong>-20 pts</strong></div>
                  <div>• Statcast Barrel Contact (EV ≥98mph, LA 26°-30°): <strong className="text-emerald-400">+50 pts</strong></div>
                  <div>• Perfect 0-2 Pitch Sequence: <strong className="text-cyan-300">+40 pts</strong></div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <span className="font-bold text-red-400 block text-xs">Dynamic Extreme Penalties</span>
                  <div>• <strong>BABIP Karma Tax:</strong> Swings on &lt;.100 xBA bloops yield only 20% points.</div>
                  <div>• <strong>Platoon Blunder:</strong> RHP vs .950 OPS LHB with bullpen ready = <strong>-50 Momentum</strong>.</div>
                  <div>• <strong>Out Burn Rate:</strong> Out in Gauntlet permanently burns stamina & next hand draw.</div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: 12-SEASON DROP CALENDAR
              ========================================================================= */}
          {activeTab === 'SEASONS_CALENDAR' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  12-Month Live Seasonal Release Calendar (Starts Nov 1)
                </h3>
                <p className="text-slate-300 text-[11px]">
                  Each month drops a brand-new collector theme with unique 3D card borders, historical moments, and refractor parallels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TWELVE_SEASONS.map((s) => (
                  <div
                    key={s.seasonNumber}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      s.status === 'ACTIVE'
                        ? 'bg-orange-950/40 border-orange-500 shadow-md'
                        : 'bg-slate-950/80 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-amber-400">SEASON {s.seasonNumber}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        s.status === 'ACTIVE' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.status === 'ACTIVE' ? '● CURRENT' : 'DROPS SOON'}
                      </span>
                    </div>
                    <h4 className="text-xs font-display font-black text-white uppercase">{s.hobbyLikenessSet}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{s.actualHobbyReleaseDate}</span>
                    <p className="text-[10px] text-slate-300 mt-2 leading-tight">{s.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: COMMUNITY FORUM
              ========================================================================= */}
          {activeTab === 'COMMUNITY_FORUM' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-black text-white uppercase flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Community Card Collector Forum
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Discuss pulls, refractor trades, Baltimore Chop strategies, and sabermetrics.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow"
                >
                  {showNewPostForm ? 'Cancel' : '+ New Post'}
                </button>
              </div>

              {/* New Post Form */}
              {showNewPostForm && (
                <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/50 space-y-3 font-mono text-xs">
                  <input
                    type="text"
                    placeholder="Post title (e.g. Pulled a 1/1 Superfractor Babe Ruth!)..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Write your analysis, trade request, or questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold uppercase"
                  >
                    Publish Post
                  </button>
                </form>
              )}

              {/* Posts List */}
              <div className="space-y-3">
                {forumPosts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.avatarIcon}</span>
                        <span className="font-bold text-white">{p.author}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">{p.authorBadge}</span>
                      </div>
                      <span className="text-[9px] text-slate-500">{new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>

                    <h4 className="font-display font-bold text-white text-sm uppercase">{p.title}</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{p.content}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                      <div className="flex gap-1.5">
                        {p.tags.map(t => (
                          <span key={t} className="text-purple-300 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/20">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpvote(p.id)}
                        className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        <span>👍</span> {p.upvotes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            3D CARD INSPECTION MODAL OVERLAY WITH 360° SPIN & RAINBOW CHASE TRACKER
            ========================================================================= */}
        {inspectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-950 border border-amber-500/50 rounded-3xl p-4 sm:p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col items-center gap-4 relative shadow-[0_0_50px_rgba(245,158,11,0.25)]">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Close 3D inspection"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Instructions */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black">
                  ★ 360° INTERACTIVE CARD VAULT ★
                </span>
                <h3 className="text-lg font-display font-black text-white uppercase">
                  {inspectedCard.name} ({inspectedCard.era})
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Drag card to turn 360 degrees, or click the orbit spin button to view the metallic stamped serial number on the slab header.
                </p>
              </div>

              {/* 3D Card Container */}
              <div className="my-2 flex justify-center">
                <Card3D card={inspectedCard} size="large" interactive={true} />
              </div>

              {/* The Rainbow Chase Collection Tracker (6-Slot Parallel Carousel) */}
              <div className="w-full">
                <RainbowChaseTracker
                  card={inspectedCard}
                  onRainbowCompleted={(cardName) => {
                    soundManager.playHomeRunFanfare();
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCardDetails) {
                      onOpenCardDetails(inspectedCard);
                      setInspectedCard(null);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Season Stats & Leaderboard</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playBatCrack(true);
                      onSelectCardForShowdown?.(inspectedCard);
                      setInspectedCard(null);
                      onClose();
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Deploy to Showdown</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
