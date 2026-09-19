import React, { useState } from 'react';
import type { CultureItem } from '../../types/culture';
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  BookOpen,
  Calendar,
  Utensils,
  Shirt,
  Palette,
  Music,
  UserCheck,
  Tag,
} from 'lucide-react';
import { MediaGallery } from './MediaGallery';
import { VideoPlayer } from './VideoPlayer';
import { AudioPlayer } from './AudioPlayer';
import { ModelViewerComponent } from './ModelViewerComponent';
import { ARButton } from './ARButton';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  item: CultureItem;
  onBack: () => void;
  onLaunchAR?: (item: CultureItem) => void;
}

export const CultureDetailPage: React.FC<Props> = ({ item, onBack, onLaunchAR }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'history' | 'craft' | 'culture'>('about');

  const handleBackClick = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523.25, 1.2);
    onBack();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Navigation Back Action */}
      <button
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-royal border border-amber-500/30 text-amber-300 text-xs font-bold hover:text-white hover:border-amber-500/60 mb-6 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {item.category.toUpperCase()} Library</span>
      </button>

      {/* Header Banner Section */}
      <div className="relative rounded-3xl glass-royal border border-amber-500/30 p-6 sm:p-8 overflow-hidden mb-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40">
              {item.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 text-amber-200 text-xs font-semibold border border-amber-500/20">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.region}</span>
            </span>
          </div>

          {/* AR Button ONLY if arEnabled === true */}
          {item.arEnabled && (
            <ARButton
              arEnabled={item.arEnabled}
              onLaunchAR={() => onLaunchAR && onLaunchAR(item)}
              title={item.title}
            />
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-cinzel font-black text-white mb-3">
          {item.title}
        </h1>

        <p className="text-sm sm:text-base text-amber-100/90 font-outfit leading-relaxed max-w-3xl mb-4">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-500/15">
            {item.tags.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20"
              >
                <Tag className="w-3 h-3 text-amber-400" />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Conditional Media Section (Rendered ONLY if media exists) */}
      <VideoPlayer videos={item.videos} title={item.title} />
      <AudioPlayer audio={item.audio} title={item.title} />
      <ModelViewerComponent model3d={item.model3d} title={item.title} />
      <MediaGallery images={item.images} title={item.title} />

      {/* Detailed Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-amber-500/20 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-5 py-3 text-xs sm:text-sm font-cinzel font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'about'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-gray-400 hover:text-amber-200'
          }`}
        >
          About & Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-3 text-xs sm:text-sm font-cinzel font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'history'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-gray-400 hover:text-amber-200'
          }`}
        >
          History & Origins
        </button>
        {(item.ingredients || item.materials || item.costumeDetails) && (
          <button
            onClick={() => setActiveTab('craft')}
            className={`px-5 py-3 text-xs sm:text-sm font-cinzel font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'craft'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-amber-200'
            }`}
          >
            Craftsmanship / Ingredients
          </button>
        )}
        <button
          onClick={() => setActiveTab('culture')}
          className={`px-5 py-3 text-xs sm:text-sm font-cinzel font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'culture'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-gray-400 hover:text-amber-200'
          }`}
        >
          Cultural Significance
        </button>
      </div>

      {/* Tab Contents */}
      <div className="rounded-3xl glass-royal border border-amber-500/20 p-6 sm:p-8 space-y-6">
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h3 className="text-xl font-cinzel font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Cultural Overview</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-outfit">
              {item.description || 'Detailed cultural description will be loaded from backend API.'}
            </p>

            {/* Category specific dynamic info blocks */}
            {item.category === 'dance' && item.occasions && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Traditional Occasions & Festivals</h4>
                <ul className="list-disc list-inside text-xs text-amber-100 space-y-1">
                  {item.occasions.map((occ, i) => (
                    <li key={i}>{occ}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.category === 'food' && item.ingredients && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Key Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-semibold">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-xl font-cinzel font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Historical Origin & Legacy</span>
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed font-outfit">
              {item.history || item.origin || 'Historical information and origin legacy will appear here once retrieved from the database.'}
            </p>
          </div>
        )}

        {activeTab === 'craft' && (
          <div className="space-y-4">
            <h3 className="text-xl font-cinzel font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-400" />
              <span>Craftsmanship & Technique</span>
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed font-outfit">
              {item.craftsmanship || item.preparation || item.costumeDetails || 'Craftsmanship, textile weaving, or preparation methodology.'}
            </p>
            {item.artisanStory && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-400/30 text-xs text-indigo-200">
                <span className="font-bold text-indigo-300 block mb-1">Artisan Heritage Story:</span>
                {item.artisanStory}
              </div>
            )}
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="space-y-4">
            <h3 className="text-xl font-cinzel font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Living Culture & Tradition</span>
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed font-outfit">
              {item.culturalSignificance || item.culturalStory || 'Living cultural significance and community traditions.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
