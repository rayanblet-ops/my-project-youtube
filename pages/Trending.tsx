import React, { useState, useEffect } from 'react';
import { MOCK_VIDEOS } from '../constants';
import { TrendingVideoCard } from '../components/TrendingVideoCard';
import { Flame, Globe } from 'lucide-react';
import { Video } from '../types';

const TABS = ['Сейчас', 'Музыка', 'Игры', 'Фильмы', 'Новости'];

export const Trending: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Сейчас');
  const [region, setRegion] = useState('RU');
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Just shuffle slightly for visual effect
      setVideos(prev => {
         const newArr = [...prev];
         if(newArr.length > 1) {
             const temp = newArr[0];
             newArr[0] = newArr[1];
             newArr[1] = temp;
         }
         return newArr;
      });
    }, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  // Tab switch effect
  useEffect(() => {
    setIsLoading(true);
    // Simulate fetch delay
    setTimeout(() => {
        let sortedVideos = [...MOCK_VIDEOS];
        // Simple mock filter/sort logic
        if (activeTab === 'Музыка') {
            sortedVideos = sortedVideos.filter(v => v.title.toLowerCase().includes('музыка') || v.id === '2');
        } else if (activeTab === 'Игры') {
             sortedVideos = sortedVideos.filter(v => v.title.toLowerCase().includes('игры') || v.id === '3');
        }
        
        // If empty (due to mock data limits), just show all for demo
        if (sortedVideos.length === 0) sortedVideos = MOCK_VIDEOS;
        
        setVideos(sortedVideos);
        setIsLoading(false);
    }, 500);
  }, [activeTab, region]);

  return (
    <div className="w-full bg-white dark:bg-yt-base min-h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 px-6 py-8 border-b border-gray-200 dark:border-[#3f3f3f]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1">В тренде</h1>
            <p className="text-gray-600 dark:text-[#aaa] text-sm">
                Популярные видео в регионе: 
                <select 
                    value={region} 
                    onChange={(e) => setRegion(e.target.value)}
                    className="ml-2 bg-transparent border-b border-gray-400 text-black dark:text-white font-bold outline-none cursor-pointer"
                >
                    <option value="RU">Россия</option>
                    <option value="US">США</option>
                    <option value="GLOBAL">Весь мир</option>
                </select>
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-yt-base/95 backdrop-blur-sm border-b border-gray-200 dark:border-[#3f3f3f] px-4">
        <div className="flex items-center gap-1 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors relative
                ${activeTab === tab 
                  ? 'border-black dark:border-white text-black dark:text-white' 
                  : 'border-transparent text-gray-600 dark:text-[#aaa] hover:text-black dark:hover:text-white'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-[1284px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {isLoading ? (
             // Skeleton Loading
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                    <div className="hidden sm:block w-8" />
                    <div className="w-full sm:w-[360px] aspect-video bg-gray-200 dark:bg-[#202020] rounded-xl" />
                    <div className="flex-1 flex flex-col gap-3 py-2">
                         <div className="w-3/4 h-6 bg-gray-200 dark:bg-[#202020] rounded" />
                         <div className="w-1/2 h-4 bg-gray-200 dark:bg-[#202020] rounded" />
                    </div>
                </div>
             ))
        ) : (
             videos.map((video, index) => (
                 <TrendingVideoCard 
                    key={`${video.id}-${index}`} 
                    video={video} 
                    rank={index + 1} 
                 />
             ))
        )}

        {!isLoading && videos.length > 0 && (
             <div className="flex justify-center pt-4 pb-8">
                 <button className="px-6 py-2 border border-gray-300 dark:border-[#3f3f3f] rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium text-sm transition-colors">
                    Показать еще
                 </button>
             </div>
        )}
      </div>
    </div>
  );
};