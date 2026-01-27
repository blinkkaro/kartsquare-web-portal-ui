import { BookingStatus, UserBooking } from "../booking/bookingInterface";

export enum questions_input_type {
  STAR = 'star_rating',
  TEXT = 'text',
  YES_NO = 'yes_no',
}

export enum review_type {
  PRODUCT = 'product',
  SERVICE = 'service',
  EVENT = 'event',
}

export interface ReviewUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
}

export interface Review {
  customer_review_id: string;
  user_id: string;
  review_event_type: review_type;
  review_event_id: string;
  rating: string;
  questions_and_answers: ReviewQuestionAnswer[];
  user: ReviewUser;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_by: string | null;
}

export interface ReviewQuestionAnswer {
  question_id: string;
  question: string;
  answer: string | number;
  input_type?: questions_input_type;
}


export interface stats {
     total_services: number,
     total_active_services: number,
     followers: number,
     total_bookings: number,
     total_pending_bookings: number,
     total_completed_bookings: number
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
    latitude: string;
    longitude: string;
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

export interface ProviderDashboardResponse {
    stats: stats,
    upcoming_bookings: Booking[],
    latest_reviews: (Review & { service_name: string })[],
}

export interface ProviderDashboardChartResponse {
    year: number,
    data: number[]
}