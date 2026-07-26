"use client";

import React, { useEffect, useState } from "react";
import { Box, Card, CardActionArea, CardContent, Grid, Typography, useTheme } from "@mui/material";
import { Campaign } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { secureStorage } from "@/helper/SecureStorage";
import { getUserRole } from "@/utils/auth";
import MetricCards from "./components/MetricCards";
import RevenueChart from "./components/RevenueChart";
import UpcomingBookings from "./components/UpcomingBookings";
import LatestReviews from "./components/LatestReviews"; // Add this
import LatestLeads from "./components/LatestLeads";
import UpcomingEvents from "./components/UpcomingEvents";
import RecentTransactions from "./components/RecentTransactions";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { useSupplierDashboard } from "@/hooks/useSupplierDashboard";
import ProviderBookingDetailsDrawer from "../provider/bookings/ProviderBookingDetailsDrawer";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import PageHeading from "@/components/common/PageHeading";

function DashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const role = getUserRole();

  const {
    providerDashboardData,
    providerDashboardChartData,
    isLoading: isProviderLoading,
    error: providerError,
  } = useProviderDashboard(role === "SERVICE_PROVIDER");

  const {
    supplierDashboardData,
    supplierDashboardChartData,
    isLoading: isSupplierLoading,
    error: supplierError,
  } = useSupplierDashboard(role === "SUPPLIER");

  const isLoading = role === "SUPPLIER" ? isSupplierLoading : isProviderLoading;
  const error = role === "SUPPLIER" ? supplierError : providerError;

  // Check if user is SERVICE_PROVIDER or SUPPLIER
  useEffect(() => {
    const userRole = getUserRole();
    const token = secureStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userRole !== "SERVICE_PROVIDER" && userRole !== "SUPPLIER") {
      router.push("/");
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <CenteredLoader
        minHeight="400px"
        showText={true}
      />
    );
  }

  if (error) {
    console.error("Dashboard Error:", error);
    // return (
    //   <Box sx={{ py: { xs: 2, md: 3 } }}>
    //     <Typography variant="h4">
    //       Error: {(error as any).data.message}
    //     </Typography>
    //   </Box>
    // );
  }

  const stats =
    role === "SUPPLIER"
      ? supplierDashboardData?.stats
      : providerDashboardData?.stats;
  const chartData =
    role === "SUPPLIER"
      ? supplierDashboardChartData
      : providerDashboardChartData;
  const upcomingData =
    role === "SUPPLIER"
      ? supplierDashboardData?.pending_enquiries
      : providerDashboardData?.upcoming_bookings;
  const latestReviews =
    role === "SUPPLIER"
      ? supplierDashboardData?.latest_reviews
      : providerDashboardData?.latest_reviews;

  return (
    <Box sx={{ py: { xs: 2, md: 3 }, mx: { xs: 2, md: 3, lg: 10, xl: 20 } }}>
      {/* Header row: Title + Tools */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <PageHeading title={t("dashboard")} sx={{ mb: 0 }} />

        {/* Quick Tools Strip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              mr: 1,
              display: { xs: "none", md: "block" },
            }}
          >
            Tools
          </Typography>

          {/* Marketing Tools Chip */}
          <Box
            onClick={() =>
              router.push(
                role === "SUPPLIER"
                  ? "/spr/marketing-tools"
                  : "/spr/marketing-tools"
              )
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: "999px",
              border: `1px solid ${isDark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)"}`,
              background: isDark
                ? "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.12) 100%)"
                : "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 100%)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                background: isDark
                  ? "linear-gradient(135deg, rgba(99,102,241,0.28) 0%, rgba(168,85,247,0.2) 100%)"
                  : "linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(168,85,247,0.1) 100%)",
                boxShadow: "0 4px 16px rgba(99,102,241,0.2)",
              },
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Campaign sx={{ color: "#fff", fontSize: 15 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                fontSize: "0.82rem",
                whiteSpace: "nowrap",
              }}
            >
              Marketing Tools
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Metric Cards */}
            <MetricCards
              stats={
                stats || {
                  total_bookings: 0,
                  followers: 0,
                  total_services: 0,
                  total_active_services: 0,
                  total_pending_bookings: 0,
                  total_completed_bookings: 0,
                  total_phone_number_views: 0,
                  total_profile_views: 0,
                  total_enquiries: 0,
                  total_active_products: 0,
                  total_pending_enquiries: 0,
                  total_completed_enquiries: 0,
                }
              }
              role={role as any}
            />

            {/* Revenue Chart */}
            <RevenueChart chartData={chartData} />

            {/* Latest Leads - Only for Service Providers since Suppliers have enquiries */}
            <LatestLeads />
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Upcoming Bookings / Enquiries */}
            <UpcomingBookings
              bookings={upcomingData || []}
              role={role as any}
            />

            {/* Latest Review */}
            <LatestReviews reviews={latestReviews || []} role={role as any} />

            {/* Upcoming Events
            <UpcomingEvents /> */}

            {/* Recent Transactions
            <RecentTransactions /> */}
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
}

export default DashboardView;
