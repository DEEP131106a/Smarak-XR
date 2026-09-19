import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Flame, ShieldAlert, Volume2, Users, MapPin, Tag, X, Play, Pause, BookmarkCheck, ArrowRight } from 'lucide-react';
import { HERITAGE_ITEMS } from '../../data/heritageAliveData';
import type { HeritageItem, CultureStatus } from '../../types/heritageAlive';
import { toggleAdoptHeritage, getUserProfile } from '../../services/heritageStateService';

export const VanishingCulture: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<HeritageItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [profile, setProfile] = useState(getUserProfile());

  const statusFilters = ['All', 'Critical', 'At Risk', 'Declining', 'Thriving'];

  const filteredItems = HERITAGE_ITEMS.filter((item) => {
    if (selectedStatus === 'All') return true;
    return item.status === selectedStatus;
  });

  const getStatusBadge = (status: CultureStatus) => {
    switch (status) {
      case 'Critical':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-600/60 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Critical
          </span>
        );
      case 'At Risk':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> At Risk
          </span>
        );
      case 'Declining':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-600/60 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" /> Declining
          </span>
        );
      case 'Thriving':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/60">
            Thriving
          </span>
        );
      default:
        return null;
    }
  };

  const handleToggleAdopt = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleAdoptHeritage(itemId);
    setProfile(getUserProfile());
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium mb-4">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>Endangered Heritage Registry</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Vanishing <span className="heritage-gold-text">Culture</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Some traditions disappear quietly. We want to document them before they do.”
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10">
        {statusFilters.map((st) => {
          const active = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                  : 'glass-heritage text-stone-400 hover:text-white hover:border-amber-500/30'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Grid of Endangered Heritage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const isAdopted = profile.adoptedIds.includes(item.id);
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="glass-heritage rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl"
              onClick={() => setActiveModalItem(item)}
            >
              <div>
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 bg-stone-900/80 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30">
                    {item.category}
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                    <span className="flex items-center gap-1 text-stone-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.state}
                    </span>
                    {item.artisanCount && (
                      <span className="flex items-center gap-1 bg-stone-900/70 px-2 py-0.5 rounded text-amber-400">
                        <Users className="w-3.5 h-3.5" /> ~{item.artisanCount} Master Artisans Left
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-1">
                    {item.title}
                  </h3>
                  {item.subtitle && <p className="text-xs text-amber-400/80 mb-3 italic">{item.subtitle}</p>}
                  <p className="text-stone-300 text-sm line-clamp-3 mb-4">{item.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.tags?.slice(0, 3).map((tg, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-900/80 text-stone-400 border border-stone-800">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-stone-800/80">
                <button
                  onClick={(e) => handleToggleAdopt(item.id, e)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    isAdopted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                      : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-500/30'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{isAdopted ? 'Adopted ✓' : 'Adopt Heritage'}</span>
                </button>

                <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Record <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => {
              setActiveModalItem(null);
              setIsPlayingAudio(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-heritage border border-amber-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  setIsPlayingAudio(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-6">
                <img src={activeModalItem.image} alt={activeModalItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1">{getStatusBadge(activeModalItem.status)}</div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeModalItem.title}</h2>
                    <p className="text-amber-400 text-sm font-medium">{activeModalItem.region}, {activeModalItem.state}</p>
                  </div>
                </div>
              </div>

              {/* Audio Player Placeholder */}
              {activeModalItem.audioPlaceholderText && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="p-3 rounded-full bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/30"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-stone-100 font-bold text-sm">{activeModalItem.audioPlaceholderText}</p>
                      <p className="text-xs text-amber-400">
                        {isPlayingAudio ? '▶ Playing Audio Sample (Simulated Field Recording)' : 'Click play to listen to rare audio archival recording'}
                      </p>
                    </div>
                  </div>
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'text-amber-400 animate-pulse' : 'text-stone-500'}`} />
                </div>
              )}

              {/* Story Content */}
              <div className="space-y-6 text-stone-300 text-sm">
                <div>
                  <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">Description & Current Reality</h4>
                  <p className="leading-relaxed text-base text-stone-200">{activeModalItem.description}</p>
                </div>

                {activeModalItem.origin && (
                  <div>
                    <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">Historical Origin</h4>
                    <p className="leading-relaxed">{activeModalItem.origin}</p>
                  </div>
                )}

                {activeModalItem.significance && (
                  <div>
                    <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">Cultural & Social Significance</h4>
                    <p className="leading-relaxed">{activeModalItem.significance}</p>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h4 className="text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">Classification Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalItem.tags?.map((tg, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-stone-900 text-amber-300/90 text-xs border border-amber-500/20 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap gap-4 items-center justify-between">
                <button
                  onClick={() => handleToggleAdopt(activeModalItem.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    profile.adoptedIds.includes(activeModalItem.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{profile.adoptedIds.includes(activeModalItem.id) ? 'Adopted in Your Profile ✓' : 'Adopt This Heritage'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModalItem(null);
                    const evt = new CustomEvent('open-preserve-modal');
                    window.dispatchEvent(evt);
                  }}
                  className="px-6 py-3 rounded-xl glass-heritage hover:border-amber-500/40 text-stone-200 font-bold text-sm transition-all duration-300"
                >
                  Preserve Story / Memory →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
