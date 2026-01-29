"use client";

import React from "react";
import { Box } from "@mui/material";
import Hero from "./components/Hero";
import Features from "./components/Features";
import SuccessStories from "./components/SuccessStories";
import FAQ from "./components/FAQ";
import Footer from "@/components/common/Footer";

const FreeListingView = () => {
  return (
    <Box>
      {/* Hero Section with Form */}
      <Hero />

      {/* 3 Step Process */}
      <Features />

      {/* Success Stories */}
      <SuccessStories />

      {/* FAQs */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default FreeListingView;
