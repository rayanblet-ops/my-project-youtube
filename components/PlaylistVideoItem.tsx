
import React from 'react';
import { Video } from '../types';
import { GripVertical, Trash2, MoreVertical, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaylistVideoItemProps {
  video: Video;
  index: number;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const PlaylistVideoItem: React.FC<PlaylistVideoItemProps> = ({ 
  video, 
  index, 
  onRemove,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className="flex gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] group cursor-grab active:cursor-grabbing transition-colors"
    >
      {/* Index / Drag Handle */}
      <div className="flex items-center justify-center w-8 text-gray-500 font-medium text-sm flex-shrink-0">
        <span className="group-hover:hidden">{index + 1}</span>
        <GripVertical className="w-5 h-5 hidden group-hover:block cursor-grab text-gray-400" />
      </div>

      {/* Thumbnail */}
      <Link to={`/watch/${video.id}`} className="relative w-40 h-[90px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-[#202020]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1 py-0.5 rounded">
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
           <Play className="w-8 h-8 text-white fill-white" />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <Link to={`/watch/${video.id}`}>
          <h3 className="text-black dark:text-white font-semibold text-base line-clamp-2 mb-1 hover:text-blue-600 dark:hover:text-blue-300">
            {video.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-gray-600 dark:text-[#aaa]">
          <Link to={`/channel/${video.channelName}`} className="hover:text-black dark:hover:text-white transition-colors">
            {video.channelName}
          </Link>
          <span className="mx-1">•</span>
          <span>{video.views}</span>
          <span className="mx-1">•</span>
          <span>{video.postedAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={() => onRemove(video.id)}
           className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
           title="Удалить из плейлиста"
         >
           <Trash2 className="w-5 h-5" />
         </button>
         <button className="p-2 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors">
           <MoreVertical className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};
