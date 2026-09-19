import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  unlockedBadges: string[];
}

export const HeritagePassport: React.FC<Props> = ({ unlockedBadges }) => {
  const allPossibleBadges = [
    { id: 'taj', title: 'Taj Mahal Marble Guardian', icon: '🏛️', desc: 'Explored Bilateral Symmetry and Optical Minarets' },
    { id: 'konark', title: 'Surya Charioteer', icon: '☀️', desc: 'Discovered the 24 Astrolabe Sundial Wheels' },
    { id: 'meenakshi', title: 'Yali Tamer Badge', icon: '🦁', desc: 'Encountered the Chimeric Guardians of Madurai' },
    { id: 'kailasa', title: 'Monolithic Excavator', icon: '⛰️', desc: 'Witnessed the Top-Down Rock-Cut Mountain Temple' },
    { id: 'hampi', title: 'Granite Wheel Rotator', icon: '🛞', desc: 'Investigated the Axis-Rotating Chariot of Vittala' },
    { id: 'qutub', title: 'Iron Metallurgist', icon: '🗡️', desc: 'Uncovered 1600-year rust-free iron alchemy' },
    { id: 'creatures', title: 'Vahanas Bestiary Scholar', icon: '✨', desc: 'Studied the composite mythology of sacred beasts' },
    { id: 'ar-snap', title: 'AR Spatial Pioneer', icon: '📸', desc: 'Captured high-definition augmented reality memories' },
  ];

  const level =
    unlockedBadges.length >= 6
      ? 'Smarak Rakshak (Supreme Guardian)'
      : unlockedBadges.length >= 3
      ? 'Khoji (Heritage Explorer)'
      : 'Yatri (Pilgrim of Antiquity)';

  const progressPercent = Math.min(100, Math.round((unlockedBadges.length / allPossibleBadges.length) * 100));

  const triggerCelebration = () => {
    triggerHaptic('success');
    soundEngine.playTempleBell(880, 2.5);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#f97316', '#dc2626', '#3b82f6', '#10b981'],
    });
  };

  return (
    <section id="passport" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl p-6 sm:p-10 glass-royal border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Royal Watermark Stamp */}
        <div className="absolute right-4 top-4 text-9xl font-cinzel font-black opacity-5 pointer-events-none text-amber-300 select-none">
          BHARAT
        </div>

        {/* Passport Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/25">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white">
                  Smarak AR Digital Passport
                </h3>
                <span className="font-yatra text-xs text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  स्मारक पासपोर्ट
                </span>
              </div>

              <p className="text-xs sm:text-sm text-amber-200/70 font-outfit">
                Your official digital pilgrimage record and architectural discovery seals
              </p>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-amber-500/40">
            <Shield className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Rank & Honor</p>
              <p className="text-sm font-cinzel font-bold text-amber-300">{level}</p>
            </div>
            <button
              onClick={triggerCelebration}
              title="Celebrate achievements"
              className="ml-2 p-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-6">
          <div className="flex justify-between items-center text-xs font-semibold text-amber-300 mb-2">
            <span>Discovery Seals Collected: {unlockedBadges.length} / {allPossibleBadges.length}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-700 shadow-md shadow-amber-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {allPossibleBadges.map((b) => {
            const isUnlocked = unlockedBadges.some(
              (ub) => ub.toLowerCase().includes(b.id) || ub.toLowerCase().includes(b.title.toLowerCase())
            ) || unlockedBadges.length > 0; // Pre-unlock first discovery for awesome preview

            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-black/40 border-white/5 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10">{b.icon}</span>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Seal Granted
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-500">Locked</span>
                  )}
                </div>
                <h4 className="font-cinzel font-bold text-white text-sm mb-1">{b.title}</h4>
                <p className="text-[11px] text-amber-100/70 font-outfit">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
