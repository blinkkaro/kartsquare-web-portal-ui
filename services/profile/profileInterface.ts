import { Posts } from "../post/postInterfaces";

export enum service_location_type {
  USER_LOCATION = "USER_LOCATION",
  PROVIDER_LOCATION = "PROVIDER_LOCATION",
}

export enum service_status_type {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}
export interface Service {
  id: any;
  service_id: string;
  provider_id: string;
  category_id: string;
  sub_category_id?: string | undefined;
  service_name: string;
  service_desc: string | null;
  image_urls: string[];
  is_price_required: boolean;
  price: number | null;
  currency: string;
  service_at_location: service_location_type;
  visiting_charge: number | null;
  service_provider_address_id: string;
  service_radius: number;
  has_service_duration: boolean;
  service_duration: number | undefined;
  have_slots: boolean;
  avg_service_rating: number;
  status: service_status_type;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_deleted: boolean;
  review_count: number;

  // Joined fields
  provider_name: string;
  category_name: string;
  sub_category_name: string | null;
  service_provider_address: string | null;
  provider_image_url: string | null;
  is_following: boolean;
  service_provider_latitude: number;
  service_provider_longitude: number;
}

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

export interface providerServicesInterface {
  services: Service[];
  pagination: pagination;
}

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
