import type {
  StateItem,
  CityItem,
  ExploreFilter,
} from '../types/explore';
import { apiService } from './apiService';

/**
 * Service function to retrieve all states
 */
export async function getExploreStates(): Promise<StateItem[]> {
  return apiService.getExploreStates();
}

/**
 * Service function to retrieve a specific state by ID
 */
export async function getExploreState(stateId: string): Promise<StateItem | null> {
  return apiService.getExploreState(stateId);
}

/**
 * Service function to retrieve cities belonging to a state
 */
export async function getExploreCities(stateId: string): Promise<CityItem[]> {
  return apiService.getExploreCities(stateId);
}

/**
 * Service function to retrieve a specific city by stateId and cityId
 */
export async function getExploreCity(
  stateId: string,
  cityId: string
): Promise<CityItem | null> {
  const city = await apiService.getExploreCity(cityId);
  return city.stateId.toLowerCase() === stateId.toLowerCase() ? city : null;
}

/**
 * Global explore search querying states, cities, places, food, dance, music, etc.
 */
export async function searchExplore(filter: ExploreFilter): Promise<{
  states: StateItem[];
  cities: CityItem[];
}> {
  const [allStates, allCities] = await Promise.all([
    apiService.getExploreStates() as Promise<StateItem[]>,
    apiService.getAllExploreCities() as Promise<CityItem[]>,
  ]);
  let matchedStates = [...allStates];
  let matchedCities = [...allCities];

  if (filter.stateId && filter.stateId !== 'all') {
    matchedStates = matchedStates.filter((s) => s.id === filter.stateId);
    matchedCities = matchedCities.filter((c) => c.stateId === filter.stateId);
  }

  if (filter.cityId && filter.cityId !== 'all') {
    matchedCities = matchedCities.filter((c) => c.id === filter.cityId);
  }

  if (filter.searchQuery && filter.searchQuery.trim() !== '') {
    const q = filter.searchQuery.toLowerCase().trim();
    matchedStates = matchedStates.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q)
    );

    matchedCities = matchedCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.placesToVisit.some((p) => p.name.toLowerCase().includes(q))
    );
  }

  return { states: matchedStates, cities: matchedCities };
}
