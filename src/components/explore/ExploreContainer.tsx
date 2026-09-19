import React, { useEffect, useState } from 'react';
import type {
  StateItem,
  CityItem,
  ExploreFilter,
} from '../../types/explore';
import {
  getExploreStates,
  getExploreState,
  getExploreCities,
  getExploreCity,
  searchExplore,
} from '../../services/exploreService';
import { ExploreLandingPage } from './ExploreLandingPage';
import { StateDetailPage } from './StateDetailPage';
import { CityDetailPage } from './CityDetailPage';
import { LoadingState } from '../culture/LoadingState';
import { ErrorState } from '../culture/ErrorState';

interface Props {
  currentPath: string; // e.g. '/explore', '/explore/maharashtra', '/explore/maharashtra/pune'
  onNavigate: (path: string) => void;
  onOpenAR: () => void;
}

export const ExploreContainer: React.FC<Props> = ({ currentPath, onNavigate, onOpenAR }) => {
  const [states, setStates] = useState<StateItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [activeState, setActiveState] = useState<StateItem | null>(null);
  const [activeCity, setActiveCity] = useState<CityItem | null>(null);

  const [filter, setFilter] = useState<ExploreFilter>({
    stateId: 'all',
    cityId: 'all',
    category: 'all',
    searchQuery: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Parse path parts: e.g. ['explore', 'maharashtra', 'pune']
  const pathParts = currentPath.split('/').filter(Boolean);
  const stateParam = pathParts[1];
  const cityParam = pathParts[2];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allStates = await getExploreStates();
      setStates(allStates);

      if (stateParam && cityParam) {
        // Render City Detail Page view (/explore/:state/:city)
        const stObj = await getExploreState(stateParam);
        const ctObj = await getExploreCity(stateParam, cityParam);
        setActiveState(stObj);
        setActiveCity(ctObj);
      } else if (stateParam) {
        // Render State Detail Page view (/explore/:state)
        const stObj = await getExploreState(stateParam);
        const stateCities = await getExploreCities(stateParam);
        setActiveState(stObj);
        setActiveCity(null);
        setCities(stateCities);
      } else {
        // Render Main Explore Landing Page view (/explore)
        setActiveState(null);
        setActiveCity(null);
        const { states: filteredStates, cities: filteredCities } = await searchExplore(filter);
        setStates(filteredStates);
        setCities(filteredCities);
      }
    } catch (err) {
      console.error('Failed to query explore service:', err);
      setError('Unable to load Explore India data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPath, filter]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // 1. Render City Detail Page (/explore/:state/:city)
  if (stateParam && cityParam) {
    if (!activeCity) {
      return (
        <div className="w-full pt-24 pb-12 text-center">
          <h3 className="text-2xl font-cinzel text-white mb-2">City Not Found</h3>
          <button
            onClick={() => onNavigate(`/explore/${stateParam}`)}
            className="px-6 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
          >
            Back to State
          </button>
        </div>
      );
    }
    return (
      <CityDetailPage
        city={activeCity}
        onNavigate={onNavigate}
        onOpenAR={onOpenAR}
      />
    );
  }

  // 2. Render State Detail Page (/explore/:state)
  if (stateParam) {
    if (!activeState) {
      return (
        <div className="w-full pt-24 pb-12 text-center">
          <h3 className="text-2xl font-cinzel text-white mb-2">State Not Found</h3>
          <button
            onClick={() => onNavigate('/explore')}
            className="px-6 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
          >
            Back to Explore India
          </button>
        </div>
      );
    }
    return (
      <StateDetailPage
        stateItem={activeState}
        cities={cities}
        onNavigate={onNavigate}
        onSelectCity={(stId, ctId) => onNavigate(`/explore/${stId}/${ctId}`)}
      />
    );
  }

  // 3. Render Main Explore Landing Page (/explore)
  return (
    <ExploreLandingPage
      states={states}
      cities={cities}
      filter={filter}
      onFilterChange={setFilter}
      onSelectState={(stId) => onNavigate(`/explore/${stId}`)}
      onSelectCity={(stId, ctId) => onNavigate(`/explore/${stId}/${ctId}`)}
      onOpenAR={onOpenAR}
    />
  );
};
