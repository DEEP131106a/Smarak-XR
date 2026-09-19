import React from 'react';
import { Music, Utensils, Palette, ArrowRight, ShieldAlert } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  onStartPreserving: () => void;
}

export const HackathonWowMoment: React.FC<Props> = ({ onStartPreserving }) => {
  const handleClick = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(587.33, 2.0);
    onStartPreserving();
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-12">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#18121f] via-[#1f1728] to-[#0e1017] border border-[#d4af37]/40 p-8 sm:p-12 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-[#c85a32]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Time Is Running Out</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-black text-white">
            Before It Becomes a <span className="heritage-terracotta-text">Memory</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/70 font-outfit mt-2">
            Every day, elderly keepers of oral folklore, weaving secrets, and medicinal recipes pass away without a digital record.
          </p>
        </div>

        {/* 3 Emotional Cards (Section 26) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Folk Song */}
          <div className="p-6 rounded-2xl glass-heritage border border-amber-500/20 text-left hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white mb-2">A Folk Song</h3>
            <p className="text-sm text-amber-200/90 font-outfit italic mb-3">
              "Only 12 people in this village still know this song."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Centuries-old Kumaoni mountain ballads contain unwritten ecological wisdom about Himalayan water streams and medicinal flora.
            </p>
          </div>

          {/* Card 2: Traditional Recipe */}
          <div className="p-6 rounded-2xl glass-heritage border border-amber-500/20 text-left hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white mb-2">A Traditional Recipe</h3>
            <p className="text-sm text-amber-200/90 font-outfit italic mb-3">
              "Passed down for 5 generations."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Drought-resistant fermented millet preparations that kept desert communities healthy for 400 years without processed ingredients.
            </p>
          </div>

          {/* Card 3: Forgotten Craft */}
          <div className="p-6 rounded-2xl glass-heritage border border-amber-500/20 text-left hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white mb-2">An Almost Forgotten Craft</h3>
            <p className="text-sm text-amber-200/90 font-outfit italic mb-3">
              "Only 8 active artisans remain."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hand-hammered coppersmith vessels and reverse-stitched silk Phulkari shawls requiring 40,000 manual stitches per piece.
            </p>
          </div>
        </div>

        {/* Call To Action Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-[#c85a32]/30 via-[#d4af37]/20 to-transparent border border-[#d4af37]/30">
          <div>
            <h3 className="text-xl sm:text-2xl font-cinzel font-black text-white">
              You can help preserve it.
            </h3>
            <p className="text-xs text-amber-200/80 font-outfit mt-1">
              Document a story, learn a phrase, or adopt a vanishing tradition today.
            </p>
          </div>

          <button
            onClick={handleClick}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#c85a32] to-[#d4af37] text-black font-cinzel font-black text-sm hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer shadow-xl shadow-[#d4af37]/25 shrink-0"
          >
            <span>Start Preserving</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
