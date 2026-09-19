import React from 'react';
import type { CulturalEntry } from '../../types/explore';
import { MediaPlaceholder } from './MediaPlaceholder';
import {
  Utensils,
  Sparkles,
  Music,
  Shirt,
  Palette,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface CardProps {
  item: CulturalEntry;
}

// 1. Food Card (Rule 14)
export const FoodCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Utensils className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
          Food & Culinary
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-xs font-semibold text-amber-400/90 mb-3">{item.subtitle}</p>
      )}

      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>

      {item.ingredients && item.ingredients.length > 0 && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20">
          <span className="text-[10px] font-bold text-emerald-300 block mb-1.5 uppercase">Key Ingredients:</span>
          <div className="flex flex-wrap gap-1.5">
            {item.ingredients.map((ing, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-medium">
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    <MediaPlaceholder type="image" title={`${item.title} Food Image Coming Soon`} />
  </div>
);

// 2. Dance Card (Rule 15)
export const DanceCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
          Traditional Dance
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-xs font-semibold text-amber-300/90 mb-3">{item.subtitle}</p>
      )}

      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>

      {item.history && (
        <p className="text-xs text-amber-100/70 font-outfit mb-4 italic">
          "{item.history}"
        </p>
      )}
    </div>

    <MediaPlaceholder
      type="video"
      title={item.videoPlaceholderText || 'Dance Video Coming Soon'}
      subtitle="Performance footage will appear here once published from the backend."
    />
  </div>
);

// 3. Music Card (Rule 16)
export const MusicCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Music className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">
          Music & Soundscapes
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-xs font-semibold text-rose-300/90 mb-3">{item.subtitle}</p>
      )}

      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>
    </div>

    <MediaPlaceholder
      type="audio"
      title={item.audioPlaceholderText || 'Soundscape Track'}
      subtitle="Disabled audio player placeholder"
    />
  </div>
);

// 4. Clothing Card (Rule 17)
export const ClothingCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Shirt className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest">
          Attire & Weaves
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-xs font-semibold text-purple-200/90 mb-3">{item.subtitle}</p>
      )}

      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>
    </div>

    <MediaPlaceholder type="image" title={`${item.title} Textile Photo Coming Soon`} />
  </div>
);

// 5. Crafts Card (Rule 18)
export const CraftCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
          <Palette className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
          Arts & Crafts
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>
    </div>

    <MediaPlaceholder type="image" title={`${item.title} Craft Photo Coming Soon`} />
  </div>
);

// 6. Festival Card (Rule 19)
export const FestivalCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
          Festivals & Fairs
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>
    </div>

    <MediaPlaceholder type="image" title={`${item.title} Celebration Photo Coming Soon`} />
  </div>
);

// 7. Story Card (Rule 20)
export const StoryCard: React.FC<CardProps> = ({ item }) => (
  <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
          Local Legend & Story
        </span>
      </div>

      <h4 className="text-xl font-cinzel font-black text-white mb-1">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-xs font-semibold text-cyan-300/90 mb-3">{item.subtitle}</p>
      )}

      <p className="text-xs text-gray-200/90 font-outfit leading-relaxed mb-4">
        {item.description}
      </p>
    </div>

    <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs font-bold text-cyan-300">
      <span>Read Story →</span>
      <span className="text-[10px] text-gray-400">Oral History</span>
    </div>
  </div>
);
