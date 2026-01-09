export type PostType = 'video' | 'image' | 'audio' | 'news';

export type Section = 'home' | 'granth' | 'jaap' | 'upload' | 'darshan' | 'music' | 'live' | 'profile' | 'community';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string; // base64 string
  bio?: string;
  location?: string;
  followers: string[]; // array of userIds
  following: string[]; // array of userIds
}

export interface CommentData {
  id: string;
  userId: string;
  text: string;
}

export interface Post {
  id: string;
  uploaderId: string;
  type: PostType;
  url: string;
  title: string;
  description: string;
  likes: string[]; // array of userIds
  comments: CommentData[];
  timestamp: string;
  thumbnailUrl?: string;
  views: number;
}

// FIX: Add Notification type for notifications feature
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  fromUserId: string;
  toUserId: string;
  postId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Song {
  title: string;
  artist: string;
  url: string;
  thumbnailUrl?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export interface AiMessage {
  sender: 'user' | 'ai';
  text: string;
  user?: User;
}

export interface AiChatSession {
  id: string;
  title: string;
  messages: AiMessage[];
}

export interface JaapRecord {
  date: string; // ISO string YYYY-MM-DD
  count: number;
}

export interface LekhanRecord {
    date: string; // ISO string YYYY-MM-DD
    text: string;
}