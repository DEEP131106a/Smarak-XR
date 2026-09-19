import React from 'react';
import type { CultureFilter, CultureRegion } from '../../types/culture';
import { Filter, Sparkles, Video, Music, Image as ImageIcon, Box, Smartphone, Star } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  filter: CultureFilter;
  regions: CultureRegion[];
  onChange: (updated: CultureFilter) => void;
}

export const FilterBar: React.FC<Props> = ({ filter, regions, onChange }) => {
  const handleRegionChange = (r: string) => {
    triggerHaptic('tap');
    onChange({ ...filter, region: r });
  };

  const handleMediaTypeChange = (m: CultureFilter['mediaType']) => {
    triggerHaptic('tap');
    onChange({ ...filter, mediaType: m });
  };

  const toggleArOnly = () => {
    triggerHaptic('tap');
    onChange({ ...filter, arEnabled: !filter.arEnabled });
  };

  const toggleFeaturedOnly = () => {
    triggerHaptic('tap');
    onChange({ ...filter, featured: !filter.featured });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-4 rounded-2xl glass-royal border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
      {/* Region Selector Pill Group */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
        <span className="text-xs font-semibold text-amber-300/70 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Region:</span>
        </span>
        <button
          onClick={() => handleRegionChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
            !filter.region || filter.region === 'all'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'bg-amber-500/10 text-amber-200 border border-amber-500/20 hover:bg-amber-500/20'
          }`}
        >
          All Regions
        </button>
        {regions.map((reg) => (
          <button
            key={reg.id}
            onClick={() => handleRegionChange(reg.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
              filter.region === reg.id
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 text-amber-200 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            {reg.name}
          </button>
        ))}
      </div>

      {/* Media Type & AR Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={toggleArOnly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
            filter.arEnabled
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg'
              : 'bg-indigo-950/60 text-amber-300 border border-indigo-400/30 hover:bg-indigo-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>AR Available</span>
        </button>

        <button
          onClick={toggleFeaturedOnly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
            filter.featured
              ? 'bg-amber-400 text-black shadow-lg'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Featured Only</span>
        </button>
      </div>
    </div>
  );
};
