import React from 'react';
import type { CultureItem } from '../../types/culture';
import { CultureCard } from './CultureCard';
import { EmptyState } from './EmptyState';

interface Props {
  items: CultureItem[];
  category?: string;
  onItemClick: (category: string, id: string) => void;
  onExploreOtherClick?: () => void;
  onBackToCultureClick?: () => void;
}

export const CultureGrid: React.FC<Props> = ({
  items,
  category,
  onItemClick,
  onExploreOtherClick,
  onBackToCultureClick,
}) => {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        category={category}
        onExploreOtherClick={onExploreOtherClick}
        onBackToCultureClick={onBackToCultureClick}
      />
    );
  }

  return (
    <div
      id="culture-content-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto my-8"
    >
      {items.map((item) => (
        <CultureCard key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
};
