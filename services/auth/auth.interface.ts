export type AppUserType = "CUSTOMER" | "SERVICE_PROVIDER" | "SUPPLIER" | "INFLUENCER";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  birth_date: string;
  gender: Gender;
  country: string;
  role: AppUserType;
  is_Verified: boolean;
  register_step: number;
  profile_pic: string;
}

export interface AuthResponse {
  message: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  password: string;
  gender: Gender;
  country: string;
  role: AppUserType;
  birth_date: string;
}
