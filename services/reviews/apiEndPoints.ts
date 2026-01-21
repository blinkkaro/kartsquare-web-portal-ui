export const REVIEW_API_ENDPOINTS = {
    GET_REVIEWS: (eventType: string, eventId: string) => `/review/${eventType}/${eventId}`,
    CREATE_REVIEW: "/review",
    UPDATE_REVIEW: (reviewId: string) => `/review/${reviewId}`,
    DELETE_REVIEW: (reviewId: string) => `/review/${reviewId}`,
};
