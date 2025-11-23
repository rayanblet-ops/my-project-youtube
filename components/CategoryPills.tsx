import React from 'react';
import { CATEGORIES } from '../constants';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="sticky top-14 z-30 bg-white/95 dark:bg-yt-base/95 backdrop-blur-sm w-full border-b border-gray-200/0 pb-2 sm:pb-3 pt-2 sm:pt-3 px-2 sm:px-4 transition-colors duration-300">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selectedCategory === cat.id 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-[#272727] dark:text-white dark:hover:bg-[#3f3f3f]'}
            `}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};