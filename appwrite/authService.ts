import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from './config';
import { UserProfile } from '../types';
import { Models, ID, Query } from 'appwrite';

export type AppwriteUser = Models.User<Models.Preferences>;

export const authService = {
  async signUp(email: string, password: string, displayName: string): Promise<AppwriteUser> {
    try {
      try {
        await account.deleteSession('current');
      } catch {}

      const user = await account.create(ID.unique(), email, password, displayName);
      await account.createEmailPasswordSession(email, password);
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
      return await account.get();
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  async signIn(emailOrUsername: string, password: string): Promise<AppwriteUser> {
    try {
      try {
        await account.deleteSession('current');
      } catch {}

      const isEmail = emailOrUsername.includes('@');
      let userEmail = emailOrUsername;

      if (!isEmail) {
        try {
          const searchTerm = emailOrUsername.trim();
          let foundUser: any = null;

          try {
            const users = await databases.listDocuments(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              [Query.equal('name', searchTerm)]
            );
            if (users.documents.length > 0) {
              foundUser = users.documents[0];
            }
          } catch {}

          if (!foundUser) {
            try {
              const users = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.search('name', searchTerm)]
              );
              if (users.documents.length > 0) {
                const exactMatch = users.documents.find((doc: any) => {
                  const docName = (doc.name || '').trim();
                  return docName.toLowerCase() === searchTerm.toLowerCase();
                });
                foundUser = exactMatch || users.documents[0];
              }
            } catch {}
          }

          if (!foundUser) {
            try {
              const handleToSearch = searchTerm.startsWith('@') 
                ? searchTerm.substring(1) 
                : searchTerm;
              const handleWithAt = `@${handleToSearch.toLowerCase().replace(/\s+/g, '_')}`;
              
              const users = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal('handle', handleWithAt)]
              );
              
              if (users.documents.length > 0) {
                foundUser = users.documents[0];
              }
            } catch {}
          }

          if (!foundUser) {
            try {
              const allUsers = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                []
              );
              
              foundUser = allUsers.documents.find((doc: any) => {
                const docName = (doc.name || '').toLowerCase().trim();
                const docHandle = (doc.handle || '').toLowerCase().trim();
                const searchLower = searchTerm.toLowerCase().trim();
                return docName === searchLower || docHandle === searchLower || docHandle === `@${searchLower}`;
              });
            } catch {}
          }

          if (!foundUser) {
            throw new Error('Пользователь с таким именем не найден. Проверьте правильность имени или войдите по email.');
          }

          const userProfile = foundUser as unknown as UserProfile;
          userEmail = userProfile.email;

          if (!userEmail) {
            throw new Error('Не удалось найти email пользователя в профиле');
          }
        } catch (searchError: any) {
          if (searchError.code === 401 || searchError.code === 403) {
            throw new Error('Нет доступа к базе данных. Проверьте настройки прав доступа в Appwrite Dashboard: Settings → Permissions → Read должно быть "Any" или "Users".');
          }
          
          if (searchError.code === 404 || searchError.message?.includes('not found')) {
            throw new Error('База данных или коллекция не найдена. Проверьте настройки Appwrite.');
          }
          
          if (searchError.message?.includes('не найден')) {
            throw searchError;
          }
          
          throw new Error(`Ошибка поиска пользователя: ${searchError.message || 'Неизвестная ошибка'}`);
        }
      }

      const session = await account.createEmailPasswordSession(userEmail, password);
      const user = await account.get();
      
      if (!user) {
        throw new Error('Не удалось получить данные пользователя после входа');
      }
      
      return user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      const errorMessage = error.message || '';
      const errorCode = error.code;
      if (errorCode === 401) {
        if (errorMessage.includes('session is active') || errorMessage.includes('session is prohibited')) {
          try {
            const user = await account.get();
            if (user) {
              return user;
            }
          } catch {
            try {
              await account.deleteSession('current');
              const session = await account.createEmailPasswordSession(emailOrUsername.includes('@') ? emailOrUsername : emailOrUsername, password);
              return await account.get();
            } catch (retryError) {
              throw new Error('Неверный email или пароль');
            }
          }
        }
        if (errorMessage.includes('email') || errorMessage.includes('password') || errorMessage.includes('Invalid credentials')) {
          throw new Error('Неверный email/имя пользователя или пароль');
        }
        throw new Error('Ошибка авторизации. Проверьте email/имя пользователя и пароль');
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

  async signInWithGoogle(): Promise<void> {
    try {
      account.createOAuth2Session('google' as any, `${window.location.origin}/`, `${window.location.origin}/login`);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error.message?.includes('OAuth client was not found') || error.message?.includes('invalid_client')) {
        throw new Error('Google OAuth не настроен в Appwrite. Пожалуйста, настройте Google провайдер в Appwrite Dashboard: Auth → Providers → Google.');
      }
      throw error;
    }
  },

  async signInAnonymously(): Promise<AppwriteUser> {
    try {
      const user = await account.createAnonymousSession();
      return await account.get();
    } catch (error: any) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

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

  async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
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

      try {
        await databases.createDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userId,
          {
            ...basicProfile,
            notifications: typeof profile.notifications === 'object' ? JSON.stringify(profile.notifications) : profile.notifications,
            playback: typeof profile.playback === 'object' ? JSON.stringify(profile.playback) : profile.playback,
            privacy: typeof profile.privacy === 'object' ? JSON.stringify(profile.privacy) : profile.privacy,
          }
        );
      } catch (createError: any) {
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
      if (error.code === 409) {
        try {
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
      }
    }
  },

  onAuthStateChanged(callback: (user: AppwriteUser | null) => void) {
    account.get()
      .then((user) => {
        callback(user);
      })
      .catch(() => {
        callback(null);
      });

    const checkAuth = async () => {
      try {
        const user = await account.get();
        callback(user);
      } catch {
        callback(null);
      }
    };

    window.addEventListener('focus', checkAuth);

    return {
      unsubscribe: () => {
        window.removeEventListener('focus', checkAuth);
      }
    };
  },

  async getCurrentUser(): Promise<AppwriteUser | null> {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }
};

