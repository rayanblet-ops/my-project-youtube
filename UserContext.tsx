
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserProfile } from './types';
import { MOCK_USER } from './constants';
import { authService } from './firebase/authService';
import { User as FirebaseUser } from 'firebase/auth';

interface UserContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  updateUser: (updatedUser: UserProfile) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firebase Auth and load user profile
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Загружаем профиль пользователя из Firestore
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
        } else {
          // Если профиля нет, создаем новый на основе MOCK_USER
          try {
            const newProfile = {
              ...MOCK_USER,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || firebaseUser.uid.substring(0, 8) || MOCK_USER.name,
              email: firebaseUser.email || MOCK_USER.email,
              avatarUrl: firebaseUser.photoURL || MOCK_USER.avatarUrl
            };
            await authService.setUserProfile(firebaseUser.uid, newProfile);
            setUser(newProfile);
          } catch (error: any) {
            console.error('Error creating user profile:', error);
            // Используем временный профиль, если не удалось сохранить
            const tempProfile = {
              ...MOCK_USER,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Пользователь',
              email: firebaseUser.email || '',
              avatarUrl: firebaseUser.photoURL || MOCK_USER.avatarUrl
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

    return () => unsubscribe();
  }, []);

  const updateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (firebaseUser) {
      await authService.setUserProfile(firebaseUser.uid, updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, firebaseUser, updateUser, isLoading }}>
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
