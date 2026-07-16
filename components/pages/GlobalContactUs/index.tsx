"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, useInView } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";

import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import DesktopMacOutlinedIcon from "@mui/icons-material/DesktopMacOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { COLORS } from "@/constants/colors";
import { countries } from "@/data/countries";
import contactUsService from "@/services/contantUs/contactUs.service";
import ExternalLogo from "@/components/common/Nav/components/ExternalLogo";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  message: string;
}

type UserType = "customer" | "advertiser";

// ─── Validation ───────────────────────────────────────────────────────────────
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name too short"),
  email: yup.string().required("Email is required").email("Invalid email"),
  country_code: yup.string().required("Required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Digits only")
    .min(10, "Min 10 digits"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Min 10 characters"),
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const issueItems = [
  { id: "registered", label: "I am a Registered Customer of KartSquare.", icon: PersonOutlineIcon, href: "/helpSupport" },
  { id: "business_listed", label: "My business is listed on KartSquare.", icon: BusinessOutlinedIcon, href: "/helpSupport" },
  { id: "feedback_info", label: "Feedback on information provided by KartSquare.", icon: InfoOutlinedIcon, href: "/helpSupport" },
  { id: "feedback_staff", label: "Feedback on KartSquare staff.", icon: PeopleOutlineIcon, href: "/helpSupport" },
  { id: "online_orders", label: "Issues with Online orders.", icon: ShoppingCartOutlinedIcon, href: "/helpSupport" },
  { id: "new_listing", label: "New Listing with KartSquare.", icon: AddBusinessOutlinedIcon, href: "/business-listing" },
  { id: "ui_suggestion", label: "Suggestions with User Interface.", icon: DesktopMacOutlinedIcon, href: "/helpSupport" },
  { id: "opt_out", label: "Opt Out Request", icon: BlockOutlinedIcon, href: "/helpSupport" },
  { id: "other", label: "Any other issue.", icon: HelpOutlineIcon, href: "/helpSupport" },
];

const contactCards = [
  { icon: LocalPhoneIcon, label: "Call Us", value: "+91 800 567 3985", color: COLORS.PRIMARY_PURPLE },
  { icon: EmailOutlinedIcon, label: "Email Us", value: "contact@kartsquare.com", color: "#00bcff" },
  { icon: LocationOnOutlinedIcon, label: "Head Office", value: "Dubai, United Arab Emirates", color: COLORS.SECONDARY_ORANGE },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function GlobalContactUsView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Scroll-triggered animation refs
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const contentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.2 });
  const contentInView = useInView(contentRef, { once: true, amount: 0.05 });

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", country_code: "+91", phone: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await contactUsService.contactUs(data);
      reset();
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.data?.message || err?.message || "Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared tokens
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
    <Box sx={{ bgcolor: pageBg, minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, #0d0520 0%, #1a0a35 50%, #0a1628 100%)"
            : "linear-gradient(135deg, #f0ebff 0%, #e8f4ff 60%, #fdf4ff 100%)",
          pt: { xs: 14, md: 13 },
          pb: { xs: 6, md: 9 },
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", bgcolor: `${COLORS.PRIMARY_PURPLE}18`, filter: "blur(90px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", bgcolor: "#00bcff14", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo — top-left */}
        <Box sx={{ position: "absolute", top: { xs: 20, md: 28 }, left: { xs: 20, md: 40 }, zIndex: 2 }}>
          <ExternalLogo mode={isDark ? "dark" : "light"} />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div ref={undefined} initial="hidden" animate={heroInView ? "visible" : "hidden"} variants={stagger}>

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: "100px", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, mb: 2.5 }}>
                <HeadsetMicIcon sx={{ fontSize: 15, color: COLORS.PRIMARY_PURPLE }} />
                <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, letterSpacing: 0.8, fontSize: "0.7rem" }}>
                  24 / 7 SUPPORT
                </Typography>
              </Box>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 2,
                  background: `linear-gradient(130deg, ${COLORS.PRIMARY_PURPLE} 0%, #00bcff 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                How Can We Help?
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={fadeUp}>
              <Typography variant="h6" sx={{ color: secondaryTxt, fontWeight: 400, maxWidth: 520, mx: "auto", lineHeight: 1.75, fontSize: { xs: "1rem", md: "1.1rem" } }}>
                Choose your issue from the list below, or send us a message directly. We respond within 24 hours.
              </Typography>
            </motion.div>

          </motion.div>
        </Container>
      </Box>

      {/* ── CONTACT INFO CARDS ───────────────────────────────────────── */}
      <Container maxWidth="lg">
        <Box ref={cardsRef} sx={{ mt: -4, mb: 6, position: "relative", zIndex: 2 }}>
          <motion.div initial="hidden" animate={cardsInView ? "visible" : "hidden"} variants={stagger}>
            <Grid container spacing={3}>
              {contactCards.map((c) => (
                <Grid size={{ xs: 12, sm: 4 }} key={c.label}>
                  <motion.div variants={fadeUp}>
                    <Card elevation={0} sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px", p: 0.5, transition: "all 0.25s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: `0 16px 40px ${c.color}20` } }}>
                      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: "20px !important" }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <c.icon sx={{ color: c.color, fontSize: 22 }} />
                        </Box>
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="caption" sx={{ color: secondaryTxt, display: "block", mb: 0.25 }}>{c.label}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: primaryTxt, wordBreak: "break-word", fontSize: "0.8125rem" }}>{c.value}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* ── MAIN CONTENT: Issue List + Form ─────────────────────────── */}
        <Box ref={contentRef}>
          <motion.div initial="hidden" animate={contentInView ? "visible" : "hidden"} variants={stagger}>
            <Grid container spacing={4} sx={{ mb: 8 }}>

              {/* LEFT — Issue Menu (JustDial style) */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <motion.div variants={fadeUp}>

                  {/* Section heading */}
                  <Typography variant="h5" sx={{ fontWeight: 700, color: primaryTxt, mb: 0.5 }}>
                    Select Your Issue
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryTxt, mb: 3 }}>
                    Choose what best describes your concern and we'll direct you to the right place.
                  </Typography>

                  {/* User Type Tabs */}
                  <Box sx={{ display: "flex", bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#ede8ff", borderRadius: "12px", p: 0.5, mb: 2.5 }}>
                    {(["customer", "advertiser"] as UserType[]).map((type) => {
                      const active = userType === type;
                      return (
                        <Box
                          key={type}
                          id={`usertype-tab-${type}`}
                          onClick={() => setUserType(type)}
                          sx={{
                            flex: 1,
                            py: 1.25,
                            borderRadius: "10px",
                            textAlign: "center",
                            cursor: "pointer",
                            bgcolor: active ? COLORS.PRIMARY_PURPLE : "transparent",
                            transition: "all 0.2s ease",
                            "&:hover": { bgcolor: active ? COLORS.PURPLE_HOVER : COLORS.PURPLE_ALPHA_10 },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: active ? "#fff" : secondaryTxt, fontSize: "0.8125rem" }}>
                            {type === "customer" ? "Website User" : "Advertiser / Business"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Issue list card */}
                  <Box sx={{ bgcolor: cardBg, border: `1px solid ${border}`, borderRadius: "16px", overflow: "hidden" }}>
                    {issueItems.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        <Box
                          id={`issue-item-${item.id}`}
                          onClick={() => router.push(item.href)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: 3,
                            py: 2,
                            cursor: "pointer",
                            transition: "background 0.15s ease",
                            "&:hover": {
                              bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f7f4ff",
                              "& .row-arrow": { transform: "translateX(4px)" },
                            },
                          }}
                        >
                          <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <item.icon sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 1, color: primaryTxt, lineHeight: 1.55, fontSize: "0.875rem" }}>
                            {item.label}
                          </Typography>
                          <ArrowForwardIosIcon className="row-arrow" sx={{ fontSize: 12, color: secondaryTxt, transition: "transform 0.15s ease", flexShrink: 0 }} />
                        </Box>
                        {idx < issueItems.length - 1 && <Divider sx={{ borderColor: border }} />}
                      </React.Fragment>
                    ))}
                  </Box>

                  {/* Phone call CTA */}
                  <Box sx={{ mt: 3, p: 2.5, bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04, border: `1px solid ${COLORS.PURPLE_ALPHA_20}`, borderRadius: "14px", display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, #00bcff)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LocalPhoneIcon sx={{ color: "#fff", fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: secondaryTxt, fontSize: "0.75rem" }}>
                        Prefer to talk? Call us directly
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: COLORS.PRIMARY_PURPLE }}>
                        +91 800 567 3985
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              {/* RIGHT — Contact Form */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <motion.div variants={fadeUp}>
                  <Box
                    sx={{
                      bgcolor: cardBg,
                      border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                      borderRadius: "20px",
                      p: { xs: 3, sm: 4 },
                      boxShadow: isDark
                        ? `0 8px 48px ${COLORS.PRIMARY_PURPLE}25`
                        : `0 8px 48px ${COLORS.PRIMARY_PURPLE}15`,
                      position: "sticky",
                      top: 110,
                    }}
                  >
                    {/* Form header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3.5 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00bcff 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <SupportAgentIcon sx={{ color: "#fff", fontSize: 22 }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, lineHeight: 1.2 }}>
                          Send Us a Message
                        </Typography>
                        <Typography variant="caption" sx={{ color: secondaryTxt }}>
                          We'll respond within 24 hours
                        </Typography>
                      </Box>
                    </Box>

                    {submitSuccess ? (
                      /* Success state */
                      <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 64, color: COLORS.SUCCESS_GREEN, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1 }}>
                          Message Sent!
                        </Typography>
                        <Typography variant="body2" sx={{ color: secondaryTxt, mb: 4 }}>
                          Thanks for reaching out. Our team will get back to you shortly.
                        </Typography>
                        <Box
                          onClick={() => { setSubmitSuccess(false); router.push("/External/GlobalAboutUs"); }}
                          sx={{ display: "inline-block", px: 4, py: 1.25, bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}
                        >
                          Explore About Us
                        </Box>
                      </Box>
                    ) : (
                      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        {submitError && (
                          <Alert severity="error" onClose={() => setSubmitError("")} sx={{ mb: 2.5, borderRadius: "10px" }}>
                            {submitError}
                          </Alert>
                        )}

                        <Grid container spacing={2.5}>
                          {/* Name */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                              name="name"
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Full Name"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }}
                                  sx={inputSx}
                                />
                              )}
                            />
                          </Grid>

                          {/* Email */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                              name="email"
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="email"
                                  label="Email Address"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><MarkEmailUnreadOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }}
                                  sx={inputSx}
                                />
                              )}
                            />
                          </Grid>

                          {/* Country code */}
                          <Grid size={{ xs: 5, sm: 4 }}>
                            <Controller
                              name="country_code"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  fullWidth
                                  displayEmpty
                                  sx={{
                                    height: "56px",
                                    borderRadius: "10px",
                                    bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff",
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.PRIMARY_PURPLE },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.PRIMARY_PURPLE },
                                  }}
                                >
                                  {countries.map((c) => (
                                    <MenuItem key={c.code} value={c.phone_code}>{c.flag} {c.phone_code}</MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </Grid>

                          {/* Phone */}
                          <Grid size={{ xs: 7, sm: 8 }}>
                            <Controller
                              name="phone"
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="tel"
                                  label="Phone Number"
                                  inputProps={{ maxLength: 10 }}
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }}
                                  sx={inputSx}
                                />
                              )}
                            />
                          </Grid>

                          {/* Message */}
                          <Grid size={{ xs: 12 }}>
                            <Controller
                              name="message"
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  multiline
                                  rows={4}
                                  label="Your Message"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}><MessageOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} /></InputAdornment> }}
                                  sx={inputSx}
                                />
                              )}
                            />
                          </Grid>

                          {/* Submit */}
                          <Grid size={{ xs: 12 }}>
                            <Box
                              id="global-contact-submit"
                              component="button"
                              type="submit"
                              disabled={isSubmitting}
                              sx={{
                                width: "100%",
                                py: 1.75,
                                border: "none",
                                borderRadius: "12px",
                                background: isSubmitting
                                  ? COLORS.PURPLE_ALPHA_30
                                  : `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00bcff 100%)`,
                                color: "#fff",
                                fontSize: "1rem",
                                fontWeight: 700,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                letterSpacing: 0.3,
                                transition: "opacity 0.2s ease, transform 0.2s ease",
                                "&:hover:not(:disabled)": { opacity: 0.9, transform: "translateY(-2px)" },
                              }}
                            >
                              <SendOutlinedIcon sx={{ fontSize: 18 }} />
                              {isSubmitting ? "Sending…" : "Send Message"}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>

            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
