import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Trophy, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { COMMUNITY_CONTRIBUTORS, COMMUNITY_CHALLENGES } from '../../data/heritageAliveData';
import { fetchPublicStories, addPoints } from '../../services/heritageStateService';
import type { StoryItem } from '../../types/heritageAlive';

export const CommunityPage: React.FC = () => {
  const [challenges, setChallenges] = useState(COMMUNITY_CHALLENGES);
  const [userStories, setUserStories] = useState<StoryItem[]>([]);
  React.useEffect(() => {
    void fetchPublicStories().then(setUserStories).catch(console.error);
  }, []);

  const handleCompleteChallenge = (id: string, pts: number) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          return { ...ch, completed: true, progress: ch.maxProgress };
        }
        return ch;
      })
    );
    addPoints(pts, 'Completed Community Challenge');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <Users className="w-4 h-4" />
          <span>Crowdsourced Cultural Movement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Community <span className="heritage-gold-text">Guardians</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Preserving heritage takes a village. Meet our top contributors, join monthly preservation quests, and track active community impact.”
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols): Recently Preserved & Challenges */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section 1: Community Challenges */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-400" /> Active Community Quests
              </h2>
              <span className="text-xs text-amber-400 font-bold">Earn Bonus XP</span>
            </div>

            <div className="space-y-4">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className="glass-heritage p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {ch.category}
                      </span>
                      <span className="text-stone-400 text-xs font-semibold">{ch.deadline}</span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-100">{ch.title}</h3>
                    <p className="text-stone-300 text-xs leading-relaxed">{ch.description}</p>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-semibold text-stone-400 mb-1">
                        <span>Community Submissions</span>
                        <span className="text-amber-400">{ch.progress} / {ch.maxProgress}</span>
                      </div>
                      <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${(ch.progress / ch.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right w-full sm:w-auto flex sm:flex-col items-center justify-between gap-3">
                    <span className="text-amber-400 font-black text-sm">+{ch.points} XP</span>

                    <button
                      disabled={ch.completed}
                      onClick={() => handleCompleteChallenge(ch.id, ch.points)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                        ch.completed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                      }`}
                    >
                      {ch.completed ? 'Completed ✓' : 'Complete Quest'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Recently Preserved Feed */}
          <div>
            <h2 className="text-2xl font-extrabold text-stone-100 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" /> Recently Preserved Traditions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userStories.slice(0, 4).map((st) => (
                <div key={st.id} className="glass-heritage p-4 rounded-xl border border-amber-500/20 flex gap-4 items-center">
                  <img src={st.image} alt={st.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-stone-100 text-sm truncate">{st.title}</h4>
                    <p className="text-xs text-amber-400">{st.region}, {st.state}</p>
                    <p className="text-[11px] text-stone-400 mt-1">Preserved by {st.preservedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Top Contributors Leaderboard */}
        <div className="lg:col-span-4 glass-heritage p-6 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-xl font-extrabold text-stone-100">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3>Top Contributors</h3>
          </div>

          <p className="text-stone-400 text-xs">
            Leaderboard of guardians who have documented the highest number of vanishing traditions this month.
          </p>

          <div className="space-y-4">
            {COMMUNITY_CONTRIBUTORS.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-stone-900/80 border border-amber-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-amber-400 w-6 text-center">
                    {c.rank === 1 && '🥇'}
                    {c.rank === 2 && '🥈'}
                    {c.rank === 3 && '🥉'}
                  </span>
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm">{c.name}</h4>
                    <p className="text-[11px] text-amber-400/90 font-semibold">{c.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-stone-200 font-extrabold text-sm block">{c.traditionsPreserved}</span>
                  <span className="text-[10px] text-stone-400 uppercase">Preserved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
