import React from 'react';
import {
  Sparkles,
  Music,
  Utensils,
  Shirt,
  Palette,
  Calendar,
  BookOpen,
  FolderOpen,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  category?: string;
  customTitle?: string;
  customMessage?: string;
  onExploreOtherClick?: () => void;
  onBackToCultureClick?: () => void;
}

const CATEGORY_EMPTY_MESSAGES: Record<
  string,
  { title: string; message: string; icon: React.FC<{ className?: string }> }
> = {
  dance: {
    title: 'No dance experiences yet',
    message:
      'Traditional dance performances and living rhythm experiences will appear here once they are added to the Smarak XR cultural library.',
    icon: Sparkles,
  },
  music: {
    title: 'No music experiences yet',
    message:
      'Traditional instruments, soundscapes and musical traditions will appear here once they are added to the Smarak XR cultural library.',
    icon: Music,
  },
  food: {
    title: 'No food experiences yet',
    message:
      'Regional dishes, preparation methods and culinary traditions will appear here once they are added to the Smarak XR cultural library.',
    icon: Utensils,
  },
  clothing: {
    title: 'No clothing experiences yet',
    message:
      'Traditional attire, weaves and textile craftsmanship will appear here once they are added to the Smarak XR cultural library.',
    icon: Shirt,
  },
  crafts: {
    title: 'No arts & crafts experiences yet',
    message:
      'Traditional art forms, stone sculpture and handmade craft marvels will appear here once they are added to the Smarak XR cultural library.',
    icon: Palette,
  },
  festivals: {
    title: 'No festival experiences yet',
    message:
      'Sacred festival celebrations and regional traditions will appear here once they are added to the Smarak XR cultural library.',
    icon: Calendar,
  },
  stories: {
    title: 'No cultural stories yet',
    message:
      'Cultural stories, ancient legends and regional folklore will appear here once they are added to the Smarak XR cultural library.',
    icon: BookOpen,
  },
  featured: {
    title: 'Cultural experiences will appear here soon',
    message:
      'Featured regional traditions, performances, and living culture will automatically populate when published from the backend.',
    icon: FolderOpen,
  },
};

export const EmptyState: React.FC<Props> = ({
  category,
  customTitle,
  customMessage,
  onExploreOtherClick,
  onBackToCultureClick,
}) => {
  const config = category && CATEGORY_EMPTY_MESSAGES[category]
    ? CATEGORY_EMPTY_MESSAGES[category]
    : {
        title: customTitle || 'No cultural experiences found',
        message:
          customMessage ||
          'Content will appear here once published from the Smarak XR backend cultural library.',
        icon: FolderOpen,
      };

  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-8 sm:p-12 rounded-3xl glass-royal border border-amber-500/20 text-center flex flex-col items-center justify-center shadow-2xl">
      {/* Icon Badge */}
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-lg text-amber-400">
        <Icon className="w-10 h-10 animate-pulse" />
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white mb-3">
        {customTitle || config.title}
      </h3>

      {/* Message */}
      <p className="text-sm sm:text-base text-amber-100/70 font-outfit max-w-lg leading-relaxed mb-8">
        {customMessage || config.message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onBackToCultureClick && (
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523, 1.2);
              onBackToCultureClick();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl glass-royal hover:border-amber-500/60 text-white font-cinzel font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to Culture</span>
          </button>
        )}

        {onExploreOtherClick && (
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(600, 1.2);
              onExploreOtherClick();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Other Categories</span>
          </button>
        )}
      </div>

      {/* Backend Integration Note */}
      <div className="mt-8 text-[11px] font-semibold text-amber-400/50 uppercase tracking-widest border-t border-amber-500/10 pt-4">
        Smarak XR Backend Pipeline Ready • Direct Database Dynamic Feed
      </div>
    </div>
  );
};
