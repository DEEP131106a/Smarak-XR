import React from 'react';
import { Compass, PlusCircle, Sparkles, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  onExploreClick: () => void;
  onPreserveClick: () => void;
  onVanishingClick: () => void;
  onCityClick?: (cityId: string) => void;
}

const FEATURED_CITIES = [
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', highlight: 'Golden Temple • Kulcha • Bhangra • Phulkari', icon: '🛕' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', highlight: 'Hawa Mahal • Dal Baati • Ghoomar • Bandhani', icon: '🏰' },
  { id: 'dharamshala', name: 'Dharamshala', state: 'Himachal Pradesh', highlight: 'Tsuglagkhang • Kangra Fort • Dham • Momos', icon: '🏔️' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', highlight: 'Gateway • Vada Pav • Lavani • Elephanta', icon: '🌊' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', highlight: 'Victoria Memorial • Rosogolla • Baul • Tant', icon: '🎨' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab & Haryana', highlight: 'Capitol Complex • Rock Garden • Corbusier • Bhangra', icon: '🏛️' },
];

export const HeroSection: React.FC<Props> = ({
  onExploreClick,
  onPreserveClick,
  onVanishingClick,
  onCityClick,
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden bg-[#0e1017]">
      {/* Background Decorative Mandala Rings & Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full border border-[#d4af37]/10 animate-spin-slow" />
        <div className="absolute w-[450px] h-[450px] sm:w-[680px] sm:h-[680px] rounded-full border border-[#c85a32]/15 animate-spin-reverse-slow" />
        <div className="absolute w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] rounded-full border border-[#d4af37]/20" />
        <div className="absolute w-[500px] h-[500px] bg-radial from-[#c85a32]/20 via-[#0e1017]/80 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-lg shadow-[#d4af37]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>India's Living Cultural Preservation</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-tight text-white mb-6 leading-tight">
          Explore Your <span className="heritage-gold-text">Culture</span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-3xl text-base sm:text-xl text-amber-100/90 font-outfit leading-relaxed mb-10">
          Discover traditional foods, sacred monuments, classical dances, authentic attire, local stories, and endangered heritage across India.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => {
              triggerHaptic('success');
              soundEngine.playTempleBell(587.33, 2.0);
              onExploreClick();
            }}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#c85a32] via-[#d4af37] to-[#e06d43] hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-base shadow-2xl shadow-[#d4af37]/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Explore Cultural Cities</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(659, 1.5);
              onVanishingClick();
            }}
            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-cinzel font-bold text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Vanishing Culture</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523.25, 1.5);
              onPreserveClick();
            }}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl glass-heritage hover:border-[#d4af37]/60 text-white font-cinzel font-bold text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <PlusCircle className="w-5 h-5 text-[#c85a32]" />
            <span>Preserve a Story</span>
          </button>
        </div>

        {/* Quick Explore Cities Grid */}
        <div className="w-full max-w-4xl rounded-3xl p-6 sm:p-8 glass-heritage border border-[#d4af37]/40 shadow-2xl relative overflow-hidden text-left">
          <div className="flex items-center justify-between mb-5 border-b border-[#d4af37]/20 pb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>Direct City Cultural Portals</span>
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              Select a city to unveil food, dance, dresses & stories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {FEATURED_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => onCityClick ? onCityClick(city.id) : onExploreClick()}
                className="p-3.5 rounded-2xl bg-black/40 border border-[#d4af37]/20 hover:border-[#d4af37] transition-all text-left group cursor-pointer hover:bg-stone-900/80"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{city.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                    {city.state}
                  </span>
                </div>
                <h4 className="text-sm font-cinzel font-bold text-white group-hover:text-amber-300 transition-colors">
                  {city.name}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                  {city.highlight}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
