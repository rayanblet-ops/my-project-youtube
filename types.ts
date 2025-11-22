import React from 'react';

export interface Video {
  id: string;
  thumbnailUrl: string;
  duration: string;
  title: string;
  channelName: string;
  channelAvatarUrl: string;
  views: string;
  postedAt: string;
  verified?: boolean;
  description?: string;
  subscribers?: string;
  likes?: string;
  videoUrl?: string;
  videoPath?: string; // Путь к файлу в Firebase Storage для удаления
  type?: 'video' | 'image';
}

export interface Category {
  id: string;
  name: string;
}

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  path?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  timeAgo: string;
  replies?: number;
  videoTitle?: string; // For studio context
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl: string;
  subscribers: string;
  videosCount: string;
  description: string;
  joinedDate: string;
  country: string;
  totalViews: string;
  verified?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  avatarUrl: string;
  isLive?: boolean;
  hasNewContent?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  videoCount: number;
  thumbnailUrl: string;
  isPrivate?: boolean;
  updatedAt: string;
  description?: string;
  author?: string;
  totalDuration?: string;
  privacy?: 'public' | 'private' | 'unlisted';
  views?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  description: string;
  country: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    subscriptions: boolean;
    recommended: boolean;
    activity: boolean;
    emailDigest: boolean;
  };
  playback: {
    autoplay: boolean;
    subtitles: boolean;
    quality: 'auto' | '1080p' | '720p' | '480p';
  };
  privacy: {
    privatePlaylists: boolean;
    privateSubscriptions: boolean;
  };
}

export interface AnalyticsStats {
  views: string;
  watchTime: string;
  subscribers: string;
  revenue: string;
  viewsTrend: number[]; // Array of numbers for chart
  topVideos: Video[];
}

export type NotificationType = 'video' | 'comment' | 'like' | 'subscriber';

export interface Notification {
  id: string;
  type: NotificationType;
  actorName: string;
  actorAvatar: string;
  text: string;
  timeAgo: string;
  isRead: boolean;
  thumbnailUrl?: string;
  videoTitle?: string;
}

export interface SearchHistoryItem {
  id: string;
  term: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  amount?: string; // If donation
  color?: string; // Background color for donation
  timestamp: string;
}