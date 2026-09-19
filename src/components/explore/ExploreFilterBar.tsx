import React from 'react';
import type { ExploreFilter, StateItem } from '../../types/explore';
import { Filter, Smartphone, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  filter: ExploreFilter;
  states: StateItem[];
  onChange: (updated: ExploreFilter) => void;
}

const CATEGORY_OPTIONS: { id: ExploreFilter['category']; label: string }[] = [
  { id: 'all', label: 'All Experiences' },
  { id: 'places', label: 'Monuments & Places' },
  { id: 'food', label: 'Food & Cuisine' },
  { id: 'dance', label: 'Dance & Music' },
  { id: 'clothing', label: 'Attire & Textiles' },
  { id: 'crafts', label: 'Arts & Crafts' },
  { id: 'festivals', label: 'Festivals' },
  { id: 'stories', label: 'Local Stories' },
];

export const ExploreFilterBar: React.FC<Props> = ({ filter, states, onChange }) => {
  const handleStateChange = (stId: string) => {
    triggerHaptic('tap');
    onChange({ ...filter, stateId: stId });
  };

  const handleCategoryChange = (cat: ExploreFilter['category']) => {
    triggerHaptic('tap');
    onChange({ ...filter, category: cat });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 p-4 rounded-2xl glass-royal border border-amber-500/20 space-y-3">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
        <span className="text-xs font-semibold text-amber-300/70 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Category:</span>
        </span>
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              (!filter.category && cat.id === 'all') || filter.category === cat.id
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                : 'bg-amber-500/10 text-amber-200 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            {cat.id === 'ar' && <Smartphone className="w-3 h-3 inline mr-1" />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* State Selector Quick Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar border-t border-amber-500/10 pt-2">
        <span className="text-xs font-semibold text-amber-300/70 shrink-0 mr-1">
          State:
        </span>
        <button
          onClick={() => handleStateChange('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
            !filter.stateId || filter.stateId === 'all'
              ? 'bg-amber-400 text-black'
              : 'bg-black/40 text-amber-200 hover:text-white border border-white/10'
          }`}
        >
          All States
        </button>
        {states.map((st) => (
          <button
            key={st.id}
            onClick={() => handleStateChange(st.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              filter.stateId === st.id
                ? 'bg-amber-400 text-black'
                : 'bg-black/40 text-amber-200 hover:text-white border border-white/10'
            }`}
          >
            {st.name}
          </button>
        ))}
      </div>
    </div>
  );
};
