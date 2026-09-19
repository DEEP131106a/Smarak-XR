import React from 'react';
import type { StateItem, CityItem } from '../../types/explore';
import { Breadcrumbs } from './Breadcrumbs';
import { TimelineComponent } from './TimelineComponent';
import { CityCard } from './CityCard';
import {
  Utensils,
  Sparkles,
  Music,
  Shirt,
  Palette,
  Calendar,
  BookOpen,
  MapPin,
  Compass,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  stateItem: StateItem;
  cities: CityItem[];
  onNavigate: (path: string) => void;
  onSelectCity: (stateId: string, cityId: string) => void;
}

export const StateDetailPage: React.FC<Props> = ({
  stateItem,
  cities,
  onNavigate,
  onSelectCity,
}) => {
  const handleCategoryExplore = (cat: string) => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523, 1.2);
    // Navigate to featured city or culture filter view
    if (cities.length > 0) {
      onSelectCity(stateItem.id, cities[0].id);
    }
  };

  return (
    <div className="w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs (Rule 24) */}
      <Breadcrumbs
        items={[{ label: stateItem.name, isCurrent: true }]}
        onNavigate={onNavigate}
      />

      {/* 1. State Hero Section (Rule 5) */}
      <div className="relative rounded-3xl glass-royal border border-amber-500/30 p-8 sm:p-12 overflow-hidden mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{stateItem.region} India • Capital: {stateItem.capital}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-cinzel font-black text-white mb-2">
            {stateItem.name.toUpperCase()}
          </h1>

          <p className="font-yatra text-xl sm:text-2xl text-amber-400 mb-4">
            History • Culture • Heritage • Stories
          </p>

          <p className="text-sm sm:text-base text-amber-100/90 font-outfit leading-relaxed mb-6">
            {stateItem.overview || stateItem.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('state-cities-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-cinzel font-black text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              Explore Cities ({cities.length})
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('state-culture-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl glass-royal text-white font-cinzel font-bold text-xs sm:text-sm cursor-pointer border border-amber-500/30 hover:border-amber-500/60 transition-all"
            >
              State Cultural Traditions
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive State History Timeline (Rule 7) */}
      <TimelineComponent
        events={stateItem.historyTimeline}
        title={`${stateItem.name} Historical Epochs`}
        subtitle="Key eras, empires, and cultural movements shaping the state"
      />

      {/* 3. State Culture Overview Section (Rule 6) */}
      <section id="state-culture-section" className="my-12 scroll-mt-24">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Living Traditions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-black text-white">
            STATE <span className="gold-gradient-text">CULTURAL HERITAGE</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/70 font-outfit max-w-xl mt-1">
            Discover regional delicacies, folk dances, soundscapes, textiles, and sacred festivals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Food */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-cinzel font-bold text-white">🍛 Food & Cuisine</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.foodSummary || 'Explore the traditional food and culinary heritage of this region.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('food')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Food [Explore]
            </button>
          </div>

          {/* Dance */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-lg font-cinzel font-bold text-white">💃 Folk Dance</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.danceSummary || 'Explore traditional dances and festive performances.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('dance')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Dance [Explore]
            </button>
          </div>

          {/* Music */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-5 h-5 text-rose-400" />
                <h4 className="text-lg font-cinzel font-bold text-white">🎵 Sacred Music</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.musicSummary || 'Discover traditional instruments, devotional tunes, and folk soundscapes.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('music')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Music [Explore]
            </button>
          </div>

          {/* Clothing */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shirt className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-cinzel font-bold text-white">👗 Clothing & Attire</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.clothingSummary || 'Discover traditional clothing, textiles and craftsmanship.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('clothing')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Attire [Explore]
            </button>
          </div>

          {/* Crafts */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-5 h-5 text-amber-300" />
                <h4 className="text-lg font-cinzel font-bold text-white">🎨 Arts & Crafts</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.craftsSummary || 'Explore traditional art forms, metalwork, and handmade crafts.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('crafts')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Crafts [Explore]
            </button>
          </div>

          {/* Festivals */}
          <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h4 className="text-lg font-cinzel font-bold text-white">🎉 Festivals</h4>
              </div>
              <p className="text-xs text-gray-300 font-outfit leading-relaxed mb-4">
                {stateItem.cultureOverview.festivalsSummary || 'Discover regional festivals, traditions and sacred celebrations.'}
              </p>
            </div>
            <button
              onClick={() => handleCategoryExplore('festivals')}
              className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-bold cursor-pointer transition-all"
            >
              Explore Festivals [Explore]
            </button>
          </div>
        </div>
      </section>

      {/* 4. Explore Cities Section (Rule 8) */}
      <section id="state-cities-section" className="my-12 scroll-mt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Urban Heritage Map</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
              Explore Cities of {stateItem.name}
            </h3>
          </div>
        </div>

        {cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((ct) => (
              <CityCard key={ct.id} city={ct} onClick={onSelectCity} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl glass-royal border border-amber-500/20 text-center">
            <p className="text-sm text-amber-200/70">
              City entries for {stateItem.name} will appear here once populated from the backend.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
