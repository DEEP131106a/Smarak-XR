import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Sparkles, Shirt, Landmark, Utensils, Music, Heart, ChevronRight, Zap } from 'lucide-react';
import { TIME_MACHINE_LOCATIONS } from '../../data/heritageAliveData';
import type { TimeMachineEra } from '../../types/heritageAlive';

const ERAS: (1950 | 1980 | 2026 | 2050)[] = [1950, 1980, 2026, 2050];

export const TimeMachine: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('punjab');
  const [selectedYear, setSelectedYear] = useState<1950 | 1980 | 2026 | 2050>(1950);

  const currentLocation = TIME_MACHINE_LOCATIONS.find((loc) => loc.id === selectedLocationId) || TIME_MACHINE_LOCATIONS[0];
  const eraData: TimeMachineEra = currentLocation.eras[selectedYear];

  const getEraBadgeColor = (year: number) => {
    switch (year) {
      case 1950:
        return 'bg-amber-900/60 text-amber-200 border-amber-700/50';
      case 1980:
        return 'bg-amber-800/60 text-amber-100 border-amber-600/50';
      case 2026:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50';
      case 2050:
        return 'bg-purple-950/60 text-purple-300 border-purple-500/50';
      default:
        return 'bg-amber-900/60 text-amber-200 border-amber-700/50';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <Clock className="w-4 h-4" />
          <span>Interactive Temporal Explorer</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Culture <span className="heritage-gold-text">Time Machine</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Travel through the cultural timeline of a place. See how traditions evolve from the past, endure in the present, and reinvent themselves in the AI future.”
        </p>
      </div>

      {/* Location Selector Bar */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
        <span className="text-stone-400 text-sm font-medium flex items-center gap-1.5 mr-2">
          <MapPin className="w-4 h-4 text-amber-400" /> Select Region:
        </span>
        {TIME_MACHINE_LOCATIONS.map((loc) => {
          const active = loc.id === selectedLocationId;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                active
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 font-bold scale-105'
                  : 'glass-heritage text-stone-300 hover:text-white hover:border-amber-500/40'
              }`}
            >
              <span>{loc.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-stone-900/30 text-stone-950 font-semibold' : 'bg-stone-800 text-stone-400'}`}>
                {loc.state}
              </span>
            </button>
          );
        })}
      </div>

      {/* Region Tagline */}
      <div className="text-center mb-10">
        <p className="text-amber-400/90 text-sm italic font-serif tracking-wide">
          “{currentLocation.tagline}”
        </p>
      </div>

      {/* Interactive Timeline Slider Controls */}
      <div className="glass-heritage p-6 sm:p-8 rounded-2xl border border-amber-500/20 mb-12 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Select Era</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getEraBadgeColor(selectedYear)}`}>
            {selectedYear === 1950 && 'PAST • 1950'}
            {selectedYear === 1980 && 'TRANSITION • 1980'}
            {selectedYear === 2026 && 'PRESENT • 2026'}
            {selectedYear === 2050 && 'AI FUTURE • 2050'}
          </span>
        </div>

        {/* Year Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative z-10 mb-6">
          {ERAS.map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`py-3 sm:py-4 px-2 rounded-xl flex flex-col items-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-stone-900/60 hover:bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                <span className="text-lg sm:text-2xl font-black">{yr}</span>
                <span className={`text-[10px] sm:text-xs font-medium mt-1 ${isSelected ? 'text-stone-950/90' : 'text-stone-400'}`}>
                  {yr === 1950 && 'Past Era'}
                  {yr === 1980 && 'Boom Era'}
                  {yr === 2026 && 'Today'}
                  {yr === 2050 && 'AI Vision'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Rail */}
        <div className="w-full bg-stone-900 rounded-full h-2 relative overflow-hidden border border-stone-800">
          <div
            className="bg-gradient-to-r from-amber-600 via-amber-400 to-purple-500 h-full transition-all duration-500 rounded-full"
            style={{
              width:
                selectedYear === 1950 ? '25%' : selectedYear === 1980 ? '50%' : selectedYear === 2026 ? '75%' : '100%',
            }}
          />
        </div>
      </div>

      {/* Dynamic Content Display with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedLocationId}-${selectedYear}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Visual Image Card (Left Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden glass-heritage border border-amber-500/20 shadow-2xl group">
              <img
                src={eraData.image}
                alt={`${currentLocation.name} in ${selectedYear}`}
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${getEraBadgeColor(selectedYear)}`}>
                  {selectedYear} Era Snapshot
                </span>
                <h3 className="text-2xl font-bold text-white mb-1">{eraData.eraName}</h3>
                <p className="text-stone-300 text-sm">{currentLocation.name} Cultural Landscape</p>
              </div>
            </div>

            {/* AI Vision Future Alert (For 2050) */}
            {selectedYear === 2050 && eraData.aiVisionSummary && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 glass-heritage"
              >
                <div className="flex items-center gap-2 font-bold text-purple-300 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span>2050 AI Cultural Forecast</span>
                </div>
                <p className="text-sm leading-relaxed text-purple-100/90">{eraData.aiVisionSummary}</p>
              </motion.div>
            )}
          </div>

          {/* Detailed Cultural Pillars (Right Column) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Clothing */}
            <div className="glass-heritage p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Shirt className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base">Traditional Apparel</h4>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{eraData.clothing}</p>
            </div>

            {/* Architecture */}
            <div className="glass-heritage p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base">Architecture & Dwellings</h4>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{eraData.architecture}</p>
            </div>

            {/* Food */}
            <div className="glass-heritage p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base">Cuisine & Gastronomy</h4>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{eraData.food}</p>
            </div>

            {/* Music */}
            <div className="glass-heritage p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Music className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base">Folk Soundscapes</h4>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{eraData.music}</p>
            </div>

            {/* Lifestyle (Full Width across sm:grid-cols-2) */}
            <div className="sm:col-span-2 glass-heritage p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-100 text-base">Lifestyle & Community Rhythm</h4>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{eraData.lifestyle}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA Footer inside Time Machine */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass-heritage p-6 rounded-2xl border border-amber-500/30 max-w-2xl mx-auto">
          <div className="text-left">
            <h4 className="text-lg font-bold text-stone-100">Preserve this era for future generations</h4>
            <p className="text-stone-400 text-xs">Have authentic family stories or photographs from {selectedYear}?</p>
          </div>
          <button
            onClick={() => {
              const evt = new CustomEvent('open-preserve-modal');
              window.dispatchEvent(evt);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-4 h-4" />
            <span>Document Story →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
