
import React from 'react';
import { Subscription } from '../types';
import { Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionAvatarProps {
  subscription: Subscription;
}

export const SubscriptionAvatar: React.FC<SubscriptionAvatarProps> = ({ subscription }) => {
  return (
    <Link to={`/channel/${subscription.name}`} className="flex flex-col items-center gap-1 group min-w-[64px] cursor-pointer">
      <div className="relative">
        {/* Avatar Image */}
        <img 
          src={subscription.avatarUrl} 
          alt={subscription.name} 
          className={`
            w-14 h-14 rounded-full object-cover p-0.5
            ${subscription.isLive ? 'border-2 border-red-600' : ''}
          `}
        />
        
        {/* Live Badge */}
        {subscription.isLive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-sm flex items-center gap-0.5 shadow-sm z-10">
            <Radio className="w-2 h-2 animate-pulse" />
            LIVE
          </div>
        )}

        {/* New Content Dot (Blue) */}
        {subscription.hasNewContent && !subscription.isLive && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 border-2 border-white dark:border-yt-base rounded-full" />
        )}
      </div>

      {/* Name */}
      <span className="text-xs text-gray-600 dark:text-[#aaa] text-center truncate w-full group-hover:text-black dark:group-hover:text-white transition-colors">
        {subscription.name}
      </span>
    </Link>
  );
};
