import type { UserProfile, StoryItem } from '../types/heritageAlive';
import { PRESERVED_STORIES } from '../data/heritageAliveData';

const INITIAL_PROFILE: UserProfile = {
  name: 'Sourav Preet',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  title: 'Culture Guardian',
  points: 420,
  level: 4,
  levelName: 'Culture Guardian',
  traditionsDiscovered: 48,
  storiesPreserved: 12,
  heritageAdopted: 3,
  challengesCompleted: 7,
  adoptedIds: ['adopt-folk-song'],
  badges: [
    { id: 'b1', name: 'Heritage Explorer', icon: '🏛️', description: 'Discovered 25+ cultural traditions', unlocked: true },
    { id: 'b2', name: 'Story Keeper', icon: '🎤', description: 'Preserved 10+ community stories', unlocked: true },
    { id: 'b3', name: 'Culture Guardian', icon: '🧑‍🎨', description: 'Adopted 3+ vanishing heritages', unlocked: true },
    { id: 'b4', name: 'Cultural Ambassador', icon: '🌍', description: 'Shared traditions across 5 regions', unlocked: false },
  ],
};

const STORAGE_PROFILE_KEY = 'heritage_alive_profile';
const STORAGE_STORIES_KEY = 'heritage_alive_user_stories';
const STORAGE_AUTH_KEY = 'smarak_user';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeState(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function isUserLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isLoggedIn) return true;
    }
  } catch {
    // fallback
  }
  return false;
}

export function getUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
  notify();
}

export function loginUser(
  name: string,
  email?: string,
  roleTitle?: string,
  avatarUrl?: string,
  points?: number,
  level?: number
): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = {
    ...current,
    name: name.trim() || 'Vansh',
    email: email || '',
    title: roleTitle || current.title,
    levelName: roleTitle || current.levelName,
    avatar: avatarUrl || current.avatar,
    points: points !== undefined ? points : current.points,
    level: level !== undefined ? level : current.level,
    isLoggedIn: true,
  };

  try {
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify({
      name: updated.name,
      email: updated.email,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    }));
  } catch {
    // ignore
  }

  saveUserProfile(updated);
  return updated;
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_AUTH_KEY);
    const current = getUserProfile();
    const loggedOut: UserProfile = {
      ...current,
      isLoggedIn: false,
    };
    saveUserProfile(loggedOut);
  } catch {
    // ignore
  }
}

export function addPoints(pts: number, reason?: string): UserProfile {
  const profile = getUserProfile();
  const newPoints = profile.points + pts;
  const newLevel = Math.floor(newPoints / 100) + 1;
  const levelNames = ['Novice Explorer', 'Culture Advocate', 'Heritage Custodian', 'Culture Guardian', 'Master Storyteller', 'Legendary Ambassador'];
  const levelName = levelNames[Math.min(newLevel - 1, levelNames.length - 1)];

  const updated: UserProfile = {
    ...profile,
    points: newPoints,
    level: newLevel,
    levelName: levelName,
  };

  saveUserProfile(updated);
  return updated;
}

export function toggleAdoptHeritage(itemId: string): boolean {
  const profile = getUserProfile();
  const isAdopted = profile.adoptedIds.includes(itemId);
  let updatedAdopted = [...profile.adoptedIds];

  if (isAdopted) {
    updatedAdopted = updatedAdopted.filter((id) => id !== itemId);
  } else {
    updatedAdopted.push(itemId);
    addPoints(20, 'Adopted a Heritage');
  }

  const updated: UserProfile = {
    ...getUserProfile(),
    adoptedIds: updatedAdopted,
    heritageAdopted: updatedAdopted.length,
  };

  saveUserProfile(updated);
  return !isAdopted;
}

export function getUserStories(): StoryItem[] {
  let userStories: StoryItem[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_STORIES_KEY);
    if (saved) userStories = JSON.parse(saved);
  } catch {
    userStories = [];
  }
  return [...userStories, ...PRESERVED_STORIES];
}

export function addUserStory(story: StoryItem): void {
  let existing: StoryItem[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_STORIES_KEY);
    if (saved) existing = JSON.parse(saved);
  } catch {
    existing = [];
  }
  const updatedList = [story, ...existing];
  try {
    localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  const profile = getUserProfile();
  const updatedProfile: UserProfile = {
    ...profile,
    storiesPreserved: profile.storiesPreserved + 1,
  };
  saveUserProfile(updatedProfile);
  addPoints(50, 'Preserved a Story');
}
