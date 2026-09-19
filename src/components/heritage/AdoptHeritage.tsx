import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkCheck, Clock, ShieldCheck, CheckSquare, Square, Zap, Award, Sparkles, BookOpen } from 'lucide-react';
import { ADOPT_ITEMS } from '../../data/heritageAliveData';
import type { AdoptItem } from '../../types/heritageAlive';
import { toggleAdoptHeritage, getUserProfile, subscribeState, addPoints } from '../../services/heritageStateService';

export const AdoptHeritage: React.FC = () => {
  const [profile, setProfile] = useState(getUserProfile());
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = subscribeState(() => {
      setProfile(getUserProfile());
    });
    return unsub;
  }, []);

  const handleToggleAdopt = (item: AdoptItem) => {
    toggleAdoptHeritage(item.id);
  };

  const handleToggleTask = (taskId: string) => {
    setTaskStates((prev) => {
      const nextVal = !prev[taskId];
      if (nextVal) {
        addPoints(10, 'Completed Task');
      }
      return { ...prev, [taskId]: nextVal };
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          <span>Gamified Micro-Preservation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Adopt a <span className="heritage-gold-text">Heritage</span>
        </h1>
        <p className="text-lg text-stone-400">
          “Don't just learn culture. Help keep it alive by taking ownership of an endangered tradition.”
        </p>
      </div>

      {/* Profile Gamification Scoreboard Banner */}
      <div className="glass-heritage p-6 rounded-2xl border border-amber-500/30 mb-12 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black text-2xl shadow-lg shadow-amber-500/30">
            {profile.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-stone-100">{profile.levelName}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {profile.points} XP
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-0.5">
              You have adopted <strong className="text-emerald-400">{profile.heritageAdopted}</strong> endangered traditions
            </p>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-bold text-stone-400 mb-1">
            <span>Next Level</span>
            <span className="text-amber-400">{profile.points % 100} / 100 XP</span>
          </div>
          <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${profile.points % 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Adoptable Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ADOPT_ITEMS.map((item) => {
          const isAdopted = profile.adoptedIds.includes(item.id);
          
          // Calculate task completion count
          const completedTaskCount = item.tasks.reduce((acc, t) => {
            return acc + (taskStates[t.id] ? 1 : 0);
          }, 0);

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className={`glass-heritage rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                isAdopted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-amber-500/20 hover:border-amber-500/40'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {item.category} • {item.state}
                    </span>
                    <h3 className="text-2xl font-bold text-stone-100 mt-2">{item.title}</h3>
                  </div>
                  
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-900 text-stone-300 border border-stone-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {item.timeRequired}
                  </span>
                </div>

                <p className="text-stone-300 text-sm leading-relaxed mb-6">{item.description}</p>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-stone-900/80 border border-stone-800/80 text-xs">
                  <div>
                    <span className="text-stone-500 block uppercase font-bold text-[10px]">Difficulty</span>
                    <span className="text-stone-200 font-semibold">{item.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block uppercase font-bold text-[10px]">Impact</span>
                    <span className="text-amber-400 font-semibold">{item.preservationImpact}</span>
                  </div>
                </div>

                {/* Task Checklist (Show if Adopted or always expandable) */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Preservation Checklist
                    </span>
                    <span className="text-emerald-400">{completedTaskCount} / {item.tasks.length} Tasks</span>
                  </div>

                  {item.tasks.map((task) => {
                    const isChecked = !!taskStates[task.id];
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-stone-900/50 border-stone-800 text-stone-300 hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-600 flex-shrink-0" />
                          )}
                          <span className={isChecked ? 'line-through text-emerald-300/80' : ''}>{task.label}</span>
                        </div>
                        {isChecked && <span className="text-[10px] text-emerald-400 font-bold">+10 XP</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> +20 XP on Adoption
                </span>

                <button
                  onClick={() => handleToggleAdopt(item)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    isAdopted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{isAdopted ? 'Adopted ✓' : 'Adopt Heritage'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
