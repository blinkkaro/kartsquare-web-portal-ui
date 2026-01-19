export enum Visibility {
  PUBLIC = "public",
  FRIENDS = "friends",
  PRIVATE = "private",
}
export enum PostType {
  IMAGE = "image",
  VIDEO = "video",
  TEXT = "text",
  MIXED = "mixed",
}

export interface GetPostsParams {
  limit: number;
  visibility: Visibility;
}
export interface Posts {
  id: string;
  user_id: string;
  is_anonymous: boolean;
  caption: string | null;
  media_urls: string;
  attachments: any[] | null;
  post_type: "image" | "video" | "text";
  visibility: "public" | "private" | "friends";
  has_mentions: boolean | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  is_edited: boolean;
  is_deleted: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: string | number;
  created_at: string;
  updated_at: string;
  is_liked: boolean;
  mentions: Mention[];
  user: User;
}
export interface GetPostsResponse {
  posts: Posts[];
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_pic: string | null;
}

interface Mention {
  id?: string;
  username?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_profile_pic: string | null;
}

export interface GetPostComments {
  comments: Comment[];
}

export interface CreatePostParams {
  caption: string;
  media_urls: File[];
  post_type: PostType;
  visibility: Visibility;
  location_name: string;
  latitude: number;
  longitude: number;
  mentions: Mention[];
}
