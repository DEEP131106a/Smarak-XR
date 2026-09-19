import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookmarkCheck, Clock, CheckSquare, Square, Zap, Award, BookOpen, Mic, Search, PlayCircle } from 'lucide-react';
import { ADOPT_ITEMS } from '../../data/heritageAliveData';
import type { AdoptItem } from '../../types/heritageAlive';
import { toggleAdoptHeritage, getUserProfile, subscribeState, addPoints } from '../../services/heritageStateService';
import { useLanguage } from '../../i18n/LanguageContext';
import { voiceGuide } from '../../services/voiceGuide';
import { apiService, type HeritageReward } from '../../services/apiService';

const PLACE_ALIASES: Record<string, string[]> = {
  amritsar: ['punjab', 'majha'],
  jaipur: ['rajasthan', 'marwar'],
  almora: ['uttarakhand', 'kumaon'],
  dharamshala: ['himachal pradesh', 'kangra'],
  chandigarh: ['punjab', 'haryana'],
  mumbai: ['maharashtra'],
  kolkata: ['west bengal'],
};

export const AdoptHeritage: React.FC = () => {
  const [profile, setProfile] = useState(getUserProfile());
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [databaseItems, setDatabaseItems] = useState<Array<{ id: string; title: string; description?: string; history?: string; ingredients?: string[]; category?: string; region?: string; state?: string; city?: string }>>([]);
  const [selectedItem, setSelectedItem] = useState<typeof databaseItems[number] | null>(null);
  const [rewards, setRewards] = useState<HeritageReward[]>([]);
  const [rewardMessage, setRewardMessage] = useState('');
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const { t } = useLanguage();
  const normalizedPlace = selectedPlace.trim().toLowerCase();
  const locationTerms = useMemo(
    () => normalizedPlace ? [normalizedPlace, ...(PLACE_ALIASES[normalizedPlace] || [])] : [],
    [normalizedPlace],
  );
  const rewardThresholds = [0, 150, 400, 750];
  const currentThreshold = [...rewardThresholds].reverse().find((threshold) => profile.points >= threshold) || 0;
  const nextThreshold = rewardThresholds.find((threshold) => threshold > profile.points) || currentThreshold + 500;
  const progress = Math.min(100, ((profile.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  const filteredItems = ADOPT_ITEMS.filter((item) => {
    const haystack = `${item.title} ${item.category} ${item.state} ${item.region}`.toLowerCase();
    const matchesSearch = !searchTerm.trim() || haystack.includes(searchTerm.trim().toLowerCase());
    const matchesLocation = !locationTerms.length || locationTerms.some((term) => haystack.includes(term));
    return matchesSearch && matchesLocation;
  });
  const learningLink = (item: AdoptItem, topic: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.state} ${selectedPlace || item.region} ${topic} heritage`)}`;

  useEffect(() => {
    const unsub = subscribeState(() => {
      setProfile(getUserProfile());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length < 2 && !selectedPlace.trim()) {
      setDatabaseItems([]);
      return;
    }
    const timer = window.setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const category = lowerQuery.includes('food') || lowerQuery.includes('recipe') ? 'food'
        : lowerQuery.includes('dance') ? 'dance'
        : lowerQuery.includes('song') || lowerQuery.includes('music') ? 'dance'
        : undefined;
      void apiService.getAdoptItems({
        ...(category ? { search: category } : query ? { search: query } : {}),
        ...(category ? { category } : {}),
        ...(selectedPlace.trim() ? { location: selectedPlace.trim() } : {}),
      })
        .then((items) => setDatabaseItems(items))
        .catch(() => setDatabaseItems([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm, selectedPlace]);

  useEffect(() => {
    if (!profile.isLoggedIn) {
      setRewards([]);
      return;
    }
    void apiService.getRewards()
      .then((response) => setRewards(response.rewards))
      .catch(() => setRewards([]));
  }, [profile.isLoggedIn, profile.points, profile.level]);

  const handleToggleAdopt = (item: AdoptItem) => {
    toggleAdoptHeritage(item.id);
  };

  const handleToggleTask = (itemId: string, taskId: string) => {
    const key = `${itemId}-${taskId}`;
    setTaskStates((prev) => {
      const nextVal = !prev[key];
      if (nextVal) {
        addPoints(10, 'Completed Task');
      }
      return { ...prev, [key]: nextVal };
    });
  };

  const handleRedeemReward = async (reward: HeritageReward) => {
    setClaimingReward(reward.id);
    setRewardMessage('');
    try {
      await apiService.redeemReward(reward.id);
      setRewards((current) => current.map((item) => item.id === reward.id
        ? { ...item, redeemed: true, redemptionStatus: 'REQUESTED' }
        : item));
      setRewardMessage(`${reward.name} claimed. Our heritage team will contact you for fulfillment.`);
    } catch (error) {
      setRewardMessage(error instanceof Error ? error.message : 'Unable to claim this reward.');
    } finally {
      setClaimingReward(null);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          <span>{t('adopt.badge')}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          {t('adopt.title1')} <span className="heritage-gold-text">{t('adopt.title2')}</span>
        </h1>
        <p className="text-lg text-stone-400">
          “{t('adopt.subtitle')}”
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
            <span className="text-amber-400">{profile.points - currentThreshold} / {nextThreshold - currentThreshold} XP</span>
          </div>
          <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="rewards-title" className="max-w-4xl mx-auto mb-12">
        <h2 id="rewards-title" className="text-2xl font-bold text-stone-100 mb-4 text-center">Heritage Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rewards.map((reward) => (
            <div key={reward.id} className={`rounded-xl border p-4 flex flex-col ${reward.unlocked ? 'border-amber-500/40 bg-amber-500/5' : 'border-stone-800 bg-stone-950/50 opacity-75'}`}>
              <span className="text-3xl mb-2">{reward.icon}</span>
              <p className="text-amber-300 font-bold text-sm">{reward.name}</p>
              <p className="text-xs text-stone-400 mt-1 flex-1">{reward.description}</p>
              <p className="text-[11px] text-stone-500 mt-3">Level {reward.requiredLevel} · {reward.pointsRequired} points</p>
              {profile.isLoggedIn && (
                <button
                  type="button"
                  disabled={!reward.unlocked || reward.redeemed || claimingReward === reward.id}
                  onClick={() => void handleRedeemReward(reward)}
                  className="mt-3 rounded-lg px-3 py-2 text-xs font-bold border border-amber-500/30 text-amber-300 disabled:text-stone-500 disabled:border-stone-700 disabled:cursor-not-allowed"
                >
                  {reward.redeemed ? 'Claim requested' : reward.unlocked ? (claimingReward === reward.id ? 'Claiming...' : 'Claim reward') : 'Locked'}
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-500 mt-3">Earn points for preserving stories, completing adoption tasks, and contributing to community moderation. Physical rewards are fulfilled by the Smarak team.</p>
        {rewardMessage && <p role="status" className="text-center text-xs text-emerald-300 mt-3">{rewardMessage}</p>}
        {!profile.isLoggedIn && <p className="text-center text-xs text-amber-300 mt-3">Sign in to see your reward progress and claim unlocked rewards.</p>}
      </section>

      <div className="max-w-4xl mx-auto mb-8 rounded-2xl border border-amber-500/20 bg-stone-950/50 p-4 sm:p-5">
        <label htmlFor="heritage-search" className="block text-sm font-bold text-stone-200 mb-2">Explore a state, city, or tradition</label>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
            <input id="heritage-search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Kumaoni folk song, food..." className="w-full rounded-xl bg-stone-900 border border-stone-700 py-3 pl-9 pr-3 text-sm text-white" />
          </div>

          <input value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)} placeholder="City (e.g. Almora)" className="rounded-xl bg-stone-900 border border-stone-700 px-3 py-3 text-sm text-white" />
          <span className="flex items-center justify-center rounded-xl bg-amber-500/10 px-3 text-xs text-amber-300">Results are location-specific</span>
        </div>
      </div>

      {databaseItems.length > 0 && (
        <section aria-labelledby="database-results" className="max-w-4xl mx-auto mb-10">
          <h2 id="database-results" className="text-xl font-bold text-amber-300 mb-3">
            {databaseItems.length} heritage results from the database
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {databaseItems.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelectedItem(item);
                }}
                role="button"
                tabIndex={0}
                className="rounded-xl border border-amber-500/20 bg-stone-950/60 p-4 cursor-pointer hover:border-amber-400/70 transition-colors"
              >
                <p className="text-xs uppercase tracking-wider text-amber-400">{item.category || 'Culture'} · {item.city || item.region || item.state || 'India'}</p>
                <h3 className="text-white font-bold mt-1">{item.title}</h3>
                <p className="text-sm text-stone-400 mt-1">{item.description}</p>
                <button type="button" onClick={(event) => { event.stopPropagation(); voiceGuide.togglePlay(`${item.title}. ${item.description || ''}. This heritage belongs to ${item.city || item.region || item.state || 'India'}.`, 'en'); }} className="mt-3 inline-flex items-center gap-1 text-xs text-amber-300"><Mic className="w-3.5 h-3.5" /> Listen</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="presentation" onClick={() => setSelectedItem(null)}>
          <article role="dialog" aria-modal="true" aria-labelledby="heritage-detail-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-stone-950 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-amber-400">{selectedItem.category || 'Heritage'} · {selectedItem.city || selectedItem.region || selectedItem.state}</p>
                <h2 id="heritage-detail-title" className="mt-2 text-2xl sm:text-3xl font-black text-white">{selectedItem.title}</h2>
              </div>
              <button type="button" aria-label="Close heritage details" onClick={() => setSelectedItem(null)} className="rounded-full border border-stone-700 px-3 py-1 text-stone-300 hover:text-white">×</button>
            </div>
            <p className="mt-6 text-stone-200 leading-relaxed">{selectedItem.description || 'More details for this heritage entry will be added soon.'}</p>
            {selectedItem.category?.toLowerCase() === 'food' && (
              <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-950/30 p-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Recipe details</h3>
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <p className="mt-2 text-sm text-emerald-100"><strong>Ingredients:</strong> {selectedItem.ingredients.join(', ')}</p>
                )}
                {selectedItem.history && <p className="mt-2 text-sm text-stone-300">{selectedItem.history}</p>}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => voiceGuide.togglePlay(`${selectedItem.title}. ${selectedItem.description || ''}. This heritage belongs to ${selectedItem.city || selectedItem.region || selectedItem.state || 'India'}.`, 'en')} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-bold text-stone-950"><Mic className="w-4 h-4" /> Listen</button>
              <a target="_blank" rel="noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${selectedItem.city || selectedItem.region || selectedItem.state || ''} ${selectedItem.title} ${selectedItem.category?.toLowerCase() === 'food' ? 'traditional recipe how to cook' : 'learn tutorial'}`)}`} className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 font-bold text-red-300">{selectedItem.category?.toLowerCase() === 'food' ? 'Watch recipe on YouTube' : 'Watch tutorial on YouTube'}</a>
            </div>
          </article>
        </div>
      )}

      {filteredItems.length === 0 && databaseItems.length === 0 && (
        <p role="status" className="text-center text-stone-400 py-12">No heritage content found for this search and location. Try another city, state, food, song, or dance.</p>
      )}

      {/* Grid of Adoptable Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => {
          const isAdopted = profile.adoptedIds.includes(item.id);
          
          // Calculate task completion count
          const completedTaskCount = item.tasks.reduce((acc, t) => {
            return acc + (taskStates[`${item.id}-${t.id}`] ? 1 : 0);
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
                <div className="mb-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => voiceGuide.togglePlay(`${item.title}. ${item.description}. This heritage is from ${item.state}.`, 'en')} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-300">
                    <Mic className="w-3.5 h-3.5" /> Listen
                  </button>
                  {['dance', 'folk song', 'famous food'].map((topic) => (
                    <a key={topic} href={learningLink(item, topic)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-300">
                      <PlayCircle className="w-3.5 h-3.5" /> Learn {topic}
                    </a>
                  ))}
                </div>

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
                    const taskKey = `${item.id}-${task.id}`;
                    const isChecked = !!taskStates[taskKey];
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(item.id, task.id)}
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
