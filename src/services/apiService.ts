import type { Monument, SacredCreature } from '../types';

const API_BASE = '/api';

export const apiService = {
  async getMonuments(): Promise<Monument[]> {
    const response = await fetch(`${API_BASE}/monuments`);
    if (!response.ok) throw new Error('Failed to fetch monuments');
    return response.json();
  },

  async getMonumentById(id: string): Promise<Monument> {
    const response = await fetch(`${API_BASE}/monuments/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch monument with id ${id}`);
    return response.json();
  },

  async getCreatures(): Promise<SacredCreature[]> {
    const response = await fetch(`${API_BASE}/creatures`);
    if (!response.ok) throw new Error('Failed to fetch creatures');
    return response.json();
  },

  async getCities(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/cities`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return response.json();
  },

  async getCityById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE}/cities/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch city with id ${id}`);
    return response.json();
  },

  async getHeritageItems(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/heritage/items`);
    if (!response.ok) throw new Error('Failed to fetch heritage items');
    return response.json();
  },

  async getAdoptItems(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/heritage/adopt`);
    if (!response.ok) throw new Error('Failed to fetch adopt items');
    return response.json();
  },

  async getStoryItems(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/heritage/stories`);
    if (!response.ok) throw new Error('Failed to fetch story items');
    return response.json();
  },

  // --- SUBMISSION & ADMIN API ---

  async submitNewMonument(monumentData: any): Promise<any> {
    const response = await fetch(`${API_BASE}/submissions/monuments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monumentData)
    });
    if (!response.ok) throw new Error('Failed to submit monument');
    return response.json();
  },

  async getPendingSubmissions(adminKey: string = 'secret123'): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/submissions?adminKey=${adminKey}`);
    if (!response.ok) throw new Error('Failed to fetch pending submissions');
    return response.json();
  },

  async verifySubmission(id: string, status: 'APPROVED' | 'REJECTED', adminKey: string = 'secret123'): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/submissions/${id}/verify?adminKey=${adminKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to verify submission');
    return response.json();
  }
};
