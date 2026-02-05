import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  keyframes,
} from "@mui/material";
import { getSteps } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const HowItWorks = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const steps = getSteps(t);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#fafbff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 5, md: 7 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: COLORS.PRIMARY_PURPLE,
              fontWeight: 700,
              letterSpacing: 1.5,
              display: "block",
              mb: 1,
            }}
          >
            {t("howItWorks")}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.3,
              maxWidth: 420,
              mx: "auto",
            }}
          >
            {t("getFreeListingSteps")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              lineHeight: 1.6,
            }}
          >
            {t("takesLessThanMinutes")}
          </Typography>
        </Box>

        {/* Steps */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 3, md: 2 },
            position: "relative",
          }}
        >
          {steps.map((item, index) => {
            const Icon = item.Icon;
            return (
              <Box
                key={item.step}
                sx={{
                  position: "relative",
                  animation: mounted
                    ? `${fadeUp} 0.5s ease-out ${0.1 + index * 0.08}s both`
                    : "none",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: { xs: 2.5, md: 2 },
                    borderRadius: 3,
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                    border: `1px solid ${isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : "rgba(94, 24, 233, 0.08)"
                      }`,
                    boxShadow: isDark
                      ? "none"
                      : "0 2px 12px rgba(94, 24, 233, 0.04)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                      borderColor: isDark
                        ? COLORS.PURPLE_ALPHA_10
                        : "rgba(94, 24, 233, 0.18)",
                      boxShadow: isDark
                        ? "none"
                        : "0 8px 24px rgba(94, 24, 233, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Step number + icon */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: isDark
                        ? COLORS.PURPLE_ALPHA_10
                        : "rgba(94, 24, 233, 0.06)",
                      border: `2px solid ${isDark
                          ? "rgba(94, 24, 233, 0.3)"
                          : "rgba(94, 24, 233, 0.15)"
                        }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 26,
                        color: COLORS.PRIMARY_PURPLE,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      color: COLORS.PRIMARY_PURPLE,
                      letterSpacing: 0.5,
                      mb: 0.5,
                    }}
                  >
                    {t("step")} {item.step}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                      fontSize: "1rem",
                      lineHeight: 1.35,
                      mb: 0.75,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      lineHeight: 1.6,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
