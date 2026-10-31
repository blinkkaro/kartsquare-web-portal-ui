"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { COLORS } from "@/constants/colors";
import { PANEL_PX, Section, SectionTitle } from "./shared";
import { HOME_PHOTOS } from "./homePhotos";

const BENEFITS = [
  "Post photos, reels and before-and-after work",
  "Receive enquiries from people nearby",
  "A shareable mini-website for your business",
] as const;

const ctaBase = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 50, borderRadius: 3, textDecoration: "none", fontSize: "0.95rem" } as const;

/** Supply-side entry point (deep-violet split card from the design). No earnings/commission claims: none are backed by product data. */
export default function PartnerBanner() {
  const { barber } = HOME_PHOTOS;
  return (
    <Section sx={{ pb: { xs: 3, md: 8 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.15fr) minmax(0, 1fr)" },
          borderRadius: { xs: 5, md: 7 },
          overflow: "hidden",
          bgcolor: COLORS.PURPLE_HOVER,
          color: "#fff",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 3.5, md: 5 }, py: { xs: 3, sm: 4, md: 6 } }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d8c8ff" }}>For business owners</Typography>
          <SectionTitle light sx={{ mt: 1.5, color: "#fff" }}>Grow your business with Kartsquare</SectionTitle>
          <Typography sx={{ mt: 2.5, maxWidth: 440, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.55, color: "#e2d8f7" }}>
            Showcase your work, connect with local customers, and build your online presence.
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 3, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {BENEFITS.map((b) => (
              <Box key={b} component="li" sx={{ display: "flex", alignItems: "center", gap: 1.25, fontSize: "0.92rem" }}>
                <CheckRoundedIcon sx={{ fontSize: 19, color: "#c4b5fd", flexShrink: 0 }} />
                {b}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mt: 4 }}>
            <Box
              component={Link}
              href="/business-listing"
              sx={{
                ...ctaBase,
                px: 3,
                bgcolor: "#fff",
                color: COLORS.PURPLE_HOVER,
                fontWeight: 800,
                transition: "background-color 160ms ease, transform 120ms ease",
                "&:hover": { bgcolor: "#f3eeff" },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              List your business
            </Box>
            <Box
              component={Link}
              href="/about-us"
              sx={{
                ...ctaBase,
                px: 2.5,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
                color: "#fff",
                fontWeight: 600,
                transition: "background-color 160ms ease, transform 120ms ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              How it works
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: "relative", display: { xs: "none", md: "block" }, minHeight: 440 }}>
          <Image src={barber.src} alt={barber.alt} fill loading="lazy" sizes="(max-width: 1080px) 45vw, 480px" style={{ objectFit: "cover" }} />
        </Box>
      </Box>
    </Section>
  );
}
