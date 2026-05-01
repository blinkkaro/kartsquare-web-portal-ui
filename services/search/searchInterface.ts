export interface SearchUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_pic: string;
  rating: number;
  city: string;
  type: "SERVICE_PROVIDER" | "CUSTOMER";
}

export interface SearchService {
  id: string;
  slug?: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  provider_name: string;
  type: "SERVICE";
}

export interface SearchResponse {
  users: SearchUser[];
  services: SearchService[];
}

export interface SearchApiResponse {
  status: "success" | "error";
  message: string;
  data: SearchResponse;
}
