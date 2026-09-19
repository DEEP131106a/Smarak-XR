import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Tag, ArrowRight } from 'lucide-react';
import { HERITAGE_ITEMS, PRESERVED_STORIES, MAP_LOCATIONS } from '../../data/heritageAliveData';

export const GlobalSearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-global-search', handleOpen);
    return () => window.removeEventListener('open-global-search', handleOpen);
  }, []);

  if (!isOpen) return null;

  const matchedItems = HERITAGE_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.region.toLowerCase().includes(query.toLowerCase()) ||
    item.state.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedLocations = MAP_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(query.toLowerCase()) ||
    loc.state.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="glass-heritage border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <Search className="w-5 h-5 text-amber-400" />
            <input
              type="text"
              autoFocus
              placeholder="Global Search (e.g., Punjab, Phulkari, Jaipur, Bajra)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-stone-100 placeholder-stone-500 focus:outline-none text-base"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results View */}
          <div className="overflow-y-auto space-y-6 pt-4 flex-1 pr-1">
            {!query ? (
              <div className="text-center py-10 text-stone-500 text-sm">
                Type any keyword to search places, craft traditions, songs, foods, or oral history records.
              </div>
            ) : (
              <>
                {/* Matched Places */}
                {matchedLocations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Places & Locations</h4>
                    <div className="space-y-2">
                      {matchedLocations.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => setIsOpen(false)}
                          className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 flex justify-between items-center cursor-pointer transition-all"
                        >
                          <div>
                            <span className="text-stone-100 font-bold text-sm">{loc.name}</span>
                            <span className="text-stone-400 text-xs ml-2">({loc.state})</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Heritage Crafts & Songs */}
                {matchedItems.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Heritage Traditions</h4>
                    <div className="space-y-2">
                      {matchedItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setIsOpen(false)}
                          className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 flex justify-between items-center cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {item.category}
                            </span>
                            <div>
                              <h5 className="text-stone-100 font-bold text-sm">{item.title}</h5>
                              <p className="text-stone-400 text-xs">{item.region}, {item.state}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
