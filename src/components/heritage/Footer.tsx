import React from 'react';
import { Heart, Sparkles, Shield, Compass, BookOpen, Clock, HeartHandshake, Users } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  const handleNav = (page: string) => {
    triggerHaptic('tap');
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#090a0f] border-t border-[#d4af37]/20 pt-16 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 text-gray-300 font-outfit">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c85a32] to-[#d4af37] flex items-center justify-center text-black font-black text-xl shadow-lg">
              🏛️
            </div>
            <div>
              <span className="font-cinzel font-black text-white text-lg tracking-wider">
                SMARAK <span className="heritage-gold-text">AI</span>
              </span>
              <p className="text-xs text-amber-300/80 font-outfit">
                Preserve. Experience. Rediscover India.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            A modern digital platform powered by modern technology, interactive storytelling, and community adoption to safeguard disappearing heritages.
          </p>
        </div>

        {/* Navigation Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">
            Platform Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('discover')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Discover Culture
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('time-machine')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Culture Time Machine
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('vanishing')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Vanishing Culture Index
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('adopt')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Adopt a Heritage
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('stories')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Preserved Stories
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('community')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                Community & Challenges
              </button>
            </li>
          </ul>
        </div>

        {/* Special Experiences */}
        <div className="space-y-3">
          <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">
            Interactive AI Features
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleNav('map')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Heritage Map</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('profile')} className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guardian Dashboard</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Hackathon Disclaimer */}
        <div className="space-y-3 p-5 rounded-2xl glass-heritage border border-[#d4af37]/30">
          <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">
            🏆 Hackathon Showcase
          </span>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            Designed as a high-impact startup prototype combining cultural preservation, gamified adoption, and futuristic AI memory vaults.
          </p>
          <div className="pt-2 border-t border-[#d4af37]/20 flex items-center gap-1 text-[11px] text-amber-200">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for Living Culture</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#d4af37]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <span>© 2026 Smarak AI Platform. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Preservation</span>
          <span className="hover:text-white cursor-pointer">UNESCO Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
