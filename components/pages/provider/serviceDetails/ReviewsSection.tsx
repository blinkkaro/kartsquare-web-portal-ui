"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Star, RateReview } from "@mui/icons-material";
import ReviewCard from "@/components/common/ReviewCard";
import { Review } from "../../../../services/reviews/reviewInterface";
import { COLORS } from "../../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import EmptyState from "@/components/common/EmptyState";

interface ReviewsSectionProps {
  reviews: Review[];
  totalReviews: number;
  avgRating: number;
  reviewsLoading: boolean;
  onLoadMore: () => void;
  showLoadMore: boolean;
  onAddReview?: () => void;
}

const ReviewsSection = ({
  reviews,
  totalReviews,
  avgRating,
  reviewsLoading,
  onLoadMore,
  showLoadMore,
  onAddReview,
}: ReviewsSectionProps) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [isExpanded, setIsExpanded] = React.useState(false);

  // Show only first 5 reviews if not expanded
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, 5);
  const shouldShowSeeAll = !isExpanded && totalReviews > 5;

  return (
    <Box id="reviews-section" sx={{ mt: { xs: 2, sm: 2 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
          mb: { xs: 2, sm: 3 },
          mt: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {totalReviews} {t("reviews")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ color: "#FFC107", fontSize: { xs: 18, sm: 20 } }} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {onAddReview && (
            <Button
              variant="outlined"
              onClick={onAddReview}
              startIcon={<RateReview />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 2 },
                borderRadius: "8px",
                borderColor: isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.PRIMARY_PURPLE,
                  bgcolor: "transparent",
                },
              }}
            >
              {t("write_review")}
            </Button>
          )}
          {shouldShowSeeAll && (
            <Button
              onClick={() => setIsExpanded(true)}
              sx={{
                textTransform: "none",
                color: COLORS.PRIMARY_PURPLE,
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 2 },
              }}
            >
              {t("see_all")}
            </Button>
          )}
        </Box>
      </Box>

      {/* Reviews List */}
      {reviewsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <EmptyState
          titleKey="no_reviews_yet"
          icon={
            <RateReview
              sx={{
                fontSize: 64,
                color: COLORS.PRIMARY_PURPLE,
                opacity: 0.6,
              }}
            />
          }
          minHeight={200}
          variant="empty"
        />
      ) : (
        <>
          {visibleReviews.map((review) => (
            <ReviewCard key={review.customer_review_id} review={review} />
          ))}

          {/* Load More Button - Only show if expanded and there are more pages */}
          {showLoadMore && isExpanded && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onLoadMore}
                disabled={reviewsLoading}
                sx={{
                  borderRadius: "8px",
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  borderColor: isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    bgcolor: "transparent",
                  },
                }}
              >
                {reviewsLoading ? t("loading") : t("load_more_reviews")}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ReviewsSection;
