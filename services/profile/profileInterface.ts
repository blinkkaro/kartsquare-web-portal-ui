import { Posts } from "../post/postInterfaces";
import { Service } from "../serviceList/listInteraface";
import { UserRegisterSteps } from "../../types/resgistrationFlow";

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
  banner_image?: string;
  business_name: string;
  gstNumber?: string;
  store_address?: {
    address_id?: string;
    address?: string;
    city_town?: string;
    state?: string;
    country?: string;
    pincode?: string;
    building_no?: string;
    floor?: string;
    landmark?: string;
    lat?: number | string;
    long?: number | string;
  };
  register_step?: UserRegisterSteps;
  show_number?: boolean;
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
  business_name: string;

  // SEO Fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  structured_data?: any;
}

export interface ProviderProfileByUsernameResponse {
  profile: providerProfileInterface;
  services: Service[];
  posts: Posts[];
}

export interface ISupplierProfile extends providerProfileInterface {
  store_name?: string;
  logo_url?: string;
  description?: string;
  verification_status: string;
  establishment_year?: string;
  website_url?: string;
  contact_email?: string;
  business_type?: string;
  products_count: number;
  default_address?: DefaultAddress;
}

export interface ProductListItem {
  product_id: string;
  product_name: string;
  price: number;
  product_images: any; // JSONB
  product_description: string;
  sku_number?: string;
  currency?: string;
  is_returnable?: boolean;
  product_origin?: string;
  is_available?: boolean;
  supplier_id: string;
  similar_products?: any[];
  specifications?: {
    name: string;
    value: any;
  }[];
  supplier?: {
    store_name: string;
    logo_url: string;
    is_verified: boolean;
    verification_status: string;
    user_rating: number;
    establishment_year: string;
    country_code?: string;
    first_name?: string;
    last_name?: string;
    whatsapp_country_code?: string;
    whatsapp_number?: string;
    primary_mobile?: string;
    store_address?: {
      address_id: string;
      address: string;
      city_town: string;
      state: string;
      country: string;
      pincode: string;
      building_no: string;
      floor: string;
      landmark: string;
      lat?: number;
      long?: number;
    };
  };
}

export interface ISupplierProfileResponse {
  profile: ISupplierProfile;
  products: ProductListItem[];
}
