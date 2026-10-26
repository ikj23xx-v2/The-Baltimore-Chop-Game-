// src/data/teamJerseyThemes.ts

export type TeamId = 'BAL' | 'NYY' | 'BOS' | 'CLE' | 'LAD' | 'DET' | 'OAK' | 'STL' | 'TOR' | 'PHI';

export interface JerseyThemeConfig {
  teamName: string;
  primaryColor: string;
  pipingColor: string;
  fontFillColor: string;
  fontStrokeColor: string;
  fontFamily: string;
  hasPinstripes?: boolean;
  pinstripeColor?: string;
}

export const TEAM_JERSEY_THEMES: Record<TeamId, JerseyThemeConfig> = {
  BAL: {
    teamName: 'Baltimore',
    primaryColor: '#000000',
    pipingColor: '#DF4601',
    fontFillColor: '#FFFFFF',
    fontStrokeColor: '#DF4601',
    fontFamily: '"Impact", "Arial Black", sans-serif',
  },
  NYY: {
    teamName: 'New York (AL)',
    primaryColor: '#FFFFFF',
    pipingColor: '#0C2340',
    fontFillColor: '#0C2340',
    fontStrokeColor: 'transparent',
    fontFamily: '"Courier New", Courier, monospace', // Classic stark block
    hasPinstripes: true,
    pinstripeColor: '#0C2340',
  },
  CLE: {
    teamName: 'Cleveland',
    primaryColor: '#00385D',
    pipingColor: '#E50022',
    fontFillColor: '#E50022',
    fontStrokeColor: '#FFFFFF',
    fontFamily: '"Trebuchet MS", "Arial Black", sans-serif',
  },
  BOS: {
    teamName: 'Boston',
    primaryColor: '#FFFFFF',
    pipingColor: '#BD3039',
    fontFillColor: '#BD3039',
    fontStrokeColor: '#0C2340',
    fontFamily: '"Impact", sans-serif',
  },
  LAD: {
    teamName: 'Los Angeles (NL)',
    primaryColor: '#FFFFFF',
    pipingColor: '#005A9C',
    fontFillColor: '#005A9C',
    fontStrokeColor: '#EF3E42',
    fontFamily: '"Brush Script MT", "Segoe Script", cursive',
  },
  DET: {
    teamName: 'Detroit',
    primaryColor: '#0C2340',
    pipingColor: '#FA4616',
    fontFillColor: '#FA4616',
    fontStrokeColor: '#FFFFFF',
    fontFamily: '"Palatino Linotype", "Book Antiqua", serif',
  },
  OAK: {
    teamName: 'Oakland/Sacramento',
    primaryColor: '#003831',
    pipingColor: '#EFB21E',
    fontFillColor: '#EFB21E',
    fontStrokeColor: '#FFFFFF',
    fontFamily: '"Arial Black", sans-serif',
  },
  STL: {
    teamName: 'St. Louis',
    primaryColor: '#C41E3A',
    pipingColor: '#0C2340',
    fontFillColor: '#FEDB00',
    fontStrokeColor: '#0C2340',
    fontFamily: '"Arial Black", sans-serif',
  },
  TOR: {
    teamName: 'Toronto',
    primaryColor: '#134A8E',
    pipingColor: '#E8291C',
    fontFillColor: '#FFFFFF',
    fontStrokeColor: '#1D2D5C',
    fontFamily: '"Impact", sans-serif',
  },
  PHI: {
    teamName: 'Philadelphia',
    primaryColor: '#E81828',
    pipingColor: '#002D72',
    fontFillColor: '#FFFFFF',
    fontStrokeColor: '#002D72',
    fontFamily: '"Brush Script MT", cursive',
  },
};
