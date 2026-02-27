"use client";

import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import Hero from "./components/Hero";
import TakeChargeSection from "./components/TakeChargeSection";
import ConnectWithCustomersSection from "./components/ConnectWithCustomersSection";
import ShowWhatYouOfferSection from "./components/ShowWhatYouOfferSection";
import SuccessStories from "./components/SuccessStories";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import ScrollReveal from "./components/ScrollReveal";
import BenefitsSection from "./components/BenefitsSection";
import { COLORS } from "@/constants/colors";
import { SECTION_IDS } from "./components/sectionIds";

function ListingView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expandedFaq, setExpandedFaq] = useState<string | false>("faq0");

  const handleFaqChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  const sectionBorder = isDark
    ? `1px solid ${COLORS.BORDER.DEFAULT_DARK}`
    : "1px solid rgba(94, 24, 233, 0.06)";

  return (
    <Box
      sx={{
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
        minHeight: "100vh",
        pb: 0,
        overflowX: "hidden",
      }}
    >
      {/* 1. Hero — CTA target for all section buttons */}
      <Box component="section" id={SECTION_IDS.HERO}>
        <Hero />
      </Box>

      {/* New: Benefits Section for Providers & Suppliers */}
      <Box component="section" id="benefits" sx={{ borderTop: sectionBorder }}>
        <BenefitsSection />
      </Box>

      {/* 2. Take charge */}
      <Box component="section" id={SECTION_IDS.TAKE_CHARGE} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeLeft" delay={0}>
          <TakeChargeSection />
        </ScrollReveal>
      </Box>

      {/* 3. Easily connect */}
      <Box component="section" id={SECTION_IDS.CONNECT} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <ConnectWithCustomersSection />
        </ScrollReveal>
      </Box>

      {/* 4. Show what you offer */}
      <Box component="section" id={SECTION_IDS.SHOW_WHAT_YOU_OFFER} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeLeft" delay={0}>
          <ShowWhatYouOfferSection />
        </ScrollReveal>
      </Box>

      {/* 5. What success looks like */}
      <Box component="section" id={SECTION_IDS.SUCCESS_STORIES} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <SuccessStories />
        </ScrollReveal>
      </Box>

      {/* 6. How it works */}
      <Box component="section" id={SECTION_IDS.HOW_IT_WORKS} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeLeft" delay={0}>
          <HowItWorks />
        </ScrollReveal>
      </Box>

      {/* 7. FAQ */}
      <Box component="section" id={SECTION_IDS.FAQ} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <FAQ expandedFaq={expandedFaq} handleFaqChange={handleFaqChange} />
        </ScrollReveal>
      </Box>
    </Box>
  );
}

export default ListingView;
