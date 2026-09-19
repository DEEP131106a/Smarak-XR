import type {
  StateItem,
  CityItem,
  ExploreFilter,
} from '../types/explore';
import { STATES_DATA } from '../data/explore/statesData';
import { CITIES_DATA } from '../data/explore/citiesData';

/**
 * Service function to retrieve all states
 */
export async function getExploreStates(): Promise<StateItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return STATES_DATA;
}

/**
 * Service function to retrieve a specific state by ID
 */
export async function getExploreState(stateId: string): Promise<StateItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const found = STATES_DATA.find(
    (s) => s.id.toLowerCase() === stateId.toLowerCase()
  );
  return found || null;
}

/**
 * Service function to retrieve cities belonging to a state
 */
export async function getExploreCities(stateId: string): Promise<CityItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return CITIES_DATA.filter(
    (c) => c.stateId.toLowerCase() === stateId.toLowerCase()
  );
}

/**
 * Service function to retrieve a specific city by stateId and cityId
 */
export async function getExploreCity(
  stateId: string,
  cityId: string
): Promise<CityItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const found = CITIES_DATA.find(
    (c) =>
      c.stateId.toLowerCase() === stateId.toLowerCase() &&
      c.id.toLowerCase() === cityId.toLowerCase()
  );
  return found || null;
}

/**
 * Global explore search querying states, cities, places, food, dance, music, etc.
 */
export async function searchExplore(filter: ExploreFilter): Promise<{
  states: StateItem[];
  cities: CityItem[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let matchedStates = [...STATES_DATA];
  let matchedCities = [...CITIES_DATA];

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
