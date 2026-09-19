import React from 'react';
import { Box, Eye, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  model3d?: string | null;
  title?: string;
}

export const ModelViewerComponent: React.FC<Props> = ({ model3d, title }) => {
  if (!model3d) {
    return null; // Render NOTHING if backend has not supplied a 3D model path
  }

  return (
    <div className="w-full my-6 p-6 rounded-3xl glass-royal border border-amber-500/30 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Box className="w-6 h-6 text-amber-400" />
        <h4 className="text-lg font-cinzel font-bold text-white">
          Interactive 3D Artifact Viewer
        </h4>
      </div>

      <p className="text-xs text-amber-200/70 font-outfit mb-4">
        3D model asset ready: <code className="text-amber-400">{model3d}</code>
      </p>

      {/* Model viewer placeholder / webgl frame when asset exists */}
      <div className="w-full h-64 rounded-2xl bg-black/50 border border-amber-500/20 flex flex-col items-center justify-center">
        <Sparkles className="w-10 h-10 text-amber-400 animate-spin mb-2" />
        <span className="text-xs font-semibold text-amber-300">
          Loading 3D Cultural Artifact ({title || 'Model'})
        </span>
      </div>
    </div>
  );
};
