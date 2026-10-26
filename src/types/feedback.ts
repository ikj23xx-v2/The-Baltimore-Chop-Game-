export type FeedbackCategory = 'BUG' | 'BALANCE' | 'FEATURE_REQUEST' | 'CARD_ART' | 'GENERAL';
export type FeedbackStatus = 'NEW' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface BetaFeedbackSubmission {
  id: string;
  userId: string;
  userEmail: string;
  username: string;
  category: FeedbackCategory;
  subject: string;
  description: string;
  rating: 1 | 2 | 3 | 4 | 5; // Overall game rating
  seasonProgress: {
    seasonNumber: number;
    gamesPlayed: number;
    difficultyTier: string;
  };
  deviceInfo: {
    platform: string;
    userAgent: string;
    viewport: string;
  };
  status: FeedbackStatus;
  createdAt: number;
  adminNotes?: string;
}
