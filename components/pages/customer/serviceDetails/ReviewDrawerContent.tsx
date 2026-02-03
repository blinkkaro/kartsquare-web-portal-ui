import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Rating,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useReviewQuestions, useCreateReview } from "@/hooks/useReview";
import { Service } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import {
  questions_input_type,
  review_type,
  ReviewQuestionAnswer,
} from "@/services/review/reviewInterface";
import { toast } from "react-hot-toast";
import { useTranslate } from "@/hooks/useTranslate";

interface ReviewDrawerContentProps {
  service: Service;
  onClose: () => void;
}

const ReviewDrawerContent: React.FC<ReviewDrawerContentProps> = ({
  service,
  onClose,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  const { data, isLoading } = useReviewQuestions(
    service.category_id,
    service.sub_category_id || undefined,
  );

  const { mutate: submitReview, isPending: isSubmitting } = useCreateReview();

  const [answers, setAnswers] = useState<{ [key: string]: string | number }>(
    {},
  );

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
  

    const questionsAndAnswers: ReviewQuestionAnswer[] =
      data
        ?.map((q) => ({
          question_id: q.review_question_id,
          question: q.question,
          answer: answers[q.review_question_id] || "",
          input_type: q.input_type,
        }))
        .filter((q) => q.answer !== "" && q.answer !== 0) || [];

    submitReview(
      {
        review_event_type: review_type.SERVICE,
        review_event_id: service.service_id,
        questions_and_answers: questionsAndAnswers,
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully!");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to submit review");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Write a Review
      </Typography> */}

      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Rate your experience
        </Typography>
        <Rating
          value={overallRating}
          onChange={(_, newValue) => setOverallRating(newValue)}
          size="large"
          sx={{
            "& .MuiRating-iconFilled": {
              color: COLORS.SECONDARY_ORANGE,
            },
          }}
        />
      </Box> */}

      {data?.map((q) => (
        <Box key={q.review_question_id} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
            {q.question}
          </Typography>

          {q.input_type === questions_input_type.TEXT && (
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Type your answer here..."
              value={answers[q.review_question_id] || ""}
              onChange={(e) =>
                handleAnswerChange(q.review_question_id, e.target.value)
              }
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              }}
            />
          )}

          {q.input_type === questions_input_type.STAR && (
            <Rating
              value={(answers[q.review_question_id] as number) || 0}
              onChange={(_, newValue) =>
                handleAnswerChange(q.review_question_id, newValue || 0)
              }
            />
          )}

          {q.input_type === questions_input_type.YES_NO && (
            <FormControl>
              <RadioGroup
                row
                value={answers[q.review_question_id] || ""}
                onChange={(e) =>
                  handleAnswerChange(q.review_question_id, e.target.value)
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          )}
        </Box>
      ))}

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: { xs: "100%", md: 500 }, // Matching default drawer width if possible, but passing as prop might be safer. RightDrawer default is 1000px on desktop though?
          p: 3,
          bgcolor: isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          borderTop: `1px solid ${
            isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          zIndex: 10,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button onClick={onClose} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("submit_review")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewDrawerContent;
