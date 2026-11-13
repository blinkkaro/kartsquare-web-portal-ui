import { DELETE, GET, POST, PUT } from "../api";
import { APIENDPOINT } from "./reviewApiEndPoint";
import {
  Review,
  ReviewQuestions,
  ReviewResponse,
  reviewCreateParams,
  reviewUpdateParams,
  review_type,
} from "./reviewInterface";

class ReviewService {
  async getReview(
    event: review_type,
    review_event_id: string,
    page: number,
    limit: number,
  ): Promise<ReviewResponse> {
    try {
      const response = await GET<ReviewResponse>(
        APIENDPOINT.GET_REVIEW(event, review_event_id, page, limit),
      );
      console.log(response);
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  }
  async createReview(data: reviewCreateParams) {
    try {
      console.log(data);
      const response = await POST<ReviewResponse>(
        APIENDPOINT.CREATE_REVIEW,
        data,
      );
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateReview(review_id: string, data: reviewUpdateParams) {
    try {
      const response = await PUT<ReviewResponse>(
        APIENDPOINT.UPDATE_REVIEW(review_id),
        data,
      );
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteReview(review_id: string) {
    try {
      const response = await DELETE<ReviewResponse>(
        APIENDPOINT.DELETE_REVIEW(review_id),
      );
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  }
  async getReviewQuestions(subcategory_id: string[]): Promise<ReviewQuestions[]> {
    try {
      const response = await GET<ReviewQuestions[]>(
        APIENDPOINT.GET_REVIEW_QUESTIONS(subcategory_id),
      );
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    }
  }
  async updateTestimonial(review_id: string, data: reviewUpdateParams) {
    try {
      const response = await PUT<ReviewResponse>(
        APIENDPOINT.UPDATE_TESTIMONIAL(review_id),
        data,
      );
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllTestimonials(providerId: string): Promise<Review[]> {
    try {
      const response = await GET<Review[]>(APIENDPOINT.GET_ALL_TESTIMONIALS(providerId));
      console.log(response);
      if (response.status === "success") {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
