import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Heritage Alive & Smarak AI Components
import { Navbar } from './components/heritage/Navbar';
import { MobileNav } from './components/heritage/MobileNav';
import { HeroSection } from './components/heritage/HeroSection';
import { HackathonWowMoment } from './components/heritage/HackathonWowMoment';
import { VanishingCulture } from './components/heritage/VanishingCulture';
import { PreserveStoryModal } from './components/heritage/PreserveStoryModal';
import { AdoptHeritage } from './components/heritage/AdoptHeritage';
import { DiscoverPage } from './components/heritage/DiscoverPage';
import { HeritageMap } from './components/heritage/HeritageMap';
import { CityExplorer } from './components/heritage/CityExplorer';
import { StoriesPage } from './components/heritage/StoriesPage';
import { CommunityPage } from './components/heritage/CommunityPage';
import { UserProfileDashboard } from './components/heritage/UserProfileDashboard';
import { GlobalSearchModal } from './components/heritage/GlobalSearchModal';
import { Footer } from './components/heritage/Footer';
import { ModelViewerWebXR } from './components/ModelViewerWebXR';
import { CameraARViewer } from './components/CameraARViewer';
import { MONUMENTS } from './data/monuments';
import type { Monument } from './types';

import { useLanguage } from './i18n/LanguageContext';

export function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [activeCityId, setActiveCityId] = useState<string>('amritsar');
  const { language: selectedLang, setLanguage: setSelectedLang } = useLanguage();
  const [activeArMonument, setActiveArMonument] = useState<Monument | null>(null);
  const [arViewerMode, setArViewerMode] = useState<'webxr' | 'camera'>('webxr');

  // Handle URL deep-link parameters (e.g. from QR code scan on mobile)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const arId = params.get('ar');
    if (arId) {
      const found = MONUMENTS.find(m => m.id === arId) || MONUMENTS[0];
      setActiveArMonument(found);
      setArViewerMode('webxr');
    }
  }, []);

  // Handle page scrolling on navigation
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCity = (cityId: string) => {
    setActiveCityId(cityId);
    setActivePage('city');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearch = () => {
    const evt = new CustomEvent('open-global-search');
    window.dispatchEvent(evt);
  };

  const handleOpenUpload = () => {
    const evt = new CustomEvent('open-preserve-modal');
    window.dispatchEvent(evt);
  };

  // Re-trigger Google Translate when page changes (fixes SPA translation issue)
  useEffect(() => {
    if (selectedLang === 'en') return;
    
    // Wait for page transition to complete
    const timer = setTimeout(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        // Force refresh translation by toggling
        select.value = 'en';
        select.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          select.value = selectedLang;
          select.dispatchEvent(new Event('change'));
        }, 50);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activePage, activeCityId, selectedLang]);

  return (
    <div className="min-h-screen bg-[#0e1017] text-stone-100 selection:bg-amber-500 selection:text-stone-950 font-outfit relative pb-20 md:pb-0 overflow-x-hidden">
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenSearch={handleOpenSearch}
        onOpenUpload={handleOpenUpload}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
      />

      {/* 2. Dynamic Page Content Switcher with Framer Motion */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {activePage === 'home' && (
              <div className="space-y-12">
                <HeroSection
                  onExploreClick={() => handleNavigate('cities')}
                  onPreserveClick={handleOpenUpload}
                  onVanishingClick={() => handleNavigate('vanishing')}
                  onCityClick={handleSelectCity}
                />

                {/* 1. Cities & Culture Explorer - MAIN SECTION */}
                <HeritageMap onCitySelect={handleSelectCity} />

                {/* 2. Vanishing Culture */}
                <VanishingCulture />

                {/* 3. Preserving Culture */}
                <AdoptHeritage />

                <HackathonWowMoment onStartPreserving={handleOpenUpload} />
              </div>
            )}

            {activePage === 'discover' && <DiscoverPage />}
            {activePage === 'cities' && <HeritageMap onCitySelect={handleSelectCity} />}
            {activePage === 'city' && (
              <CityExplorer cityId={activeCityId} onBack={() => handleNavigate('cities')} />
            )}
            {activePage === 'vanishing' && <VanishingCulture />}
            {activePage === 'adopt' && <AdoptHeritage />}
            {activePage === 'stories' && <StoriesPage />}
            {activePage === 'community' && <CommunityPage />}
            {activePage === 'profile' && <UserProfileDashboard />}
            {activePage === 'map' && <HeritageMap onCitySelect={handleSelectCity} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Mobile Bottom Sticky Nav */}
      <MobileNav activePage={activePage} onNavigate={handleNavigate} />

      {/* 5. Modals */}
      <PreserveStoryModal />
      <GlobalSearchModal />

      {/* 6. Deep-linked Mobile AR Viewer (from scanning QR code) */}
      {activeArMonument && arViewerMode === 'webxr' && (
        <ModelViewerWebXR
          monument={activeArMonument}
          onClose={() => setActiveArMonument(null)}
          onSwitchToCameraAR={() => setArViewerMode('camera')}
        />
      )}
      {activeArMonument && arViewerMode === 'camera' && (
        <CameraARViewer
          monument={activeArMonument}
          onClose={() => setActiveArMonument(null)}
          onOpenNativeAR={() => setArViewerMode('webxr')}
        />
      )}
    </div>
  );
}

export default App;
