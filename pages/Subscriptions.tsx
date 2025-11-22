
import React, { useState, useEffect } from 'react';
import { MOCK_SUBSCRIPTIONS } from '../constants';
import { SubscriptionAvatar } from '../components/SubscriptionAvatar';
import { VideoCard } from '../components/VideoCard';
import { LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

const FILTERS = ['Все', 'Сегодня', 'Продолжить просмотр', 'Непросмотренные', 'В эфире', 'Настройки'];

export const Subscriptions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
      const stored = localStorage.getItem('yt_videos');
      if (stored) {
          try {
              setVideos(JSON.parse(stored));
          } catch(e) {
              console.error(e);
          }
      }
  }, []);

  // Logic to filter videos based on the "activeFilter"
  const getFilteredVideos = () => {
    let filtered = [...videos];
    
    if (activeFilter === 'В эфире') {
      return filtered.filter(v => v.type === 'video' && v.postedAt.toLowerCase().includes('эфире'));
    }
    if (activeFilter === 'Сегодня') {
      // Mock filter, just show all in this demo
      return filtered;
    }
    
    return filtered;
  };

  const filteredVideos = getFilteredVideos();

  return (
    <div className="max-w-[2400px] mx-auto w-full h-full flex flex-col">
      
      {/* Top Bar: Avatars & Manage Button */}
      <div className="flex items-center justify-between px-4 py-3 w-full border-b border-gray-200 dark:border-[#3f3f3f]">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar flex-1 pr-4">
          {MOCK_SUBSCRIPTIONS.map(sub => (
            <SubscriptionAvatar key={sub.id} subscription={sub} />
          ))}
          {MOCK_SUBSCRIPTIONS.length === 0 && (
              <div className="text-sm text-gray-500">Нет активных подписок</div>
          )}
        </div>
        <Link to="/channels" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-full transition-colors whitespace-nowrap">
          Управление
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-yt-base/95 backdrop-blur-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${activeFilter === filter 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-[#272727] dark:text-white dark:hover:bg-[#3f3f3f]'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* View Toggle (Grid/List) - Visual only for now */}
        <div className="hidden sm:flex items-center gap-1 ml-4 text-gray-600 dark:text-[#aaa]">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#272727] text-black dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-[#272727]'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#272727] text-black dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-[#272727]'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, idx) => (
            <VideoCard key={`${video.id}-${idx}`} video={video} />
          ))
        ) : (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
             <p className="text-lg">В этой ленте пока нет видео</p>
             <p className="text-sm mt-2">Загрузите свое видео, чтобы увидеть его здесь!</p>
           </div>
        )}
      </div>

    </div>
  );
};
