"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getSuccessStories } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";

const PURPLE = COLORS.PRIMARY_PURPLE;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

const SuccessStories = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const stories = getSuccessStories(t);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const current = stories[currentIndex];
  const total = stories.length;

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  };
  const goNext = () => {
    setDirection(1);
    setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark
          ? COLORS.BACKGROUND.SECONDARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <SectionHeading
            title={t("whatSuccessLooksLikeTitle")}
            subtitle={t("whatSuccessLooksLikeSubtext")}
            variant="accent"
            align="center"
          />
        </Box>

        {/* Single large card: quote left, image right */}
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
            boxShadow: isDark
              ? "none"
              : "0 4px 24px rgba(94, 24, 233, 0.06), 0 1px 3px rgba(0,0,0,0.06)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: { xs: "auto", md: 380 },
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: "100%" }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "3.5rem",
                    lineHeight: 1,
                    color: PURPLE,
                    opacity: 0.25,
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  &ldquo;
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 500,
                    lineHeight: 1.7,
                    fontSize: { xs: "1rem", md: "1.0625rem" },
                  }}
                >
                  &ldquo;{current.tagline}&rdquo;
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "0.9375rem",
                  }}
                >
                  {current.name}, {current.role}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 260, md: "100%" },
              order: { xs: -1, md: 0 },
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={current.image}
                  alt={current.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Pagination: < current/total > */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            mt: 3,
          }}
        >
          <IconButton
            onClick={goPrev}
            aria-label={t("previousPost")}
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : COLORS.PURPLE_ALPHA_10 },
              "&:disabled": { opacity: 0.5 },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              minWidth: 48,
              textAlign: "center",
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              fontWeight: 500,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(94, 24, 233, 0.06)",
            }}
          >
            {currentIndex + 1}/{total}
          </Typography>
          <IconButton
            onClick={goNext}
            aria-label={t("nextPost")}
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : COLORS.PURPLE_ALPHA_10 },
              "&:disabled": { opacity: 0.5 },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default SuccessStories;
