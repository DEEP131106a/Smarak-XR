export type CultureCategory =
  | 'dance'
  | 'music' | 'food'
  | 'clothing'
  | 'crafts'
  | 'festivals'
  | 'stories';

export type CultureCategoryMeta = {
  id: CultureCategory;
  title: string;
  shortDescription: string;
  tagline: string;
  iconName: string;
  route: string;
  accentColor: string;
  recommendedOrder: number;
};

export type CultureItem = {
  id: string;
  title: string;
  category: CultureCategory;
  region: string;
  description: string;
  thumbnail?: string;
  images?: string[];
  videos?: string[];
  audio?: string[];
  model3d?: string | null;
  arEnabled?: boolean;
  history?: string;
  origin?: string;
  traditions?: string[];
  tags?: string[];
  language?: string;
  featured?: boolean;
  
  // Specific category metadata fields (optional)
  ingredients?: string[];
  preparation?: string;
  culturalStory?: string;
  craftsmanship?: string;
  materials?: string[];
  artisanStory?: string;
  instrumentsUsed?: string[];
  costumeDetails?: string;
  occasions?: string[];
  patterns?: string[];
  culturalSignificance?: string;
};

export type CultureRegion = {
  id: string;
  name: string;
  hindiName?: string;
  description?: string;
  thumbnail?: string;
  featuredCategories?: CultureCategory[];
};

export type CultureFilter = {
  category?: CultureCategory | 'all';
  region?: string | 'all';
  searchQuery?: string;
  mediaType?: 'all' | 'video' | 'audio' | 'image' | 'model3d' | 'ar';
  arEnabled?: boolean;
  featured?: boolean;
};
