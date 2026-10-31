"use client";
import React from "react";
import { Box } from "@mui/material";
import { usePrefetchReels } from "@/hooks/usePosts";
import NewHeroSection from "./sections/NewHeroSection";
import NewCategoryGrid from "./sections/NewCategoryGrid";
import NewTopPros from "./sections/NewTopPros";
import NewDiscoverSection from "./sections/NewDiscoverSection";
import NewPopularInArea from "./sections/NewPopularInArea";
import PartnerBanner from "./sections/PartnerBanner";
import FaqSection from "./sections/FaqSection";

/**
 * HomeView matching Claude Artifact Redesign:
 * 1. NewHeroSection (Heading, search bar, trending tags, interactive photo collage)
 * 2. NewCategoryGrid (4 featured image cards + icon categories with dummy data fallback)
 * 3. NewTopPros (Verified pros with View profile & Enquire buttons, rating, price, dummy fallback)
 * 4. NewDiscoverSection (Explore badge, category tabs, masonry cards with reel badges and dummy fallback)
 * 5. NewPopularInArea (Popular in City + Why Kartsquare benefits grid)
 * 6. PartnerBanner (Grow your business supply-side CTA)
 * 7. FaqSection (Frequently asked questions accordion)
 */
function HomeView() {
  // Prefetch reels data so it's ready when user navigates to Reels page
  usePrefetchReels();

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        px: { xs: 1.5, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
        pb: 4,
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
