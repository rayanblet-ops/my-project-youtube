import { supabase } from './config';
import { Comment } from '../types';

const COMMENTS_TABLE = 'comments';

export const commentService = {
  // Добавить комментарий
  async addComment(comment: Omit<Comment, 'id'>): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .insert({
          author: comment.author,
          avatar: comment.avatar,
          text: comment.text,
          likes: comment.likes || 0,
          video_title: comment.videoTitle,
          user_id: user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Получить комментарии для видео
  async getCommentsByVideo(videoId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from(COMMENTS_TABLE)
        .select('*')
        .eq('video_title', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        author: item.author,
        avatar: item.avatar,
        text: item.text,
        likes: item.likes || 0,
        timeAgo: this.formatTimeAgo(new Date(item.created_at)),
        videoTitle: item.video_title,
      } as Comment));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  // Удалить комментарий
  async deleteComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(COMMENTS_TABLE)
        .delete()
        .eq('id', commentId);

      if (error) throw error;
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

