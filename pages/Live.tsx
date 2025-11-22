
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { LiveChat } from '../components/LiveChat';
import { MOCK_VIDEOS } from '../constants';
import { ThumbsUp, Share2, MoreHorizontal, User, Eye, CheckCircle2 } from 'lucide-react';
import { Video } from '../types';

export const Live: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [viewers, setViewers] = useState(12543);
  const [likes, setLikes] = useState(4500);

  // Mock Viewer Count Update
  useEffect(() => {
    const interval = setInterval(() => {
       setViewers(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fallback video data in case MOCK_VIDEOS is empty (user mode)
  const dummyVideo: Video = {
    id: 'live',
    thumbnailUrl: 'https://placehold.co/1920x1080/111/fff?text=LIVE+STREAM',
    title: 'Тестовый Прямой Эфир',
    channelName: 'Live Streamer',
    channelAvatarUrl: 'https://placehold.co/100x100/222/fff?text=LS',
    duration: 'LIVE',
    views: '12K',
    postedAt: 'В эфире',
  };

  const videoData = MOCK_VIDEOS.length > 1 ? MOCK_VIDEOS[1] : dummyVideo;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden bg-[#f9f9f9] dark:bg-[#111]">
      
      {/* Left: Player & Info (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="w-full aspect-video bg-black">
            <VideoPlayer 
               src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
               poster={videoData.thumbnailUrl}
               autoplay={true}
               isLive={true}
            />
         </div>
         
         <div className="p-4 sm:p-6">
            <h1 className="text-xl font-bold text-black dark:text-white mb-2">
               🔴 Прямой эфир: {videoData.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-4">
               <div className="flex items-center gap-4">
                  <img src={videoData.channelAvatarUrl} className="w-10 h-10 rounded-full" />
                  <div>
                     <div className="font-bold text-black dark:text-white flex items-center gap-1">
                        {videoData.channelName}
                        <CheckCircle2 className="w-3 h-3 text-gray-500" />
                     </div>
                     <div className="text-xs text-gray-500">1.2M подписчиков</div>
                  </div>
                  <button className="ml-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-medium text-sm hover:opacity-90">
                     Подписаться
                  </button>
               </div>

               <div className="flex items-center gap-2">
                   <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] px-4 py-2 rounded-full transition-colors">
                      <ThumbsUp className="w-4 h-4 text-black dark:text-white" />
                      <span className="text-sm font-medium text-black dark:text-white">{likes}</span>
                   </button>
                   <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] px-4 py-2 rounded-full transition-colors">
                      <Share2 className="w-4 h-4 text-black dark:text-white" />
                      <span className="text-sm font-medium text-black dark:text-white">Поделиться</span>
                   </button>
                   <button className="p-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-black dark:text-white" />
                   </button>
               </div>
            </div>

            <div className="mt-4 bg-gray-100 dark:bg-[#1f1f1f] p-4 rounded-xl text-sm">
               <div className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {viewers.toLocaleString()} зрителей сейчас
                  <span className="text-gray-500 font-normal">• Начало трансляции: 2 часа назад</span>
               </div>
               <p className="text-black dark:text-white leading-relaxed">
                  Присоединяйтесь к нашему стриму! Обсуждаем новости, играем и отвечаем на вопросы.
                  <br/><br/>
                  Правила чата: без спама и оскорблений.
               </p>
            </div>
         </div>
      </div>

      {/* Right: Live Chat (Fixed width on desktop) */}
      <div className="w-full lg:w-[400px] h-[400px] lg:h-full flex-shrink-0 p-0 lg:p-4 lg:pl-0 bg-white dark:bg-[#111]">
         <LiveChat />
      </div>

    </div>
  );
};
