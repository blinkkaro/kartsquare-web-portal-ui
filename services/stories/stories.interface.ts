export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}
export interface Story {
  story_id: string;
  user_id: string;
  media_url: string;
  caption: string;
  media_type: MediaType;
  created_at: Date;
  expires_at: Date;
}

export interface StoryItem {
  story_id: string;
  media_url: string;
  caption: string;
  media_type: string;
  created_at: Date;
  is_visited: boolean;
}

export interface StoriesList {
  user_id: string;
  user_name: string;
  user_profile_image: string;
  stories: StoryItem[];
}

export interface StoriesListResponse {
  stories: StoriesList[];
  pagination: {
    totalpages: number;
    page: number;
    limit: number;
  };
}

export interface CreateStory {
  media: File;
  caption: string;
  media_type: MediaType;
}

export interface UpdateStory {
  story_id: string;
  media_url: string;
  caption: string;
  media_type: MediaType;
}

export interface Viewer {
  stories_id: string;
  user_id: string;
  user_name: string;
  user_profile_image: string;
  created_at: Date;
}

export interface pagination {
  page: number;
  limit: number;
  totalpages: number;
}

export interface ViewerResponse {
  data: Viewer[];
  pagination: pagination;
}
