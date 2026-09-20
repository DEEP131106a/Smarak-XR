import React, { lazy, Suspense, useState, useEffect } from 'react';
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
import { LoginPage } from './components/heritage/LoginPage';
import { AdminDashboard } from './components/heritage/AdminDashboard';
import { GlobalHeritageBackground } from './components/heritage/GlobalHeritageBackground';
const ModelViewerWebXR = lazy(() => import('./components/ModelViewerWebXR').then((module) => ({ default: module.ModelViewerWebXR })));
const CameraARViewer = lazy(() => import('./components/CameraARViewer').then((module) => ({ default: module.CameraARViewer })));
import { MONUMENTS } from './data/monuments';
import type { Monument } from './types';

import { useLanguage } from './i18n/LanguageContext';

export function App() {
  const [activeCityId, setActiveCityId] = useState<string>('amritsar');
  const routeFromLocation = () => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    if (city) setActiveCityId(city);
    return params.get('page') || (window.location.pathname === '/login' ? 'login' : 'home');
  };
  const [activePage, setActivePage] = useState<string>(routeFromLocation);
  const { language: selectedLang, setLanguage: setSelectedLang } = useLanguage();
  const [activeArMonument, setActiveArMonument] = useState<Monument | null>(null);
  const [arViewerMode, setArViewerMode] = useState<'webxr' | 'camera'>('webxr');

  // Handle URL deep-link parameters (e.g. from QR code scan on mobile, or ?page=login)
  useEffect(() => {
    // CLEANUP LEGACY DB (v1 Prototype)
    const legacyKeys = ['smarak_users_db', 'smarak_registered_users', 'heritage_alive_user_stories', 'heritage_alive_profile'];
    legacyKeys.forEach(k => localStorage.removeItem(k));

    const params = new URLSearchParams(window.location.search);
    const arId = params.get('ar');
    const pageParam = params.get('page');

    if (
      pageParam === 'login' ||
      window.location.pathname === '/login' ||
      window.location.hash === '#login'
    ) {
      setActivePage('login');
    } else if (arId) {
      const found = MONUMENTS.find(m => m.id === arId) || MONUMENTS[0];
      setActiveArMonument(found);
      setArViewerMode('webxr');
    }
    const handlePopState = () => setActivePage(routeFromLocation());
    const handleCitySelect = (event: Event) => {
      const cityId = (event as CustomEvent<string>).detail;
      if (cityId) {
        setActiveCityId(cityId);
        setActivePage('city');
        window.history.pushState({ page: 'city', cityId }, '', `?page=city&city=${encodeURIComponent(cityId)}`);
      }
    };
    const handleNavigateEvent = (event: Event) => {
      const page = (event as CustomEvent<string>).detail;
      if (page) handleNavigate(page);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('select-city', handleCitySelect);
    window.addEventListener('navigate-to-page', handleNavigateEvent);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('select-city', handleCitySelect);
      window.removeEventListener('navigate-to-page', handleNavigateEvent);
    };
  }, []);

  // Handle page scrolling and URL update on navigation
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = page === 'home' ? '/' : `?page=${encodeURIComponent(page)}`;
    window.history.pushState({ page }, '', url);
  };

  const handleSelectCity = (cityId: string) => {
    setActiveCityId(cityId);
    setActivePage('city');
    window.history.pushState({ page: 'city', cityId }, '', `?page=city&city=${encodeURIComponent(cityId)}`);
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
      <GlobalHeritageBackground />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-black focus:rounded-lg">
        Skip to content
      </a>
      {/* 1. Sticky Navigation Bar */}
      <div className="relative z-10">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenSearch={handleOpenSearch}
        onOpenUpload={handleOpenUpload}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
      />

      {/* 2. Dynamic Page Content Switcher with Framer Motion */}
      <main id="main-content" tabIndex={-1} className="pt-16" aria-live="polite">
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
            {activePage === 'admin-dashboard' && <AdminDashboard />}
            {activePage === 'login' && (
              <LoginPage
                onLoginSuccess={() => handleNavigate('home')}
                onExploreAsGuest={() => handleNavigate('home')}
              />
            )}            {activePage === 'map' && <HeritageMap onCitySelect={handleSelectCity} />}
            {!['home', 'discover', 'cities', 'city', 'vanishing', 'adopt', 'stories', 'community', 'profile', 'admin-dashboard', 'login', 'map'].includes(activePage) && (
              <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center" aria-labelledby="not-found-title">
                <p className="text-amber-400 uppercase tracking-[0.3em] text-sm mb-3">404</p>
                <h1 id="not-found-title" className="text-3xl font-serif text-white mb-4">Page not found</h1>
                <p className="text-stone-400 mb-6">The heritage route you requested does not exist.</p>
                <button type="button" onClick={() => handleNavigate('home')} className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-black hover:bg-amber-400">
                  Return home
                </button>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Mobile Bottom Sticky Nav */}
      <MobileNav activePage={activePage} onNavigate={handleNavigate} />
      </div>

      {/* 5. Modals */}
      <PreserveStoryModal />
      <GlobalSearchModal onNavigate={handleNavigate} />

      {/* 6. Deep-linked Mobile AR Viewer (from scanning QR code) */}
      <Suspense fallback={activeArMonument ? <div role="status" aria-live="polite" className="fixed inset-0 z-[90] grid place-items-center bg-black/80 text-amber-300">Loading AR experience…</div> : null}>
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
      </Suspense>
    </div>
  );
}

export default App;

