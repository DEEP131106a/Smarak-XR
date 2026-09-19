import React from 'react';
import { ChevronRight, Home, MapPin } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Crumb {
  label: string;
  path?: string;
  isCurrent?: boolean;
}

interface Props {
  items: Crumb[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<Props> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 py-2.5 px-4 rounded-xl glass-royal border border-amber-500/20 mb-6 overflow-x-auto no-scrollbar">
      <button
        onClick={() => {
          triggerHaptic('tap');
          onNavigate('/explore');
        }}
        className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>India</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500/40 shrink-0" />
          {item.isCurrent || !item.path ? (
            <span className="text-white font-bold tracking-wide shrink-0">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => {
                triggerHaptic('tap');
                onNavigate(item.path!);
              }}
              className="text-amber-300/90 hover:text-amber-200 transition-colors cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
