
import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Notification } from '../types';
import { MoreVertical, Settings, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FILTERS = ['Все', 'Упоминания'];

export const Notifications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Все');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-[800px] mx-auto w-full min-h-full pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-yt-base/95 backdrop-blur-sm pt-4 pb-2 px-4 border-b border-gray-200 dark:border-[#3f3f3f]">
         <h1 className="text-xl font-bold text-black dark:text-white mb-4">Уведомления</h1>
         
         <div className="flex items-center justify-between">
            <div className="flex gap-3">
               {FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${activeFilter === filter 
                        ? 'bg-black text-white dark:bg-white dark:text-black' 
                        : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-[#272727] dark:text-white dark:hover:bg-[#3f3f3f]'}
                    `}
                  >
                    {filter}
                  </button>
               ))}
            </div>
            <Link to="/settings" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
               <Settings className="w-4 h-4" />
               <span>Настройки</span>
            </Link>
         </div>
      </div>

      {/* List */}
      <div className="flex flex-col mt-2">
         {notifications.length > 0 ? (
            notifications.map(notification => (
               <div 
                 key={notification.id} 
                 className={`
                   flex gap-4 px-4 py-4 border-b border-gray-100 dark:border-[#2a2a2a] group cursor-pointer relative
                   ${!notification.isRead ? 'bg-blue-50 dark:bg-[#1a202c]' : 'hover:bg-gray-50 dark:hover:bg-[#1f1f1f]'}
                 `}
                 onClick={() => handleMarkAsRead(notification.id)}
               >
                  {/* Blue dot for unread */}
                  {!notification.isRead && (
                     <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-600" />
                  )}

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                     <img src={notification.actorAvatar} className="w-12 h-12 rounded-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center gap-1">
                     <div className="text-sm text-black dark:text-white leading-snug pr-8">
                        <span className="font-bold">{notification.actorName}</span> {notification.text}
                     </div>
                     <div className="text-xs text-gray-500">
                        {notification.timeAgo}
                     </div>
                  </div>

                  {/* Thumbnail (if exists) */}
                  {notification.thumbnailUrl && (
                     <div className="flex-shrink-0 w-20 h-11 bg-gray-200 dark:bg-[#111] rounded overflow-hidden">
                        <img src={notification.thumbnailUrl} className="w-full h-full object-cover" />
                     </div>
                  )}

                  {/* Actions (visible on hover) */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           handleDelete(notification.id);
                        }}
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
                        title="Скрыть"
                     >
                        <MoreVertical className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            ))
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-gray-400" />
               </div>
               <h2 className="text-lg font-bold text-black dark:text-white mb-1">Уведомлений нет</h2>
               <p className="text-gray-500 text-sm">Здесь будут отображаться новости ваших любимых каналов.</p>
            </div>
         )}
      </div>
    </div>
  );
};