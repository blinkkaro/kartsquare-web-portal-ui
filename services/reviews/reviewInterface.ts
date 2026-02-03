import {
  questions_input_type,
  review_type,
} from "../providerDashboard/providerDashboard.interface";

export interface ReviewQuestion {
  question_id: string;
  question: string;
  answer: string | number;
  input_type?: questions_input_type;
}

export interface ReviewUser {
  user_id: string;
  name: string;
  email: string;
  profile_pic: string;
}

export interface Review {
  customer_review_id: string; // Mapped from review_question_id or actual ID
  user_id: string;
  review_event_type: review_type;
  review_event_id: string;
  rating: string;
  questions_and_answers: ReviewQuestion[];
  user: ReviewUser;
  created_at: string; // Changed to string to match provider
  updated_at: string; // Changed to string to match provider
  is_deleted: boolean;
  deleted_by: string | null;
  service_name?: string; // Optional service name
}

export interface ReviewMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  meta: ReviewMeta;
}

export interface ReviewFilter {
  review_event_type: string;
  review_event_id: string;
  page?: number;
  limit?: number;
}

export interface ReviewCreate {
  user_id: string;
  review_event_type: string;
  review_event_id: string;
  questions_and_answers: {
    question_id: string;
    answer: string | number | boolean;
  }[];
}
