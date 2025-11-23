import { supabase } from './config';
import { UserProfile } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

const USERS_TABLE = 'users';

export const authService = {
  // Регистрация с email/password
  async signUp(email: string, password: string, displayName: string): Promise<SupabaseUser> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('Не удалось создать пользователя');

      // Создаем профиль в базе данных
      const profile: UserProfile = {
        name: displayName,
        handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
        email: email,
        avatarUrl: data.user.user_metadata?.avatar_url || `https://placehold.co/150x150/2563eb/fff?text=${displayName.charAt(0).toUpperCase()}`,
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

      await this.setUserProfile(data.user.id, profile);

      return data.user;
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Вход с email/password
  async signIn(email: string, password: string): Promise<SupabaseUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Пользователь не найден');

      return data.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Вход через Google
  async signInWithGoogle(): Promise<SupabaseUser> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        // Проверяем специфичные ошибки
        if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
          throw new Error('Google OAuth не настроен в Supabase. Пожалуйста, включите Google провайдер в Supabase Dashboard: Authentication → Providers → Google');
        }
        throw error;
      }

      // OAuth редирект произойдет автоматически, поэтому мы не можем вернуть user сразу
      // Пользователь будет обработан в onAuthStateChanged после редиректа
      // Получаем текущего пользователя, если он уже авторизован
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return user;
      }

      // Если пользователь не авторизован, OAuth редирект произойдет
      // Возвращаем временный объект для совместимости
      return {} as SupabaseUser;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  // Анонимная авторизация (fallback) - Supabase не поддерживает анонимную авторизацию напрямую
  // Можно использовать guest session или пропустить
  async signInAnonymously(): Promise<SupabaseUser> {
    throw new Error('Анонимная авторизация не поддерживается в Supabase. Пожалуйста, зарегистрируйтесь или войдите.');
  },

  // Выход
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Получить профиль пользователя
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from(USERS_TABLE)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Запись не найдена
          return null;
        }
        throw error;
      }

      return data as UserProfile;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Создать или обновить профиль пользователя
  async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      const { error } = await supabase
        .from(USERS_TABLE)
        .upsert({
          id: userId,
          ...profile,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error setting user profile:', error);
      throw error;
    }
  },

  // Подписка на изменения состояния авторизации
  onAuthStateChanged(callback: (user: SupabaseUser | null) => void) {
    let isInitialLoad = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Проверяем, есть ли профиль в базе данных
        const existingProfile = await this.getUserProfile(session.user.id);
        if (!existingProfile) {
          // Создаем профиль для нового пользователя
          const profile: UserProfile = {
            name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Пользователь',
            handle: `@${session.user.email?.split('@')[0] || 'user'}`,
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || `https://placehold.co/150x150/2563eb/fff?text=${(session.user.user_metadata?.display_name || session.user.email || 'U').charAt(0).toUpperCase()}`,
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

          try {
            await this.setUserProfile(session.user.id, profile);
          } catch (error) {
            console.error('Error creating user profile:', error);
          }
        }
      }

      // Вызываем callback только если это не начальная загрузка
      // (начальная загрузка обрабатывается через getUser ниже)
      if (!isInitialLoad) {
        callback(session?.user ?? null);
      }
    });

    // Вызываем callback с текущим пользователем при инициализации
    supabase.auth.getUser().then(({ data: { user } }) => {
      isInitialLoad = false;
      callback(user);
    });

    // Возвращаем объект с методом unsubscribe
    return {
      unsubscribe: () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      }
    };
  },

  // Получить текущего пользователя
  async getCurrentUser(): Promise<SupabaseUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

