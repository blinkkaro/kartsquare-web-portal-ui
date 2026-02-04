import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
  keyframes,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getSteps } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const STEP_ACCENTS = [
  COLORS.PRIMARY_PURPLE,
  "#7c3aed",
  "#6366f1",
  COLORS.PRIMARY_BLUE,
];

const STEP_INTERVAL_MS = 2000;

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(94, 24, 233, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(94, 24, 233, 0); }
  100% { box-shadow: 0 0 0 0 rgba(94, 24, 233, 0); }
`;

const HowItWorks = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const steps = getSteps(t);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white",
        position: "relative",
        overflow: "hidden",
        "&::before": isDark
          ? {}
          : {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(180deg, rgba(94, 24, 233, 0.03) 0%, transparent 100%)",
            pointerEvents: "none",
          },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
            // maxWidth: 600,
            // mx: "auto",
          }}
          gap={2}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              mb: 2,
              px: 2,
              py: 0.75,
              borderRadius: "999px",
              bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "rgba(94, 24, 233, 0.08)",
              border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.15)"}`,
            }}
          >
            {[0, 1, 2, 3].map((n) => {
              const isDotCompleted = n < activeStep;
              const isDotActive = n === activeStep;
              return (
                <Box
                  key={n}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: isDotCompleted
                      ? COLORS.SUCCESS_GREEN
                      : isDotActive
                        ? COLORS.PRIMARY_PURPLE
                        : "rgba(94, 24, 233, 0.3)",
                    transform: isDotActive ? "scale(1.2)" : "scale(1)",
                    transition: "background-color 0.4s ease, transform 0.3s ease",
                    boxShadow: isDotActive && !isDark
                      ? "0 0 0 3px rgba(94, 24, 233, 0.2)"
                      : isDotCompleted && !isDark
                        ? "0 0 0 2px rgba(51, 207, 77, 0.25)"
                        : "none",
                  }}
                />
              );
            })}
            <Typography
              variant="caption"
              fontWeight={700}
              color={COLORS.PRIMARY_PURPLE}
              sx={{ ml: 0.5, letterSpacing: 0.5 }}
            >
              {t("howItWorks")}
            </Typography>
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {t("getFreeListingSteps")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            sx={{ mt: 1.5, lineHeight: 1.6 }}
          >
            {t("takesLessThanMinutes")}
          </Typography>
        </Box>

        {/* Steps row: horizontal on desktop, stacked on mobile */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "stretch" },
            justifyContent: "center",
            gap: { xs: 0, md: 1 },
            position: "relative",
          }}
        >
          {/* Stepper track — behind circles (desktop). Muted full-width line. */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 32,
              left: "12%",
              right: "12%",
              height: 4,
              borderRadius: 2,
              bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)",
              zIndex: 0,
            }}
          />
          {/* Progress fill — green for completed segments (through ticks), purple for current */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 32,
              left: "12%",
              width: `${(76 * (activeStep + 1)) / 4}%`,
              height: 4,
              borderRadius: 2,
              background:
                activeStep === 0
                  ? COLORS.PRIMARY_PURPLE
                  : `linear-gradient(90deg, ${COLORS.SUCCESS_GREEN} 0%, ${COLORS.SUCCESS_GREEN} ${(activeStep / (activeStep + 1)) * 100}%, ${STEP_ACCENTS[activeStep] || COLORS.PRIMARY_PURPLE} ${(activeStep / (activeStep + 1)) * 100}%, ${STEP_ACCENTS[activeStep] || COLORS.PRIMARY_PURPLE} 100%)`,
              zIndex: 1,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease",
            }}
          />

          {steps.map((item, index) => {
            const accent = STEP_ACCENTS[index] || COLORS.PRIMARY_PURPLE;
            const isLast = index === steps.length - 1;
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            const isUpcoming = index > activeStep;

            return (
              <Box
                key={item.step}
                sx={{
                  flex: { md: "1 1 0" },
                  minWidth: 0,
                  maxWidth: { md: 260 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { md: "center" },
                  position: "relative",
                  zIndex: 2,
                  mb: { xs: isLast ? 0 : 4, md: 0 },
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  opacity: isUpcoming ? 0.75 : 1,
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {/* Step number + icon row — fixed height so line aligns */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "center" },
                    gap: 2,
                    mb: 2,
                    height: 64,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: isCompleted
                        ? COLORS.SUCCESS_GREEN + "22"
                        : isDark
                          ? "rgba(94, 24, 233, 0.15)"
                          : "white",
                      color: isCompleted ? COLORS.SUCCESS_GREEN : accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: isCompleted ? "1.75rem" : "1.5rem",
                      border: `3px solid ${isCompleted ? COLORS.SUCCESS_GREEN : accent}`,
                      boxShadow: isActive && !isDark
                        ? `0 4px 24px ${accent}40`
                        : isDark
                          ? "none"
                          : `0 4px 20px ${accent}20`,
                      animation: isActive ? `${pulseRing} 2s ease-in-out infinite` : "none",
                      transition: "border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon sx={{ fontSize: 36 }} />
                    ) : (
                      item.step
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${isActive
                        ? accent
                        : isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : "rgba(94, 24, 233, 0.12)"
                        }`,
                      transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                      boxShadow: isActive && !isDark ? `0 0 0 2px ${accent}30` : "none",
                    }}
                  >
                    {item.subIcons ? (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {item.subIcons.slice(0, 3).map((Icon: React.ComponentType<{ sx?: object }>, i: number) => (
                          <Icon
                            key={i}
                            sx={{
                              fontSize: 20,
                              color: isCompleted ? COLORS.SUCCESS_GREEN : accent,
                              opacity: isUpcoming ? 0.6 : 0.9,
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <item.Icon
                        sx={{
                          fontSize: 28,
                          color: isCompleted ? COLORS.SUCCESS_GREEN : accent,
                          opacity: isUpcoming ? 0.7 : 1,
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Card — flex 1 so all cards same height in row */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: { md: 1 },
                    display: "flex",
                    flexDirection: "column",
                    minHeight: { md: 140 },
                    p: { xs: 2.5, md: 2.5 },
                    borderRadius: 3,
                    border: `1px solid ${isActive
                      ? accent
                      : isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : "rgba(94, 24, 233, 0.1)"
                      }`,
                    borderLeft: `4px solid ${isCompleted ? COLORS.SUCCESS_GREEN : accent}`,
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                    boxShadow: isActive && !isDark
                      ? `0 8px 32px ${accent}30`
                      : isDark
                        ? "none"
                        : "0 4px 24px rgba(94, 24, 233, 0.06)",
                    transition: "all 0.4s ease",
                    textAlign: { xs: "left", md: "center" },
                    "&:hover": {
                      borderColor: accent,
                      boxShadow: isDark
                        ? "none"
                        : `0 12px 32px ${accent}25`,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {isCompleted && (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                        color: COLORS.SUCCESS_GREEN,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Done
                    </Box>
                  )}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                      fontSize: "1.0625rem",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
                    sx={{ lineHeight: 1.65 }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>

                {/* Arrow between steps — mobile only */}
                {!isLast && (
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "center",
                      mt: 2,
                      mb: -2,
                    }}
                  >
                    <ExpandMoreIcon
                      sx={{
                        fontSize: 28,
                        color: index < activeStep ? COLORS.SUCCESS_GREEN : COLORS.PRIMARY_PURPLE,
                        opacity: index <= activeStep ? 1 : 0.5,
                        transition: "color 0.4s ease",
                      }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
