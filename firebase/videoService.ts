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
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTaskSnapshot } from 'firebase/storage';
import { db, storage, auth } from './config';
import { Video } from '../types';

const VIDEOS_COLLECTION = 'videos';

export const videoService = {
  // Загрузить видео/изображение в Storage и создать запись в Firestore
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

      const sanitizedFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/\s+/g, '_');
      
      const filePath = `videos/${currentUser.uid}_${Date.now()}_${sanitizedFileName}`;
      const fileRef = ref(storage, filePath);
      
      if (!storage) {
        throw new Error('Firebase Storage не инициализирован');
      }
      
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress && snapshot.totalBytes > 0) {
              onProgress(Math.round(progress));
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve();
          }
        );
        
        const initialState = uploadTask.snapshot.state;
        if (initialState === 'success') {
          resolve();
        } else if (initialState === 'error') {
          reject(new Error('Upload task failed to start'));
        }
      });
      
      const downloadURL = await getDownloadURL(fileRef);

      // Если это изображение, используем его как thumbnail
      const isImage = file.type.startsWith('image/');
      const thumbnailUrl = isImage ? downloadURL : `https://placehold.co/640x360/000/fff?text=${encodeURIComponent(videoData.title)}`;

      const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
        ...videoData,
        videoUrl: downloadURL,
        videoPath: filePath,
        thumbnailUrl,
        duration: isImage ? 'Фото' : '0:00',
        type: isImage ? 'image' : 'video',
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      if (error?.code === 'storage/unauthorized' || error?.code === 'storage/canceled') {
        throw new Error('Нет доступа к хранилищу. Проверьте правила безопасности Firebase Storage. Убедитесь, что правила разрешают запись для авторизованных пользователей.');
      } else if (error?.code === 'permission-denied') {
        throw new Error('Нет доступа к базе данных. Проверьте правила безопасности Firestore.');
      } else if (error?.code === 'storage/quota-exceeded') {
        throw new Error('Превышен лимит хранилища.');
      } else if (error?.code === 'storage/unknown') {
        throw new Error('Неизвестная ошибка при загрузке файла.');
      } else if (error?.message?.includes('CORS') || error?.message?.includes('cors')) {
        throw new Error('Ошибка CORS: Проверьте правила безопасности Firebase Storage. Правила должны разрешать запись для авторизованных пользователей.');
      }
      
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

  // Удалить видео
  async deleteVideo(videoId: string, videoUrl?: string, videoPath?: string): Promise<void> {
    try {
      // Удаляем файл из Storage
      if (videoPath) {
        // Используем сохраненный путь, если он есть
        try {
          const fileRef = ref(storage, videoPath);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.warn('Error deleting file from storage (continuing anyway):', storageError);
        }
      } else if (videoUrl) {
        // Fallback: пытаемся извлечь путь из URL
        try {
          if (videoUrl.includes('/o/')) {
            const urlParts = videoUrl.split('/o/');
            if (urlParts.length > 1) {
              const pathWithParams = urlParts[1].split('?')[0];
              const decodedPath = decodeURIComponent(pathWithParams);
              const fileRef = ref(storage, decodedPath);
              await deleteObject(fileRef);
            }
          } else if (!videoUrl.startsWith('http')) {
            const fileRef = ref(storage, videoUrl);
            await deleteObject(fileRef);
          }
        } catch (storageError) {
          console.warn('Error deleting file from storage (continuing anyway):', storageError);
        }
      }

      // Удаляем запись из Firestore
      await deleteDoc(doc(db, VIDEOS_COLLECTION, videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Обновить видео (например, лайки)
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

