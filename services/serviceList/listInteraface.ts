export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  INACTIVE = "INACTIVE",
}

export enum ServiceLocationType {
  AT_PROVIDER = "AT_PROVIDER",
  AT_CUSTOMER = "AT_CUSTOMER",
  BOTH = "BOTH",
  CUSTOMER_LOCATION = "CUSTOMER_LOCATION",
  USER_LOCATION = "at_customer",
  PROVIDER_LOCATION = "at_provider",
}

export enum PricingType {
  SINGLE = "single",
  CATALOG = "catalog",
  MULTIPLE = "multiple",
}

export interface Service {
  review_count?: number;
  service_id: string;
  provider_id: string;
  category_id: string;
  sub_category_id: string | null;
  service_name: string;
  service_desc: string | null;
  image_urls: string[];
  is_price_required: boolean;
  price: number | null;
  currency: string;
  service_at_location: ServiceLocationType;
  visiting_charge: number | null;
  service_provider_address_id: string | null;
  service_radius: number;
  has_service_duration: boolean;
  service_duration: number | null;
  have_slots: boolean;
  avg_service_rating: number;
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  provider_phone_number: string;

  // Joined fields
  provider_name: string;
  category_name: string;
  sub_category_name: string | null;
  service_provider_address: string | null;
  service_address?: {
    building_no: string;
    floor: string;
    address: string;
    landmark: string;
    pincode: string;
    city_town: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  provider_image_url: string;
  is_following?: boolean;
  business_name: string;
  pricing_type: PricingType;
  price_catalog_url?: string[];
  price_items?: ServicePriceItem[];
  
  // SEO Fields
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  structured_data?: any;
}

export interface ServiceListResponse {
  services: Service[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  category_id?: string;
  sub_category_id?: string;
  search?: string;
  status?: ServiceStatus;
  min_price?: number;
  max_price?: number;
  provider_id?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  is_deleted: boolean;
  deleted_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  categories: Category[];
}

/** Single price item when pricing_type is "multiple" */
export interface ServicePriceItem {
  service_name: string;
  price: number;
  service_desc: string;
}

export interface ServiceCreateRequest {
  provider_id: string;
  category_id: string;
  sub_category_id?: string;
  service_name: string;
  service_desc: string;
  image_urls: string[];
  is_price_required: boolean;
  price?: number;
  currency: string;
  service_at_location: "at_customer" | "at_provider" | "BOTH";
  visiting_charge?: number;
  service_provider_address_id: string;
  service_radius: number;
  has_service_duration: boolean;
  service_duration?: number;
  have_slots: boolean;
  status?: ServiceStatus;
  /** How pricing is provided: single (default), catalog file(s), or multiple items */
  pricing_type?: "single" | "catalog" | "multiple";
  /** URLs of uploaded price catalog files (PDF/image). Single string or array when pricing_type is "catalog" */
  price_catalog_url?: string | string[];
  /** List of service/price/description when pricing_type is "multiple" */
  price_items?: ServicePriceItem[];
}
