import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Utensils, Music2, Landmark, Shirt, BookOpen, AlertTriangle, PartyPopper,
  Clock, X, ChevronLeft, Star, Users, Info, Play, ArrowRight, Box
} from 'lucide-react';
import { getCityById } from '../../data/cityData';
import type { CityCategory, CityItem } from '../../data/cityData';
import { Monument3DModal } from './Monument3DModal';

const CATEGORY_CONFIG: { key: CityCategory; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'monument',  label: 'Monuments',       icon: Landmark,     color: 'amber'   },
  { key: 'food',      label: 'Food & Cuisine',   icon: Utensils,     color: 'orange'  },
  { key: 'dance',     label: 'Dance & Music',    icon: Music2,       color: 'purple'  },
  { key: 'dress',     label: 'Traditional Dress',icon: Shirt,        color: 'pink'    },
  { key: 'story',     label: 'Local Stories',    icon: BookOpen,     color: 'blue'    },
  { key: 'festival',  label: 'Festivals',        icon: PartyPopper,  color: 'rose'    },
  { key: 'vanishing', label: 'Vanishing Culture',icon: AlertTriangle,color: 'red'     },
];

const STATUS_BADGE: Record<string, string> = {
  Thriving:  'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
  Declining: 'bg-yellow-950/80  text-yellow-300  border-yellow-600/60',
  'At Risk': 'bg-amber-950/80   text-amber-300   border-amber-600/60',
  Critical:  'bg-rose-950/80    text-rose-300    border-rose-600/60',
};

interface Props {
  cityId: string;
  onBack: () => void;
}

export const CityExplorer: React.FC<Props> = ({ cityId, onBack }) => {
  const city = getCityById(cityId);
  const [activeCategory, setActiveCategory] = useState<CityCategory | 'overview' | 'timeline'>('overview');
  const [selectedItem, setSelectedItem] = useState<CityItem | null>(null);
  const [ar3dItem, setAr3dItem] = useState<CityItem | null>(null);

  if (!city) return (
    <div className="py-20 text-center text-stone-400">City not found.</div>
  );

  const displayedItems = activeCategory === 'overview' || activeCategory === 'timeline'
    ? city.items.filter(i => i.status === 'Critical' || i.status === 'At Risk').slice(0, 6)
    : city.items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={city.heroImage} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-[#0e1017]" />
        <div className="absolute inset-x-0 bottom-6 px-4 sm:px-8 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-4 hover:text-amber-300"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Map
          </button>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold">{city.state} • {city.country}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">{city.name}</h1>
              <p className="text-amber-200/80 text-sm mt-1 max-w-2xl">{city.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-3 ml-auto">
              {[
                { label: 'Founded', val: city.founded },
                { label: 'Language', val: city.language },
                { label: 'Population', val: city.population },
              ].map(({ label, val }) => (
                <div key={label} className="glass-heritage px-3 py-2 rounded-xl border border-amber-500/30 text-center">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">{label}</div>
                  <div className="text-white text-xs font-bold mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'overview' ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30 scale-105' : 'glass-heritage text-stone-400 hover:text-white'}`}
          >
            <Info className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveCategory('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeCategory === 'timeline' ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30 scale-105' : 'glass-heritage text-stone-400 hover:text-white'}`}
          >
            <Clock className="w-3.5 h-3.5" /> Cultural Timeline
          </button>
          {CATEGORY_CONFIG.map(cat => {
            const count = city.items.filter(i => i.category === cat.key).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeCategory === cat.key ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30 scale-105' : 'glass-heritage text-stone-400 hover:text-white'}`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
                <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-black">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW ── */}
        {activeCategory === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20">
                  <h2 className="text-xl font-bold text-stone-100 mb-3">About {city.name}</h2>
                  <p className="text-stone-300 leading-relaxed">{city.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-100 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" /> Endangered Traditions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {city.items.filter(i => i.status !== 'Thriving').map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="glass-heritage p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/50 cursor-pointer flex gap-3 group relative"
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="overflow-hidden">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${STATUS_BADGE[item.status]}`}>{item.status}</span>
                          <h4 className="text-stone-100 font-bold text-sm leading-tight group-hover:text-amber-400 transition-colors">{item.name}</h4>
                          <p className="text-stone-400 text-xs mt-0.5 capitalize">{item.category}</p>
                        </div>
                        {item.category === 'monument' && (
                          <button
                            onClick={e => { e.stopPropagation(); setAr3dItem(item); }}
                            title="View in 3D AR"
                            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-black text-[10px] font-extrabold shadow-md shadow-amber-500/30 transition-all z-10"
                          >
                            <Box className="w-3 h-3" /> 3D AR
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Category Quick Links */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-100 mb-4">Explore by Category</h3>
                {CATEGORY_CONFIG.map(cat => {
                  const count = city.items.filter(i => i.category === cat.key).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className="w-full glass-heritage p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/50 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className="w-5 h-5 text-amber-400" />
                        <span className="text-stone-100 font-semibold text-sm">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-black text-sm">{count}</span>
                        <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TIMELINE ── */}
        {activeCategory === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-stone-100 mb-8">
              Cultural Evolution of <span className="heritage-gold-text">{city.name}</span>
            </h2>
            <div className="space-y-8">
              {city.timeline.map((era, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Image */}
                  <div className="lg:col-span-4 rounded-2xl overflow-hidden h-56 relative">
                    <img src={era.image} alt={era.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-amber-500 text-stone-950 font-black text-xs rounded-full">{era.year}</span>
                      <h3 className="text-white font-bold text-sm mt-1">{era.label}</h3>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="lg:col-span-8 glass-heritage p-6 rounded-2xl border border-amber-500/20">
                    <p className="text-stone-200 text-sm leading-relaxed mb-4 italic border-l-2 border-amber-500 pl-3">"{era.summary}"</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { icon: Utensils, label: 'Food', val: era.food },
                        { icon: Shirt, label: 'Dress', val: era.dress },
                        { icon: Music2, label: 'Music', val: era.music },
                        { icon: Users, label: 'Way of Life', val: era.life },
                      ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                            <Icon className="w-3 h-3" /> {label}
                          </div>
                          <p className="text-stone-300 leading-relaxed">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CATEGORY ITEMS GRID ── */}
        {activeCategory !== 'overview' && activeCategory !== 'timeline' && (
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {displayedItems.length === 0 ? (
              <div className="text-center py-20 text-stone-500">No items in this category yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedItems.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -6 }}
                    onClick={() => setSelectedItem(item)}
                    className="glass-heritage rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 cursor-pointer group shadow-xl flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGE[item.status]}`}>{item.status}</span>
                      </div>
                      {/* 3D AR button — top-right corner */}
                      {item.category === 'monument' ? (
                        <button
                          onClick={e => { e.stopPropagation(); setAr3dItem(item); }}
                          title="View in 3D AR"
                          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-[11px] font-extrabold shadow-lg shadow-amber-500/40 transition-all z-10 border border-amber-300/30"
                        >
                          <Box className="w-3.5 h-3.5" /> 3D AR
                        </button>
                      ) : item.artisanCount ? (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-900/80 px-2 py-0.5 rounded text-amber-400 text-[11px] font-semibold">
                          <Users className="w-3 h-3" /> {item.artisanCount.toLocaleString()} left
                        </div>
                      ) : null}
                      <div className="absolute bottom-2 left-3 right-3">
                        <span className="text-[10px] text-amber-400/80 uppercase font-bold">{item.yearRange || item.era}</span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2">{item.name}</h3>
                      <p className="text-stone-300 text-sm line-clamp-3 flex-1">{item.description}</p>
                      {item.funFact && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex gap-1.5">
                          <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{item.funFact}</span>
                        </div>
                      )}
                      <span className="mt-3 text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-heritage border border-amber-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/90 text-stone-400 hover:text-white border border-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 rounded-t-3xl overflow-hidden">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-14">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold border mb-2 ${STATUS_BADGE[selectedItem.status]}`}>{selectedItem.status}</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedItem.name}</h2>
                  <p className="text-amber-400 text-sm">{city.name}, {city.state} • <span className="capitalize">{selectedItem.category}</span></p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-stone-200 text-base leading-relaxed">{selectedItem.description}</p>
                <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-500/5 text-stone-300 text-sm leading-relaxed">
                  {selectedItem.details}
                </div>

                {selectedItem.funFact && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex gap-3">
                    <Star className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-purple-300 font-bold text-xs uppercase mb-1">Did You Know?</p>
                      <p className="text-purple-100 text-sm">{selectedItem.funFact}</p>
                    </div>
                  </div>
                )}

                {selectedItem.ingredients && (
                  <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Key Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.ingredients.map((ing, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-stone-900 text-stone-300 text-xs border border-stone-800">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.steps && (
                  <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Steps / Movements</h4>
                    <ol className="space-y-1">
                      {selectedItem.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-xs text-stone-300">
                          <span className="text-amber-400 font-bold w-4 flex-shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {selectedItem.materials && (
                  <div>
                    <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Materials Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.materials.map((mat, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-stone-900 text-stone-300 text-xs border border-stone-800">{mat}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.tags && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800">
                    {selectedItem.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-stone-900 text-stone-400 text-[11px] border border-stone-800">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-stone-800 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      window.dispatchEvent(new CustomEvent('open-preserve-modal'));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm"
                  >
                    Preserve a Story about This →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3D AR QR Modal ── */}
      {ar3dItem && (
        <Monument3DModal item={ar3dItem} onClose={() => setAr3dItem(null)} />
      )}
    </div>
  );
};
