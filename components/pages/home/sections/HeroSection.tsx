"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, InputBase, Typography, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { COLORS } from "@/constants/colors";
import { getExampleQueries } from "@/constants/aiSearch";
import { useAppDispatch } from "@/store/hooks";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import LocationChip from "@/components/common/Ai/components/LocationChip";
import { HOME_PHOTOS } from "./homePhotos";
import TrendingRoller from "./TrendingRoller";

const TRENDING_COUNT = 4;
const HINT_MS = 2800;
const ORANGE = "#f97316";

const NO_MOTION = "@media (prefers-reduced-motion: reduce)";

/** Polaroid-style frame: white border, soft shadow, tilted. Lifts and straightens on hover. */
const frame = (rotate: number) =>
  ({
    position: "absolute",
    display: "block",
    overflow: "hidden",
    borderRadius: { xs: 3.5, md: 5 },
    border: { xs: "4px solid #fff", md: "6px solid #fff" },
    boxShadow: "0 18px 40px rgba(32,27,44,0.16)",
    bgcolor: COLORS.PURPLE_ALPHA_10,
    transform: `rotate(${rotate}deg)`,
    transition: "transform 320ms cubic-bezier(.2,.7,.2,1), box-shadow 320ms ease",
    "&:hover": { transform: "rotate(0deg) scale(1.03)", zIndex: 3, boxShadow: `0 24px 48px ${COLORS.PURPLE_ALPHA_30}` },
    "& img": { objectFit: "cover" },
    [NO_MOTION]: { transition: "none", "&:hover": { transform: `rotate(${rotate}deg)` } },
  }) as const;

const chip = {
  position: "absolute",
  zIndex: 4,
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  px: { xs: 1.1, md: 1.5 },
  py: { xs: 0.6, md: 0.85 },
  borderRadius: 99,
  bgcolor: "#fff",
  color: "#201b2c",
  fontSize: { xs: "0.68rem", md: "0.78rem" },
  fontWeight: 700,
  whiteSpace: "nowrap",
  boxShadow: "0 8px 22px rgba(32,27,44,0.14)",
  animation: "ksFloat 5s ease-in-out infinite",
  [NO_MOTION]: { animation: "none" },
} as const;

/** Decorative collage. Static, so it is memoised and never re-renders while the user types. */
const HeroCollage = memo(function HeroCollage() {
  const { electricianHero, bridalMakeup, homeCleaning } = HOME_PHOTOS;
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 220, sm: 360, md: 450 },
        mx: { xs: 1, md: 0 },
        "@keyframes ksFloat": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-7px)" } },
      }}
    >
      {/* soft shapes behind the photos */}
      <Box aria-hidden sx={{ position: "absolute", inset: "4% 6% 2% 4%", borderRadius: "46% 54% 52% 48% / 52% 46% 54% 48%", bgcolor: COLORS.PURPLE_ALPHA_10 }} />
      <Box aria-hidden sx={{ position: "absolute", top: "-2%", right: "-1%", width: { xs: 64, md: 96 }, height: { xs: 64, md: 96 }, borderRadius: "50%", bgcolor: "rgba(249,115,22,0.16)" }} />
      <Box aria-hidden sx={{ position: "absolute", bottom: "4%", left: "-2%", width: { xs: 70, md: 110 }, height: { xs: 70, md: 110 }, backgroundImage: `radial-gradient(${COLORS.PURPLE_ALPHA_30} 2px, transparent 2px)`, backgroundSize: "14px 14px" }} />

      <Box component={Link} href="/cus/servicesList" aria-label="Electrical repairs" sx={{ ...frame(-4), left: "2%", top: "8%", width: "50%", height: "80%" }}>
        <Image src={electricianHero.src} alt={electricianHero.alt} fill priority sizes="(max-width: 900px) 50vw, 270px" style={{ objectPosition: "40% 50%" }} />
      </Box>
      <Box component={Link} href="/cus/reels" aria-label="Watch bridal look reel" sx={{ ...frame(4), right: "3%", top: "0%", width: "40%", height: "54%" }}>
        <Image src={bridalMakeup.src} alt={bridalMakeup.alt} fill sizes="(max-width: 900px) 40vw, 220px" style={{ objectPosition: "50% 28%" }} />
        <Box sx={{ position: "absolute", left: 8, bottom: 8, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff", color: COLORS.PRIMARY_PURPLE }}>
          <PlayArrowRoundedIcon sx={{ fontSize: 19 }} />
        </Box>
      </Box>
      <Box component={Link} href="/cus/servicesList" aria-label="Deep cleaning" sx={{ ...frame(-2), right: "9%", bottom: "2%", width: "44%", height: "36%" }}>
        <Image src={homeCleaning.src} alt={homeCleaning.alt} fill sizes="(max-width: 900px) 44vw, 240px" />
      </Box>

      <Box sx={{ ...chip, left: { xs: "-2%", md: "-3%" }, top: { xs: "2%", md: "3%" }, color: COLORS.PRIMARY_PURPLE }}>
        <VerifiedRoundedIcon sx={{ fontSize: { xs: 15, md: 18 } }} />
        <Box component="span" sx={{ color: "#201b2c" }}>Approved providers</Box>
      </Box>
      <Box sx={{ ...chip, left: { xs: "4%", md: "2%" }, bottom: { xs: "2%", md: "4%" }, animationDelay: "-2.2s" }}>
        <TranslateRoundedIcon sx={{ fontSize: { xs: 15, md: 18 }, color: ORANGE }} />
        English · हिन्दी · Hinglish
      </Box>
    </Box>
  );
});

/** Hand-drawn underline that draws itself under the highlighted words. */
function Squiggle() {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      sx={{
        position: "absolute",
        left: 0,
        bottom: { xs: -6, md: -9 },
        width: "100%",
        height: { xs: 9, md: 13 },
        overflow: "visible",
        "@keyframes ksDraw": { to: { strokeDashoffset: 0 } },
        "& path": { strokeDasharray: 340, strokeDashoffset: 340, animation: "ksDraw 900ms 500ms cubic-bezier(.2,.7,.2,1) forwards" },
        [NO_MOTION]: { "& path": { animation: "none", strokeDashoffset: 0 } },
      }}
    >
      <path d="M2 9 C 30 2, 50 14, 80 7 S 130 2, 160 8 S 220 14, 250 6 S 285 4, 298 8" fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
    </Box>
  );
}

/**
 * Hero: where, what, go. The search box hands the sentence to the AI assistant,
 * which understands English / Hindi / Hinglish, symptoms and localities.
 */
export default function HeroSection() {
  const dark = useTheme().palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { location, setLocation, locateMe, locating, locateError } = useAILocation();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState(0);

  const examples = useMemo(() => getExampleQueries(location.city, location.locality), [location.city, location.locality]);
  const place = location.locality ? `${location.locality}, ${location.city}` : location.city;
  const lift = dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;

  // Rotating placeholder: pauses while the user is typing/focused, off for reduced motion.
  useEffect(() => {
    if (focused || query || examples.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setHint((h) => (h + 1) % examples.length), HINT_MS);
    return () => clearInterval(t);
  }, [focused, query, examples.length]);

  const ask = (text: string) => {
    const q = text.trim();
    if (q) dispatch(openAiWithQuery(q));
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.05fr) minmax(0, 1fr)" },
        alignItems: "center",
        gap: { xs: 2, md: 6 },
        px: { xs: 2, md: 5 },
        overflow: "clip",
        pt: { xs: 2, md: 5 },
        pb: { xs: 3, md: 8 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: { xs: "-8px 0 0", md: "-8px 0 0" },
          zIndex: -1,
          background: dark
            ? "none"
            : `radial-gradient(60% 55% at 8% 0%, ${COLORS.PURPLE_ALPHA_10}, transparent 70%), radial-gradient(45% 45% at 100% 100%, rgba(249,115,22,0.08), transparent 70%)`,
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: { xs: 1.5, md: 2 } }}>
          <LocationChip location={location} onChange={setLocation} onUseCurrent={() => locateMe()} locating={locating} error={locateError} />
        </Box>

        {/* H1 carries the primary keyword + city; the paragraph under it is a self-contained answer
            ("what is Kartsquare, who is it for, how does it work") written to be quoted by search
            snippets, voice assistants and AI answers. */}
        <Typography
          component="h1"
          data-speakable="headline"
          sx={{ fontSize: { xs: "clamp(26px, 7.4vw, 32px)", sm: "2.5rem", md: "3.2rem" }, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: { xs: 1.1, md: 1.08 }, maxWidth: 620 }}
        >
          Find the right local service in {location.city},{" "}
          <Box component="span" sx={{ position: "relative", display: "inline-block", color: lift }}>
            right when you need&nbsp;it.
            <Squiggle />
          </Box>
        </Typography>

        <Typography
          data-speakable="answer"
          sx={{ mt: { xs: 1.5, md: 3 }, color: "text.secondary", fontSize: { xs: "0.92rem", md: "1.05rem" }, lineHeight: 1.55, maxWidth: 540, display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: { xs: 3, sm: "unset" }, overflow: "hidden" }}
        >
          Kartsquare is a local services marketplace for {location.city}. Search AC repair, plumbers, electricians,
          photographers &amp; more in English, Hindi or Hinglish — then call or WhatsApp approved providers near {place} directly.
        </Typography>

        <Box
          component="form"
          role="search"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            ask(query);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: { xs: 2, md: 4 },
            p: { xs: 0.625, md: 0.875 },
            pl: { xs: 1.5, md: 2 },
            borderRadius: 4,
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: dark ? "rgba(130,72,247,0.35)" : COLORS.PURPLE_ALPHA_20,
            boxShadow: `0 1px 2px rgba(32,27,44,0.04), 0 12px 32px ${COLORS.PURPLE_ALPHA_10}`,
            transition: "border-color 160ms ease, box-shadow 160ms ease",
            "&:focus-within": { borderColor: COLORS.PRIMARY_PURPLE, boxShadow: `0 0 0 4px ${COLORS.PURPLE_ALPHA_10}` },
            [NO_MOTION]: { transition: "none" },
          }}
        >
          <SearchRoundedIcon sx={{ color: "text.secondary", display: { xs: "none", "@media (min-width:360px)": "block" } }} />
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Try: ${examples[hint % examples.length]}`}
            inputProps={{ "aria-label": "Describe what you need", enterKeyHint: "search", style: { fontSize: 16, textOverflow: "ellipsis" } }}
            sx={{ minHeight: { xs: 48, md: 52 }, pl: 0.5 }}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<AutoAwesomeRoundedIcon sx={{ display: { xs: "none", sm: "inline-block" } }} />}
            sx={{ minHeight: { xs: 48, md: 52 }, minWidth: 76, px: { xs: 1.5, sm: 2, md: 3 }, borderRadius: 3, textTransform: "none", fontWeight: 700, fontSize: "1rem", bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER }, flexShrink: 0 }}
          >
            Search
          </Button>
        </Box>

        <TrendingRoller suggestions={examples.slice(0, TRENDING_COUNT)} onPick={ask} />
      </Box>

      <HeroCollage />
    </Box>
  );
}
