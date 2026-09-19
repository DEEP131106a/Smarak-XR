import React from 'react';
import type { CultureRegion } from '../../types/culture';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  region: CultureRegion;
  onClick: (regionId: string) => void;
}

export const RegionCard: React.FC<Props> = ({ region, onClick }) => {
  const handleClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(440, 1.0);
    onClick(region.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl glass-royal border border-amber-500/20 hover:border-amber-500/50 p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-cinzel font-bold text-white group-hover:text-amber-300 transition-colors">
              {region.name}
            </h4>
            {region.hindiName && (
              <span className="font-yatra text-xs text-amber-400/80">
                {region.hindiName}
              </span>
            )}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>

      <p className="text-xs text-gray-300/80 leading-relaxed font-outfit line-clamp-2">
        {region.description || 'Explore living cultural heritage, traditional arts, food, and music.'}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300/80">
        <Compass className="w-3.5 h-3.5 text-amber-400" />
        <span>Explore Region</span>
      </div>
    </div>
  );
};
