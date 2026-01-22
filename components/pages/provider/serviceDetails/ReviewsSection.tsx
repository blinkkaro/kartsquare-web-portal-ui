"use client";
import React from "react";
import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import { Star } from "@mui/icons-material";
import ReviewCard from "../../../ReviewCard";
import { Review } from "../../../../services/reviews/reviewInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ReviewsSectionProps {
    reviews: Review[];
    totalReviews: number;
    avgRating: number;
    reviewsLoading: boolean;
    onLoadMore: () => void;
    showLoadMore: boolean;
}

const ReviewsSection = ({
    reviews,
    totalReviews,
    avgRating,
    reviewsLoading,
    onLoadMore,
    showLoadMore
}: ReviewsSectionProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box id="reviews-section" sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                    >
                        {totalReviews} {english.reviews}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Star sx={{ color: "#FFC107", fontSize: 20 }} />
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            }}
                        >
                            {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
                        </Typography>
                    </Box>
                </Box>
                {totalReviews > 0 && (
                    <Button
                        sx={{
                            textTransform: "none",
                            color: COLORS.PRIMARY_PURPLE,
                            fontWeight: 600,
                        }}
                    >
                        {english.see_all}
                    </Button>
                )}
            </Box>

            {/* Reviews List */}
            {reviewsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : reviews.length === 0 ? (
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "center",
                        py: 4,
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    }}
                >
                    {english.no_reviews_yet}
                </Typography>
            ) : (
                <>
                    {reviews.map((review) => (
                        <ReviewCard key={review.review_question_id} review={review} />
                    ))}

                    {/* Load More Button */}
                    {showLoadMore && (
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
                                    borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    "&:hover": {
                                        borderColor: COLORS.PRIMARY_PURPLE,
                                        bgcolor: "transparent",
                                    },
                                }}
                            >
                                {reviewsLoading ? english.loading : english.load_more_reviews}
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default ReviewsSection;
