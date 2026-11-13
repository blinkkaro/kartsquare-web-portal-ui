"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { COLORS } from "@/constants/colors";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import CompactMapView from "../components/CompactMapView";
import { Section, sectionEyebrowSx, sectionTitleSx, sectionSubtitleSx } from "./shared";

/** Live map of real providers/stores (existing map component, unchanged). */
export default function NearbyMap() {
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  return (
    <Section id="nearby" sx={{ pt: { xs: 3, md: 4 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box>
          <Typography sx={{ ...sectionEyebrowSx, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
            On the map
          </Typography>
          <Typography component="h2" sx={sectionTitleSx}>
            Providers around {location.city}
          </Typography>
          <Typography sx={sectionSubtitleSx}>Tap a pin to see who&apos;s nearby.</Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "inline-flex" }, alignItems: "center", gap: 0.5, px: 1.5, py: 0.75, borderRadius: 99, bgcolor: COLORS.PURPLE_ALPHA_10, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE, fontWeight: 700, fontSize: "0.78rem" }}>
          <PlaceRoundedIcon sx={{ fontSize: 16 }} /> Live locations
        </Box>
      </Box>
      <Box sx={{ borderRadius: 5, overflow: "hidden", border: "1px solid", borderColor: "divider", boxShadow: "0 12px 32px rgba(94,24,233,0.08)" }}>
        <CompactMapView height="280px" />
      </Box>
    </Section>
  );
}
