"use client";
import React, { useState, useMemo } from "react";
import { Box, Typography, InputBase, Chip, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/constants/colors";
import { useAppDispatch } from "@/store/hooks";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

const TRENDING = ["AC servicing", "Deep cleaning", "Plumber", "Electrician", "Bridal makeup"];

/** Dummy images for the hero collage (used when no API images exist). */
const HERO_IMAGES = [
  { src: "/images/home/electrician-hero.jpg", alt: "Electrician in hard hat working", label: null, span: "tall" },
  { src: "/images/home/bridal-makeup.jpg", alt: "Bride with traditional makeup", label: "Reel · Bridal look", span: "normal" },
  { src: "/images/home/home-cleaning.jpg", alt: "Person mopping a bright living room", label: "Deep cleaning", span: "normal" },
];

export default function NewHeroSection() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: categories } = useCategories();

  const trendingTags = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.slice(0, 5).map((c) => c.name);
    }
    return TRENDING;
  }, [categories]);

  const search = (text: string) => {
    const q = text.trim();
    if (q) {
      router.push(`/cus/servicesList?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/cus/servicesList`);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 1, sm: 1.5, md: 2.5 },
        pb: { xs: 2.5, sm: 3.5, md: 5 },
        px: 0,
      }}
    >
      {/* Hero content grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(0,1.1fr)" }, gap: { xs: 3, sm: 3.5, md: 5 }, alignItems: "center" }}>
        {/* Left: heading + search */}
        <Box>
          <Typography
            component="h1"
            data-speakable="headline"
            sx={{
              fontSize: { xs: "1.65rem", sm: "2.1rem", md: "2.5rem", lg: "2.85rem", xl: "3.2rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            Find the right local service,{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.PRIMARY_PURPLE,
              }}
            >
              right when you need it
            </Box>
          </Typography>

          <Typography
            data-speakable="answer"
            sx={{
              fontSize: { xs: "0.92rem", md: "1.05rem", lg: "1.1rem" },
              color: "text.secondary",
              lineHeight: 1.55,
              maxWidth: { xs: "100%", sm: 500, md: 540, lg: 580 },
              mb: 3,
            }}
          >
            Discover local professionals, explore their work and connect with businesses near you.
          </Typography>

          {/* Search box */}
          <Box
            component="form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              search(query);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: "4px 4px 4px 16px",
              borderRadius: "16px",
              bgcolor: "background.paper",
              border: "1.5px solid",
              borderColor: dark ? "rgba(130,72,247,0.25)" : "#e8e4ed",
              boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.06)",
              transition: "border-color 160ms ease, box-shadow 160ms ease",
              "&:focus-within": { borderColor: COLORS.PRIMARY_PURPLE, boxShadow: `0 0 0 4px ${COLORS.PURPLE_ALPHA_10}` },
              maxWidth: { xs: "100%", sm: 520, md: 560, lg: 600 },
            }}
          >
            <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 22 }} />
            <InputBase
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "deep cleaning"'
              inputProps={{ "aria-label": "Search for a service", enterKeyHint: "search", style: { fontSize: 15 } }}
              sx={{ minHeight: 44 }}
            />
            <Box
              component="button"
              type="submit"
              sx={{
                all: "unset",
                cursor: "pointer",
                minHeight: 44,
                px: 2.5,
                borderRadius: "12px",
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 0,
                transition: "background-color 160ms ease",
                "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
              }}
            >
              Search
            </Box>
          </Box>

          {/* Trending tags */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "text.secondary" }}>Trending:</Typography>
            {trendingTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => search(tag)}
                sx={{
                  height: 30,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  bgcolor: dark ? "rgba(130,72,247,0.12)" : COLORS.PURPLE_ALPHA_04,
                  color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                  border: "none",
                  "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Right: Photo collage grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: {
              xs: "170px 140px",
              sm: "190px 160px",
              md: "220px 200px",
              lg: "245px 220px",
              xl: "270px 245px",
            },
            gap: { xs: 1.25, md: 1.5 },
          }}
        >
          {/* Large left image - spans 2 rows */}
          <Box
            onClick={() => router.push("/cus/servicesList?search=electrician")}
            sx={{
              gridRow: "1 / 3",
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              backgroundImage: `url(${HERO_IMAGES[0].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: dark ? "#2a2535" : "#f0edf5",
              cursor: "pointer",
              transition: "transform 250ms ease, box-shadow 250ms ease",
              "&:hover": { transform: "scale(1.015)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
            }}
          >
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)" }} />
            {/* Bottom overlay card */}
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: COLORS.PURPLE_ALPHA_10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BoltRoundedIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a1a1a", lineHeight: 1.2 }}>Electrical repairs</Typography>
                <Typography sx={{ fontSize: "0.74rem", color: "#666", lineHeight: 1.3 }}>See work from local electricians</Typography>
              </Box>
              <ArrowForwardRoundedIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20, flexShrink: 0 }} />
            </Box>
          </Box>

          {/* Top right image */}
          <Box
            onClick={() => router.push("/cus/reels")}
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              backgroundImage: `url(${HERO_IMAGES[1].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              bgcolor: dark ? "#2a2535" : "#f0edf5",
              cursor: "pointer",
              transition: "transform 250ms ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)" }} />
            {HERO_IMAGES[1].label && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(4px)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                <PlayArrowRoundedIcon sx={{ fontSize: 14, color: COLORS.PRIMARY_PURPLE }} />
                {HERO_IMAGES[1].label}
              </Box>
            )}
          </Box>

          {/* Bottom right image */}
          <Box
            onClick={() => router.push("/cus/servicesList?search=cleaning")}
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              backgroundImage: `url(${HERO_IMAGES[2].src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: dark ? "#2a2535" : "#f0edf5",
              cursor: "pointer",
              transition: "transform 250ms ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)" }} />
            {HERO_IMAGES[2].label && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {HERO_IMAGES[2].label}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
