export enum AppUserType {
  CUSTOMER = "CUSTOMER",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  SUPPLIER = "SUPPLIER",
  INFLUENCER = "INFLUENCER",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

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
export interface preferences {
  icon: string;
  id: string;
  preference_name: string;
  is_active: boolean;
  is_selected?: boolean;
}

export interface Doc {
  aadharNumber: string;
  frontImageUrl: string;
  backImageUrl: string;
  profilePic: string; 
  policeVerification: string;
}

export interface ImageUploadApiResponse {
  urls: string[];
}

export interface IWorkingHour {
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
