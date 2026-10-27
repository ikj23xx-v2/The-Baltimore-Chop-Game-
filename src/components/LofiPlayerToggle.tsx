// src/components/LofiPlayerToggle.tsx
import React, { useState, useEffect } from 'react';
import { lofiBaseballAudio, LOFI_STATIONS, LofiStationId } from '../audio/lofiBaseballAudio';
import { Radio, Volume2, VolumeX, ChevronDown } from 'lucide-react';

export const LofiPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStationId, setCurrentStationId] = useState<LofiStationId>('CAMDEN_DUGOUT');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsPlaying(lofiBaseballAudio.getStatus());
    setCurrentStationId(lofiBaseballAudio.getStation());
  }, []);

  const handleToggle = () => {
    const active = lofiBaseballAudio.toggle();
    setIsPlaying(active);
  };

  const handleSelectStation = (stationId: LofiStationId) => {
    lofiBaseballAudio.setStation(stationId);
    setCurrentStationId(stationId);
    if (!isPlaying) {
      lofiBaseballAudio.start();
      setIsPlaying(true);
    }
    setIsDropdownOpen(false);
  };

  const currentStation = LOFI_STATIONS.find((s) => s.id === currentStationId) || LOFI_STATIONS[0];

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center rounded-full border border-slate-700 bg-slate-900/95 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={handleToggle}
          title={isPlaying ? 'Mute Lo-Fi Radio' : 'Tune Into Ballpark Lo-Fi Soundscape'}
          className={`px-3 py-1.5 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold select-none ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden sm:inline font-mono tracking-tight">
            {isPlaying ? currentStation.name : 'LO-FI RADIO'}
          </span>
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Select Lo-Fi Baseball Station"
          className="px-2 py-1.5 border-l border-slate-700 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-950/95 border border-amber-500/40 rounded-lg shadow-2xl p-2 z-50 backdrop-blur-md">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-slate-800 mb-1 flex items-center justify-between">
              <span>BALLPARK DIAL</span>
              <span className="text-[9px] text-slate-500">4 CHANNELS</span>
            </div>
            <div className="space-y-1">
              {LOFI_STATIONS.map((station) => {
                const isSelected = station.id === currentStationId;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => handleSelectStation(station.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex flex-col ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                      <span>{station.name}</span>
                      <span className="text-[9px] text-amber-400/80">{station.tempo}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 line-clamp-1">
                      {station.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

