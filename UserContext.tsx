
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProfile } from './types';
import { MOCK_USER } from './constants';
import { authService, AppwriteUser } from './appwrite/authService';

interface UserContextType {
  user: UserProfile;
  appwriteUser: AppwriteUser | null;
  updateUser: (updatedUser: UserProfile) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [appwriteUser, setAppwriteUser] = useState<AppwriteUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Appwrite Auth and load user profile
  useEffect(() => {
    const unsubscribeObj = authService.onAuthStateChanged(async (appwriteUser) => {
      setAppwriteUser(appwriteUser);
      
      if (appwriteUser) {
        // Загружаем профиль пользователя из базы данных
        const userProfile = await authService.getUserProfile(appwriteUser.$id);
        if (userProfile) {
          setUser(userProfile);
        } else {
          // Если профиля нет, создаем новый на основе MOCK_USER
          try {
            const newProfile = {
              ...MOCK_USER,
              name: appwriteUser.name || appwriteUser.email?.split('@')[0] || appwriteUser.$id.substring(0, 8) || MOCK_USER.name,
              email: appwriteUser.email || MOCK_USER.email,
              avatarUrl: MOCK_USER.avatarUrl
            };
            await authService.setUserProfile(appwriteUser.$id, newProfile);
            setUser(newProfile);
          } catch (error: any) {
            console.error('Error creating user profile:', error);
            // Используем временный профиль, если не удалось сохранить
            const tempProfile = {
              ...MOCK_USER,
              name: appwriteUser.name || appwriteUser.email?.split('@')[0] || 'Пользователь',
              email: appwriteUser.email || '',
              avatarUrl: MOCK_USER.avatarUrl
            };
            setUser(tempProfile);
          }
        }
      } else {
        // Если пользователь не авторизован, используем дефолтный профиль
        // Пользователь будет перенаправлен на страницу входа через защиту маршрутов
        setUser(MOCK_USER);
      }
      
      setIsLoading(false);
    });

    return () => {
      if (unsubscribeObj && typeof unsubscribeObj.unsubscribe === 'function') {
        unsubscribeObj.unsubscribe();
      }
    };
  }, []);

  const updateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (appwriteUser) {
      await authService.setUserProfile(appwriteUser.$id, updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, appwriteUser, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
