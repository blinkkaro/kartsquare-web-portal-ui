"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import BackButton from "@/components/common/BackButton";
import ReviewManagementContainer from "./components/ReviewManagementContainer";

function MyReviewView() {
  const { t } = useTranslate();
  return (
    <Box sx={{ p: 2 }}>
      <BackButton />
      <Box sx={{ m: 3 }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
          {t("myReviews")}
        </Typography>
        <ReviewManagementContainer />
      </Box>
    </Box>
  );
}

export default MyReviewView;
