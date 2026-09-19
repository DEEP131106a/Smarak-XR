import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, Camera, FileText, Utensils, X, Sparkles, CheckCircle2, Award } from 'lucide-react';
import type { StoryItem, CategoryType } from '../../types/heritageAlive';
import { addUserStory, getUserProfile, subscribeState } from '../../services/heritageStateService';

export const PreserveStoryModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    return subscribeState(() => setProfile(getUserProfile()));
  }, []);
  const [mediaType, setMediaType] = useState<'audio' | 'video' | 'photo' | 'written' | 'recipe'>('written');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Tradition');
  const [region, setRegion] = useState('');
  const [stateName, setStateName] = useState('Punjab');
  const [preservedBy, setPreservedBy] = useState('Sourav Preet');
  const [storyText, setStoryText] = useState('');
  const [recipeIngredientsText, setRecipeIngredientsText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Result Card state
  const [createdStoryCard, setCreatedStoryCard] = useState<StoryItem | null>(null);

  // Listen for custom event 'open-preserve-modal'
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setCreatedStoryCard(null);
    };
    window.addEventListener('open-preserve-modal', handleOpen);
    return () => window.removeEventListener('open-preserve-modal', handleOpen);
  }, []);

  // Voice recording timer simulation
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !storyText) return;

    const newStory: StoryItem = {
      id: `user-story-${Date.now()}`,
      title,
      category,
      region: region || 'Local Region',
      state: stateName,
      preservedBy: preservedBy || profile?.name || 'Anonymous Contributor',
        authorId: profile?.name || 'guest',
      date: 'Just Now',
      shortStory: storyText.slice(0, 150) + (storyText.length > 150 ? '...' : ''),
      fullStory: storyText,
      mediaType,
      status: 'pending',
      image:
        mediaType === 'recipe'
          ? 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      recipeIngredients:
        mediaType === 'recipe' ? recipeIngredientsText.split('\n').filter((line) => line.trim().length > 0) : undefined,
    };

    addUserStory(newStory);
    setCreatedStoryCard(newStory);
  };

  const resetForm = () => {
    setTitle('');
    setStoryText('');
    setRegion('');
    setRecipeIngredientsText('');
    setCreatedStoryCard(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-heritage border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-400 hover:text-white border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!createdStoryCard ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Preserving Community Heritage
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
                  Your Story Could Become <span className="heritage-gold-text">History</span>.
                </h2>
                <p className="text-stone-400 text-sm mt-1">
                  Preserve a tradition, recipe, song, memory, or story from your family or community.
                </p>
              </div>

              {/* Upload Type Selectors */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setMediaType('audio')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                    mediaType === 'audio'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                    mediaType === 'video'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType('photo')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                    mediaType === 'photo'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType('written')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                    mediaType === 'written'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Story</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType('recipe')}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 text-xs font-bold ${
                    mediaType === 'recipe'
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Utensils className="w-5 h-5" />
                  <span>Recipe</span>
                </button>
              </div>

              {/* Simulated Recording Banner for Voice */}
              {mediaType === 'audio' && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-3 rounded-full font-bold transition-all ${
                        isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-stone-100 font-bold text-sm">
                        {isRecording ? `Recording... (${recordingSeconds}s)` : 'Click Mic to Record Voice Memory'}
                      </p>
                      <p className="text-xs text-stone-400">Record an elder speaking or singing an oral folk tune.</p>
                    </div>
                  </div>
                  {isRecording && <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />}
                </div>
              )}

              {/* Story Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Title of Tradition / Story *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Grandmother's 80-Year-Old Wedding Bagh"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-sm"
                    >
                      <option value="Craft">Traditional Craft</option>
                      <option value="Music">Folk Music / Song</option>
                      <option value="Food">Heirloom Recipe</option>
                      <option value="Language">Language / Oral History</option>
                      <option value="Tradition">Family Tradition</option>
                      <option value="Dance">Folk Dance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Region & State *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="District/Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-1/2 px-3 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="State (e.g. Punjab)"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-1/2 px-3 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Preserved By (Your Name)
                  </label>
                  <input
                    type="text"
                    placeholder="Sourav Preet"
                    value={preservedBy}
                    onChange={(e) => setPreservedBy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                    Story / Memory Narrative *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how this tradition was practiced, who passed it down, and why it matters to your community..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                {mediaType === 'recipe' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Recipe Ingredients (One per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Roasted Bajra Flour (2 tbsp)&#10;Fresh Buttermilk (500ml)&#10;Earthen Clay Pot"
                      value={recipeIngredientsText}
                      onChange={(e) => setRecipeIngredientsText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" /> Earn +50 Heritage Preservation Points
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all duration-300 shadow-lg shadow-amber-500/20"
                  >
                    Digitally Preserve Story →
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Digital Heritage Card Result */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-extrabold text-white">Story Submitted for Verification!</h2>
              <p className="text-stone-300 text-sm max-w-md mx-auto">
                Your story is now pending review by our Curators. Once verified, you will earn <span className="text-amber-400 font-bold">+50 Heritage Points</span> and it will be added to the archives!
              </p>

              {/* Digital Heritage Card */}
              <div className="glass-heritage border-2 border-amber-500/40 rounded-2xl p-6 text-left max-w-md mx-auto shadow-2xl relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {createdStoryCard.category}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-600/50">
                    {createdStoryCard.status}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-1">
                  {createdStoryCard.title}
                </h3>
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  {createdStoryCard.region} • {createdStoryCard.state}
                </p>

                <p className="text-stone-300 text-sm italic mb-4 border-l-2 border-amber-500 pl-3">
                  “{createdStoryCard.shortStory}”
                </p>

                <div className="pt-4 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
                  <span>Preserved by: <strong className="text-stone-200">{createdStoryCard.preservedBy}</strong></span>
                  <span className="text-amber-400/80">ID: #{createdStoryCard.id.slice(0, 10)}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};






