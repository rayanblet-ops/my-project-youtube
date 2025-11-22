import React from 'react';
import { Video } from '../types';
import { Link } from 'react-router-dom';
import { CheckCircle2, MoreVertical } from 'lucide-react';

interface RelatedVideoCardProps {
  video: Video;
}

export const RelatedVideoCard: React.FC<RelatedVideoCardProps> = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} className="flex gap-2 group cursor-pointer mb-2">
      {/* Thumbnail */}
      <div className="relative min-w-[168px] w-[168px] h-[94px] rounded-lg overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-1 pr-6 relative">
        <h3 className="text-black dark:text-white text-sm font-semibold leading-snug line-clamp-2 overflow-hidden text-ellipsis">
          {video.title}
        </h3>
        <div className="text-gray-600 dark:text-[#aaa] text-xs">
          <div className="flex items-center hover:text-black dark:hover:text-white transition-colors mb-0.5">
            <span>{video.channelName}</span>
            {video.verified && <CheckCircle2 className="w-3 h-3 ml-1" />}
          </div>
          <div>
            <span>{video.views}</span> • <span>{video.postedAt}</span>
          </div>
        </div>
         <button 
          onClick={(e) => { e.preventDefault(); }}
          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-yt-hover rounded-full transition-all text-black dark:text-white"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};