import React, { useState } from 'react';
import { MONUMENTS } from '../data/monuments';
import type { Monument } from '../types';
import {
  Search,
  Eye,
  Camera,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

import { soundEngine } from '../services/soundEngine';

interface Props {
  selectedMonument: Monument;
  onSelectMonument: (monument: Monument) => void;
  onOpenAR: (monument: Monument) => void;
  onOpenVR: (monument: Monument) => void;
}

export const MonumentsExplorer: React.FC<Props> = ({
  selectedMonument,
  onSelectMonument,
  onOpenAR,
  onOpenVR,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [onlyUnesco, setOnlyUnesco] = useState(false);

  const filteredMonuments = MONUMENTS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.hindiName.includes(searchQuery) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dynasty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || m.region === selectedRegion;
    const matchesUnesco = !onlyUnesco || m.unesco;

    return matchesSearch && matchesRegion && matchesUnesco;
  });

  const regions = ['All', 'North', 'South', 'East', 'West'];

  return (
    <section id="explore" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Archives of India</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-black tracking-tight text-white">
            Explore Timeless Monuments
          </h2>
          <p className="text-sm sm:text-base text-amber-100/70 font-outfit mt-1">
            Dive into centuries of stone masonry, cosmic geometry, and architectural legends.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            placeholder="Search monument, state, dynasty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-amber-500/30 text-white placeholder-amber-200/40 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 backdrop-blur-md transition-all"
          />
        </div>
      </div>

      {/* Region & Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => {
                soundEngine.playTempleBell(600, 1.2);
                setSelectedRegion(reg);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                  : 'bg-black/50 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {reg === 'All' ? 'All Regions' : `${reg} India`}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            soundEngine.playTempleBell(700, 1.2);
            setOnlyUnesco(!onlyUnesco);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
            onlyUnesco
              ? 'bg-amber-500/25 text-amber-300 border-amber-400'
              : 'bg-black/50 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>UNESCO World Heritage Only</span>
        </button>
      </div>

      {/* Monuments Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMonuments.map((m) => {
          const isSelected = selectedMonument.id === m.id;

          return (
            <div
              key={m.id}
              className={`group relative rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 glass-royal hover:border-amber-500/60 hover:-translate-y-1.5 shadow-xl ${
                isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20' : ''
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {m.region} India
                  </span>
                  {m.unesco && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      UNESCO
                    </span>
                  )}
                </div>

                {/* Monument Name */}
                <h3 className="text-xl font-cinzel font-black text-white group-hover:text-amber-400 transition-colors">
                  {m.name}
                </h3>
                <p className="font-yatra text-xs text-amber-400/90 mb-2">{m.hindiName}</p>

                <p className="text-xs text-amber-100/70 font-outfit line-clamp-2 mb-4">
                  {m.tagline}
                </p>

                {/* Metadata details */}
                <div className="space-y-1.5 text-xs text-gray-300/80 mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{m.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>{m.period}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    soundEngine.playTempleBell(523, 1.8);
                    onSelectMonument(m);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-semibold text-xs border border-amber-500/40 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playTempleBell(659, 2.0);
                    onOpenAR(m);
                  }}
                  title="Launch in AR"
                  className="p-2 rounded-xl bg-orange-600/80 hover:bg-orange-500 text-white transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    soundEngine.playTempleBell(783, 2.0);
                    onOpenVR(m);
                  }}
                  title="360 VR Tour"
                  className="p-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-amber-300 border border-indigo-500/40 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
