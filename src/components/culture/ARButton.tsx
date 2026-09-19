import React from 'react';
import { Camera, Smartphone, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  arEnabled?: boolean;
  onLaunchAR: () => void;
  title?: string;
}

export const ARButton: React.FC<Props> = ({ arEnabled, onLaunchAR, title }) => {
  if (!arEnabled) {
    return null; // Do NOT render AR button if arEnabled is false or missing
  }

  const handleClick = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(659.25, 2.0);
    onLaunchAR();
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
    >
      <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      <span>Experience in AR</span>
      <Sparkles className="w-4 h-4 text-black animate-pulse" />
    </button>
  );
};
