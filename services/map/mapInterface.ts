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