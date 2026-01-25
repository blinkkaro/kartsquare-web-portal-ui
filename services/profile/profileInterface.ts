import { Posts } from "../post/postInterfaces";
import { Service } from "../serviceList/listInteraface";

export enum service_location_type {
  USER_LOCATION = "at_customer",
  PROVIDER_LOCATION = "at_provider",
}

export enum service_status_type {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
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
  username?: string;
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

export interface DefaultAddress {
  id: string;
  user_id: string;
  address_name: string;
  building_no: string | null;
  floor: string | null;
  address: string;
  landmark: string | null;
  pincode: string;
  city_town: string;
  state: string;
  country: string;
  is_default: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  latitude: number;
  longitude: number;
}

export interface providerProfileInterface {
  id: string;
  username: string;
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
  banner_image?: string;
  preferences?: string[];
  bio?: string;
  created_at: string;
  user_rating: number;
  followers_count: number;
  following_count: number;
  services_count: number;
  total_posts: string;
  is_following?: boolean;
  follows_back?: boolean;
  total_bookings: number | null;
  total_reviews: number | null;
  default_address?: DefaultAddress;
}

export interface ProviderProfileByUsernameResponse {
  profile: providerProfileInterface;
  services: Service[];
  posts: Posts[];
}
