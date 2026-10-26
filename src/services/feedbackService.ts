import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { BetaFeedbackSubmission } from '../types/feedback';

const LOCAL_STORAGE_KEY = 'the_baltimore_chop_beta_feedback_history';

/**
 * Submit beta scouting feedback to Firestore and cache locally.
 */
export async function submitBetaFeedback(
  feedbackData: Omit<BetaFeedbackSubmission, 'id' | 'status' | 'createdAt'>
): Promise<BetaFeedbackSubmission> {
  const newSubmission: BetaFeedbackSubmission = {
    ...feedbackData,
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'NEW',
    createdAt: Date.now(),
  };

  // Try Firestore persistence
  let firestoreId: string | null = null;
  try {
    const docRef = await addDoc(collection(db, 'beta_feedback'), {
      userId: feedbackData.userId,
      userEmail: feedbackData.userEmail,
      username: feedbackData.username,
      category: feedbackData.category,
      subject: feedbackData.subject,
      description: feedbackData.description,
      rating: feedbackData.rating,
      seasonProgress: feedbackData.seasonProgress,
      deviceInfo: feedbackData.deviceInfo,
      status: 'NEW',
      createdAt: newSubmission.createdAt,
    });
    firestoreId = docRef.id;
    newSubmission.id = docRef.id;
  } catch (err) {
    console.warn('[Beta Feedback] Firestore save deferred/offline, saving to local ledger:', err);
  }

  // Cache locally
  saveToLocalFeedbackLedger(newSubmission);

  return newSubmission;
}

/**
 * Retrieve cached local feedback submissions.
 */
export function getLocalFeedbackSubmissions(): BetaFeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to read local feedback:', err);
    return [];
  }
}

/**
 * Save feedback entry to local storage history.
 */
function saveToLocalFeedbackLedger(submission: BetaFeedbackSubmission) {
  try {
    const current = getLocalFeedbackSubmissions();
    const updated = [submission, ...current].slice(0, 30);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save feedback locally:', err);
  }
}
