import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { Service } from "@/services/serviceList/listInteraface";
import { Review, review_type } from "@/services/review/reviewInterface";
import ReviewCard from "../../../common/ReviewCard";
import ServiceReviewFilter from "./ServiceReviewFilter";
import { toast } from "react-hot-toast";
import { useGetReviews, useUpdateTestimonial } from "@/hooks/useReview";

const ReviewManagementContainer = () => {
  const { t } = useTranslate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [loadingServices, setLoadingServices] = useState(true);

  const [testimonials, setTestimonials] = useState<Review[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  // Use the hook for fetching reviews
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isRefetching: isReviewsRefetching,
  } = useGetReviews(
    review_type.SERVICE,
    selectedServiceId,
    page,
    LIMIT,
    !!selectedServiceId, // Only enable if selectedServiceId is set
  );

  // Use the hook for updating testimonial
  const { mutate: updateTestimonial } = useUpdateTestimonial();

  // Fetch Services on Mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceListService.getProviderServices();
        if (response.services && response.services.length > 0) {
          setServices(response.services);
          setSelectedServiceId(response.services[0].service_id);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error(t("failed_to_load_services"));
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [t]);

  // Handle Data Changes from Hook
  useEffect(() => {
    if (reviewsData && reviewsData.reviews) {
      if (page === 1) {
        setReviews(reviewsData.reviews);
      } else {
        setReviews((prev) => {
          // Avoid duplicates when appending
          const newReviews = reviewsData.reviews.filter(
            (newReview) =>
              !prev.some(
                (r) => r.customer_review_id === newReview.customer_review_id,
              ),
          );
          return [...prev, ...newReviews];
        });
      }
      setHasMore(reviewsData.meta.page < reviewsData.meta.total_pages);
    }
  }, [reviewsData, page]); // Depend on page to differentiate appending vs replacing

  // Reset when service changes
  useEffect(() => {
    if (selectedServiceId) {
      setPage(1);
      setReviews([]); // Clear lists to avoid mismatched data
    }
  }, [selectedServiceId]);

  const loadMoreReviews = () => {
    if (hasMore && !isReviewsLoading && !isReviewsRefetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleToggleTestimonial = (review: Review) => {
    const newStatus = !review.is_testimonials;

    // Optimistic Update: Update the review in the reviews list
    setReviews((prev) =>
      prev.map((r) =>
        r.customer_review_id === review.customer_review_id
          ? { ...r, is_testimonials: newStatus }
          : r,
      ),
    );

    updateTestimonial(
      {
        reviewId: review.customer_review_id,
        data: {
          is_testimonial: newStatus,
          review_event_id: review.review_event_id,
          questions_and_answers: review.questions_and_answers,
        } as any,
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus
              ? t("added_to_testimonials")
              : t("removed_from_testimonials"),
          );
        },
        onError: (error: any) => {
          console.error("Error toggling testimonial:", error);
          // Revert on error
          setReviews((prev) =>
            prev.map((r) =>
              r.customer_review_id === review.customer_review_id
                ? { ...r, is_testimonials: !newStatus }
                : r,
            ),
          );
          toast.error(t("failed_to_update_testimonial"));
        },
      },
    );
  };

  // Sync testimonials from reviews
  useEffect(() => {
    if (!reviews) return;
    const testimonialsList = reviews.filter(
      (review) => review.is_testimonials === true,
    );
    setTestimonials(testimonialsList);
  }, [reviews]);

  if (loadingServices) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!services || services.length === 0) {
    return <Typography sx={{ p: 4 }}>{t("no_services_found")}</Typography>;
  }

  return (
    <Box sx={{ pb: 4 }}>
      <ServiceReviewFilter
        services={services}
        selectedId={selectedServiceId}
        onSelect={setSelectedServiceId}
      />

      {/* Testimonials Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("testimonials")} ({testimonials.length})
        </Typography>
        {isReviewsLoading && page === 1 ? ( // Show loading only on initial fetch
          <CircularProgress size={24} />
        ) : testimonials.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {testimonials.map((review) => (
              <Box
                key={review.customer_review_id}
                sx={{
                  flexBasis: { xs: "100%", md: "calc(33.333% - 12px)" },
                  maxWidth: { xs: "100%", md: "calc(33.333% - 12px)" },
                  flexGrow: 0,
                }}
              >
                <ReviewCard
                  review={review}
                  isHighlighted={true}
                  onClick={() => handleToggleTestimonial(review)}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" variant="body2">
            {t("no_testimonials_selected")}
          </Typography>
        )}
      </Box>

      {/* All Reviews Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("all_reviews")}
        </Typography>

        {reviews.length > 0 ? (
          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {reviews.map((review) => (
                <Box
                  key={review.customer_review_id}
                  sx={{
                    flexBasis: { xs: "100%", md: "calc(50% - 8px)" },
                    maxWidth: { xs: "100%", md: "calc(50% - 8px)" },
                    flexGrow: 0,
                  }}
                >
                  <ReviewCard
                    review={review}
                    onClick={() => handleToggleTestimonial(review)}
                    isHighlighted={review.is_testimonials}
                  />
                </Box>
              ))}
            </Box>

            {hasMore && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={loadMoreReviews}
                >
                  {(isReviewsLoading || isReviewsRefetching) && page > 1 ? (
                    <CircularProgress size={20} />
                  ) : (
                    t("load_more")
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          !isReviewsLoading && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                {t("no_reviews_available")}
              </Typography>
            </Box>
          )
        )}

        {isReviewsLoading && page === 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReviewManagementContainer;
