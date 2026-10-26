// src/components/LofiPlayerToggle.tsx
import React, { useState, useEffect } from 'react';
import { lofiBaseballAudio } from '../audio/lofiBaseballAudio';
import { Radio, Volume2, VolumeX } from 'lucide-react';

export const LofiPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(lofiBaseballAudio.getStatus());
  }, []);

  const handleToggle = () => {
    const active = lofiBaseballAudio.toggle();
    setIsPlaying(active);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isPlaying ? 'Mute Ballpark Lofi Radio' : 'Tune Into Ballpark Lofi Soundscape (Vinyl & Organ)'}
      className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold select-none ${
        isPlaying
          ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400' : 'text-slate-500'}`} />
      <span className="hidden sm:inline">
        {isPlaying ? 'LOFI BALLPARK: ON' : 'LOFI RADIO'}
      </span>
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-slate-500" />
      )}
    </button>
  );
};
