import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Sparkles, X, ChevronRight, Compass } from 'lucide-react';
import { MAP_LOCATIONS } from '../../data/heritageAliveData';
import type { MapPinLocation } from '../../types/heritageAlive';

interface Props {
  onCitySelect?: (cityId: string) => void;
}

export const HeritageMap: React.FC<Props> = ({ onCitySelect }) => {
  const [selectedPin, setSelectedPin] = useState<MapPinLocation | null>(MAP_LOCATIONS[0]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <Compass className="w-4 h-4" />
          <span>Geo-Spatial Heritage Atlas</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Explore Culture <span className="heritage-gold-text">Around You</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Tap on cultural capitals across India to unveil sacred monuments, endangered folk art guilds, and regional culinary traditions.”
        </p>
      </div>

      {/* Map Container Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stylized SVG Map Display (Left 7 Cols) */}
        <div className="lg:col-span-7 glass-heritage p-6 rounded-3xl border border-amber-500/20 relative min-h-[480px] shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-4 z-10">
            <span className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-widest">
              <Navigation className="w-3.5 h-3.5" /> Interactive Map of India
            </span>
            <span className="bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
              6 Active Cultural Hubs
            </span>
          </div>

          {/* India SVG Graphic Outline Background */}
          <div className="relative w-full h-[400px] flex items-center justify-center my-4">
            <svg
              viewBox="0 0 600 600"
              className="w-full h-full opacity-30 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
            >
              {/* Stylized contour of India */}
              <path
                d="M 220 70 L 300 110 L 340 180 L 450 250 L 430 320 L 380 340 L 300 520 L 250 480 L 190 380 L 170 280 L 220 70 Z"
                className="stroke-amber-500/40 fill-amber-500/5 stroke-2"
              />
              <circle cx="300" cy="300" r="220" className="stroke-amber-500/10 stroke-1 stroke-dasharray-4" />
            </svg>

            {/* Pins positioned absolutely based on coords */}
            {MAP_LOCATIONS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{ left: `${pin.coords.x}%`, top: `${pin.coords.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    {isSelected && (
                      <span className="absolute w-10 h-10 rounded-full bg-amber-500/30 animate-ping" />
                    )}
                    <div
                      className={`p-2.5 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 scale-125 shadow-amber-500/50 ring-4 ring-amber-500/30'
                          : 'bg-stone-900 text-amber-400 border border-amber-500/40 hover:scale-110 hover:border-amber-400'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>

                    {/* Tooltip on pin hover */}
                    <div className="absolute top-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-stone-900/90 text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold z-30 shadow-lg">
                      {pin.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs text-stone-500 italic z-10">
            Click any pin to inspect nearby vanishing traditions and regional heritage hubs.
          </div>
        </div>

        {/* Pin Details Drawer/Card (Right 5 Cols) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedPin && (
              <motion.div
                key={selectedPin.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-heritage p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6"
              >
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {selectedPin.category}
                  </span>
                  <h2 className="text-3xl font-extrabold text-stone-100 mt-2">{selectedPin.name}</h2>
                  <p className="text-amber-400/90 text-sm font-semibold">{selectedPin.state}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Cultural Significance</h4>
                  <p className="text-stone-300 text-sm leading-relaxed">{selectedPin.significance}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Nearby Key Traditions</h4>
                  <div className="space-y-2">
                    {selectedPin.nearbyTraditions.map((trad, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-200 text-xs font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {trad}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">Documented ✓</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 space-y-3">
                  {onCitySelect && (
                    <button
                      onClick={() => onCitySelect(selectedPin.id)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c85a32] via-[#d4af37] to-[#e06d43] hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Explore Culture: Food, Dance & Stories</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const evt = new CustomEvent('open-preserve-modal');
                      window.dispatchEvent(evt);
                    }}
                    className="w-full py-2.5 rounded-xl glass-heritage border border-amber-500/30 hover:border-amber-400 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Preserve Story from {selectedPin.name}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
