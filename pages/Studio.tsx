
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Video as VideoIcon, BarChart3, MessageSquare, DollarSign, Filter, Eye, ThumbsUp, PenSquare, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { MOCK_ANALYTICS } from '../constants';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Video, Comment } from '../types';
import { videoService } from '../appwrite/videoService';
import { commentService } from '../appwrite/commentService';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'content', label: 'Контент', icon: VideoIcon },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'comments', label: 'Комментарии', icon: MessageSquare },
  { id: 'earn', label: 'Монетизация', icon: DollarSign },
];

export const Studio: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadData();
  }, [user.name]);

  const loadData = async () => {
    try {
      // Load Videos
      const loadedVideos = await videoService.getVideosByChannel(user.name);
      setVideos(loadedVideos);

      // Load Comments for user's videos
      const myVideoIds = new Set(loadedVideos.map(v => v.id));
      const allCommentsPromises = loadedVideos.map(video => 
        commentService.getCommentsByVideo(video.id)
      );
      const allCommentsArrays = await Promise.all(allCommentsPromises);
      const myComments = allCommentsArrays.flat().reverse();
      setComments(myComments);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Вы действительно хотите удалить это видео навсегда?")) {
        try {
          const videoToDelete = videos.find(v => v.id === id);
          if (videoToDelete) {
            await videoService.deleteVideo(id, videoToDelete.videoUrl, videoToDelete.videoPath);
            const updatedVideos = videos.filter(v => v.id !== id);
            setVideos(updatedVideos);
            
            // Also clean up comments for this video
            const updatedComments = comments.filter(c => c.videoTitle !== id);
            setComments(updatedComments);
          }
        } catch (error) {
          console.error('Error deleting video:', error);
          alert('Ошибка при удалении видео');
        }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Удалить этот комментарий?")) {
        try {
          await commentService.deleteComment(commentId);
        const updatedComments = comments.filter(c => c.id !== commentId);
        setComments(updatedComments);
        } catch (error) {
          console.error('Error deleting comment:', error);
          alert('Ошибка при удалении комментария');
        }
    }
  };

  const getVideoTitle = (videoId?: string) => {
    const v = videos.find(v => v.id === videoId);
    return v ? v.title : 'Удаленное видео';
  };

  const latestVideo = videos.length > 0 ? videos[0] : null;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analytics Summary */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 border border-gray-200 dark:border-[#333]">
                 <h2 className="text-lg font-bold text-black dark:text-white mb-4">Эффективность видео</h2>
                 <div className="relative h-48 w-full flex items-end gap-2 pt-4">
                    {MOCK_ANALYTICS.viewsTrend.length > 0 ? MOCK_ANALYTICS.viewsTrend.map((val, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors group relative"
                        style={{ height: `${(val / 100) * 100}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {val}K
                         </div>
                      </div>
                    )) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        Нет данных для аналитики
                      </div>
                    )}
                 </div>
                 <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>28 дней назад</span>
                    <span>Сегодня</span>
                 </div>
              </div>

              {/* Latest Video */}
              <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 border border-gray-200 dark:border-[#333]">
                 <h2 className="text-lg font-bold text-black dark:text-white mb-4">Последнее опубликованное видео</h2>
                 {latestVideo ? (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-48 aspect-video rounded overflow-hidden bg-gray-200 dark:bg-[#111] relative">
                            <img src={latestVideo.thumbnailUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-black dark:text-white mb-1 line-clamp-2">{latestVideo.title}</h3>
                            <p className="text-xs text-gray-500 mb-3">Опубликовано: {latestVideo.postedAt}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Просмотры</p>
                                <p className="text-black dark:text-white font-medium">{latestVideo.views}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">CTR</p>
                                <p className="text-black dark:text-white font-medium">--</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Ср. просмотр</p>
                                <p className="text-black dark:text-white font-medium">--</p>
                            </div>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <div className="py-8 text-center text-gray-500">
                        У вас пока нет опубликованных видео.
                    </div>
                 )}
                 <button className="mt-4 text-blue-600 uppercase text-sm font-medium hover:text-blue-700">Перейти к статистике видео</button>
              </div>
            </div>

            {/* Right Column Stats */}
            <div className="flex flex-col gap-4">
               <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-6 border border-gray-200 dark:border-[#333]">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-[#aaa] mb-1">Аналитика по каналу</h3>
                  <p className="text-xs text-gray-500 mb-4">Текущая статистика</p>
                  
                  <div className="mb-6">
                     <div className="text-3xl font-bold text-black dark:text-white">{user.name ? '0' : MOCK_ANALYTICS.subscribers}</div>
                     <div className="text-xs text-gray-500">Подписчиков</div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-[#333] pt-4 space-y-4">
                     <div className="flex justify-between items-center">
                        <div>
                           <div className="text-sm font-medium text-black dark:text-white">Просмотры</div>
                           <div className="text-xs text-gray-500">Последние 28 дней</div>
                        </div>
                        <div className="text-sm font-bold text-black dark:text-white">{MOCK_ANALYTICS.views}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div>
                           <div className="text-sm font-medium text-black dark:text-white">Время просмотра (часы)</div>
                           <div className="text-xs text-gray-500">Последние 28 дней</div>
                        </div>
                        <div className="text-sm font-bold text-black dark:text-white">{MOCK_ANALYTICS.watchTime}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div>
                           <div className="text-sm font-medium text-black dark:text-white">Расчетный доход</div>
                           <div className="text-xs text-gray-500">Последние 28 дней</div>
                        </div>
                        <div className="text-sm font-bold text-black dark:text-white">{MOCK_ANALYTICS.revenue}</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'content':
         return (
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-[#333] overflow-hidden">
               <div className="p-4 border-b border-gray-200 dark:border-[#333] flex justify-between items-center">
                  <h2 className="font-bold text-black dark:text-white">Контент на канале</h2>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full">
                        <Filter className="w-5 h-5 text-black dark:text-white" />
                     </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 dark:bg-[#2a2a2a] text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-[#333]">
                        <tr>
                           <th className="px-6 py-3 w-[40%]">Видео</th>
                           <th className="px-6 py-3">Видимость</th>
                           <th className="px-6 py-3">Дата</th>
                           <th className="px-6 py-3 text-right">Просмотры</th>
                           <th className="px-6 py-3 text-right">Комментарии</th>
                           <th className="px-6 py-3 text-right">Лайки</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-200 dark:divide-[#333]">
                        {videos.length > 0 ? videos.map((video) => (
                           <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] group">
                              <td className="px-6 py-4">
                                 <div className="flex gap-4">
                                    <div className="w-24 h-14 bg-gray-200 dark:bg-[#111] rounded flex-shrink-0 overflow-hidden relative">
                                       <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                                       <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 rounded">{video.duration}</div>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                       <div className="font-medium text-black dark:text-white truncate max-w-[200px]">{video.title}</div>
                                       <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="p-1 hover:text-blue-500" title="Редактировать"><PenSquare className="w-4 h-4 text-gray-500" /></button>
                                          <button className="p-1 hover:text-blue-500" title="Аналитика"><BarChart3 className="w-4 h-4 text-gray-500" /></button>
                                          <Link to={`/watch/${video.id}`} className="p-1 hover:text-blue-500" title="Смотреть"><Eye className="w-4 h-4 text-gray-500" /></Link>
                                          <button 
                                            onClick={() => handleDeleteVideo(video.id)}
                                            className="p-1 hover:text-red-500" 
                                            title="Удалить"
                                          >
                                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1 text-sm text-green-600">
                                    <Eye className="w-4 h-4" /> Открытый
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                 {video.postedAt}
                              </td>
                              <td className="px-6 py-4 text-sm text-black dark:text-white text-right">
                                 {video.views}
                              </td>
                              <td className="px-6 py-4 text-sm text-black dark:text-white text-right">
                                 {comments.filter(c => c.videoTitle === video.id).length}
                              </td>
                              <td className="px-6 py-4 text-sm text-black dark:text-white text-right">
                                 {video.likes || 0}
                              </td>
                           </tr>
                        )) : (
                           <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                 Видео не найдены. Загрузите свое первое видео!
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         );

      case 'comments':
         return (
            <div className="bg-white dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-[#333] p-4">
               <h2 className="font-bold text-black dark:text-white mb-6">Комментарии к каналу</h2>
               <div className="flex flex-col gap-6">
                  {comments.length > 0 ? comments.map((comment) => (
                     <div key={comment.id} className="flex gap-4 border-b border-gray-200 dark:border-[#333] pb-4 last:border-0">
                        <img src={comment.avatar} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-black dark:text-white">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                           </div>
                           <p className="text-sm text-black dark:text-white mb-2">{comment.text}</p>
                           <div className="text-xs text-gray-500 font-medium mb-2">
                              Видео: <Link to={`/watch/${comment.videoTitle}`} className="text-blue-500 hover:underline cursor-pointer">{getVideoTitle(comment.videoTitle)}</Link>
                           </div>
                           <div className="flex items-center gap-4">
                              <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full"><ThumbsUp className="w-4 h-4 text-gray-500" /></button>
                              <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full hover:text-red-500"
                                title="Удалить комментарий"
                              >
                                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                              </button>
                           </div>
                        </div>
                     </div>
                  )) : (
                    <div className="text-center py-10 text-gray-500">
                      Нет комментариев.
                    </div>
                  )}
               </div>
            </div>
         );

      case 'earn':
         return (
            <div className="max-w-4xl mx-auto text-center py-10">
               <div className="mb-8">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <DollarSign className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Станьте партнером</h2>
                  <p className="text-gray-600 dark:text-[#aaa] max-w-xl mx-auto">
                     Выполните требования, чтобы подать заявку на участие в Партнерской программе YouTube и начать зарабатывать.
                  </p>
               </div>
               <button className="mt-10 px-8 py-3 bg-gray-200 dark:bg-[#333] text-gray-500 dark:text-[#888] font-bold rounded uppercase cursor-not-allowed">
                  Подать заявку (еще не готово)
               </button>
            </div>
         );
         
      default:
         return <div className="text-center py-20">Раздел в разработке</div>;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-56px)] bg-[#f9f9f9] dark:bg-[#111]">
       {/* Studio Sidebar */}
       <div className="w-16 md:w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-[#333] flex-shrink-0 flex flex-col">
          <div className="p-4 hidden md:flex items-center gap-3 mb-2">
             <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-[#111] mx-auto overflow-hidden">
                <img src={user.avatarUrl} className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="px-4 hidden md:block text-center mb-6">
             <h3 className="font-bold text-black dark:text-white">Ваш канал</h3>
             <p className="text-xs text-gray-500">{user.name}</p>
          </div>

          <nav className="flex-1">
             {MENU_ITEMS.map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors border-l-4 ${activeTab === item.id ? 'bg-gray-100 dark:bg-[#2a2a2a] text-red-600 border-red-600' : 'border-transparent text-gray-600 dark:text-[#aaa] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]'}`}
               >
                 <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-red-600' : ''}`} />
                 <span className="hidden md:block font-medium text-sm">{item.label}</span>
               </button>
             ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-[#333]">
             <button className="flex items-center gap-4 text-gray-600 dark:text-[#aaa] hover:text-black dark:hover:text-white transition-colors w-full">
                <ExternalLink className="w-5 h-5" />
                <span className="hidden md:block text-sm font-medium">Настройки</span>
             </button>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold text-black dark:text-white">
                {MENU_ITEMS.find(i => i.id === activeTab)?.label}
             </h1>
             <div className="flex gap-3">
                 <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded uppercase hover:opacity-90">
                    Создать
                 </button>
             </div>
          </div>
          
          {renderContent()}
       </div>
    </div>
  );
};
