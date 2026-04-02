"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Collapse,
  Rating,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Star,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import {
  questions_input_type,
} from "@/services/providerDashboard/providerDashboard.interface";
import { formatStringTimeForReview } from "@/helper/helper";
import { useTranslate } from "@/hooks/useTranslate";
import { Review } from "@/services/review/reviewInterface";

interface ReviewCardProps {
  review: Review & { service_name?: string };
  isHighlighted?: boolean;
  onClick?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isHighlighted,
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  // Helper to extract main text review and sub-ratings
  const textReviews = (review.questions_and_answers || []).filter(
    (qa) =>
      qa.input_type === questions_input_type.TEXT ||
      (!qa.input_type && typeof qa.answer === "string"),
  );

  // Split text reviews: first 2 visible, rest hidden
  const visibleTextReviews = textReviews.slice(0, 2);
  const hiddenTextReviews = textReviews.slice(2);
  const hasTextReviews = textReviews.length > 0;

  // Consolidate non-text reviews (Star & Yes/No) into one array
  const nonTextReviews = (review.questions_and_answers || []).filter(
    (qa) =>
      qa.input_type === questions_input_type.STAR ||
      (!qa.input_type && typeof qa.answer === "number") ||
      qa.input_type === questions_input_type.YES_NO,
  );

  const hasManyNonTextReviews = nonTextReviews.length > 2;

  // Determine visibility logic
  let visibleNonTextReviews = nonTextReviews;
  let hiddenNonTextReviews: typeof nonTextReviews = [];

  // If NO text reviews AND many non-text reviews, split them
  if (!hasTextReviews && hasManyNonTextReviews) {
    visibleNonTextReviews = nonTextReviews.slice(0, 2);
    hiddenNonTextReviews = nonTextReviews.slice(2);
  } else if (hasTextReviews) {
    // If text reviews exist, ALL non-text reviews are hidden initially (inside collapse)
    visibleNonTextReviews = [];
    hiddenNonTextReviews = nonTextReviews;
  }

  // Auto-expand logic:
  // - If has text reviews: Default collapsed (false)
  // - If no text reviews:
  //    - If <= 2 non-text: No expansion needed (effectively expanded/visible), button hidden
  //    - If > 2 non-text: Default collapsed (false)
  const defaultExpanded = !hasTextReviews && !hasManyNonTextReviews;
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const shouldShowExpandButton =
    (hasTextReviews &&
      (hiddenTextReviews.length > 0 || hiddenNonTextReviews.length > 0)) ||
    (!hasTextReviews && hasManyNonTextReviews);

  const renderNonTextReview = (qa: any, index: number) => (
    <Box
      key={`non-text-${index}`}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {qa.question}
      </Typography>
      {qa.input_type === questions_input_type.STAR ||
      (!qa.input_type && typeof qa.answer === "number") ? (
        <Rating value={Number(qa.answer)} readOnly size="small" />
      ) : (
        // Yes/No render
        <>
          {String(qa.answer).toLowerCase() === "yes" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircle sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{ color: COLORS.SUCCESS_GREEN, fontWeight: 600 }}
              >
                {t("yes")}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Cancel sx={{ color: "#d32f2f", fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{ color: "#d32f2f", fontWeight: 600 }}
              >
                {t("no")}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        boxShadow: "none",
        border: "none",
        mb: 2,
        cursor: onClick ? "pointer" : "default",
        bgcolor: isHighlighted
          ? isDark
            ? "rgba(76, 175, 80, 0.1)"
            : "rgba(76, 175, 80, 0.05)"
          : "background.paper", // Ensure base background for non-highlighted
        outline: isHighlighted
          ? `1px solid ${COLORS.SUCCESS_GREEN}`
          : undefined,
        position: "relative",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              boxShadow: theme.shadows[2],
              bgcolor: isHighlighted
                ? isDark
                  ? "rgba(76, 175, 80, 0.2)"
                  : "rgba(76, 175, 80, 0.1)"
                : undefined,
            }
          : undefined,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar
              src={review.user?.profile_pic}
              alt={review.user?.name || "User"}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {review.user?.name || "Anonymous User"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "#1F2937", // Dark pill background
                  color: "#FFD700", // Gold star
                  px: 1,
                  py: 0.25,
                  borderRadius: "12px",
                  width: "fit-content",
                  mt: 0.5,
                }}
              >
                <Star sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {Number(review.rating).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                display: "block",
              }}
            >
              {review.created_at
                ? formatStringTimeForReview(review.created_at)
                : ""}
            </Typography>
            {review.service_name && (
              <Chip
                label={review.service_name}
                size="small"
                variant="outlined"
                sx={{ mt: 1, fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>

        {/* Visible Text Reviews */}
        {visibleTextReviews.map((qa, index) => (
          <Box key={`text-visible-${index}`} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                display: "block",
                mb: 0.5,
              }}
            >
              {qa.question}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                lineHeight: 1.6,
              }}
            >
              {String(qa.answer)}
            </Typography>
          </Box>
        ))}

        {/* Visible Non-Text Reviews (Only shown here if !hasTextReviews) */}
        {visibleNonTextReviews.map((qa, index) =>
          renderNonTextReview(qa, index),
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 0,
              pt: 0,
            }}
          >
            {/* Hidden Text Reviews */}
            {hiddenTextReviews.map((qa, index) => (
              <Box key={`text-hidden-${index}`} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  {qa.question}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    lineHeight: 1.6,
                  }}
                >
                  {String(qa.answer)}
                </Typography>
              </Box>
            ))}

            {/* Hidden Non-Text Reviews */}
            {hiddenNonTextReviews.map((qa, index) =>
              renderNonTextReview(qa, index),
            )}

            {hiddenTextReviews.length === 0 &&
              hiddenNonTextReviews.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  {t("no_detailed_ratings_available")}
                </Typography>
              )}
          </Box>
        </Collapse>

        {shouldShowExpandButton && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              width: "fit-content",
              mt: 1,
            }}
            onClick={handleExpandClick}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                textDecoration: "underline",
                mr: 0.5,
              }}
            >
              {expanded ? t("collapse_review") : t("expand_review")}
            </Typography>
            {expanded ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </Box>
        )}
      </CardContent>
    </Box>
  );
};

export default ReviewCard;
