
import React from 'react';
import { Playlist } from '../types';
import { Lock, ListVideo, MoreVertical, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="flex flex-col gap-2 group cursor-pointer w-full">
      {/* Thumbnail Container */}
      <Link to={`/playlist/${playlist.id}`} className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={playlist.thumbnailUrl} 
          alt={playlist.title} 
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
        />
        
        {/* Playlist Overlay (Right side standard YouTube style or Bottom overlay) */}
        <div className="absolute bottom-0 right-0 left-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
           <ListVideo className="w-3 h-3" />
           <span>{playlist.videoCount} видео</span>
        </div>

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
            <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wide">
                <Play className="w-5 h-5 fill-white" />
                Воспроизвести
            </div>
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex justify-between items-start mt-0.5">
        <div className="flex flex-col gap-1">
          <h3 className="text-black dark:text-white text-[16px] font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            {playlist.title}
          </h3>
          <div className="text-gray-600 dark:text-[#aaa] text-xs font-medium">
             <span className="mr-2">Посмотреть весь плейлист</span>
          </div>
           {playlist.isPrivate && (
              <div className="bg-gray-100 dark:bg-[#272727] w-fit px-2 py-0.5 rounded text-[10px] text-gray-500 dark:text-[#aaa] flex items-center gap-1 mt-1">
                  <Lock className="w-2.5 h-2.5" /> Личный
              </div>
           )}
        </div>
        
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-yt-hover rounded-full transition-all text-black dark:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
