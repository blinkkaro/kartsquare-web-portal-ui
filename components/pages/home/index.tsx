"use client";
import React from "react";
import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import NearbyExpertsSection from "./components/NearbyExpertsSection";
import TopRatedExpertsSection from "./components/TopRatedExpertsSection";
import ReelsPreviewSection from "./components/ReelsPreviewSection";

function HomeView() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 4, md: 5 },
        mt: { xs: 0, sm: 0, md: -2, lg: -2 },
      }}
    >
      <HeroSection />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: { xs: 4, md: 3 },
        }}
      >
        <Box sx={{ flex: { md: "1 1 40%" }, minWidth: 0, width: "100%" }}>
          <NearbyExpertsSection />
        </Box>
        <Box sx={{ flex: { md: "1 1 60%" }, minWidth: 0, width: "100%" }}>
          <TopRatedExpertsSection />
        </Box>
      </Box>
      <ReelsPreviewSection />
    </Box>
  );
}

export default HomeView;
