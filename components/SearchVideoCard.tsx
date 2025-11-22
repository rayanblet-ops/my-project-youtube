
import React from 'react';
import { Video } from '../types';
import { CheckCircle2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

interface SearchVideoCardProps {
  video: Video;
}

export const SearchVideoCard: React.FC<SearchVideoCardProps> = ({ video }) => {
  const { user } = useUser();
  const isOwner = video.channelName === user.name;
  const displayAvatar = isOwner ? user.avatarUrl : video.channelAvatarUrl;

  return (
    <div className="flex flex-col sm:flex-row gap-4 group cursor-pointer w-full">
      {/* Thumbnail Container */}
      <Link to={`/watch/${video.id}`} className="relative flex-shrink-0 w-full sm:w-[360px] aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 gap-1 pr-6">
        <Link to={`/watch/${video.id}`}>
          <h3 className="text-black dark:text-white text-lg font-normal leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            {video.title}
          </h3>
        </Link>
        
        <div className="text-gray-600 dark:text-[#aaa] text-xs flex items-center gap-1 pb-2">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.postedAt}</span>
        </div>

        <div className="flex items-center gap-2 py-2">
            <Link to={`/channel/${video.channelName}`} className="flex-shrink-0">
                <img 
                    src={displayAvatar} 
                    alt={video.channelName} 
                    className="w-6 h-6 rounded-full bg-gray-300 dark:bg-[#333] object-cover"
                    onError={(e) => {
                       (e.target as HTMLImageElement).src = `https://placehold.co/100x100/333/fff?text=${video.channelName.charAt(0)}`;
                    }}
                />
            </Link>
            <Link to={`/channel/${video.channelName}`} className="flex items-center text-gray-600 dark:text-[#aaa] text-xs hover:text-black dark:hover:text-white transition-colors">
                <span className="mr-1">{video.channelName}</span>
                {video.verified && <CheckCircle2 className="w-3.5 h-3.5" />}
            </Link>
        </div>

        <div className="hidden sm:block text-gray-600 dark:text-[#aaa] text-xs line-clamp-2 max-w-3xl mt-1">
            {video.description || 'Описание видео отсутствует. Нажмите, чтобы посмотреть подробности.'}
        </div>
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); }}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-yt-hover rounded-full transition-all text-black dark:text-white h-fit self-start hidden sm:block"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};
