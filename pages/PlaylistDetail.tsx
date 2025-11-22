
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PLAYLISTS, MOCK_PLAYLIST_ITEMS } from '../constants';
import { PlaylistVideoItem } from '../components/PlaylistVideoItem';
import { Play, Shuffle, Share2, MoreVertical, Globe, Lock, Link as LinkIcon, PenSquare, Plus } from 'lucide-react';
import { Video } from '../types';

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(MOCK_PLAYLISTS[0]);
  const [videos, setVideos] = useState<Video[]>(MOCK_PLAYLIST_ITEMS);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const found = MOCK_PLAYLISTS.find(p => p.id === id);
    if (found) {
      setPlaylist(found);
    }
    // In a real app, fetch videos for this playlist ID
  }, [id]);

  const handleRemoveVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  // Basic Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image trick or custom styling could go here
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return;

    const newVideos = [...videos];
    const [draggedItem] = newVideos.splice(draggedItemIndex, 1);
    newVideos.splice(dropIndex, 0, draggedItem);
    
    setVideos(newVideos);
    setDraggedItemIndex(null);
  };

  return (
    <div className="max-w-[2400px] mx-auto flex flex-col lg:flex-row h-full">
      
      {/* Left Panel: Playlist Info (Sticky on Desktop) */}
      <div className="w-full lg:w-[360px] lg:fixed lg:h-[calc(100vh-56px)] lg:overflow-y-auto p-6 bg-gradient-to-b from-gray-200 to-white dark:from-[#202020] dark:to-yt-base flex-shrink-0 z-10">
        
        {/* Cover Image with Blur Effect Container */}
        <div className="relative w-full aspect-video lg:aspect-auto lg:h-[200px] rounded-xl overflow-hidden shadow-xl mb-6 group">
           <img 
             src={playlist.thumbnailUrl} 
             alt={playlist.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
              <span className="text-white font-medium flex items-center gap-2">
                <Play className="w-5 h-5 fill-white" /> Воспроизвести все
              </span>
           </div>
        </div>

        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">{playlist.title}</h1>
        
        <div className="flex flex-col gap-1 mb-4 text-sm">
           <div className="font-bold text-black dark:text-white">{playlist.author}</div>
           <div className="text-gray-600 dark:text-[#aaa]">
             {playlist.videoCount} видео • {playlist.views || 'Нет просмотров'} • Обновлен {playlist.updatedAt}
           </div>
           {playlist.privacy && (
             <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 w-fit px-2 py-1 rounded mt-2 text-xs font-medium text-gray-700 dark:text-[#ddd]">
                {playlist.privacy === 'public' && <Globe className="w-3 h-3" />}
                {playlist.privacy === 'private' && <Lock className="w-3 h-3" />}
                {playlist.privacy === 'unlisted' && <LinkIcon className="w-3 h-3" />}
                <span>
                  {playlist.privacy === 'public' ? 'Открытый доступ' : playlist.privacy === 'private' ? 'Личный' : 'Доступ по ссылке'}
                </span>
             </div>
           )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
           <button className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-opacity">
             <Play className="w-4 h-4 fill-current" />
             Воспроизвести
           </button>
           <button className="flex-1 bg-gray-100 dark:bg-[#3f3f3f] text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#505050] py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors">
             <Shuffle className="w-4 h-4" />
             Перемешать
           </button>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
           <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Редактировать">
             <PenSquare className="w-5 h-5 text-black dark:text-white" />
           </button>
           <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Поделиться">
             <Share2 className="w-5 h-5 text-black dark:text-white" />
           </button>
           <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
             <MoreVertical className="w-5 h-5 text-black dark:text-white" />
           </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-[#aaa] whitespace-pre-wrap">
           {playlist.description}
        </p>
      </div>

      {/* Right Panel: Video List */}
      <div className="flex-1 lg:ml-[360px] p-4 lg:p-6 pb-20">
         {/* Top Sort/Add Controls */}
         <div className="flex items-center justify-between mb-4 px-2">
             <div className="text-sm font-medium text-black dark:text-white">
               Сортировка: <span className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">Вручную</span>
             </div>
             <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                Добавить видео
             </button>
         </div>

         <div className="flex flex-col gap-1">
            {videos.map((video, index) => (
              <PlaylistVideoItem
                key={video.id}
                index={index}
                video={video}
                onRemove={handleRemoveVideo}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
         </div>
      </div>

    </div>
  );
};
