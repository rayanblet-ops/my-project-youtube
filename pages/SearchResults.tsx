import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_VIDEOS, MOCK_CHANNEL } from '../constants';
import { SearchVideoCard } from '../components/SearchVideoCard';
import { SlidersHorizontal, X, Search as SearchIcon, Filter } from 'lucide-react';
import { VideoCardSkeleton } from '../components/VideoCardSkeleton';

const FILTER_OPTIONS = {
  uploadDate: ['Последний час', 'Сегодня', 'Эта неделя', 'Этот месяц', 'Этот год'],
  type: ['Видео', 'Канал', 'Плейлист', 'Фильм'],
  duration: ['Не более 4 минут', '4–20 минут', 'Более 20 минут'],
  sort: ['Релевантность', 'По дате загрузки', 'По числу просмотров', 'По рейтингу']
};

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search_query') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  
  // Mock filtered results
  const [results, setResults] = useState(MOCK_VIDEOS);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API Search
    const timeout = setTimeout(() => {
      const filtered = MOCK_VIDEOS.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) || 
        v.channelName.toLowerCase().includes(query.toLowerCase())
      );
      // Shuffle/Duplicate to make the list look full for demo
      setResults(filtered.length > 0 ? [...filtered, ...filtered] : []);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [query]);

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[category] === value) {
        delete newFilters[category];
      } else {
        newFilters[category] = value;
      }
      return newFilters;
    });
  };

  // Check if channel matches query
  const isChannelMatch = MOCK_CHANNEL.name.toLowerCase().includes(query.toLowerCase());

  return (
    <div className="max-w-[1284px] mx-auto px-4 sm:px-6 py-4 w-full">
      {/* Filter Toggle Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-transparent hover:border-gray-200 dark:hover:border-[#3f3f3f] transition-colors pb-2">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full font-medium text-sm transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 mb-6 bg-gray-50 dark:bg-[#1f1f1f] rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {Object.entries(FILTER_OPTIONS).map(([categoryKey, options]) => (
            <div key={categoryKey} className="flex flex-col gap-2">
              <h3 className="font-bold text-xs uppercase text-gray-500 dark:text-[#aaa] mb-1 border-b border-gray-300 dark:border-[#3f3f3f] pb-2">
                {categoryKey === 'uploadDate' ? 'Дата загрузки' :
                 categoryKey === 'type' ? 'Тип' :
                 categoryKey === 'duration' ? 'Длительность' : 'Упорядочить'}
              </h3>
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleFilter(categoryKey, opt)}
                  className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                    activeFilters[categoryKey] === opt 
                      ? 'font-bold text-black dark:text-white bg-gray-200 dark:bg-[#3f3f3f]' 
                      : 'text-gray-600 dark:text-[#aaa] hover:text-black dark:hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ))}
          <div className="col-span-full flex justify-end">
             <button 
               onClick={() => setShowFilters(false)}
               className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
             >
               Свернуть
             </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-4">
           {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="flex gap-4">
                <div className="w-[360px] aspect-video bg-gray-200 dark:bg-[#202020] rounded-xl animate-pulse" />
                <div className="flex-1 flex flex-col gap-2 pt-2">
                   <div className="w-3/4 h-6 bg-gray-200 dark:bg-[#202020] rounded animate-pulse" />
                   <div className="w-1/4 h-4 bg-gray-200 dark:bg-[#202020] rounded animate-pulse" />
                   <div className="w-1/2 h-4 bg-gray-200 dark:bg-[#202020] rounded animate-pulse mt-2" />
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Results List */}
      {!isLoading && (
        <div className="flex flex-col gap-4">
          {/* Show matched channel if relevant */}
          {isChannelMatch && !activeFilters.type && (
             <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-16 py-6 border-b border-gray-200 dark:border-[#3f3f3f] mb-4">
                <Link to={`/channel/${MOCK_CHANNEL.name}`} className="flex-shrink-0">
                    <img 
                        src={MOCK_CHANNEL.avatarUrl} 
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover hover:opacity-90"
                        alt={MOCK_CHANNEL.name}
                    />
                </Link>
                <div className="flex flex-col text-center sm:text-left">
                    <Link to={`/channel/${MOCK_CHANNEL.name}`}>
                        <h2 className="text-xl font-bold text-black dark:text-white">{MOCK_CHANNEL.name}</h2>
                    </Link>
                    <div className="text-sm text-gray-600 dark:text-[#aaa] mt-1 mb-3">
                        {MOCK_CHANNEL.handle} • {MOCK_CHANNEL.subscribers} подписчиков • {MOCK_CHANNEL.videosCount} видео
                    </div>
                    <div className="text-sm text-gray-600 dark:text-[#aaa] line-clamp-2 max-w-xl mb-3">
                        {MOCK_CHANNEL.description}
                    </div>
                    <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity w-fit mx-auto sm:mx-0">
                        Подписаться
                    </button>
                </div>
             </div>
          )}

          {/* Video Results */}
          {results.length > 0 ? (
            results.map((video, idx) => (
              <SearchVideoCard key={`${video.id}-${idx}`} video={video} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-[#272727] flex items-center justify-center mb-6">
                  <SearchIcon className="w-12 h-12 text-gray-400" />
               </div>
               <h2 className="text-xl font-bold text-black dark:text-white mb-2">Ничего не найдено</h2>
               <p className="text-gray-600 dark:text-[#aaa]">Попробуйте другие ключевые слова или сбросьте фильтры</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};