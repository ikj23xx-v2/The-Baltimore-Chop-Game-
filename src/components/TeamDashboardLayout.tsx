// src/components/TeamDashboardLayout.tsx
import React from 'react';
import { TeamId, TEAM_JERSEY_THEMES } from '../data/teamJerseyThemes';
import { getTeamJerseyStyle } from '../theme/teamThemeSystem';

interface TeamDashboardLayoutProps {
  currentTeam: TeamId;
  children: React.ReactNode;
  onSelectTeam?: (team: TeamId) => void;
}

export const TeamDashboardLayout: React.FC<TeamDashboardLayoutProps> = ({
  currentTeam,
  children,
  onSelectTeam,
}) => {
  const theme = TEAM_JERSEY_THEMES[currentTeam] || TEAM_JERSEY_THEMES.BAL;
  const jerseyStyle = getTeamJerseyStyle(currentTeam);

  return (
    <div
      style={jerseyStyle}
      className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col transition-colors duration-500 font-sans relative overflow-x-hidden"
    >
      {/* Jersey Piping Ribbon Header */}
      <div 
        className="w-full h-1.5 shadow-md z-40"
        style={{ backgroundColor: 'var(--team-piping)' }}
      />

      {/* Subtle Team Pinstripes Background Overlay */}
      {theme.hasPinstripes && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${theme.pipingColor} 0px, ${theme.pipingColor} 1.5px, transparent 1.5px, transparent 32px)`,
            opacity: 'var(--team-pinstripe-opacity)'
          }}
        />
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* Jersey Piping Ribbon Footer */}
      <div 
        className="w-full h-1 shadow-inner z-40 mt-auto"
        style={{ backgroundColor: 'var(--team-piping)' }}
      />
    </div>
  );
};
