import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FeedbackCategory, BetaFeedbackSubmission } from '../types/feedback';
import { getLocalFeedbackSubmissions } from '../services/feedbackService';

interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { uid: string; email: string; displayName?: string };
  seasonInfo: { seasonNumber: number; gamesPlayed: number; difficulty: string };
}

const CATEGORIES: { id: FeedbackCategory; label: string; icon: string }[] = [
  { id: 'BALANCE', label: 'Balance & Odds', icon: '⚖️' },
  { id: 'BUG', label: 'Bug Report', icon: '🐛' },
  { id: 'FEATURE_REQUEST', label: 'Feature Request', icon: '💡' },
  { id: 'CARD_ART', label: 'Card Art & Slabs', icon: '🃏' },
  { id: 'GENERAL', label: 'General / UX', icon: '💬' },
];

export const BetaFeedbackModal: React.FC<BetaFeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  seasonInfo,
}) => {
  const [category, setCategory] = useState<FeedbackCategory>('BALANCE');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionPayload: Omit<BetaFeedbackSubmission, 'id'> = {
      userId: currentUser?.uid || 'gm_guest',
      userEmail: currentUser?.email || 'spizike23@gmail.com',
      username: currentUser?.displayName || 'Baltimore GM',
      category,
      subject,
      description,
      rating,
      seasonProgress: {
        seasonNumber: seasonInfo?.seasonNumber ?? 1,
        gamesPlayed: seasonInfo?.gamesPlayed ?? 0,
        difficultyTier: seasonInfo?.difficulty ?? 'VETERAN',
      },
      deviceInfo: {
        platform: typeof navigator !== 'undefined' ? navigator.platform || 'Unknown OS' : 'Web',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser',
        viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
      },
      status: 'NEW',
      createdAt: Date.now(),
    };

    let docId = `fb_${Date.now()}`;

    try {
      const docRef = await addDoc(collection(db, 'beta_feedback'), submissionPayload);
      if (docRef?.id) {
        docId = docRef.id;
      }
    } catch (err) {
      console.warn('[Beta Feedback] Direct Firestore push deferred/offline. Storing locally:', err);
    }

    // Save to local cache as well
    try {
      const entry: BetaFeedbackSubmission = { ...submissionPayload, id: docId };
      const existing = getLocalFeedbackSubmissions();
      localStorage.setItem(
        'the_baltimore_chop_beta_feedback_history',
        JSON.stringify([entry, ...existing].slice(0, 30))
      );
    } catch {
      // Ignore local storage error
    }

    setLastSubmissionId(docId);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setSubject('');
    setDescription('');
    setCategory('BALANCE');
    setRating(5);
    setSubmitted(false);
  };

  const history = getLocalFeedbackSubmissions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-400 tracking-wide">
                BETA GM DISPATCH & SCOUTING FEEDBACK
              </h2>
              <p className="text-[10px] text-slate-400">
                Direct wire to The Baltimore Chop™ development & balance team
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xl">
              ⚾
            </div>
            <h3 className="text-xl font-black text-amber-400 tracking-wide">
              Scouting Report Received!
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thanks for the dispatch. Your report <span className="font-mono text-amber-300 text-[11px]">#{lastSubmissionId.slice(-6)}</span> has been securely logged to the GM desk for review and balance tuning.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                Send Another Dispatch
              </button>
              <button
                onClick={() => { resetForm(); onClose(); }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Back to Dugout
              </button>
            </div>
          </div>
        ) : showHistory ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Your Logged Dispatches ({history.length})
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                ← Back to Form
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No past dispatches found on this device.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{item.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Rating: {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 tracking-wider uppercase">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-2 rounded-xl font-bold text-[10px] border transition-all flex items-center gap-1.5 justify-center ${
                      category === cat.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black scale-[1.02]'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 tracking-wider uppercase">
                Overall Gameplay Experience Rating
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl">
                {([1, 2, 3, 4, 5] as const).map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-xl transition-transform hover:scale-125 focus:outline-none ${
                      rating >= star ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-[11px] font-bold text-slate-400 ml-auto">
                  {rating === 5 ? '⚾ Hall of Fame' : rating === 4 ? '🔥 All-Star' : rating === 3 ? '⚖️ Balanced' : rating === 2 ? '⚠️ Needs Tuning' : '🚨 Rough Bounce'}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 tracking-wider uppercase">
                Subject / Topic
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Sinker bounce timing vs All-Star CPU"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1 tracking-wider uppercase">
                Detailed Scouting Report
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, what felt great, or what needs tuning..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 resize-none"
              />
            </div>

            {/* Auto Tags & Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col text-[10px] text-slate-500 font-mono">
                <span>Auto-tags: Season {seasonInfo?.seasonNumber ?? 1} • Game {seasonInfo?.gamesPlayed ?? 0}</span>
                <span className="text-slate-600">Tier: {seasonInfo?.difficulty ?? 'VETERAN'} • User: {currentUser?.email || 'spizike23@gmail.com'}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    className="text-[10px] text-slate-400 hover:text-amber-400 transition-colors mr-2 underline"
                  >
                    Past Reports ({history.length})
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(251,191,36,0.25)] hover:scale-105"
                >
                  {isSubmitting ? 'Transmitting...' : 'Submit Dispatch'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
