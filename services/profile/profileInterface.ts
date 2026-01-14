import { Posts } from '../post/postInterfaces';

export interface profileInterface {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country_code: string;
  country: string;
  birth_date: string;
  gender: string;
  role: string;
  profile_pic?: string;
  bio?: string;
  created_at: string;
  followers_count: number;
  following_count: number;
}

interface pagination {
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface providerPostsInterface {
  posts: Posts[];
  pagination: pagination;
}

// export interface providerServicesInterface {
//   services: Service[];
//   pagination: pagination;
// }

export interface providerProfileInterface {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country_code: string;
  country: string;
  birth_date: string;
  gender: string;
  role: string;
  profile_pic: string;
  bio?: string;
  created_at: string;
  user_rating: number;
  followers_count: number;
  following_count: number;
  services_count: number;
  total_posts: string;
  is_following: boolean;
  follows_back: boolean;
  total_bookings: number;
  total_reviews: number;
}
