"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, MenuItem, InputAdornment, Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { motion, useInView, animate, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import ExternalLogo from "@/components/common/Nav/components/ExternalLogo";
import Footer from "@/components/common/Footer";
import { COLORS } from "@/constants/colors";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import BarChartIcon from "@mui/icons-material/BarChart";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import StarIcon from "@mui/icons-material/Star";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import PolicyIcon from "@mui/icons-material/Policy";

// ─────────────────────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

const CONTACT_PHONE = "+918005673985";
const CONTACT_EMAIL = "contact@kartsquare.com";

// ─────────────────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: VerifiedIcon, label: "Verified Platform" },
  { icon: BoltIcon, label: "Fast Onboarding" },
  { icon: ShieldIcon, label: "Secure Payments" },
  { icon: PeopleAltIcon, label: "More Customers" },
];

const heroStats = [
  { value: "2M+", label: "Monthly customers" },
  { value: "50K+", label: "Service providers" },
  { value: "200+", label: "Cities live" },
];

const whyJoin = [
  { icon: PeopleAltIcon, title: "More Customer Leads", desc: "Get discovered by vehicle owners actively searching for a trusted garage near them.", color: COLORS.PRIMARY_PURPLE },
  { icon: TrendingUpIcon, title: "Online Visibility", desc: "Your workshop shows up in search — not buried under word-of-mouth alone.", color: "#00bcff" },
  { icon: CalendarMonthIcon, title: "Easy Booking Management", desc: "Accept, schedule and track every job from one simple dashboard.", color: COLORS.SECONDARY_ORANGE },
  { icon: PaymentsOutlinedIcon, title: "Digital Payments", desc: "Get paid digitally the moment a job is marked complete — no chasing cash or cheques.", color: "#22c55e" },
  { icon: BarChartIcon, title: "Business Analytics", desc: "See what's working — bookings, repeat customers, and revenue trends in one view.", color: "#ec4899" },
  { icon: HeadsetMicIcon, title: "Dedicated Partner Support", desc: "A real support team for onboarding questions, disputes, and platform help.", color: "#7027ff" },
];

const categories = [
  { icon: CarRepairIcon, label: "Car Repair Garage" },
  { icon: TwoWheelerIcon, label: "Bike Garage" },
  { icon: ElectricCarIcon, label: "EV Service Centre" },
  { icon: LocalCarWashIcon, label: "Car Wash" },
  { icon: AutoAwesomeIcon, label: "Detailing Studio" },
  { icon: TireRepairIcon, label: "Tyre Shop" },
  { icon: BatteryChargingFullIcon, label: "Battery Shop" },
  { icon: SupportAgentIcon, label: "Roadside Assistance" },
  { icon: LocalShippingIcon, label: "Towing Service" },
  { icon: OilBarrelIcon, label: "Oil Change Centre" },
  { icon: FormatPaintIcon, label: "Dent & Paint" },
  { icon: DirectionsCarIcon, label: "Car Accessories" },
  { icon: DirectionsCarFilledIcon, label: "Car Rental" },
  { icon: FactCheckIcon, label: "Vehicle Inspection" },
  { icon: NoCrashIcon, label: "Fleet Maintenance" },
  { icon: PolicyIcon, label: "Insurance Partner" },
];

const howItWorks = [
  { icon: HowToRegIcon, title: "Register Business", desc: "Fill in your business and service details — takes a few minutes." },
  { icon: VerifiedIcon, title: "Complete Verification", desc: "Submit your documents so our team can confirm you're a real business." },
  { icon: StoreIcon, title: "Upload Services", desc: "List the services, categories and pricing your workshop offers." },
  { icon: NotificationsIcon, title: "Receive Bookings", desc: "Get notified the moment a nearby customer books your service." },
  { icon: CheckCircleOutlineIcon, title: "Complete Jobs", desc: "Service the vehicle and mark the job complete from your dashboard." },
  { icon: PaymentsOutlinedIcon, title: "Get Paid", desc: "Your payout is settled digitally as soon as the job is marked done." },
];

const platformFeatures = [
  { icon: CalendarMonthIcon, label: "Booking Management" },
  { icon: CalendarMonthIcon, label: "Calendar" },
  { icon: ChatIcon, label: "Customer Chat" },
  { icon: PaymentsOutlinedIcon, label: "Payment Tracking" },
  { icon: BarChartIcon, label: "Revenue Dashboard" },
  { icon: StarIcon, label: "Reviews" },
  { icon: DashboardIcon, label: "Analytics" },
  { icon: StoreIcon, label: "Business Profile" },
  { icon: ReceiptLongIcon, label: "Service Catalogue" },
  { icon: WorkspacePremiumIcon, label: "Offers & Coupons" },
  { icon: CalendarMonthIcon, label: "Availability Management" },
  { icon: PhoneAndroidOutlinedIcon, label: "Mobile App" },
];

const withoutUs = ["Relying on word-of-mouth alone", "Idle bays between referrals", "Invisible outside your street", "Cash payments, manual tracking", "No repeat-customer system"];
const withUs = ["Steady stream of nearby customers", "Bookings fill your schedule", "Discoverable across your whole city", "Digital payouts, tracked automatically", "Reviews that bring customers back"];

const testimonials = [
  { name: "Vikram Singh", role: "Car Repair Garage Owner, Jaipur", initial: "V", bg: COLORS.PRIMARY_PURPLE, quote: "Bookings come in through the app now instead of just walk-ins. My bays stay busier through the week." },
  { name: "Arjun Mehta", role: "EV Service Centre, Pune", initial: "A", bg: "#0d9488", quote: "Being listed as an EV specialist got us found by customers who specifically searched for that." },
  { name: "Karan Malhotra", role: "Tyre Shop Owner, Delhi", initial: "K", bg: "#e63946", quote: "Setup took a day. Verification was straightforward and support answered every question we had." },
];

const documents = [
  "Business Registration", "GST Certificate (if applicable)", "PAN Card", "Bank Account Details",
  "Cancelled Cheque", "Owner ID Proof", "Address Proof", "Business Photos",
  "Workshop Photos", "Technician Details", "Service Categories",
];

const verificationSteps = [
  { title: "Submit Documents", desc: "Upload your business and identity documents." },
  { title: "Verification", desc: "Our team checks your details for authenticity." },
  { title: "Approval", desc: "Once verified, your account is approved." },
  { title: "Business Profile Created", desc: "Your public provider profile goes live in draft." },
  { title: "Go Live", desc: "Start receiving bookings from nearby customers." },
];

const faqs = [
  { q: "How long does approval take?", a: "Our team typically verifies and approves new provider accounts within 24 hours of receiving complete documents." },
  { q: "Is there any joining fee?", a: "No. Creating your business profile and listing your services on kartsquare is completely free." },
  { q: "How do I receive payments?", a: "Payments are settled digitally to your linked bank account as soon as a job is marked complete." },
  { q: "Can I edit my services?", a: "Yes — you can add, edit or remove services and categories anytime from your provider dashboard." },
  { q: "How do bookings work?", a: "Customers browse verified providers, check availability, and book directly. You get notified instantly." },
  { q: "How do customers rate me?", a: "After every completed job, customers can leave a rating and review tied to that specific booking." },
  { q: "Can I pause my profile?", a: "Yes, you can temporarily pause your listing from the dashboard if you're unavailable — for example during a break or holiday." },
  { q: "What documents are needed?", a: "Business registration, PAN, bank details, owner ID, address proof and workshop photos — see the checklist above for the full list." },
  { q: "How is commission calculated?", a: "Commission is transparent and shown upfront on your dashboard before you accept any add-on services — no hidden deductions." },
  { q: "How do cancellations work?", a: "If a customer cancels before service starts, no charge applies to you. Our support team can help resolve edge cases." },
  { q: "Can I manage multiple branches?", a: "Yes, businesses with multiple locations can add and manage each branch as a separate linked profile." },
  { q: "Who do I contact for support?", a: `Reach our partner support team anytime at ${CONTACT_EMAIL} or call ${CONTACT_PHONE}.` },
];

const businessTypes = categories.map((c) => c.label);

// ─────────────────────────────────────────────────────────────────────────
function AnimatedCounter({ text, color }: { text: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const numeric = parseInt(text.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = text.replace(/[\d,]/g, "");
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numeric, { duration: 1.5, ease: EASE, onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, numeric]);

  return (
    <Typography ref={ref} component="div" sx={{ fontSize: { xs: "2.1rem", md: "2.75rem" }, fontWeight: 800, color, lineHeight: 1 }}>
      {display.toLocaleString("en-IN")}{suffix}
    </Typography>
  );
}

function Reveal({ children, variants = fadeUp, amount = 0.15 }: { children: React.ReactNode; variants?: Variants; amount?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a, border, primaryTxt, secondaryTxt }: { q: string; a: string; border: string; primaryTxt: string; secondaryTxt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      onClick={() => setOpen((o) => !o)}
      sx={{
        border: `1.5px solid ${border}`, borderRadius: "16px", px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.25 },
        cursor: "pointer", transition: "border-color 0.2s, background-color 0.2s",
        bgcolor: open ? COLORS.PURPLE_ALPHA_04 : "transparent",
        "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HelpOutlineIcon sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE, flexShrink: 0 }} />
          <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.92rem", md: "1rem" }, color: primaryTxt }}>{q}</Typography>
        </Box>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, display: "flex" }}>
          <ExpandMoreIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
        </motion.div>
      </Box>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0, marginTop: open ? 10 : 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{ overflow: "hidden" }}
      >
        <Typography sx={{ color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.7, pl: 4 }}>{a}</Typography>
      </motion.div>
    </Box>
  );
}

function SectionHeading({ kicker, title, sub, primaryTxt, secondaryTxt }: { kicker: string; title: string; sub?: string; primaryTxt: string; secondaryTxt: string }) {
  return (
    <Reveal>
      <Box sx={{ mb: { xs: 4.5, md: 6.5 }, textAlign: "center", maxWidth: 640, mx: "auto" }}>
        <Typography sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 800, letterSpacing: 2.5, fontSize: "0.75rem", mb: 1.25, textTransform: "uppercase" }}>
          {kicker}
        </Typography>
        <Typography sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.2, color: primaryTxt, mb: sub ? 1.25 : 0 }}>
          {title}
        </Typography>
        {sub && <Typography sx={{ color: secondaryTxt, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}>{sub}</Typography>}
      </Box>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
const STEP_LABELS = ["Business Info", "Services & Hours", "Documents & Review"];

interface FormState {
  businessName: string; ownerName: string; phone: string; email: string; city: string;
  address: string; businessType: string; yearsInBusiness: string; employees: string;
  services: string; openingHours: string; gst: string; website: string;
}

export default function JoinAsProviderView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    businessName: "", ownerName: "", phone: "", email: "", city: "", address: "",
    businessType: "", yearsInBusiness: "", employees: "", services: "", openingHours: "", gst: "", website: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep = (s: number) => {
    if (s === 0) return !!(form.businessName && form.ownerName && form.phone && form.email && form.city && form.businessType);
    if (s === 1) return !!(form.services && form.openingHours);
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) { setError("Please fill in all required fields."); return; }
    setError("");
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };
  const prevStep = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service to continue."); return; }
    setSubmitting(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSuccess(true);
  };

  const pageBg = isDark ? COLORS.BACKGROUND.PAPER_DARK : "#ffffff";
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

  const scrollToForm = () => document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Box sx={{ bgcolor: pageBg, minHeight: "100vh", position: "relative" }}>

      {/* ══════════════════════ SECTION 1 — HERO ══════════════════════ */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg,#0d0520 0%,#1a0a35 50%,#0a1628 100%)"
          : "linear-gradient(135deg,#f5f2ff 0%,#eef8ff 55%,#fff8f0 100%)",
        pt: { xs: 12, md: 8 }, pb: { xs: 8, md: 10 },
      }}>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -22, 0], x: [0, 14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-8%", left: "-6%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.PURPLE_ALPHA_30} 0%, transparent 70%)`, filter: "blur(20px)" }}
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 24, 0], x: [0, -18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "10%", right: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,188,255,0.16) 0%, transparent 70%)", filter: "blur(20px)" }}
        />
        {[
          { Icon: DirectionsCarFilledIcon, top: 72, left: "8%" },
          { Icon: ElectricCarIcon, top: 140, right: "10%" },
        ].map(({ Icon, top, left, right }, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            sx={{ position: "absolute", top, left, right, opacity: 0.14, display: { xs: "none", md: "block" } }}
          >
            <Icon sx={{ fontSize: 64, color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        ))}

        <Box sx={{ position: "absolute", top: { xs: 20, md: 28 }, left: { xs: 20, md: 40 }, zIndex: 3 }}>
          <ExternalLogo mode={isDark ? "dark" : "light"} />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center", pt: { xs: 4, md: 6 } }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2.25, py: 0.9, borderRadius: "100px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "#fff", border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, boxShadow: "0 4px 16px rgba(94,24,233,0.08)", mb: 3.5 }}>
                <CarRepairIcon sx={{ fontSize: 15, color: COLORS.PRIMARY_PURPLE }} />
                <Typography sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, letterSpacing: 0.6, fontSize: "0.75rem" }}>
                  FOR AUTOMOTIVE SERVICE BUSINESSES
                </Typography>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography component="h1" sx={{ fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" }, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em", color: primaryTxt, mb: 2.5 }}>
                Grow Your Business with{" "}
                <Box component="span" sx={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, #00bcff)`, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                  kartsquare
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography sx={{ color: secondaryTxt, fontSize: { xs: "1.02rem", md: "1.2rem" }, lineHeight: 1.65, maxWidth: 600, mx: "auto", mb: 4.5 }}>
                Join trusted automotive service providers on kartsquare and get more customers, increase bookings, and grow your revenue.
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mb: 5 }}>
                <Box onClick={scrollToForm} sx={{
                  px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "#fff",
                  background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, #00bcff)`, boxShadow: "0 10px 30px rgba(94,24,233,0.32)",
                  transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)" },
                }}>
                  Join Now
                </Box>
                <Box component="a" href={`tel:${CONTACT_PHONE}`} sx={{
                  px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: primaryTxt,
                  bgcolor: "#fff", border: `1.5px solid ${border}`, textDecoration: "none", display: "inline-flex", alignItems: "center",
                  transition: "transform 0.2s, border-color 0.2s", "&:hover": { transform: "translateY(-2px)", borderColor: COLORS.PRIMARY_PURPLE },
                }}>
                  Talk to Sales
                </Box>
              </Box>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Box sx={{ display: "flex", gap: { xs: 2, md: 3.5 }, justifyContent: "center", flexWrap: "wrap", mb: 4 }}>
                {trustBadges.map((b, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <b.icon sx={{ fontSize: 17, color: COLORS.PRIMARY_PURPLE }} />
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: secondaryTxt }}>{b.label}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Box sx={{ display: "flex", gap: { xs: 3, md: 6 }, justifyContent: "center", flexWrap: "wrap" }}>
                {heroStats.map((s, i) => (
                  <Box key={i} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 800, color: primaryTxt }}>{s.value}</Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: secondaryTxt, fontWeight: 600 }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>

        {/* ══════════════════════ SECTION 2 — WHY JOIN ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Why Join kartsquare" title="Everything you need to grow" sub="Built for automotive service businesses that want more customers, less idle time." primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {whyJoin.map((b, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "18px",
                      transition: "all 0.25s ease", position: "relative", overflow: "hidden",
                      "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${b.color},${COLORS.PRIMARY_PURPLE})`, transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.25s ease" },
                      "&:hover": { transform: "translateY(-6px)", boxShadow: `0 16px 36px ${b.color}22`, "&::before": { transform: "scaleX(1)" } },
                    }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <Box sx={{ width: 50, height: 50, borderRadius: "14px", bgcolor: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <b.icon sx={{ color: b.color, fontSize: 25 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: primaryTxt, mb: 0.75, fontSize: "1.02rem" }}>{b.title}</Typography>
                        <Typography sx={{ color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.6 }}>{b.desc}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 3 — WHO CAN JOIN ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Who Can Join" title="Built for every kind of automotive business" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2}>
              {categories.map((c, i) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{
                      bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px", p: { xs: 2.25, md: 2.5 },
                      height: "100%", cursor: "pointer", display: "flex", flexDirection: "column", gap: 1.25,
                      transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                      "&:hover": { transform: "translateY(-4px)", borderColor: COLORS.PRIMARY_PURPLE, boxShadow: "0 10px 28px rgba(94,24,233,0.12)" },
                    }}>
                      <c.icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.85rem", md: "0.92rem" }, color: primaryTxt }}>{c.label}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 4 — HOW IT WORKS ══════════════════════ */}
        <Box id="how-it-works" sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="How It Works" title="Live in six simple steps" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {howItWorks.map((s, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "18px", p: 2.75, height: "100%" }}>
                      <Box sx={{ position: "relative", flexShrink: 0 }}>
                        <Box sx={{ width: 46, height: 46, borderRadius: "13px", background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <s.icon sx={{ color: "#fff", fontSize: 22 }} />
                        </Box>
                        <Box sx={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", bgcolor: COLORS.SECONDARY_ORANGE, color: "#fff", fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {i + 1}
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: primaryTxt, mb: 0.5, fontSize: "0.98rem" }}>{s.title}</Typography>
                        <Typography sx={{ color: secondaryTxt, fontSize: "0.85rem", lineHeight: 1.55 }}>{s.desc}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 5 — STATS ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 }, borderRadius: "28px", py: { xs: 5, md: 6 }, px: { xs: 3, md: 5 }, background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})` }}>
          <Reveal variants={stagger}>
            <Grid container spacing={3} justifyContent="center">
              {[{ text: "2M+", label: "Monthly customers" }, { text: "50K+", label: "Service providers" }, { text: "200+", label: "Cities live" }, { text: "98%", label: "Partner satisfaction" }].map((s, i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i}>
                  <motion.div variants={fadeUp}>
                    <Box sx={{ textAlign: "center" }}>
                      <AnimatedCounter text={s.text} color="#fff" />
                      <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 0.75, fontSize: "0.88rem", fontWeight: 600 }}>{s.label}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 6 — PLATFORM FEATURES ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Platform Features" title="Everything runs from one dashboard" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {platformFeatures.map((f, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, px: 1.5, borderRadius: "10px", "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_04 } }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: COLORS.PURPLE_ALPHA_10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <f.icon sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: primaryTxt }}>{f.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } } }}>
                {/* illustrative dashboard preview panel */}
                <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff", border: `1px solid ${border}`, borderRadius: "22px", p: { xs: 2.5, md: 3.5 }, boxShadow: "0 20px 60px rgba(94,24,233,0.12)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#e63946" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#22c55e" }} />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ bgcolor: cardBg, borderRadius: "14px", p: 2, border: `1px solid ${border}` }}>
                        <Typography sx={{ fontSize: "0.72rem", color: secondaryTxt, fontWeight: 600, mb: 0.5 }}>THIS WEEK</Typography>
                        <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: primaryTxt }}>32</Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: secondaryTxt }}>New bookings</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box sx={{ bgcolor: cardBg, borderRadius: "14px", p: 2, border: `1px solid ${border}` }}>
                        <Typography sx={{ fontSize: "0.72rem", color: secondaryTxt, fontWeight: 600, mb: 0.5 }}>RATING</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: primaryTxt }}>4.8</Typography>
                          <StarIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                        </Box>
                        <Typography sx={{ fontSize: "0.75rem", color: secondaryTxt }}>Average rating</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ bgcolor: cardBg, borderRadius: "14px", p: 2, border: `1px solid ${border}` }}>
                        <Typography sx={{ fontSize: "0.72rem", color: secondaryTxt, fontWeight: 600, mb: 1.5 }}>BOOKINGS THIS MONTH</Typography>
                        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 60 }}>
                          {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                            <Box key={i} sx={{ flex: 1, height: `${h}%`, borderRadius: "4px", background: `linear-gradient(180deg, ${COLORS.PRIMARY_PURPLE}, #00bcff)`, opacity: 0.85 }} />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Reveal>
            </Grid>
          </Grid>
        </Box>

        {/* ══════════════════════ SECTION 7 — EARN MORE ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Earn More" title="Without kartsquare vs. With kartsquare" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div variants={fadeUp} style={{ height: "100%" }}>
                  <Box sx={{ border: `1.5px solid ${border}`, borderRadius: "20px", p: { xs: 3, md: 3.5 }, height: "100%" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: secondaryTxt, mb: 2.25 }}>Without kartsquare</Typography>
                    {withoutUs.map((t, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.5 }}>
                        <CloseIcon sx={{ color: "#e63946", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                        <Typography sx={{ color: secondaryTxt, fontSize: "0.9rem", lineHeight: 1.5 }}>{t}</Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div variants={fadeUp} style={{ height: "100%" }}>
                  <Box sx={{ border: `1.5px solid ${COLORS.PRIMARY_PURPLE}`, borderRadius: "20px", p: { xs: 3, md: 3.5 }, height: "100%", bgcolor: COLORS.PURPLE_ALPHA_04 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: COLORS.PRIMARY_PURPLE, mb: 2.25 }}>With kartsquare</Typography>
                    {withUs.map((t, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.5 }}>
                        <CheckIcon sx={{ color: "#0d9488", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                        <Typography sx={{ color: primaryTxt, fontSize: "0.9rem", lineHeight: 1.5, fontWeight: 500 }}>{t}</Typography>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 8 — WHAT PROVIDERS SAY ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Success Stories" title="What providers say" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {testimonials.map((t, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Card elevation={0} sx={{ height: "100%", bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "18px", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: `0 14px 36px ${COLORS.PRIMARY_PURPLE}18` } }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <Box sx={{ display: "flex", mb: 1.5 }}>
                          {[...Array(5)].map((_, j) => <StarIcon key={j} sx={{ fontSize: 15, color: "#f59e0b" }} />)}
                        </Box>
                        <Typography sx={{ color: secondaryTxt, lineHeight: 1.7, mb: 2.5, fontStyle: "italic", fontSize: "0.92rem" }}>&ldquo;{t.quote}&rdquo;</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: t.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Typography sx={{ color: "#fff", fontWeight: 800 }}>{t.initial}</Typography>
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: primaryTxt, fontSize: "0.88rem", lineHeight: 1.2 }}>{t.name}</Typography>
                            <Typography sx={{ color: secondaryTxt, fontSize: "0.78rem" }}>{t.role}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 9 — SIMPLE PRICING ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Simple Pricing" title="No hidden fees, ever" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={2.5}>
              {[
                { icon: ReceiptLongIcon, title: "No Hidden Fees", desc: "Joining and listing your business is free. What you see is what you pay." },
                { icon: BarChartIcon, title: "Transparent Commission", desc: "Commission on completed bookings is shown upfront on your dashboard, always." },
                { icon: BoltIcon, title: "Fast Payouts", desc: "Payments settle digitally as soon as a job is marked complete." },
                { icon: ShieldIcon, title: "Secure Payments", desc: "Every transaction runs through kartsquare's secure payment infrastructure." },
                { icon: WorkspacePremiumIcon, title: "Optional Premium Plans", desc: "Boost visibility further with optional paid add-ons — never required to get started." },
              ].map((p, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <Box sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "18px", p: 3, height: "100%" }}>
                      <p.icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26, mb: 1.5 }} />
                      <Typography sx={{ fontWeight: 700, color: primaryTxt, mb: 0.5, fontSize: "0.98rem" }}>{p.title}</Typography>
                      <Typography sx={{ color: secondaryTxt, fontSize: "0.88rem", lineHeight: 1.6 }}>{p.desc}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 10 — DOCUMENTS REQUIRED ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Documents Required" title="Keep these handy before you start" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal variants={stagger}>
            <Grid container spacing={1.5}>
              {documents.map((d, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "12px", px: 2, py: 1.5 }}>
                      <CheckCircleOutlineIcon sx={{ color: "#0d9488", fontSize: 20, flexShrink: 0 }} />
                      <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: primaryTxt }}>{d}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 11 — VERIFICATION PROCESS ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Verification Process" title="From documents to going live" sub="Most providers are verified and approved within 24 hours." primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Box sx={{ position: "relative", maxWidth: 640, mx: "auto" }}>
            <Box sx={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, bgcolor: border }} />
            {verificationSteps.map((v, i) => (
              <Reveal key={i} amount={0.4}>
                <Box sx={{ position: "relative", display: "flex", gap: 3, mb: i === verificationSteps.length - 1 ? 0 : 3.5 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE, border: `4px solid ${isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff"}`, boxShadow: `0 0 0 2px ${COLORS.PRIMARY_PURPLE}`, flexShrink: 0, zIndex: 1 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: primaryTxt, mb: 0.4 }}>{v.title}</Typography>
                    <Typography sx={{ color: secondaryTxt, fontSize: "0.88rem", lineHeight: 1.6 }}>{v.desc}</Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>

        {/* ══════════════════════ SECTION 13 — FAQ ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="FAQ" title="Questions, answered" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Box sx={{ maxWidth: 760, mx: "auto", display: "flex", flexDirection: "column", gap: 1.25 }}>
            {faqs.map((f, i) => (
              <Reveal key={i} amount={0.4}>
                <FaqItem q={f.q} a={f.a} border={border} primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
              </Reveal>
            ))}
          </Box>
        </Box>

        {/* ══════════════════════ SECTION 14 — JOIN FORM ══════════════════════ */}
        <Box id="registration-form" sx={{ mb: { xs: 9, md: 12 } }}>
          <SectionHeading kicker="Join kartsquare" title="Register your business" primaryTxt={primaryTxt} secondaryTxt={secondaryTxt} />
          <Reveal>
            <Box sx={{
              bgcolor: cardBg, border: `2px solid ${COLORS.PRIMARY_PURPLE}`, borderRadius: "24px",
              p: { xs: 3, sm: 5 }, boxShadow: isDark ? `0 8px 48px ${COLORS.PRIMARY_PURPLE}25` : `0 8px 48px ${COLORS.PRIMARY_PURPLE}12`,
              maxWidth: 820, mx: "auto",
            }}>
              {success ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 72, color: COLORS.SUCCESS_GREEN, mb: 2 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: primaryTxt, mb: 1 }}>Registration Submitted!</Typography>
                  <Typography sx={{ color: secondaryTxt, mb: 4 }}>
                    Our team will verify your business and get in touch within 24 hours.
                  </Typography>
                  <Box onClick={() => router.push("/External/GlobalAboutUs")} sx={{ display: "inline-block", px: 5, py: 1.5, bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", borderRadius: "12px", cursor: "pointer", fontWeight: 700, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}>
                    Learn More About kartsquare
                  </Box>
                </Box>
              ) : (
                <>
                  {/* progress indicator */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 1, sm: 2 }, mb: 4 }}>
                    {STEP_LABELS.map((label, i) => (
                      <React.Fragment key={i}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{
                            width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.8rem", flexShrink: 0,
                            bgcolor: i <= step ? COLORS.PRIMARY_PURPLE : (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f0f0f5"),
                            color: i <= step ? "#fff" : secondaryTxt, transition: "background-color 0.3s",
                          }}>
                            {i < step ? <CheckIcon sx={{ fontSize: 16 }} /> : i + 1}
                          </Box>
                          <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: "0.82rem", fontWeight: 600, color: i <= step ? primaryTxt : secondaryTxt }}>{label}</Typography>
                        </Box>
                        {i < STEP_LABELS.length - 1 && <Box sx={{ width: { xs: 20, sm: 40 }, height: 2, bgcolor: i < step ? COLORS.PRIMARY_PURPLE : border, transition: "background-color 0.3s" }} />}
                      </React.Fragment>
                    ))}
                  </Box>

                  <Box component="form" onSubmit={handleSubmit}>
                    {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3, borderRadius: "10px" }}>{error}</Alert>}

                    {step === 0 && (
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="businessName" label="Business Name *" value={form.businessName} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><StoreIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="ownerName" label="Owner Name *" value={form.ownerName} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="phone" label="Mobile Number *" value={form.phone} onChange={handleChange} type="tel" inputProps={{ maxLength: 10 }}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="email" label="Email Address *" value={form.email} onChange={handleChange} type="email"
                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="city" label="City *" value={form.city} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth select name="businessType" label="Business Type *" value={form.businessType} onChange={handleChange} sx={inputSx}>
                            {businessTypes.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth name="address" label="Business Address" value={form.address} onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><HomeOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }} sx={inputSx} />
                        </Grid>
                      </Grid>
                    )}

                    {step === 1 && (
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="yearsInBusiness" label="Years in Business" value={form.yearsInBusiness} onChange={handleChange} type="number" sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="employees" label="Number of Employees" value={form.employees} onChange={handleChange} type="number" sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth multiline rows={2} name="services" label="Services Offered *" value={form.services} onChange={handleChange}
                            placeholder="e.g. Car servicing, tyre replacement, EV battery diagnostics..." sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="openingHours" label="Opening Hours *" value={form.openingHours} onChange={handleChange} placeholder="e.g. Mon–Sat, 9 AM – 8 PM" sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth name="gst" label="GST Number (Optional)" value={form.gst} onChange={handleChange} sx={inputSx} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField fullWidth name="website" label="Website (Optional)" value={form.website} onChange={handleChange} sx={inputSx} />
                        </Grid>
                      </Grid>
                    )}

                    {step === 2 && (
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box component="label" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: `1.5px dashed ${border}`, borderRadius: "12px", p: 3, cursor: "pointer", textAlign: "center", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE } }}>
                            <CloudUploadIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26 }} />
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: primaryTxt }}>Upload Logo</Typography>
                            <input type="file" accept="image/*" hidden />
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box component="label" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: `1.5px dashed ${border}`, borderRadius: "12px", p: 3, cursor: "pointer", textAlign: "center", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE } }}>
                            <CloudUploadIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26 }} />
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: primaryTxt }}>Business Photos</Typography>
                            <input type="file" accept="image/*" multiple hidden />
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box component="label" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: `1.5px dashed ${border}`, borderRadius: "12px", p: 3, cursor: "pointer", textAlign: "center", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE } }}>
                            <CloudUploadIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 26 }} />
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: primaryTxt }}>Documents</Typography>
                            <input type="file" multiple hidden />
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff", borderRadius: "14px", p: 2.5, border: `1px solid ${border}` }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: primaryTxt, mb: 1.5 }}>Review your details</Typography>
                            <Grid container spacing={1}>
                              {[
                                ["Business", form.businessName], ["Owner", form.ownerName], ["City", form.city],
                                ["Type", form.businessType], ["Phone", form.phone], ["Email", form.email],
                              ].map(([k, v]) => (
                                <Grid size={{ xs: 6 }} key={k}>
                                  <Typography sx={{ fontSize: "0.78rem", color: secondaryTxt }}>{k}</Typography>
                                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: primaryTxt }}>{v || "—"}</Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box onClick={() => setAgreed((a) => !a)} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, cursor: "pointer" }}>
                            <Box sx={{ width: 20, height: 20, borderRadius: "5px", border: `1.5px solid ${agreed ? COLORS.PRIMARY_PURPLE : border}`, bgcolor: agreed ? COLORS.PRIMARY_PURPLE : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.2, transition: "background-color 0.2s" }}>
                              {agreed && <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />}
                            </Box>
                            <Typography sx={{ fontSize: "0.85rem", color: secondaryTxt }}>
                              I agree to kartsquare&apos;s Terms of Service and Privacy Policy.
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 4 }}>
                      <Box
                        onClick={prevStep}
                        sx={{
                          display: "inline-flex", alignItems: "center", gap: 1, px: 3, py: 1.5, borderRadius: "12px",
                          cursor: step === 0 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "0.9rem",
                          color: step === 0 ? secondaryTxt : primaryTxt, border: `1.5px solid ${border}`, opacity: step === 0 ? 0.5 : 1,
                        }}
                      >
                        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back
                      </Box>

                      {step < STEP_LABELS.length - 1 ? (
                        <Box onClick={nextStep} sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 4, py: 1.5, borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", color: "#fff", background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)`, boxShadow: `0 6px 20px ${COLORS.PRIMARY_PURPLE}35` }}>
                          Next <ArrowForwardIcon sx={{ fontSize: 18 }} />
                        </Box>
                      ) : (
                        <Box component="button" type="submit" disabled={submitting} sx={{
                          border: "none", display: "inline-flex", alignItems: "center", gap: 1, px: 4, py: 1.5, borderRadius: "12px",
                          cursor: submitting ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "0.9rem", color: "#fff",
                          background: submitting ? COLORS.PURPLE_ALPHA_30 : `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)`,
                          boxShadow: `0 6px 20px ${COLORS.PRIMARY_PURPLE}35`,
                        }}>
                          <SendOutlinedIcon sx={{ fontSize: 18 }} /> {submitting ? "Submitting…" : "Submit Registration"}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Reveal>
        </Box>

        {/* ══════════════════════ SECTION 15 — FINAL CTA ══════════════════════ */}
        <Box sx={{ mb: { xs: 9, md: 10 } }}>
          <Reveal>
            <Box sx={{ borderRadius: "28px", p: { xs: 4, md: 7 }, textAlign: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})` }}>
              <Typography sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, fontWeight: 800, color: "#fff", mb: 1.5, letterSpacing: "-0.01em" }}>
                Ready to Grow Your Automotive Business?
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 4, maxWidth: 460, mx: "auto", fontSize: "1.02rem" }}>
                Join kartsquare and start reaching customers already searching for what you do.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Box onClick={scrollToForm} sx={{ px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: COLORS.PRIMARY_PURPLE, bgcolor: "#fff", transition: "transform 0.15s", "&:hover": { transform: "scale(1.04)" } }}>
                  Become a Partner
                </Box>
                <Box component="a" href={`tel:${CONTACT_PHONE}`} sx={{ px: 4.5, py: 1.75, borderRadius: "100px", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", textDecoration: "none", display: "inline-flex", alignItems: "center", transition: "transform 0.15s", "&:hover": { transform: "scale(1.04)", borderColor: "#fff" } }}>
                  Schedule a Demo
                </Box>
              </Box>
            </Box>
          </Reveal>
        </Box>

      </Container>

      {/* ══════════════════════ SECTION 16 — FOOTER ══════════════════════ */}
      <Footer />

      {/* ══════════════════════ EXTRA — WHATSAPP FLOATING BUTTON ══════════════════════ */}
      <Box
        component="a"
        href={`https://wa.me/${CONTACT_PHONE.replace("+", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with kartsquare on WhatsApp"
        sx={{
          position: "fixed", bottom: { xs: 82, md: 24 }, right: 20, zIndex: 40,
          width: 54, height: 54, borderRadius: "50%", bgcolor: "#25D366", display: "flex",
          alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
          transition: "transform 0.2s", "&:hover": { transform: "scale(1.08)" },
        }}
      >
        <WhatsAppIcon sx={{ color: "#fff", fontSize: 28 }} />
      </Box>

      {/* ══════════════════════ EXTRA — STICKY MOBILE APPLY BAR ══════════════════════ */}
      <Box
        sx={{
          display: { xs: scrolledPastHero ? "flex" : "none", md: "none" },
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 39,
          bgcolor: cardBg, borderTop: `1px solid ${border}`, p: 1.5, gap: 1.25,
          boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Box component="a" href={`tel:${CONTACT_PHONE}`} sx={{ flexShrink: 0, width: 46, height: 46, borderRadius: "12px", border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhoneEnabledIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
        </Box>
        <Box onClick={scrollToForm} sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", color: "#fff", background: `linear-gradient(135deg,${COLORS.PRIMARY_PURPLE},#00bcff)` }}>
          Join Now
        </Box>
      </Box>

    </Box>
  );
}
