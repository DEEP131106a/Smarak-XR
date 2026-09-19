import React from 'react';
import type { StateItem, CityItem, ExploreFilter } from '../../types/explore';
import { StateCard } from './StateCard';
import { CityCard } from './CityCard';
import { ARExperienceCard } from './ARExperienceCard';
import { ExploreSearchBar } from './ExploreSearchBar';
import { ExploreFilterBar } from './ExploreFilterBar';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  states: StateItem[];
  cities: CityItem[];
  filter: ExploreFilter;
  onFilterChange: (updated: ExploreFilter) => void;
  onSelectState: (stateId: string) => void;
  onSelectCity: (stateId: string, cityId: string) => void;
  onOpenAR: () => void;
}

export const ExploreLandingPage: React.FC<Props> = ({
  states,
  cities,
  filter,
  onFilterChange,
  onSelectState,
  onSelectCity,
  onOpenAR,
}) => {
  const handleStartExploring = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(587.33, 2.0);
    const target = document.getElementById('india-states-explorer');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-16 pb-16">
      {/* 1. Hero Section (Rule 3) */}
      <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden bg-[#080912]">
        {/* Abstract Heritage Background & Mandala Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full border border-amber-500/10 animate-spin-slow" />
          <div className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full border border-orange-500/15 animate-spin-reverse-slow" />
          <div className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] rounded-full border border-amber-400/20" />
          <div className="absolute w-[450px] h-[450px] bg-radial from-amber-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Smarak XR • Explore India Heritage Map</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-tight text-white mb-3 leading-none">
            EXPLORE <span className="gold-gradient-text">INDIA</span>
          </h1>

          <p className="font-yatra text-lg sm:text-2xl text-amber-400/90 tracking-wide mb-4">
            भारत की विरासत, संस्कृति एवं पावन क्षेत्र
          </p>

          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-amber-100/80 font-outfit leading-relaxed mb-8">
            Discover the history, heritage, culture, food, traditions and stories of India.
          </p>

          <button
            onClick={handleStartExploring}
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-sm sm:text-base shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Search & Filter Bar (Rules 25, 26) */}
        <section className="pt-4">
          <ExploreSearchBar
            value={filter.searchQuery || ''}
            onChange={(q) => onFilterChange({ ...filter, searchQuery: q })}
          />
          <ExploreFilterBar
            filter={filter}
            states={states}
            onChange={onFilterChange}
          />
        </section>

        {/* 3. India Map / State Explorer Section (Rule 4) */}
        <section id="india-states-explorer" className="scroll-mt-24">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>State & Regional Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-black text-white">
              DISCOVER <span className="gold-gradient-text">INDIAN STATES</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 font-outfit max-w-2xl mt-2">
              Select a state to explore its ancient timeline, famous cities, regional cuisine, folk music, and sacred traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((st) => (
              <StateCard key={st.id} stateItem={st} onClick={onSelectState} />
            ))}
          </div>
        </section>

        {/* 4. Featured Cities Grid */}
        {cities.length > 0 && (
          <section className="py-4">
            <div className="flex flex-col items-center text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
                Featured Historic Cities
              </h3>
              <p className="text-xs text-amber-200/70 font-outfit max-w-md mt-1">
                Explore individual cities for local history, places to visit, and regional stories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((ct) => (
                <CityCard key={ct.id} city={ct} onClick={onSelectCity} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
