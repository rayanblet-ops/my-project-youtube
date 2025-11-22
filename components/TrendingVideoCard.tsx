import React from 'react';
import { Video } from '../types';
import { CheckCircle2, MoreVertical, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingVideoCardProps {
  video: Video;
  rank: number;
}

export const TrendingVideoCard: React.FC<TrendingVideoCardProps> = ({ video, rank }) => {
  const isLive = video.postedAt.toLowerCase().includes('в эфире');

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full group">
      {/* Rank Number (Desktop) */}
      <div className="hidden sm:flex w-8 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-[#aaa] pt-1 justify-center">
        #{rank}
      </div>

      {/* Thumbnail */}
      <Link to={`/watch/${video.id}`} className="relative flex-shrink-0 w-full sm:w-[248px] md:w-[360px] aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Duration / Live Badge */}
        <div className="absolute bottom-1.5 right-1.5">
           {isLive ? (
             <div className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
               <Radio className="w-3 h-3 animate-pulse" />
               <span>LIVE</span>
             </div>
           ) : (
             <div className="bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
               {video.duration}
             </div>
           )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 gap-1 pr-6 relative">
        <Link to={`/watch/${video.id}`}>
          <h3 className="text-black dark:text-white text-lg font-medium leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            {video.title}
          </h3>
        </Link>
        
        <div className="text-gray-600 dark:text-[#aaa] text-xs flex flex-wrap items-center gap-1 pb-1 mt-1">
            <Link to={`/channel/${video.channelName}`} className="hover:text-black dark:hover:text-white transition-colors">
                {video.channelName}
            </Link>
            {video.verified && <CheckCircle2 className="w-3 h-3 text-gray-500" />}
            <span>•</span>
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.postedAt}</span>
        </div>

        <div className="hidden sm:block text-gray-600 dark:text-[#aaa] text-xs line-clamp-2 max-w-3xl mt-2">
            {video.description || 'Описание видео отсутствует.'}
        </div>

         {/* Mobile Rank Overlay if needed, or just meta */}
         <div className="sm:hidden absolute top-0 right-0 text-xs font-bold text-gray-400">
            #{rank}
         </div>
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); }}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-yt-hover rounded-full transition-all text-black dark:text-white h-fit self-start hidden sm:block"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};