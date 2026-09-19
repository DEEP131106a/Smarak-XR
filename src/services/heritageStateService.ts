import type { UserProfile, StoryItem } from '../types/heritageAlive';
import { PRESERVED_STORIES } from '../data/heritageAliveData';

const INITIAL_PROFILE: UserProfile = {
  name: 'Guest',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  title: 'Novice Explorer',
  points: 0,
  level: 1,
  levelName: 'Novice Explorer',
  traditionsDiscovered: 0,
  storiesPreserved: 0,
  heritageAdopted: 0,
  challengesCompleted: 0,
  adoptedIds: [],
  badges: [],
  isLoggedIn: false,
  isAdmin: false
};

const STORAGE_USERS_DB_KEY = 'smarak_users_db';
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

// --- DATABASE FUNCTIONS ---
function getUsersDB(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveUsersDB(db: Record<string, UserProfile>) {
  try {
    localStorage.setItem(STORAGE_USERS_DB_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

export function isUserLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return !!parsed.isLoggedIn;
    }
  } catch {
    // fallback
  }
  return false;
}

function getActiveUsername(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.isLoggedIn && parsed.name) return parsed.name;
    }
  } catch {}
  return null;
}

export function getUserProfile(): UserProfile {
  const activeUser = getActiveUsername();
  if (!activeUser) return INITIAL_PROFILE;

  const db = getUsersDB();
  if (db[activeUser]) {
    // Make sure transient state isLoggedIn is correct
    return { ...db[activeUser], isLoggedIn: true };
  }
  
  return INITIAL_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  const db = getUsersDB();
  db[profile.name] = profile;
  saveUsersDB(db);
  notify();
}

export function loginUser(
  name: string,
  email?: string,
  roleTitle?: string,
  avatarUrl?: string,
  points?: number,
  level?: number,
  isAdmin?: boolean
): UserProfile {
  const db = getUsersDB();
  const existingProfile = db[name];

  const updated: UserProfile = {
    ...(existingProfile || INITIAL_PROFILE),
    name: name.trim(),
    email: email || existingProfile?.email || '',
    title: roleTitle || existingProfile?.title || 'Culture Guardian',
    levelName: roleTitle || existingProfile?.levelName || 'Culture Guardian',
    avatar: avatarUrl || existingProfile?.avatar || INITIAL_PROFILE.avatar,
    points: points !== undefined ? points : (existingProfile?.points || 0),
    level: level !== undefined ? level : (existingProfile?.level || 1),
    isLoggedIn: true,
    isAdmin: isAdmin ?? false,
  };

  try {
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify({
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
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
    notify();
  } catch {
    // ignore
  }
}

export function addPoints(pts: number, reason?: string, targetUsername?: string): UserProfile | null {
  const db = getUsersDB();
  const usernameToUpdate = targetUsername || getActiveUsername();
  
  if (!usernameToUpdate || !db[usernameToUpdate]) return null;

  const profile = db[usernameToUpdate];
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

  db[usernameToUpdate] = updated;
  saveUsersDB(db);
  
  if (usernameToUpdate === getActiveUsername()) {
    notify();
  }
  return updated;
}

export function toggleAdoptHeritage(itemId: string): boolean {
  const profile = getUserProfile();
  if (!profile.isLoggedIn) return false;

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
  if (profile.isLoggedIn) {
    const updatedProfile: UserProfile = {
      ...profile,
      storiesPreserved: profile.storiesPreserved + 1,
    };
    saveUserProfile(updatedProfile);
    // Note: We don't add points immediately anymore! Points are added when verified.
  }
}

export function updateUserStoryStatus(storyId: string, status: 'verified' | 'rejected'): void {
  let existing: StoryItem[] = [];
  try {
    const saved = localStorage.getItem(STORAGE_STORIES_KEY);
    if (saved) existing = JSON.parse(saved);
  } catch {
    return;
  }
  
  let authorIdToReward: string | undefined;

  const updatedList = existing.map(story => {
    if (story.id === storyId) {
      if (status === 'verified' && story.status === 'pending') {
        authorIdToReward = story.authorId || story.preservedBy;
      }
      return { ...story, status };
    }
    return story;
  });
  
  try {
    localStorage.setItem(STORAGE_STORIES_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  // Inject points to the author if verified
  if (authorIdToReward && status === 'verified') {
    addPoints(50, 'Story Verified by Admin', authorIdToReward);
  }

  notify();
}
