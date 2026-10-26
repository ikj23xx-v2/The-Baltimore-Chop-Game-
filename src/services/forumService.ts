export interface ForumPost {
  id: string;
  category: 'CAMDEN_CLUBHOUSE' | 'CARD_SHOW_TRADES' | 'CHOP_STRATEGY' | 'ORIOLES_LORE';
  title: string;
  author: string;
  authorBadge?: string;
  avatarIcon: string;
  content: string;
  timestamp: number;
  upvotes: number;
  repliesCount: number;
  isPinned?: boolean;
  tags: string[];
}

const STORAGE_KEY = 'the_baltimore_chop_forum_posts';

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    category: 'CAMDEN_CLUBHOUSE',
    title: '⚾ Welcome to Camden Yards! Official Baltimore Chop Season 1 Kickoff (11/1)',
    author: 'BirdlandGM',
    authorBadge: 'COMMISSIONER',
    avatarIcon: '👑',
    content: 'Season 1 officially opens 11/1! Remember that contact hitters with downward strike zone predictions trigger the signature Baltimore Chop infield single. Good luck chasing the 1/1 Superfractors!',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    upvotes: 42,
    repliesCount: 15,
    isPinned: true,
    tags: ['Season1', 'Welcome', 'OriolesMagic']
  },
  {
    id: 'post-2',
    category: 'CARD_SHOW_TRADES',
    title: '🔥 Just ripped a 1/1 Superfractor Cal Ripken Jr. from the Diamond Foil Pack!',
    author: 'IronManFan8',
    authorBadge: 'VIP COLLECTOR',
    avatarIcon: '💎',
    content: 'Unbelievable pull! The liquid gold wave refractor effect when tilting the phone gyroscope looks unreal. Has anyone pulled the Jackie Robinson or Babe Ruth 1/1 yet?',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    upvotes: 38,
    repliesCount: 9,
    tags: ['Superfractor', 'Ripken', 'DiamondCollect']
  },
  {
    id: 'post-3',
    category: 'CHOP_STRATEGY',
    title: '🎯 Small-ball mastery: Why you should pair Down-In Sinker guesses with Rickey Henderson',
    author: 'SmallBallSavvy',
    avatarIcon: '⚡',
    content: 'If the opposing pitcher likes sinkers or low splitters, setting your strike zone to DOWN_MID or DOWN_IN with Baltimore Chop active almost guarantees an infield rocket that bounces 30 feet over third base!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    upvotes: 27,
    repliesCount: 6,
    tags: ['Strategy', 'SmallBall', 'Henderson']
  },
  {
    id: 'post-4',
    category: 'ORIOLES_LORE',
    title: '📜 The 1890s Origin: How Wee Willie Keeler & John McGraw invented the Baltimore Chop',
    author: 'CamdenHistorian',
    authorBadge: 'HISTORIAN',
    avatarIcon: '🏛️',
    content: 'At Union Park in Baltimore, groundskeeper Tom Murphy packed the dirt around home plate hard with Georgia clay. Keeler and McGraw would deliberately chop down on the ball so it bounced 30 feet into the air, beating the throw to first every time!',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    upvotes: 56,
    repliesCount: 12,
    isPinned: true,
    tags: ['History', 'WeeWillieKeeler', 'UnionPark']
  }
];

class ForumService {
  private posts: ForumPost[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.posts = INITIAL_POSTS;
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.posts = JSON.parse(stored);
      } else {
        this.posts = INITIAL_POSTS;
        this.save();
      }
    } catch {
      this.posts = INITIAL_POSTS;
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.posts));
    } catch {
      // storage full
    }
  }

  getPosts(category?: string): ForumPost[] {
    if (!category || category === 'ALL') {
      return [...this.posts].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.timestamp - a.timestamp);
    }
    return this.posts
      .filter((p) => p.category === category)
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.timestamp - a.timestamp);
  }

  upvote(id: string): number {
    const post = this.posts.find((p) => p.id === id);
    if (post) {
      post.upvotes += 1;
      this.save();
      return post.upvotes;
    }
    return 0;
  }

  createPost(post: Omit<ForumPost, 'id' | 'timestamp' | 'upvotes' | 'repliesCount'>): ForumPost {
    const newPost: ForumPost = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: Date.now(),
      upvotes: 1,
      repliesCount: 0
    };
    this.posts = [newPost, ...this.posts];
    this.save();
    return newPost;
  }
}

export const forumService = new ForumService();
