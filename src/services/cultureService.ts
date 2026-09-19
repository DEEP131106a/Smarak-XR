import type {
  CultureCategoryMeta,
  CultureItem,
  CultureRegion,
  CultureFilter,
} from '../types/culture';

// Reusable Categories definition for frontend layout & navigation
export const CULTURE_CATEGORIES: CultureCategoryMeta[] = [
  {
    id: 'dance',
    title: 'Dance',
    tagline: 'Rhythms of Ancient Traditions',
    shortDescription: 'Experience traditional performances and learn their stories.',
    iconName: 'Sparkles',
    route: '/culture/dance',
    accentColor: 'from-amber-500 to-orange-600',
    recommendedOrder: 1,
  },
  {
    id: 'music',
    title: 'Music',
    tagline: 'Soundscapes of Sacred Heritage',
    shortDescription: 'Discover traditional instruments, sounds and musical traditions.',
    iconName: 'Music',
    route: '/culture/music',
    accentColor: 'from-rose-500 to-amber-600',
    recommendedOrder: 2,
  },
  {
    id: 'food',
    title: 'Food',
    tagline: 'Flavors & Culinary Legacies',
    shortDescription: 'Explore regional dishes, preparation and culinary traditions.',
    iconName: 'Utensils',
    route: '/culture/food',
    accentColor: 'from-emerald-500 to-teal-600',
    recommendedOrder: 3,
  },
  {
    id: 'clothing',
    title: 'Clothing & Textiles',
    tagline: 'Weaves & Sacred Attire',
    shortDescription: 'Discover traditional clothing, textiles and craftsmanship.',
    iconName: 'Shirt',
    route: '/culture/clothing',
    accentColor: 'from-indigo-500 to-purple-600',
    recommendedOrder: 4,
  },
  {
    id: 'crafts',
    title: 'Arts & Crafts',
    tagline: 'Stone, Metal & Handcrafted Marvels',
    shortDescription: 'Explore traditional art forms and handmade crafts.',
    iconName: 'Palette',
    route: '/culture/crafts',
    accentColor: 'from-amber-400 to-yellow-600',
    recommendedOrder: 5,
  },
  {
    id: 'festivals',
    title: 'Festivals',
    tagline: 'Celebrations & Sacred Gatherings',
    shortDescription: 'Discover festivals, traditions and celebrations.',
    iconName: 'Calendar',
    route: '/culture/festivals',
    accentColor: 'from-orange-500 to-rose-600',
    recommendedOrder: 6,
  },
  {
    id: 'stories',
    title: 'Cultural Stories',
    tagline: 'Legends, Myths & Folklore',
    shortDescription: 'Explore cultural stories, legends and traditions.',
    iconName: 'BookOpen',
    route: '/culture/stories',
    accentColor: 'from-cyan-500 to-blue-600',
    recommendedOrder: 7,
  },
];

// Backend-driven regional master list (can be populated dynamically via API)
export const DEFAULT_CULTURE_REGIONS: CultureRegion[] = [
  { id: 'punjab', name: 'Punjab', hindiName: 'पंजाब', description: 'Land of Five Rivers, vibrant folk dances, and celebratory heritage.' },
  { id: 'rajasthan', name: 'Rajasthan', hindiName: 'राजस्थान', description: 'Royal fortresses, desert melodies, puppet arts, and royal attire.' },
  { id: 'gujarat', name: 'Gujarat', hindiName: 'गुजरात', description: 'Navratri rhythms, Patola silk weaving, and vibrant festive traditions.' },
  { id: 'kerala', name: 'Kerala', hindiName: 'केरल', description: 'Kathakali classical drama, temple percussion, and coastal traditions.' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', hindiName: 'तमिलनाडु', description: 'Bharatanatyam, Chola bronzes, Carnatic music, and Dravidian heritage.' },
  { id: 'west-bengal', name: 'West Bengal', hindiName: 'पश्चिम बंगाल', description: 'Durga Puja marvels, Rabindra Sangeet, Kantha embroidery, and baul tunes.' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', hindiName: 'उत्तर प्रदेश', description: 'Kathak classical dance, Banarasi silk, and ancient spiritual heritage.' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', hindiName: 'हिमाचल प्रदेश', description: 'Himachali folk tunes, Pahari miniature paintings, and mountain fairs.' },
  { id: 'assam', name: 'Assam', hindiName: 'असम', description: 'Bihu dance, Muga silk weaving, and Brahmaputra river folklore.' },
  { id: 'maharashtra', name: 'Maharashtra', hindiName: 'महाराष्ट्र', description: 'Lavani folk rhythms, Paithani sarees, and Ganesh Utsav fervor.' },
];

// In-memory / dynamic store for culture items received from backend API
let cultureItemsStore: CultureItem[] = [];

/**
 * Service function to retrieve all culture categories metadata
 */
export function getCultureCategories(): CultureCategoryMeta[] {
  return CULTURE_CATEGORIES;
}

/**
 * Service function to query culture items from backend / dynamic store
 */
export async function getCultureItems(filter?: CultureFilter): Promise<CultureItem[]> {
  // Simulating network fetch delay for realistic API architecture handling
  await new Promise((resolve) => setTimeout(resolve, 150));

  let results = [...cultureItemsStore];

  if (!filter) return results;

  if (filter.category && filter.category !== 'all') {
    results = results.filter((item) => item.category === filter.category);
  }

  if (filter.region && filter.region !== 'all') {
    results = results.filter(
      (item) => item.region.toLowerCase() === filter.region?.toLowerCase()
    );
  }

  if (filter.arEnabled) {
    results = results.filter((item) => item.arEnabled === true);
  }

  if (filter.featured) {
    results = results.filter((item) => item.featured === true);
  }

  if (filter.mediaType && filter.mediaType !== 'all') {
    results = results.filter((item) => {
      switch (filter.mediaType) {
        case 'video':
          return item.videos && item.videos.length > 0;
        case 'audio':
          return item.audio && item.audio.length > 0;
        case 'image':
          return item.images && item.images.length > 0;
        case 'model3d':
          return !!item.model3d;
        case 'ar':
          return !!item.arEnabled;
        default:
          return true;
      }
    });
  }

  if (filter.searchQuery && filter.searchQuery.trim() !== '') {
    const q = filter.searchQuery.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  return results;
}

/**
 * Service function to fetch a single culture item by category & id
 */
export async function getCultureItem(category: string, id: string): Promise<CultureItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const found = cultureItemsStore.find(
    (item) => item.id === id && item.category === category
  );
  return found || null;
}

/**
 * Service function to get featured culture items
 */
export async function getFeaturedCulture(): Promise<CultureItem[]> {
  return getCultureItems({ featured: true });
}

/**
 * Service function to fetch backend-driven regional list
 */
export async function getCultureRegions(): Promise<CultureRegion[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return DEFAULT_CULTURE_REGIONS;
}

/**
 * Service function to search culture items
 */
export async function searchCulture(query: string): Promise<CultureItem[]> {
  return getCultureItems({ searchQuery: query });
}

/**
 * Helper to allow backend or local admin simulator to register items
 */
export function registerBackendCultureItems(items: CultureItem[]): void {
  cultureItemsStore = [...items];
}
