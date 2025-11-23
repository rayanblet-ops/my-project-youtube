import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useUser } from '../UserContext';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  
  let userContext;
  try {
    userContext = useUser();
  } catch {
    userContext = null;
  }
  
  const appwriteUser = userContext?.appwriteUser;

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (appwriteUser) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl">
            <Play className="w-12 h-12 text-blue-600 dark:text-blue-400 ml-1" fill="currentColor" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          YuTube
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          Добро пожаловать! Смотрите видео, делитесь контентом и открывайте для себя новое
        </p>
        
        <button
          onClick={handleGetStarted}
          className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
        >
          Начать
        </button>
      </div>
    </div>
  );
};

