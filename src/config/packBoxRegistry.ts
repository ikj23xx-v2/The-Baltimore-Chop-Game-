// src/config/packBoxRegistry.ts

export interface PackBoxItem {
  id: string;
  title: string;
  costTokens: number;
  boxAsset: string;
  packAsset: string;
  cardsPerBox: number;
}

export const PACK_BOX_REGISTRY: Record<string, PackBoxItem> = {
  STADIUM_CLUB_1992: {
    id: "chop_sc_1992",
    title: "Chop Stadium Club 1992 Series 1",
    costTokens: 750,
    boxAsset: "/assets/boxes/chop-stadium-club-box.png",
    packAsset: "/assets/packs/chop-stadium-club-pack.png",
    cardsPerBox: 24,
  },
  SERIES_1_2024: {
    id: "chop_s1_2024",
    title: "Chop 2024 Series 1 Hobby",
    costTokens: 1000,
    boxAsset: "/assets/boxes/chop-2024-s1-box.png",
    packAsset: "/assets/packs/chop-2024-s1-pack.png",
    cardsPerBox: 20,
  },
  FIELD_CLUB_2026: {
    id: "chop_fc_2026",
    title: "Chop Field Club 2026 Series 1",
    costTokens: 750,
    boxAsset: "/assets/boxes/chop-field-club-2026-hobby-box.png",
    packAsset: "/assets/packs/chop-stadium-club-pack.png",
    cardsPerBox: 24,
  }
};

