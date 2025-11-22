
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_CHANNEL } from '../constants';
import { CheckCircle2, ChevronRight, Camera, Trash2, AlertTriangle } from 'lucide-react';
import { Video, Comment } from '../types';
import { useUser } from '../UserContext';
import { videoServiceFirestore } from '../firebase/videoServiceFirestore';
import { commentService } from '../firebase/commentService';

// --- Local Component: Delete Confirmation Modal ---
const DeleteModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white">Удалить видео?</h3>
          <p className="text-gray-600 dark:text-[#aaa]">
            Вы уверены, что хотите удалить это видео? Это действие нельзя отменить.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-[#333] rounded-full text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
            >
              Отменить
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Local Component: Interactive Channel Video Card ---
const ChannelVideoItem: React.FC<{
  video: Video;
  userAvatar: string;
  userName: string;
  onDelete: (id: string) => void;
}> = ({ video, userAvatar, userName, onDelete }) => {
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment: Omit<Comment, 'id'> = {
        author: userName,
        avatar: userAvatar,
        text: commentText,
        likes: 0,
        timeAgo: 'только что',
        videoTitle: video.id
      };

      await commentService.addComment(newComment);
      setCommentText('');
      setIsCommentFocused(false);
      alert('Комментарий добавлен!');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Ошибка при добавлении комментария');
    }
  };

  const handleDeleteClick = () => {
    onDelete(video.id);
  };

  return (
    <div className={`flex flex-col gap-3 transition-all duration-500 ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      {/* Thumbnail & Info */}
      <div className="group relative cursor-pointer">
        <Link to={`/watch/${video.id}`} className="block relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#202020]">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        </Link>
        
        {/* Delete Button (Replaces 3-dots) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            handleDeleteClick();
          }}
          className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
          title="Удалить видео"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-black dark:text-white font-semibold leading-tight line-clamp-2 text-sm md:text-base">
          {video.title}
        </h3>
        <div className="text-gray-500 text-xs">
          {video.views} • {video.postedAt}
        </div>
      </div>

      {/* Comment Input Section */}
      <div className="mt-2 pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
        <div className="flex gap-3">
          <img 
            src={userAvatar} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setIsCommentFocused(true)}
                placeholder="Добавьте комментарий..."
                className={`
                  w-full bg-transparent text-sm text-black dark:text-white placeholder-gray-500 outline-none resize-none transition-all
                  border-b ${isCommentFocused ? 'border-black dark:border-white pb-2' : 'border-gray-200 dark:border-[#333] h-8 overflow-hidden'}
                `}
                rows={isCommentFocused ? 2 : 1}
              />
            </div>
            
            {/* Buttons (Only visible on focus) */}
            {isCommentFocused && (
              <div className="flex justify-end gap-2 mt-2 animate-fade-in">
                <button 
                  onClick={() => {
                    setIsCommentFocused(false);
                    setCommentText('');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-[#aaa] hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors"
                >
                  Отменить
                </button>
                <button 
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Комментировать
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Channel: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Видео');
  const [videos, setVideos] = useState<Video[]>([]);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const isMyChannel = id === 'me' || id === user.handle;

  const displayChannel = isMyChannel ? {
    id: 'me',
    name: user.name,
    handle: user.handle,
    avatarUrl: user.avatarUrl,
    bannerUrl: MOCK_CHANNEL.bannerUrl,
    subscribers: '0',
    videosCount: '0',
    description: user.description,
    verified: true
  } : MOCK_CHANNEL;

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (isMyChannel) {
          const allVideos = await videoServiceFirestore.getVideosByChannel(user.name);
          setVideos(allVideos);
        } else {
          const allVideos = await videoServiceFirestore.getAllVideos();
          setVideos(allVideos);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      }
    };

    loadVideos();
  }, [isMyChannel, user.name]);

  const confirmDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      const videoToDeleteObj = videos.find(v => v.id === videoToDelete);
      if (videoToDeleteObj) {
        await videoServiceFirestore.deleteVideo(videoToDelete, videoToDeleteObj.videoUrl, videoToDeleteObj.videoPath);
        const newVideos = videos.filter(v => v.id !== videoToDelete);
        setVideos(newVideos);
      }
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Ошибка при удалении видео');
    }
  };

  const tabs = ['Главная', 'Видео', 'Shorts', 'Плейлисты', 'Сообщество'];

  return (
    <div className="w-full bg-white dark:bg-yt-base min-h-full pb-20">
      {/* Banner */}
      <div className="w-full h-32 sm:h-40 md:h-52 lg:h-64 bg-gray-200 dark:bg-[#202020] relative group">
        <img 
          src={displayChannel.bannerUrl} 
          alt="Channel Banner" 
          className="w-full h-full object-cover"
        />
        {isMyChannel && (
            <button className="absolute right-4 bottom-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6" />
            </button>
        )}
      </div>

      {/* Channel Header */}
      <div className="max-w-[1284px] mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 mx-auto sm:mx-0 relative group">
            <img 
              src={displayChannel.avatarUrl} 
              alt={displayChannel.name} 
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-transparent"
            />
          </div>

          <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
                  {displayChannel.name}
                </h1>
                {displayChannel.verified && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-[#aaa]" />}
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-2 text-sm sm:text-base text-gray-600 dark:text-[#aaa]">
                <span className="font-medium text-black dark:text-white">{displayChannel.handle}</span>
                <span>•</span>
                <span>{videos.length} видео</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-gray-600 dark:text-[#aaa] cursor-pointer">
                <span className="line-clamp-1 max-w-md">{displayChannel.description || 'Нет описания'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 sm:mt-5">
              {isMyChannel && (
                  <>
                    <button 
                        onClick={() => navigate('/settings')}
                        className="bg-gray-100 dark:bg-[#272727] text-black dark:text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors"
                    >
                        Настроить канал
                    </button>
                    <button 
                        onClick={() => navigate('/studio')}
                        className="bg-gray-100 dark:bg-[#272727] text-black dark:text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition-colors"
                    >
                        Управление видео
                    </button>
                  </>
              )}
              {/* Subscribe button removed as requested for owner view */}
            </div>
          </div>
        </div>

        <div className="flex items-center border-b border-gray-200 dark:border-[#3f3f3f] mt-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 text-sm font-medium uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab 
                  ? 'border-black dark:border-white text-black dark:text-white' 
                  : 'border-transparent text-gray-600 dark:text-[#aaa] hover:text-black dark:hover:text-white'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-[1284px] mx-auto px-4 sm:px-6 py-6">
        {(activeTab === 'Главная' || activeTab === 'Видео') && (
          <div>
            {videos.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {videos.map((video) => (
                  <ChannelVideoItem 
                    key={video.id} 
                    video={video} 
                    userAvatar={user.avatarUrl}
                    userName={user.name}
                    onDelete={confirmDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-4">
                 <Camera className="w-16 h-16 text-gray-300 dark:text-[#333]" />
                 <p>Здесь пока нет контента. Загрузите свое первое видео!</p>
                 <Link to="/upload" className="text-blue-600 hover:underline">Перейти к загрузке</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};
