"use client";
import React from "react";
import { Box } from "@mui/material";
import { usePrefetchReels } from "@/hooks/usePosts";
import HeroSection from "./sections/HeroSection";
import TrustOrbit from "./sections/TrustOrbit";
import CategoryGrid from "./sections/CategoryGrid";
import HowItWorks from "./sections/HowItWorks";
import TopPros from "./sections/TopPros";
import NearbyMap from "./sections/NearbyMap";
import AiAssist from "./sections/AiAssist";
import WorkProof from "./sections/WorkProof";
import PartnerBanner from "./sections/PartnerBanner";
import CityBand from "./sections/CityBand";
import FaqSection from "./sections/FaqSection";

/**
 * Services-first homepage. Every number, name and image on it comes from the
 * backend; sections with no data render nothing instead of placeholder content.
 * (The previous posts/stories/ads feed components still live in ./components.)
 */
function HomeView() {
  // Prefetch reels data so it's ready when user navigates to Reels page
  usePrefetchReels();

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto", width: "100%", display: "flex", flexDirection: "column", pb: 2 }}>
      <HeroSection />
      <TrustOrbit />
      <CategoryGrid />
      <AiAssist />
      <TopPros />
      <NearbyMap />
      <HowItWorks />
      <WorkProof />
      <PartnerBanner />
      <CityBand />
      <FaqSection />
    </Box>
  );
}

export default HomeView;
