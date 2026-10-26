// src/theme/teamThemeSystem.ts
import { TEAM_JERSEY_THEMES, TeamId, JerseyThemeConfig } from '../data/teamJerseyThemes';

export interface DynamicTeamThemeVariables {
  '--team-primary': string;
  '--team-piping': string;
  '--team-font-fill': string;
  '--team-font-stroke': string;
  '--team-font-family': string;
  '--team-pinstripe-opacity': string;
  '--team-glow': string;
}

export function getTeamThemeVariables(teamId: TeamId): DynamicTeamThemeVariables {
  const config: JerseyThemeConfig = TEAM_JERSEY_THEMES[teamId] || TEAM_JERSEY_THEMES['BAL'];

  return {
    '--team-primary': config.primaryColor,
    '--team-piping': config.pipingColor,
    '--team-font-fill': config.fontFillColor,
    '--team-font-stroke': config.fontStrokeColor,
    '--team-font-family': config.fontFamily,
    '--team-pinstripe-opacity': config.hasPinstripes ? '0.18' : '0',
    '--team-glow': `${config.pipingColor}40`,
  };
}

export function getTeamJerseyStyle(teamId: TeamId): React.CSSProperties {
  const vars = getTeamThemeVariables(teamId);
  return vars as unknown as React.CSSProperties;
}
