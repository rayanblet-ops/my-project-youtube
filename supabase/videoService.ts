import { supabase } from './config';
import { Video } from '../types';

const VIDEOS_TABLE = 'videos';
const STORAGE_BUCKET = 'videos'; // Имя bucket в Supabase Storage

export const videoService = {
  // Загрузить видео/изображение в Supabase Storage
  async uploadVideo(
    file: File,
    videoData: Omit<Video, 'id' | 'videoUrl' | 'thumbnailUrl' | 'duration'>,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Пользователь не авторизован. Пожалуйста, войдите в систему.');
      }

      if (onProgress) onProgress(10);

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const isImage = file.type.startsWith('image/');

      if (onProgress) onProgress(30);

      // Загружаем файл в Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      if (onProgress) onProgress(70);

      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      if (onProgress) onProgress(80);

      // Создаем запись в базе данных
      const { data: videoRecord, error: dbError } = await supabase
        .from(VIDEOS_TABLE)
        .insert({
          ...videoData,
          video_url: publicUrl,
          video_path: fileName,
          thumbnail_url: isImage ? publicUrl : `https://placehold.co/640x360/000/fff?text=${encodeURIComponent(videoData.title)}`,
          duration: isImage ? 'Фото' : '0:00',
          type: isImage ? 'image' : 'video',
          file_size: file.size,
          file_name: file.name,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) throw dbError;
      if (onProgress) onProgress(100);

      return videoRecord.id;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Получить все видео
  async getAllVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from(VIDEOS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        channelName: item.channel_name,
        channelAvatarUrl: item.channel_avatar_url,
        views: item.views || '0 просмотров',
        postedAt: item.posted_at || this.formatTimeAgo(new Date(item.created_at)),
        verified: item.verified || false,
        description: item.description || '',
        subscribers: item.subscribers || '0',
        likes: item.likes || '0',
        videoUrl: item.video_url,
        videoPath: item.video_path,
        thumbnailUrl: item.thumbnail_url,
        duration: item.duration || '0:00',
        type: item.type || 'video',
      } as Video));
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  },

  // Получить видео по ID
  async getVideoById(id: string): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from(VIDEOS_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        channelName: data.channel_name,
        channelAvatarUrl: data.channel_avatar_url,
        views: data.views || '0 просмотров',
        postedAt: data.posted_at || this.formatTimeAgo(new Date(data.created_at)),
        verified: data.verified || false,
        description: data.description || '',
        subscribers: data.subscribers || '0',
        likes: data.likes || '0',
        videoUrl: data.video_url,
        videoPath: data.video_path,
        thumbnailUrl: data.thumbnail_url,
        duration: data.duration || '0:00',
        type: data.type || 'video',
      } as Video;
    } catch (error) {
      console.error('Error getting video:', error);
      return null;
    }
  },

  // Получить видео по каналу
  async getVideosByChannel(channelName: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from(VIDEOS_TABLE)
        .select('*')
        .eq('channel_name', channelName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        channelName: item.channel_name,
        channelAvatarUrl: item.channel_avatar_url,
        views: item.views || '0 просмотров',
        postedAt: item.posted_at || this.formatTimeAgo(new Date(item.created_at)),
        verified: item.verified || false,
        description: item.description || '',
        subscribers: item.subscribers || '0',
        likes: item.likes || '0',
        videoUrl: item.video_url,
        videoPath: item.video_path,
        thumbnailUrl: item.thumbnail_url,
        duration: item.duration || '0:00',
        type: item.type || 'video',
      } as Video));
    } catch (error) {
      console.error('Error getting videos by channel:', error);
      return [];
    }
  },

  // Удалить видео
  async deleteVideo(videoId: string, videoUrl?: string, videoPath?: string): Promise<void> {
    try {
      // Сначала удаляем файл из Storage, если есть путь
      if (videoPath) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([videoPath]);

        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
          // Продолжаем удаление записи даже если файл не найден
        }
      }

      // Удаляем запись из базы данных
      const { error } = await supabase
        .from(VIDEOS_TABLE)
        .delete()
        .eq('id', videoId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Обновить видео
  async updateVideo(videoId: string, updates: Partial<Video>): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.likes !== undefined) updateData.likes = updates.likes;
      if (updates.views !== undefined) updateData.views = updates.views;
      if (updates.verified !== undefined) updateData.verified = updates.verified;

      const { error } = await supabase
        .from(VIDEOS_TABLE)
        .update(updateData)
        .eq('id', videoId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  // Форматирование времени
  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ${days === 1 ? 'день' : 'дней'} назад`;
    if (hours > 0) return `${hours} ${hours === 1 ? 'час' : 'часов'} назад`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`;
    return 'Только что';
  }
};

