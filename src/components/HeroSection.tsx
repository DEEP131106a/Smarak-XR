import React from 'react';
import { Sparkles, Eye, Camera, Volume2, VolumeX, ArrowDown, Smartphone } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  onStartAR: () => void;
  onExploreClick: () => void;
  onCreaturesClick: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroSection: React.FC<Props> = ({
  onStartAR,
  onExploreClick,
  onCreaturesClick,
  isAudioPlaying,
  onToggleAudio,
}) => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden">
      {/* Background Decorative Mandala Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full border border-amber-500/10 animate-spin-slow" />
        <div className="absolute w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full border border-orange-500/15 animate-spin-reverse-slow" />
        <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border border-amber-400/20" />
        {/* Ambient Radial Lighting Glow */}
        <div className="absolute w-[500px] h-[500px] bg-radial from-amber-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Smarak AR • Mobile-First Augmented & Virtual Reality</span>
        </div>

        {/* Big Smarak AR Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-cinzel font-black tracking-tight text-white mb-2 leading-none">
          SMARAK <span className="gold-gradient-text">AR</span>
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-amber-200/90 tracking-widest mb-2">
          HERITAGE & CULTURE OF INDIA
        </h2>
        <p className="font-yatra text-lg sm:text-2xl text-amber-400/90 tracking-wide mb-6">
          स्मारक एआर • भारतीय धरोहर एवं पवित्र प्रतीक
        </p>

        {/* Motive & Mission Statement */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-amber-100/80 font-outfit leading-relaxed mb-8">
          Designed for seamless interaction on your mobile phone and desktop. Step into India’s monumental architectural marvels and the sacred mythic creatures carved upon their stones in AR & VR—whether standing physically before them or journeying from home.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={() => {
              triggerHaptic('success');
              soundEngine.playTempleBell(587.33, 2.5);
              onStartAR();
            }}
            className="group flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-sm sm:text-base shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Launch Mobile AR</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523, 2.0);
              onExploreClick();
            }}
            className="flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl glass-royal hover:border-amber-500/60 text-white font-cinzel font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Eye className="w-5 h-5 text-amber-400" />
            <span>Inspect 3D Monuments</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(659, 2.0);
              onCreaturesClick();
            }}
            className="flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 text-amber-300 border border-indigo-400/40 font-cinzel font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg backdrop-blur-md"
          >
            <span>✨ Sacred Bestiary</span>
          </button>
        </div>

        {/* Mobile Experience Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Ambient Tanpura Drone Toggle */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523, 1.5);
              onToggleAudio();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/25 animate-pulse'
                : 'bg-black/60 text-amber-300 border-amber-500/30 hover:bg-black/80'
            }`}
          >
            {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isAudioPlaying ? 'Mute Tanpura Drone' : 'Indian Classical Soundscape'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Phone Motion Gyro AR</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300">
            <span>🦁 Sacred Carved Beasts</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300">
            <span>🌐 WebXR & Scene Viewer</span>
          </div>
        </div>
      </div>

      {/* Down Arrow Indicator */}
      <button
        onClick={() => {
          triggerHaptic('tap');
          onExploreClick();
        }}
        className="mt-10 text-amber-400/80 hover:text-amber-300 animate-bounce p-2 cursor-pointer transition-colors"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
};
