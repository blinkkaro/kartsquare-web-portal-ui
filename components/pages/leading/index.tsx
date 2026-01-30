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
import { COLORS } from "../../../constants/colors";

function ListingView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const [mobile, setMobile] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | false>("faq0");

  const handleFaqChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedFaq(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* Breadcrumb */}
      <Container maxWidth="xl">
        <Typography
          variant="body2"
          color={
            theme.palette.mode === "dark"
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT
          }
          sx={{ py: 2 }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            {t("home")}
          </Link>
          {" / "}
          <Box
            component="span"
            fontWeight={600}
            color={
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT
            }
          >
            {t("listYourBusiness")}
          </Box>
        </Typography>
      </Container>

      {/* Hero Section — Business-owner friendly */}
      <Hero
        mobile={mobile}
        setMobile={setMobile}
        termsChecked={termsChecked}
        setTermsChecked={setTermsChecked}
      />

      {/* Success Stories — Relatable */}
      <SuccessStories />

      {/* 3 Simple Steps — Easy to understand */}
      <HowItWorks />

      {/* Why list with us + Get more visibility */}
      <Benefits />

      {/* FAQ — Easy to scan */}
      <FAQ expandedFaq={expandedFaq} handleFaqChange={handleFaqChange} />
    </Box>
  );
}

export default ListingView;
