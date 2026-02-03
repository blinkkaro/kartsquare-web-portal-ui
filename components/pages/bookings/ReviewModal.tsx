import React from "react";
import {
  Box,
  Dialog,
  Typography,
  Button,
  IconButton,
  Avatar,
  useTheme,
  Zoom,
} from "@mui/material";
import { motion } from "framer-motion";
import { Star, Close } from "@mui/icons-material";
import { COLORS } from "../../../constants/colors";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  providerName?: string;
  providerImage?: string;
  serviceName?: string;
  id: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  providerName = "Provider",
  providerImage,
  serviceName = "Service",
  id,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const { t } = useTranslate();

  const handleRateNow = () => {
    router.push(`/services/${id}?action=review`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 24,
          padding: 0,
          background: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
          maxWidth: 450,
          width: "100%",
          overflow: "visible",
        },
      }}
      TransitionComponent={Zoom}
    >
      <Box sx={{ position: "relative", p: 4, pt: 5, textAlign: "center" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
          }}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.SECONDARY_ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("booking_completed")}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
          {t("how_was_your_experience")} with <b>{providerName}</b> {t("for")}{" "}
          <b>{serviceName}</b>?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            src={providerImage}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${COLORS.PRIMARY_PURPLE}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          />
        </Box>

        {/* Animated Stars */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 4,
          }}
        >
          {[1, 2, 3, 4, 5].map((_, index) => {
            const totalDuration = 3;
            const fillDuration = 0.4;
            const stagger = 0.2;
            const startFill = (index * stagger) / totalDuration;
            const endFill = (index * stagger + fillDuration) / totalDuration;
            const startEmpty = 0.8; // Common empty start time (80% of cycle)

            return (
              <Box
                key={index}
                sx={{ position: "relative", width: 40, height: 40 }}
              >
                {/* Background placeholder star */}
                <Star
                  sx={{
                    fontSize: 40,
                    color: isDark ? "rgba(255,255,255,0.1)" : "#E0E0E0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />

                {/* Filling star */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  animate={{
                    clipPath: [
                      "inset(0 100% 0 0)", // 0% - Start empty
                      "inset(0 100% 0 0)", // Start fill time - Still empty
                      "inset(0 0% 0 0)", // End fill time - Full
                      "inset(0 0% 0 0)", // Start empty time - Still Full
                      "inset(0 100% 0 0)", // End empty time (100%) - Empty
                    ],
                    opacity: [0, 0, 1, 1, 0],
                  }}
                  transition={{
                    duration: totalDuration,
                    times: [0, startFill, endFill, startEmpty, 1],
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Star
                    sx={{
                      fontSize: 40,
                      color: "#FFC107",
                      filter: "drop-shadow(0px 0px 8px rgba(255, 193, 7, 0.5))",
                    }}
                  />
                </motion.div>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              borderRadius: 3,
              py: 1.5,
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
              },
            }}
          >
            {t("maybe_later")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRateNow}
            sx={{
              borderRadius: 3,
              py: 1.5,
              bgcolor: COLORS.PRIMARY_PURPLE,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: `0 8px 16px ${COLORS.PRIMARY_PURPLE}40`,
              "&:hover": {
                bgcolor: COLORS.PURPLE_HOVER,
              },
            }}
          >
            {t("rate_now")}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReviewModal;
