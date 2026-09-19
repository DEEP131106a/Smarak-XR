import React from 'react';
import { Music, Volume2 } from 'lucide-react';

interface Props {
  audio?: string[];
  title?: string;
}

export const AudioPlayer: React.FC<Props> = ({ audio, title }) => {
  if (!audio || audio.length === 0) {
    return null; // Render NOTHING if no audio URL is provided by backend
  }

  return (
    <div className="w-full my-6 p-4 rounded-2xl glass-royal border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-5 h-5 text-amber-400" />
        <h4 className="text-base font-cinzel font-bold text-white">
          Audio & Soundscape Guide
        </h4>
      </div>

      <div className="space-y-3">
        {audio.map((audioUrl, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <Music className="w-5 h-5 text-amber-300 shrink-0" />
            <audio src={audioUrl} controls className="w-full h-10 accent-amber-500" />
          </div>
        ))}
      </div>
    </div>
  );
};
