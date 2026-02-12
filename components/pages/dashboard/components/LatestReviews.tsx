"use client";

import React from "react";
import { Card, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ReviewCard from "../../../common/ReviewCard";
import EmptyState from "@/components/common/EmptyState";

interface LatestReviewsProps {
  reviews: any[]; // Using any to match usage, ideally should be Review[]
}

const LatestReviews: React.FC<LatestReviewsProps> = ({ reviews = [] }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        borderRadius: "12px",
        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        boxShadow: isDark
          ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
          : "0px 2px 8px rgba(0, 0, 0, 0.05)",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t("latestReviews")}
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewCard key={review.id || index} review={review} />
        ))
      ) : (
        <EmptyState
          titleKey=""
          title={t("no_reviews_yet" as any)}
          description={t("no_reviews_yet_desc" as any)}
          minHeight={200}
          iconSize={48}
        />
      )}
    </Card>
  );
};

export default LatestReviews;
