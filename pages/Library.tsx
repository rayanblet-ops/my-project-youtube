
import React from 'react';
import { MOCK_HISTORY, MOCK_VIDEOS, MOCK_PLAYLISTS } from '../constants';
import { VideoCard } from '../components/VideoCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { History, Clock, ThumbsUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Library: React.FC = () => {
  return (
    <div className="max-w-[2400px] mx-auto px-4 sm:px-8 py-6 pb-20">
      
      {/* History Section */}
      <div className="flex flex-col gap-4 mb-8 border-b border-gray-200 dark:border-[#3f3f3f] pb-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-xl font-bold text-black dark:text-white">История</h2>
           </div>
           <Link to="/history" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-full transition-colors">
             Смотреть все
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           {MOCK_HISTORY.slice(0, 5).map((video) => (
              <VideoCard key={`hist-${video.id}`} video={video} />
           ))}
        </div>
      </div>

      {/* Watch Later Section */}
      <div className="flex flex-col gap-4 mb-8 border-b border-gray-200 dark:border-[#3f3f3f] pb-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-xl font-bold text-black dark:text-white">Смотреть позже</h2>
              <span className="text-gray-500 text-sm font-normal">12 видео</span>
           </div>
           <Link to="/playlist/watch-later" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-full transition-colors">
             Смотреть все
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           {MOCK_VIDEOS.slice(2, 6).map((video) => (
              <VideoCard key={`wl-${video.id}`} video={video} />
           ))}
        </div>
      </div>

      {/* Liked Videos Section */}
      <div className="flex flex-col gap-4 mb-8 border-b border-gray-200 dark:border-[#3f3f3f] pb-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <ThumbsUp className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-xl font-bold text-black dark:text-white">Понравившиеся</h2>
              <span className="text-gray-500 text-sm font-normal">345 видео</span>
           </div>
           <Link to="/playlist/liked" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-full transition-colors">
             Смотреть все
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           {MOCK_VIDEOS.slice(0, 4).reverse().map((video) => (
              <VideoCard key={`liked-${video.id}`} video={video} />
           ))}
        </div>
      </div>

      {/* Playlists Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-black dark:text-white">Плейлисты</h2>
           <button className="flex items-center gap-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#272727] px-4 py-2 rounded-full transition-colors">
             <Plus className="w-5 h-5" />
             <span className="font-medium text-sm">Новый плейлист</span>
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
           {MOCK_PLAYLISTS.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
           ))}
        </div>
      </div>

    </div>
  );
};
