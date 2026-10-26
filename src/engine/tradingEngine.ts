// src/engine/tradingEngine.ts

export interface TradeOffer {
  tradeId: string;
  senderUserId: string;
  recipientUserId: string;
  offeredCardIds: string[];
  requestedCardIds: string[];
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  createdAt: number;
  tradeFeeTokens?: number;
}

export interface TradeNegotiationState {
  activeOffers: TradeOffer[];
  history: TradeOffer[];
}
