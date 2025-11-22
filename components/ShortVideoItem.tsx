
import React, { useRef, useEffect, useState } from 'react';
import { Video } from '../types';
import { Play, Pause, ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Music2 } from 'lucide-react';

interface ShortVideoItemProps {
  video: Video;
  isActive: boolean;
}

export const ShortVideoItem: React.FC<ShortVideoItemProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive) {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.log('Autoplay prevented', error);
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
      className="relative h-full w-full max-w-[450px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl snap-start shrink-0 flex items-center justify-center cursor-pointer group"
      onClick={togglePlay}
    >
       {/* Explicit Thumbnail Image - visible when not playing */}
       {!isPlaying && (
          <div className="absolute inset-0 z-10">
             <img 
               src={video.thumbnailUrl} 
               alt={video.title} 
               className="w-full h-full object-cover opacity-100"
             />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-16 h-16 fill-white/90 text-transparent backdrop-blur-sm rounded-full p-2" />
             </div>
          </div>
       )}

       {/* Video Element */}
       <video 
         ref={videoRef}
         src={video.videoUrl} 
         className="w-full h-full object-cover"
         loop
         playsInline
       />

       {/* Right Sidebar Actions */}
       <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-20">
          <div className="flex flex-col items-center gap-1">
             <button className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp className="w-6 h-6 text-white fill-white" />
             </button>
             <span className="text-white text-xs font-medium">{video.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
             <button className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown className="w-6 h-6 text-white" />
             </button>
             <span className="text-white text-xs font-medium">Не нравится</span>
          </div>

          <div className="flex flex-col items-center gap-1">
             <button className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-colors">
                <MessageSquare className="w-6 h-6 text-white" />
             </button>
             <span className="text-white text-xs font-medium">1.2K</span>
          </div>

          <div className="flex flex-col items-center gap-1">
             <button className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-colors">
                <Share2 className="w-6 h-6 text-white" />
             </button>
             <span className="text-white text-xs font-medium">Поделиться</span>
          </div>

          <button className="w-12 h-12 bg-gray-800/60 hover:bg-gray-700/80 rounded-full flex items-center justify-center transition-colors">
             <MoreVertical className="w-6 h-6 text-white" />
          </button>
          
          <div className="w-10 h-10 rounded-lg border-2 border-white/50 overflow-hidden mt-2">
             <img src={video.channelAvatarUrl} className="w-full h-full object-cover" />
          </div>
       </div>

       {/* Bottom Info */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
          <div className="flex flex-col gap-3 mb-4 pr-16">
             {/* Channel */}
             <div className="flex items-center gap-3">
                <img src={video.channelAvatarUrl} className="w-10 h-10 rounded-full border border-white/20" />
                <span className="text-white font-bold text-sm">{video.channelName}</span>
                <button className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
                   Подписаться
                </button>
             </div>
             
             {/* Description */}
             <div className="text-white text-sm line-clamp-2 font-medium drop-shadow-md">
                {video.title}
             </div>

             {/* Music */}
             <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                <Music2 className="w-4 h-4" />
                <div className="overflow-hidden w-40">
                   <div className="whitespace-nowrap">Оригинальный звук - {video.channelName}</div>
                </div>
             </div>
          </div>

          {/* Progress Bar */}
          {isActive && (
             <div className="h-0.5 bg-white/30 w-full rounded-full overflow-hidden">
                <div className="h-full bg-white w-full origin-left animate-[progress_linear] " style={{ animationDuration: '60s' }}></div>
             </div>
          )}
       </div>
    </div>
  );
};
