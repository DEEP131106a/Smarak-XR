import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Sparkles, ChevronRight, Compass, Search, X } from 'lucide-react';
import { MAP_LOCATIONS } from '../../data/heritageAliveData';
import { getCityById } from '../../data/cityData';
import type { MapPinLocation } from '../../types/heritageAlive';
import { triggerHaptic } from '../../utils/haptics';
import { useLanguage } from '../../i18n/LanguageContext';

const CITY_COORDINATES: Record<string, [number, number]> = {
  amritsar: [31.634, 74.8723],
  jaipur: [26.9124, 75.7873],
  dharamshala: [32.219, 76.3234],
  chandigarh: [30.7333, 76.7794],
  mumbai: [19.076, 72.8777],
  kolkata: [22.5726, 88.3639],
};

interface Props {
  onCitySelect?: (cityId: string) => void;
}

export const HeritageMap: React.FC<Props> = ({ onCitySelect }) => {
  const [selectedPin, setSelectedPin] = useState<MapPinLocation | null>(MAP_LOCATIONS[0]);
  const [mapSearch, setMapSearch] = useState('');
  const activeCityData = selectedPin ? getCityById(selectedPin.id) : null;
  const { t, language } = useLanguage();
  const matchingPins = useMemo(() => {
    const query = mapSearch.trim().toLowerCase();
    if (!query) return MAP_LOCATIONS;
    return MAP_LOCATIONS.filter((pin) =>
      `${pin.name} ${pin.state} ${pin.category} ${pin.nearbyTraditions.join(' ')}`
        .toLowerCase()
        .includes(query),
    );
  }, [mapSearch]);

  const selectPin = (pin: MapPinLocation) => {
    triggerHaptic('tap');
    setSelectedPin(pin);
    setMapSearch('');
  };

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

          <div className="relative z-20 mb-3">
            <Search className="absolute left-3 top-3 w-4 h-4 text-stone-500" aria-hidden="true" />
            <input
              type="search"
              value={mapSearch}
              onChange={(event) => setMapSearch(event.target.value)}
              placeholder="Search a city or state, e.g. Jaipur or Punjab"
              aria-label="Search cities or states on the heritage map"
              className="w-full rounded-xl border border-stone-700 bg-stone-950/90 py-2.5 pl-9 pr-10 text-sm text-white outline-none focus:border-amber-400"
            />
            {mapSearch && (
              <button
                type="button"
                aria-label="Clear map search"
                onClick={() => setMapSearch('')}
                className="absolute right-2 top-2 rounded-lg p-1 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {mapSearch && (
              <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-amber-500/30 bg-stone-950 shadow-2xl">
                {matchingPins.length > 0 ? matchingPins.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => selectPin(pin)}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-stone-200 hover:bg-amber-500/15"
                  >
                    <span className="font-semibold">{pin.name}</span>
                    <span className="text-xs text-amber-300">{pin.state}</span>
                  </button>
                )) : (
                  <p className="px-3 py-3 text-sm text-stone-400">No matching city or state found.</p>
                )}
              </div>
            )}
          </div>

          <div className="my-2 rounded-2xl overflow-hidden border border-amber-500/30 bg-stone-950">
            {(() => {
              const [lat, lon] = CITY_COORDINATES[selectedPin?.id || ''] || [22.5937, 78.9629];
              return (
                <>
                  <iframe
                    key={selectedPin?.id}
                    title="OpenStreetMap heritage locations"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 4}%2C${lat - 4}%2C${lon + 4}%2C${lat + 4}&layer=mapnik&marker=${lat}%2C${lon}`}
                    className="block w-full h-[360px] sm:h-[520px] border-0"
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=6/${lat}/${lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block border-t border-amber-500/20 px-3 py-2 text-center text-xs text-amber-300 hover:text-amber-200"
                  >
                    Open the interactive map
                  </a>
                </>
              );
            })()}
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
                  {(() => {
                    const coords = CITY_COORDINATES[selectedPin.id] || [20.5937, 78.9629];
                    const [lat, lon] = coords;
                    return (
                      <div className="rounded-2xl overflow-hidden border border-amber-500/20 bg-stone-950">
                        <iframe
                          title={`${selectedPin.name} exact OpenStreetMap location`}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.08}%2C${lat - 0.06}%2C${lon + 0.08}%2C${lat + 0.06}&layer=mapnik&marker=${lat}%2C${lon}`}
                          className="block w-full h-48 border-0"
                          loading="eager"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block px-3 py-2 text-xs text-amber-300 hover:text-amber-200"
                        >
                          Open exact location in OpenStreetMap
                        </a>
                      </div>
                    );
                  })()}
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
