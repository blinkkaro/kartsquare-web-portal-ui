export enum ad_status_type {
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
  REJECTED = "rejected",
}

export interface Advertise {
  advertise_id: string;
  provider_id: string;
  service_id: string;
  category_id: string;
  title?: string;
  description?: string;
  image_url: string;
  ad_status: ad_status_type;
  ad_reject_reason?: string;
  start_at: Date;
  expires_at: Date;
  impressions_count: number;
  clicks_count: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  deleted_by: string;
}
export interface AdvertiseCreate {
  service_id: string;
  title?: string;
  description?: string;
  image_url: string;
  start_at: Date;
  expires_at: Date;
}

export interface AdvertiseUpdate {
  advertise_id: string;
  title?: string;
  description?: string;
  image_url?: string;
  start_at?: Date;
  expires_at?: Date;
  status?: ad_status_type;
}

export interface AdvertiseFilters {
  category_id?: string;
  service_id?: string;
  status?: ad_status_type;
  limit?: number;
  page?: number;
}

// Interface for active ads (carousel/main page)
export interface AdvertiseActiveAd {
  advertise_id: string;
  provider_id: string;
  service_id: string;
  title?: string;
  description?: string;
  image_url: string;
  provider_profile_url: string;
  provider_business_name: string;
}

// Interface for provider ads (provider dashboard)
export interface AdvertiseProviderAd {
  advertise_id: string;
  provider_id: string;
  service_id: string;
  title?: string;
  description?: string;
  image_url: string;
  ad_status: ad_status_type;
  ad_reject_reason?: string;
  start_at: Date;
  expires_at: Date;
  impressions_count: number;
  clicks_count: number;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  service_name: string;
}
export interface pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface AdvertiseProviderAdPagination {
  pagination: pagination;
  ads: AdvertiseProviderAd[];
}
// Interface for full ad details (get by ID)
export interface AdvertiseDetails {
  advertise_id: string;
  provider_id: string;
  service_id: string;
  title?: string;
  description?: string;
  image_url: string;
  ad_status: ad_status_type;
  ad_reject_reason?: string;
  start_at: Date;
  expires_at: Date;
  impressions_count: number;
  clicks_count: number;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  service_name: string;
}

// Legacy interface - kept for backward compatibility
// Use specific interfaces above for new code
export interface AdvertiseWithDetails {
  advertise_id: string;
  provider_id: string;
  service_id: string;
  title?: string;
  description?: string;
  image_url: string;
  ad_status?: ad_status_type;
  ad_reject_reason?: string;
  start_at?: Date;
  expires_at?: Date;
  impressions_count?: number;
  clicks_count?: number;
  is_deleted?: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  created_at?: Date;
  updated_at?: Date;
  category_id?: string;
  service_name?: string;
  category_name?: string;
  provider_name?: string;
  provider_username?: string;
  provider_image_url?: string;
}

export interface ProviderAdFilters {
  category_id?: string;
  service_id?: string;
  status?: ad_status_type;
  limit?: number;
  page?: number;
}
