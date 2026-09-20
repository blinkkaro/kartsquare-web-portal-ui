"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { COLORS } from "@/constants/colors";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionEyebrowSx, sectionTitleSx, sectionSubtitleSx } from "./shared";

// Only statements the product actually backs today: listings are admin-approved,
// contact is direct (call / WhatsApp), ratings come from real reviews, the assistant
// understands Hinglish, and results are filtered by city. Nothing about police checks,
// warranties, advances or insurance.
const PILLARS = [
  { icon: VerifiedUserRoundedIcon, title: "Approved listings", body: "Every service is reviewed before it goes live.", from: "#16a34a", to: "#4ade80" },
  { icon: PhoneInTalkRoundedIcon, title: "Talk directly", body: "Call or WhatsApp the provider yourself — no middleman.", from: "#5e18e9", to: "#a78bfa" },
  { icon: StarRoundedIcon, title: "Real reviews only", body: "Ratings appear only once customers have actually reviewed.", from: "#f59e0b", to: "#fcd34d" },
  { icon: TranslateRoundedIcon, title: "Speak your language", body: "English, Hindi or Hinglish — describe it your way.", from: "#0ea5e9", to: "#67e8f9" },
  { icon: LocationOnRoundedIcon, title: "Local by design", body: "Results are filtered to your city and area.", from: "#e11d74", to: "#fb7ab0" },
] as const;

const N = PILLARS.length;
const SPIN_SECONDS = 48;
const CYCLE_MS = 3200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Live "is on screen" flag plus a sticky "has been seen" flag for one-shot reveals. */
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  // Without IntersectionObserver there is nothing to wait for: show everything.
  const [seen, setSeen] = useState(() => typeof window !== "undefined" && typeof IntersectionObserver === "undefined");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView, seen };
}

/** Staggered fade-up used by the section's text blocks. */
const reveal = (seen: boolean, delayMs: number) => ({
  opacity: seen ? 1 : 0,
  transform: seen ? "none" : "translateY(18px)",
  transition: `opacity 600ms ease ${delayMs}ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
  "@media (prefers-reduced-motion: reduce)": { opacity: 1, transform: "none", transition: "none" },
});

export default function TrustOrbit() {
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false); // user picked one: stop auto-cycling
  const { ref: sectionRef, inView, seen } = useInView<HTMLDivElement>(0.25);
  const orbitRef = useRef<HTMLDivElement | null>(null);

  // Auto-cycle the highlighted pillar while visible (until the user takes over).
  useEffect(() => {
    if (!inView || pinned || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % N), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, pinned]);

  // Scroll-linked spin: the ring turns as the section moves through the viewport.
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const el = orbitRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // ~ -1 .. 1
      el.style.setProperty("--scroll-rot", `${(-p * 160).toFixed(1)}deg`);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [inView]);

  const pick = useCallback((i: number) => {
    setActive(i);
    setPinned(true);
  }, []);

  const cur = PILLARS[active];
  const CurIcon = cur.icon;
  const ink = dark ? "#e9dcff" : "#3b1a8a";

  return (
    <Section sx={{ pt: { xs: 3, md: 4 } }}>
      <Box ref={sectionRef}>
        <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: { xs: 1, md: 2 }, ...reveal(seen, 0) }}>
          <Typography sx={{ ...sectionEyebrowSx, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
            Why Kartsquare
          </Typography>
          <Typography component="h2" sx={sectionTitleSx}>
            Everything you need to hire local
          </Typography>
          <Typography sx={sectionSubtitleSx}>
            Tap a planet — or just watch them go round.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 420px) minmax(0, 1fr)" }, gap: { xs: 1, md: 6 }, alignItems: "center" }}>
          {/* ---------------------------------------------------------------- orbit */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              ref={orbitRef}
              sx={{
                "--S": { xs: "300px", md: "380px" },
                "--node": { xs: "56px", md: "64px" },
                "--R": "calc(var(--S) / 2 - var(--node) / 2 - 4px)",
                "--scroll-rot": "0deg",
                position: "relative",
                width: "var(--S)",
                height: "var(--S)",
                maxWidth: "100%",
                opacity: seen ? 1 : 0,
                transform: seen ? "none" : "scale(0.7) rotate(-40deg)",
                transition: "opacity 700ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                "@keyframes kSpin": { to: { transform: "rotate(360deg)" } },
                "@keyframes kPulse": { "0%": { transform: "scale(1)", opacity: 0.5 }, "100%": { transform: "scale(1.5)", opacity: 0 } },
                "@media (prefers-reduced-motion: reduce)": { opacity: 1, transform: "none", transition: "none" },
              }}
            >
              {/* faint concentric rings */}
              {[1, 0.66, 0.36].map((k, i) => (
                <Box
                  key={k}
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: `calc((1 - ${k}) * var(--S) / 2)`,
                    borderRadius: "50%",
                    border: `1.5px ${i === 0 ? "dashed" : "solid"} ${dark ? "rgba(214,184,255,0.22)" : "rgba(94,24,233,0.18)"}`,
                  }}
                />
              ))}

              {/* rotating layer: scroll-linked offset wraps the constant spin */}
              <Box sx={{ position: "absolute", inset: 0, transform: "rotate(var(--scroll-rot))", transition: "transform 120ms linear", "@media (prefers-reduced-motion: reduce)": { transform: "none", transition: "none" } }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    animation: `kSpin ${SPIN_SECONDS}s linear infinite`,
                    "&:hover": { animationPlayState: "paused" },
                    "&:hover .k-cancel": { animationPlayState: "paused" },
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                >
                  {PILLARS.map((p, i) => {
                    const Icon = p.icon;
                    const angle = (360 / N) * i;
                    const on = i === active;
                    return (
                      <Box
                        key={p.title}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "var(--node)",
                          height: "var(--node)",
                          ml: "calc(var(--node) / -2)",
                          mt: "calc(var(--node) / -2)",
                          transform: `rotate(${angle}deg) translateY(calc(var(--R) * -1)) rotate(${-angle}deg)`,
                        }}
                      >
                        {/* counter-rotations keep the planet upright: cancel the spin, then the scroll offset */}
                        <Box
                          className="k-cancel"
                          sx={{ width: "100%", height: "100%", animation: `kSpin ${SPIN_SECONDS}s linear infinite reverse`, "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
                        >
                          <Box sx={{ width: "100%", height: "100%", transform: "rotate(calc(var(--scroll-rot) * -1))", transition: "transform 120ms linear", "@media (prefers-reduced-motion: reduce)": { transform: "none", transition: "none" } }}>
                            <Box
                              component="button"
                              type="button"
                              onClick={() => pick(i)}
                              aria-label={p.title}
                              aria-pressed={on}
                              sx={{
                                all: "unset",
                                boxSizing: "border-box",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                                boxShadow: on ? `0 0 0 4px ${p.from}44, 0 14px 30px ${p.from}77` : `0 8px 18px ${p.from}55`,
                                border: `2px solid ${dark ? "#171422" : "#fff"}`,
                                transform: on ? "scale(1.18)" : "scale(1)",
                                transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease",
                                "&:hover": { transform: "scale(1.12)" },
                                "&:focus-visible": { outline: `3px solid ${p.from}`, outlineOffset: 3 },
                                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                              }}
                            >
                              <Icon sx={{ fontSize: { xs: 26, md: 30 } }} />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* counter-rotating inner ring with tiny satellites */}
              <Box
                aria-hidden
                sx={{ position: "absolute", inset: "calc(var(--S) * 0.32)", borderRadius: "50%", animation: `kSpin ${SPIN_SECONDS * 0.7}s linear infinite reverse`, "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}
              >
                {[0, 120, 240].map((a) => (
                  <Box key={a} sx={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, mt: "-4px", ml: "-4px", borderRadius: "50%", bgcolor: cur.to, boxShadow: `0 0 10px ${cur.from}`, transform: `rotate(${a}deg) translateY(calc(var(--S) * -0.18))`, transition: "background-color 400ms ease, box-shadow 400ms ease" }} />
                ))}
              </Box>

              {/* hub */}
              <Box sx={{ position: "absolute", top: "50%", left: "50%", width: "calc(var(--S) * 0.34)", height: "calc(var(--S) * 0.34)", transform: "translate(-50%, -50%)" }}>
                <Box aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: cur.from, animation: "kPulse 2.4s ease-out infinite", transition: "background-color 400ms ease", "@media (prefers-reduced-motion: reduce)": { animation: "none", display: "none" } }} />
                {/* white disc keeps the purple logo legible on any theme; ring + glow follow the active point */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.25,
                    bgcolor: "#fff",
                    border: `4px solid ${cur.from}`,
                    boxShadow: `0 0 0 5px ${cur.from}33, 0 16px 36px ${cur.from}66`,
                    transition: "border-color 400ms ease, box-shadow 400ms ease",
                    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                  }}
                >
                  <Image src="/logo.svg" alt="Kartsquare logo" width={52} height={52} priority style={{ width: "46%", height: "auto" }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b6480", lineHeight: 1 }}>
                    {location.city}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ---------------------------------------------------------- explanation */}
          <Box>
            {/* mobile: one live detail card + pager dots */}
            <Box sx={{ display: { xs: "block", md: "none" }, textAlign: "center", px: 1 }}>
              <Box key={active} aria-live="polite" sx={{ animation: "kFadeUp 380ms ease both", "@keyframes kFadeUp": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } }, "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CurIcon sx={{ color: cur.from }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>{cur.title}</Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", maxWidth: 300, mx: "auto" }}>{cur.body}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 1.5 }}>
                {PILLARS.map((p, i) => (
                  <Box
                    key={p.title}
                    component="button"
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={`Show ${p.title}`}
                    sx={{ all: "unset", cursor: "pointer", width: i === active ? 22 : 8, height: 8, borderRadius: 99, bgcolor: i === active ? p.from : "divider", transition: "width 300ms ease, background-color 300ms ease", position: "relative", "&::after": { content: '""', position: "absolute", inset: "-18px -4px" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}
                  />
                ))}
              </Box>
            </Box>

            {/* desktop: all five, active one lit */}
            <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 1 }}>
              {PILLARS.map((p, i) => {
                const Icon = p.icon;
                const on = i === active;
                return (
                  <Box
                    key={p.title}
                    component="button"
                    type="button"
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    sx={{
                      all: "unset",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.75,
                      p: 1.5,
                      borderRadius: 4,
                      border: "1.5px solid",
                      borderColor: on ? p.from : "divider",
                      bgcolor: on ? `${p.from}14` : "background.paper",
                      opacity: seen ? 1 : 0,
                      transform: !seen ? "translateY(18px)" : on ? "translateX(8px)" : "none",
                      transition: `opacity 600ms ease ${150 + i * 90}ms, border-color 250ms ease, background-color 250ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1) ${seen ? 0 : 150 + i * 90}ms`,
                      "&:focus-visible": { outline: `3px solid ${p.from}`, outlineOffset: 2 },
                      "@media (prefers-reduced-motion: reduce)": { opacity: 1, transition: "none" },
                    }}
                  >
                    <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: `linear-gradient(135deg, ${p.from}, ${p.to})`, boxShadow: on ? `0 8px 20px ${p.from}66` : "none" }}>
                      <Icon />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.98rem", color: on ? ink : "text.primary" }}>{p.title}</Typography>
                      <Typography sx={{ fontSize: "0.83rem", color: "text.secondary", mt: 0.25 }}>{p.body}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
