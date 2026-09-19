import React from 'react';
import { Smartphone, Camera, Sparkles, Box } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  title?: string;
  subtitle?: string;
  onOpenAR: () => void;
}

export const ARExperienceCard: React.FC<Props> = ({
  title = 'IMMERSIVE AR / 3D EXPERIENCE',
  subtitle = 'Explore regional heritage, monuments, and sacred symbols in interactive 3D and Mobile AR.',
  onOpenAR,
}) => {
  const handleClick = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(659.25, 2.0);
    onOpenAR();
  };

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-orange-950/50 to-indigo-950/80 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4 z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
          <Box className="w-7 h-7" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>WebXR Powered</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-cinzel font-black text-white">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/80 font-outfit max-w-xl mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="group z-10 flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-cinzel font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
      >
        <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Explore in AR</span>
      </button>
    </div>
  );
};
