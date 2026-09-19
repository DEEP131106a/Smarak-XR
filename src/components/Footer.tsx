import React from 'react';
import { Heart } from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#06070d] border-t border-amber-500/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-xl shadow-amber-500/20 mb-4">
          🛕
        </div>

        <h3 className="font-cinzel font-black text-2xl text-white tracking-wider mb-1">
          SMARAK AR • HERITAGE & CULTURE
        </h3>
        <p className="font-yatra text-amber-400 text-sm mb-4">
          स्मारक एआर • भारतीय सांस्कृतिक धरोहर
        </p>

        <p className="max-w-xl text-xs text-amber-100/60 font-outfit leading-relaxed mb-8">
          Dedicated to immortalizing India’s architectural marvels and sacred stone-carved creatures in digital perpetuity through mobile WebXR, photogrammetry, and spatial computing.
        </p>

        {/* Quick Monument Links */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 text-xs">
          {[
            'Taj Mahal',
            'Konark Sun Temple',
            'Meenakshi Amman',
            'Kailasa Ellora',
            'Hawa Mahal',
            'Hampi Stone Chariot',
            'Qutub Minar',
            'Brihadisvara',
          ].map((name) => (
            <span
              key={name}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl text-xs text-gray-500 font-outfit gap-4">
          <p>© {new Date().getFullYear()} Smarak AR. Preserving the timeless soul of India.</p>

          <div className="flex items-center gap-1 text-amber-400/80">
            <span>Built with reverence for India’s glorious heritage</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
