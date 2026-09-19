import React, { useState } from 'react';
import type { PlaceToVisit } from '../../types/explore';
import { MapPin, Compass, Smartphone, X, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  place: PlaceToVisit;
  onOpenAR?: () => void;
}

export const PlacesToVisitCard: React.FC<Props> = ({ place, onOpenAR }) => {
  const [showModal, setShowModal] = useState(false);

  const handleExploreClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523.25, 1.2);
    setShowModal(true);
  };

  return (
    <>
      <div className="group rounded-3xl glass-royal border border-amber-500/20 hover:border-amber-500/60 p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 cursor-pointer shadow-lg overflow-hidden">
        {/* Image Placeholder */}
        <div className="w-full h-36 rounded-2xl bg-amber-950/40 border border-amber-500/20 mb-4 flex flex-col items-center justify-center p-3 text-center group-hover:border-amber-500/40 transition-colors">
          <Sparkles className="w-6 h-6 text-amber-400 mb-1 animate-pulse" />
          <span className="text-xs font-cinzel font-bold text-white line-clamp-1">
            {place.name}
          </span>
          <span className="text-[10px] text-amber-300/60 uppercase tracking-widest mt-1">
            {place.category}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-lg font-cinzel font-bold text-white group-hover:text-amber-300 transition-colors">
              {place.name}
            </h4>
            {place.arAvailable && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-black uppercase">
                <Smartphone className="w-3 h-3" />
                AR
              </span>
            )}
          </div>
          <p className="text-xs text-gray-300/80 font-outfit line-clamp-2 leading-relaxed mb-4">
            {place.shortDescription}
          </p>
        </div>

        <button
          onClick={handleExploreClick}
          className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Place</span>
        </button>
      </div>

      {/* Place Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 glass-royal border border-amber-500/40 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-gray-300 hover:text-white border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-44 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex flex-col items-center justify-center p-4 mb-4 text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
              <span className="font-cinzel text-lg font-black text-white">{place.name}</span>
              <span className="text-xs text-amber-300/70 capitalize">{place.category} Monument</span>
            </div>

            <h3 className="text-2xl font-cinzel font-black text-white mb-2">
              {place.name}
            </h3>

            <p className="text-sm text-amber-100/90 font-outfit leading-relaxed mb-6">
              {place.fullDescription || place.shortDescription}
            </p>

            <div className="flex gap-3">
              {place.arAvailable && onOpenAR && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    onOpenAR();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-cinzel font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch 3D AR View</span>
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl glass-royal text-white font-cinzel font-bold text-xs sm:text-sm cursor-pointer border border-amber-500/30 hover:border-amber-500/60"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
