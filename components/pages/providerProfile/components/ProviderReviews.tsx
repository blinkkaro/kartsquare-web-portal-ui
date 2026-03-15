"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { Verified } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useGetAllTestimonials } from "@/hooks/useReview";
import ReviewCard from "@/components/common/ReviewCard";
import { Review } from "@/services/review/reviewInterface";

const ProviderReviews: React.FC<{
  providerId: string;
  providerName: string;
  hideTitle?: boolean;
}> = ({ providerId, providerName, hideTitle = false }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const { data: reviews, isLoading, error } = useGetAllTestimonials(providerId);

  if (isLoading) {
    return <CenteredLoader p={4} size={30} />;
  }

  if (error || !reviews || reviews.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: hideTitle ? 0 : 4 }}>
      {!hideTitle && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Verified sx={{ color: COLORS.PRIMARY_BLUE }} />
          {t("reviews" as any) + " of " + providerName || "Recent Reviews"}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {reviews.map((review: Review) => (
          <ReviewCard key={review.customer_review_id} review={review} />
        ))}
      </Box>
    </Box>
  );
};

export default ProviderReviews;
