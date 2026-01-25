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
  USER_LOCATION = "USER_LOCATION",
  PROVIDER_LOCATION = "PROVIDER_LOCATION",
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

  // Joined fields
  provider_name: string;
  category_name: string;
  sub_category_name: string | null;
  service_provider_address: string | null;
  provider_image_url: string | null;
  is_following?: boolean;
  service_provider_latitude?: number;
  service_provider_longitude?: number;
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
  service_at_location: "USER_LOCATION" | "PROVIDER_LOCATION" | "BOTH";
  visiting_charge?: number;
  service_provider_address_id: string;
  service_radius: number;
  has_service_duration: boolean;
  service_duration?: number;
  have_slots: boolean;
  status?: ServiceStatus;
}
