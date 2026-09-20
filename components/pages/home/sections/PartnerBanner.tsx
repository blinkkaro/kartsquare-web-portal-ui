"use client";
import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionTitleSx } from "./shared";

/** Supply-side entry point. No earnings/commission claims: none are backed by product data. */
export default function PartnerBanner() {
  const router = useRouter();
  const dark = useTheme().palette.mode === "dark";
  const lift = dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;
  const { location } = useAILocation();
  return (
    <Section>
      <Box
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" }, gap: 2, p: { xs: 2.25, md: 3 }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 5 }}
      >
        <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: lift }}>
          <HandshakeRoundedIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: lift }}>Partner with us</Typography>
          <Typography component="h2" sx={{ ...sectionTitleSx, mt: 0.25 }}>Offer a service in {location.city}?</Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mt: 0.5 }}>
            List your business on Kartsquare and get discovered by customers searching for exactly what you do.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={() => router.push("/business-listing")}
          sx={{ minHeight: 48, px: 3, borderRadius: 3, textTransform: "none", fontWeight: 700, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}
        >
          List your business
        </Button>
      </Box>
    </Section>
  );
}
