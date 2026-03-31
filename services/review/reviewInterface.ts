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

export interface ReviewQuestionAnswer {
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

export interface ReviewQuestions {
  review_question_id: string;
  category_id: string;
  sub_category_id: string | null;
  question: string;
  input_type: questions_input_type;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_by: string | null;
}

export interface Review {
  customer_review_id: string;
  user_id: string;
  review_event_type: review_type;
  review_event_id: string;
  overall_rating: number;
  questions_and_answers: ReviewQuestionAnswer[];
  user: ReviewUser;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_by: string | null;
  is_testimonials: boolean; 
}

export interface meta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ReviewResponse {
  reviews: Review[];
  meta: meta;
}

export interface reviewUpdateParams {
  review_event_id: string;
  overall_rating?: number;
  questions_and_answers: ReviewQuestionAnswer[];
}

export interface reviewCreateParams {
  review_event_type: review_type;
  review_event_id: string;
  overall_rating?: number;
  questions_and_answers: ReviewQuestionAnswer[];
}
