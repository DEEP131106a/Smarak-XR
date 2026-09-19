import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { MAP_LOCATIONS } from '../../data/heritageAliveData';
import { INDIA_MAP_DATA } from '../../data/indiaMapSvgData';
import { getCityById } from '../../data/cityData';
import type { MapPinLocation } from '../../types/heritageAlive';
import { triggerHaptic } from '../../utils/haptics';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onCitySelect?: (cityId: string) => void;
}

export const HeritageMap: React.FC<Props> = ({ onCitySelect }) => {
  const [selectedPin, setSelectedPin] = useState<MapPinLocation | null>(MAP_LOCATIONS[0]);
  const activeCityData = selectedPin ? getCityById(selectedPin.id) : null;
  const { t, language } = useLanguage();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <Compass className="w-4 h-4" />
          <span>{t('map.badge')}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          {t('map.title1')} <span className="heritage-gold-text">{t('map.title2')}</span>
        </h1>
        <p className="text-lg text-stone-400">
          “{t('map.subtitle')}”
        </p>
      </div>

      {/* Map Container Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stylized SVG Map Display (Left 7 Cols) */}
        <div className="lg:col-span-7 glass-heritage p-6 rounded-3xl border border-amber-500/20 relative min-h-[540px] shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2 z-10">
            <span className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-widest">
              <Navigation className="w-3.5 h-3.5" /> {t('map.interactive')}
            </span>
            <span className="bg-stone-900 px-3 py-1 rounded-full border border-stone-800 text-amber-300 font-semibold">
              {t('map.activeHubs')}
            </span>
          </div>

          {/* Authentic India SVG Map */}
          <div className="relative w-full h-[480px] sm:h-[520px] flex items-center justify-center my-2 select-none">
            <svg
              viewBox={INDIA_MAP_DATA.viewBox}
              className="w-full h-full max-h-[500px] drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="activeStateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#c85a32" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* All 36 Indian States and Union Territories */}
              <g id="india-states">
                {INDIA_MAP_DATA.locations.map((loc) => {
                  const isCityState = MAP_LOCATIONS.some((p) => p.stateId === loc.id);
                  const isSelected = selectedPin?.stateId === loc.id;
                  return (
                    <path
                      key={loc.id}
                      id={`state-${loc.id}`}
                      d={loc.path}
                      onClick={() => {
                        const matchingPin = MAP_LOCATIONS.find((p) => p.stateId === loc.id);
                        if (matchingPin) {
                          triggerHaptic('tap');
                          setSelectedPin(matchingPin);
                        }
                      }}
                      className={`transition-all duration-300 ${
                        isCityState ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      style={{
                        fill: isSelected
                          ? 'url(#activeStateGrad)'
                          : isCityState
                          ? '#1e1a16'
                          : '#121110',
                        stroke: isSelected
                          ? '#f59e0b'
                          : isCityState
                          ? 'rgba(212, 175, 55, 0.6)'
                          : 'rgba(120, 113, 108, 0.25)',
                        strokeWidth: isSelected ? 1.6 : isCityState ? 1.0 : 0.5,
                      }}
                    >
                      <title>{loc.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* City Markers for the 6 Cities */}
              {MAP_LOCATIONS.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                const coords = pin.svgCoords || {
                  x: (pin.coords.x / 100) * 612,
                  y: (pin.coords.y / 100) * 696,
                };
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    onClick={() => {
                      triggerHaptic('tap');
                      setSelectedPin(pin);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on active city */}
                    {isSelected && (
                      <circle
                        r="18"
                        className="fill-amber-400/30 animate-ping"
                      />
                    )}

                    <circle
                      r={isSelected ? '10' : '6.5'}
                      className={`transition-all duration-300 ${
                        isSelected
                          ? 'fill-amber-400 stroke-stone-950 stroke-2'
                          : 'fill-stone-950 stroke-amber-400/90 stroke-2 group-hover:fill-amber-500'
                      }`}
                    />
                    <circle
                      r={isSelected ? '4' : '2.5'}
                      className={isSelected ? 'fill-stone-950' : 'fill-amber-300'}
                    />

                    {/* City Name Label Pill */}
                    <g
                      transform="translate(0, -15)"
                      className={`transition-all duration-200 pointer-events-none ${
                        isSelected
                          ? 'opacity-100 scale-110'
                          : 'opacity-85 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                    >
                      <rect
                        x="-38"
                        y="-12"
                        width="76"
                        height="16"
                        rx="8"
                        className={
                          isSelected
                            ? 'fill-amber-500 stroke-stone-950 stroke-1 shadow-lg'
                            : 'fill-stone-950/95 stroke-amber-500/40 stroke-1'
                        }
                      />
                      <text
                        x="0"
                        y="-1"
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        className={isSelected ? 'fill-stone-950 font-cinzel font-black' : 'fill-amber-200 font-cinzel'}
                      >
                        {language === 'hi' && pin.hindiName ? pin.hindiName : pin.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-center text-xs text-stone-500 italic z-10 pt-2 border-t border-stone-800/40">
            Click any city pin or highlighted state to inspect regional traditions.
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
                  <h2 className="text-3xl font-extrabold text-stone-100 mt-2">{language === 'hi' && activeCityData?.hindiName ? activeCityData.hindiName : selectedPin.name}</h2>
                  <p className="text-amber-400/90 text-sm font-semibold">{selectedPin.state}</p>
                </div>

                {activeCityData?.heroImage && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-amber-500/40 relative shadow-lg group">
                    <img
                      src={activeCityData.heroImage}
                      alt={selectedPin.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-2.5 left-3.5 right-3.5">
                      <p className="text-xs font-cinzel font-bold text-amber-200 line-clamp-1">
                        {activeCityData.tagline}
                      </p>
                    </div>
                  </div>
                )}

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
                      <span>{t('map.explore')}</span>
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
                    <span>{t('map.preserve')} {language === 'hi' && activeCityData?.hindiName ? activeCityData.hindiName : selectedPin.name}</span>
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
