
import { Category, Video, Comment, Channel, Subscription, Playlist, UserProfile, AnalyticsStats, Notification, SearchHistoryItem, ChatMessage } from "./types";

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Все' },
  { id: '2', name: 'Видеоигры' },
  { id: '3', name: 'Музыка' },
  { id: '4', name: 'Прямые трансляции' },
  { id: '5', name: 'Программирование' },
  { id: '6', name: 'React' },
  { id: '7', name: 'Искусственный интеллект' },
  { id: '8', name: 'Гаджеты' },
  { id: '9', name: 'Футбол' },
  { id: '10', name: 'Кулинария' },
  { id: '11', name: 'Путешествия' },
  { id: '12', name: 'Новости' },
];

// EMPTY ARRAY - Only user uploads will be shown
export const MOCK_VIDEOS: Video[] = [];

export const MOCK_SHORTS: Video[] = [];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'System',
    avatar: 'https://placehold.co/100x100/333/fff?text=S',
    text: 'Это тестовый комментарий. Загрузите видео, чтобы увидеть больше!',
    likes: 0,
    timeAgo: 'Сейчас',
    videoTitle: 'System'
  }
];

export const MOCK_CHANNEL: Channel = {
  id: 'ch1',
  name: 'Мой Канал',
  handle: '@my_channel',
  avatarUrl: 'https://placehold.co/150x150/333/fff?text=CH',
  bannerUrl: 'https://placehold.co/1600x300/222/fff?text=Channel+Banner',
  subscribers: '0',
  videosCount: '0',
  description: 'Это мой личный канал. Здесь только мои видео.',
  joinedDate: 'Сегодня',
  country: 'Россия',
  totalViews: '0',
  verified: true
};

export const MOCK_SUBSCRIPTIONS: Subscription[] = [];

export const MOCK_HISTORY: Video[] = [];

export const MOCK_PLAYLISTS: Playlist[] = [
  { 
    id: 'p1', 
    title: 'Смотреть позже', 
    videoCount: 0, 
    thumbnailUrl: 'https://placehold.co/320x180/222/fff?text=Watch+Later', 
    isPrivate: true, 
    updatedAt: 'Сегодня',
    author: 'Вы',
    privacy: 'private',
    description: 'Видео, которые вы отложили на потом.',
    totalDuration: '0'
  },
  { 
    id: 'p2', 
    title: 'Избранное', 
    videoCount: 0, 
    thumbnailUrl: 'https://placehold.co/320x180/222/fff?text=Favorites', 
    updatedAt: 'Вчера',
    author: 'Вы',
    privacy: 'public',
    description: 'Самые крутые видео.',
    totalDuration: '0'
  }
];

export const MOCK_PLAYLIST_ITEMS: Video[] = [];

export const MOCK_USER: UserProfile = {
  name: 'Я (Владелец)',
  handle: '@owner',
  email: 'me@yutube.local',
  avatarUrl: 'https://placehold.co/150x150/2563eb/fff?text=ME',
  description: 'Владелец платформы.',
  country: 'RU',
  language: 'Русский',
  theme: 'dark',
  notifications: {
    subscriptions: true,
    recommended: false,
    activity: true,
    emailDigest: false,
  },
  playback: {
    autoplay: true,
    subtitles: false,
    quality: 'auto',
  },
  privacy: {
    privatePlaylists: true,
    privateSubscriptions: false,
  }
};

export const MOCK_ANALYTICS: AnalyticsStats = {
  views: '0',
  watchTime: '0',
  subscribers: '0',
  revenue: '$0.00',
  viewsTrend: [],
  topVideos: []
};

export const MOCK_NOTIFICATIONS: Notification[] = [];

export const MOCK_SEARCH_HISTORY: SearchHistoryItem[] = [];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];
