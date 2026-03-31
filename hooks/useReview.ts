import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { reviewService } from "@/services/review/reviewService";
import {
  reviewCreateParams,
  reviewUpdateParams,
  review_type,
  ReviewResponse,
} from "@/services/review/reviewInterface";

export const useReviewQuestions = (
  subCategoryId: string[],
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["review-questions", subCategoryId],
    queryFn: () => reviewService.getReviewQuestions(subCategoryId!),
    enabled: enabled && !!subCategoryId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetReviews = (
  event: review_type,
  review_event_id: string,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useInfiniteQuery({
    queryKey: ["reviews", event, review_event_id, limit],
    queryFn: ({ pageParam }: { pageParam: unknown }) =>
      reviewService.getReview(
        event,
        review_event_id,
        pageParam as number,
        limit,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ReviewResponse) => {
      const { page, total_pages } = lastPage.meta;
      return page < total_pages ? page + 1 : undefined;
    },
    enabled: enabled && !!review_event_id,
    placeholderData: keepPreviousData,
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

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: reviewUpdateParams & { is_testimonial?: boolean };
    }) => reviewService.updateTestimonial(reviewId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific queries if needed, or general reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

export const useGetAllTestimonials = (
  providerId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["all-testimonials", providerId],
    queryFn: () => reviewService.getAllTestimonials(providerId),
    enabled: enabled && !!providerId,
    staleTime: 5 * 60 * 1000,
  });
};
