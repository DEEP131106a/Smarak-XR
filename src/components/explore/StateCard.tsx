import React from 'react';
import type { StateItem } from '../../types/explore';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  stateItem: StateItem;
  onClick: (stateId: string) => void;
}

export const StateCard: React.FC<Props> = ({ stateItem, onClick }) => {
  const handleClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523.25, 1.2);
    onClick(stateItem.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-3xl glass-royal border border-amber-500/20 hover:border-amber-500/60 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{stateItem.region} India • {stateItem.capital}</span>
          </div>
          {stateItem.hindiName && (
            <span className="font-yatra text-xs text-amber-400/80">
              {stateItem.hindiName}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-cinzel font-black text-white group-hover:text-amber-300 transition-colors mb-1">
          {stateItem.name}
        </h3>

        <p className="text-xs font-semibold text-amber-400/90 tracking-wider mb-3">
          {stateItem.tagline}
        </p>

        <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed font-outfit line-clamp-3 mb-6">
          {stateItem.description}
        </p>
      </div>

      <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
        <span className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Explore State</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-amber-500/20 group-hover:bg-amber-500 flex items-center justify-center text-amber-300 group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
