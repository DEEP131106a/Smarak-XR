import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Sparkles, ArrowRight, X } from 'lucide-react';
import type { HeritageItem, CategoryType } from '../../types/heritageAlive';
import { toggleAdoptHeritage, getUserProfile } from '../../services/heritageStateService';
import { apiService } from '../../services/apiService';

const CATEGORIES: ('All' | CategoryType)[] = [
  'All',
  'Craft',
  'Music',
  'Food',
  'Language',
  'Dance',
  'Festival',
  'Site',
  'Tradition',
];

export const DiscoverPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | CategoryType>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [stateSearchIndex, setStateSearchIndex] = useState<Record<string, string>>({});
  const [items, setItems] = useState<HeritageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<HeritageItem | null>(null);
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    let cancelled = false;
    apiService.getAdoptItems()
      .then((results) => {
        if (cancelled) return;
        const stateIndex: Record<string, string> = {};
        results.forEach((item) => {
          const state = String(item.state || '').trim();
          if (!state) return;
          const searchableText = [
            state,
            item.city,
            item.region,
            item.title,
          ].filter(Boolean).join(' ').toLowerCase();
          stateIndex[state] = `${stateIndex[state] || ''} ${searchableText}`;
        });
        setStateSearchIndex(stateIndex);
      })
      .catch(() => {
        if (!cancelled) setStateSearchIndex({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params: Record<string, string> = {};
    if (selectedCategory !== 'All') params.category = selectedCategory.toLowerCase();
    if (selectedState !== 'All') params.location = selectedState;

    setIsLoading(true);
    setError(null);
    apiService.getAdoptItems(params)
      .then((results) => {
        if (cancelled) return;
        setItems(results.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          category: normalizeCategory(item.category),
          region: String(item.region || item.city || item.state || 'India'),
          state: String(item.state || item.region || 'India'),
          status: 'Thriving',
          description: String(item.description || 'Explore this living cultural tradition.'),
          history: typeof item.history === 'string' ? item.history : undefined,
          image: typeof item.image === 'string' ? item.image : undefined,
          tags: Array.isArray(item.ingredients) ? item.ingredients : undefined,
        })));
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setError('Cultural traditions could not be loaded. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedState]);

  const filteredItems = items;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Search Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Cultural Intelligence Search</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-6">
          What culture do you want to <span className="heritage-gold-text">discover</span>?
        </h1>

      </div>

      {/* Filters Bar */}
      <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20 mb-10 space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Category:
          </span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* State Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> State:
          </span>
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="search"
              value={stateSearchQuery}
              onChange={(event) => {
                const query = event.target.value.trim().toLowerCase();
                setStateSearchQuery(event.target.value);
                const match = Object.entries(stateSearchIndex)
                  .find(([, searchableText]) => searchableText.includes(query));
                setSelectedState(query && match ? match[0] : 'All');
              }}
              placeholder="Search states..."
              aria-label="Search states"
              className="w-full rounded-lg border border-stone-800 bg-stone-900/80 py-1.5 pl-8 pr-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
          {selectedState !== 'All' && (
            <button
              onClick={() => {
                setSelectedState('All');
                setStateSearchQuery('');
              }}
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
            >
              {selectedState} ×
            </button>
          )}
        </div>
      </div>

      {/* Search Results Count */}
      <div className="flex justify-between items-center mb-6 px-1">
        <span className="text-stone-400 text-sm font-medium">
          Showing <strong className="text-amber-400">{filteredItems.length}</strong> living cultural traditions
        </span>
      </div>

      {/* Grid of Heritage Cards */}
      {isLoading ? (
        <div className="rounded-2xl border border-amber-500/20 bg-stone-900/40 p-10 text-center text-stone-400" role="status">
          Loading cultural traditions...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-10 text-center text-red-200" role="alert">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-amber-500/20 bg-stone-900/40 p-10 text-center text-stone-400">
          No cultural traditions match these filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="glass-heritage rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl"
              onClick={() => setActiveModalItem(item)}
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-amber-500/90 text-stone-950 text-xs font-bold px-3 py-1 rounded-full shadow">
                    {item.category}
                  </div>

                  <div className="absolute bottom-3 left-4 text-xs font-semibold text-stone-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.region}, {item.state}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-300 text-sm line-clamp-3 mb-4">{item.description}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-800/80">
                <span className="text-xs text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Culture <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <span className="text-[11px] text-stone-500 uppercase font-semibold">
                  Status: {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Item Detail */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-heritage border border-amber-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6">
                <img src={activeModalItem.image} alt={activeModalItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 mb-2 inline-block">
                    {activeModalItem.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeModalItem.title}</h2>
                  <p className="text-amber-400 text-sm">{activeModalItem.region}, {activeModalItem.state}</p>
                </div>
              </div>

              <div className="space-y-4 text-stone-300 text-sm">
                <p className="text-base text-stone-100 leading-relaxed">{activeModalItem.description}</p>
                {activeModalItem.origin && (
                  <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Origin</h4>
                    <p>{activeModalItem.origin}</p>
                  </div>
                )}
                {activeModalItem.significance && (
                  <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Significance</h4>
                    <p>{activeModalItem.significance}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    toggleAdoptHeritage(activeModalItem.id);
                    setProfile(getUserProfile());
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    profile.adoptedIds.includes(activeModalItem.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                  }`}
                >
                  {profile.adoptedIds.includes(activeModalItem.id) ? 'Adopted ✓' : 'Adopt Heritage'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function normalizeCategory(category: unknown): CategoryType {
  const value = String(category || '').toLowerCase();
  const categories: Record<string, CategoryType> = {
    craft: 'Craft',
    crafts: 'Craft',
    music: 'Music',
    food: 'Food',
    language: 'Language',
    dance: 'Dance',
    festival: 'Festival',
    festivals: 'Festival',
    site: 'Site',
    tradition: 'Tradition',
    story: 'Tradition',
    stories: 'Tradition',
    dress: 'Tradition',
  };
  return categories[value] || 'Other';
}
