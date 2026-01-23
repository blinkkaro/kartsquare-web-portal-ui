"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  ShoppingBag,
  LocalShipping,
  Security,
  Star,
  TrendingUp,
  Category,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import NavLogo from "@/components/common/Nav/components/NavLogo";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const StoreView: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Target date: March 1st of current or next year
  const getTargetDate = (): Date => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const targetDate = new Date(currentYear, 2, 1); // March is month 2 (0-indexed)
    
    // If March 1st has already passed this year, set it for next year
    if (targetDate < now) {
      return new Date(currentYear + 1, 2, 1);
    }
    
    return targetDate;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = getTargetDate();

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <ShoppingBag />,
      title: t("wideSelection"),
      description: t("wideSelectionDesc"),
      color: COLORS.PRIMARY_PURPLE,
    },
    {
      icon: <LocalShipping />,
      title: t("fastDelivery"),
      description: t("fastDeliveryDesc"),
      color: "#00B2FF",
    },
    {
      icon: <Security />,
      title: t("securePayment"),
      description: t("securePaymentDesc"),
      color: "#79adff",
    },
    {
      icon: <Star />,
      title: t("qualityProducts"),
      description: t("qualityProductsDesc"),
      color: "#9cc2dd",
    },
    {
      icon: <TrendingUp />,
      title: t("bestPrices"),
      description: t("bestPricesDesc"),
      color: COLORS.PRIMARY_PURPLE,
    },
    {
      icon: <Category />,
      title: t("multipleCategories"),
      description: t("multipleCategoriesDesc"),
      color: "#00B2FF",
    },
  ];

  const CountdownBox: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      key={value}
    >
      <Card
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
          borderRadius: 3,
          minWidth: { xs: 70, sm: 100 },
          textAlign: "center",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}40`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00B2FF 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            {String(value).padStart(2, "0")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 600,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {label}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Hero Section with Logo */}
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 6, md: 10 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          <NavLogo isMobile={false} mode={isDark ? "dark" : "light"} />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00B2FF 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            {t("storeComingSoon")}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.7,
              mb: 6,
            }}
          >
            {t("storeComingSoonDescription")}
          </Typography>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box
            sx={{
              mb: 6,
              display: "flex",
              justifyContent: "center",
              gap: { xs: 1.5, sm: 2, md: 3 },
              flexWrap: "wrap",
            }}
          >
            <CountdownBox value={timeLeft.days} label={t("days")} />
            <CountdownBox value={timeLeft.hours} label={t("hours")} />
            <CountdownBox value={timeLeft.minutes} label={t("minutes")} />
            <CountdownBox value={timeLeft.seconds} label={t("seconds")} />
          </Box>
        </motion.div>

        {/* Launch Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : COLORS.PURPLE_ALPHA_10,
              border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: COLORS.PRIMARY_PURPLE,
              }}
            >
              {t("launchingOn")} {getTargetDate().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("whatToExpect")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 5,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            {t("storeFeaturesSubtitle")}
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PAPER_LIGHT,
                    border: `2px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : "transparent"
                    }`,
                    borderRadius: 3,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${feature.color}, ${COLORS.PRIMARY_PURPLE})`,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.4s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px -10px ${feature.color}40`,
                      borderColor: feature.color,
                      "&::before": {
                        transform: "scaleX(1)",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: `${feature.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: feature.color,
                        "& svg": {
                          fontSize: "2rem",
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: isDark
              ? COLORS.BACKGROUND.SECONDARY_DARK
              : COLORS.PURPLE_ALPHA_10,
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}08 0%, #00B2FF08 100%)`,
              zIndex: 0,
            },
            textAlign: "center",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 700,
                mb: 2,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("stayTuned")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                lineHeight: 1.8,
                maxWidth: "700px",
                mx: "auto",
              }}
            >
              {t("storeStayTunedDescription")}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default StoreView;
