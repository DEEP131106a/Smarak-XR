import React, { useState } from 'react';
import { Music2, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

const AMBIENT_MUSIC_KEY = 'smarak_ambient_music';

export const AmbientMusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    const playing = soundEngine.toggleDrone();
    setIsPlaying(playing);
    try {
      localStorage.setItem(AMBIENT_MUSIC_KEY, playing ? 'on' : 'off');
    } catch {
      // Audio control still works when storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Turn off ambient heritage music' : 'Turn on ambient heritage music'}
      title={isPlaying ? 'Turn off ambient heritage music' : 'Turn on soft ambient heritage music'}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
        isPlaying
          ? 'border-amber-400/70 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/20'
          : 'border-[#d4af37]/30 bg-stone-950/30 text-gray-300 hover:border-amber-400/60 hover:text-amber-300'
      }`}
    >
      <Music2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
      {isPlaying ? <Volume2 className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-stone-950 text-emerald-300" /> : <VolumeX className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-stone-950 text-stone-500" />}
    </button>
  );
};
