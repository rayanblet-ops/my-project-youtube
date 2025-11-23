import React from 'react';

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 animate-pulse w-full">
      {/* Thumbnail Skeleton */}
      <div className="relative w-full aspect-video rounded-xl bg-gray-300 dark:bg-[#202020]" />

      {/* Info Section Skeleton */}
      <div className="flex gap-3 mt-1 items-start">
        {/* Avatar Skeleton */}
        <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-[#333] flex-shrink-0" />
        
        <div className="flex flex-col flex-1 gap-2">
          {/* Title Skeleton lines */}
          <div className="h-4 bg-gray-300 dark:bg-[#333] rounded w-[90%]" />
          <div className="h-4 bg-gray-300 dark:bg-[#333] rounded w-[60%]" />
          
          {/* Meta Skeleton */}
          <div className="h-3 bg-gray-300 dark:bg-[#333] rounded w-[40%] mt-1" />
        </div>
      </div>
    </div>
  );
};