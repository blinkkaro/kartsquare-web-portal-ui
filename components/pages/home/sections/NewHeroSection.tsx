"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useHomeServices } from "@/hooks/useHomeServices";
import SearchBar from "@/components/common/Nav/components/SearchBar";
import { searchHref } from "@/lib/homeHero";
import { winterServiceNames } from "@/lib/homeServices";
import KartAiPreview from "./KartAiPreview";
import { ShimmerBox } from "./HomeLoading";

const HEADLINE = [
  ["Kaam", "karwana", "hai?"],
  ["Kartsquare", "pe", "dhundo."],
] as const;
const BASE_PLACEHOLDER = "Kaunsi service chahiye?";
const HINT_MS = 2800;
const spring = { type: "spring", stiffness: 380, damping: 26 } as const;

// Slow ambient drift for the two background glows. Transform only; switched off under reduced motion.
const driftA = keyframes`from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(60px, 40px, 0) scale(1.15); }`;
const driftB = keyframes`from { transform: translate3d(0, 0, 0) scale(1.1); } to { transform: translate3d(-70px, -30px, 0) scale(0.95); }`;

/**
 * Customer home hero, on a full-width violet band: an animated headline, one search (its hint cycles through
 * services we really have), real winter-service shortcuts, and a compact example of Kart AI.
 * Search reuses the header's SearchBar (suggestions, "see all") and submits to the services list.
 * Everything animated is decoration or feedback; the headline and search are visible from the first paint.
 */
export default function NewHeroSection() {
  const router = useRouter();
  const reduce = useReducedMotion() === true;
  const [query, setQuery] = useState("");
  const { services, isLoading } = useHomeServices();

  // Winter services we really have providers for (electrician, geyser repair, inverter and battery...).
  const shortcuts = useMemo(() => winterServiceNames(services, 3), [services]);

  // The search hint cycles through those same services. Static under reduced motion.
  const hints = useMemo(() => [BASE_PLACEHOLDER, ...shortcuts.map((n) => `Try "${n}"`)], [shortcuts]);
  const [hintIndex, setHintIndex] = useState(0);
  useEffect(() => {
    if (reduce || hints.length < 2) return;
    const t = setInterval(() => setHintIndex((i) => (i + 1) % hints.length), HINT_MS);
    return () => clearInterval(t);
  }, [reduce, hints.length]);
  const placeholder = hints[hintIndex % hints.length] ?? BASE_PLACEHOLDER;

  return (
    <Box
      component="section"
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      sx={{ position: "relative", pt: { xs: 3, md: 6 }, pb: { xs: 3, md: 5 }, color: COLORS.WHITE, "--mx": "72%", "--my": "30%" }}
    >
      {/* a soft light that follows the mouse across the band (desktop); static on touch and under reduced motion */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(360px circle at var(--mx) var(--my), rgba(255,255,255,0.13), transparent 62%)",
          "@media (prefers-reduced-motion: reduce)": { display: "none" },
        }}
      />
      {/* ambient glows behind the content */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: -60, md: -120 },
          left: { xs: -80, md: "8%" },
          width: { xs: 260, md: 460 },
          height: { xs: 260, md: 460 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}55 0%, transparent 68%)`,
          filter: "blur(40px)",
          animation: `${driftA} 14s ease-in-out infinite alternate`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: { xs: -80, md: -140 },
          right: { xs: -100, md: "2%" },
          width: { xs: 300, md: 560 },
          height: { xs: 300, md: 560 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.PRIMARY_BLUE}66 0%, transparent 68%)`,
          filter: "blur(50px)",
          animation: `${driftB} 18s ease-in-out infinite alternate`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
          columnGap: { md: 6, lg: 10 },
          rowGap: { xs: 3.5, md: 0 },
          alignItems: "center",
          width: "100%",
          minWidth: 0,
        }}
      >
        <Box sx={{ minWidth: 0, maxWidth: { md: 560, lg: 620, xl: 680 } }}>
          <Typography
            component="h1"
            data-speakable="headline"
            sx={{
              // 30px at 360, 33px at 390, 38px by 450; larger columns on desktop
              fontSize: { xs: "clamp(1.9rem, 8.4vw, 2.4rem)", md: "3rem", lg: "3.5rem", xl: "3.9rem" },
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.08,
              color: COLORS.WHITE,
              mb: 1.75,
            }}
          >
            {HEADLINE.map((line, li) => (
              <React.Fragment key={li}>
                {li > 0 && " "}
                <Box component="span" sx={{ display: "block" }}>
                  {line.map((word, wi) => {
                    const underlined = li === 1 && wi === 2;
                    return (
                      <React.Fragment key={word}>
                        {wi > 0 && " "}
                        <motion.span
                          // visible from the first paint (offset only, never opacity 0): it is the page's h1
                          initial={reduce ? false : { y: 22 }}
                          animate={{ y: 0 }}
                          transition={{ ...spring, delay: reduce ? 0 : 0.08 * (li * 3 + wi) }}
                          style={{ display: "inline-block", position: "relative" }}
                        >
                          {word}
                          {underlined && (
                            <Box
                              component="svg"
                              aria-hidden
                              viewBox="0 0 200 14"
                              preserveAspectRatio="none"
                              sx={{ position: "absolute", left: 0, right: 0, bottom: { xs: -6, md: -8 }, width: "100%", height: { xs: 9, md: 12 }, overflow: "visible" }}
                            >
                              <motion.path
                                d="M3 9 C 45 2, 95 2, 140 7 S 185 9, 197 4"
                                fill="none"
                                stroke={COLORS.SECONDARY_ORANGE}
                                strokeWidth="5"
                                strokeLinecap="round"
                                initial={reduce ? false : { pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.7, delay: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </Box>
                          )}
                        </motion.span>
                      </React.Fragment>
                    );
                  })}
                </Box>
              </React.Fragment>
            ))}
          </Typography>

          <Typography
            data-speakable="answer"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, color: "rgba(255,255,255,0.86)", lineHeight: 1.5, maxWidth: 460, mb: { xs: 2.75, md: 3.25 } }}
          >
            Service search karo, ya Kart AI ko apni problem batao.
          </Typography>

          <SearchBar
            variant="hero"
            search={query}
            onSearchChange={setQuery}
            onSubmit={(q) => router.push(searchHref(q))}
            placeholder={placeholder}
            label="Kaunsi service chahiye?"
          />

          {isLoading && (
            // the same height as the chip row that replaces it
            <Box sx={{ mt: 2.25 }} aria-hidden>
              <ShimmerBox tone="onDark" sx={{ width: 96, height: 14, mb: 1.25, borderRadius: 1 }} />
              <Box sx={{ display: "flex", gap: 1, pb: 0.5 }}>
                {[120, 168, 150].map((w) => (
                  <ShimmerBox key={w} tone="onDark" sx={{ width: w, height: 44, borderRadius: 999, flexShrink: 0 }} />
                ))}
              </Box>
            </Box>
          )}
          {shortcuts.length > 0 && (
            <Box sx={{ mt: 2.25 }}>
              <Typography id="hero-shortcuts-label" sx={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.86)", mb: 1 }}>
                Try searching
              </Typography>
              <Box
                component="ul"
                aria-labelledby="hero-shortcuts-label"
                sx={{
                  display: "flex",
                  gap: 1,
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  // a narrow screen scrolls this row sideways instead of clipping a chip or widening the page
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  pb: 0.5,
                }}
              >
                {shortcuts.map((name, i) => (
                  <Box
                    component={motion.li}
                    key={name}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: reduce ? 0 : 0.5 + i * 0.06 }}
                    sx={{ flexShrink: 0 }}
                  >
                    <Box
                      component={Link}
                      href={searchHref(name)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 44,
                        px: 2.25,
                        borderRadius: 999,
                        bgcolor: COLORS.WHITE,
                        color: COLORS.PRIMARY_PURPLE,
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        transition: "transform 160ms ease, box-shadow 160ms ease",
                        "&:hover": { transform: "translateY(-2px) scale(1.03)", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" },
                        "&:active": { transform: "scale(0.96)" },
                        "&:focus-visible": { outline: `3px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: 2 },
                        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover, &:active": { transform: "none" } },
                      }}
                    >
                      {name}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <motion.div
          // Visible from the first paint: only its position animates, never its opacity.
          initial={reduce ? false : { y: 28 }}
          animate={{ y: 0 }}
          transition={{ ...spring, delay: reduce ? 0 : 0.35 }}
          style={{ minWidth: 0 }}
        >
          <KartAiPreview />
        </motion.div>
      </Box>
    </Box>
  );
}
