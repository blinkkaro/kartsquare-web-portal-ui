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
  Group,
  BookOnline,
  Inventory,
  EventAvailable,
  PendingActions,
  AssignmentTurnedIn,
  Person,
  Call,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { ProviderDashboardResponse } from "@/services/providerDashboard/providerDashboard.interface";
import { SupplierDashboardResponse } from "@/services/supplierDashboard/supplierDashoard.interface";

interface MetricCardProps {
  title: string;
  value: string | number;
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
          ? isDark
            ? COLORS.BLACK
            : COLORS.BACKGROUND.SECONDARY_DARK
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
          ? "0px 4px 20px rgba(94, 24, 233, 0.16)"
          : isDark
            ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
            : "0px 2px 8px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isHighlighted
            ? "0px 6px 24px rgba(94, 24, 233, 0.03)"
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
                color: trend.isPositive ? COLORS.SUCCESS_GREEN : "#ef4444",
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

interface MetricCardsProps {
  stats:
    | ProviderDashboardResponse["stats"]
    | SupplierDashboardResponse["stats"];
  role?: "SERVICE_PROVIDER" | "SUPPLIER";
}

const MetricCards: React.FC<MetricCardsProps> = ({
  stats,
  role = "SERVICE_PROVIDER",
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const providerStats = stats as ProviderDashboardResponse["stats"];
  const supplierStats = stats as SupplierDashboardResponse["stats"];

  const providerMetrics = [
    {
      title: t("totalBookings"),
      value: providerStats?.total_bookings || 0,
      icon: <BookOnline sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("followers"),
      value: providerStats?.followers || 0,
      icon: <Group sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("totalServices"),
      value: providerStats?.total_services || 0,
      icon: <Inventory sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalActiveServices"),
      value: providerStats?.total_active_services || 0,
      icon: <EventAvailable sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalPendingBookings"),
      value: providerStats?.total_pending_bookings || 0,
      icon: <PendingActions sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalCompletedBookings"),
      value: providerStats?.total_completed_bookings || 0,
      icon: <AssignmentTurnedIn sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalPhoneNumberViews"),
      value: providerStats?.total_phone_number_views || 0,
      icon: <Call sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalProfileViews"),
      value: providerStats?.total_profile_views || 0,
      icon: <Person sx={{ fontSize: 24 }} />,
    },
  ];

  const supplierMetrics = [
    {
      title: t("totalEnquiries" as any),
      value: supplierStats?.total_enquiries || 0,
      icon: <BookOnline sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("followers"),
      value: supplierStats?.followers || 0,
      icon: <Group sx={{ fontSize: 24 }} />,
      isHighlighted: true,
    },
    {
      title: t("totalActiveProducts" as any),
      value: supplierStats?.total_active_products || 0,
      icon: <Inventory sx={{ fontSize: 24 }} />,
    },
    {
      title: t("pendingEnquiries" as any),
      value: supplierStats?.total_pending_enquiries || 0,
      icon: <PendingActions sx={{ fontSize: 24 }} />,
    },
    {
      title: t("completedEnquiries" as any),
      value: supplierStats?.total_completed_enquiries || 0,
      icon: <AssignmentTurnedIn sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalPhoneNumberViews"),
      value: supplierStats?.total_phone_number_views || 0,
      icon: <Call sx={{ fontSize: 24 }} />,
    },
    {
      title: t("totalProfileViews"),
      value: supplierStats?.total_profile_views || 0,
      icon: <Person sx={{ fontSize: 24 }} />,
    },
  ];

  const metrics = role === "SUPPLIER" ? supplierMetrics : providerMetrics;

  return (
    <Box>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 6, sm: 3, md: 3, lg: 3 }} key={index}>
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
