"use client";
import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ExternalLogo from "@/components/common/Nav/components/ExternalLogo";
import { COLORS } from "@/constants/colors";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "2M+", label: "Monthly Users" },
  { value: "50K+", label: "Verified Providers" },
  { value: "200+", label: "Cities" },
  { value: "2022", label: "Founded" },
];

const values = [
  { icon: HandshakeOutlinedIcon, title: "Trust First", desc: "Every provider is manually verified. Every review is genuine. We built KartSquare on transparency.", color: COLORS.PRIMARY_PURPLE },
  { icon: SecurityOutlinedIcon, title: "Customer Safety", desc: "Secure payments, verified professionals, and a dedicated support team available around the clock.", color: "#00bcff" },
  { icon: LightbulbOutlinedIcon, title: "Innovation", desc: "AI-powered discovery, reels, and portfolio pages — we build tools that actually help providers grow.", color: COLORS.SECONDARY_ORANGE },
  { icon: GroupsOutlinedIcon, title: "Community", desc: "We believe in India's small business owners. KartSquare exists to amplify their reach and income.", color: "#22c55e" },
  { icon: PublicOutlinedIcon, title: "Accessibility", desc: "Our platform is available in multiple languages and works seamlessly on any device, anywhere.", color: "#ec4899" },
  { icon: SmartToyOutlinedIcon, title: "AI-Driven", desc: "Smart matching connects customers to the right provider based on location, rating, and availability.", color: "#7c3aed" },
];

const timeline = [
  { year: "2022", title: "KartSquare Founded", desc: "Started in Dubai with a vision to digitise India's unorganised service sector and connect local providers with customers." },
  { year: "2023", title: "Launched in India", desc: "Expanded operations across 50+ Indian cities. Onboarded 10,000 verified service providers in the first 6 months." },
  { year: "2024", title: "AI Discovery & Reels", desc: "Launched AI-powered location-based customer matching and video reel marketing for provider profiles." },
  { year: "2025", title: "50K Providers & Growing", desc: "Crossed 50,000 active verified providers and 2 million monthly users across 200+ cities." },
];

const leadership = [
  { name: "Arjun Mehta", role: "Co-Founder & CEO", bio: "Visionary entrepreneur with 12+ years in tech and marketplace businesses across UAE and India.", img: "/about/ceo.png" },
  { name: "Priya Nair", role: "Co-Founder & CTO", bio: "Engineering leader who built the AI discovery engine powering KartSquare's intelligent matching system.", img: "/about/cto.png" },
];

export default function GlobalAboutUsView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const pageRef = useScrollReveal();

  const pageBg = isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT;
  const cardBg = isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#ffffff";
  const border = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
  const primaryTxt = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const secondaryTxt = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

  return (
    <Box ref={pageRef} sx={{ bgcolor: pageBg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <Box data-animate sx={{
        position: "relative", overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg,#0d0520 0%,#1a0a35 50%,#0a1628 100%)"
          : "linear-gradient(135deg,#f0ebff 0%,#e8f4ff 60%,#fdf4ff 100%)",
        pt: { xs: 14, md: 13 }, pb: { xs: 6, md: 9 },
      }}>
        <Box sx={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", bgcolor: `${COLORS.PRIMARY_PURPLE}18`, filter: "blur(90px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", bgcolor: "#00bcff14", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo — top-left */}
        <Box sx={{ position: "absolute", top: { xs: 20, md: 28 }, left: { xs: 20, md: 40 }, zIndex: 2 }}>
          <ExternalLogo mode={isDark ? "dark" : "light"} />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Box data-animate data-delay="0">
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: "100px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, mb: 2.5 }}>
                <InfoOutlinedIcon sx={{ fontSize: 15, color: COLORS.PRIMARY_PURPLE }} />
                <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, letterSpacing: 0.8, fontSize: "0.7rem" }}>OUR STORY</Typography>
              </Box>
            </Box>
            <Box data-animate data-delay="100">
              <Typography component="h1" sx={{
                fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem" }, fontWeight: 800, lineHeight: 1.1, mb: 2,
                background: `linear-gradient(130deg,${COLORS.PRIMARY_PURPLE} 0%,#00bcff 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Connecting India, One Service at a Time
              </Typography>
            </Box>
            <Box data-animate data-delay="200">
              <Typography variant="h6" sx={{ color: secondaryTxt, fontWeight: 400, maxWidth: 580, mx: "auto", lineHeight: 1.75, fontSize: { xs: "1rem", md: "1.1rem" } }}>
                KartSquare is India's fastest-growing marketplace for local services — built to empower small businesses and deliver trusted professionals to every doorstep.
              </Typography>
            </Box>
        </Container>
      </Box>

      {/* ── STATS BAR ── */}
      <Box data-animate sx={{ bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.PRIMARY_PURPLE, py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="center">
              {stats.map((s, i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i}>
                  <Box data-animate data-delay={String(i * 80)} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>{s.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>

        {/* ── MISSION & VISION ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box data-animate>
                  <Box sx={{ borderRadius: "24px", overflow: "hidden", height: { xs: 280, md: 420 }, position: "relative" }}>
                    <Image src="/about/team.png" alt="KartSquare Team" fill priority style={{ objectFit: "cover" }} />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(94,24,233,0.4) 0%, transparent 60%)" }} />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box data-animate data-delay="150">
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: "100px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, mb: 2 }}>
                    <TrackChangesIcon sx={{ fontSize: 15, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, letterSpacing: 0.5, fontSize: "0.7rem" }}>MISSION & VISION</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, mb: 2, lineHeight: 1.25 }}>
                    Making Quality Services Accessible to Every Indian
                  </Typography>
                  <Typography variant="body1" sx={{ color: secondaryTxt, lineHeight: 1.8, mb: 2.5 }}>
                    Our mission is to bridge the gap between skilled service professionals and the customers who need them — building a transparent, reliable, and AI-powered ecosystem that works for both sides.
                  </Typography>
                  <Typography variant="body1" sx={{ color: secondaryTxt, lineHeight: 1.8 }}>
                    We envision a future where every local business in India has the tools to compete, grow, and thrive digitally — from a verified listing to AI-targeted marketing, all in one place.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
        </Box>

        {/* ── OUR STORY TIMELINE ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Our Journey</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 6, maxWidth: 480, mx: "auto" }}>
                From a startup idea in Dubai to India's fastest-growing service marketplace.
              </Typography>
            </Box>
            <Box sx={{ position: "relative" }}>
              {/* Vertical line */}
              <Box sx={{ position: "absolute", left: { xs: 20, md: "50%" }, top: 0, bottom: 0, width: 2, bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT, transform: { md: "translateX(-50%)" } }} />
              {timeline.map((item, i) => (
                <Box data-animate data-delay={String(i * 100)} key={i}>
                  <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "row", md: i % 2 === 0 ? "row" : "row-reverse" },
                    mb: 5, gap: { xs: 3, md: 0 },
                    justifyContent: { md: "center" },
                  }}>
                    {/* Content */}
                    <Box sx={{ width: { md: "45%" }, pl: { xs: 5, md: i % 2 === 0 ? 0 : 4 }, pr: { md: i % 2 === 0 ? 4 : 0 }, textAlign: { md: i % 2 === 0 ? "right" : "left" } }}>
                      <Card elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px", p: 0.5, transition: "all 0.25s", "&:hover": { boxShadow: `0 8px 32px ${COLORS.PRIMARY_PURPLE}18`, transform: "translateY(-3px)" } }}>
                        <CardContent sx={{ p: "20px !important" }}>
                          <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "8px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, mb: 1 }}>
                            <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>{item.year}</Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 0.75, fontSize: "1rem" }}>{item.title}</Typography>
                          <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.65 }}>{item.desc}</Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    {/* Dot (md only) */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, width: "10%", justifyContent: "center", alignItems: "flex-start", pt: 2.5 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE, border: `3px solid ${isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT}`, boxShadow: `0 0 0 3px ${COLORS.PURPLE_ALPHA_30}` }} />
                    </Box>
                    {/* Spacer for alternating layout */}
                    <Box sx={{ display: { xs: "none", md: "block" }, width: "45%" }} />
                  </Box>
                </Box>
              ))}
            </Box>
        </Box>

        {/* ── CORE VALUES ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>What We Stand For</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5, maxWidth: 480, mx: "auto" }}>
                Our values drive every product decision and every partnership.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {values.map((v, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Box data-animate data-delay={String(i * 80)}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "18px", p: 0.5,
                      transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${v.color},${COLORS.PRIMARY_PURPLE})`, transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" },
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 16px 40px ${v.color}22`, "&::before": { transform: "scaleX(1)" } },
                    }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <Box sx={{ width: 50, height: 50, borderRadius: "14px", bgcolor: `${v.color}15`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <v.icon sx={{ color: v.color, fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1, fontSize: "1rem" }}>{v.title}</Typography>
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.7 }}>{v.desc}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── LEADERSHIP ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Leadership Team</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5 }}>
                The people driving KartSquare's vision forward.
              </Typography>
            </Box>
            <Grid container spacing={4} justifyContent="center">
              {leadership.map((l, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Box data-animate data-delay={String(i * 120)}>
                    <Card elevation={0} sx={{
                      bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "20px", overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 20px 48px ${COLORS.PRIMARY_PURPLE}20` },
                    }}>
                      <Box sx={{ height: 280, position: "relative" }}>
                        <Image src={l.img} alt={l.name} fill loading="lazy" style={{ objectFit: "cover" }} />
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(94,24,233,0.55) 0%, transparent 50%)" }} />
                      </Box>
                      <CardContent sx={{ p: "20px !important" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt }}>{l.name}</Typography>
                        <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600, display: "block", mb: 1 }}>{l.role}</Typography>
                        <Divider sx={{ borderColor: border, mb: 1.5 }} />
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.65 }}>{l.bio}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── CTA ── */}
        <Box data-animate sx={{ mb: 4 }}>
            <Box sx={{
              borderRadius: "24px", p: { xs: 4, md: 7 }, textAlign: "center", position: "relative", overflow: "hidden",
              background: isDark
                ? "linear-gradient(135deg,#1a0a35 0%,#0a1628 100%)"
                : `linear-gradient(135deg,${COLORS.PURPLE_ALPHA_04} 0%,#e8f4ff 100%)`,
              border: `1px solid ${COLORS.PURPLE_ALPHA_20}`,
            }}>
              <Box sx={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", bgcolor: `${COLORS.PRIMARY_PURPLE}12`, filter: "blur(60px)", pointerEvents: "none" }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, mb: 1.5, position: "relative", zIndex: 1 }}>
                Join the KartSquare Family
              </Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, mb: 4, maxWidth: 500, mx: "auto", position: "relative", zIndex: 1 }}>
                Whether you're a customer looking for trusted services or a provider ready to grow — KartSquare is the platform for you.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                <Box
                  id="about-join-provider-btn"
                  onClick={() => router.push("/External/JoinAsProvider")}
                  sx={{ px: 4, py: 1.5, borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9375rem", color: "#fff", background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)`, boxShadow: `0 6px 24px ${COLORS.PRIMARY_PURPLE}35`, transition: "all 0.2s", "&:hover": { opacity: 0.9, transform: "translateY(-2px)" } }}
                >
                  Join as Provider
                </Box>
                <Box
                  id="about-contact-btn"
                  onClick={() => router.push("/External/GlobalContactUs")}
                  sx={{ px: 4, py: 1.5, borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9375rem", color: COLORS.PRIMARY_PURPLE, bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "#fff", border: `2px solid ${COLORS.PRIMARY_PURPLE}`, transition: "all 0.2s", "&:hover": { bgcolor: isDark ? COLORS.PURPLE_ALPHA_20 : COLORS.PURPLE_ALPHA_04, transform: "translateY(-2px)" } }}
                >
                  Contact Us
                </Box>
              </Box>
            </Box>
        </Box>

      </Container>
    </Box>
  );
}
