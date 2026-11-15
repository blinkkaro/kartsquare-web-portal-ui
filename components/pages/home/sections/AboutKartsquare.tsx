"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { COLORS } from "@/constants/colors";
import { Section, sectionEyebrowSx, SectionTitle } from "./shared";

// Swap this file for a real photo (keep the path, or update it here). SVG is served as-is.
const ABOUT_IMAGE = "/images/home/about-kartsquare-placeholder.svg";

// Every point describes behaviour the product has today (see the FAQ comment in FaqSection).
const POINTS = [
  "Search in English, Hindi or Hinglish and see approved providers near you",
  "Read real customer reviews, or “No reviews yet” when there are none",
  "Call or WhatsApp the provider directly from the listing",
] as const;

const ctaBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  borderRadius: 3,
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 700,
} as const;

/** Brand section: what Kartsquare is, in plain keyword-bearing copy, next to an app-in-hand image. */
export default function AboutKartsquare() {
  return (
    <Section id="about-kartsquare" sx={{ pb: { xs: 3, md: 6 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" },
          alignItems: "center",
          gap: { xs: 3, md: 6 },
          borderRadius: { xs: 5, md: 7 },
          bgcolor: COLORS.PURPLE_ALPHA_04,
          border: "1px solid",
          borderColor: "divider",
          px: { xs: 2, sm: 3.5, md: 6 },
          py: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Box sx={{ order: { xs: 2, md: 1 } }}>
          <Typography sx={{ ...sectionEyebrowSx, color: COLORS.PRIMARY_PURPLE }}>About Kartsquare</Typography>
          <SectionTitle sx={{ mt: 1 }}>Your local services app for Jaipur</SectionTitle>
          <Typography sx={{ mt: 2, fontSize: { xs: "0.95rem", md: "1.02rem" }, lineHeight: 1.65, color: "text.secondary" }}>
            Kartsquare is a local services marketplace that helps you find and contact trusted professionals in Jaipur,
            from AC repair, plumbers and electricians to photographers, salons and home cleaning. Compare approved
            providers, check their work and reviews, and get in touch directly, all in one place.
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: { xs: "0.95rem", md: "1.02rem" }, lineHeight: 1.65, color: "text.secondary" }}>
            Service providers get a free profile to showcase their work and reach customers nearby.
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 2.5, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
            {POINTS.map((p) => (
              <Box key={p} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, fontSize: "0.92rem" }}>
                <CheckRoundedIcon sx={{ fontSize: 19, mt: "2px", color: COLORS.PRIMARY_PURPLE, flexShrink: 0 }} />
                {p}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mt: 3.5 }}>
            <Box
              component={Link}
              href="/explore-services"
              sx={{
                ...ctaBase,
                px: 3,
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: "#fff",
                transition: "background-color 160ms ease, transform 120ms ease",
                "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              Explore services
            </Box>
            <Box
              component={Link}
              href="/about-us"
              sx={{
                ...ctaBase,
                px: 2.5,
                color: COLORS.PRIMARY_PURPLE,
                boxShadow: `inset 0 0 0 1px ${COLORS.PURPLE_ALPHA_30}`,
                transition: "background-color 160ms ease, transform 120ms ease",
                "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              Learn more about us
            </Box>
          </Box>
        </Box>

        <Box sx={{ order: { xs: 1, md: 2 }, position: "relative", mx: "auto", width: "100%", maxWidth: { xs: 320, md: 420 }, aspectRatio: "480 / 560" }}>
          <Image
            src={ABOUT_IMAGE}
            alt="A woman holding a phone with the Kartsquare local services app open"
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 900px) 320px, 420px"
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Section>
  );
}
