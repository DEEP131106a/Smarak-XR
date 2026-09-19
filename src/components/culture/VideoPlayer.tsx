import React from 'react';
import { Video, Play } from 'lucide-react';

interface Props {
  videos?: string[];
  title?: string;
}

export const VideoPlayer: React.FC<Props> = ({ videos, title }) => {
  if (!videos || videos.length === 0) {
    return null; // Render NOTHING if no video URL is provided by backend
  }

  return (
    <div className="w-full my-6">
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-5 h-5 text-amber-400" />
        <h4 className="text-lg font-cinzel font-bold text-white">
          Performance & Cultural Video ({videos.length})
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((vidUrl, index) => (
          <div
            key={index}
            className="rounded-2xl glass-royal border border-amber-500/30 overflow-hidden shadow-xl"
          >
            <video
              src={vidUrl}
              controls
              preload="metadata"
              className="w-full aspect-video object-cover"
              poster={title ? undefined : ''}
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};
