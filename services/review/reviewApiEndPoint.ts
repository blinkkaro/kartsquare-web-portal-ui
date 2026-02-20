import { review_type } from './reviewInterface';

export const APIENDPOINT = {
  GET_REVIEW: (
    event: review_type,
    review_event_id: string,
    page: number,
    limit: number,
  ) => `/review/${event}/${review_event_id}?page=${page}&limit=${limit}`,
  CREATE_REVIEW: `/review`,
  UPDATE_REVIEW: (review_id: string) => `/review/${review_id}`,
  DELETE_REVIEW: (review_id: string) => `/review/${review_id}`,
  GET_REVIEW_QUESTIONS: (category_id: string, subcategory_id?: string) => {
    if (subcategory_id) {
      return `/questions?category_id=${category_id}&subcategory_id=${subcategory_id}`;
    }
    return `/questions?category_id=${category_id}`;
  },
  UPDATE_TESTIMONIAL: (review_id: string) => `/review/testimonials/${review_id}`,
  GET_ALL_TESTIMONIALS: (providerId: string) => `/review/testimonials/${providerId}`,
};
