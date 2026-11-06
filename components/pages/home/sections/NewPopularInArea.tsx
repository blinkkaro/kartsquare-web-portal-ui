"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionTitleSx, sectionSubtitleSx } from "./shared";
import { HOME_PHOTOS, photoForCategory } from "./homePhotos";

const DUMMY_CITY_SERVICES = [
  "AC repair & gas refilling",
  "Home deep cleaning",
  "Water purifier service",
  "Packers & movers",
  "Electrician & wiring",
  "Salon at home & bridal makeup",
  "Plumbing & bathroom fittings",
  "Carpentry & furniture assembly",
];

const AUTO_MS = 4200;
const WHY_AUTO_MS = 2500;
const RESUME_MS = 6000;

const WHY_REASONS = [
  {
    icon: GridViewRoundedIcon,
    word: "Local",
    title: "All local, one place",
    body: "Services and shops in your city, one search away.",
    bg: "linear-gradient(160deg, #14052f 0%, #3a12a8 100%)",
    fg: "#fff",
    sub: "rgba(255,255,255,0.75)",
    ghost: "rgba(255,255,255,0.35)",
    tilt: -1.6,
  },
  {
    icon: PhotoLibraryOutlinedIcon,
    word: "Real",
    title: "See real work first",
    body: "Photos, reels and portfolios before you decide who to call.",
    bg: "#ece4ff",
    fg: "#2a0d73",
    sub: "rgba(42,13,115,0.72)",
    ghost: "rgba(105,39,218,0.4)",
    tilt: 1.4,
  },
  {
    icon: BalanceRoundedIcon,
    word: "Fair",
    title: "Compare easily",
    body: "Consistent profiles make it simple to weigh options side by side.",
    bg: "linear-gradient(160deg, #6927da 0%, #9a63ff 100%)",
    fg: "#fff",
    sub: "rgba(255,255,255,0.8)",
    ghost: "rgba(255,255,255,0.4)",
    tilt: -1.2,
  },
  {
    icon: ChatBubbleOutlineRoundedIcon,
    word: "Direct",
    title: "Connect direct",
    body: "Call or send an enquiry, and book where it's offered.",
    bg: "#ffffff",
    fg: "#2a0d73",
    sub: "rgba(42,13,115,0.72)",
    ghost: "rgba(105,39,218,0.4)",
    tilt: 1.6,
  },
] as const;

export default function NewPopularInArea() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { location } = useAILocation();
  const { data: categories } = useCategories();

  // The services page reads the same shared location, so links carry no city.
  const city = location.city;
  const placeTitle = city ?? "your area";

  // Interactive spotlight: one row open at a time. Auto-advances until the user
  // touches the list; pauses off-screen and for reduced-motion users.
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false); // hover/focus-within pause
  const [userPaused, setUserPaused] = useState(false); // explicit pause button
  const listRef = useRef<HTMLDivElement>(null);

  // Use API categories if available, else dummy services
  const serviceList = (categories && categories.length > 0)
    ? categories.slice(0, 8).map((c) => c.name)
    : DUMMY_CITY_SERVICES;

  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0, rootMargin: "-10% 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const whyRef = useRef<HTMLDivElement>(null);
  const [whyActive, setWhyActive] = useState(0);
  const onWhyScroll = () => {
    const el = whyRef.current;
    if (!el?.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    setWhyActive(Math.min(WHY_REASONS.length - 1, Math.round(el.scrollLeft / step)));
  };
  const whyGo = (dir: 1 | -1) => {
    const el = whyRef.current;
    if (!el?.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Auto-slide every 2.5s while on screen; pauses while the user hovers/touches,
  // wraps back to the first card at the end. Skipped for reduced-motion users.
  const [whyPaused, setWhyPaused] = useState(false);
  const [whyInView, setWhyInView] = useState(false);
  useEffect(() => {
    const el = whyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setWhyInView(e.isIntersecting), { threshold: 0, rootMargin: "-10% 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (whyPaused || !whyInView) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const el = whyRef.current;
      if (!el?.firstElementChild) return;
      const step = (el.firstElementChild as HTMLElement).offsetWidth + 16;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, WHY_AUTO_MS);
    return () => clearInterval(t);
  }, [whyPaused, whyInView]);

  const count = serviceList.length;
  useEffect(() => {
    if (!auto || !inView || held || userPaused || count < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => clearInterval(t);
  }, [auto, inView, held, userPaused, count]);

  // User picks pause auto-advance briefly, then it carries on from that row.
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resumeRef.current) clearTimeout(resumeRef.current); }, []);
  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setAuto(true), RESUME_MS);
  };

  return (
    <Section id="popular-area" sx={{ py: { xs: 3.5, md: 6 }, px: 0 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1.4fr)" }, gap: { xs: 2.5, md: 4 }, alignItems: { xs: "stretch", lg: "start" } }}>
        {/* Left: Popular in City Card */}
        <Box
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Banner: animated purple aurora, big staggered city name, service ticker */}
          <Box
            className="ks-banner"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
            sx={{
              "--mx": "70%",
              "--my": "30%",
              position: "relative",
              height: { xs: 230, sm: 250 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              isolation: "isolate",
              background: "linear-gradient(160deg, #14052f 0%, #2a0d73 45%, #4c1bd0 100%)",
            }}
          >
            {/* The Hawa Mahal photo belongs to Jaipur only; other places get the plain banner. */}
            {city === "Jaipur" && (
              <Image
                src={HOME_PHOTOS.hawaMahal.src}
                alt={HOME_PHOTOS.hawaMahal.alt}
                fill
                loading="lazy"
                sizes="(max-width: 1200px) 100vw, 520px"
                style={{ objectFit: "cover", opacity: 0.28, mixBlendMode: "luminosity", zIndex: -3 }}
              />
            )}
            {/* drifting aurora blobs */}
            <Box aria-hidden sx={{ position: "absolute", zIndex: -2, top: -60, left: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, #a77bff 0%, transparent 70%)", filter: "blur(18px)", animation: "ks-blob-a 9s ease-in-out infinite alternate" }} />
            <Box aria-hidden sx={{ position: "absolute", zIndex: -2, bottom: -80, right: -50, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #6d3bff 0%, transparent 70%)", filter: "blur(22px)", animation: "ks-blob-b 11s ease-in-out infinite alternate" }} />
            {/* cursor / touch spotlight */}
            <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: -1, background: "radial-gradient(180px circle at var(--mx) var(--my), rgba(255,255,255,0.22), transparent 70%)", pointerEvents: "none" }} />
            {/* fine dot grid */}
            <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: -1, backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)", backgroundSize: "16px 16px", maskImage: "linear-gradient(to bottom, #000 0%, transparent 75%)", WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 75%)" }} />

            <Box sx={{ px: 3, pt: 2.5 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.28)",
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                <Box component="span" sx={{ position: "relative", width: 7, height: 7, borderRadius: "50%", bgcolor: "#c9b2ff", "&::after": { content: '""', position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "#c9b2ff", animation: "ks-ping 1.8s ease-out infinite" } }} />
                Popular in
              </Box>

              <Typography
                component="h2"
                aria-label={`Popular services in ${placeTitle}`}
                sx={{
                  mt: 0.75,
                  display: "flex",
                  fontSize: { xs: "3.4rem", sm: "3.9rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.9)",
                }}
              >
                {Array.from(placeTitle).map((ch, i) => (
                  <Box
                    key={i}
                    component="span"
                    aria-hidden
                    sx={{
                      display: "inline-block",
                      animation: `ks-letter-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms both`,
                      transition: "color 250ms ease, transform 250ms ease",
                      cursor: "default",
                      "&:hover": { color: "#fff", transform: "translateY(-8px) rotate(-4deg)" },
                    }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </Box>
                ))}
              </Typography>
            </Box>

            {/* service ticker */}
            <Box
              aria-hidden
              sx={{
                borderTop: "1px solid rgba(255,255,255,0.14)",
                bgcolor: "rgba(10,3,30,0.35)",
                backdropFilter: "blur(4px)",
                overflow: "hidden",
                py: 0.9,
                maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
              }}
            >
              <Box sx={{ display: "flex", width: "max-content", animation: "ks-marquee 28s linear infinite" }}>
                {[0, 1].map((dup) => (
                  <Box key={dup} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {serviceList.map((name) => (
                      <Box key={name} component="span" sx={{ display: "inline-flex", alignItems: "center", color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                        <Box component="span" sx={{ mx: 1.75, color: "#b99aff" }}>✦</Box>
                        {name}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Interactive list: tap/hover a service to open its spotlight */}
          <Box
            ref={listRef}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
            sx={{ p: { xs: 1.5, sm: 2.5 }, flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-pressed={userPaused}
              sx={{
                all: "unset",
                cursor: "pointer",
                alignSelf: "flex-end",
                px: 1.25,
                py: 0.5,
                minHeight: 28,
                borderRadius: 99,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: COLORS.PRIMARY_PURPLE,
                "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
                "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}` },
              }}
            >
              {userPaused ? "▶ Play auto-advance" : "⏸ Pause auto-advance"}
            </Box>
            {serviceList.map((serviceName, idx) => {
              const open = idx === active;
              const photo = photoForCategory(serviceName) ?? (city === "Jaipur" ? HOME_PHOTOS.hawaMahal : HOME_PHOTOS.homeCleaning);
              const href = `/cus/services-list?search=${encodeURIComponent(serviceName)}`;
              return (
                <Box
                  key={idx}
                  onMouseEnter={() => pick(idx)}
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: open ? COLORS.PURPLE_ALPHA_10 : "transparent",
                    transition: "background-color 250ms ease",
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    aria-expanded={open}
                    onClick={() => pick(idx)}
                    sx={{
                      all: "unset",
                      boxSizing: "border-box",
                      width: "100%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 1.25,
                      px: 1.5,
                      color: open ? COLORS.PRIMARY_PURPLE : "text.primary",
                      fontSize: "0.92rem",
                      fontWeight: open ? 700 : 600,
                      transition: "color 200ms ease",
                      "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: -2, borderRadius: 3 },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        minWidth: 26,
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        color: open ? COLORS.PRIMARY_PURPLE : "text.disabled",
                        transition: "color 200ms ease",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </Box>
                    <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{serviceName}</Box>
                    <KeyboardArrowDownRoundedIcon
                      sx={{ fontSize: 20, opacity: 0.7, transform: open ? "rotate(180deg)" : "none", transition: "transform 250ms ease" }}
                    />
                  </Box>

                  {/* Expanding spotlight (grid-rows 0fr -> 1fr animates height without JS measuring) */}
                  <Box
                    inert={!open}
                    sx={{
                      display: "grid",
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition: "grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <Box sx={{ overflow: "hidden", minHeight: 0 }}>
                      <Box sx={{ px: 1.5, pb: 1.5 }}>
                        <Box
                          component={Link}
                          href={href}
                          sx={{
                            position: "relative",
                            display: "block",
                            height: { xs: 130, sm: 150 },
                            borderRadius: 2.5,
                            overflow: "hidden",
                            textDecoration: "none",
                            opacity: open ? 1 : 0,
                            transform: open ? "none" : "translateY(8px)",
                            transition: "opacity 400ms ease 80ms, transform 400ms ease 80ms",
                            "&:hover img": { transform: "scale(1.06)" },
                          }}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 600px) 90vw, 400px"
                            loading="lazy"
                            style={{ objectFit: "cover", transition: "transform 600ms ease" }}
                          />
                          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,10,40,0.78) 0%, rgba(20,10,40,0.1) 65%)" }} />
                          <Box sx={{ position: "absolute", left: 12, right: 12, bottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                            <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                              Find {serviceName.toLowerCase()} in {placeTitle}
                            </Typography>
                            <Box
                              sx={{
                                flexShrink: 0,
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                bgcolor: "#fff",
                                color: COLORS.PRIMARY_PURPLE,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Auto-advance progress bar */}
                  {open && auto && inView && !held && !userPaused && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        height: 2,
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        animation: `ks-progress ${AUTO_MS}ms linear forwards`,
                        "@media (prefers-reduced-motion: reduce)": { display: "none" },
                      }}
                    />
                  )}
                </Box>
              );
            })}

            <Box
              component={Link}
              href="/cus/services-list"
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                fontSize: "0.88rem",
                fontWeight: 700,
                color: COLORS.PRIMARY_PURPLE,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              View all services in {placeTitle}
              <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </Box>

        {/* Right: Why Kartsquare — simple poster-card slider */}
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", position: { lg: "sticky" }, top: { lg: 96 } }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.PRIMARY_PURPLE }}>
                Why us
              </Typography>
              <Typography component="h2" sx={{ ...sectionTitleSx, color: "text.primary" }}>
                Why Kartsquare?
              </Typography>
              <Typography sx={{ ...sectionSubtitleSx, maxWidth: 440 }}>
                Built to make discovering and booking reliable local services completely transparent.
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, flexShrink: 0 }}>
              {([-1, 1] as const).map((d) => (
                <IconButton
                  key={d}
                  aria-label={d === 1 ? "Next" : "Previous"}
                  onClick={() => whyGo(d)}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "1.5px solid",
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.PRIMARY_PURPLE,
                    transition: "background-color 200ms ease, color 200ms ease",
                    "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff" },
                  }}
                >
                  {d === 1 ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
                </IconButton>
              ))}
            </Box>
          </Box>

          <Box
            ref={whyRef}
            onScroll={onWhyScroll}
            onMouseEnter={() => setWhyPaused(true)}
            onMouseLeave={() => setWhyPaused(false)}
            onFocus={() => setWhyPaused(true)}
            onBlur={() => setWhyPaused(false)}
            onTouchStart={() => setWhyPaused(true)}
            onTouchEnd={() => setTimeout(() => setWhyPaused(false), 3000)}
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollPaddingLeft: "12px",
              overscrollBehaviorX: "contain",
              py: 2.5,
              px: 1.5,
              mx: -1.5,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {WHY_REASONS.map(({ icon: Icon, word, title, body, bg, fg, sub, ghost, tilt }, i) => (
              <Box
                key={title}
                sx={{
                  flex: { xs: "0 0 78%", sm: "0 0 260px", lg: "0 0 calc((100% - 16px - 16px) / 3)" },
                  minHeight: { xs: 300, lg: 380 },
                  scrollSnapAlign: "start",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 5,
                  p: 2.5,
                  background: bg,
                  color: fg,
                  border: "1px solid rgba(105,39,218,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `rotate(${tilt}deg)`,
                  transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms ease",
                  "&:hover": { transform: "rotate(0deg) translateY(-8px)", boxShadow: "0 18px 40px rgba(76,27,208,0.28)" },
                  "&:hover .ks-why-word": { WebkitTextStrokeWidth: "0px", color: ghost },
                  "&:hover .ks-why-icon": { transform: "scale(1.12) rotate(-8deg)" },
                }}
              >
                <Box
                  className="ks-why-word"
                  aria-hidden
                  sx={{
                    fontSize: { xs: "4.4rem", lg: "5rem" },
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: "-0.05em",
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${ghost}`,
                    transition: "color 300ms ease, -webkit-text-stroke-width 300ms ease",
                    userSelect: "none",
                  }}
                >
                  {word}
                </Box>
                <Box>
                  <Box
                    className="ks-why-icon"
                    sx={{
                      width: 40,
                      height: 40,
                      mb: 1.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: fg,
                      transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: fg === "#fff" ? "#2a0d73" : "#fff" }} />
                  </Box>
                  <Typography component="h3" sx={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ mt: 0.75, fontSize: "0.86rem", lineHeight: 1.5, color: sub }}>
                    {body}
                  </Typography>
                </Box>
                <Box aria-hidden sx={{ position: "absolute", top: 14, right: 18, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", color: sub }}>
                  {String(i + 1).padStart(2, "0")} / {String(WHY_REASONS.length).padStart(2, "0")}
                </Box>
              </Box>
            ))}
          </Box>

          {/* progress dots */}
          <Box sx={{ display: "flex", gap: 0.75, mt: 0.5 }}>
            {WHY_REASONS.map((r, i) => (
              <Box
                key={r.title}
                sx={{
                  height: 6,
                  width: i === whyActive ? 22 : 6,
                  borderRadius: 3,
                  bgcolor: i === whyActive ? COLORS.PRIMARY_PURPLE : dark ? "rgba(255,255,255,0.25)" : "#d6d0e0",
                  transition: "width 250ms ease, background-color 250ms ease",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
