"use client";

import React, { useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import Hero from "./components/Hero";
import SuccessStories from "./components/SuccessStories";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import FAQ from "./components/FAQ";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

function ListingView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expandedFaq, setExpandedFaq] = useState<string | false>("faq0");

  const handleFaqChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT,
        minHeight: "100vh",
        pb: 0,
      }}
    >
      

      {/* Hero — Register your business */}
      <Hero />

      {/* Why register — Benefits first for conversion */}
      <Benefits />

      {/* How it works — Clear steps */}
      <HowItWorks />

      {/* Social proof */}
      <SuccessStories />

      {/* FAQ */}
      <FAQ expandedFaq={expandedFaq} handleFaqChange={handleFaqChange} />
    </Box>
  );
}

export default ListingView;
