"use client";

import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { secureStorage } from "@/helper/SecureStorage";
import { getUserRole } from "@/utils/auth";
import MetricCards from "./components/MetricCards";
import RevenueChart from "./components/RevenueChart";
import UpcomingBookings from "./components/UpcomingBookings";
import UpcomingEvents from "./components/UpcomingEvents";
import RecentTransactions from "./components/RecentTransactions";
import ReviewCard from "./components/ReviewCard";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import BookingStatusCard from "@/components/common/BookingStatusCard";
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
    return (
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <Typography variant="h4">
          Error: {(error as any).data.message}
        </Typography>
      </Box>
    );
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
            <MetricCards stats={providerDashboardData?.stats!} />

            {/* Revenue Chart */}
            <RevenueChart chartData={providerDashboardChartData} />
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Upcoming Bookings */}
            {/* <UpcomingBookings bookings={providerDashboardData?.upcoming_bookings || []} /> */}

            {providerDashboardData?.upcoming_bookings &&
              providerDashboardData.upcoming_bookings.length > 0 && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    p: 2,
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.WHITE,
                    border: `1px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : COLORS.BORDER.DEFAULT_LIGHT
                    }`,
                    boxShadow: isDark
                      ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
                      : "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      {t("upcomingBookings")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.PRIMARY_PURPLE,
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => router.push("/spr/bookings")}
                    >
                      {t("seeall")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {providerDashboardData.upcoming_bookings.map((booking) => (
                      <BookingStatusCard
                        key={booking.booking_id}
                        booking={{
                          booking_id: booking.booking_id,
                          currency: booking.currency,
                          name: booking.service_name,
                          image: booking.image_urls[0] || "",
                          status: booking.status,
                          price: booking.price,
                          time: booking.schedule_at,
                          service_address: booking.service_address
                        }}
                        isProvider={true}
                        showStatus={false}
                      />
                    ))}
                  </Box>
                </Box>
              )}

            {/* Latest Review */}
            {providerDashboardData?.latest_reviews &&
              providerDashboardData.latest_reviews.length > 0 && (
                <Card
                  sx={{
                    borderRadius: "12px",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.WHITE,
                    border: `1px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : COLORS.BORDER.DEFAULT_LIGHT
                    }`,
                    boxShadow: isDark
                      ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
                      : "0px 2px 8px rgba(0, 0, 0, 0.05)",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t("latestReviews")}
                  </Typography>
                  {providerDashboardData.latest_reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </Card>
              )}

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
