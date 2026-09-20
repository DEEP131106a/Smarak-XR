import React, { useEffect, useRef, useState } from 'react';
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
  LogIn,
  LogOut,
} from 'lucide-react';
import { getUserProfile, subscribeState, logoutUser } from '../../services/heritageStateService';
import { soundEngine } from '../../services/soundEngine';
import type { UserProfile } from '../../types/heritageAlive';
import { triggerHaptic } from '../../utils/haptics';
import { AmbientMusicToggle } from './AmbientMusicToggle';

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
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeState(() => {
      setProfile(getUserProfile());
    });
  }, []);

  useEffect(() => {
    if (!langDropdownOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLangDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [langDropdownOpen]);

  const handleNavClick = (page: string) => {
    triggerHaptic('tap');
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0e1017]/90 backdrop-blur-2xl border-b border-[#d4af37]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 min-w-0">
        {/* Brand Logo & Tagline (Section 4) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c85a32] via-[#d4af37] to-[#e06d43] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#d4af37]/25 group-hover:scale-105 transition-transform">
            🏛️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-black text-white text-lg tracking-wider">
                SMARAK <span className="heritage-gold-text">AI</span>
              </span>
              <span className="hidden sm:inline text-[9px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-[#d4af37] to-[#c85a32] text-stone-950 uppercase tracking-widest font-sans">
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
        <div className="flex items-center gap-1.5 shrink-0">
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
          <AmbientMusicToggle />

          {/* Language Selector (Section 19) */}
          <div ref={languageMenuRef} className="relative">
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

          {/* Admin Dashboard Button */}
          {profile.isAdmin && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              title="Moderation Queue"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-stone-900 font-bold text-xs transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Queue</span>
            </button>
          )}

          {/* User Sign In / Profile Action Buttons */}
          {profile.isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1a1e2d] to-[#2a2238] border border-[#d4af37]/40 hover:border-[#d4af37] text-white cursor-pointer transition-all shadow-md"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#d4af37]"
                />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[10px] text-amber-300 font-bold truncate max-w-[85px]">
                      {profile.name}
                    </span>
                    {profile.isAdmin && (
                      <span className="text-[8px] bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-black px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shadow-sm">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 leading-none block mt-0.5">
                    {profile.points} PTS
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('tap');
                  soundEngine.playTempleBell(440, 1.2);
                  logoutUser();
                  handleNavClick('login');
                }}
                title="Sign Out of Smarak"
                className="p-2 rounded-xl glass-heritage border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-white cursor-pointer transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c85a32] hover:brightness-110 text-stone-950 font-bold text-xs shadow-lg shadow-[#d4af37]/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-950" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              triggerHaptic('tap');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 rounded-xl glass-heritage border border-[#d4af37]/30 text-gray-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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

          {profile.isLoggedIn ? (
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#d4af37]"
                />
                <span className="text-xs text-amber-300 font-bold">{profile.name}</span>
                {profile.isAdmin && (
                  <span className="text-[8px] bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-black px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  logoutUser();
                  handleNavClick('login');
                }}
                className="text-xs text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37]/20 to-[#c85a32]/20 text-amber-300 border border-[#d4af37]/30 flex items-center gap-2 font-bold cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#d4af37]" />
              <span>Sign In / Join Collective</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
