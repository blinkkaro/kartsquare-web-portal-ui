import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviews/reviewService";
import { ReviewsResponse } from "@/services/reviews/reviewInterface";

/**
 * Hook to fetch reviews with pagination using TanStack Query
 * Supports infinite scroll pattern
 */
export const useServiceReviews = (
  serviceId: string,
  reviewsPerPage: number = 5,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: ["service-reviews", serviceId, reviewsPerPage],
    queryFn: ({ pageParam = 1 }) =>
      reviewService.getReviews(
        "SERVICE",
        serviceId,
        pageParam,
        reviewsPerPage
      ),
    enabled: enabled && !!serviceId,
    getNextPageParam: (lastPage: ReviewsResponse) => {
      const { page, total_pages } = lastPage.meta;
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000, // 1 minute - reviews can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

/**
 * Hook to fetch reviews with simple pagination (for backward compatibility)
 */
export const useReviews = (
  eventType: string,
  eventId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reviews", eventType, eventId, page, limit],
    queryFn: () => reviewService.getReviews(eventType, eventId, page, limit),
    enabled: enabled && !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
