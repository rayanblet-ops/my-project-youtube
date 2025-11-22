
import React, { useState, useEffect } from 'react';
import { MOCK_SEARCH_HISTORY } from '../constants';
import { SearchVideoCard } from '../components/SearchVideoCard';
import { Search, Trash2, PauseCircle, Settings, History as HistoryIcon, X } from 'lucide-react';
import { Video } from '../types';
import { videoServiceFirestore } from '../firebase/videoServiceFirestore';

export const History: React.FC = () => {
  const [view, setView] = useState<'watch' | 'search'>('watch');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize empty to prevent crash, then load from LocalStorage
  const [watchHistory, setWatchHistory] = useState<{label: string, videos: Video[]}[]>([]);
  const [searchHistory, setSearchHistory] = useState(MOCK_SEARCH_HISTORY);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videos = await videoServiceFirestore.getAllVideos();
        if (videos.length > 0) {
           // Simulate grouping. In real app, check dates.
           // Here we just put all user videos in "Today"
           setWatchHistory([
             { label: 'Сегодня', videos: videos }
           ]);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
      }
    };

    loadVideos();
  }, []);

  const handleDeleteVideo = (label: string, videoId: string) => {
    setWatchHistory(prev => prev.map(group => {
      if (group.label === label) {
        return { ...group, videos: group.videos.filter(v => v.id !== videoId) };
      }
      return group;
    }).filter(group => group.videos.length > 0));
  };

  const handleDeleteSearchItem = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (view === 'watch') {
      if (window.confirm('Очистить всю историю просмотра?')) setWatchHistory([]);
    } else {
      if (window.confirm('Очистить всю историю поиска?')) setSearchHistory([]);
    }
  };

  const filteredSearchHistory = searchHistory.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#f9f9f9] dark:bg-[#111] min-h-full flex justify-center">
      <div className="max-w-[1284px] w-full flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">
        
        {/* Left/Center Content */}
        <div className="flex-1 p-4 sm:p-6 lg:pr-10">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
            {view === 'watch' ? 'История просмотра' : 'История поиска'}
          </h1>

          {view === 'watch' ? (
            <div className="flex flex-col gap-8">
              {watchHistory.length > 0 ? (
                watchHistory.map((group, gIdx) => (
                  <div key={gIdx} className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-black dark:text-white">{group.label}</h3>
                    <div className="flex flex-col gap-4">
                      {group.videos.map((video) => (
                        <div key={`${group.label}-${video.id}`} className="relative group">
                          <SearchVideoCard video={video} />
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteVideo(group.label, video.id);
                            }}
                            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#333] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                            title="Удалить из истории"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-20">
                  История просмотра пуста. Загрузите видео, чтобы они появились здесь.
                </div>
              )}
            </div>
          ) : (
            // Search History View
            <div className="flex flex-col">
               {filteredSearchHistory.length > 0 ? (
                 filteredSearchHistory.map(item => (
                   <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors group">
                      <div className="flex items-center gap-4">
                         <HistoryIcon className="w-5 h-5 text-gray-500" />
                         <div>
                            <div className="text-black dark:text-white font-medium">{item.term}</div>
                            <div className="text-xs text-gray-500">{item.date}</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSearchItem(item.id)}
                        className="text-gray-500 hover:text-black dark:hover:text-white p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5" />
                      </button>
                   </div>
                 ))
               ) : (
                 <div className="text-gray-500 text-center py-20">История поиска пуста</div>
               )}
            </div>
          )}
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-[360px] p-4 sm:p-6 bg-white dark:bg-[#1f1f1f] border-l border-gray-200 dark:border-[#333]">
           <div className="sticky top-20">
              {/* Search within history */}
              <div className="relative mb-8 border-b border-gray-300 dark:border-[#444] pb-1 focus-within:border-black dark:focus-within:border-white transition-colors">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                 <input 
                   type="text" 
                   placeholder="Искать в истории" 
                   className="w-full bg-transparent pl-8 py-2 outline-none text-black dark:text-white placeholder-gray-500"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>

              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Тип истории</h3>
              <div className="flex flex-col gap-2 mb-8">
                 <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      name="historyView" 
                      checked={view === 'watch'} 
                      onChange={() => setView('watch')}
                      className="w-4 h-4 text-black dark:text-white accent-black dark:accent-white" 
                    />
                    <span className="text-black dark:text-white">История просмотра</span>
                 </label>
                 <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      name="historyView" 
                      checked={view === 'search'} 
                      onChange={() => setView('search')}
                      className="w-4 h-4 text-black dark:text-white accent-black dark:accent-white" 
                    />
                    <span className="text-black dark:text-white">История поиска</span>
                 </label>
              </div>

              <div className="flex flex-col gap-1">
                 <button 
                   onClick={handleClearAll}
                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-black dark:text-white transition-colors text-left"
                 >
                    <Trash2 className="w-5 h-5" />
                    <span>Очистить историю {view === 'watch' ? 'просмотра' : 'поиска'}</span>
                 </button>
                 <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-black dark:text-white transition-colors text-left">
                    <PauseCircle className="w-5 h-5" />
                    <span>Не сохранять историю</span>
                 </button>
                 <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] text-black dark:text-white transition-colors text-left">
                    <Settings className="w-5 h-5" />
                    <span>Управление историей</span>
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
