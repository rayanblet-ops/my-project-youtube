import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db, auth } from './config';
import { Video } from '../types';

const VIDEOS_COLLECTION = 'videos';
const MAX_FILE_SIZE = 900 * 1024; // 900KB - безопасный размер для Firestore (лимит 1MB)

export const videoServiceFirestore = {
  // Конвертировать файл в base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Убираем префикс data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Загрузить видео/изображение в Firestore (как base64)
  async uploadVideo(
    file: File, 
    videoData: Omit<Video, 'id' | 'videoUrl' | 'thumbnailUrl' | 'duration'>,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Пользователь не авторизован. Пожалуйста, войдите в систему.');
      }

      // Проверяем размер файла
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Файл слишком большой (${Math.round(file.size / 1024)}KB). Максимальный размер: ${Math.round(MAX_FILE_SIZE / 1024)}KB. Для больших файлов нужен Firebase Storage.`);
      }

      if (onProgress) onProgress(10);

      // Конвертируем файл в base64
      const base64Data = await this.fileToBase64(file);
      if (onProgress) onProgress(50);

      const isImage = file.type.startsWith('image/');
      const dataUrl = `data:${file.type};base64,${base64Data}`;

      if (onProgress) onProgress(80);

      // Создаем запись в Firestore
      const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
        ...videoData,
        videoUrl: dataUrl, // Сохраняем base64 данные
        videoPath: null, // Нет пути в Storage
        thumbnailUrl: isImage ? dataUrl : `https://placehold.co/640x360/000/fff?text=${encodeURIComponent(videoData.title)}`,
        duration: isImage ? 'Фото' : '0:00',
        type: isImage ? 'image' : 'video',
        fileSize: file.size,
        fileName: file.name,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      if (onProgress) onProgress(100);

      return docRef.id;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Получить все видео
  async getAllVideos(): Promise<Video[]> {
    try {
      const q = query(collection(db, VIDEOS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Video));
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  },

  // Получить видео по ID
  async getVideoById(id: string): Promise<Video | null> {
    try {
      const docRef = doc(db, VIDEOS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Video;
      }
      return null;
    } catch (error) {
      console.error('Error getting video:', error);
      return null;
    }
  },

  // Получить видео по каналу
  async getVideosByChannel(channelName: string): Promise<Video[]> {
    try {
      const q = query(
        collection(db, VIDEOS_COLLECTION),
        where('channelName', '==', channelName),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Video));
    } catch (error) {
      console.error('Error getting videos by channel:', error);
      return [];
    }
  },

  // Удалить видео (совместимость с videoService)
  async deleteVideo(videoId: string, videoUrl?: string, videoPath?: string): Promise<void> {
    try {
      // В Firestore версии просто удаляем документ
      await deleteDoc(doc(db, VIDEOS_COLLECTION, videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Обновить видео
  async updateVideo(videoId: string, updates: Partial<Video>): Promise<void> {
    try {
      const docRef = doc(db, VIDEOS_COLLECTION, videoId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }
};

