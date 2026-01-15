export interface ReviewQuestion {
    question_id: string;
    answer: string | number | boolean;
}

export interface Review {
    review_question_id: string;
    user_id: string;
    review_event_type: string;
    review_event_id: string;
    rating: number;
    questions_and_answers: ReviewQuestion[];
    created_at: Date;
    updated_at: Date;
    // Joined fields from user
    user_name?: string;
    user_image_url?: string;
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
    questions_and_answers: ReviewQuestion[];
}
