import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Comment } from '../types';

const COMMENTS_COLLECTION = 'comments';

export const commentService = {
  // Добавить комментарий
  async addComment(comment: Omit<Comment, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
        ...comment,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Получить комментарии для видео
  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, COMMENTS_COLLECTION),
        where('videoTitle', '==', videoId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timeAgo: this.formatTimeAgo(doc.data().createdAt?.toDate())
      } as Comment));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  // Удалить комментарий
  async deleteComment(commentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Форматирование времени
  formatTimeAgo(date: Date | null): string {
    if (!date) return 'Только что';
    
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

