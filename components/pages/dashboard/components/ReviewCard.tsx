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
import { Star, ExpandMore, ExpandLess } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Review, questions_input_type } from "@/services/providerDashboard/providerDashboard.interface";
import { formatStringTimeForReview } from "@/helper/helper";

interface ReviewCardProps {
  review: Review & { service_name: string };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Helper to extract main text review and sub-ratings
  const textReviews = (review.questions_and_answers || []).filter(
    (qa) => qa.input_type === questions_input_type.TEXT || (!qa.input_type && typeof qa.answer === "string")
  );
  
  // For now, we take the first string answer as the main body if available.
  const mainReviewText = textReviews.length > 0 ? String(textReviews[0].answer) : "No review text provided.";
  
  const ratingReviews = (review.questions_and_answers || []).filter(
    (qa) => qa.input_type === questions_input_type.STAR || (!qa.input_type && typeof qa.answer === "number")
  );

  return (
    <Box
      sx={{
        borderRadius: "12px",
        boxShadow: "none",
        border: "none", // Matches the clean look of the image, or add border if container has one
        mb: 2,
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
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
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
                <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                  {Number(review.rating).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                display: "block",
              }}
            >
              {review.created_at ? formatStringTimeForReview(review.created_at) : ""}
            </Typography>
            <Chip 
                label={review.service_name} 
                size="small" 
                variant="outlined" 
                sx={{ mt: 1, fontSize: '0.7rem' }} 
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {mainReviewText}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            width: "fit-content",
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
            {expanded ? "Collapse Review" : "Expand Review"}
          </Typography>
          {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}` }}>
            {ratingReviews.map((qa, index) => (
              <Box
                key={index}
                sx={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                }}
              >
                 <Typography variant="body2" color="text.secondary">
                   {qa.question}
                </Typography>
                <Rating value={Number(qa.answer)} readOnly size="small" />
              </Box>
            ))}
             {ratingReviews.length === 0 && (
                <Typography variant="caption" color="text.secondary">No detailed ratings available.</Typography>
             )}
          </Box>
        </Collapse>
      </CardContent>
    </Box>
  );
};

export default ReviewCard;
