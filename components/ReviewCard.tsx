import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Rating,
  Button,
  useTheme,
  Collapse,
} from "@mui/material";
import { COLORS } from "../constants/colors";
import { Review } from "../services/reviews/reviewInterface";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(false);

  // Extract review text from questions_and_answers
  const reviewText =
    (review.questions_and_answers.find((qa) => typeof qa.answer === "string")
      ?.answer as string) || "No review text";

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
        py: 3,
      }}
    >
      {/* Reviewer Info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar src={review.user_image_url} sx={{ width: 40, height: 40 }}>
            {review.user_name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {review.user_name || "Anonymous"}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Box
                sx={{
                  bgcolor: isDark ? "#2D2D2D" : "#F0F0F0",
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {Number(review.rating).toFixed(1)}
                </Typography>
              </Box>
              <Rating
                value={Number(review.rating)}
                readOnly
                size="small"
                precision={0.1}
              />
            </Box>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {formatDate(new Date(review.created_at))}
        </Typography>
      </Box>

      {/* Review Text */}
      <Typography
        variant="body2"
        sx={{
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
          lineHeight: 1.6,
          mb: 1,
        }}
      >
        {expanded
          ? reviewText
          : `${reviewText.substring(0, 200)}${reviewText.length > 200 ? "..." : ""}`}
      </Typography>

      {reviewText.length > 200 && (
        <Button
          onClick={() => setExpanded(!expanded)}
          sx={{
            textTransform: "none",
            color: COLORS.PRIMARY_PURPLE,
            p: 0,
            minWidth: "auto",
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {expanded ? "Collapse Review" : "Expand Review"}
        </Button>
      )}

      {/* Rating Breakdown (Collapsible) */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pl: 2 }}>
          {review.questions_and_answers
            .filter((qa) => typeof qa.answer === "number")
            .map((qa, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    minWidth: "100px",
                  }}
                >
                  Question {index + 1}:
                </Typography>
                <Rating
                  value={qa.answer as number}
                  readOnly
                  size="small"
                  precision={0.5}
                />
              </Box>
            ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ReviewCard;
