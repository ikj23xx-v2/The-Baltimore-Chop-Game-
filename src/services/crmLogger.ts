// src/services/crmLogger.ts
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type IssueSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface CRMReportPayload {
  userId: string;
  username: string;
  issueCategory: 'SIMULATION_ERROR' | 'UI_RENDER' | 'MARKETPLACE_ANOMALY' | 'SYNC_DESYNC';
  severity: IssueSeverity;
  errorMessage: string;
  stackTrace?: string;
  gameContext: {
    season: number;
    seriesId?: number;
    activeScreen: string;
  };
}

export async function logIssueToCRM(payload: CRMReportPayload) {
  try {
    const docRef = await addDoc(collection(db, 'crm_issues'), {
      ...payload,
      status: 'OPEN',
      createdAt: serverTimestamp(),
    });
    console.info(`[CRM Logger] Issue logged with ID: ${docRef.id}`);
    return docRef.id;
  } catch (err) {
    console.warn('[CRM Logger] Failed to log issue to Firestore (client may be offline/unauthenticated):', err);
    // Also save in local storage for reliability if Firestore is unreachable
    try {
      const existing = JSON.parse(localStorage.getItem('chop_crm_cached_reports') || '[]');
      existing.push({ ...payload, clientTimestamp: Date.now() });
      localStorage.setItem('chop_crm_cached_reports', JSON.stringify(existing.slice(-20)));
    } catch {}
    return null;
  }
}
