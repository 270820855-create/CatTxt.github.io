
import React from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}