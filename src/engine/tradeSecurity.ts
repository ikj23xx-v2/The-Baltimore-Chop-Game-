// src/engine/tradeSecurity.ts
import { TradeOffer } from './tradingEngine';

export interface TradeSecurityReport {
  isSuspicious: boolean;
  flagReason?: string;
  severity: 'LOW' | 'HIGH' | 'CRITICAL';
}

export interface UserAccountContext {
  userId: string;
  ipAddress: string;
  deviceFingerprint: string;
  accountAgeDays: number;
}

export function auditTradeForSuspiciousActivity(
  trade: TradeOffer,
  senderContext: UserAccountContext,
  recipientContext: UserAccountContext,
  cardValues: { cardId: string; warRating: number; tier: string }[]
): TradeSecurityReport {
  
  // 1. Same IP / Device Subnet Check (Alt Account Collusion)
  if (senderContext.ipAddress === recipientContext.ipAddress || 
      senderContext.deviceFingerprint === recipientContext.deviceFingerprint) {
    return {
      isSuspicious: true,
      flagReason: 'Collusion Alert: Sender and recipient share identical IP address or hardware fingerprint (Alt Account Transfer).',
      severity: 'CRITICAL',
    };
  }

  // 2. Brand New Account Restriction
  if (senderContext.accountAgeDays < 3 || recipientContext.accountAgeDays < 3) {
    return {
      isSuspicious: true,
      flagReason: 'New Account Activity: One or both trading accounts were created less than 3 days ago.',
      severity: 'HIGH',
    };
  }

  // 3. Extreme Value Imbalance Check (Laundering high-tier cards for worthless base cards)
  const senderTotalWAR = cardValues
    .filter(c => trade.offeredCardIds.includes(c.cardId))
    .reduce((sum, c) => sum + c.warRating, 0);

  const recipientTotalWAR = cardValues
    .filter(c => trade.requestedCardIds.includes(c.cardId))
    .reduce((sum, c) => sum + c.warRating, 0);

  // If someone trades away a massive 10 WAR Superfractor for nothing
  if (senderTotalWAR > 15 && recipientTotalWAR < 2) {
    return {
      isSuspicious: true,
      flagReason: 'Value Imbalance: Highly asymmetric trade involving elite WAR cards for low-value assets.',
      severity: 'HIGH',
    };
  }

  return { isSuspicious: false, severity: 'LOW' };
}
