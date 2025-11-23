import { databases, storage, DATABASE_ID, VIDEOS_COLLECTION_ID, STORAGE_BUCKET_ID, account } from './config';
import { Video } from '../types';
import { ID, Query } from 'appwrite';

export const videoService = {
  // Загрузить видео/изображение в Appwrite Storage
  async uploadVideo(
    file: File,
    videoData: Omit<Video, 'id' | 'videoUrl' | 'thumbnailUrl' | 'duration'>,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const currentUser = await account.get();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован. Пожалуйста, войдите в систему.');
      }

      if (onProgress) onProgress(10);

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.$id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const isImage = file.type.startsWith('image/');

      if (onProgress) onProgress(30);

      // Загружаем файл в Storage
      const fileUpload = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        undefined,
        (progress) => {
          if (onProgress) {
            const uploadProgress = 30 + (progress.chunksUploaded / progress.chunksTotal) * 40;
            onProgress(Math.min(uploadProgress, 70));
          }
        }
      );

      if (onProgress) onProgress(70);

      // Получаем URL файла
      const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, fileUpload.$id);

      if (onProgress) onProgress(80);

      // Создаем запись в базе данных
      const videoRecord = await databases.createDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        ID.unique(),
        {
          ...videoData,
          videoUrl: fileUrl,
          videoFileId: fileUpload.$id,
          thumbnailUrl: isImage ? fileUrl : `https://placehold.co/640x360/000/fff?text=${encodeURIComponent(videoData.title)}`,
          duration: isImage ? 'Фото' : '0:00',
          type: isImage ? 'image' : 'video',
          fileSize: file.size,
          fileName: file.name,
          userId: currentUser.$id,
          likedBy: JSON.stringify([]), // Сохраняем как JSON строку (пустой массив)
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      if (onProgress) onProgress(100);

      return videoRecord.$id;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Получить все видео
  async getAllVideos(): Promise<Video[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        [Query.orderDesc('createdAt')]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        channelName: doc.channelName,
        channelAvatarUrl: doc.channelAvatarUrl,
        views: doc.views || '0 просмотров',
        postedAt: doc.postedAt || this.formatTimeAgo(new Date(doc.createdAt)),
        verified: doc.verified || false,
        description: doc.description || '',
        subscribers: doc.subscribers || '0',
        likes: this.getLikesCount(doc),
        videoUrl: doc.videoUrl,
        videoPath: doc.videoFileId,
        thumbnailUrl: doc.thumbnailUrl,
        duration: doc.duration || '0:00',
        type: doc.type || 'video',
        likedBy: this.parseLikedBy(doc.likedBy),
      } as Video & { likedBy?: string[] }));
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  },

  // Получить видео по ID
  async getVideoById(id: string): Promise<Video | null> {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        id
      );

      return {
        id: doc.$id,
        title: doc.title,
        channelName: doc.channelName,
        channelAvatarUrl: doc.channelAvatarUrl,
        views: doc.views || '0 просмотров',
        postedAt: doc.postedAt || this.formatTimeAgo(new Date(doc.createdAt)),
        verified: doc.verified || false,
        description: doc.description || '',
        subscribers: doc.subscribers || '0',
        likes: this.getLikesCount(doc),
        videoUrl: doc.videoUrl,
        videoPath: doc.videoFileId,
        thumbnailUrl: doc.thumbnailUrl,
        duration: doc.duration || '0:00',
        type: doc.type || 'video',
        likedBy: this.parseLikedBy(doc.likedBy),
      } as Video & { likedBy?: string[] };
    } catch (error: any) {
      if (error.code === 404) return null;
      console.error('Error getting video:', error);
      return null;
    }
  },

  // Получить видео по каналу
  async getVideosByChannel(channelName: string): Promise<Video[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        [
          Query.equal('channelName', channelName),
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        channelName: doc.channelName,
        channelAvatarUrl: doc.channelAvatarUrl,
        views: doc.views || '0 просмотров',
        postedAt: doc.postedAt || this.formatTimeAgo(new Date(doc.createdAt)),
        verified: doc.verified || false,
        description: doc.description || '',
        subscribers: doc.subscribers || '0',
        likes: this.getLikesCount(doc),
        videoUrl: doc.videoUrl,
        videoPath: doc.videoFileId,
        thumbnailUrl: doc.thumbnailUrl,
        duration: doc.duration || '0:00',
        type: doc.type || 'video',
        likedBy: this.parseLikedBy(doc.likedBy),
      } as Video & { likedBy?: string[] }));
    } catch (error) {
      console.error('Error getting videos by channel:', error);
      return [];
    }
  },

  // Удалить видео
  async deleteVideo(videoId: string, videoUrl?: string, videoPath?: string): Promise<void> {
    try {
      // Получаем документ, чтобы узнать fileId
      const videoDoc = await databases.getDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        videoId
      );

      // Удаляем файл из Storage, если есть
      if (videoDoc.videoFileId) {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, videoDoc.videoFileId);
        } catch (storageError) {
          console.warn('Error deleting file from storage:', storageError);
          // Продолжаем удаление записи даже если файл не найден
        }
      }

      // Удаляем запись из базы данных
      await databases.deleteDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        videoId
      );
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Обновить видео
  async updateVideo(videoId: string, updates: Partial<Video>): Promise<void> {
    try {
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.likes !== undefined) updateData.likes = updates.likes;
      if (updates.views !== undefined) updateData.views = updates.views;
      if (updates.verified !== undefined) updateData.verified = updates.verified;

      await databases.updateDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        videoId,
        updateData
      );
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  // Переключить лайк (добавить/удалить userId из массива likedBy)
  async toggleLike(videoId: string, userId: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      // Получаем текущий документ
      const doc = await databases.getDocument(
        DATABASE_ID,
        VIDEOS_COLLECTION_ID,
        videoId
      );

      // Обрабатываем likedBy как массив
      const likedBy = this.parseLikedBy(doc.likedBy);
      const isCurrentlyLiked = likedBy.includes(userId);

      let newLikedBy: string[];
      if (isCurrentlyLiked) {
        // Удаляем userId из массива
        newLikedBy = likedBy.filter(id => id !== userId);
      } else {
        // Добавляем userId в массив
        newLikedBy = [...likedBy, userId];
      }

      // Обновляем документ
      // Колонка likedBy имеет тип String, поэтому всегда сохраняем как JSON строку
      const likedByJson = JSON.stringify(newLikedBy);
      
      // Проверяем размер JSON строки (лимит 5000 символов)
      // Безопасный лимит: 4500 символов (оставляем запас)
      if (likedByJson.length > 4500) {
        // Если слишком много лайков, обрезаем до последних 1000 пользователей
        // Каждый userId примерно 24 символа в JSON, плюс скобки и запятые
        const trimmedArray = newLikedBy.slice(-1000);
        const trimmedJson = JSON.stringify(trimmedArray);
        
        if (trimmedJson.length > 4500) {
          // Если все еще слишком много, обрезаем до 500 пользователей
          const finalArray = trimmedArray.slice(-500);
          const finalJson = JSON.stringify(finalArray);
          
          if (finalJson.length > 4500) {
            // Если все еще слишком много, обрезаем до 200 пользователей
            const ultraTrimmed = finalArray.slice(-200);
            await databases.updateDocument(
              DATABASE_ID,
              VIDEOS_COLLECTION_ID,
              videoId,
              {
                likedBy: JSON.stringify(ultraTrimmed),
                updatedAt: new Date().toISOString(),
              }
            );
          } else {
            await databases.updateDocument(
              DATABASE_ID,
              VIDEOS_COLLECTION_ID,
              videoId,
              {
                likedBy: finalJson,
                updatedAt: new Date().toISOString(),
              }
            );
          }
        } else {
          await databases.updateDocument(
            DATABASE_ID,
            VIDEOS_COLLECTION_ID,
            videoId,
            {
              likedBy: trimmedJson,
              updatedAt: new Date().toISOString(),
            }
          );
        }
      } else {
        // Сохраняем как JSON строку
        await databases.updateDocument(
          DATABASE_ID,
          VIDEOS_COLLECTION_ID,
          videoId,
          {
            likedBy: likedByJson,
            updatedAt: new Date().toISOString(),
          }
        );
      }

      return {
        likes: newLikedBy.length,
        isLiked: !isCurrentlyLiked,
      };
    } catch (error: any) {
      console.error('Error toggling like:', error);
      
      // Детальная информация об ошибке для отладки
      const errorMessage = error.message || '';
      const errorCode = error.code;
      
      // Проверяем различные типы ошибок
      if (errorCode === 401 || errorMessage.includes('Unauthorized') || errorMessage.includes('permission')) {
        throw new Error('Нет прав на обновление видео. Проверьте права доступа в Appwrite Dashboard: Settings → Permissions → Update должно быть "Users" (любой авторизованный пользователь)');
      } else if (errorCode === 404 || errorMessage.includes('not found')) {
        throw new Error('Видео не найдено');
      } else if (errorMessage.includes('Unknown attribute') || errorMessage.includes('likedBy')) {
        throw new Error('Колонка likedBy не найдена в базе данных');
      } else if (errorCode === 400 || errorMessage.includes('Invalid')) {
        throw new Error(`Неверный формат данных: ${errorMessage}`);
      }
      
      throw error;
    }
  },

  // Получить количество лайков из likedBy
  getLikesCount(doc: any): string {
    if (doc.likedBy) {
      if (Array.isArray(doc.likedBy)) {
        return doc.likedBy.length.toString();
      } else if (typeof doc.likedBy === 'string' && doc.likedBy) {
        try {
          const parsed = JSON.parse(doc.likedBy);
          return Array.isArray(parsed) ? parsed.length.toString() : (doc.likes || '0');
        } catch {
          return doc.likes || '0';
        }
      }
    }
    return doc.likes || '0';
  },

  // Парсить likedBy (массив или JSON строка)
  parseLikedBy(likedBy: any): string[] {
    if (Array.isArray(likedBy)) {
      return likedBy;
    } else if (typeof likedBy === 'string' && likedBy) {
      try {
        const parsed = JSON.parse(likedBy);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
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

