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
  total_enquiries: number;
  total_active_products: number;
  followers: number;
  total_pending_enquiries: number;
  total_completed_enquiries: number;
  total_profile_views: number;
  total_phone_number_views: number;
}

export interface SupplierQuotation {
  supplier_quotation_id: string;
  product_name: string;
  product_images: string[];
  customer_name: string;
  country_code: string;
  phone_number: string;
  email: string;
  quantity: number;
  price: number;
  currency: string;
  details: string;
  created_at: string;
  is_viewed: boolean;
  is_deleted: boolean;
  product_id: string;
  supplier_id: string;
}

export interface SupplierDashboardResponse {
  stats: stats;
  pending_enquiries: SupplierQuotation[];
  latest_reviews: (Review & { service_name: string })[];
}

export interface SupplierDashboardChartResponse {
  year: number;
  data: number[];
}
