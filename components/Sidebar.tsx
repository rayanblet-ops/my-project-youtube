
import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, User, Film, Gamepad2, Flame, Music2, Newspaper, Trophy, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
}

const MAIN_ITEMS: SidebarItem[] = [
  { icon: Home, label: 'Главная', path: '/' },
  { icon: Compass, label: 'Shorts', path: '/shorts' },
  { icon: PlaySquare, label: 'Подписки', path: '/subscriptions' },
];

const SECONDARY_ITEMS: SidebarItem[] = [
  { icon: User, label: 'Мой канал', path: '/channel/me' },
  { icon: LayoutDashboard, label: 'Творческая студия', path: '/studio' },
  { icon: Clock, label: 'История', path: '/history' },
  { icon: PlaySquare, label: 'Ваши видео', path: '/library' },
  { icon: Clock, label: 'Смотреть позже', path: '/playlist/watch-later' },
  { icon: ThumbsUp, label: 'Понравившиеся', path: '/playlist/liked' },
];

const EXPLORE_ITEMS: SidebarItem[] = [
  { icon: Flame, label: 'В тренде', path: '/trending' },
  { icon: Music2, label: 'Музыка', path: '/trending?category=music' },
  { icon: Gamepad2, label: 'Видеоигры', path: '/trending?category=gaming' },
  { icon: Newspaper, label: 'Новости', path: '/trending?category=news' },
  { icon: Trophy, label: 'Спорт', path: '/trending?category=sports' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  // Mobile/Collapsed styles vs Full styles
  const sidebarClasses = isOpen 
    ? "w-60 px-3" 
    : "w-[72px] px-1 hidden sm:block";

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const ItemRenderer = ({ items }: { items: SidebarItem[] }) => (
    <>
      {items.map((item, idx) => {
        const active = isActive(item.path);
        return (
          <Link
            key={idx}
            to={item.path || '#'}
            className={`flex items-center ${isOpen ? 'flex-row px-3 gap-5' : 'flex-col gap-1 justify-center'} py-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-yt-hover transition-colors ${active ? 'bg-gray-100 dark:bg-yt-spec font-medium' : ''}`}
          >
            <item.icon className={`${isOpen ? 'w-6 h-6' : 'w-6 h-6 mb-1'} ${active ? 'text-black dark:text-white fill-current' : 'text-black dark:text-white'}`} />
            <span className={`${isOpen ? 'text-sm' : 'text-[10px]'} text-black dark:text-yt-text truncate w-full ${!isOpen && 'text-center'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </>
  );

  return (
    <aside className={`fixed left-0 top-14 bottom-0 bg-white dark:bg-yt-base overflow-y-auto overflow-x-hidden transition-all duration-200 z-40 hover:scrollbar-thin ${sidebarClasses}`}>
      <div className="pt-2 pb-2">
        <ItemRenderer items={MAIN_ITEMS} />
      </div>
      
      {isOpen && (
        <>
          <div className="my-2 border-t border-gray-200 dark:border-[#3f3f3f] mx-2" />
          <div className="py-2">
             <h3 className="px-3 mb-2 text-base font-semibold text-black dark:text-yt-text">Вы</h3>
            <ItemRenderer items={SECONDARY_ITEMS} />
          </div>
          <div className="my-2 border-t border-gray-200 dark:border-[#3f3f3f] mx-2" />
           <div className="py-2">
             <h3 className="px-3 mb-2 text-base font-semibold text-black dark:text-yt-text">Навигатор</h3>
            <ItemRenderer items={EXPLORE_ITEMS} />
          </div>
           <div className="my-2 border-t border-gray-200 dark:border-[#3f3f3f] mx-2" />
           <div className="py-2">
            <Link
              to="/settings"
              className={`flex items-center flex-row px-3 gap-5 py-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-yt-hover transition-colors ${isActive('/settings') ? 'bg-gray-100 dark:bg-yt-spec font-medium' : ''}`}
            >
              <SettingsIcon className="w-6 h-6 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-yt-text truncate w-full">
                Настройки
              </span>
            </Link>
           </div>
           <div className="my-2 border-t border-gray-200 dark:border-[#3f3f3f] mx-2" />
           <div className="px-5 py-4 text-xs text-gray-600 dark:text-[#aaa] font-semibold">
              <p className="mb-2">О сервисе Прессе Авторские права Связаться с нами Авторам Реклама Разработчикам</p>
              <p>© 2025 Google LLC</p>
           </div>
        </>
      )}
    </aside>
  );
};
