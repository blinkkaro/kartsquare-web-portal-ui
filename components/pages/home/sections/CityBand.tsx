"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getCityTheme } from "@/constants/cityTheme";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import JaipurSkyline from "./JaipurSkyline";
import { Section } from "./shared";

/** Closing brand moment. Renders only for cities that have a theme (Jaipur today). */
export default function CityBand() {
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  const city = getCityTheme(location.city);
  if (!city.nickname) return null;
  const [a, b] = city.accent;
  return (
    <Section>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
          px: { xs: 2.5, md: 5 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 12, md: 13 },
          textAlign: "center",
          background: dark
            ? `linear-gradient(135deg, ${b}33, ${a}26), ${"#171422"}`
            : `linear-gradient(135deg, #fff1f6, #f5ecff)`,
          border: "1px solid",
          borderColor: dark ? `${a}44` : `${a}88`,
        }}
      >
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: dark ? "#ffc2d6" : "#be185d" }}>
          {city.nicknameLocal ? `${city.nicknameLocal} · ` : ""}
          {city.nickname}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: { xs: "1.3rem", md: "1.8rem" }, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {location.city} mein kaam ho, bina bhaag-daud ke.
        </Typography>
        <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.9rem" }}>
          Find, compare and contact local providers — all from one place.
        </Typography>
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <JaipurSkyline color={dark ? a : "#e0578a"} opacity={dark ? 0.3 : 0.28} height={92} />
        </Box>
      </Box>
    </Section>
  );
}
