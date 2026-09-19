export type CultureStatus = 'Thriving' | 'Declining' | 'At Risk' | 'Critical';

export type CategoryType =
  | 'Craft'
  | 'Music'
  | 'Food'
  | 'Language'
  | 'Dance'
  | 'Festival'
  | 'Site'
  | 'Tradition';

export type HeritageItem = {
  id: string;
  title: string;
  subtitle?: string;
  category: CategoryType;
  region: string;
  state: string;
  status: CultureStatus;
  description: string;
  origin?: string;
  significance?: string;
  history?: string;
  image?: string;
  audioPlaceholderText?: string;
  videoPlaceholderText?: string;
  tags?: string[];
  artisanCount?: number;
  featured?: boolean;
};

export type TimeMachineEra = {
  year: number;
  eraName: string;
  clothing: string;
  architecture: string;
  food: string;
  music: string;
  lifestyle: string;
  aiVisionSummary?: string;
  image?: string;
};

export type TimeMachineLocation = {
  id: string;
  name: string;
  state: string;
  tagline: string;
  eras: {
    1950: TimeMachineEra;
    1980: TimeMachineEra;
    2026: TimeMachineEra;
    2050: TimeMachineEra;
  };
};

export type TaskItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type AdoptItem = {
  id: string;
  title: string;
  category: CategoryType;
  region: string;
  state: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  timeRequired: string;
  preservationImpact: string;
  description: string;
  tasks: TaskItem[];
  adopted: boolean;
};

export type StoryItem = {
  id: string;
  title: string;
  category: CategoryType;
  region: string;
  state: string;
  preservedBy: string;
  date: string;
  shortStory: string;
  fullStory?: string;
  mediaType: 'audio' | 'video' | 'photo' | 'written' | 'recipe';
  status: string;
  image?: string;
  audioUrl?: string;
  videoUrl?: string;
  recipeIngredients?: string[];
};

export type CommunityContributor = {
  id: string;
  rank: number;
  name: string;
  role: string;
  avatar: string;
  traditionsPreserved: number;
  badges: string[];
};

export type CommunityChallenge = {
  id: string;
  title: string;
  description: string;
  category: string;
  hindiName?: string;
  points: number;
  deadline: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
};

export type UserBadge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
};

export type UserProfile = {
  name: string;
  avatar: string;
  title: string;
  points: number;
  level: number;
  levelName: string;
  traditionsDiscovered: number;
  storiesPreserved: number;
  heritageAdopted: number;
  challengesCompleted: number;
  badges: UserBadge[];
  adoptedIds: string[];
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  email?: string;
};

export type MapPinLocation = {
  id: string;
  name: string;
  state: string;
  stateId?: string;
  coords: { x: number; y: number }; // Percentage offsets for map UI
  svgCoords?: { x: number; y: number }; // Absolute SVG viewBox coordinates (0 0 612 696)
  significance: string;
  nearbyTraditions: string[];
  category: string;
  hindiName?: string;
};

