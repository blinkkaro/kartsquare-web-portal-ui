"use client";

import React from "react";
import { Box } from "@mui/material";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useTranslate } from "@/hooks/useTranslate";
import type {
  DashboardAttention,
  DashboardProfile,
  ProviderDashboardChartResponse,
  ProviderDashboardResponse,
  stats as ProviderStats,
} from "@/services/providerDashboard/providerDashboard.interface";
import LatestLeads from "./components/LatestLeads";
import LatestReviews from "./components/LatestReviews";
import NeedsAttention from "./components/NeedsAttention";
import ProfileCompleteness from "./components/ProfileCompleteness";
import ProviderGreetingHero from "./components/ProviderGreetingHero";
import QuickActions from "./components/QuickActions";
import RevenueChart from "./components/RevenueChart";
import ShareKit from "./components/ShareKit";
import StatBento from "./components/StatBento";
import UpcomingBookings from "./components/UpcomingBookings";

interface ProviderDashboardLayoutProps {
  profile: DashboardProfile;
  attention?: DashboardAttention;
  stats?: ProviderStats;
  chartData?: ProviderDashboardChartResponse;
  upcomingBookings: ProviderDashboardResponse["upcoming_bookings"];
  latestReviews: ProviderDashboardResponse["latest_reviews"];
  hasError?: boolean;
  onToggleAvailability: (accepting: boolean) => void;
  isTogglingAvailability: boolean;
}

/**
 * The service-provider dashboard, laid out from props only, so the real page and a design preview
 * render exactly the same thing. Phone: one column in priority order. Desktop: 8 / 4 pairs.
 */
const ProviderDashboardLayout: React.FC<ProviderDashboardLayoutProps> = ({
  profile,
  attention,
  stats,
  chartData,
  upcomingBookings,
  latestReviews,
  hasError,
  onToggleAvailability,
  isTogglingAvailability,
}) => {
  const { t } = useTranslate();
  const profileOpen = profile.completeness.percent < 100;

  // Grid areas, so no column is left with a hole beside a taller neighbour.
  // Phone: one column in priority order. Desktop: the checklist spans the rows beside it.
  const xsAreas = [
    attention && "attn",
    profileOpen && "profile",
    stats && "stats",
    "chart",
    "upcoming",
    "leads",
    "reviews",
    "share",
  ]
    .filter(Boolean)
    .map((a) => `"${a}"`)
    .join(" ");
  const lgRows: string[] = [];
  if (profileOpen) {
    if (attention && stats) lgRows.push("attn profile", "stats profile");
    else if (attention) lgRows.push("attn profile");
    else if (stats) lgRows.push("stats profile");
    else lgRows.push("profile profile");
  } else {
    if (attention) lgRows.push("attn attn");
    if (stats) lgRows.push("stats stats");
  }
  lgRows.push("chart upcoming", "leads reviews", "share share");
  const lgAreas = lgRows.map((r) => `"${r}"`).join(" ");

  return (
    <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, mx: "auto", maxWidth: 1200 }}>
      <ErrorMessage isVisible={Boolean(hasError)} error={t("pd_dashboard_error")} />
      <ProviderGreetingHero
        profile={profile}
        onToggleAvailability={onToggleAvailability}
        isTogglingAvailability={isTogglingAvailability}
      />
      <QuickActions />
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 8fr) minmax(0, 4fr)" },
          gridTemplateAreas: { xs: xsAreas, lg: lgAreas },
        }}
      >
        {attention && (
          <Box sx={{ gridArea: "attn" }}>
            <NeedsAttention attention={attention} />
          </Box>
        )}
        {profileOpen && (
          <Box sx={{ gridArea: "profile" }}>
            <ProfileCompleteness completeness={profile.completeness} />
          </Box>
        )}
        {stats && (
          <Box sx={{ gridArea: "stats" }}>
            <StatBento stats={stats} />
          </Box>
        )}
        <Box sx={{ gridArea: "chart" }}>
          <RevenueChart chartData={chartData} />
        </Box>
        <Box sx={{ gridArea: "upcoming" }}>
          <UpcomingBookings bookings={upcomingBookings} role="SERVICE_PROVIDER" />
        </Box>
        <Box id="leads" sx={{ gridArea: "leads", scrollMarginTop: 96 }}>
          <LatestLeads />
        </Box>
        <Box sx={{ gridArea: "reviews" }}>
          <LatestReviews reviews={latestReviews} role="SERVICE_PROVIDER" />
        </Box>
        <Box sx={{ gridArea: "share" }}>
          <ShareKit username={profile.username} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderDashboardLayout;
