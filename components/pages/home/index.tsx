"use client";
import React from "react";
import { Box } from "@mui/material";
import NewHeroSection from "./sections/NewHeroSection";
import NewCategoryGrid from "./sections/NewCategoryGrid";
import NewTopPros from "./sections/NewTopPros";
import NewDiscoverSection from "./sections/NewDiscoverSection";
import NewPopularInArea from "./sections/NewPopularInArea";
import PartnerBanner from "./sections/PartnerBanner";
import FaqSection from "./sections/FaqSection";

function HomeView() {
  return (
    <Box
      sx={{
        maxWidth: 1680,
        mx: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        px: { xs: 1.5, sm: 2, md: 2.25, lg: 2.5, xl: 3 },
        pb: 4,
        overflowX: "hidden",
      }}
    >
      <NewHeroSection />
      <NewCategoryGrid />
      <NewTopPros />
      <NewDiscoverSection />
      <NewPopularInArea />
      <PartnerBanner />
      <FaqSection />
    </Box>
  );
}

export default HomeView;
