import { BookingStatus, UserBooking } from "../booking/bookingInterface";
import { Review } from "../review/reviewInterface";

export enum questions_input_type {
  STAR = "star_rating",
  TEXT = "text",
  YES_NO = "yes_no",
}

export enum review_type {
  PRODUCT = "product",
  SERVICE = "service",
  EVENT = "event",
}

export interface ReviewUser {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  profile_pic: string;
}


export interface ReviewQuestionAnswer {
  question_id: string;
  question: string;
  answer: string | number;
  input_type?: questions_input_type;
}

export interface stats {
  total_services: number;
  total_active_services: number;
  followers: number;
  total_bookings: number;
  total_pending_bookings: number;
  total_completed_bookings: number;
  total_phone_number_views: number;
  total_profile_views: number;
}
export interface service_address {
  address: string;
  building_no?: string;
  floor?: string;
  landmark?: string;
  city_town: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}
export interface Booking {
  booking_id: string;
  currency: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_profile_pic: string;
  image_urls: string[];
  price: number;
  schedule_at: string;
  service_name: string;
  service_address: service_address;
  status: BookingStatus;
}

export type CompletenessKey =
  | "has_service"
  | "has_business_photos"
  | "has_working_hours"
  | "has_profile_photo"
  | "has_business_description"
  | "has_address";

export interface CompletenessStep {
  key: CompletenessKey;
  done: boolean;
}

export interface ProfileCompleteness {
  percent: number;
  steps: CompletenessStep[];
  next_step: CompletenessKey | null;
}

export interface DashboardAttention {
  pending_bookings: number;
  new_leads_7d: number;
  unread_notifications: number;
}

export interface DashboardProfile {
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  profile_pic: string | null;
  username: string | null;
  city: string | null;
  is_accepting_bookings: boolean;
  completeness: ProfileCompleteness;
}

export interface ProviderDashboardResponse {
  stats: stats;
  upcoming_bookings: Booking[];
  latest_reviews: (Review & { service_name: string })[];
  /** Absent on a backend that predates the dashboard summary. */
  attention?: DashboardAttention;
  profile?: DashboardProfile;
}

export interface AvailabilityResponse {
  is_accepting_bookings: boolean;
}

export interface ProviderDashboardChartResponse {
  year: number;
  data: number[];
}
