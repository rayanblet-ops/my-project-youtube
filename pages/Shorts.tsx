
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SHORTS } from '../constants';
import { ShortVideoItem } from '../components/ShortVideoItem';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Shorts: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up intersection observer to detect which video is in view
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6, // 60% visible to be active
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      });
    }, options);

    // Observe all items
    itemRefs.current.forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [MOCK_SHORTS]);

  const scrollToVideo = (index: number) => {
    if (index >= 0 && index < MOCK_SHORTS.length) {
      itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full h-[calc(100vh-56px)] bg-[#f9f9f9] dark:bg-[#0f0f0f] flex justify-center overflow-hidden relative">
      
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="h-full w-full max-w-[500px] overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {MOCK_SHORTS.map((video, index) => (
          <div 
            key={video.id}
            data-index={index}
            ref={(el) => { itemRefs.current[index] = el; }}
            className="h-full w-full flex items-center justify-center snap-start snap-always p-4"
          >
             <ShortVideoItem video={video} isActive={index === activeIndex} />
          </div>
        ))}
      </div>

      {/* Desktop Navigation Controls (Floating) */}
      <div className="hidden lg:flex flex-col gap-4 absolute right-10 top-1/2 -translate-y-1/2">
         <button 
           onClick={() => scrollToVideo(activeIndex - 1)}
           disabled={activeIndex === 0}
           className="p-3 bg-gray-200 dark:bg-[#272727] rounded-full hover:bg-gray-300 dark:hover:bg-[#3f3f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
         >
            <ChevronUp className="w-6 h-6 text-black dark:text-white" />
         </button>
         <button 
           onClick={() => scrollToVideo(activeIndex + 1)}
           disabled={activeIndex === MOCK_SHORTS.length - 1}
           className="p-3 bg-gray-200 dark:bg-[#272727] rounded-full hover:bg-gray-300 dark:hover:bg-[#3f3f3f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
         >
            <ChevronDown className="w-6 h-6 text-black dark:text-white" />
         </button>
      </div>

    </div>
  );
};
