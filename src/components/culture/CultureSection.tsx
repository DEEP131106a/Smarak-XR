import React, { useEffect, useState } from 'react';
import type {
  CultureCategory,
  CultureCategoryMeta,
  CultureFilter,
  CultureItem,
  CultureRegion,
} from '../../types/culture';
import {
  getCultureCategories,
  getCultureItems,
  getCultureItem,
  getFeaturedCulture,
  getCultureRegions,
} from '../../services/cultureService';
import { CultureHero } from './CultureHero';
import { CategoryCard } from './CategoryCard';
import { RegionCard } from './RegionCard';
import { CultureGrid } from './CultureGrid';
import { CultureDetailPage } from './CultureDetailPage';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { Sparkles, MapPin, Compass, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  currentPath: string; // e.g. '/culture', '/culture/dance', '/culture/music', '/culture/food', '/culture/clothing', '/culture/crafts', '/culture/festivals', '/culture/stories', '/culture/dance/123'
  onNavigate: (path: string) => void;
  onOpenAR?: () => void;
}

export const CultureSection: React.FC<Props> = ({ currentPath, onNavigate, onOpenAR }) => {
  const [categories, setCategories] = useState<CultureCategoryMeta[]>([]);
  const [regions, setRegions] = useState<CultureRegion[]>([]);
  const [items, setItems] = useState<CultureItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<CultureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CultureItem | null>(null);

  const [filter, setFilter] = useState<CultureFilter>({
    category: 'all',
    region: 'all',
    searchQuery: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Parse path to determine current view state
  const pathParts = currentPath.split('/').filter(Boolean); // ['culture', 'dance', 'id']
  const isLandingPage = currentPath === '/culture' || pathParts.length <= 1;
  const activeCategoryParam = pathParts[1] as CultureCategory | undefined; // 'dance', 'music', etc.
  const activeIdParam = pathParts[2] as string | undefined;

  // Sync route changes & fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cats = getCultureCategories();
      setCategories(cats);

      const regList = await getCultureRegions();
      setRegions(regList);

      const feat = await getFeaturedCulture();
      setFeaturedItems(feat);

      if (activeCategoryParam && activeIdParam) {
        // Single Detail Page view
        const item = await getCultureItem(activeCategoryParam, activeIdParam);
        setSelectedItem(item);
      } else {
        setSelectedItem(null);
        // Category grid view or Search view
        const currentCategory = activeCategoryParam || filter.category;
        const fetchedItems = await getCultureItems({
          ...filter,
          category: currentCategory === 'all' ? undefined : currentCategory,
        });
        setItems(fetchedItems);
      }
    } catch (err) {
      console.error('Failed to load culture data from service:', err);
      setError('Failed to communicate with Smarak XR culture backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPath, filter]);

  // Handler for category card click
  const handleCategoryClick = (route: string) => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(523, 1.2);
    setFilter((prev) => ({ ...prev, category: route.replace('/culture/', '') as CultureCategory }));
    onNavigate(route);
  };

  // Handler for item click
  const handleItemClick = (category: string, id: string) => {
    onNavigate(`/culture/${category}/${id}`);
  };

  // Handler for region card click
  const handleRegionClick = (regionId: string) => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(587, 1.2);
    setFilter((prev) => ({ ...prev, region: regionId }));
    const target = document.getElementById('culture-search-filter-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  // Render Single Detail Page View
  if (activeCategoryParam && activeIdParam) {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;
    if (!selectedItem) {
      return (
        <div className="w-full pt-24 pb-12">
          <EmptyState
            category={activeCategoryParam}
            customTitle="Culture Item Not Found"
            customMessage="This cultural experience is not available in the current backend database."
            onBackToCultureClick={() => onNavigate('/culture')}
            onExploreOtherClick={() => onNavigate('/culture')}
          />
        </div>
      );
    }

    return (
      <div className="w-full pt-20 pb-12">
        <CultureDetailPage
          item={selectedItem}
          onBack={() => onNavigate(`/culture/${activeCategoryParam}`)}
          onLaunchAR={onOpenAR}
        />
      </div>
    );
  }

  // Render Specific Category Page View (e.g., /culture/dance, /culture/music, /culture/food, etc.)
  if (activeCategoryParam && !isLandingPage) {
    const activeCategoryMeta = categories.find((c) => c.id === activeCategoryParam);

    return (
      <div className="w-full pt-16 pb-16">
        <CultureHero
          categoryTitle={activeCategoryMeta?.title || activeCategoryParam}
          categorySubtitle={activeCategoryMeta?.shortDescription}
          onExploreClick={() => {
            const el = document.getElementById('culture-content-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <div id="culture-search-filter-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Back button to main Culture Landing Page */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                triggerHaptic('tap');
                onNavigate('/culture');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-royal border border-amber-500/30 text-amber-300 text-xs font-bold hover:text-white cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Culture Main</span>
            </button>

            <span className="text-xs font-semibold text-amber-300/70">
              Showing Category: <strong className="text-amber-400 uppercase">{activeCategoryParam}</strong>
            </span>
          </div>

          <SearchBar
            value={filter.searchQuery || ''}
            onChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
            placeholder={`Search ${activeCategoryMeta?.title || activeCategoryParam} traditions, regions...`}
          />

          <FilterBar filter={filter} regions={regions} onChange={setFilter} />

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchData} />
          ) : (
            <CultureGrid
              items={items}
              category={activeCategoryParam}
              onItemClick={handleItemClick}
              onBackToCultureClick={() => onNavigate('/culture')}
              onExploreOtherClick={() => onNavigate('/culture')}
            />
          )}
        </div>
      </div>
    );
  }

  // Render Main Culture Landing Page View (/culture)
  return (
    <div className="w-full pt-16 pb-16">
      {/* 1. Hero Section */}
      <CultureHero
        onExploreClick={() => {
          const el = document.getElementById('culture-categories-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* 2. Culture Categories Grid Section */}
        <section id="culture-categories-grid" className="scroll-mt-24">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Cultural Traditions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-black text-white">
              CULTURAL <span className="gold-gradient-text">EXPERIENCES</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 font-outfit max-w-2xl mt-2">
              Select a category to explore living Indian traditions, performances, culinary legacies, and sacred crafts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={handleCategoryClick}
                itemCount={items.filter((i) => i.category === cat.id).length}
              />
            ))}
          </div>
        </section>

        {/* 3. Search & Filter Bar for Landing Page */}
        <section id="culture-search-filter-section" className="scroll-mt-24 pt-4">
          <SearchBar
            value={filter.searchQuery || ''}
            onChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
          />
          <FilterBar filter={filter} regions={regions} onChange={setFilter} />

          {/* Render Filtered Culture Grid or Category Empty State */}
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchData} />
          ) : items.length > 0 ? (
            <CultureGrid items={items} onItemClick={handleItemClick} />
          ) : null}
        </section>

        {/* 4. Featured Culture Section (Dynamic / Backend Driven) */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Highlights</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
                Featured Cultural Experiences
              </h3>
            </div>
          </div>

          {featuredItems.length > 0 ? (
            <CultureGrid items={featuredItems} onItemClick={handleItemClick} />
          ) : (
            <EmptyState
              category="featured"
              onBackToCultureClick={() => {
                const el = document.getElementById('culture-categories-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </section>

        {/* 5. Explore by Region Section */}
        <section className="py-4">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Regional Cultural Map</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-black text-white">
              EXPLORE BY <span className="gold-gradient-text">REGION</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 font-outfit max-w-xl mt-1">
              Discover unique traditional arts, food, music, and heritage across India's diverse states.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {regions.map((reg) => (
              <RegionCard key={reg.id} region={reg} onClick={handleRegionClick} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
