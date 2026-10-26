import React, { useState, useMemo } from 'react';
import { ALL_PLAYERS } from '../data/players';
import { CARD_SETS } from '../data/sets';
import { TWELVE_SEASONS, SeasonInfo } from '../data/seasons';
import { forumService, ForumPost } from '../services/forumService';
import { authService, UserAccountProfile } from '../services/authService';
import { soundManager } from '../services/audio';
import { AnimatedGameLoop } from './AnimatedGameLoop';
import { Card3D } from './Card3D';
import { PlayerCard } from '../types/game';
import { 
  Play, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Layers, 
  Calendar, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Search, 
  Plus, 
  ThumbsUp, 
  Send, 
  Sparkles, 
  Trophy, 
  Flame, 
  Eye, 
  X,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';

interface FirstEnterPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCardForShowdown?: (card: PlayerCard) => void;
}

type PortalTab = 
  | 'GAME_BREAKDOWN'
  | 'AVAILABLE_CARDS'
  | 'SEASONS_CALENDAR'
  | 'KNOWLEDGE_BASE'
  | 'COMMUNITY_FORUM'
  | 'SIGNUP_LOGIN';

export const FirstEnterPortalModal: React.FC<FirstEnterPortalModalProps> = ({
  isOpen,
  onClose,
  onSelectCardForShowdown
}) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('GAME_BREAKDOWN');

  // Available Cards Filter
  const [cardSearch, setCardSearch] = useState('');
  const [cardPos, setCardPos] = useState('ALL');
  const [inspectedCard, setInspectedCard] = useState<PlayerCard | null>(null);

  // Seasons Calendar Inspection
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);

  // Knowledge Base Search
  const [kbSearch, setKbSearch] = useState('');
  const [kbCategory, setKbCategory] = useState<'ALL' | 'CHOP_PHYSICS' | 'COUNTER_RULES' | 'REFRACTORS' | 'ROSTER' | 'STREAK'>('ALL');

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

  if (!isOpen) return null;

  const currentSeason = TWELVE_SEASONS.find((s) => s.seasonNumber === selectedSeasonNum) || TWELVE_SEASONS[0];

  // Filtered Cards for Season 1
  const filteredSeasonCards = ALL_PLAYERS.filter((c) => {
    const matchSearch =
      cardSearch === '' ||
      c.name.toLowerCase().includes(cardSearch.toLowerCase()) ||
      c.team.toLowerCase().includes(cardSearch.toLowerCase()) ||
      c.position.toLowerCase().includes(cardSearch.toLowerCase());
    const matchPos = cardPos === 'ALL' || c.position === cardPos;
    return matchSearch && matchPos;
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
      author: userProfile?.username || 'BirdlandFan',
      authorBadge: userProfile?.isAnonymous ? 'ROOKIE' : 'VERIFIED FAN',
      avatarIcon: userProfile?.linkedProviders?.includes('google.com')
        ? '🌐'
        : userProfile?.linkedProviders?.includes('apple.com')
        ? '🍎'
        : '⚾',
      tags: ['Season1', 'Community']
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostForm(false);
    setForumPosts(forumService.getPosts(forumCategory));
    soundManager.playJackpotChime();
  };

  // Handle Social Login
  const handleGoogleLogin = async () => {
    const res = await authService.linkGoogleAccount();
    if (res.success) {
      setAuthMsg('Linked with Google Account successfully!');
      soundManager.playJackpotChime();
    } else {
      setAuthMsg(res.error || 'Google linking cancelled.');
    }
    setTimeout(() => setAuthMsg(''), 4000);
  };

  const handleAppleLogin = async () => {
    const res = await authService.linkAppleAccount();
    if (res.success) {
      setAuthMsg('Linked with Apple Account successfully!');
      soundManager.playJackpotChime();
    } else {
      setAuthMsg(res.error || 'Apple ID linking cancelled.');
    }
    setTimeout(() => setAuthMsg(''), 4000);
  };

  const handleUpdateUsername = async () => {
    const res = await authService.changeUsername(usernameInput);
    if (res.success) {
      setAuthMsg('Username handle saved successfully!');
      soundManager.playJackpotChime();
    } else {
      setAuthMsg(res.error || 'Failed to update username.');
      soundManager.playUmpireCall(true);
    }
    setTimeout(() => setAuthMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-2xl animate-fade-in select-none">
      <div className="liquid-glass-panel rounded-3xl w-full max-w-6xl p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(234,88,12,0.4)] relative overflow-hidden flex flex-col max-h-[95vh] border-2 border-orange-500/50">
        
        {/* Top Metallic Orange/Cyan Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-cyan-400" />

        {/* Modal Top Bar: Game Logo + Title + Play Now CTA + Close */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Field Logo Icon (chopchop_085f9a0d.jpeg) */}
            <img
              src="/assets/aistudio/chopchop_085f9a0d.jpeg"
              alt="The Baltimore Chop Logo"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.5)] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-display font-black text-white tracking-wide uppercase">
                  THE BALTIMORE CHOP
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase bg-orange-600 text-white shadow">
                  SEASON 1 (11/1)
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Official Baseball Card Battler · 3D Topps Collect Showdowns & 12-Month Release Calendar
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Play Ball (Enter Game)
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

        {/* Segmented Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 mb-4 shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('GAME_BREAKDOWN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'GAME_BREAKDOWN'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" /> Game Breakdown & Arena Loop
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AVAILABLE_CARDS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'AVAILABLE_CARDS'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-300" /> Season 1 Cards (29)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SEASONS_CALENDAR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SEASONS_CALENDAR'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-950" /> 12-Season Calendar (Starts 11/1)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('KNOWLEDGE_BASE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'KNOWLEDGE_BASE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" /> Knowledge Base
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COMMUNITY_FORUM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'COMMUNITY_FORUM'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-300" /> Community Forum
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SIGNUP_LOGIN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SIGNUP_LOGIN'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-300" /> Sign Up / Log In
          </button>
        </div>

        {/* ================= TAB CONTENT PANELS ================= */}
        <div className="flex-1 overflow-y-auto pr-1">

          {/* ================= 1. GAME BREAKDOWN & LOOP ANIMATION ================= */}
          {activeTab === 'GAME_BREAKDOWN' && (
            <div className="space-y-6 animate-fade-in pb-4">
              {/* Loop Animation Box */}
              <AnimatedGameLoop />

              {/* 4 Pillars of The Baltimore Chop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-orange-500/30 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-xl">
                    ⚾
                  </div>
                  <h4 className="font-display font-black text-white text-sm uppercase">
                    1. The 1890s Chop Physics
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Swing downward on Camden Yards hard-packed dirt. A steep -18° downward launch angle produces a +35 ft vertical bounce over infielders, guaranteeing an infield single.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                    🎯
                  </div>
                  <h4 className="font-display font-black text-white text-sm uppercase">
                    2. 3-Pitch Counter-Duel
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Read the opposing ace's pitch arsenal (4-Seam, Slider, Sinker, Curveball) and anticipate the strike zone quadrant to unleash clutch exit velocity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-xl">
                    🎰
                  </div>
                  <h4 className="font-display font-black text-white text-sm uppercase">
                    3. 26-Man Big Board Draft
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Inspired by Sleeper-style board grids. Manage your 26-man Baltimore depth chart, swap pinch-hitters, and simulate 162-game pennant races.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-xl">
                    💎
                  </div>
                  <h4 className="font-display font-black text-white text-sm uppercase">
                    4. 5-Tier Topps Refractors
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Rip authentic physical-style packs to pull Rainbow Foils, Sapphires, Gold Waves (/50), Atomic Mojos (/10), and the ultimate 1/1 Superfractor with real gyroscope tilt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. AVAILABLE CARDS FOR SEASON 1 ================= */}
          {activeTab === 'AVAILABLE_CARDS' && (
            <div className="space-y-4 animate-fade-in pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 border border-cyan-500/30 p-4 rounded-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-display font-black text-white uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Season 1 Unlocked Cards (Kickoff: 11/1)
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      ACTIVE LAUNCH SET
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    All 29 licensed MLB players and legends available to draft, rip, and battler in Season 1.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                    {filteredSeasonCards.length} Available Cards
                  </span>
                </div>
              </div>

              {/* Search & Position Filters */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardSearch}
                    onChange={(e) => setCardSearch(e.target.value)}
                    placeholder="Search player, team, #..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-500 outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={cardPos}
                  onChange={(e) => setCardPos(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Positions</option>
                  <option value="SS">Shortstop (SS)</option>
                  <option value="3B">Third Base (3B)</option>
                  <option value="1B">First Base (1B)</option>
                  <option value="2B">Second Base (2B)</option>
                  <option value="C">Catcher (C)</option>
                  <option value="CF">Center Field (CF)</option>
                  <option value="LF">Left Field (LF)</option>
                  <option value="RF">Right Field (RF)</option>
                  <option value="DH">Designated Hitter (DH)</option>
                  <option value="SP">Starting Pitcher (SP)</option>
                  <option value="RP">Relief Pitcher (RP)</option>
                </select>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredSeasonCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-400/60 flex items-center justify-center text-sm shadow">
                            {card.avatarIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-amber-400">
                                #{card.cardNo || '00'}
                              </span>
                              <h4 className="text-xs font-display font-black text-white truncate max-w-[110px]">
                                {card.name}
                              </h4>
                            </div>
                            <span className="text-[9.5px] font-mono text-slate-400 block">
                              {card.team} · <strong className="text-orange-400">{card.position}</strong>
                            </span>
                          </div>
                        </div>

                        {card.isHistorical ? (
                          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-black">
                            Legend
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-black">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-1 p-1.5 rounded-lg bg-black/40 border border-white/5 text-center text-[9px] font-mono mb-2">
                        <div>
                          <span className="text-slate-500 block">WAR</span>
                          <span className="text-amber-300 font-bold">{card.bRefWar.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CON</span>
                          <span className="text-white font-bold">{card.stats.contact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">POW</span>
                          <span className="text-orange-400 font-bold">{card.stats.power}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">FLD</span>
                          <span className="text-emerald-400 font-bold">{card.stats.fielding}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 italic font-sans leading-relaxed">
                        "{card.bio}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setInspectedCard(card);
                          soundManager.playButtonClick();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-cyan-400" /> 3D Inspect
                      </button>

                      {onSelectCardForShowdown && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCardForShowdown(card);
                            onClose();
                            soundManager.playBatCrack(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 border border-orange-500/30 text-[10px] font-mono transition-colors"
                        >
                          Pick Batter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3D Inspect Modal */}
              {inspectedCard && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                  <div className="bg-slate-950 border-2 border-cyan-500/60 rounded-3xl p-5 max-w-xl w-full shadow-2xl relative">
                    <button
                      type="button"
                      onClick={() => setInspectedCard(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-[190px] h-[270px] shrink-0">
                        <Card3D card={inspectedCard} interactive size="normal" />
                      </div>
                      <div className="flex-1 space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-amber-400">
                            CARD #{inspectedCard.cardNo || '00'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                            {inspectedCard.position}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-slate-900 text-slate-300">
                            {inspectedCard.team}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-black text-white">
                          {inspectedCard.name}
                        </h3>
                        <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
                          "{inspectedCard.bio}"
                        </p>
                        <div className="grid grid-cols-4 gap-1.5 pt-2 text-center font-mono text-xs">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">WAR</span>
                            <span className="font-bold text-amber-300">{inspectedCard.bRefWar.toFixed(1)}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">PWR</span>
                            <span className="font-bold text-orange-400">{inspectedCard.stats.power}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">CON</span>
                            <span className="font-bold text-cyan-300">{inspectedCard.stats.contact}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-[9px] text-slate-400 block">FLD</span>
                            <span className="font-bold text-emerald-400">{inspectedCard.stats.fielding}</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setInspectedCard(null)}
                            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs"
                          >
                            Close Inspector
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. 12-SEASON MASTER CALENDAR & TOPPS RELEASES ================= */}
          {activeTab === 'SEASONS_CALENDAR' && (
            <div className="space-y-5 animate-fade-in pb-4">
              {/* Header explaining 11/1 start and locked status */}
              <div className="bg-gradient-to-r from-amber-950/80 to-slate-950/90 border border-amber-500/40 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-display font-black text-white uppercase">
                      Official 12-Season Hobby Calendar (Kicks Off 11/1)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Season 1 begins November 1 (11/1). Each upcoming monthly season unlocks progressively by actual Topps hobby release date. Upcoming season cards and sets remain strictly locked until said season starts!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5" /> S1 Active Now
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> S2-S12 Locked
                  </span>
                </div>
              </div>

              {/* Master 12-Season Medallions Graphic Banner (watermarked_img_1431752454010944403_ad0e9d0c.jpg) */}
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 relative shadow-2xl">
                <div className="p-3 bg-black/80 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4" /> 12 Seasonal Stadium Club Medallions (Official Asset)
                  </span>
                  <span>Click any season below to review its Topps release schedule</span>
                </div>
                <img
                  src="/assets/aistudio/watermarked_img_1431752454010944403_ad0e9d0c.jpg"
                  alt="12 Seasonal Medallions"
                  className="w-full object-cover max-h-[260px] opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* 12-Season Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {TWELVE_SEASONS.map((season) => {
                  const isSelected = selectedSeasonNum === season.seasonNumber;
                  return (
                    <div
                      key={season.seasonNumber}
                      onClick={() => {
                        setSelectedSeasonNum(season.seasonNumber);
                        soundManager.playButtonClick();
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                          : season.isUnlocked
                          ? 'bg-slate-950/80 border-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div>
                        {/* Top Season & Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-display font-black text-amber-400">
                              SEASON {season.seasonNumber}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              ({season.monthName})
                            </span>
                          </div>

                          {season.isUnlocked ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <Unlock className="w-2.5 h-2.5" /> UNLOCKED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-amber-400" /> LOCKED
                            </span>
                          )}
                        </div>

                        {/* Start Date */}
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="text-base font-display font-black text-white">
                            Starts {season.startDate}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({season.fullMonth})
                          </span>
                        </div>

                        {/* Aligned Topps Likeness Set */}
                        <div className="p-2 rounded-xl bg-black/50 border border-white/5 mb-2">
                          <span className="text-[9px] font-mono text-slate-400 block uppercase">
                            Topps Likeness Set:
                          </span>
                          <span className="text-xs font-display font-bold text-amber-300 block leading-tight">
                            {season.toppsLikenessSet}
                          </span>
                          <span className="text-[9.5px] font-mono text-cyan-400 block mt-0.5">
                            Hobby Drop: {season.actualHobbyReleaseDate}
                          </span>
                        </div>

                        {/* Theme & Lore */}
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                          {season.theme}
                        </p>
                      </div>

                      {/* Locked Notice / Featured Stars */}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        {season.isUnlocked ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Cards Available Now
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-500" /> Locked until {season.startDate}
                          </span>
                        )}
                        <span className={`text-[10px] ${isSelected ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>
                          {isSelected ? 'Selected' : 'View'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Season Detailed Inspection Box */}
              <div className="p-5 rounded-3xl bg-slate-950/90 border border-amber-500/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-xl font-display font-black text-white uppercase">
                        SEASON {currentSeason.seasonNumber}: {currentSeason.toppsLikenessSet}
                      </span>
                      {currentSeason.isUnlocked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                          ACTIVE IN PLAY
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black bg-red-950 text-red-400 border border-red-500/40 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> LOCKED UNTIL {currentSeason.startDate}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-amber-400">
                      Actual Hobby Release Window: {currentSeason.actualHobbyReleaseDate}
                    </span>
                  </div>

                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>Official Calendar Kickoff: <strong className="text-white">{currentSeason.startDate}</strong></div>
                    <div>Assigned Set ID: <strong className="text-cyan-400">{currentSeason.setId}</strong></div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {currentSeason.lore}
                </p>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Featured Roster Headliners:
                  </span>
                  {currentSeason.featuredPlayers.map((player) => (
                    <span
                      key={player}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white font-bold"
                    >
                      ⭐ {player}
                    </span>
                  ))}
                </div>

                {!currentSeason.isUnlocked && (
                  <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>
                      Notice: Cards and foil packs for Season {currentSeason.seasonNumber} remain cryptographically locked and will unlock automatically on {currentSeason.startDate}.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 4. KNOWLEDGE BASE ================= */}
          {activeTab === 'KNOWLEDGE_BASE' && (
            <div className="space-y-4 animate-fade-in pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl">
                <div>
                  <h4 className="text-sm sm:text-base font-display font-black text-white uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Baltimore Chop Master Knowledge Base
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Everything you need to master small ball, refractor odds, strike zone predictions, and roster depth.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                    6 Interactive Guides
                  </span>
                </div>
              </div>

              {/* Categorized Handbook Slabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚾</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      The Baltimore Chop Technique
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Originated by the 1890s Baltimore Orioles with Wee Willie Keeler, John McGraw, and Wilbert Robinson. Groundskeeper Tom Murphy baked Georgia clay in front of home plate. Batters chop sharply downward with negative attack angles (-15° to -25°). The ball rebounds 30 to 40 feet high into the air, rendering infielders helpless while the runner reaches first base safely.
                  </p>
                  <span className="text-[10px] font-mono text-orange-400 block font-bold">
                    In-Game Trigger: Target DOWN_IN, DOWN_MID, or DOWN_OUT against Sinker/Splitter pitches.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      3-Pitch Showdown Counter-Duel
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Each at-bat pits your starting batter against the opposing pitcher in a 3-pitch showdown. Select your targeted strike zone quadrant (9 zones) and anticipated pitch type (4-Seam, Slider, Curveball, Sinker, Changeup, Cutter). Matching both zone and pitch type triggers a critical hit or homerun!
                  </p>
                  <span className="text-[10px] font-mono text-cyan-400 block font-bold">
                    Zone Match = +30% Exit Velo · Pitch Type Match = Contact Boost
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      Topps Refractor Tiers & Rarity
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Cards feature 5 authentic Topps-licensed parallel treatments:
                    <br />• <strong>Base</strong>: Classic standard cardstock.
                    <br />• <strong>Rainbow Foil</strong>: Spectrum holographic sheen.
                    <br />• <strong>Sapphire Edition</strong>: Deep royal blue chromium (/25).
                    <br />• <strong>Gold Wave</strong>: Golden ripple foil parallel (/50).
                    <br />• <strong>Atomic Mojo</strong>: Geometric diamond fractured refractor (/10).
                    <br />• <strong>Superfractor</strong>: True 1-of-1 liquid gold circular swirl foil!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      5-in-7 Days Login Streak Tracker
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Log in at least 5 days out of every rolling 7-day window to earn milestone rewards: +1,500 Franchise Points, +5 Vending Tokens, and guaranteed Foil Pack Rip keys. Missing up to 2 days maintains your streak!
                  </p>
                  <span className="text-[10px] font-mono text-amber-400 block font-bold">
                    Check your streak icon in the top header anytime.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      26-Man Big Board & Depth Chart
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Modeled after Sleeper draft grids. Every card represents a position on your 26-man roster (C, 1B, 2B, 3B, SS, OF, DH, SP, RP). Swap starters, promote hot bench players, and balance your batting order between high-contact speedsters and power sluggers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏛️</span>
                    <h5 className="font-display font-black text-white text-sm uppercase">
                      162-Game Franchise Season Simulator
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Take your squad through a complete 162-game MLB season campaign. Play key clutch at-bats in real time, simulate series against classic rivals (Yankees, Dodgers, Giants, A's), and capture the World Series championship ring!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. COMMUNITY FORUM ================= */}
          {activeTab === 'COMMUNITY_FORUM' && (
            <div className="space-y-4 animate-fade-in pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 border border-purple-500/30 p-4 rounded-2xl">
                <div>
                  <h4 className="text-sm sm:text-base font-display font-black text-white uppercase flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Camden Yards Community Forum & Trade Block
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Connect with fellow collectors, share 1/1 Superfractor pulls, discuss small-ball strategies, and celebrate Orioles history.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-xs uppercase flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Start Discussion
                  </button>
                </div>
              </div>

              {/* Forum Channels Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
                {[
                  { id: 'ALL', label: 'All Channels' },
                  { id: 'CAMDEN_CLUBHOUSE', label: '🏟️ Camden Clubhouse' },
                  { id: 'CARD_SHOW_TRADES', label: '🎴 Card Show & Trades' },
                  { id: 'CHOP_STRATEGY', label: '⚡ Chop Strategy' },
                  { id: 'ORIOLES_LORE', label: '📜 Orioles Lore' }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setForumCategory(ch.id);
                      setForumPosts(forumService.getPosts(ch.id));
                    }}
                    className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                      forumCategory === ch.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* New Post Modal/Form */}
              {showNewPostForm && (
                <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-black text-white text-xs uppercase">
                      New Community Discussion
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="text-slate-500 hover:text-white text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Topic Title..."
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-500 outline-none focus:border-purple-500"
                    />

                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-purple-500"
                    >
                      <option value="CAMDEN_CLUBHOUSE">🏟️ Camden Clubhouse</option>
                      <option value="CARD_SHOW_TRADES">🎴 Card Show & Trades</option>
                      <option value="CHOP_STRATEGY">⚡ Chop Strategy</option>
                      <option value="ORIOLES_LORE">📜 Orioles Lore</option>
                    </select>
                  </div>

                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts, pull stories, or small-ball tips..."
                    rows={3}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder:text-slate-500 outline-none focus:border-purple-500"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Posting as <strong className="text-purple-400">@{userProfile?.username || 'Player'}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-xs uppercase flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Thread
                    </button>
                  </div>
                </form>
              )}

              {/* Forum Posts List */}
              <div className="space-y-3">
                {forumPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 border border-purple-500/40 flex items-center justify-center text-sm shadow">
                            {post.avatarIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono">
                                {post.author}
                              </span>
                              {post.authorBadge && (
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                                  {post.authorBadge}
                                </span>
                              )}
                              {post.isPinned && (
                                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                                  📌 PINNED
                                </span>
                              )}
                            </div>
                            <span className="text-[9.5px] font-mono text-slate-500">
                              {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUpvote(post.id)}
                          className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-purple-300 border border-slate-800 flex items-center gap-1 text-xs font-mono transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                          <span className="font-bold">{post.upvotes}</span>
                        </button>
                      </div>

                      <h4 className="text-sm font-display font-bold text-white mb-1.5">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-purple-400">#{tag}</span>
                        ))}
                      </div>
                      <span>{post.repliesCount} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. SIGN UP / LOG IN ================= */}
          {activeTab === 'SIGNUP_LOGIN' && (
            <div className="space-y-4 animate-fade-in max-w-xl mx-auto py-2">
              <div className="text-center space-y-1 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                  👤
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase">
                  Player Account & Authentication
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Link your account via Google or Apple to synchronize cards, 5-in-7 streaks, and custom handles.
                </p>
              </div>

              {/* Status Message */}
              {authMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-mono text-center animate-fade-in">
                  {authMsg}
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleAppleLogin}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all border border-white/20 shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.43-6-9.14-10.74-19.58-14.22-31.33-3.48-11.75-5.22-23.01-5.22-33.78 0-14.14 3.59-26.06 10.77-35.77 7.18-9.71 16.5-14.67 27.97-14.88 5.43 0 11.24 1.34 17.43 4.02 6.19 2.68 10.02 4.08 11.49 4.2 1.63-.12 5.74-1.63 12.33-4.53 6.59-2.9 12.35-4.14 17.28-3.73 12.83.65 23.36 5.56 31.6 14.73-11.31 6.85-16.85 16.22-16.63 28.12.22 9.35 3.73 17.27 10.53 23.77 6.8 6.5 14.84 10.22 24.12 11.16-2.07 6.31-4.78 12.42-8.13 18.32zM119.22 33.15c0-7.18 2.61-13.92 7.83-20.22 5.22-6.3 11.75-10.33 19.59-12.1-1.09 7.4-4.02 14.14-8.79 20.22-4.77 6.08-10.99 10.12-18.63 12.1z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Username Handle Customizer */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    Custom Player Handle
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    Policy: Once monthly · Max 5/yr
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                      @
                    </span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="YourHandle"
                      maxLength={18}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateUsername}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-black text-xs uppercase"
                  >
                    Save Handle
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  Active account: <strong className="text-slate-300">@{userProfile?.username}</strong> · Linked Provider: <strong className="text-cyan-400 uppercase">{userProfile?.linkedProviders?.length ? userProfile.linkedProviders.join(', ') : 'Guest'}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
