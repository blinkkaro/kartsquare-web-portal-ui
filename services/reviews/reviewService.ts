import { GET, POST, PUT, DELETE } from "../api";
import { REVIEW_API_ENDPOINTS } from "./apiEndPoints";
import { ReviewsResponse, ReviewCreate } from "./reviewInterface";

class ReviewService {
    /**
     * Get reviews for a specific event (service, product, etc.)
     */
    async getReviews(
        eventType: string,
        eventId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ReviewsResponse> {
        try {
            console.log("Fetching reviews for event:", eventType, eventId);
            const response = await GET<any>(
                REVIEW_API_ENDPOINTS.GET_REVIEWS(eventType, eventId),
                { page, limit },
                true // Public endpoint - anyone can view reviews
            );

            // Backend returns { reviews: data, meta } wrapped in ApiResponse.data
            const data = response.data || response;
            return {
                reviews: data.reviews || [],
                meta: data.meta || { total: 0, page: 1, limit: 10, total_pages: 0 }
            };
        } catch (error: any) {
            // If user is not authenticated (401), return empty reviews instead of throwing
            if (error?.response?.status === 401) {
                console.log("User not authenticated, reviews unavailable");
                return {
                    reviews: [],
                    meta: { total: 0, page: 1, limit: 10, total_pages: 0 }
                };
            }
            console.error("Error fetching reviews:", error);
            // Return empty response on other errors too
            return {
                reviews: [],
                meta: { total: 0, page: 1, limit: 10, total_pages: 0 }
            };
        }
    }

    /**
     * Create a new review
     */
    async createReview(reviewData: ReviewCreate): Promise<any> {
        try {
            const response = await POST<any>(
                REVIEW_API_ENDPOINTS.CREATE_REVIEW,
                reviewData,
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }

    /**
     * Update an existing review
     */
    async updateReview(reviewId: string, updateData: any): Promise<any> {
        try {
            const response = await PUT<any>(
                REVIEW_API_ENDPOINTS.UPDATE_REVIEW(reviewId),
                updateData,
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    }

    /**
     * Delete a review
     */
    async deleteReview(reviewId: string): Promise<any> {
        try {
            const response = await DELETE<any>(
                REVIEW_API_ENDPOINTS.DELETE_REVIEW(reviewId),
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }
}

export const reviewService = new ReviewService();
