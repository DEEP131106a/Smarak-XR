import React from 'react';
import type { CultureItem } from '../../types/culture';
import {
  MapPin,
  Smartphone,
  Video,
  Music,
  Box,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  item: CultureItem;
  onClick: (category: string, id: string) => void;
}

export const CultureCard: React.FC<Props> = ({ item, onClick }) => {
  const handleClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(587.33, 1.2);
    onClick(item.category, item.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-3xl glass-royal border border-amber-500/20 hover:border-amber-500/60 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-xl overflow-hidden"
    >
      {/* Thumbnail or Fallback Header Banner */}
      <div className="relative w-full h-48 bg-gradient-to-br from-amber-950/60 to-orange-950/40 border-b border-amber-500/15 overflow-hidden flex items-center justify-center">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-amber-400/80 p-4 text-center">
            <Sparkles className="w-10 h-10 mb-2 animate-pulse" />
            <span className="font-cinzel text-sm font-bold">{item.title}</span>
          </div>
        )}

        {/* Region Pill */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{item.region}</span>
        </div>

        {/* AR Pill if AR enabled */}
        {item.arEnabled && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
            <Smartphone className="w-3 h-3" />
            <span>AR Ready</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1">
            {item.category}
          </div>
          <h3 className="text-xl font-cinzel font-black text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-gray-300/80 font-outfit leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>
        </div>

        {/* Media Availability Badges */}
        <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400/70 text-xs">
            {item.videos && item.videos.length > 0 && <Video className="w-3.5 h-3.5" />}
            {item.audio && item.audio.length > 0 && <Music className="w-3.5 h-3.5" />}
            {item.model3d && <Box className="w-3.5 h-3.5" />}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
