import React from 'react';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  onExploreClick?: () => void;
  categoryTitle?: string;
  categorySubtitle?: string;
}

export const CultureHero: React.FC<Props> = ({
  onExploreClick,
  categoryTitle,
  categorySubtitle,
}) => {
  const handleCtaClick = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(587.33, 2.0);
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById('culture-categories-grid') || document.getElementById('culture-content-grid');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden bg-[#080912]">
      {/* Background Decorative Mandala Rings & Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full border border-amber-500/10 animate-spin-slow" />
        <div className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full border border-orange-500/15 animate-spin-reverse-slow" />
        <div className="absolute w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] rounded-full border border-amber-400/20" />
        {/* Ambient Radial Lighting Glow */}
        <div className="absolute w-[450px] h-[450px] bg-radial from-amber-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Smarak XR • Living Cultural Heritage</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-tight text-white mb-3 leading-none">
          {categoryTitle ? (
            <>
              {categoryTitle.toUpperCase()} <span className="gold-gradient-text">HERITAGE</span>
            </>
          ) : (
            <>
              EXPERIENCE INDIA'S <span className="gold-gradient-text">LIVING CULTURE</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="font-yatra text-lg sm:text-2xl text-amber-400/90 tracking-wide mb-4">
          भारतीय संस्कृति, कला एवं परंपराएं
        </p>

        {/* Description */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-amber-100/80 font-outfit leading-relaxed mb-8">
          {categorySubtitle ||
            'Discover the traditions, art, music, food, clothing and stories that make every region unique.'}
        </p>

        {/* CTA Button */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleCtaClick}
            className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-sm sm:text-base shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Explore Culture</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Badge Indicator */}
        <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-amber-300/70 glass-royal px-4 py-2 rounded-full border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Content-Driven Architecture • Ready for Backend Dynamic Uploads</span>
        </div>
      </div>
    </section>
  );
};
