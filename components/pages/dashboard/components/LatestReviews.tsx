"use client";

import React from "react";
import { Card, Typography, useTheme, Box } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ReviewCard from "../../../common/ReviewCard";
import EmptyState from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface LatestReviewsProps {
  reviews: any[]; // Using any to match usage, ideally should be Review[]
}

const LatestReviews: React.FC<LatestReviewsProps> = ({ reviews = [] }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("latestReviews")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: COLORS.PRIMARY_PURPLE,
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => router.push("/myAccount/myReviews")}
        >
          {t("seeall")}
        </Typography>
      </Box>
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
