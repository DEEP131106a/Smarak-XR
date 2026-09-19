import React from 'react';
import type { CityItem } from '../../types/explore';
import { MapPin, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  city: CityItem;
  onClick: (stateId: string, cityId: string) => void;
}

export const CityCard: React.FC<Props> = ({ city, onClick }) => {
  const handleClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(587.33, 1.2);
    onClick(city.stateId, city.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-3xl glass-royal border border-amber-500/20 hover:border-amber-500/60 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-xl overflow-hidden"
    >
      {/* Placeholder Image Banner */}
      <div className="relative w-full h-44 bg-gradient-to-br from-amber-950/60 to-orange-950/40 border-b border-amber-500/15 overflow-hidden flex items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
          <span className="font-cinzel text-base font-black text-white">{city.name}</span>
          <span className="text-[11px] text-amber-200/70">{city.stateName}</span>
        </div>

        {/* AR Pill if available */}
        {city.arEnabled && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
            <Smartphone className="w-3 h-3" />
            <span>3D/AR Ready</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xl font-cinzel font-black text-white group-hover:text-amber-300 transition-colors">
              {city.name}
            </h4>
            {city.hindiName && (
              <span className="font-yatra text-xs text-amber-400">
                {city.hindiName}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-300/80 font-semibold mb-2">
            {city.tagline}
          </p>
          <p className="text-xs text-gray-300/90 font-outfit leading-relaxed line-clamp-3 mb-4">
            {city.description}
          </p>
        </div>

        <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-white transition-colors">
          <span>Explore {city.name}</span>
          <div className="w-8 h-8 rounded-full bg-amber-500/20 group-hover:bg-amber-500 flex items-center justify-center text-amber-300 group-hover:text-black transition-all">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
