// src/components/UserProfileModal.tsx
import React, { useState } from 'react';
import { UserPublicProfile } from '../types/userProfile';
import { JerseyAvatar } from './JerseyAvatar';
import { FanRelationshipStatus, auditFanNetworkActivity, SuspiciousFanActivityReport } from '../types/fanSystem';
import { soundManager } from '../services/audio';

interface UserProfileModalProps {
  profile: UserPublicProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ profile, isOpen, onClose }) => {
  const [fanStatus, setFanStatus] = useState<FanRelationshipStatus>('FOLLOWING');
  const [securityAuditReport, setSecurityAuditReport] = useState<SuspiciousFanActivityReport | null>(null);

  if (!isOpen || !profile) return null;

  const { username, favoriteTeam, jerseyNumber, currentSeasonStats, gamerTags, trophies, userId } = profile;

  const handleToggleFanStatus = () => {
    soundManager.playButtonClick();
    if (fanStatus === 'FOLLOWING') {
      setFanStatus('MUTUAL_FRIEND');
      soundManager.playRefractorShine();
    } else if (fanStatus === 'MUTUAL_FRIEND') {
      setFanStatus('PENDING');
    } else {
      setFanStatus('FOLLOWING');
    }
  };

  const handleRunSecurityAudit = () => {
    soundManager.playButtonClick();
    // Audit fan network interaction with system autopilot
    const report = auditFanNetworkActivity(
      userId,
      'current-logged-in-mgr',
      '192.168.1.100',
      '10.0.0.45',
      2 // Normal trade velocity (<= 5 per day)
    );
    setSecurityAuditReport(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Profile Header & Jersey Showcase */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <JerseyAvatar
            teamId={favoriteTeam}
            username={username}
            jerseyNumber={jerseyNumber}
            size="lg"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-amber-400 tracking-wide">{username}</h2>
            </div>
            <p className="text-xs text-slate-400">Franchise GM #{jerseyNumber}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {trophies.hasWorldSeriesCrown && (
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded-full font-bold">
                  👑 WS Champion
                </span>
              )}
              {trophies.trueRainbowCompleted && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                  🌈 Rainbow Collector
                </span>
              )}
            </div>

            {/* Fan Relationship Action */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFanStatus}
                className={`text-[10px] font-mono font-bold px-3 py-1 rounded-xl border transition-all ${
                  fanStatus === 'MUTUAL_FRIEND'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow'
                    : fanStatus === 'FOLLOWING'
                    ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {fanStatus === 'MUTUAL_FRIEND' ? '🤝 Mutual Fan' : fanStatus === 'FOLLOWING' ? '⭐ Following' : '+ Follow Fan'}
              </button>
              <button
                type="button"
                onClick={handleRunSecurityAudit}
                className="text-[10px] font-mono text-slate-400 hover:text-amber-300 underline"
                title="Run anti-collusion & wash trading check"
              >
                🛡️ Audit Security
              </button>
            </div>
          </div>
        </div>

        {/* Security Audit Banner if checked */}
        {securityAuditReport ? (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs font-mono text-red-300">
            ⚠️ Security Flag: {securityAuditReport.flagReason} ({securityAuditReport.status})
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-[10.5px] font-mono text-emerald-400 flex items-center justify-between">
            <span>🛡️ Anti-Collusion Audit: Clear</span>
            <span className="text-slate-500">Verified Network</span>
          </div>
        )}

        {/* Active Season Sabermetrics */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Season {currentSeasonStats.seasonNumber} Line Score
          </h3>
          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono text-center">
            <div>
              <p className="text-[10px] text-slate-500">RECORD</p>
              <p className="text-sm font-bold text-slate-200">
                {currentSeasonStats.record.wins}-{currentSeasonStats.record.losses}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">TEAM OPS</p>
              <p className="text-sm font-bold text-amber-300">
                .{Math.round(currentSeasonStats.teamOPS * 1000)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">TEAM ERA</p>
              <p className="text-sm font-bold text-emerald-400">
                {currentSeasonStats.teamERA.toFixed(2)}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800/60 col-span-3 flex justify-between px-2 text-xs">
              <span className="text-slate-400">Chop Singles Hit:</span>
              <span className="font-bold text-slate-200">{currentSeasonStats.chopSinglesHit}</span>
            </div>
          </div>
        </div>

        {/* Connected Gamer Tags & Social Handles */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Connected Network Tags
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {gamerTags.psn && (
              <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg flex items-center justify-between">
                <span className="text-blue-400 font-bold">PSN</span>
                <span className="font-mono text-slate-200">{gamerTags.psn}</span>
              </div>
            )}
            {gamerTags.xboxGamertag && (
              <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg flex items-center justify-between">
                <span className="text-emerald-400 font-bold">XBOX</span>
                <span className="font-mono text-slate-200">{gamerTags.xboxGamertag}</span>
              </div>
            )}
            {gamerTags.discordHandle && (
              <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg flex items-center justify-between col-span-2">
                <span className="text-indigo-400 font-bold">Discord</span>
                <span className="font-mono text-slate-200">{gamerTags.discordHandle}</span>
              </div>
            )}
            {!gamerTags.psn && !gamerTags.xboxGamertag && !gamerTags.discordHandle && (
              <p className="text-xs text-slate-500 italic col-span-2">No gamer tags connected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
