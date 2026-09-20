"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { COLORS } from "@/constants/colors";
import { Section, sectionEyebrowSx, sectionTitleSx, sectionSubtitleSx } from "./shared";

const STEPS = [
  { icon: ManageSearchRoundedIcon, title: "Describe what you need", body: "Search, pick a category, or just type the problem — \"AC thanda nahi kar raha\" works.", from: "#6d28d9", to: "#a78bfa" },
  { icon: CompareArrowsRoundedIcon, title: "Compare nearby providers", body: "See approved providers for that exact service, with real ratings and reviews where they exist.", from: "#e11d74", to: "#fb7ab0" },
  { icon: SupportAgentRoundedIcon, title: "Contact and book", body: "Open a profile, then call, WhatsApp or book directly with the provider.", from: "#0d9488", to: "#5eead4" },
] as const;

export default function HowItWorks() {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Section sx={{ pt: { xs: 3, md: 4 } }}>
      <Box sx={{ textAlign: "center", maxWidth: 520, mx: "auto", mb: 3 }}>
        <Typography sx={{ ...sectionEyebrowSx, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
          Simple as 1-2-3
        </Typography>
        <Typography component="h2" sx={sectionTitleSx}>
          How Kartsquare works
        </Typography>
        <Typography sx={sectionSubtitleSx}>
          From problem to provider in three steps.
        </Typography>
      </Box>

      <Box sx={{ position: "relative", display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: { xs: 0, md: 3 } }}>
        {/* connector line (desktop) */}
        <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: 34, left: "16.6%", right: "16.6%", height: 2, background: `repeating-linear-gradient(90deg, ${COLORS.PURPLE_ALPHA_30} 0 8px, transparent 8px 16px)` }} />
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Box key={s.title} sx={{ position: "relative", display: "flex", flexDirection: { xs: "row", md: "column" }, alignItems: { xs: "flex-start", md: "center" }, textAlign: { xs: "left", md: "center" }, gap: { xs: 2, md: 1.5 }, pb: { xs: 3, md: 0 } }}>
              {/* vertical rail (mobile) */}
              {i < STEPS.length - 1 && (
                <Box sx={{ display: { xs: "block", md: "none" }, position: "absolute", left: 33, top: 70, bottom: 4, width: 2, background: `repeating-linear-gradient(180deg, ${COLORS.PURPLE_ALPHA_30} 0 6px, transparent 6px 12px)` }} />
              )}
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Box sx={{ width: 68, height: 68, borderRadius: 4.5, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: `linear-gradient(135deg, ${s.from}, ${s.to})`, boxShadow: `0 14px 28px ${s.from}44` }}>
                  <Icon sx={{ fontSize: 32 }} />
                </Box>
                <Box sx={{ position: "absolute", top: -8, right: -8, width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, bgcolor: "background.paper", color: s.from, border: `2px solid ${s.from}` }}>
                  {i + 1}
                </Box>
              </Box>
              <Box sx={{ pt: { xs: 0.5, md: 0 } }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.25 }}>{s.title}</Typography>
                <Typography sx={{ fontSize: "0.83rem", color: "text.secondary", mt: 0.5, lineHeight: 1.55, maxWidth: 320 }}>{s.body}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
