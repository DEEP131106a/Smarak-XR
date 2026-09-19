import React, { useState } from 'react';
import { Menu, X, Volume2, VolumeX, Camera, Smartphone } from 'lucide-react';

import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenAR: () => void;
  onOpenPassport: () => void;
  activeSection?: 'monuments' | 'culture' | 'explore';
  onNavigateCulture: (path?: string) => void;
  onNavigateExplore: (path?: string) => void;
  onNavigateMonuments: () => void;
}

export const Navbar: React.FC<Props> = ({
  isAudioPlaying,
  onToggleAudio,
  onOpenAR,
  onOpenPassport,
  activeSection = 'monuments',
  onNavigateCulture,
  onNavigateExplore,
  onNavigateMonuments,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPhoneQR, setShowPhoneQR] = useState(false);

  const scrollTo = (id: string) => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(600, 1.2);
    setMobileMenuOpen(false);
    onNavigateMonuments();
    setTimeout(() => {
      if (id === 'passport') {
        onOpenPassport();
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCultureClick = (path = '/culture') => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(600, 1.2);
    setMobileMenuOpen(false);
    onNavigateCulture(path);
  };

  const handleExploreClick = (path = '/explore') => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(600, 1.2);
    setMobileMenuOpen(false);
    onNavigateExplore(path);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=0b0c1a&color=f59e0b`;

  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-full glass-royal border border-amber-500/30 shadow-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            triggerHaptic('tap');
            onNavigateMonuments();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            🛕
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-black text-white text-base sm:text-lg tracking-wider">
                SMARAK
              </span>
            </div>
            <p className="font-yatra text-[11px] text-amber-400 -mt-1 hidden sm:block">
              स्मारक एआर • भारतीय धरोहर
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-200">
          {/* Removed 3D Sanctum */}

          {/* New Explore India Navigation Link */}
          <button
            onClick={() => handleExploreClick('/explore')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              activeSection === 'explore'
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/20 font-bold'
                : 'border-amber-500/20 text-amber-300/90 hover:text-white hover:border-amber-500/40 bg-amber-500/10'
            }`}
          >
            <span>🇮🇳 Explore India</span>
          </button>

          <button
            onClick={() => scrollTo('explore')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Monuments
          </button>

          <button
            onClick={() => scrollTo('creatures')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Sacred Beasts
          </button>

          {/* Culture Navigation Link */}
          <button
            onClick={() => handleCultureClick('/culture')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              activeSection === 'culture'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20 font-bold'
                : 'border-amber-500/20 text-amber-300/90 hover:text-white hover:border-amber-500/40 bg-amber-500/10'
            }`}
          >
            <span>✨ Culture</span>
          </button>

          <button
            onClick={() => scrollTo('passport')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Passport
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Open on Phone QR button */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              setShowPhoneQR(true);
            }}
            title="Scan QR to open on phone"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open on Phone</span>
          </button>

          {/* Sound Drone Toggle */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523, 1.5);
              onToggleAudio();
            }}
            title={isAudioPlaying ? 'Mute Tanpura Drone' : 'Start Tanpura Drone'}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-amber-500 text-black border-amber-300 shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-black/50 text-gray-300 border-white/10 hover:text-white'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Removed Quick AR Launch */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-full bg-black/50 text-gray-300 hover:text-white border border-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl glass-royal border border-amber-500/30 shadow-2xl flex flex-col gap-3 text-sm font-semibold text-gray-200 animate-in fade-in slide-in-from-top-2">
          {/* Removed 3D Sanctum Viewer from mobile menu */}
          <button
            onClick={() => scrollTo('explore')}
            className="text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-amber-400"
          >
            🗺️ Monuments Catalog
          </button>
          <button
            onClick={() => scrollTo('creatures')}
            className="text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-amber-400"
          >
            ✨ Sacred Bestiary & Beasts
          </button>
          <button
            onClick={() => scrollTo('passport')}
            className="text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-amber-400"
          >
            📜 Heritage Passport
          </button>
        </div>
      )}

      {/* Modal: Open on Phone QR Code */}
      {showPhoneQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm rounded-3xl p-6 glass-royal border border-amber-500/40 shadow-2xl animate-in zoom-in-95 text-center">
            <button
              onClick={() => setShowPhoneQR(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/15 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel font-black text-xl text-white mb-1">
              Experience on Mobile Phone
            </h3>
            <p className="text-xs text-amber-200/70 font-outfit mb-4">
              Scan with your phone camera to enjoy motion gyro AR, camera overlays, and haptic feedback.
            </p>

            <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 flex flex-col items-center justify-center mb-4">
              <img
                src={qrUrl}
                alt="Phone QR Code"
                className="w-44 h-44 rounded-xl border border-amber-500/40 shadow-lg shadow-amber-500/20"
              />
              <span className="mt-3 text-[11px] font-mono text-amber-300/80">
                Point iPhone Camera or Android Lens
              </span>
            </div>

            <button
              onClick={() => setShowPhoneQR(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
