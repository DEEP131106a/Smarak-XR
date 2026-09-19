import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-3xl glass-royal border border-amber-500/10 p-6 flex flex-col justify-between animate-pulse"
          >
            <div className="w-full h-44 rounded-2xl bg-amber-500/10 mb-4" />
            <div className="h-6 w-3/4 bg-amber-500/15 rounded-md mb-2" />
            <div className="h-4 w-1/2 bg-amber-500/10 rounded-md mb-4" />
            <div className="h-3 w-full bg-amber-500/10 rounded-md mb-2" />
            <div className="h-3 w-4/5 bg-amber-500/10 rounded-md mb-6" />
            <div className="h-10 w-full rounded-2xl bg-amber-500/15" />
          </div>
        ))}
      </div>
    </div>
  );
};
