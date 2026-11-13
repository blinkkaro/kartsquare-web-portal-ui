"use client";
import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "@/constants/colors";
import NewHeroSection from "./sections/NewHeroSection";
import ServiceMarquee from "./sections/ServiceMarquee";
import { HomeLoadingBar } from "./sections/HomeLoading";
import NewCategoryGrid from "./sections/NewCategoryGrid";
import NewTopPros from "./sections/NewTopPros";
import { HOME_GUTTER, HOME_MAX_WIDTH } from "./sections/shared";
import NewDiscoverSection from "./sections/NewDiscoverSection";
import NewPopularInArea from "./sections/NewPopularInArea";
import PartnerBanner from "./sections/PartnerBanner";
import FaqSection from "./sections/FaqSection";

const GUTTER = HOME_GUTTER;

function HomeView() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Full-width violet hero band. It clips its own glows, so nothing can cause sideways scroll; the
          negative margin cancels the shell's 16px gap under the header. */}
      <Box
        sx={{
          mt: -2,
          position: "relative",
          color: COLORS.WHITE,
          background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PURPLE_HOVER} 55%, ${COLORS.PRIMARY_PURPLE} 100%)`,
          overflow: "hidden",
        }}
      >
        <HomeLoadingBar />
        <Box sx={{ maxWidth: HOME_MAX_WIDTH, mx: "auto", width: "100%", px: GUTTER }}>
          <NewHeroSection />
          <ServiceMarquee />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: HOME_MAX_WIDTH,
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          px: GUTTER,
          pt: { xs: 1, md: 2 },
          pb: 0,
          overflowX: "clip", // clip (not hidden) so position: sticky children keep working
        }}
      >
        <NewCategoryGrid />
      </Box>

      {/* A full-width violet band of its own: it draws itself and renders nothing when there is nothing to show. */}
      <NewTopPros />

      <Box
        sx={{
          maxWidth: HOME_MAX_WIDTH,
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          px: GUTTER,
          pt: 0,
          pb: 4,
          overflowX: "clip", // clip (not hidden) so position: sticky children keep working
        }}
      >
        <NewDiscoverSection />
        <NewPopularInArea />
        <PartnerBanner />
        <FaqSection />
      </Box>
    </Box>
  );
}

export default HomeView;
