export interface IFollow {
  id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  email: string;
  bio: string;
  role: string;
  followed_at: string;
  is_following: boolean;
}

interface pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface IFollowResponse {
  followers?: IFollow[];
  following?: IFollow[];
  pagination: pagination;
}
