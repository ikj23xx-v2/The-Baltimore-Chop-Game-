// src/types/fanSystem.ts

export type FanRelationshipStatus = 'PENDING' | 'FOLLOWING' | 'MUTUAL_FRIEND' | 'MUTUAL_BLOCKED';

export interface FanConnection {
  connectionId: string;
  followerUserId: string;
  targetUserId: string;
  status: FanRelationshipStatus;
  createdAt: number;
}

export interface SuspiciousFanActivityReport {
  reportId: string;
  reporterUserId: string;
  suspectUserId: string;
  flagReason: 
    | 'ABNORMAL_TRADE_VELOCITY' 
    | 'COLLUSION_SUSPECTED' 
    | 'SHARED_IP_SUBNET' 
    | 'RAPID_WASH_TRADING';
  detectedAt: number;
  status: 'PENDING_REVIEW' | 'FLAGGED_GM' | 'DISMISSED';
}

/**
 * Audits a follower/friend interaction and flags suspicious behavior 
 * if mutual accounts show signs of wash trading or alt-account collusion.
 */
export function auditFanNetworkActivity(
  suspectUserId: string,
  followerUserId: string,
  suspectIp: string,
  followerIp: string,
  tradeFrequencyPerDay: number
): SuspiciousFanActivityReport | null {
  // 1. Check for IP/Network Collusion between connected friends/followers
  if (suspectIp === followerIp && suspectIp !== '') {
    return {
      reportId: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      reporterUserId: 'SYSTEM_AUTOPILOT',
      suspectUserId,
      flagReason: 'SHARED_IP_SUBNET',
      detectedAt: Date.now(),
      status: 'FLAGGED_GM',
    };
  }

  // 2. Check for abnormal trade velocity between connected fans
  if (tradeFrequencyPerDay > 5) {
    return {
      reportId: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      reporterUserId: 'SYSTEM_AUTOPILOT',
      suspectUserId,
      flagReason: 'ABNORMAL_TRADE_VELOCITY',
      detectedAt: Date.now(),
      status: 'FLAGGED_GM',
    };
  }

  return null;
}
