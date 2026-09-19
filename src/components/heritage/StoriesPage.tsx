import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Calendar, MapPin, Sparkles, Filter, X, ArrowRight, Award } from 'lucide-react';
import { getUserStories, subscribeState } from '../../services/heritageStateService';
import type { StoryItem } from '../../types/heritageAlive';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>(getUserStories());
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeStoryModal, setActiveStoryModal] = useState<StoryItem | null>(null);

  useEffect(() => {
    const unsub = subscribeState(() => {
      setStories(getUserStories());
    });
    return unsub;
  }, []);

  const filters = ['All', 'Craft', 'Food', 'Music', 'Tradition', 'Oral History'];

  const filteredStories = stories.filter((s) => {
    if (selectedFilter === 'All') return true;
    return s.category === selectedFilter;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Living Community Archives</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Stories That Deserve to <span className="heritage-gold-text">Survive</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Explore memories, elder interviews, artisan craft narratives, and family heirloom traditions uploaded directly by people across India.”
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10">
        {filters.map((flt) => {
          const active = selectedFilter === flt;
          return (
            <button
              key={flt}
              onClick={() => setSelectedFilter(flt)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                  : 'glass-heritage text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {flt}
            </button>
          );
        })}
      </div>

      {/* Grid of Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -6 }}
            className="glass-heritage rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl"
            onClick={() => setActiveStoryModal(story)}
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={story.image || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-bold text-xs px-3 py-1 rounded-full">
                  {story.category}
                </div>
                <div className="absolute top-4 right-4 bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 font-bold text-[10px] px-2.5 py-1 rounded-full">
                  {story.status}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">
                  {story.title}
                </h3>
                <p className="text-stone-300 text-sm line-clamp-3 mb-4 italic">“{story.shortStory}”</p>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" /> {story.preservedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {story.region}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Story <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-stone-500">{story.date}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Story Modal */}
      <AnimatePresence>
        {activeStoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveStoryModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-heritage border border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveStoryModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-60 rounded-2xl overflow-hidden mb-6">
                <img src={activeStoryModal.image} alt={activeStoryModal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 mb-2 inline-block">
                    {activeStoryModal.category}
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">{activeStoryModal.title}</h2>
                  <p className="text-amber-400 text-xs">Preserved by {activeStoryModal.preservedBy} • {activeStoryModal.region}, {activeStoryModal.state}</p>
                </div>
              </div>

              <div className="space-y-4 text-stone-300 text-sm">
                <p className="text-base text-stone-100 leading-relaxed font-serif italic border-l-2 border-amber-500 pl-4">
                  “{activeStoryModal.fullStory || activeStoryModal.shortStory}”
                </p>

                {activeStoryModal.recipeIngredients && (
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Recipe Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-stone-300">
                      {activeStoryModal.recipeIngredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
