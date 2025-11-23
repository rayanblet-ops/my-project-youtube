
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { RelatedVideoCard } from '../components/RelatedVideoCard';
import { ThumbsUp, ThumbsDown, Share2, CheckCircle2, Trash2, User, AlignLeft } from 'lucide-react';
import { Video, Comment } from '../types';
import { useUser } from '../UserContext';
import { videoService } from '../appwrite/videoService';
import { commentService } from '../appwrite/commentService';
import { account } from '../appwrite/config';

export const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadVideoData = async () => {
      if (!id) return;

      try {
        // Загружаем видео
        const found = await videoService.getVideoById(id);
        if (found) {
          setVideo(found);
          const likesCount = parseInt(found.likes || '0') || 0;
          setLikes(likesCount);
          
          // Проверяем, поставил ли текущий пользователь лайк
          const currentUser = await account.get();
          if (currentUser && (found as any).likedBy) {
            const likedBy = (found as any).likedBy as string[];
            setIsLiked(likedBy.includes(currentUser.$id));
          } else {
            setIsLiked(false);
          }
          
          // Загружаем связанные видео
          const allVideos = await videoService.getAllVideos();
          setRelatedVideos(allVideos.filter(v => v.id !== id));
        }

        // Загружаем комментарии
        const videoComments = await commentService.getCommentsByVideo(id);
        setComments(videoComments);
      } catch (error) {
        console.error('Error loading video data:', error);
      }
    };

    loadVideoData();
  }, [id]);

  const handleLike = async () => {
    if (!video) return;
    
    try {
      const currentUser = await account.get();
      if (!currentUser) {
        alert('Пожалуйста, войдите в систему, чтобы ставить лайки');
        return;
      }

      // Сохраняем текущее состояние для отката при ошибке
      const previousLikedState = isLiked;
      const previousLikesCount = likes;

      // Оптимистичное обновление UI
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;
    setIsLiked(newLikedState);
    setLikes(newLikesCount);
    
      // Обновляем в базе данных
      const result = await videoService.toggleLike(video.id, currentUser.$id);
      
      // Синхронизируем с результатом из базы данных
      setIsLiked(result.isLiked);
      setLikes(result.likes);
    } catch (error: any) {
      console.error('Error updating likes:', error);
      // Откатываем изменения при ошибке
      setIsLiked(previousLikedState);
      setLikes(previousLikesCount);
      
      // Более детальное сообщение об ошибке
      let errorMessage = 'Ошибка при обновлении лайка. Попробуйте еще раз.';
      
      if (error.code === 404 || error.message?.includes('not found')) {
        errorMessage = 'Видео не найдено. Обновите страницу.';
      } else if (error.code === 401 || error.message?.includes('Unauthorized')) {
        errorMessage = 'Необходимо войти в систему для постановки лайков.';
      } else if (error.message?.includes('Unknown attribute') || error.message?.includes('likedBy')) {
        errorMessage = 'Колонка likedBy не создана в базе данных.';
      } else if (error.message) {
        errorMessage = `Ошибка: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleShare = () => {
    try {
        navigator.clipboard.writeText(window.location.href);
        alert("Ссылка скопирована в буфер обмена!");
    } catch (e) {
        console.error("Clipboard error", e);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!video) return;
    
    // Double check ownership just in case
    if (video.channelName !== user.name) {
        alert("У вас нет прав на удаление этого видео.");
        return;
    }

    if (window.confirm("Вы уверены, что хотите удалить это видео навсегда?")) {
      try {
        await videoService.deleteVideo(video.id, video.videoUrl, video.videoPath);
        alert("Видео успешно удалено.");
        navigate('/home');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert("Ошибка при удалении видео.");
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !video) return;
    
    try {
      const commentObj: Omit<Comment, 'id'> = {
        author: user.name,
        avatar: user.avatarUrl,
        text: newComment,
        likes: 0,
        timeAgo: 'Только что',
        videoTitle: video.id 
      };
      
      const commentId = await commentService.addComment(commentObj);
      const newCommentWithId: Comment = { ...commentObj, id: commentId };
      
      setComments([newCommentWithId, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Ошибка при добавлении комментария');
    }
  };

  if (!video) {
    return <div className="flex items-center justify-center h-[50vh] text-black dark:text-white">Видео не найдено</div>;
  }

  const isOwner = video.channelName === user.name;
  const displayAvatar = isOwner ? user.avatarUrl : video.channelAvatarUrl;

  return (
    <div className="flex flex-col lg:flex-row max-w-[1800px] mx-auto pt-6 px-4 lg:px-6 gap-6 h-full pb-20">
      <div className="flex-1 w-full lg:min-w-[640px]">
        {/* Player */}
        <VideoPlayer src={video.videoUrl || ''} poster={video.thumbnailUrl} autoplay={true} type={video.type || 'video'} />
        
        {/* Title */}
        <h1 className="text-xl font-bold text-black dark:text-white mt-4 mb-2 line-clamp-2">{video.title}</h1>
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to={`/channel/${video.channelName}`}>
               <img 
                  src={displayAvatar} 
                  alt={video.channelName} 
                  className="w-10 h-10 rounded-full hover:opacity-90 transition-opacity object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/100x100/purple/white?text=${video.channelName.charAt(0)}`;
                  }}
               />
            </Link>
            <div className="flex flex-col">
              <Link to={`/channel/${video.channelName}`} className="flex items-center gap-1 hover:opacity-80">
                 <h3 className="font-bold text-black dark:text-white cursor-pointer">{video.channelName}</h3>
                 {video.verified && <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 dark:text-[#aaa]" />}
              </Link>
              <span className="text-xs text-gray-600 dark:text-[#aaa]">{isOwner ? 'Вы владелец' : '0 подписчиков'}</span>
            </div>
            <button className="ml-4 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-medium text-sm hover:opacity-80 transition-opacity">
                Подписаться
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            <div className="flex items-center bg-gray-100 dark:bg-[#272727] rounded-full h-9">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 border-r border-gray-300 dark:border-[#3f3f3f] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-l-full h-full transition-colors text-sm font-medium ${isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-black dark:text-white'}`}>
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likes}
              </button>
              <button className="px-3 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-r-full h-full transition-colors text-black dark:text-white"><ThumbsDown className="w-4 h-4" /></button>
            </div>
            <button onClick={handleShare} className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] px-4 h-9 rounded-full transition-colors text-black dark:text-white text-sm font-medium">
              <Share2 className="w-4 h-4" /> Поделиться
            </button>
            
            {isOwner && (
               <button 
                 type="button"
                 onClick={handleDelete} 
                 className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] hover:bg-red-100 dark:hover:bg-red-900/30 px-4 h-9 rounded-full transition-colors text-black dark:text-white hover:text-red-600 dark:hover:text-red-400 text-sm font-medium"
               >
                 <Trash2 className="w-4 h-4" /> Удалить
               </button>
            )}
            
          </div>
        </div>

        {/* Description Box */}
        <div className="mt-4 bg-gray-100 dark:bg-[#272727] rounded-xl p-3 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors" onClick={() => setIsDescExpanded(!isDescExpanded)}>
           <div className="font-bold text-black dark:text-white mb-1">{video.views} • {video.postedAt}</div>
           <p className={`text-black dark:text-white whitespace-pre-wrap ${!isDescExpanded ? 'line-clamp-2' : ''}`}>{video.description || 'Описание отсутствует.'}</p>
           <button className="mt-1 text-black dark:text-white font-bold">{isDescExpanded ? 'Свернуть' : 'Ещё'}</button>
        </div>

        {/* Comments Section */}
        <div className="mt-6 mb-10 relative">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-8">
               <h2 className="text-xl font-bold text-black dark:text-white">{comments.length} комментариев</h2>
               <button className="flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#272727] px-2 py-1 rounded transition-colors">
                  <AlignLeft className="w-5 h-5" /> Упорядочить
               </button>
             </div>
          </div>

          {/* Comment Input Form (Always visible) */}
          <div className="flex gap-4 mb-8">
               <div className="flex-shrink-0">
                  <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="Your Avatar" />
               </div>
               <form onSubmit={handleCommentSubmit} className="flex-1">
                  <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    autoFocus
                    placeholder="Введите комментарий" 
                    className="w-full bg-transparent border-b border-gray-300 dark:border-[#3f3f3f] pb-1 outline-none text-black dark:text-white focus:border-black dark:focus:border-white transition-colors placeholder-gray-500 text-sm" 
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                        type="button" 
                        onClick={() => {
                            setNewComment('');
                        }} 
                        className="px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#272727] rounded-full transition-colors"
                    >
                        Очистить
                    </button>
                    <button 
                        type="submit" 
                        disabled={!newComment.trim()} 
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-[#3f3f3f] disabled:text-gray-500 transition-colors"
                    >
                        Оставить комментарий
                    </button>
                  </div>
               </form>
            </div>

          {/* Comments List */}
          <div className="flex flex-col gap-6">
             {comments.map(comment => (
                 <div key={comment.id} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                        <img 
                            src={comment.avatar} 
                            className="w-10 h-10 rounded-full object-cover cursor-pointer" 
                            alt={comment.author}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/333/fff?text=${comment.author.charAt(0)}`;
                            }}
                        />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs sm:text-sm text-black dark:text-white cursor-pointer hover:underline">@{comment.author.replace(/\s+/g, '')}</span>
                          <span className="text-xs text-gray-500 hover:text-black dark:hover:text-white cursor-pointer">{comment.timeAgo}</span>
                       </div>
                       <p className="text-sm text-black dark:text-white mb-2 whitespace-pre-wrap">{comment.text}</p>
                       
                       {/* Comment Actions */}
                       <div className="flex items-center gap-4 text-black dark:text-white">
                          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors">
                             <ThumbsUp className="w-4 h-4" />
                             <span className="text-xs text-gray-500">{comment.likes > 0 ? comment.likes : ''}</span>
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors">
                             <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#272727] text-xs font-medium transition-colors">
                             Ответить
                          </button>
                       </div>
                    </div>
                 </div>
             ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[400px] flex-shrink-0">
         <h3 className="font-bold text-black dark:text-white mb-3">Другие видео</h3>
         <div className="flex flex-col">{relatedVideos.map((v) => <RelatedVideoCard key={`rel-${v.id}`} video={v} />)}</div>
      </div>
    </div>
  );
};
