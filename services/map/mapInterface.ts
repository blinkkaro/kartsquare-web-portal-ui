export interface SearchResult {
  place_id: string;
  description: string;
  distance?: number | null;
  location?: {
    lat: number;
    lng: number;
    formatted_address?: string;
    address_components?: any;
  } | null;
}

/** Map API: service item (has service_address with lat/lng) */
export interface MapServiceAddress {
  building_no?: string;
  floor?: string;
  address: string;
  landmark?: string;
  pincode?: string;
  city_town: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface MapServiceItem {
  service_id: string;
  provider_id: string;
  service_name: string;
  service_desc?: string | null;
  image_urls: string[];
  price?: number | null;
  currency: string;
  provider_name: string;
  provider_image_url?: string | null;
  category_name: string;
  sub_category_name?: string | null;
  avg_service_rating?: string | number;
  review_count?: number;
  service_address?: MapServiceAddress | null;
  [key: string]: any;
}

/** Map API: store address */
export interface MapStoreAddress {
  latitude: number | null;
  longitude: number | null;
  address?: string | null;
  city_town?: string | null;
  state?: string | null;
  pincode?: string | null;
  [key: string]: any;
}

export interface MapStoreDetails {
  store_name: string | null;
  logo_url: string | null;
  banner_url?: string | null;
  description?: string | null;
  is_verified?: boolean;
  store_address: MapStoreAddress;
  [key: string]: any;
}

export interface MapStoreItem {
  supplier_id: string;
  store_details: MapStoreDetails;
}

export interface MapDetailsPagination {
  services_total: number;
  stores_total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface MapDetailsResponse {
  services: MapServiceItem[];
  stores: MapStoreItem[];
  pagination: MapDetailsPagination;
}