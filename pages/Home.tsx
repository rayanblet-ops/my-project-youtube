
import React, { useState, useEffect } from 'react';
import { CategoryPills } from '../components/CategoryPills';
import { VideoCard } from '../components/VideoCard';
import { VideoCardSkeleton } from '../components/VideoCardSkeleton';
import { Video } from '../types';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { videoService } from '../appwrite/videoService';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from Firestore
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        const videosData = await videoService.getAllVideos();
        setVideos(videosData);
      } catch (error) {
        console.error("Failed to load videos", error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <CategoryPills 
        selectedCategory={selectedCategory} 
        onSelect={setSelectedCategory} 
      />

      <div className="px-2 sm:px-4 md:px-6 pt-16 sm:pt-20 pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 gap-y-6 sm:gap-y-8 w-full max-w-full">
        
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : (
          !isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-gray-100 dark:bg-[#272727] rounded-full flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-gray-400" />
               </div>
               <h2 className="text-xl font-bold text-black dark:text-white mb-2">Видео пока нет</h2>
               <p className="text-gray-600 dark:text-[#aaa] max-w-md mb-6">
                  Только вы можете загружать видео на этот сайт. Загрузите свое первое видео прямо сейчас!
               </p>
               <Link to="/upload" className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
                  Загрузить видео
               </Link>
            </div>
          )
        )}

        {isLoading && Array.from({ length: 8 }).map((_, idx) => (
          <VideoCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    </div>
  );
};
