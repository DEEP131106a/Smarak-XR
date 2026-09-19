import React from 'react';
import { Video, Image as ImageIcon, Volume2, Play, AlertCircle } from 'lucide-react';

interface Props {
  type: 'video' | 'image' | 'audio';
  title?: string;
  subtitle?: string;
}

export const MediaPlaceholder: React.FC<Props> = ({ type, title, subtitle }) => {
  if (type === 'video') {
    return (
      <div className="w-full aspect-video rounded-2xl glass-royal border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden group">
        <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
          <Video className="w-7 h-7" />
        </div>
        <h4 className="text-base font-cinzel font-bold text-white mb-1">
          {title || 'Video Coming Soon'}
        </h4>
        <p className="text-xs text-amber-200/70 font-outfit max-w-sm">
          {subtitle || 'Cultural performance footage will appear here once uploaded from the backend.'}
        </p>
        <span className="mt-3 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
          Media Placeholder
        </span>
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="w-full p-4 rounded-2xl glass-royal border border-amber-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-cinzel font-bold text-white">
              {title || 'Audio Soundscape'}
            </h5>
            <p className="text-xs text-amber-200/70 font-outfit">
              {subtitle || 'Audio player placeholder'}
            </p>
          </div>
        </div>
        <button
          disabled
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/50 text-xs font-semibold cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Audio Coming Soon</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-2xl glass-royal border border-amber-500/20 flex flex-col items-center justify-center p-4 text-center">
      <ImageIcon className="w-8 h-8 text-amber-400/60 mb-2" />
      <span className="text-xs font-semibold text-amber-200/70">
        {title || 'Image Coming Soon'}
      </span>
    </div>
  );
};
