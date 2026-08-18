"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, Grid, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { getFreeListingBenefits } from "./constants";
import SectionHeading from "./SectionHeading";

export default function ConnectWithCustomersSection() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Track viewport visibility — only run the auto-step interval when visible
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const benefits = getFreeListingBenefits(t) || [];
  const steps = [
    {
      title: t("yourFreeListingPage"),
      desc: benefits[0] || "Get a free profile so customers can find and call you",
    },
    {
      title: t("oneProfileMoreVisibility"),
      desc: benefits[1] || "Show up when people nearby search for what you offer",
    },
    {
      title: t("completeBusinessProfile"),
      desc: benefits[2] || "Connect seamlessly and drive more engagement online",
    },
  ];

  // Watch viewport entry — only start the interval when section is visible.
  // This avoids running setInterval during initial page load (section is below fold).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-play steps — only when section is visible AND not paused by hover
  useEffect(() => {
    if (!isInViewport || isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isInViewport, steps.length]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Box sx={{ mb: { xs: 5, md: 8 } }}>
            <SectionHeading
              title={t("connectWithCustomersTitle")}
              subtitle={t("connectWithCustomersSubtext")}
              variant="accent"
              align="center"
            />
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 6, md: 4, lg: 6 }} alignItems="center" justifyContent="center">
          {/* Left Side: Steps List */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 4 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {steps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Box
                      onClick={() => setActiveStep(index)}
                      sx={{
                        display: "flex",
                        gap: 2.5,
                        cursor: "pointer",
                        opacity: isActive ? 1 : 0.4,
                        transition: "opacity 0.3s ease",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {/* Circle Indicator */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: isActive
                            ? isDark ? "#fff" : "#111"
                            : "transparent",
                          border: `2px solid ${isActive ? (isDark ? "#fff" : "#111") : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")}`,
                          color: isActive ? (isDark ? "#000" : "#fff") : (isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT),
                          transition: "all 0.3s ease",
                        }}
                      >
                        {isActive ? (
                          <CheckIcon sx={{ fontSize: 20, fontWeight: "bold" }} />
                        ) : (
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {index + 1}
                          </Typography>
                        )}
                      </Box>

                      {/* Text content */}
                      <Box sx={{ pt: 0.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            lineHeight: 1.2,
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            lineHeight: 1.5,
                            fontSize: "0.9375rem"
                          }}
                        >
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Grid>

          {/* Right Side: Image/Visual */}
          <Grid size={{ xs: 12, md: 7, lg: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Box
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, sm: 400, md: 450, lg: 550 },
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
                  boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.08)",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ width: "100%", height: "100%", position: "relative" }}
                  >
                    <Image
                      src="/businessProfile.png"
                      alt="Business Profile"
                      fill
                      style={{ objectFit: "contain", objectPosition: "center top" }}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
