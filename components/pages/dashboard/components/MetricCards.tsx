"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import {
  TrendingUp,
  People,
  AttachMoney,
  Event,
  ShoppingBag,
  Inventory,
  Message,
  Handshake,
  Store,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isDark?: boolean;
  isHighlighted?: boolean;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  isDark = false,
  isHighlighted = false,
  trend,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        bgcolor: isHighlighted
          ? COLORS.BLACK
          : isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.WHITE,
        border: `1px solid ${
          isHighlighted
            ? "transparent"
            : isDark
              ? COLORS.BORDER.DEFAULT_DARK
              : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        boxShadow: isHighlighted
          ? "0px 4px 20px rgba(94, 24, 233, 0.3)"
          : isDark
            ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
            : "0px 2px 8px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isHighlighted
            ? "0px 6px 24px rgba(94, 24, 233, 0.4)"
            : isDark
              ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
              : "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "8px",
                bgcolor: isHighlighted
                  ? "rgba(255, 255, 255, 0.2)"
                  : isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.PURPLE_ALPHA_10,
                color: isHighlighted ? COLORS.WHITE : COLORS.PRIMARY_PURPLE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: isHighlighted
                    ? "rgba(255, 255, 255, 0.8)"
                    : isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  fontSize: "0.875rem",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: isHighlighted
                    ? COLORS.WHITE
                    : isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
          {trend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: trend.isPositive
                  ? COLORS.SUCCESS_GREEN
                  : "#ef4444",
              }}
            >
              <TrendingUp
                sx={{
                  fontSize: 16,
                  transform: trend.isPositive ? "none" : "rotate(180deg)",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {trend.value}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const MetricCards: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  // Mock data - will be replaced with API data
  const metrics = [
    {
      title: t("salesGrowth"),
      value: "+2.05%",
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("followers"),
      value: "4086",
      icon: <People sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("totalEarnings"),
      value: "₹10.5k",
      icon: <AttachMoney sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalActiveEvents"),
      value: "05",
      icon: <Event sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalActiveServices"),
      value: "469",
      icon: <ShoppingBag sx={{ fontSize: 24 }} />,
    },
  ];

  return (
    <Box>
      
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid
            size={{ xs: 6, sm: 3, md: 3, lg: 3 }}
            key={index}
          >
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              isDark={isDark}
              isHighlighted={metric.isHighlighted}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricCards;
