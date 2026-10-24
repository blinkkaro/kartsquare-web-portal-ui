"use client";
import React from "react";
import { Box } from "@mui/material";
import { usePrefetchReels } from "@/hooks/usePosts";
import HeroSection from "./sections/HeroSection";
import CategoryGrid from "./sections/CategoryGrid";
import TopPros from "./sections/TopPros";
import WorkProof from "./sections/WorkProof";
import PopularInArea from "./sections/PopularInArea";
import WhyKartsquare from "./sections/WhyKartsquare";
import PartnerBanner from "./sections/PartnerBanner";
import FaqSection from "./sections/FaqSection";

/**
 * Services-first homepage (Claude design: hero mosaic, photo categories, trusted pros,
 * discover grid, popular-in-city, why, partner CTA). Every number, name and post comes from
 * the backend; sections with no data render nothing instead of placeholder content.
 * (TrustOrbit, AiAssist, NearbyMap, HowItWorks, CityBand and the older posts/stories/ads feed
 * components still live alongside but are no longer rendered here.)
 */
function HomeView() {
  // Prefetch reels data so it's ready when user navigates to Reels page
  usePrefetchReels();

  return (
    <Box sx={{ maxWidth: 1080, mx: { xs: -1, md: "auto" }, width: { xs: "calc(100% + 16px)", md: "100%" }, display: "flex", flexDirection: "column", pb: 2 }}>
      <HeroSection />
      <CategoryGrid />
      <TopPros />
      <WorkProof />
      <PopularInArea />
      <WhyKartsquare />
      <PartnerBanner />
      <FaqSection />
    </Box>
  );
}

export default HomeView;
