import React from 'react';
import type { CultureCategoryMeta } from '../../types/culture';
import {
  Sparkles,
  Music,
  Utensils,
  Shirt,
  Palette,
  Calendar,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  category: CultureCategoryMeta;
  onClick: (categoryRoute: string) => void;
  itemCount?: number;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Music,
  Utensils,
  Shirt,
  Palette,
  Calendar,
  BookOpen,
};

export const CategoryCard: React.FC<Props> = ({ category, onClick, itemCount = 0 }) => {
  const IconComponent = ICON_MAP[category.iconName] || HelpCircle;

  const handleClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523.25, 1.2);
    onClick(category.route);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-3xl glass-royal border border-amber-500/20 hover:border-amber-500/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-xl hover:shadow-amber-500/15 overflow-hidden"
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

      <div>
        {/* Category Icon Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.accentColor} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {itemCount > 0 ? `${itemCount} Experiences` : 'Backend Ready'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-cinzel font-black text-white group-hover:text-amber-300 transition-colors mb-1">
          {category.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs font-semibold text-amber-400/90 tracking-wider mb-3">
          {category.tagline}
        </p>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed font-outfit mb-6">
          {category.shortDescription}
        </p>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-4 border-t border-amber-500/15 text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
        <span>Explore {category.title}</span>
        <div className="w-8 h-8 rounded-full bg-amber-500/20 group-hover:bg-amber-500 flex items-center justify-center text-amber-300 group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
