import React from 'react';
import { Search, X } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Search dances, instruments, food, attire, regions...',
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-amber-400/70 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl glass-royal border border-amber-500/30 text-white placeholder-amber-200/40 text-sm font-outfit focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-xl"
        />
        {value && (
          <button
            onClick={() => {
              triggerHaptic('tap');
              onChange('');
            }}
            className="absolute right-3.5 p-1 rounded-full text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
