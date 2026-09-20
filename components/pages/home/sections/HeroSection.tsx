"use client";
import React, { useMemo, useState } from "react";
import { Box, Button, Chip, InputBase, Typography, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { COLORS } from "@/constants/colors";
import { getExampleQueries } from "@/constants/aiSearch";
import { getCityTheme } from "@/constants/cityTheme";
import { useAppDispatch } from "@/store/hooks";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import LocationChip from "@/components/common/Ai/components/LocationChip";
import Marquee from "./Marquee";
import JaipurSkyline from "./JaipurSkyline";

/**
 * Hero: where, what, go. The search box hands the sentence to the AI assistant,
 * which understands English / Hindi / Hinglish, symptoms and localities.
 * City personality (nickname, caption, skyline, glow) comes from cityTheme.
 */
export default function HeroSection() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { location, setLocation, locateMe, locating, locateError } = useAILocation();
  const [query, setQuery] = useState("");

  const city = getCityTheme(location.city);
  const examples = useMemo(() => getExampleQueries(location.city, location.locality), [location.city, location.locality]);
  const place = location.locality ? `${location.locality}, ${location.city}` : location.city;
  const [accentA, accentB] = city.accent;

  const ask = (text: string) => {
    const q = text.trim();
    if (q) dispatch(openAiWithQuery(q));
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "0 0 28px 28px", md: 5 },
        mx: { xs: -1, md: 0 },
        px: { xs: 2.5, md: 6 },
        pt: { xs: 2.5, md: 5 },
        pb: { xs: 11, md: 13 },
        background: dark
          ? `radial-gradient(110% 80% at 0% 0%, ${accentB}44 0%, transparent 60%), radial-gradient(90% 70% at 100% 100%, ${accentA}33 0%, transparent 60%), ${COLORS.BACKGROUND.PAPER_DARK}`
          : `radial-gradient(110% 80% at 0% 0%, ${accentB}33 0%, transparent 60%), radial-gradient(90% 70% at 100% 100%, ${accentA}44 0%, transparent 60%), linear-gradient(180deg, #fff7fb 0%, #ffffff 100%)`,
      }}
    >
      {/* Decorative skyline sits behind everything, anchored to the bottom edge */}
      {city.nickname && (
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <JaipurSkyline color={dark ? accentA : "#e0578a"} opacity={dark ? 0.28 : 0.22} height={96} />
        </Box>
      )}

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1.75 }}>
          <LocationChip
            location={location}
            onChange={setLocation}
            onUseCurrent={() => locateMe()}
            locating={locating}
            error={locateError}
          />
        </Box>

        {/* H1 carries the primary keyword + city; the paragraph under the caption is a
            self-contained answer ("what is Kartsquare, who is it for, how does it work")
            written to be quoted by search snippets, voice assistants and AI answers. */}
        <Typography
          component="h1"
          data-speakable="headline"
          sx={{ fontSize: { xs: "1.85rem", md: "2.7rem" }, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.12 }}
        >
          Find local services in {location.city}.
          <Box
            component="span"
            sx={{
              display: "block",
              backgroundImage: `linear-gradient(90deg, ${dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE}, ${dark ? accentA : "#d6336c"})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bas problem batao.
          </Box>
        </Typography>

        {city.caption && (
          <Typography sx={{ mt: 1, fontSize: { xs: "0.95rem", md: "1.05rem" }, fontWeight: 700, color: dark ? "#ffc2d6" : "#be185d" }}>
            {city.caption}
          </Typography>
        )}
        <Typography
          data-speakable="answer"
          sx={{ mt: 0.75, mb: 2.5, color: "text.secondary", fontSize: { xs: "0.88rem", md: "1rem" }, maxWidth: 580 }}
        >
          Kartsquare is a local services marketplace for {location.city}. Search AC repair, plumbers, electricians,
          photographers &amp; more in English, Hindi or Hinglish — then call or WhatsApp approved providers near {place} directly.
        </Typography>

        <Box
          component="form"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            ask(query);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 0.75,
            pl: 2,
            borderRadius: 4,
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: dark ? "rgba(130,72,247,0.35)" : "#ecd9e6",
            boxShadow: `0 12px 32px ${dark ? "rgba(0,0,0,0.4)" : "rgba(190,24,93,0.12)"}`,
            transition: "border-color 160ms ease, box-shadow 160ms ease",
            "&:focus-within": { borderColor: COLORS.PRIMARY_PURPLE, boxShadow: `0 0 0 4px ${COLORS.PURPLE_ALPHA_10}` },
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <SearchRoundedIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Try: ${examples[0]}`}
            inputProps={{ "aria-label": "Describe what you need", enterKeyHint: "search", style: { fontSize: 16 } }}
            sx={{ minHeight: 44 }}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ minHeight: 44, px: 2.25, borderRadius: 3, textTransform: "none", fontWeight: 700, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER }, flexShrink: 0 }}
          >
            Find
          </Button>
        </Box>

        {/* Try-these prompts: auto-scrolling, pauses on touch/hover */}
        <Box sx={{ mt: 1.75 }}>
          <Marquee label="Example searches" duration={34}>
            {[...examples, "Bathroom ka pipe leak ho raha hai", `Bridal makeup in ${location.city}`].map((ex) => (
              <Chip
                key={ex}
                label={ex}
                clickable
                onClick={() => ask(ex)}
                icon={<AutoAwesomeRoundedIcon sx={{ fontSize: "15px !important" }} />}
                sx={{
                  height: 38,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  bgcolor: "background.paper",
                  color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                  border: `1px solid ${COLORS.PURPLE_ALPHA_20}`,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            ))}
          </Marquee>
        </Box>

      </Box>
    </Box>
  );
}
