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
  unread_notification_count?: number;
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
  whatsapp_number?: string;
  whatsapp_country_code?: string;
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

export interface IBusinessInfo {
  business_name: string;
  description: string;
  business_images: File[] | string[];
  address_id: string;
}

export interface IFreeLeadParams {
  whatsapp_country_code: string;
  whatsapp_number: string;
  source: string;
  source_type: string;
}

export interface IFreeLeadResponse{
  bus_lead_id:string,
  whatsapp_number:string,
  whatsapp_country_code:string,
  status:string,
  isRegistered:boolean,
}

export interface IFreeLeadNumberResponse{
  bus_lead_id:string,
  whatsapp_number:string,
  whatsapp_country_code:string,
  status:string,
  source:string,
  source_type:string,
}

export interface IGuestRegisterParams {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  password: string;
  country: string;
}