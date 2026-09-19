import React from 'react';
import { Home, Compass, MapPin, HeartHandshake, User } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ activePage, onNavigate }) => {
  const handleClick = (page: string) => {
    triggerHaptic('tap');
    onNavigate(page);
  };

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1017]/95 backdrop-blur-2xl border-t border-[#d4af37]/30 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => handleClick('home')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${
            activePage === 'home' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => handleClick('discover')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${
            activePage === 'discover' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Discover</span>
        </button>

        <button
          onClick={() => handleClick('cities')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${
            activePage === 'cities' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Cities</span>
        </button>

        <button
          onClick={() => handleClick('adopt')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${
            activePage === 'adopt' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-semibold">Adopt</span>
        </button>

        <button
          onClick={() => handleClick('profile')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer transition-colors ${
            activePage === 'profile' ? 'text-[#d4af37]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </nav>
  );
};
