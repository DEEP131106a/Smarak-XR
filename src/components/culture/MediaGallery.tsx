import React, { useState } from 'react';
import { Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  images?: string[];
  title?: string;
}

export const MediaGallery: React.FC<Props> = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null; // Do NOT render section if images array is missing or empty
  }

  return (
    <div className="w-full my-6">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-5 h-5 text-amber-400" />
        <h4 className="text-lg font-cinzel font-bold text-white">
          Visual Gallery ({images.length})
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imgUrl, index) => (
          <div
            key={index}
            onClick={() => {
              triggerHaptic('tap');
              setActiveImage(imgUrl);
            }}
            className="group relative rounded-2xl overflow-hidden aspect-video border border-amber-500/20 glass-royal cursor-pointer transform hover:scale-102 transition-all shadow-md"
          >
            <img
              src={imgUrl}
              alt={`${title || 'Culture'} gallery item ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Maximize2 className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/20 text-white hover:bg-amber-500/40 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="Full size view"
            className="max-w-full max-h-[85vh] rounded-2xl border border-amber-500/30 object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
