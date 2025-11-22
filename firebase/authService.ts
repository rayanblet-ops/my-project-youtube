import { 
  signInAnonymously, 
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile } from '../types';

const USERS_COLLECTION = 'users';
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Регистрация с email/password
  async signUp(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Обновляем displayName
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Создаем профиль в Firestore
      const profile: UserProfile = {
        name: displayName,
        handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
        email: email,
        avatarUrl: userCredential.user.photoURL || `https://placehold.co/150x150/2563eb/fff?text=${displayName.charAt(0).toUpperCase()}`,
        description: 'Новый пользователь',
        country: 'RU',
        language: 'Русский',
        theme: 'dark',
        notifications: {
          subscriptions: true,
          recommended: false,
          activity: true,
          emailDigest: false,
        },
        playback: {
          autoplay: true,
          subtitles: false,
          quality: 'auto',
        },
        privacy: {
          privatePlaylists: true,
          privateSubscriptions: false,
        }
      };
      
      await this.setUserProfile(userCredential.user.uid, profile);
      
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Вход с email/password
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Вход через Google
  async signInWithGoogle(): Promise<FirebaseUser> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Проверяем, есть ли профиль в Firestore
      try {
        const existingProfile = await this.getUserProfile(user.uid);
        if (!existingProfile) {
          // Создаем профиль для нового пользователя
          const profile: UserProfile = {
            name: user.displayName || 'Пользователь',
            handle: `@${user.email?.split('@')[0] || 'user'}`,
            email: user.email || '',
            avatarUrl: user.photoURL || `https://placehold.co/150x150/2563eb/fff?text=${(user.displayName || 'U').charAt(0).toUpperCase()}`,
            description: 'Пользователь YouTube',
            country: 'RU',
            language: 'Русский',
            theme: 'dark',
            notifications: {
              subscriptions: true,
              recommended: false,
              activity: true,
              emailDigest: false,
            },
            playback: {
              autoplay: true,
              subtitles: false,
              quality: 'auto',
            },
            privacy: {
              privatePlaylists: true,
              privateSubscriptions: false,
            }
          };
          
          await this.setUserProfile(user.uid, profile);
        }
      } catch (profileError: any) {
        console.error('Error with user profile:', profileError);
        // Если ошибка с профилем, но пользователь авторизован - продолжаем
        if (profileError?.code === 'permission-denied') {
          // Продолжаем, но пользователь может не иметь профиля
        } else {
          // Для других ошибок пробрасываем дальше
          throw profileError;
        }
      }
      
      return user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        // Пользователь закрыл окно - это не ошибка
        throw error;
      } else if (error?.code === 'auth/popup-blocked') {
        throw new Error('Всплывающее окно было заблокировано браузером. Разрешите всплывающие окна для этого сайта.');
      } else if (error?.code === 'auth/unauthorized-domain') {
        throw new Error('Домен не авторизован. Проверьте настройки Firebase Authentication.');
      }
      throw error;
    }
  },

  // Анонимная авторизация (fallback)
  async signInAnonymously(): Promise<FirebaseUser> {
    try {
      const userCredential = await signInAnonymously(auth);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },

  // Выход
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Получить профиль пользователя
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Создать или обновить профиль пользователя
  async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(docRef, profile, { merge: true });
    } catch (error: any) {
      console.error('Error setting user profile:', error);
      throw error;
    }
  },

  // Подписка на изменения состояния авторизации
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

