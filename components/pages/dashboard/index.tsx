"use client";

import React, { useEffect } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
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

function DashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

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

  return (
    <Box sx={{ py: { xs: 2, md: 3 } }}>
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
            <MetricCards />

            {/* Revenue Chart */}
            <RevenueChart />
          </Box>
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Upcoming Bookings */}
            <UpcomingBookings />

            {/* Upcoming Events */}
            <UpcomingEvents />

            {/* Recent Transactions */}
            <RecentTransactions />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardView;
