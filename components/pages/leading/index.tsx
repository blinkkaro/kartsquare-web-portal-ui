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
import BottomCTASection from "./components/BottomCTASection";
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
      {/* 1. Hero — Initial hook + Form */}
      <Box component="section" id={SECTION_IDS.HERO}>
        <Hero />
      </Box>

      {/* 2. Success Stories — Build trust early with social proof */}
      <Box component="section" id={SECTION_IDS.SUCCESS_STORIES} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <SuccessStories />
        </ScrollReveal>
      </Box>

      {/* 3. How It Works - Simple process */}
      <Box component="section" id={SECTION_IDS.HOW_IT_WORKS} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeLeft" delay={0}>
          <HowItWorks />
        </ScrollReveal>
      </Box>

      {/* 4. Benefits - Value Proposition before diving into features */}
      {/* <Box component="section" id={SECTION_IDS.BENEFITS} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <BenefitsSection />
        </ScrollReveal>
      </Box> */}

      {/* 5. Show What You Offer - Feature deep dive */}
      <Box component="section" id={SECTION_IDS.SHOW_WHAT_YOU_OFFER} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeLeft" delay={0}>
          <ShowWhatYouOfferSection />
        </ScrollReveal>
      </Box>

      {/* 5. Take Charge - Feature deep dive */}


      {/* 6. Easily connect - Benefits */}
      <Box component="section" id={SECTION_IDS.CONNECT} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <ConnectWithCustomersSection />
        </ScrollReveal>
      </Box>

      {/* 7. Bottom CTA - Second chance form before FAQ */}
      <Box component="section" id="bottom-cta" sx={{ borderTop: sectionBorder }}>
        <BottomCTASection />
      </Box>

      {/* 8. FAQ - Overcoming final objections */}
      <Box component="section" id={SECTION_IDS.FAQ} sx={{ borderTop: sectionBorder }}>
        <ScrollReveal variant="fadeRight" delay={0}>
          <FAQ expandedFaq={expandedFaq} handleFaqChange={handleFaqChange} />
        </ScrollReveal>
      </Box>
    </Box>
  );
}

export default ListingView;
