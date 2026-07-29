"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, useInView, animate, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";

import VerifiedIcon from "@mui/icons-material/Verified";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PublicIcon from "@mui/icons-material/Public";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import ConstructionIcon from "@mui/icons-material/Construction";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import SchoolIcon from "@mui/icons-material/School";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

// ─────────────────────────────────────────────────────────────────────────
// Motion presets
// ─────────────────────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } } };

// ─────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: VerifiedIcon, label: "Trusted by thousands" },
  { icon: BoltIcon, label: "Fast" },
  { icon: ShieldIcon, label: "Secure" },
  { icon: FavoriteIcon, label: "Customer first" },
];

const storySteps = [
  { title: "The problem we noticed", text: "Finding a reliable electrician, tutor or salon in your own neighbourhood still meant asking around, hoping for a good referral, or gambling on a stranger's phone number." },
  { title: "Why existing options fell short", text: "Directories listed anyone who paid to be listed. No verification, no accountability, no way to tell a genuine local pro from a dead number." },
  { title: "How the founders met", text: "Pratham, Yash and Gaurang grew up watching Jaipur's local businesses hustle for word-of-mouth — and knew technology owed them better distribution." },
  { title: "The first idea", text: "What if every local service provider got the same discovery, trust and reviews that changed how India orders food — built for services instead?" },
  { title: "Building the MVP", text: "A lean, scrappy first version — verified provider profiles, real reviews, and a search that actually understood 'electrician near me'." },
  { title: "The first customer", text: "A Jaipur electrician got his first booking through KartSquare within a week of signing up. That phone call is still the reason we ship what we ship." },
  { title: "Growth", text: "Word spread between providers before it spread between customers. Referrals compounded across categories and cities." },
  { title: "Today", text: "50,000+ verified providers and 2 million monthly customers across 200+ cities — still led out of Jaipur." },
];

const existReasons = [
  { icon: EmojiObjectsIcon, title: "Mission", text: "Make finding a trustworthy local service as easy as finding a restaurant." },
  { icon: VisibilityIcon, title: "Vision", text: "Every local business in India, one search away from the customer looking for them." },
  { icon: AutoAwesomeIcon, title: "Purpose", text: "Give small businesses the same discovery power big brands take for granted." },
  { icon: HandshakeIcon, title: "Core belief", text: "Trust isn't a feature — it's the whole product. Everything else is built on top of it." },
];

const problems = [
  { title: "No way to verify who you're calling", text: "Phone numbers on flyers and old directories don't tell you if a provider is real, active, or any good." },
  { title: "Word-of-mouth doesn't scale", text: "A great local business stays invisible outside its street unless someone happens to recommend it." },
  { title: "Middlemen eat the margin", text: "Lead-selling agents route jobs to whoever pays most — not whoever does the best work." },
  { title: "No accountability after the booking", text: "If the job goes wrong, there's no review, no record, and no recourse." },
];

const solutionFeatures = [
  { icon: VerifiedIcon, title: "Verification, not just listings", text: "Every provider is checked before they can appear in a search result." },
  { icon: SearchIcon, title: "AI-powered discovery", text: "Customers get matched to providers who actually serve their need, not just their category." },
  { icon: BoltIcon, title: "Instant payouts", text: "Providers get paid fast — no chasing, no 30-day waits." },
  { icon: FactCheckIcon, title: "Reviews that stick", text: "Every completed job leaves a permanent, verified review tied to the real customer." },
];

const beforeAfter = {
  before: ["Ask around and hope for a good referral", "No way to verify who you're hiring", "Providers invisible outside their street", "Payouts delayed for weeks", "No record if something goes wrong"],
  after: ["Search and get matched in seconds", "Every provider verified before listing", "Discoverable across the whole city", "Payouts land instantly", "Every job backed by a real review"],
};

const values = [
  { icon: FavoriteIcon, title: "Customer Obsession", text: "We build for the person on the other end of the search bar, not the roadmap." },
  { icon: RocketLaunchIcon, title: "Innovation", text: "If it's slower or clunkier than it needs to be, we haven't finished building it." },
  { icon: VisibilityIcon, title: "Transparency", text: "Verified means verified. Reviews are real. No shortcuts on trust." },
  { icon: BoltIcon, title: "Speed", text: "A provider's phone should ring within minutes, not days." },
  { icon: HandshakeIcon, title: "Ownership", text: "Every person here owns outcomes, not just tasks." },
  { icon: ShieldIcon, title: "Trust", text: "It's the hardest thing to earn and the easiest to lose — we protect it first." },
];

const founders = [
  {
    name: "Pratham", role: "Founder & CEO", initial: "P", bg: COLORS.PRIMARY_PURPLE,
    quote: "We're not building an app. We're building the front door to every local business in India.",
    bio: "Leads product and company direction, obsessed with making the first search result the right one.",
    funFact: "Still personally reads every one-star review.",
  },
  {
    name: "Yash", role: "Co-Founder", initial: "Y", bg: "#e63946",
    quote: "Every feature we ship has to make a provider's phone ring. That's the only metric that matters.",
    bio: "Builds the product and engineering systems that keep discovery fast and reliable at scale.",
    funFact: "Ships code the same week an idea comes up.",
  },
  {
    name: "Gaurang", role: "Co-Founder", initial: "G", bg: "#0d9488",
    quote: "We started in Jaipur because we understood the local hustle first-hand. Now we're taking it nationwide.",
    bio: "Runs growth and provider relationships — the person most local businesses talk to first.",
    funFact: "Has personally onboarded provider #1 in more than 20 cities.",
  },
];

const culturePillars = [
  { icon: HomeWorkIcon, title: "Remote-friendly", text: "We hire for output, not seat time. Work from where you do your best thinking." },
  { icon: SelfImprovementIcon, title: "Work-life balance", text: "Sustainable pace beats burnout sprints — we're building for the long run." },
  { icon: EmojiObjectsIcon, title: "Always learning", text: "Every team ships, reflects, and adjusts — no idea survives contact with real users unchanged." },
  { icon: Diversity2Icon, title: "Ownership over approval", text: "Small team, real autonomy. You own the outcome, not just the ticket." },
];

const stats = [
  { icon: PeopleAltIcon, value: 2, suffix: "M+", label: "Monthly customers" },
  { icon: VerifiedIcon, value: 50, suffix: "K+", label: "Verified providers" },
  { icon: PublicIcon, value: 200, suffix: "+", label: "Cities live" },
  { icon: RocketLaunchIcon, value: 2022, suffix: "", label: "Founded, in Jaipur" },
];

const milestones = [
  { label: "Idea", year: "2022" },
  { label: "MVP built", year: "2022" },
  { label: "Public launch", year: "2022" },
  { label: "10,000 providers", year: "2023" },
  { label: "50 cities", year: "2023" },
  { label: "AI discovery + reels", year: "2024" },
  { label: "200+ cities", year: "2025" },
  { label: "Today", year: "2025" },
];

const process = [
  { icon: SearchIcon, title: "Discover", text: "We start with real conversations — providers and customers, not assumptions." },
  { icon: ConstructionIcon, title: "Build", text: "Small, fast iterations shipped by the people closest to the problem." },
  { icon: FactCheckIcon, title: "Test", text: "Every feature earns its place with real usage data before it scales." },
  { icon: RocketLaunchIcon, title: "Launch", text: "We ship in weeks, not quarters — and watch closely once it's live." },
  { icon: TrendingUpIcon, title: "Improve", text: "Nothing is ever really 'done' — we iterate on what the data tells us." },
];

const categories = [
  { icon: ElectricalServicesIcon, label: "Electricians" },
  { icon: ContentCutIcon, label: "Salons & Spas" },
  { icon: SchoolIcon, label: "Tutors" },
  { icon: PlumbingIcon, label: "Plumbers" },
  { icon: CleaningServicesIcon, label: "Home Cleaning" },
  { icon: StorefrontIcon, label: "Local Shops" },
];

const faqs = [
  { q: "What is KartSquare?", a: "KartSquare is a marketplace connecting verified local service providers — electricians, salons, tutors and more — with customers searching for them, across 200+ Indian cities." },
  { q: "How does provider verification work?", a: "Every provider goes through a checks before they can appear in search results and receive bookings, so customers know they're dealing with a real, accountable business." },
  { q: "Is KartSquare free for customers?", a: "Yes. Searching, browsing profiles and reviews, and contacting providers is free for customers." },
  { q: "How do providers get paid?", a: "Providers receive payouts directly and quickly — no 30-day waits, no chasing invoices." },
  { q: "Which cities is KartSquare available in?", a: "We're live in 200+ cities across India and growing, with new cities added regularly." },
  { q: "How do I list my business on KartSquare?", a: "Head to the Business Listing page from the navbar to create a free provider profile and start getting discovered." },
];

// ─────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <Typography ref={ref} component="div" sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, fontWeight: 900, color, lineHeight: 1 }}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </Typography>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Reusable animated section wrapper
// ─────────────────────────────────────────────────────────────────────────
function Reveal({ children, variants = fadeUp, amount = 0.2 }: { children: React.ReactNode; variants?: typeof fadeUp | typeof stagger; amount?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FAQ accordion item
// ─────────────────────────────────────────────────────────────────────────
function FaqItem({ q, a, border, primaryTxt, secondaryTxt }: { q: string; a: string; border: string; primaryTxt: string; secondaryTxt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      onClick={() => setOpen((o) => !o)}
      sx={{
        border: `1.5px solid ${border}`, borderRadius: "20px", px: { xs: 2.5, md: 3.5 }, py: { xs: 2, md: 2.5 },
        cursor: "pointer", transition: "border-color 0.2s, background-color 0.2s",
        bgcolor: open ? COLORS.PURPLE_ALPHA_04 : "transparent",
        "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.1rem" }, color: primaryTxt }}>{q}</Typography>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, display: "flex" }}>
          <ExpandMoreIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
        </motion.div>
      </Box>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0, marginTop: open ? 12 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: "hidden" }}
      >
        <Typography sx={{ color: secondaryTxt, fontSize: "0.98rem", lineHeight: 1.7 }}>{a}</Typography>
      </motion.div>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section heading helper
// ─────────────────────────────────────────────────────────────────────────
function SectionHeading({ kicker, title, sub, primaryTxt, secondaryTxt }: { kicker: string; title: string; sub?: string; primaryTxt: string; secondaryTxt: string }) {
  return (
    <Reveal>
      <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: { xs: "left", md: "center" }, maxWidth: 720, mx: { md: "auto" } }}>
        <Typography sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800, letterSpacing: 2.5, fontSize: "0.78rem", mb: 1.5, textTransform: "uppercase" }}>
          {kicker}
        </Typography>
        <Typography sx={{ fontSize: { xs: "1.9rem", md: "2.75rem" }, fontWeight: 900, color: primaryTxt, letterSpacing: "-0.02em", lineHeight: 1.15, mb: sub ? 1.5 : 0 }}>
          {title}
        </Typography>
        {sub && (
          <Typography sx={{ color: secondaryTxt, fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.6 }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function AboutUsView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, reduceMotion ? 1 : 0.25]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, reduceMotion ? 1 : 0.94]);
  const heroY = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : 60]);

  const primaryTxt = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const secondaryTxt = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;
  const border = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)";
  const glassBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)";
  const pageBg = isDark
    ? COLORS.BACKGROUND.PRIMARY_DARK
    : "linear-gradient(180deg, #faf8ff 0%, #ffffff 18%, #ffffff 82%, #fff7ef 100%)";

  return (
    <Box sx={{ minHeight: "100vh", overflow: "hidden", background: pageBg }}>

      {/* ══════════════════════════ SECTION 1 — HERO ══════════════════════════ */}
      <Box ref={heroRef} sx={{ position: "relative", pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, overflow: "hidden" }}>
        {/* floating abstract gradient blobs */}
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -24, 0], x: [0, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", left: "-8%", width: 380, height: 380, borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.PURPLE_ALPHA_30} 0%, transparent 70%)`, filter: "blur(20px)", zIndex: 0,
          }}
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 28, 0], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "5%", right: "-10%", width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)", filter: "blur(20px)", zIndex: 0,
          }}
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: "-15%", left: "30%", width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 70%)", filter: "blur(20px)", zIndex: 0,
          }}
        />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 1, px: 2.5, py: 1, borderRadius: "100px",
                bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                boxShadow: "0 8px 24px rgba(94,24,233,0.08)", mb: 4,
              }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e" }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: secondaryTxt }}>
                  Live in 200+ Indian cities
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography component="h1" sx={{
                fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.6rem" }, fontWeight: 900, lineHeight: 1.05,
                letterSpacing: "-0.03em", color: primaryTxt, mb: 3,
              }}>
                We&apos;re building the future of{" "}
                <Box component="span" sx={{
                  background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.SECONDARY_ORANGE})`,
                  backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                }}>
                  local discovery
                </Box>
                .
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography sx={{ color: secondaryTxt, fontSize: { xs: "1.05rem", md: "1.3rem" }, lineHeight: 1.65, maxWidth: 640, mx: "auto", mb: 5 }}>
                Millions of people search for a trustworthy electrician, salon or tutor every day — and can&apos;t tell who&apos;s real. KartSquare verifies local service providers and puts them in front of the customers already looking.
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 6 }}>
                <Box
                  onClick={() => router.push("/supplier/register")}
                  sx={{
                    px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 800, fontSize: "1rem",
                    color: "#fff", background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
                    boxShadow: "0 10px 30px rgba(94,24,233,0.35)", transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 36px rgba(94,24,233,0.45)" },
                  }}
                >
                  Get Started
                </Box>
                <Box
                  onClick={() => router.push("/contact-us")}
                  sx={{
                    px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 800, fontSize: "1rem",
                    color: primaryTxt, bgcolor: cardBg, border: `1.5px solid ${border}`, backdropFilter: "blur(12px)",
                    transition: "transform 0.2s, border-color 0.2s",
                    "&:hover": { transform: "translateY(-2px)", borderColor: COLORS.PRIMARY_PURPLE },
                  }}
                >
                  Contact Us
                </Box>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Box sx={{ display: "flex", gap: { xs: 2.5, md: 4 }, justifyContent: "center", flexWrap: "wrap" }}>
                {trustBadges.map((b, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <b.icon sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: secondaryTxt }}>{b.label}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        </Container>
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>

        {/* ══════════════════════════ SECTION 9 — NUMBERS (moved up, high-signal) ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {stats.map((s, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={i}>
                  <motion.div variants={scaleIn} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "24px", p: { xs: 2.5, md: 3.5 }, height: "100%",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.04)", transition: "transform 0.25s",
                      "&:hover": { transform: "translateY(-6px)" },
                    }}>
                      <s.icon sx={{ display: "block", color: COLORS.PRIMARY_PURPLE, fontSize: 26, mb: 1.5 }} />
                      <AnimatedCounter value={s.value} suffix={s.suffix} color={primaryTxt} />
                      <Typography sx={{ color: secondaryTxt, fontSize: { xs: "0.85rem", md: "0.95rem" }, fontWeight: 600, mt: 0.5 }}>
                        {s.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 2 — OUR STORY ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Our Story" title="From one Jaipur street to 200+ cities" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Box sx={{ position: "relative", maxWidth: 760, mx: "auto" }}>
            <Box sx={{
              position: "absolute", left: { xs: 11, md: "50%" }, top: 0, bottom: 0, width: 2,
              bgcolor: border, transform: { md: "translateX(-50%)" },
            }} />
            {storySteps.map((s, i) => (
              <Reveal key={i} amount={0.3}>
                <Box sx={{
                  position: "relative", display: "flex", mb: { xs: 4, md: 5 },
                  flexDirection: { xs: "row", md: i % 2 === 0 ? "row" : "row-reverse" },
                  alignItems: "flex-start", gap: { xs: 3, md: 4 },
                }}>
                  <Box sx={{
                    position: { xs: "static", md: "relative" }, flexShrink: 0, zIndex: 1,
                    ml: { xs: 0, md: 0 }, order: { xs: 0, md: 0 },
                  }}>
                    <Box sx={{
                      width: 24, height: 24, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE,
                      border: `4px solid ${isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#fff"}`,
                      boxShadow: `0 0 0 2px ${COLORS.PRIMARY_PURPLE}`,
                    }} />
                  </Box>
                  <Box sx={{
                    flex: 1, bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                    borderRadius: "20px", p: { xs: 2.5, md: 3 }, boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    textAlign: { xs: "left", md: i % 2 === 0 ? "left" : "right" },
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.05rem", md: "1.15rem" }, color: primaryTxt, mb: 0.75 }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ color: secondaryTxt, fontSize: "0.95rem", lineHeight: 1.65 }}>
                      {s.text}
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }} />
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>

        {/* ══════════════════════════ SECTION 3 — WHY WE EXIST ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Why We Exist" title="The reasons behind every decision" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {existReasons.map((r, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "24px", p: 3.5, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      transition: "transform 0.25s, box-shadow 0.25s",
                      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 32px rgba(94,24,233,0.12)" },
                    }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`, mb: 2.5,
                      }}>
                        <r.icon sx={{ color: "#fff", fontSize: 24 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: primaryTxt, mb: 1 }}>{r.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.92rem", lineHeight: 1.6 }}>{r.text}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 4 — THE PROBLEM ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="The Problem" title="Local discovery has been broken for years" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {problems.map((p, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: isDark ? "rgba(230,57,70,0.06)" : "rgba(230,57,70,0.04)", border: "1px solid rgba(230,57,70,0.2)",
                      borderRadius: "20px", p: 3, height: "100%", display: "flex", gap: 2,
                    }}>
                      <CloseIcon sx={{ color: "#e63946", fontSize: 22, flexShrink: 0, mt: 0.3 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: primaryTxt, mb: 0.5 }}>{p.title}</Typography>
                        <Typography sx={{ color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.6 }}>{p.text}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 5 — OUR SOLUTION ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Our Solution" title="What KartSquare does differently" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5} sx={{ mb: 6 }}>
              {solutionFeatures.map((f, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: isDark ? "rgba(13,148,136,0.06)" : "rgba(13,148,136,0.05)", border: "1px solid rgba(13,148,136,0.2)",
                      borderRadius: "20px", p: 3, height: "100%",
                    }}>
                      <f.icon sx={{ color: "#0d9488", fontSize: 26, mb: 1.5 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: primaryTxt, mb: 0.5 }}>{f.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.88rem", lineHeight: 1.6 }}>{f.text}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>

          {/* Before vs After */}
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div variants={fadeUp} style={{ height: "100%" }}>
                  <Box sx={{ border: `1.5px solid ${border}`, borderRadius: "24px", p: { xs: 3, md: 3.5 }, height: "100%" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: secondaryTxt, mb: 2.5 }}>Before KartSquare</Typography>
                    {beforeAfter.before.map((t, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.75 }}>
                        <CloseIcon sx={{ color: "#e63946", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                        <Typography sx={{ color: secondaryTxt, fontSize: "0.92rem", lineHeight: 1.5 }}>{t}</Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div variants={fadeUp} style={{ height: "100%" }}>
                  <Box sx={{
                    border: `1.5px solid ${COLORS.PRIMARY_PURPLE}`, borderRadius: "24px", p: { xs: 3, md: 3.5 }, height: "100%",
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: COLORS.PRIMARY_PURPLE, mb: 2.5 }}>With KartSquare</Typography>
                    {beforeAfter.after.map((t, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.75 }}>
                        <CheckIcon sx={{ color: "#0d9488", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                        <Typography sx={{ color: primaryTxt, fontSize: "0.92rem", lineHeight: 1.5, fontWeight: 500 }}>{t}</Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ CATEGORIES ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="What's on KartSquare" title="Whatever the job, it's here" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2}>
              {categories.map((c, i) => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "20px", p: { xs: 2.5, md: 3 }, height: "100%", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5,
                      transition: "transform 0.2s, border-color 0.2s",
                      "&:hover": { transform: "translateY(-4px)", borderColor: COLORS.PRIMARY_PURPLE },
                    }}>
                      <c.icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.88rem", md: "0.95rem" }, color: primaryTxt }}>{c.label}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 6 — OUR VALUES ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Our Values" title="What we won't compromise on" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {values.map((v, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "24px", p: 3.5, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      transition: "transform 0.25s, box-shadow 0.25s",
                      "&:hover": { transform: "translateY(-6px) scale(1.015)", boxShadow: "0 14px 34px rgba(94,24,233,0.14)" },
                    }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: COLORS.PURPLE_ALPHA_10, mb: 2.5,
                      }}>
                        <v.icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: primaryTxt, mb: 1 }}>{v.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.6 }}>{v.text}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 7 — FOUNDERS ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Meet the Founders" title="The trio behind KartSquare" sub="Pratham leads KartSquare, building alongside co-founders Yash and Gaurang." primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={3}>
              {founders.map((f, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} whileHover={{ y: -6 }} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "28px", p: { xs: 3, md: 3.5 }, height: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                      display: "flex", flexDirection: "column",
                    }}>
                      <Box sx={{
                        width: 84, height: 84, borderRadius: "50%", bgcolor: f.bg, display: "flex",
                        alignItems: "center", justifyContent: "center", mb: 2.5, mx: "auto",
                        boxShadow: `0 8px 24px ${f.bg}55`,
                      }}>
                        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "2rem" }}>{f.initial}</Typography>
                      </Box>
                      <Typography sx={{ textAlign: "center", fontWeight: 800, fontSize: "1.2rem", color: primaryTxt }}>{f.name}</Typography>
                      <Typography sx={{ textAlign: "center", color: COLORS.PRIMARY_PURPLE, fontWeight: 700, fontSize: "0.85rem", mb: 2 }}>{f.role}</Typography>

                      <Typography sx={{ fontStyle: "italic", color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.6, textAlign: "center", mb: 2 }}>
                        &ldquo;{f.quote}&rdquo;
                      </Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.85rem", lineHeight: 1.6, textAlign: "center", mb: 2 }}>
                        {f.bio}
                      </Typography>

                      <Box sx={{ mt: "auto", pt: 2, borderTop: `1px solid ${border}` }}>
                        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: primaryTxt, textAlign: "center" }}>
                          Fun fact: <Box component="span" sx={{ fontWeight: 500, color: secondaryTxt }}>{f.funFact}</Box>
                        </Typography>
                      </Box>

                      <Box
                        onClick={() => router.push("/contact-us")}
                        sx={{
                          mt: 2.5, textAlign: "center", py: 1.2, borderRadius: "100px", cursor: "pointer",
                          fontWeight: 700, fontSize: "0.85rem", color: COLORS.PRIMARY_PURPLE, border: `1.5px solid ${COLORS.PRIMARY_PURPLE}`,
                          transition: "background-color 0.2s",
                          "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
                        }}
                      >
                        Get in touch
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 8 — TEAM CULTURE ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Team Culture" title="How we work" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {culturePillars.map((c, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "22px", p: 3, height: "100%",
                    }}>
                      <c.icon sx={{ color: COLORS.SECONDARY_ORANGE, fontSize: 26, mb: 1.5 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: primaryTxt, mb: 0.5 }}>{c.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.88rem", lineHeight: 1.6 }}>{c.text}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 10 — MILESTONES ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Milestones" title="The road so far" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Typography sx={{ display: { xs: "block", md: "none" }, color: secondaryTxt, fontSize: "0.78rem", fontWeight: 600, mb: 1.5, textAlign: "center" }}>
            ← swipe to explore →
          </Typography>
          <Reveal>
            <Box sx={{ position: "relative" }}>
              <Box sx={{
                overflowX: "auto", pb: 2, scrollSnapType: { xs: "x mandatory", md: "none" },
                "&::-webkit-scrollbar": { height: 6 }, "&::-webkit-scrollbar-thumb": { bgcolor: border, borderRadius: 3 },
              }}>
                <Box sx={{ display: "flex", gap: 0, minWidth: { xs: 760, md: "auto" }, position: "relative" }}>
                  <Box sx={{ position: "absolute", top: 7, left: 0, right: 0, height: 2, bgcolor: border }} />
                  {milestones.map((m, i) => (
                    <Box key={i} sx={{ flex: 1, position: "relative", px: 1.5, scrollSnapAlign: "start" }}>
                      <Box sx={{
                        width: 16, height: 16, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE,
                        border: `3px solid ${isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#fff"}`, mb: 2, position: "relative", zIndex: 1,
                      }} />
                      <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", color: COLORS.PRIMARY_PURPLE, mb: 0.5 }}>{m.year}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: primaryTxt, lineHeight: 1.4 }}>{m.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{
                display: { xs: "block", md: "none" }, position: "absolute", top: 0, right: 0, bottom: 8, width: 36,
                background: isDark ? "linear-gradient(90deg, transparent, #172023)" : "linear-gradient(90deg, transparent, #fff)",
                pointerEvents: "none",
              }} />
            </Box>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 12 — OUR PROCESS ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="Our Process" title="How we build" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {process.map((p, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${glassBorder}`, backdropFilter: "blur(12px)",
                      borderRadius: "22px", p: 3, height: "100%", textAlign: "center",
                      transition: "transform 0.25s",
                      "&:hover": { transform: "translateY(-6px)" },
                    }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                        bgcolor: COLORS.PURPLE_ALPHA_10, mx: "auto", mb: 2,
                      }}>
                        <p.icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: COLORS.PRIMARY_PURPLE, mb: 0.5 }}>
                        {String(i + 1).padStart(2, "0")}
                      </Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: primaryTxt, mb: 0.75 }}>{p.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.85rem", lineHeight: 1.55 }}>{p.text}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 14 — CAREERS ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <Reveal>
            <Box sx={{
              borderRadius: "32px", p: { xs: 4, md: 7 }, textAlign: "center", position: "relative", overflow: "hidden",
              background: isDark
                ? "linear-gradient(135deg, rgba(94,24,233,0.12), rgba(249,115,22,0.08))"
                : "linear-gradient(135deg, rgba(94,24,233,0.06), rgba(249,115,22,0.05))",
              border: `1px solid ${glassBorder}`,
            }}>
              <Typography sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800, letterSpacing: 2.5, fontSize: "0.78rem", mb: 1.5, textTransform: "uppercase" }}>
                Careers
              </Typography>
              <Typography sx={{ fontSize: { xs: "1.9rem", md: "2.5rem" }, fontWeight: 900, color: primaryTxt, mb: 1.5, letterSpacing: "-0.01em" }}>
                Join us
              </Typography>
              <Typography sx={{ color: secondaryTxt, mb: 4, maxWidth: 520, mx: "auto", fontSize: "1.02rem", lineHeight: 1.6 }}>
                We&apos;re a small, fast-moving team out of Jaipur building for all of India. If that sounds like your kind of problem, we&apos;d love to hear from you.
              </Typography>
              <Box
                onClick={() => router.push("/contact-us")}
                sx={{
                  display: "inline-block", px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer",
                  fontWeight: 800, fontSize: "1rem", color: "#fff",
                  background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
                  boxShadow: "0 10px 30px rgba(94,24,233,0.3)", transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                Get in touch
              </Box>
            </Box>
          </Reveal>
        </Box>

        {/* ══════════════════════════ SECTION 15 — FAQs ══════════════════════════ */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <SectionHeading kicker="FAQs" title="Questions, answered" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Box sx={{ maxWidth: 760, mx: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
            {faqs.map((f, i) => (
              <Reveal key={i} amount={0.4}>
                <FaqItem q={f.q} a={f.a} border={border} primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
              </Reveal>
            ))}
          </Box>
        </Box>

        {/* ══════════════════════════ SECTION 16 — FINAL CTA ══════════════════════════ */}
        <Box>
          <Reveal>
            <Box sx={{
              borderRadius: "32px", p: { xs: 4, md: 8 }, textAlign: "center", position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
            }}>
              <motion.div
                animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", top: "-20%", right: "-5%", width: 260, height: 260, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                }}
              />
              <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900, color: "#fff", mb: 1.5, letterSpacing: "-0.02em", position: "relative" }}>
                Ready to build the future with us?
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 4, maxWidth: 480, mx: "auto", fontSize: "1.05rem", position: "relative" }}>
                Whether you need a service or provide one — KartSquare is where India connects.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
                <Box
                  onClick={() => router.push("/supplier/register")}
                  sx={{ px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 800, fontSize: "1rem", color: COLORS.PRIMARY_PURPLE, bgcolor: "#fff", transition: "transform 0.15s", "&:hover": { transform: "scale(1.04)" } }}
                >
                  Get Started
                </Box>
                <Box
                  onClick={() => router.push("/contact-us")}
                  sx={{ px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 800, fontSize: "1rem", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", transition: "transform 0.15s", "&:hover": { transform: "scale(1.04)", borderColor: "#fff" } }}
                >
                  Contact Us
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Box>

      </Container>
    </Box>
  );
}
