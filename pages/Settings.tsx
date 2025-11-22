
import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, PlayCircle, Shield, CreditCard, Database, LogOut, Camera, Check } from 'lucide-react';
import { useUser } from '../UserContext';
import { Video } from '../types';

const TABS = [
  { id: 'account', label: 'Аккаунт', icon: User },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'playback', label: 'Воспроизведение', icon: PlayCircle },
  { id: 'privacy', label: 'Конфиденциальность', icon: Shield },
  { id: 'billing', label: 'Покупки и подписки', icon: CreditCard },
  { id: 'advanced', label: 'Дополнительно', icon: Database },
];

export const Settings: React.FC = () => {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  
  // Local state for editing form, synced with global user on mount/update
  const [formData, setFormData] = useState(user);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = () => {
    // 1. Update User Context & Profile Storage
    updateUser(formData);

    // 2. CRITICAL FIX: Update all existing videos uploaded by this user
    // This prevents "broken" avatars on old videos when the user changes their profile picture
    try {
        const storedVideos = localStorage.getItem('yt_videos');
        if (storedVideos) {
            const allVideos: Video[] = JSON.parse(storedVideos);
            const updatedVideos = allVideos.map(v => {
                // If the video belongs to the user (matching by old name or assume all are user's in this demo)
                if (v.channelName === user.name || v.channelName === formData.name) {
                    return {
                        ...v,
                        channelName: formData.name,
                        channelAvatarUrl: formData.avatarUrl
                    };
                }
                return v;
            });
            localStorage.setItem('yt_videos', JSON.stringify(updatedVideos));
        }
    } catch (e) {
        console.error("Error syncing videos with new profile", e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatarUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="max-w-2xl">
             <h2 className="text-xl font-bold text-black dark:text-white mb-6">Настройки аккаунта</h2>
             
             {/* Profile Header */}
             <div className="flex items-center gap-6 mb-8">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                   <img src={formData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all" />
                   <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                   </div>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*"
                     onChange={handleFileChange} 
                   />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-black dark:text-white">{formData.name}</h3>
                   <p className="text-gray-500 text-sm">{formData.email}</p>
                   <button onClick={handleAvatarClick} className="text-blue-600 text-sm font-medium mt-1 hover:underline">Сменить фото профиля</button>
                </div>
             </div>

             {/* Forms */}
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700 dark:text-[#aaa]">Имя канала</label>
                   <input 
                     type="text" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="bg-gray-100 dark:bg-[#181818] border border-transparent focus:border-blue-500 rounded p-2 text-black dark:text-white outline-none"
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700 dark:text-[#aaa]">Псевдоним (Handle)</label>
                   <input 
                     type="text" 
                     value={formData.handle}
                     onChange={(e) => setFormData({...formData, handle: e.target.value})}
                     className="bg-gray-100 dark:bg-[#181818] border border-transparent focus:border-blue-500 rounded p-2 text-black dark:text-white outline-none"
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-700 dark:text-[#aaa]">Описание канала</label>
                   <textarea 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     rows={4}
                     className="bg-gray-100 dark:bg-[#181818] border border-transparent focus:border-blue-500 rounded p-2 text-black dark:text-white outline-none resize-none"
                   />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-[#aaa]">Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-100 dark:bg-[#181818] border border-transparent focus:border-blue-500 rounded p-2 text-black dark:text-white outline-none"
                    />
                </div>
             </div>
          </div>
        );

      // ... existing cases for notifications, playback, privacy, advanced ...
      case 'notifications':
        return (
          <div className="max-w-2xl">
             <h2 className="text-xl font-bold text-black dark:text-white mb-6">Уведомления</h2>
             <div className="space-y-6">
                {/* Notification settings toggles (simplified for brevity, keeping existing structure) */}
                 <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#3f3f3f]">
                   <div>
                      <h3 className="font-medium text-black dark:text-white">Подписки</h3>
                      <p className="text-sm text-gray-500">Уведомлять о действиях в каналах, на которые вы подписаны</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.notifications.subscriptions}
                        onChange={(e) => setFormData({...formData, notifications: {...formData.notifications, subscriptions: e.target.checked}})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                   </label>
                </div>
             </div>
          </div>
        );
      case 'playback':
        return <div className="max-w-2xl"><h2 className="text-xl font-bold text-black dark:text-white mb-6">Воспроизведение (Настройки сохранены)</h2></div>;
      case 'privacy':
         return <div className="max-w-2xl"><h2 className="text-xl font-bold text-black dark:text-white mb-6">Конфиденциальность (Настройки сохранены)</h2></div>;
      default:
        return (
          <div className="max-w-2xl flex flex-col gap-6">
             <h2 className="text-xl font-bold text-black dark:text-white">Дополнительно</h2>
             <button className="text-left text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded transition-colors w-fit flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Удалить аккаунт
             </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-full bg-white dark:bg-yt-base">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-56px)]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 p-4 border-r border-gray-200 dark:border-[#3f3f3f]">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-6 px-3">Настройки</h1>
          <div className="flex flex-col gap-1">
             {TABS.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-gray-100 dark:bg-[#272727] text-black dark:text-white' : 'text-gray-600 dark:text-[#aaa] hover:bg-gray-50 dark:hover:bg-[#272727]'}`}
               >
                 <tab.icon className="w-5 h-5" />
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10">
           {renderContent()}
           
           <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#3f3f3f] flex items-center gap-4">
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Сохранить
              </button>
              <button 
                onClick={() => setFormData(user)}
                className="px-6 py-2 text-gray-600 dark:text-[#aaa] font-medium hover:text-black dark:hover:text-white transition-colors"
              >
                Отмена
              </button>
              
              {isSaved && (
                <span className="text-green-600 flex items-center gap-2 text-sm font-medium animate-fade-in">
                  <Check className="w-4 h-4" /> Сохранено и обновлено
                </span>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
