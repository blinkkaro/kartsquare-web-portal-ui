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
  GET_REVIEW_QUESTIONS: (subcategory_id: string | string[]) => {
    if (Array.isArray(subcategory_id)) {
      const params = subcategory_id
        .map((id) => `subcategory_id=${id}`)
        .join("&");
      return `/questions?${params}`;
    }
    return `/questions?subcategory_id=${subcategory_id}`;
  },
  UPDATE_TESTIMONIAL: (review_id: string) => `/review/testimonials/${review_id}`,
  GET_ALL_TESTIMONIALS: (providerId: string) => `/review/testimonials/${providerId}`,
};
