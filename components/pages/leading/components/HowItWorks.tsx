"use client";

import React from "react";
import { Box, Typography, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getSteps } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const HowItWorks = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const steps = getSteps(t);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background accent */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          height: "60%",
          background: isDark
            ? "radial-gradient(ellipse, rgba(94, 24, 233, 0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(94, 24, 233, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionHeading
            title={t("showBestOfBusinessTitle")}
            subtitle={t("showBestOfBusinessSubtext")}
            variant="minimal"
            align="center"
          />
        </Box>

        {/* Horizontal journey: 3 steps with connectors */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "stretch" },
            justifyContent: "center",
            gap: { xs: 3, md: 2 },
            position: "relative",
          }}
        >
          {steps.map((item, index) => {
            const stepNum = String(index + 1).padStart(2, "0");
            const Icon = item.Icon;
            const subIcons = "subIcons" in item ? item.subIcons : null;

            return (
              <React.Fragment key={item.step}>
                {/* Connector arrow (between cards, desktop only) */}
                {index > 0 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      alignSelf: "center",
                      flexShrink: 0,
                      color: isDark ? COLORS.TEXT.SECONDARY_DARK : "rgba(94, 24, 233, 0.35)",
                      mx: -0.5,
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 28 }} />
                  </Box>
                )}

                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={cardVariants}
                  style={{ flex: "1 1 0", minWidth: 0 }}
                >
                  <Box sx={{ maxWidth: { xs: "none", md: 360 }, mx: "auto" }}>
                  <Box
                    sx={{
                      height: "100%",
                      position: "relative",
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 3,
                      border: "1px solid transparent",
                      background: isDark
                        ? `linear-gradient(${COLORS.BACKGROUND.PAPER_DARK}, ${COLORS.BACKGROUND.PAPER_DARK}) padding-box, linear-gradient(145deg, rgba(94,24,233,0.25), rgba(94,24,233,0.05)) border-box`
                        : "linear-gradient(#fff, #fff) padding-box, linear-gradient(145deg, rgba(94,24,233,0.35), rgba(94,24,233,0.08)) border-box",
                      backgroundOrigin: "border-box",
                      boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.06)",
                      transition: "transform 0.35s ease, box-shadow 0.35s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: isDark ? "none" : `0 20px 48px rgba(94, 24, 233, 0.12), 0 0 0 1px rgba(94, 24, 233, 0.08)`,
                      },
                    }}
                  >
                    {/* Large step number — watermark */}
                    <Typography
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 20,
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "4rem",
                        lineHeight: 1,
                        color: isDark ? "rgba(255,255,255,0.04)" : "rgba(94, 24, 233, 0.06)",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {stepNum}
                    </Typography>

                    {/* Icon pill */}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_HOVER} 100%)`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        boxShadow: `0 8px 24px ${PURPLE}40`,
                        "& .MuiSvgIcon-root": { fontSize: 28 },
                      }}
                    >
                      <Icon />
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "-0.02em",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        fontSize: "1.125rem",
                        lineHeight: 1.25,
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        lineHeight: 1.65,
                        fontSize: "0.875rem",
                        pr: 2,
                      }}
                    >
                      {item.desc}
                    </Typography>

                    {/* Sub-icons for Personalise step (e.g. place, store, schedule, photo) */}
                    {subIcons && subIcons.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                        }}
                      >
                        {subIcons.map((SubIcon: React.ElementType, i: number) => (
                          <Box
                            key={i}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1.5,
                              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(94, 24, 233, 0.08)",
                              color: PURPLE,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "& .MuiSvgIcon-root": { fontSize: 18 },
                            }}
                          >
                            <SubIcon />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                  </Box>
                </motion.div>
              </React.Fragment>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
