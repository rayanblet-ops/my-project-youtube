import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from './config';
import { UserProfile } from '../types';
import { Models, ID } from 'appwrite';

export type AppwriteUser = Models.User<Models.Preferences>;

export const authService = {
  // Регистрация с email/password
  async signUp(email: string, password: string, displayName: string): Promise<AppwriteUser> {
    try {
      // Удаляем активную сессию, если есть
      try {
        await account.deleteSession('current');
      } catch {
        // Игнорируем ошибку, если сессии нет
      }

      // Создаем аккаунт в Appwrite
      const user = await account.create(ID.unique(), email, password, displayName);

      // Создаем сессию для автоматического входа
      await account.createEmailPasswordSession(email, password);

      // Создаем профиль в базе данных
      const profile: UserProfile = {
        name: displayName,
        handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
        email: email,
        avatarUrl: `https://placehold.co/150x150/2563eb/fff?text=${displayName.charAt(0).toUpperCase()}`,
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

      await this.setUserProfile(user.$id, profile);

      // Получаем обновленные данные пользователя
      return await account.get();
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Вход с email/password
  async signIn(email: string, password: string): Promise<AppwriteUser> {
    try {
      // Удаляем активную сессию, если есть
      try {
        await account.deleteSession('current');
      } catch {
        // Игнорируем ошибку, если сессии нет
      }

      // Создаем сессию
      const session = await account.createEmailPasswordSession(email, password);
      
      // Получаем данные пользователя
      const user = await account.get();
      
      if (!user) {
        throw new Error('Не удалось получить данные пользователя после входа');
      }
      
      return user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Детальная обработка ошибок Appwrite
      const errorMessage = error.message || '';
      const errorCode = error.code;
      
      // Проверяем различные типы ошибок
      if (errorCode === 401) {
        if (errorMessage.includes('session is active') || errorMessage.includes('session is prohibited')) {
          // Если сессия уже активна, просто получаем пользователя
          try {
            const user = await account.get();
            if (user) {
              return user;
            }
          } catch {
            // Если не удалось получить пользователя, пробуем удалить сессию и создать новую
            try {
              await account.deleteSession('current');
              const session = await account.createEmailPasswordSession(email, password);
              return await account.get();
            } catch (retryError) {
              throw new Error('Неверный email или пароль');
            }
          }
        }
        if (errorMessage.includes('email') || errorMessage.includes('password') || errorMessage.includes('Invalid credentials')) {
          throw new Error('Неверный email или пароль');
        }
        throw new Error('Ошибка авторизации. Проверьте email и пароль');
      } else if (errorCode === 429) {
        throw new Error('Слишком много попыток. Подождите немного и попробуйте снова');
      } else if (errorMessage.includes('email verification') || errorMessage.includes('Email not verified')) {
        throw new Error('Email не подтвержден. Проверьте почту и подтвердите регистрацию');
      } else if (errorMessage.includes('User not found') || errorMessage.includes('user not found')) {
        throw new Error('Пользователь с таким email не найден');
      }
      
      throw error;
    }
  },

  // Вход через Google OAuth
  async signInWithGoogle(): Promise<void> {
    try {
      // Appwrite автоматически обработает OAuth редирект
      // Первый параметр - success URL (куда вернуться после успешной авторизации)
      // Второй параметр - failure URL (куда вернуться при ошибке)
      account.createOAuth2Session('google', `${window.location.origin}/`, `${window.location.origin}/login`);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      // Проверяем специфичные ошибки
      if (error.message?.includes('OAuth client was not found') || error.message?.includes('invalid_client')) {
        throw new Error('Google OAuth не настроен в Appwrite. Пожалуйста, настройте Google провайдер в Appwrite Dashboard: Auth → Providers → Google. См. appwrite/GOOGLE_OAUTH_SETUP.md');
      }
      throw error;
    }
  },

  // Анонимная авторизация
  async signInAnonymously(): Promise<AppwriteUser> {
    try {
      const user = await account.createAnonymousSession();
      return await account.get();
    } catch (error: any) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },

  // Выход
  async signOut(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Получить профиль пользователя
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );

      return document as unknown as UserProfile;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Создать или обновить профиль пользователя
  async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      // Сохраняем только основные атрибуты, которые точно есть в базе данных
      // Исключаем сложные объекты (notifications, playback, privacy), если их нет в схеме
      const basicProfile: any = {
        name: profile.name,
        handle: profile.handle,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        description: profile.description,
        country: profile.country,
        language: profile.language,
        theme: profile.theme,
      };

      // Пробуем сохранить с дополнительными полями
      try {
        await databases.createDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userId, // Используем userId как document ID
          {
            ...basicProfile,
            notifications: typeof profile.notifications === 'object' ? JSON.stringify(profile.notifications) : profile.notifications,
            playback: typeof profile.playback === 'object' ? JSON.stringify(profile.playback) : profile.playback,
            privacy: typeof profile.privacy === 'object' ? JSON.stringify(profile.privacy) : profile.privacy,
          }
        );
      } catch (createError: any) {
        // Если ошибка из-за отсутствующих атрибутов, сохраняем только основные
        if (createError.message?.includes('Unknown attribute') || createError.code === 400) {
          await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId,
            basicProfile
          );
        } else {
          throw createError;
        }
      }
    } catch (error: any) {
      // Если документ уже существует, обновляем его
      if (error.code === 409) {
        try {
          // Пробуем обновить со всеми полями
          await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId,
            {
              name: profile.name,
              handle: profile.handle,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
              description: profile.description,
              country: profile.country,
              language: profile.language,
              theme: profile.theme,
              notifications: typeof profile.notifications === 'object' ? JSON.stringify(profile.notifications) : profile.notifications,
              playback: typeof profile.playback === 'object' ? JSON.stringify(profile.playback) : profile.playback,
              privacy: typeof profile.privacy === 'object' ? JSON.stringify(profile.privacy) : profile.privacy,
            }
          );
        } catch (updateError: any) {
          // Если ошибка из-за отсутствующих атрибутов, обновляем только основные
          if (updateError.message?.includes('Unknown attribute') || updateError.code === 400) {
            await databases.updateDocument(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              userId,
              {
                name: profile.name,
                handle: profile.handle,
                email: profile.email,
                avatarUrl: profile.avatarUrl,
                description: profile.description,
                country: profile.country,
                language: profile.language,
                theme: profile.theme,
              }
            );
          } else {
            throw updateError;
          }
        }
      } else {
        console.error('Error setting user profile:', error);
        // Не бросаем ошибку, чтобы не блокировать регистрацию/вход
        // Профиль можно будет создать позже
      }
    }
  },

  // Подписка на изменения состояния авторизации
  onAuthStateChanged(callback: (user: AppwriteUser | null) => void) {
    // Проверяем текущую сессию
    account.get()
      .then((user) => {
        callback(user);
      })
      .catch(() => {
        callback(null);
      });

    // Appwrite не имеет встроенного real-time для auth, поэтому используем polling
    // или можно использовать события страницы
    const checkAuth = async () => {
      try {
        const user = await account.get();
        callback(user);
      } catch {
        callback(null);
      }
    };

    // Проверяем при загрузке страницы и при фокусе
    window.addEventListener('focus', checkAuth);

    return {
      unsubscribe: () => {
        window.removeEventListener('focus', checkAuth);
      }
    };
  },

  // Получить текущего пользователя
  async getCurrentUser(): Promise<AppwriteUser | null> {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }
};

