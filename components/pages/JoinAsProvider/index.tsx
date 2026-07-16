"use client";
import React, { useState } from "react";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, MenuItem, InputAdornment, Divider, Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ExternalLogo from "@/components/common/Nav/components/ExternalLogo";
import { COLORS } from "@/constants/colors";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import WebOutlinedIcon from "@mui/icons-material/WebOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "2M+", label: "Monthly Customers" },
  { value: "50K+", label: "Service Providers" },
  { value: "200+", label: "Cities Covered" },
  { value: "98%", label: "Satisfaction Rate" },
];

const benefits = [
  { icon: PeopleAltIcon, title: "Reach More Customers", desc: "Get discovered by millions of active users searching for services in your area daily.", color: COLORS.PRIMARY_PURPLE },
  { icon: VerifiedIcon, title: "Verified Business Badge", desc: "Build trust with a KartSquare Verified badge displayed on your profile.", color: "#00bcff" },
  { icon: TrendingUpIcon, title: "Grow Your Revenue", desc: "Providers on KartSquare see an average 3x increase in monthly bookings.", color: COLORS.SECONDARY_ORANGE },
  { icon: BusinessCenterIcon, title: "Free Business Listing", desc: "Create your complete business profile at zero cost. Upgrade anytime.", color: "#7027ff" },
];

const steps = [
  { step: "01", title: "Register Your Business", desc: "Fill in your business details and service category." },
  { step: "02", title: "Get Verified", desc: "Our team verifies your credentials within 24 hours." },
  { step: "03", title: "Start Getting Leads", desc: "Customers find and book your services directly." },
];

const testimonials = [
  { name: "Rajesh Kumar", role: "Electrician, Mumbai", quote: "KartSquare doubled my monthly clients in just 2 months. The leads are genuine and high quality.", img: "/providers/electrician.png", rating: 5 },
  { name: "Priya Sharma", role: "Salon Owner, Delhi", quote: "I was skeptical at first, but now 70% of my new clients come from KartSquare. Best decision ever.", img: "/providers/salon.png", rating: 5 },
  { name: "Suresh Patel", role: "Plumber, Ahmedabad", quote: "Very easy to set up. I started getting booking requests on day one after verification.", img: "/providers/plumber.png", rating: 5 },
  { name: "Meena Iyer", role: "Home Tutor, Bengaluru", quote: "The platform is simple to use and my students' parents trust the verified badge completely.", img: "/providers/tutor.png", rating: 5 },
];

const categories = [
  "Home Repairs & Maintenance", "Beauty & Wellness", "Education & Tutoring",
  "Healthcare & Medical", "Event Planning", "Fitness & Yoga",
  "Cleaning Services", "Photography", "Legal & Financial", "Other",
];

const payoutFeatures = [
  { icon: PhoneEnabledIcon, title: "100% Genuine Calls", desc: "Every call you receive is from a real customer actively looking for your service. No spam, no cold calls — only verified intent-based leads.", color: COLORS.PRIMARY_PURPLE },
  { icon: PaymentsOutlinedIcon, title: "Instant Post-Service Payout", desc: "Get paid immediately after you complete a service. No weekly or monthly cycles — your earnings are settled the moment the job is done.", color: "#22c55e" },
];

const premiumServices = [
  {
    icon: CampaignOutlinedIcon,
    title: "Meta & Google Ads",
    tag: "Paid Add-on",
    tagColor: "#f97316",
    desc: "Let our marketing team run targeted Meta (Facebook & Instagram) and Google ad campaigns to bring high-intent customers directly to your profile.",
    points: ["Geo-targeted ads for your city", "Custom audience based on your service", "Monthly performance reports"],
    color: "#f97316",
  },
  {
    icon: VideoLibraryOutlinedIcon,
    title: "Video Reels & Content",
    tag: "Paid Add-on",
    tagColor: "#ec4899",
    desc: "Our content team creates professional short-form video reels showcasing your work, boosting your visibility on Instagram and YouTube Shorts.",
    points: ["Professional shoot or remote edit", "Published across social platforms", "Increases profile trust & bookings"],
    color: "#ec4899",
  },
  {
    icon: WebOutlinedIcon,
    title: "Dedicated Portfolio Page",
    tag: "Included Free",
    tagColor: "#22c55e",
    desc: "Every verified provider gets a beautiful, shareable portfolio landing page — showcasing your services, photos, reviews, and contact info.",
    points: ["Custom URL with your business name", "Display portfolio & past work", "Direct booking button for customers"],
    color: "#00bcff",
  },
  {
    icon: SmartToyOutlinedIcon,
    title: "AI-Powered Discovery",
    tag: "Included Free",
    tagColor: "#22c55e",
    desc: "KartSquare's AI surfaces your profile to customers searching for services near their exact location — no manual effort required from you.",
    points: ["Location-based intelligent matching", "Available 24/7 on web & app", "Priority ranking for verified providers"],
    color: COLORS.PRIMARY_PURPLE,
  },
];

export default function JoinAsProviderView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const [form, setForm] = useState({ name: "", business: "", category: "", phone: "", email: "", city: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const pageRef = useScrollReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSuccess(true);
  };

  const pageBg = isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT;
  const cardBg = isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#ffffff";
  const border = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
  const primaryTxt = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const secondaryTxt = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff",
      "& fieldset": { borderColor: border },
      "&:hover fieldset": { borderColor: COLORS.PRIMARY_PURPLE },
      "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_PURPLE },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY_PURPLE },
  };

  return (
    <Box ref={pageRef} sx={{ bgcolor: pageBg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <Box
        data-animate
        sx={{
          position: "relative", overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg,#0d0520 0%,#1a0a35 50%,#0a1628 100%)"
            : "linear-gradient(135deg,#f0ebff 0%,#e8f4ff 60%,#fdf4ff 100%)",
          pt: { xs: 14, md: 8 }, pb: { xs: 6, md: 8 },
          minHeight: { md: "92vh" },
          display: "flex", alignItems: "center",
        }}
      >
        <Box sx={{ position: "absolute", top: -100, left: -80, width: 500, height: 500, borderRadius: "50%", bgcolor: `${COLORS.PRIMARY_PURPLE}15`, filter: "blur(100px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", bgcolor: "#00bcff12", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo — top-left */}
        <Box sx={{ position: "absolute", top: { xs: 20, md: 28 }, left: { xs: 20, md: 40 }, zIndex: 3 }}>
          <ExternalLogo mode={isDark ? "dark" : "light"} />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">

              {/* LEFT COPY */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box data-animate data-delay="100">
                  {/* Badge */}
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: "100px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, mb: 3 }}>
                    <BusinessCenterIcon sx={{ fontSize: 15, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, letterSpacing: 0.8, fontSize: "0.7rem" }}>FREE BUSINESS REGISTRATION</Typography>
                  </Box>

                  {/* Headline */}
                  <Typography component="h1" sx={{
                    fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
                    fontWeight: 800, lineHeight: 1.1, mb: 2.5,
                    color: primaryTxt,
                  }}>
                    Your Skills Deserve{" "}
                    <Box component="span" sx={{
                      background: `linear-gradient(130deg,${COLORS.PRIMARY_PURPLE} 0%,#00bcff 100%)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      More Customers
                    </Box>
                  </Typography>

                  <Typography variant="body1" sx={{ color: secondaryTxt, lineHeight: 1.8, mb: 4, fontSize: { md: "1.05rem" }, maxWidth: 480 }}>
                    Join 50,000+ verified service providers on <strong style={{ color: isDark ? "#fff" : "inherit" }}>kartsquare.com</strong> — India's most trusted marketplace for local services. List free, get genuine customer calls, and earn instantly after every job.
                  </Typography>

                  {/* Trust chips */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4.5 }}>
                    {[
                      { emoji: "✅", label: "100% Genuine Leads" },
                      { emoji: "💳", label: "Instant Payouts" },
                      { emoji: "🛡️", label: "Verified Badge" },
                    ].map((chip) => (
                      <Box key={chip.label} sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 2, py: 0.75, borderRadius: "100px", bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#ffffff", border: `1px solid ${border}`, boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <Typography sx={{ fontSize: "0.875rem" }}>{chip.emoji}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: primaryTxt, fontSize: "0.8rem" }}>{chip.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* CTAs */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Box
                      onClick={() => document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" })}
                      sx={{
                        display: "inline-flex", alignItems: "center", gap: 1.5, px: 4, py: 1.75,
                        borderRadius: "14px", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "#fff",
                        background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE} 0%,#00bcff 100%)`,
                        boxShadow: `0 8px 32px ${COLORS.PRIMARY_PURPLE}40`,
                        transition: "all 0.2s", "&:hover": { opacity: 0.9, transform: "translateY(-2px)" },
                      }}
                    >
                      <BusinessCenterIcon sx={{ fontSize: 20 }} />
                      Register Free Today
                    </Box>
                    <Box
                      onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                      sx={{
                        display: "inline-flex", alignItems: "center", px: 3, py: 1.75,
                        borderRadius: "14px", cursor: "pointer", fontWeight: 600, fontSize: "0.9375rem",
                        color: COLORS.PRIMARY_PURPLE, bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "#fff",
                        border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                        transition: "all 0.2s", "&:hover": { bgcolor: isDark ? COLORS.PURPLE_ALPHA_20 : COLORS.PURPLE_ALPHA_04, transform: "translateY(-2px)" },
                      }}
                    >
                      How It Works
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* RIGHT — Visual */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box data-animate data-delay="200">
                  <Box sx={{ position: "relative" }}>
                    <Box sx={{
                      borderRadius: "24px", overflow: "hidden", height: { xs: 280, md: 460 }, position: "relative",
                      boxShadow: isDark ? `0 24px 64px ${COLORS.PRIMARY_PURPLE}30` : "0 24px 64px rgba(94,24,233,0.2)",
                    }}>
                      <Image src="/providers/electrician.png" alt="KartSquare Provider" fill priority style={{ objectFit: "cover" }} />
                      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(94,24,233,0.55) 0%,transparent 55%)" }} />
                      <Box sx={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                        <Typography variant="body2" sx={{ color: "#fff", fontStyle: "italic", lineHeight: 1.65, textShadow: "0 1px 4px rgba(0,0,0,0.5)", mb: 0.5 }}>
                          "KartSquare doubled my bookings in 2 months. The leads are real and I get paid the same day."
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
                          — Rajesh Kumar, Electrician · Mumbai
                        </Typography>
                      </Box>
                    </Box>

                    {/* Floating stat — top right */}
                    <Box sx={{
                      position: "absolute", top: { xs: 16, md: 28 }, right: { xs: 16, md: -28 },
                      bgcolor: cardBg, borderRadius: "16px", p: "14px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                      border: `1px solid ${border}`,
                    }}>
                      <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: COLORS.PRIMARY_PURPLE, lineHeight: 1 }}>50K+</Typography>
                      <Typography variant="caption" sx={{ color: secondaryTxt }}>Active Providers</Typography>
                    </Box>

                    {/* Floating stat — bottom left */}
                    <Box sx={{
                      position: "absolute", bottom: { xs: 80, md: 100 }, left: { xs: 16, md: -28 },
                      bgcolor: cardBg, borderRadius: "16px", p: "14px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                      border: `1px solid ${border}`,
                    }}>
                      <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#22c55e", lineHeight: 1 }}>2M+</Typography>
                      <Typography variant="caption" sx={{ color: secondaryTxt }}>Monthly Customers</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

            </Grid>
        </Container>
      </Box>

      {/* ── STATS ── */}
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

        {/* ── BENEFITS ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Why Join KartSquare?</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5, maxWidth: 500, mx: "auto" }}>
                Everything you need to grow your service business in one place.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {benefits.map((b, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Box data-animate data-delay={String(i * 80)}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px",
                      p: 0.5, transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${b.color},${COLORS.PRIMARY_PURPLE})`, transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" },
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 16px 40px ${b.color}22`, "&::before": { transform: "scaleX(1)" } },
                    }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <Box sx={{ width: 52, height: 52, borderRadius: "14px", bgcolor: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <b.icon sx={{ color: b.color, fontSize: 26 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1, fontSize: "1rem" }}>{b.title}</Typography>
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.65 }}>{b.desc}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── HOW IT WORKS ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>How It Works</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 6, maxWidth: 460, mx: "auto" }}>
                Get started in minutes. It's simple and completely free.
              </Typography>
            </Box>
            <Grid container spacing={4} justifyContent="center">
              {steps.map((s, i) => (
                <Grid size={{ xs: 12, sm: 4 }} key={i}>
                  <Box data-animate data-delay={String(i * 100)}>
                    <Box sx={{ textAlign: "center", px: 2 }}>
                      <Box sx={{
                        width: 72, height: 72, borderRadius: "50%", mx: "auto", mb: 2.5,
                        background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE} 0%,#00bcff 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}35`,
                      }}>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{s.step}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1 }}>{s.title}</Typography>
                      <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.7 }}>{s.desc}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── GENUINE CALLS + INSTANT PAYOUT ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Built for Your Peace of Mind</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5, maxWidth: 520, mx: "auto" }}>
                No surprises, no delays. KartSquare is designed around what matters most to providers.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {payoutFeatures.map((f, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box data-animate data-delay={String(i * 100)}>
                    <Box sx={{
                      bgcolor: cardBg, border: `2px solid ${f.color}30`, borderRadius: "20px", p: { xs: 3, sm: 4 },
                      position: "relative", overflow: "hidden", height: "100%",
                      background: isDark
                        ? `linear-gradient(135deg, ${f.color}10 0%, transparent 60%)`
                        : `linear-gradient(135deg, ${f.color}08 0%, transparent 60%)`,
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: `0 16px 40px ${f.color}22`, border: `2px solid ${f.color}60` },
                    }}>
                      <Box sx={{ width: 60, height: 60, borderRadius: "16px", bgcolor: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                        <f.icon sx={{ color: f.color, fontSize: 30 }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: primaryTxt, mb: 1.5 }}>{f.title}</Typography>
                      <Typography variant="body1" sx={{ color: secondaryTxt, lineHeight: 1.75 }}>{f.desc}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── PREMIUM SERVICES ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Supercharge Your Growth</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5, maxWidth: 560, mx: "auto" }}>
                Free tools get you started. Our premium add-ons take your business to the next level.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {premiumServices.map((s, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box data-animate data-delay={String(i * 80)}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "20px",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: `0 20px 48px ${s.color}20`, border: `1px solid ${s.color}50` },
                    }}>
                      <CardContent sx={{ p: "28px !important" }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                          <Box sx={{ width: 52, height: 52, borderRadius: "14px", bgcolor: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <s.icon sx={{ color: s.color, fontSize: 26 }} />
                          </Box>
                          <Box sx={{ px: 1.5, py: 0.5, borderRadius: "100px", bgcolor: `${s.tagColor}18`, border: `1px solid ${s.tagColor}40` }}>
                            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: s.tagColor, letterSpacing: 0.5 }}>{s.tag}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1 }}>{s.title}</Typography>
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.7, mb: 2.5 }}>{s.desc}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                          {s.points.map((p, j) => (
                            <Box key={j} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <CheckIcon sx={{ fontSize: 13, color: s.color }} />
                              </Box>
                              <Typography variant="caption" sx={{ color: secondaryTxt, fontSize: "0.8125rem" }}>{p}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── TESTIMONIALS ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
            <Box data-animate>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>Providers Who Trust Us</Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5 }}>
                Real stories from real service providers across India.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {testimonials.map((t, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Box data-animate data-delay={String(i * 80)}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px",
                      transition: "all 0.25s ease",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: `0 12px 36px ${COLORS.PRIMARY_PURPLE}18` },
                    }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <FormatQuoteIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 32, mb: 1.5, opacity: 0.6 }} />
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.75, mb: 3, fontStyle: "italic" }}>
                          "{t.quote}"
                        </Typography>
                        <Box sx={{ display: "flex", mb: 1.5 }}>
                          {[...Array(t.rating)].map((_, j) => (
                            <StarIcon key={j} sx={{ fontSize: 16, color: "#f59e0b" }} />
                          ))}
                        </Box>
                        <Divider sx={{ borderColor: border, mb: 2 }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `2px solid ${COLORS.PURPLE_ALPHA_20}` }}>
                            <Image src={t.img} alt={t.name} width={48} height={48} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: primaryTxt, lineHeight: 1.2 }}>{t.name}</Typography>
                            <Typography variant="caption" sx={{ color: secondaryTxt }}>{t.role}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>

        {/* ── REGISTRATION FORM ── */}
        <Box id="registration-form">
          <Box data-animate>
              <Box sx={{
                bgcolor: cardBg, border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                borderRadius: "24px", p: { xs: 3, sm: 5 },
                boxShadow: isDark ? `0 8px 48px ${COLORS.PRIMARY_PURPLE}25` : `0 8px 48px ${COLORS.PRIMARY_PURPLE}15`,
                maxWidth: 780, mx: "auto",
              }}>
                {/* Form header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "16px", background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)`, mb: 2 }}>
                    <StoreIcon sx={{ color: "#fff", fontSize: 26 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: primaryTxt, mb: 0.5 }}>Register Your Business</Typography>
                  <Typography variant="body2" sx={{ color: secondaryTxt }}>
                    Fill in your details below. Our team will verify and activate your listing within 24 hours.
                  </Typography>
                </Box>

                {success ? (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 72, color: COLORS.SUCCESS_GREEN, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: primaryTxt, mb: 1 }}>Registration Submitted!</Typography>
                    <Typography variant="body1" sx={{ color: secondaryTxt, mb: 4 }}>
                      Our team will verify your business and contact you within 24 hours.
                    </Typography>
                    <Box
                      onClick={() => router.push("/External/GlobalAboutUs")}
                      sx={{ display: "inline-block", px: 5, py: 1.5, bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", borderRadius: "12px", cursor: "pointer", fontWeight: 700, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}
                    >
                      Explore About Us
                    </Box>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit}>
                    {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3, borderRadius: "10px" }}>{error}</Alert>}
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth name="name" label="Your Full Name *" value={form.name} onChange={handleChange}
                          InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth name="business" label="Business Name *" value={form.business} onChange={handleChange}
                          InputProps={{ startAdornment: <InputAdornment position="start"><StoreIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth select name="category" label="Service Category *" value={form.category}
                          onChange={handleChange as any} sx={inputSx}>
                          {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth name="city" label="City *" value={form.city} onChange={handleChange}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth name="phone" label="Phone Number *" value={form.phone} onChange={handleChange} type="tel" inputProps={{ maxLength: 10 }}
                          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth name="email" label="Email Address *" value={form.email} onChange={handleChange} type="email"
                          InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth multiline rows={3} name="description" label="Tell us about your business" value={form.description} onChange={handleChange}
                          placeholder="Describe your services, experience, areas you cover..." sx={inputSx} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box
                          id="provider-register-btn"
                          component="button"
                          type="submit"
                          disabled={submitting}
                          sx={{
                            width: "100%", py: 1.875, border: "none", borderRadius: "12px", color: "#fff", fontSize: "1rem", fontWeight: 700,
                            cursor: submitting ? "not-allowed" : "pointer",
                            background: submitting ? COLORS.PURPLE_ALPHA_30 : `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE} 0%,#00bcff 100%)`,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            boxShadow: `0 6px 24px ${COLORS.PRIMARY_PURPLE}35`,
                            transition: "all 0.2s ease",
                            "&:hover:not(:disabled)": { opacity: 0.9, transform: "translateY(-2px)" },
                          }}
                        >
                          <SendOutlinedIcon sx={{ fontSize: 18 }} />
                          {submitting ? "Submitting…" : "Submit Registration"}
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" sx={{ color: secondaryTxt, display: "block", textAlign: "center" }}>
                          By submitting, you agree to our Terms of Service and Privacy Policy. Your listing is completely free.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
