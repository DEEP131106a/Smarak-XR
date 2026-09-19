export type RegionType = 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';

export type TimelineEvent = {
  id: string;
  period: string;
  title: string;
  description: string;
  significance?: string;
};

export type PlaceToVisit = {
  id: string;
  name: string;
  category: 'monument' | 'nature' | 'temple' | 'heritage' | 'fort' | 'museum';
  shortDescription: string;
  fullDescription?: string;
  location?: string;
  imagePlaceholder?: string;
  arAvailable?: boolean;
};

export type CulturalEntry = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  history?: string;
  traditions?: string[];
  ingredients?: string[];
  materials?: string[];
  costumeDetails?: string;
  occasions?: string[];
  mediaStatus: 'coming_soon' | 'available';
  imagePlaceholder?: string;
  videoPlaceholderText?: string;
  audioPlaceholderText?: string;
};

export type CityCultureData = {
  food: CulturalEntry[];
  dance: CulturalEntry[];
  music: CulturalEntry[];
  clothing: CulturalEntry[];
  crafts: CulturalEntry[];
  festivals: CulturalEntry[];
  stories: CulturalEntry[];
};

export type CityItem = {
  id: string;
  stateId: string;
  stateName: string;
  name: string;
  hindiName?: string;
  tagline: string;
  description: string;
  heroPlaceholder?: string;
  historyTimeline: TimelineEvent[];
  placesToVisit: PlaceToVisit[];
  culture: CityCultureData;
  galleryImages: { id: string; title: string; caption: string }[];
  videoCount: number;
  arEnabled?: boolean;
};

export type StateItem = {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  description: string;
  region: RegionType;
  capital: string;
  heroPlaceholder?: string;
  overview: string;
  historyTimeline: TimelineEvent[];
  cultureOverview: {
    foodSummary: string;
    danceSummary: string;
    musicSummary: string;
    clothingSummary: string;
    craftsSummary: string;
    festivalsSummary: string;
    storiesSummary: string;
  };
  featuredCities: string[]; // city IDs
};

export type ExploreFilter = {
  stateId?: string | 'all';
  cityId?: string | 'all';
  category?: 'all' | 'food' | 'dance' | 'music' | 'clothing' | 'crafts' | 'festivals' | 'stories' | 'places' | 'history' | 'ar';
  searchQuery?: string;
};
