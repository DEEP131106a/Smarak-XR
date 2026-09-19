import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, Clock, MapPin, Tag, User } from 'lucide-react';
import { getUserStories, updateUserStoryStatus } from '../../services/heritageStateService';
import type { StoryItem } from '../../types/heritageAlive';
import { triggerHaptic } from '../../utils/haptics';

export const AdminDashboard: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);

  useEffect(() => {
    // Initial fetch
    setStories(getUserStories().filter(s => s.status === 'pending'));

    // Setup an interval or manual refresh if needed, but since we modify local state we'll just update state directly
  }, []);

  const handleAction = (storyId: string, action: 'verified' | 'rejected') => {
    triggerHaptic('success');
    updateUserStoryStatus(storyId, action);
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
          <ShieldAlert className="w-4 h-4" />
          <span>Admin Moderation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-4">
          Verification <span className="heritage-gold-text">Queue</span>
        </h1>
        <p className="text-lg text-stone-400">
          Review community submissions before they go live on the platform.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-500">
          <CheckCircle className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-bold">Queue is Empty</h3>
          <p>All community submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative"
            >
              <div className="absolute top-4 right-4 bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-stone-700">
                <Clock className="w-3 h-3 text-amber-500" /> Pending Review
              </div>
              
              <h3 className="text-2xl font-bold text-stone-100 mb-2 pr-28">{story.title}</h3>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400 mb-4">
                <div className="flex items-center gap-1"><User className="w-4 h-4 text-stone-500"/> {story.preservedBy}</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-rose-400"/> {story.region}, {story.state}</div>
                <div className="flex items-center gap-1"><Tag className="w-4 h-4 text-emerald-400"/> {story.category}</div>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl text-stone-300 text-sm leading-relaxed mb-6 border border-stone-800">
                {story.fullStory || story.shortStory}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAction(story.id, 'verified')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" /> Verify & Publish
                </button>
                <button
                  onClick={() => handleAction(story.id, 'rejected')}
                  className="flex-1 bg-rose-900/50 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
