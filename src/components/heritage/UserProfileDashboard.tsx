import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Award, ShieldCheck, BookmarkCheck, BookOpen, Compass, Zap, Sparkles, TrendingUp, LogOut } from 'lucide-react';
import { getUserProfile, subscribeState, logoutUser } from '../../services/heritageStateService';

export const UserProfileDashboard: React.FC = () => {
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    const unsub = subscribeState(() => {
      setProfile(getUserProfile());
    });
    return unsub;
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Profile Header Banner */}
      <div className="glass-heritage p-6 sm:p-10 rounded-3xl border border-amber-500/30 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-amber-500" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-amber-500/60 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs shadow-lg">
              Lvl {profile.level}
            </div>
          </div>

          {/* User Details */}
          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-stone-100">{profile.name}</h1>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {profile.levelName}
              </span>
              <button
                onClick={() => {
                  logoutUser();
                  window.location.search = '?page=login';
                }}
                className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <p className="text-stone-400 text-sm">
              Cultural Preservation Custodian • Member since September 2026
            </p>

            {/* Level XP Bar */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                <span>Heritage Reputation</span>
                <span className="text-amber-400">{profile.points} XP Total</span>
              </div>
              <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="bg-gradient-to-r from-amber-500 via-emerald-400 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${profile.points % 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-center">
          <Compass className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-stone-100 block">{profile.traditionsDiscovered}</span>
          <span className="text-xs text-stone-400 uppercase font-semibold">Traditions Discovered</span>
        </div>

        <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-center">
          <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-stone-100 block">{profile.storiesPreserved}</span>
          <span className="text-xs text-stone-400 uppercase font-semibold">Stories Preserved</span>
        </div>

        <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-center">
          <BookmarkCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-stone-100 block">{profile.heritageAdopted}</span>
          <span className="text-xs text-stone-400 uppercase font-semibold">Heritage Adopted</span>
        </div>

        <div className="glass-heritage p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all text-center">
          <ShieldCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <span className="text-3xl font-extrabold text-stone-100 block">{profile.challengesCompleted}</span>
          <span className="text-xs text-stone-400 uppercase font-semibold">Quests Completed</span>
        </div>
      </div>

      {/* Badges Section & Preservation Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Badges (7 Cols) */}
        <div className="lg:col-span-7 glass-heritage p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> Achievement Badges
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {profile.badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  b.unlocked
                    ? 'bg-stone-900/90 border-amber-500/40 text-stone-100'
                    : 'bg-stone-950/40 border-stone-800 opacity-50 grayscale'
                }`}
              >
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">{b.name}</h4>
                  <p className="text-[11px] text-stone-400">{b.description}</p>
                  <span className={`text-[10px] font-bold mt-1 inline-block ${b.unlocked ? 'text-emerald-400' : 'text-stone-500'}`}>
                    {b.unlocked ? 'Unlocked ✓' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-heritage p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Preservation Impact
          </h2>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                <span>Stories Digitally Preserved</span>
                <span className="text-amber-400">12 Items</span>
              </div>
              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div className="bg-amber-500 h-full w-[75%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                <span>Traditions Adopted</span>
                <span className="text-emerald-400">3 Items</span>
              </div>
              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div className="bg-emerald-500 h-full w-[60%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                <span>Community Quests Completed</span>
                <span className="text-purple-400">7 Quests</span>
              </div>
              <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div className="bg-purple-500 h-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
