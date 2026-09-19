import type { Monument, SacredCreature } from '../types';

const API_BASE = '/api';

export interface AuthUser {
  id: string; username: string; email: string; name: string; role: string;
  specialization?: string; isAdmin: boolean; avatar?: string | null; points: number; level: number;
}

export interface HeritageReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  pointsRequired: number;
  fulfillment: 'DIGITAL' | 'PHYSICAL';
  unlocked: boolean;
  redeemed: boolean;
  redemptionStatus: string | null;
}

export function getAuthToken(): string | null {
  return null;
}

export function clearAuthToken(): void {
  void apiFetch('/auth/logout', { method: 'POST' }).catch(() => undefined);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const token = getAuthToken();
  if (token) headers.set('Authorization', 'Bearer ' + token);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

async function authRequest(path: string, body: Record<string, string>) {
  const data = await apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as { user: AuthUser };
  return data;
}

export const apiService = {
  register: (username: string, email: string, name: string, password: string, specialization = 'Explorer') =>
    authRequest('/auth/register', { username, email, name, password, specialization }),
  login: (identifier: string, password: string) => authRequest('/auth/login', { identifier, password }),
  getProfile: () => apiFetch('/profile/me'),
  getRewards: (): Promise<{ rewards: HeritageReward[] }> => apiFetch('/rewards') as Promise<{ rewards: HeritageReward[] }>,
  redeemReward: (rewardId: string) => apiFetch(`/rewards/${encodeURIComponent(rewardId)}/redeem`, { method: 'POST' }),
  updateProfile: (data: { name?: string; avatar?: string }) => apiFetch('/profile/me', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }),
  getCultureCategories: (): Promise<string[]> => apiFetch('/culture/categories') as Promise<string[]>,
  getCultureRegions: () => apiFetch('/culture/regions'),
  getCultureItems: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/culture/items${query ? `?${query}` : ''}`);
  },
  getCultureItem: (id: string) => apiFetch(`/culture/items/${encodeURIComponent(id)}`),
  getExploreStates: () => apiFetch('/explore/states'),
  getExploreState: (id: string) => apiFetch(`/explore/states/${encodeURIComponent(id)}`),
  getExploreCities: (stateId: string) => apiFetch(`/explore/states/${encodeURIComponent(stateId)}/cities`),
  getAllExploreCities: () => apiFetch('/cities'),
  getExploreCity: (id: string) => apiFetch(`/explore/cities/${encodeURIComponent(id)}`),
  getMyStories: () => apiFetch('/heritage/stories/me'),
  getPublicStories: () => apiFetch('/heritage/stories'),
  createStory: (story: Record<string, unknown>) => apiFetch('/heritage/stories', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(story),
  }),
  reviewStory: (id: string) => apiFetch(`/heritage/stories/${encodeURIComponent(id)}/review`, { method: 'POST' }),
  getModerationStories: () => apiFetch('/admin/moderation/stories'),
  moderateStory: (id: string, status: 'APPROVED' | 'REJECTED', note?: string) => apiFetch(`/admin/moderation/stories/${encodeURIComponent(id)}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, note }),
  }),
  getAdoptions: () => apiFetch('/adoptions/me'),
  adopt: (itemId: string) => apiFetch(`/adoptions/${encodeURIComponent(itemId)}`, { method: 'POST' }),
  updateAdoption: (itemId: string, completedTasks: string[], status?: string) => apiFetch(`/adoptions/${encodeURIComponent(itemId)}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completedTasks, status }),
  }),
  deleteAdoption: (itemId: string) => apiFetch(`/adoptions/${encodeURIComponent(itemId)}`, { method: 'DELETE' }),
  getMonuments: (): Promise<Monument[]> => apiFetch('/monuments') as Promise<Monument[]>,
  getMonumentById: (id: string): Promise<Monument> => apiFetch(`/monuments/${id}`) as Promise<Monument>,
  getCreatures: (): Promise<SacredCreature[]> => apiFetch('/creatures') as Promise<SacredCreature[]>,
  getCities: (): Promise<any[]> => apiFetch('/cities') as Promise<any[]>,
  getCityById: (id: string): Promise<any> => apiFetch(`/cities/${id}`),
  getHeritageItems: (): Promise<any[]> => apiFetch('/heritage/items') as Promise<any[]>,
  getAdoptItems: (params: Record<string, string> = {}): Promise<any[]> => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/heritage/adopt${query ? `?${query}` : ''}`) as Promise<any[]>;
  },
  getStoryItems: (): Promise<any[]> => apiFetch('/heritage/stories') as Promise<any[]>,
  submitNewMonument: (data: any): Promise<any> => apiFetch('/submissions/monuments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }),
  getPendingSubmissions: (): Promise<any> => apiFetch('/admin/submissions'),
  verifySubmission: (id: string, status: 'APPROVED' | 'REJECTED'): Promise<any> => apiFetch(`/admin/submissions/${id}/verify`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
  }),
};
