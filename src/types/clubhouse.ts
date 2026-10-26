// src/types/clubhouse.ts

export interface ClubhouseGroup {
  clubhouseId: string;
  teamName: string; // e.g., "Baltimore Chop Squad"
  founderUserId: string;
  members: string[]; // Max 26 members matching a 26-man roster
  createdAt: number;
}

export interface AIMChatMessage {
  messageId: string;
  clubhouseId: string;
  senderUserId: string;
  senderUsername: string;
  text: string;
  timestamp: number;
  isAwayMessage?: boolean;
}

export const MAX_CLUBHOUSE_MEMBERS = 26;

export function validateClubhouseJoin(currentMemberCount: number): { allowed: boolean; error?: string } {
  if (currentMemberCount >= MAX_CLUBHOUSE_MEMBERS) {
    return {
      allowed: false,
      error: 'The Clubhouse has reached its 26-man roster capacity limit.',
    };
  }
  return { allowed: true };
}
