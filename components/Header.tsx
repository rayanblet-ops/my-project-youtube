
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Mic, Video as VideoIcon, Bell, Upload, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useUser } from '../UserContext';
import { authService } from '../appwrite/authService';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, appwriteUser } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Mock unread count
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Sync input with URL query param
  useEffect(() => {
    const query = searchParams.get('search_query');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white dark:bg-yt-base/95 backdrop-blur-sm w-full h-14 border-b border-gray-200 dark:border-transparent transition-colors duration-300">
      {/* Left Section: Logo & Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-yt-spec rounded-full transition-colors text-black dark:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="relative flex items-center justify-center bg-red-600 rounded-lg w-8 h-6">
            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-black dark:text-white font-sans">YuTube</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 ml-0.5">RU</span>
        </Link>
      </div>

      {/* Center Section: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-[720px] ml-10">
        <form onSubmit={handleSearch} className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-white dark:bg-[#121212] border border-gray-300 dark:border-[#303030] rounded-l-full ml-8 focus-within:border-blue-500 overflow-hidden shadow-inner dark:shadow-none">
            <div className="pl-4 hidden sm:block">
               {/* Search icon hidden inside input usually */}
            </div>
            <input 
              type="text" 
              placeholder="Введите запрос" 
              className="w-full bg-transparent px-4 py-2 text-black dark:text-white outline-none placeholder-gray-500 dark:placeholder-[#888]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-gray-100 dark:bg-[#222] border border-l-0 border-gray-300 dark:border-[#303030] rounded-r-full hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors">
            <Search className="w-5 h-5 text-black dark:text-white" />
          </button>
        </form>
        <button className="ml-4 p-2.5 bg-gray-100 dark:bg-[#181818] hover:bg-gray-200 dark:hover:bg-[#303030] rounded-full transition-colors">
          <Mic className="w-5 h-5 text-black dark:text-white" />
        </button>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-yt-spec rounded-full transition-colors text-black dark:text-white"
              title={isDarkMode ? "Светлая тема" : "Темная тема"}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <Link to="/upload" className="p-2 hover:bg-gray-100 dark:hover:bg-yt-spec rounded-full transition-colors text-black dark:text-white">
              <Upload className="w-6 h-6" />
            </Link>
            
            <Link to="/notifications" className="p-2 hover:bg-gray-100 dark:hover:bg-yt-spec rounded-full transition-colors relative text-black dark:text-white">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1 rounded-full border-2 border-white dark:border-yt-base">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
        </div>
        
        {appwriteUser ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-1 sm:px-1 sm:py-1 flex items-center gap-2 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-[#303030] sm:border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#272727] rounded-lg shadow-xl border border-gray-200 dark:border-[#3f3f3f] py-2 z-50">
                <Link
                  to="/channel/me"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-black dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-[#aaa]">{user.handle}</div>
                  </div>
                </Link>
                <div className="border-t border-gray-200 dark:border-[#3f3f3f] my-2"></div>
                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-black dark:text-white"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm">Настройки</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-black dark:text-white text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Выйти</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
          >
            Войти
          </Link>
        )}
      </div>
    </header>
  );
};
