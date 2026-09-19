import React from 'react';
import type { TimelineEvent } from '../../types/explore';
import { History, Sparkles, Clock } from 'lucide-react';

interface Props {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
}

export const TimelineComponent: React.FC<Props> = ({
  events,
  title = 'Historical Evolution & Timeline',
  subtitle = 'Discover pivotal eras, rulers, and cultural milestones',
}) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl glass-royal border border-amber-500/30 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 border-b border-amber-500/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <History className="w-4 h-4" />
            <span>Interactive Timeline</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white">
            {title}
          </h3>
        </div>
        <p className="text-xs text-amber-200/70 font-outfit max-w-sm">
          {subtitle}
        </p>
      </div>

      <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-8 ml-2 sm:ml-4">
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-[#080912] shadow-lg group-hover:scale-125 transition-transform" />

            {/* Period Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{evt.period}</span>
            </div>

            {/* Title */}
            <h4 className="text-lg sm:text-xl font-cinzel font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
              {evt.title}
            </h4>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-200/90 font-outfit leading-relaxed mb-3">
              {evt.description}
            </p>

            {/* Significance highlight */}
            {evt.significance && (
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Impact:</strong> {evt.significance}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
