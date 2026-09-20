import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<Props> = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 rounded-3xl glass-royal border border-rose-500/30 text-center flex flex-col items-center justify-center" role="alert">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8 animate-bounce" />
      </div>

      <h3 className="text-xl font-cinzel font-bold text-white mb-2">
        Unable to load cultural experiences
      </h3>

      <p className="text-sm text-gray-300 font-outfit mb-6">
        {message || 'An error occurred while communicating with the cultural backend API.'}
      </p>

      <button
        onClick={() => {
          triggerHaptic('tap');
          onRetry();
        }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-200 font-cinzel font-bold text-xs cursor-pointer transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
