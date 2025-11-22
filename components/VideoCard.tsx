
import React from 'react';
import { Video } from '../types';
import { CheckCircle2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { user } = useUser();
  
  // Use live user avatar if I am the owner to prevent stale image issues
  const isOwner = video.channelName === user.name;
  const displayAvatar = isOwner ? user.avatarUrl : video.channelAvatarUrl;

  return (
    <div className="flex flex-col gap-2 group cursor-pointer">
      {/* Thumbnail Container - Links to Watch */}
      <Link to={`/watch/${video.id}`} className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </Link>

      {/* Info Section */}
      <div className="flex gap-3 mt-1 items-start">
        <Link to={`/channel/${video.channelName}`} className="flex-shrink-0">
          <img 
            src={displayAvatar} 
            alt={video.channelName} 
            className="w-9 h-9 rounded-full mt-0.5 bg-gray-300 dark:bg-[#333] hover:opacity-80 transition-opacity object-cover"
            onError={(e) => {
               (e.target as HTMLImageElement).src = `https://placehold.co/100x100/333/fff?text=${video.channelName.charAt(0)}`;
            }}
          />
        </Link>
        <div className="flex flex-col flex-1 pr-6">
          <Link to={`/watch/${video.id}`}>
            <h3 className="text-black dark:text-white text-[16px] font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${video.channelName}`} className="flex items-center mt-1 text-gray-600 dark:text-[#aaa] text-sm hover:text-black dark:hover:text-white transition-colors w-fit">
            <span className="mr-1">{video.channelName}</span>
            {video.verified && <CheckCircle2 className="w-3.5 h-3.5" />}
          </Link>
          <div className="text-gray-600 dark:text-[#aaa] text-sm">
            <span>{video.views}</span>
            <span className="mx-1">•</span>
            <span>{video.postedAt}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); /* Prevent navigation when clicking menu */ }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-yt-hover rounded-full transition-all text-black dark:text-white"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
