"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { secureStorage } from "@/helper/SecureStorage";
import { getUserRole } from "@/utils/auth";
import MetricCards from "./components/MetricCards";
import RevenueChart from "./components/RevenueChart";
import UpcomingBookings from "./components/UpcomingBookings";
import LatestReviews from "./components/LatestReviews"; // Add this
import UpcomingEvents from "./components/UpcomingEvents";
import RecentTransactions from "./components/RecentTransactions";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import ProviderBookingDetailsDrawer from "../provider/bookings/ProviderBookingDetailsDrawer";

function DashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const {
    providerDashboardData,
    providerDashboardChartData,
    isLoading,
    error,
  } = useProviderDashboard();

  // Check if user is SERVICE_PROVIDER
  useEffect(() => {
    const role = getUserRole();
    const token = secureStorage.getItem("token");

    if (!token) {
      router.push("/selectRole");
      return;
    }

    if (role !== "SERVICE_PROVIDER") {
      router.push("/");
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Typography variant="h4">{t("loading")}</Typography>
      </Box>
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

  return (
    <Box sx={{ py: { xs: 2, md: 3 }, mx: { xs: 2, md: 3, lg: 10, xl: 20 } }}>
      {/* Dashboard Title */}
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          fontWeight: 600,
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          mb: { xs: 3, md: 4 },
        }}
      >
        {t("dashboard")}
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Metric Cards */}
            <MetricCards
              stats={
                providerDashboardData?.stats || {
                  total_bookings: 0,
                  followers: 0,
                  total_services: 0,
                  total_active_services: 0,
                  total_pending_bookings: 0,
                  total_completed_bookings: 0,
                }
              }
            />

            {/* Revenue Chart */}
            <RevenueChart chartData={providerDashboardChartData} />
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Upcoming Bookings */}
            {/* Upcoming Bookings */}
            <UpcomingBookings
              bookings={providerDashboardData?.upcoming_bookings || []}
            />

            {/* Latest Review */}
            <LatestReviews
              reviews={providerDashboardData?.latest_reviews || []}
            />

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
