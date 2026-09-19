import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  Search,
  Globe,
  User,
  Menu,
  X,
  Award,
  BookOpen,
  Clock,
  ShieldAlert,
  HeartHandshake,
  Users,
  Compass,
} from 'lucide-react';
import { getUserProfile, subscribeState } from '../../services/heritageStateService';
import type { UserProfile } from '../../types/heritageAlive';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  selectedLang: string;
  onLangChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
];

export const Navbar: React.FC<Props> = ({
  activePage,
  onNavigate,
  onOpenSearch,
  onOpenUpload,
  selectedLang,
  onLangChange,
}) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    return subscribeState(() => {
      setProfile(getUserProfile());
    });
  }, []);

  const handleNavClick = (page: string) => {
    triggerHaptic('tap');
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0e1017]/90 backdrop-blur-2xl border-b border-[#d4af37]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo & Tagline (Section 4) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c85a32] via-[#d4af37] to-[#e06d43] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#d4af37]/25 group-hover:scale-105 transition-transform">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-black text-white text-lg tracking-wider">
                SMARAK <span className="heritage-gold-text">AI</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-[#d4af37] to-[#c85a32] text-stone-950 uppercase tracking-widest font-sans">
                Cultural AI
              </span>
            </div>
            <p className="text-[10px] text-amber-200/70 font-outfit tracking-wide hidden sm:block">
              Preserve. Experience. Rediscover India.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Section 4) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-gray-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'home' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('discover')}
            className={`hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'discover' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            {t('nav.discover')}
          </button>
          <button
            onClick={() => handleNavClick('cities')}
            className={`flex items-center gap-1 hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'cities' || activePage === 'city' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t('nav.cities')}</span>
          </button>
          <button
            onClick={() => handleNavClick('vanishing')}
            className={`flex items-center gap-1 hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'vanishing' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#c85a32]" />
            <span>{t('nav.vanishing')}</span>
          </button>
          <button
            onClick={() => handleNavClick('adopt')}
            className={`flex items-center gap-1 hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'adopt' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('nav.adopt')}</span>
          </button>
          <button
            onClick={() => handleNavClick('stories')}
            className={`hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'stories' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            {t('nav.stories')}
          </button>
          <button
            onClick={() => handleNavClick('community')}
            className={`hover:text-[#d4af37] transition-colors cursor-pointer ${
              activePage === 'community' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-1' : ''
            }`}
          >
            {t('nav.community')}
          </button>
        </nav>

        {/* Right Actions: Search, Lang, Profile & Points */}
        <div className="flex items-center gap-2.5">
          {/* Global Search Button */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              onOpenSearch();
            }}
            title="Global Search"
            className="p-2 rounded-xl glass-heritage border border-[#d4af37]/30 text-amber-300 hover:text-white cursor-pointer transition-all"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Selector (Section 19) */}
          <div className="relative">
            <button
              onClick={() => {
                triggerHaptic('tap');
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-heritage border border-[#d4af37]/30 text-amber-200 text-xs font-semibold hover:text-white cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="uppercase">{selectedLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl glass-heritage border border-[#d4af37]/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-amber-400/80 uppercase px-2 py-1">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      triggerHaptic('tap');
                      onLangChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      selectedLang === lang.code
                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Gamification Points & Profile Button (Section 15, 16) */}
          <button
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1a1e2d] to-[#2a2238] border border-[#d4af37]/40 hover:border-[#d4af37] text-white cursor-pointer transition-all shadow-md"
          >
            <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-black text-xs flex items-center justify-center">
              ⚡
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-amber-300 font-bold block leading-none">
                {profile.points} PTS
              </span>
              <span className="text-[9px] text-gray-400 leading-none">
                Lvl {profile.level}
              </span>
            </div>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 rounded-xl glass-heritage border border-[#d4af37]/30 text-gray-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Section 4, 21) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#d4af37]/20 bg-[#0e1017]/95 backdrop-blur-2xl p-4 space-y-2 text-sm font-semibold text-gray-200">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            🏛️ Home
          </button>
          <button
            onClick={() => handleNavClick('discover')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            🔍 Discover Culture
          </button>
          <button
            onClick={() => handleNavClick('time-machine')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            ⏳ Culture Time Machine
          </button>
          <button
            onClick={() => handleNavClick('vanishing')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            ⚠️ Vanishing Culture
          </button>
          <button
            onClick={() => handleNavClick('adopt')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            🤝 Adopt a Heritage
          </button>
          <button
            onClick={() => handleNavClick('stories')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            📜 Preserved Stories
          </button>
          <button
            onClick={() => handleNavClick('community')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            👥 Community & Leaderboard
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-white/5 hover:text-[#d4af37]"
          >
            👤 Profile & Dashboard ({profile.points} Points)
          </button>
        </div>
      )}
    </header>
  );
};
