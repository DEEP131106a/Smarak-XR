import React, { useState } from 'react';
import type { CityItem } from '../../types/explore';
import { Breadcrumbs } from './Breadcrumbs';
import { TimelineComponent } from './TimelineComponent';
import { PlacesToVisitCard } from './PlacesToVisitCard';
import {
  FoodCard,
  DanceCard,
  MusicCard,
  ClothingCard,
  CraftCard,
  FestivalCard,
  StoryCard,
} from './CulturalCategoryCards';
import { MediaPlaceholder } from './MediaPlaceholder';
import { ARExperienceCard } from './ARExperienceCard';
import { MapPin, Image as ImageIcon, Video, Sparkles, X, Maximize2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  city: CityItem;
  onNavigate: (path: string) => void;
  onOpenAR: () => void;
}

export const CityDetailPage: React.FC<Props> = ({ city, onNavigate, onOpenAR }) => {
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  return (
    <div className="w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs (Rule 24): India > Maharashtra > Pune */}
      <Breadcrumbs
        items={[
          { label: city.stateName, path: `/explore/${city.stateId}` },
          { label: city.name, isCurrent: true },
        ]}
        onNavigate={onNavigate}
      />

      {/* 1. City Hero Section (Rule 9) */}
      <div className="relative rounded-3xl glass-royal border border-amber-500/30 p-8 sm:p-12 overflow-hidden mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{city.stateName} Region</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-cinzel font-black text-white mb-2">
            {city.name.toUpperCase()}
          </h1>

          <p className="font-yatra text-xl sm:text-2xl text-amber-400 mb-4">
            {city.tagline}
          </p>

          <p className="text-sm sm:text-base text-amber-100/90 font-outfit leading-relaxed">
            {city.description}
          </p>
        </div>
      </div>

      {/* 2. Interactive City History Timeline (Rule 11) */}
      <TimelineComponent
        events={city.historyTimeline}
        title={`History & Heritage of ${city.name}`}
        subtitle={`Interactive timeline of ${city.name}'s foundation and royal history`}
      />

      {/* 3. Famous Places & Monuments (Rule 12) */}
      {city.placesToVisit && city.placesToVisit.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Must Visit Monuments</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
                Famous Places to Visit in {city.name}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.placesToVisit.map((place) => (
              <PlacesToVisitCard key={place.id} place={place} onOpenAR={onOpenAR} />
            ))}
          </div>
        </section>
      )}

      {/* 4. City Food & Cuisine (Rule 14) */}
      {city.culture.food && city.culture.food.length > 0 && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            🍛 Regional Food & Culinary Delicacies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.food.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Dance & Music (Rules 15, 16) */}
      {(city.culture.dance?.length > 0 || city.culture.music?.length > 0) && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            💃 Folk Dance & Music Traditions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.dance.map((item) => (
              <DanceCard key={item.id} item={item} />
            ))}
            {city.culture.music.map((item) => (
              <MusicCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Traditional Clothing (Rule 17) */}
      {city.culture.clothing && city.culture.clothing.length > 0 && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            👗 Traditional Attire & Weaves
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.clothing.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Arts & Crafts (Rule 18) */}
      {city.culture.crafts && city.culture.crafts.length > 0 && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            🎨 Arts & Metal Crafts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.crafts.map((item) => (
              <CraftCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Festivals (Rule 19) */}
      {city.culture.festivals && city.culture.festivals.length > 0 && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            🎉 Sacred Festivals & Celebrations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.festivals.map((item) => (
              <FestivalCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Local Stories (Rule 20) */}
      {city.culture.stories && city.culture.stories.length > 0 && (
        <section className="my-12">
          <h3 className="text-2xl font-cinzel font-bold text-white mb-6">
            📜 Historical Legends & Local Stories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {city.culture.stories.map((item) => (
              <StoryCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 10. Reusable Image Gallery Section (Rule 21) */}
      {city.galleryImages && city.galleryImages.length > 0 && (
        <section className="my-12">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-2xl font-cinzel font-bold text-white">
              City Photo Gallery
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {city.galleryImages.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  triggerHaptic('tap');
                  setActiveImageModal(img.title);
                }}
                className="group relative rounded-2xl glass-royal border border-amber-500/20 aspect-video flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-amber-500/60 transition-all overflow-hidden"
              >
                <ImageIcon className="w-8 h-8 text-amber-400/60 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-cinzel">{img.title}</span>
                <span className="text-[10px] text-amber-200/60 line-clamp-1">{img.caption}</span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. Reusable Video Section (Rule 22) */}
      <section className="my-12">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-amber-400" />
          <h3 className="text-2xl font-cinzel font-bold text-white">
            Video Archive
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MediaPlaceholder type="video" title={`Documentary Footage of ${city.name}`} />
          <MediaPlaceholder type="video" title={`Culture & Festival Video of ${city.name}`} />
        </div>
      </section>

      {/* 12. 3D / AR Section (Rule 23) */}
      <ARExperienceCard onOpenAR={onOpenAR} />

      {/* Gallery Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full p-6 rounded-3xl glass-royal border border-amber-500/40 text-center">
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-56 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex flex-col items-center justify-center p-4 mb-4">
              <ImageIcon className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />
              <span className="font-cinzel text-lg font-bold text-white">{activeImageModal}</span>
            </div>
            <p className="text-xs text-amber-200/70 font-outfit">
              Image Lightbox View Placeholder for {activeImageModal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
