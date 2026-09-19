import React, { useState } from 'react';
import type { Monument, HistoricalEra } from '../types';
import { Clock, History, Crown, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';


interface Props {
  monument: Monument;
}

export const TimeMachineSlider: React.FC<Props> = ({ monument }) => {
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(0);
  const activeEra: HistoricalEra = monument.timeline[selectedEraIndex];

  const handleSelectEra = (idx: number) => {
    soundEngine.playTempleBell(523.25 + idx * 50, 1.8);
    setSelectedEraIndex(idx);
  };

  return (
    <div className="w-full rounded-3xl p-6 glass-royal border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Subtle mandala background accent */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-amber-500/10 pointer-events-none animate-spin-slow" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-white text-lg">
              Kala-Chakra (कालचक्र) • Time Machine
            </h3>
            <p className="text-xs text-amber-200/70 font-outfit">
              Witness architectural evolution across centuries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Century scrubbing</span>
        </div>
      </div>

      {/* Timeline Steps Bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 -translate-y-1/2 rounded-full" />

        <div className="relative flex justify-between items-center">
          {monument.timeline.map((era, idx) => {
            const isSelected = idx === selectedEraIndex;
            return (
              <button
                key={era.year}
                onClick={() => handleSelectEra(idx)}
                className={`group flex flex-col items-center cursor-pointer transition-all transform ${
                  isSelected ? 'scale-110' : 'hover:scale-105 opacity-80'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xl ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-black ring-4 ring-amber-400/30 shadow-amber-500/50'
                      : 'bg-[#121424] text-amber-300 border border-amber-500/40 group-hover:border-amber-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-2 font-mono text-xs font-bold tracking-tight ${
                    isSelected ? 'text-amber-400' : 'text-gray-400 group-hover:text-amber-200'
                  }`}
                >
                  {era.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Detailed Card */}
      <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/30 backdrop-blur-md transition-all">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
              {activeEra.year}
            </span>
            <h4 className="font-cinzel font-bold text-white text-base">
              {activeEra.eraName}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeEra.ruler}</span>
          </div>
        </div>

        <p className="text-sm text-amber-100/90 leading-relaxed font-outfit mb-4">
          {activeEra.description}
        </p>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
          <History className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-300 mb-0.5">Architectural State:</p>
            <p className="text-xs text-amber-200/80 font-outfit">
              {activeEra.reconstructedCondition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
