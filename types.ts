
export type PostType = 'video' | 'image' | 'audio' | 'news';

export type Section = 'home' | 'granth' | 'jaap' | 'upload' | 'darshan' | 'music';

export interface CommentData {
  id: string;
  user: string;
  text: string;
}

export interface Post {
  id: string;
  uploader: string;
  type: PostType;
  url: string;
  title: string;
  description: string;
  likes: string[];
  comments: CommentData[];
  timestamp: string;
}

export interface Song {
  title: string;
  artist: string;
  url: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}
