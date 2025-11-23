import { databases, DATABASE_ID, COMMENTS_COLLECTION_ID, account } from './config';
import { Comment } from '../types';
import { ID, Query } from 'appwrite';

export const commentService = {
  // Добавить комментарий
  async addComment(comment: Omit<Comment, 'id'>): Promise<string> {
    try {
      const currentUser = await account.get();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }

      const document = await databases.createDocument(
        DATABASE_ID,
        COMMENTS_COLLECTION_ID,
        ID.unique(),
        {
          author: comment.author,
          avatar: comment.avatar,
          text: comment.text,
          likes: comment.likes || 0,
          videoTitle: comment.videoTitle,
          userId: currentUser.$id,
          createdAt: new Date().toISOString(),
        }
      );

      return document.$id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Получить комментарии для видео
  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMMENTS_COLLECTION_ID,
        [
          Query.equal('videoTitle', videoId),
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        author: doc.author,
        avatar: doc.avatar,
        text: doc.text,
        likes: doc.likes || 0,
        timeAgo: this.formatTimeAgo(new Date(doc.createdAt)),
        videoTitle: doc.videoTitle,
      } as Comment));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  // Удалить комментарий
  async deleteComment(commentId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COMMENTS_COLLECTION_ID,
        commentId
      );
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

