import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review/reviewService";
import {
  reviewCreateParams,
  reviewUpdateParams,
  review_type,
} from "@/services/review/reviewInterface";

export const useReviewQuestions = (
  categoryId: string,
  subCategoryId?: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["review-questions", categoryId, subCategoryId],
    queryFn: () => reviewService.getReviewQuestions(categoryId, subCategoryId),
    enabled: enabled && !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetReviews = (
  event: review_type,
  review_event_id: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["reviews", event, review_event_id, page, limit],
    queryFn: () => reviewService.getReview(event, review_event_id, page, limit),
    enabled: enabled && !!review_event_id,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: reviewCreateParams) => reviewService.createReview(data),
    onSuccess: (_, variables) => {
      // Invalidate reviews query to refresh list
      queryClient.invalidateQueries({
        queryKey: ["service-reviews", variables.review_event_id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "reviews",
          variables.review_event_type,
          variables.review_event_id,
        ],
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: reviewUpdateParams;
    }) => reviewService.updateReview(reviewId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-reviews", variables.data.review_event_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews"], // Broad invalidation to ensure updates are reflected
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};
