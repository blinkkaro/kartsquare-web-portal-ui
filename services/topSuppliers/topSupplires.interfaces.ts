export interface TopProvider {
  id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  rating: number;
  country: string;
  city: string;
  total_bookings: string;
}

export interface TopService {
  id: string;
  name: string;
  image_urls: string[];
  rating: number;
  description: string;
  price: number;
  created_at: string;
  provider_id: string;
  provider_first_name: string;
  provider_last_name: string;
  provider_profile_pic: string;
}
