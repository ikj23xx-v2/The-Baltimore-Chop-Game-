// src/components/ChopHouseForum.tsx
import React, { useState } from 'react';
import { soundManager } from '../services/audio';
import { JerseyAvatar } from './JerseyAvatar';
import { CommunityRankBadge } from './CommunityRankBadge';
import { UserProfileModal } from './UserProfileModal';
import { UserPublicProfile } from '../types/userProfile';
import { TeamId } from '../data/teamJerseyThemes';

export interface ForumThread {
  id: string;
  category: 'DUGOUT' | 'TRADING_BLOCK' | 'STRATEGY' | 'BULLPEN';
  title: string;
  content?: string;
  author: string;
  teamId: TeamId;
  jerseyNumber: number | string;
  authorXp: number;
  authorBadge?: string;
  repliesCount: number;
  upvotes: number;
  createdAt: string;
  userProfile: UserPublicProfile;
}

export interface ManagerLeaderboardItem {
  rank: number;
  managerId: string;
  username: string;
  favoriteTeam: TeamId;
  jerseyNumber: number | string;
  wins: number;
  losses: number;
  chopIndexPoints: number;
  divisionTier: string;
  userProfile: UserPublicProfile;
}

const SAMPLE_LEADERBOARD: ManagerLeaderboardItem[] = [
  {
    rank: 1,
    managerId: 'mgr-001',
    username: 'CamdenBirdWatcher',
    favoriteTeam: 'BAL',
    jerseyNumber: 8,
    wins: 62,
    losses: 18,
    chopIndexPoints: 14820,
    divisionTier: 'HOF_ELITE',
    userProfile: {
      userId: 'mgr-001',
      username: 'CamdenBirdWatcher',
      favoriteTeam: 'BAL',
      jerseyNumber: 8,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 80,
        record: { wins: 62, losses: 18 },
        teamBattingAvg: 0.312,
        teamOPS: 0.942,
        chopSinglesHit: 144,
        teamERA: 2.78,
        clutchWinRate: 0.78,
        topWARPlayerName: 'Cal Ripken Jr. (1991)'
      },
      gamerTags: {
        psn: 'Camden_Iron8',
        xboxGamertag: 'RipkenChop',
        discordHandle: 'BirdLand#1991'
      },
      trophies: {
        hasWorldSeriesCrown: true,
        trueRainbowCompleted: true
      }
    }
  },
  {
    rank: 2,
    managerId: 'mgr-002',
    username: 'BronxBomber99',
    favoriteTeam: 'NYY',
    jerseyNumber: 99,
    wins: 58,
    losses: 22,
    chopIndexPoints: 13950,
    divisionTier: 'ALL_STAR',
    userProfile: {
      userId: 'mgr-002',
      username: 'BronxBomber99',
      favoriteTeam: 'NYY',
      jerseyNumber: 99,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 80,
        record: { wins: 58, losses: 22 },
        teamBattingAvg: 0.298,
        teamOPS: 0.915,
        chopSinglesHit: 108,
        teamERA: 3.12,
        clutchWinRate: 0.71,
        topWARPlayerName: 'Babe Ruth (1923)'
      },
      gamerTags: {
        psn: 'JudgeDugout_NY',
        discordHandle: 'PinstripePower#27'
      },
      trophies: {
        hasWorldSeriesCrown: true,
        trueRainbowCompleted: false
      }
    }
  },
  {
    rank: 3,
    managerId: 'mgr-003',
    username: 'LeadOffKing',
    favoriteTeam: 'OAK',
    jerseyNumber: 24,
    wins: 55,
    losses: 25,
    chopIndexPoints: 12840,
    divisionTier: 'ALL_STAR',
    userProfile: {
      userId: 'mgr-003',
      username: 'LeadOffKing',
      favoriteTeam: 'OAK',
      jerseyNumber: 24,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 80,
        record: { wins: 55, losses: 25 },
        teamBattingAvg: 0.325,
        teamOPS: 0.885,
        chopSinglesHit: 188,
        teamERA: 3.45,
        clutchWinRate: 0.69,
        topWARPlayerName: 'Rickey Henderson (1985)'
      },
      gamerTags: {
        xboxGamertag: 'SpeedDemonRickey',
        steamId: 'HendersonGreenGold'
      },
      trophies: {
        hasWorldSeriesCrown: false,
        trueRainbowCompleted: true
      }
    }
  },
  {
    rank: 4,
    managerId: 'mgr-004',
    username: 'AceHurler',
    favoriteTeam: 'BOS',
    jerseyNumber: 45,
    wins: 53,
    losses: 27,
    chopIndexPoints: 11920,
    divisionTier: 'VETERAN',
    userProfile: {
      userId: 'mgr-004',
      username: 'AceHurler',
      favoriteTeam: 'BOS',
      jerseyNumber: 45,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 80,
        record: { wins: 53, losses: 27 },
        teamBattingAvg: 0.285,
        teamOPS: 0.840,
        chopSinglesHit: 92,
        teamERA: 2.45,
        clutchWinRate: 0.74,
        topWARPlayerName: 'Pedro Martinez (1999)'
      },
      gamerTags: {
        psn: 'FenwayPitchMaster',
        discordHandle: 'PedroChangeup#45'
      },
      trophies: {
        hasWorldSeriesCrown: false,
        trueRainbowCompleted: false
      }
    }
  },
  {
    rank: 5,
    managerId: 'mgr-005',
    username: 'ChavezRavine_Vin',
    favoriteTeam: 'LAD',
    jerseyNumber: 22,
    wins: 51,
    losses: 29,
    chopIndexPoints: 11450,
    divisionTier: 'VETERAN',
    userProfile: {
      userId: 'mgr-005',
      username: 'ChavezRavine_Vin',
      favoriteTeam: 'LAD',
      jerseyNumber: 22,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 80,
        record: { wins: 51, losses: 29 },
        teamBattingAvg: 0.292,
        teamOPS: 0.865,
        chopSinglesHit: 115,
        teamERA: 2.95,
        clutchWinRate: 0.65,
        topWARPlayerName: 'Sandy Koufax (1965)'
      },
      gamerTags: {
        psn: 'KoufaxCurve_LA',
        xTwitter: '@DodgerChopVin'
      },
      trophies: {
        hasWorldSeriesCrown: true,
        trueRainbowCompleted: false
      }
    }
  }
];

const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'th-1',
    category: 'TRADING_BLOCK',
    title: 'Just listed a 1985 Rickey Henderson Mojo (/150) under corridor floor!',
    content: 'Looking for a 1991 Cal Ripken Jr. Heritage or a Pedro Martinez Sapphire. Hit me up in the trade lobby.',
    author: 'LeadOffKing',
    teamId: 'OAK',
    jerseyNumber: 24,
    authorXp: 35000,
    authorBadge: 'Gold Wave Collector',
    repliesCount: 14,
    upvotes: 28,
    createdAt: '12m ago',
    userProfile: SAMPLE_LEADERBOARD[2].userProfile
  },
  {
    id: 'th-2',
    category: 'STRATEGY',
    title: 'How to manage pitcher stamina in 3-game quick-sim series',
    content: 'Do not burn your ace in Game 1 if your bullpen has fresh relievers. The fatigue decay algorithm in Showdown is unforgiving.',
    author: 'AceHurler',
    teamId: 'BOS',
    jerseyNumber: 45,
    authorXp: 18000,
    authorBadge: 'Gauntlet Master',
    repliesCount: 9,
    upvotes: 19,
    createdAt: '1h ago',
    userProfile: SAMPLE_LEADERBOARD[3].userProfile
  },
  {
    id: 'th-3',
    category: 'DUGOUT',
    title: 'Orioles franchise single-season WAR rankings: Cal Ripken 1991 is untouchable',
    content: '11.5 bRef WAR with 34 HRs, .323 AVG, and platinum shortstop defense. What an unbelievable season.',
    author: 'CamdenBirdWatcher',
    teamId: 'BAL',
    jerseyNumber: 8,
    authorXp: 160000,
    authorBadge: 'Chop Founder',
    repliesCount: 22,
    upvotes: 45,
    createdAt: '3h ago',
    userProfile: SAMPLE_LEADERBOARD[0].userProfile
  },
  {
    id: 'th-4',
    category: 'BULLPEN',
    title: 'Optimal pitch-counter sequences against high-spin power pitchers',
    content: 'Sit Dead Red on the first pitch, then switch to Contact Protect with 2 strikes. Maximizes RE24 run value.',
    author: 'BronxBomber99',
    teamId: 'NYY',
    jerseyNumber: 99,
    authorXp: 95000,
    authorBadge: 'RE24 Tactician',
    repliesCount: 7,
    upvotes: 16,
    createdAt: '5h ago',
    userProfile: SAMPLE_LEADERBOARD[1].userProfile
  }
];

export const ChopHouseForum: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [threads, setThreads] = useState<ForumThread[]>(INITIAL_THREADS);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserPublicProfile | null>(null);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'DUGOUT' | 'TRADING_BLOCK' | 'STRATEGY' | 'BULLPEN'>('DUGOUT');
  const [newContent, setNewContent] = useState('');

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playButtonClick();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundManager.playRefractorShine();

    const userProfile: UserPublicProfile = {
      userId: `user-${Date.now()}`,
      username: 'You (Manager)',
      favoriteTeam: 'BAL',
      jerseyNumber: 16,
      currentSeasonStats: {
        seasonNumber: 1,
        gamesPlayed: 32,
        record: { wins: 22, losses: 10 },
        teamBattingAvg: 0.288,
        teamOPS: 0.865,
        chopSinglesHit: 44,
        teamERA: 3.10,
        clutchWinRate: 0.72,
        topWARPlayerName: 'Cal Ripken Jr. (1991)'
      },
      gamerTags: {
        discordHandle: 'ChopManager#01'
      },
      trophies: {
        hasWorldSeriesCrown: false,
        trueRainbowCompleted: false
      }
    };

    const newThread: ForumThread = {
      id: `th-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      content: newContent,
      author: 'You (Manager)',
      teamId: 'BAL',
      jerseyNumber: 16,
      authorXp: 12500,
      authorBadge: 'Active Manager',
      repliesCount: 0,
      upvotes: 1,
      createdAt: 'Just now',
      userProfile
    };

    setThreads([newThread, ...threads]);
    setNewTitle('');
    setNewContent('');
    setShowNewThreadModal(false);
  };

  const filteredThreads = activeCategory === 'ALL'
    ? threads
    : threads.filter(t => t.category === activeCategory);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-5 text-slate-100 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-amber-400 flex items-center gap-2">
              🥩 THE CHOP HOUSE
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
              Community Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
            The community clubhouse for <em>The Baltimore Chop</em>. Share strategy, trade cards, and inspect manager leaderboards with authentic SVG jersey avatars.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setShowNewThreadModal(true);
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-transform shadow-lg flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Start Discussion</span>
          </button>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-mono">
        {['ALL', 'DUGOUT', 'TRADING_BLOCK', 'STRATEGY', 'BULLPEN', 'LEADERBOARD'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              soundManager.playButtonClick();
              setActiveCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
            }`}
          >
            {cat === 'LEADERBOARD' && <span>🏆</span>}
            <span>{cat.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* VIEW: LEADERBOARD TABLE */}
      {activeCategory === 'LEADERBOARD' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-display font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <span>🏆</span> Franchise Manager Rankings
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Click any manager to view their authentic SVG jersey avatar, line score, and linked gamer tags.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
              Season 1 Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3 text-center w-12">Rank</th>
                  <th className="p-3">Manager & Franchise</th>
                  <th className="p-3 hidden sm:table-cell">Tier</th>
                  <th className="p-3 text-right">Chop Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {SAMPLE_LEADERBOARD.map((entry) => (
                  <tr
                    key={entry.managerId}
                    onClick={() => {
                      soundManager.playButtonClick();
                      setSelectedUserProfile(entry.userProfile);
                    }}
                    className="cursor-pointer hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="p-3 text-center font-bold text-amber-400">{entry.rank}</td>
                    <td className="p-3 flex items-center gap-3">
                      {/* Dynamic Jersey Avatar */}
                      <JerseyAvatar
                        teamId={entry.favoriteTeam}
                        username={entry.username}
                        jerseyNumber={entry.jerseyNumber}
                        size="sm"
                      />
                      <div>
                        <span className="font-bold text-slate-100 hover:text-amber-300">
                          {entry.username}
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {entry.wins}W - {entry.losses}L
                        </p>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-bold">
                        {entry.divisionTier.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-amber-300 font-bold">
                      {entry.chopIndexPoints.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW: FORUM THREAD FEED */
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                soundManager.playButtonClick();
                setSelectedUserProfile(thread.userProfile);
              }}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors cursor-pointer group shadow-sm"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {/* Author Jersey Avatar */}
                <div className="shrink-0 pt-0.5">
                  <JerseyAvatar
                    teamId={thread.teamId}
                    username={thread.author}
                    jerseyNumber={thread.jerseyNumber}
                    size="sm"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {thread.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      by <strong className="text-slate-200 group-hover:text-amber-300">{thread.author}</strong>
                    </span>
                    <CommunityRankBadge xp={thread.authorXp} showTitle={false} />
                    {thread.authorBadge && (
                      <span className="text-[9.5px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                        {thread.authorBadge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">· {thread.createdAt}</span>
                  </div>

                  <h3 className="font-display font-black text-sm text-slate-100 group-hover:text-amber-300 transition-colors uppercase leading-snug">
                    {thread.title}
                  </h3>

                  {thread.content && (
                    <p className="text-xs font-mono text-slate-400 line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 shrink-0 self-end sm:self-center">
                <span className="px-2 py-1 rounded bg-slate-800/60 border border-white/5">
                  💬 {thread.repliesCount}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleUpvote(thread.id, e)}
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 border border-white/5 transition-colors flex items-center gap-1 font-bold"
                  title="Upvote post"
                >
                  <span>▲</span> {thread.upvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Start New Discussion Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewThreadModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-base font-display font-black text-amber-400 uppercase mb-3 flex items-center gap-2">
              <span>🥩</span> Post New Chop House Thread
            </h3>
            <form onSubmit={handleCreateThread} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="DUGOUT">Dugout General</option>
                  <option value="TRADING_BLOCK">Trading Block</option>
                  <option value="STRATEGY">Strategy & Sabermetrics</option>
                  <option value="BULLPEN">Bullpen & Pitching</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">THREAD TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Best batting gloves for high leverage showdowns..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">ANALYSIS / MESSAGE</label>
                <textarea
                  rows={4}
                  placeholder="Share details, trade offer, or analytical breakdown..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black uppercase tracking-wider shadow"
                >
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile Modal on Click */}
      <UserProfileModal
        profile={selectedUserProfile}
        isOpen={Boolean(selectedUserProfile)}
        onClose={() => setSelectedUserProfile(null)}
      />
    </div>
  );
};
