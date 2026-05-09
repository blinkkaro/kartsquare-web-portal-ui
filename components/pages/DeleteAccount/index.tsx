"use client";
import React, { useRef, useState } from "react";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, InputAdornment, Alert, Divider, Tab, Tabs,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HistoryIcon from "@mui/icons-material/History";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ExternalLogo from "@/components/common/Nav/components/ExternalLogo";
import { COLORS } from "@/constants/colors";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

type Step = "policy" | "verify" | "otp" | "done";
type ContactMethod = "email" | "phone";

const policies = [
  {
    icon: HistoryIcon,
    title: "All Data Will Be Permanently Deleted",
    desc: "Your profile, booking history, reviews, saved addresses, and all personal information will be permanently erased and cannot be recovered.",
    color: COLORS.ERROR_RED,
  },
  {
    icon: AccountBalanceWalletOutlinedIcon,
    title: "Pending Payments & Refunds",
    desc: "Any pending payments, refunds, or wallet balance must be settled before deletion. Outstanding amounts will be forfeited upon account removal.",
    color: COLORS.SECONDARY_ORANGE,
  },
  {
    icon: StarBorderIcon,
    title: "Reviews & Ratings Lost",
    desc: "All reviews you've written and received, your provider ratings, and your trust score will be permanently removed from the platform.",
    color: "#f59e0b",
  },
  {
    icon: BlockOutlinedIcon,
    title: "Active Bookings Must Be Completed",
    desc: "You must complete or cancel all active bookings before deleting your account. Abrupt cancellations may affect providers and their earnings.",
    color: "#ec4899",
  },
  {
    icon: ShieldOutlinedIcon,
    title: "30-Day Cooling Period",
    desc: "After deletion, you cannot create a new account with the same email or phone number for 30 days to prevent misuse.",
    color: "#7c3aed",
  },
  {
    icon: LockOutlinedIcon,
    title: "Legal & Compliance Data Retained",
    desc: "As required by law, certain transactional records may be retained for up to 7 years for tax, legal, and regulatory compliance purposes.",
    color: "#0ea5e9",
  },
];

export default function DeleteAccountView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const [step, setStep] = useState<Step>("policy");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const heroRef = useRef(null);
  const policyRef = useRef(null);
  const formRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const policyInView = useInView(policyRef, { once: true, amount: 0.05 });
  const formInView = useInView(formRef, { once: true, amount: 0.05 });

  const pageBg = isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT;
  const cardBg = isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#ffffff";
  const border = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
  const primaryTxt = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const secondaryTxt = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff",
      "& fieldset": { borderColor: border },
      "&:hover fieldset": { borderColor: COLORS.ERROR_RED },
      "&.Mui-focused fieldset": { borderColor: COLORS.ERROR_RED },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: COLORS.ERROR_RED },
  };

  const handleSendOtp = () => {
    if (!contactValue.trim()) {
      setError(`Please enter your ${contactMethod === "email" ? "email address" : "phone number"}.`);
      return;
    }
    if (contactMethod === "email" && !/\S+@\S+\.\S+/.test(contactValue)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (contactMethod === "phone" && !/^\d{10}$/.test(contactValue)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setStep("otp");
    // Start 30s resend timer (UI only — integration pending)
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-input-${idx - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setError("");
    // TODO: Integrate real OTP verification here
    setStep("done");
  };

  return (
    <Box sx={{ bgcolor: pageBg, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <Box ref={heroRef} sx={{
        position: "relative", overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg,#1a0505 0%,#2d0a0a 50%,#0d0520 100%)"
          : "linear-gradient(135deg,#fff5f5 0%,#ffe8e8 40%,#f5f0ff 100%)",
        pt: { xs: 14, md: 13 }, pb: { xs: 6, md: 9 },
      }}>
        <Box sx={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", bgcolor: `${COLORS.ERROR_RED}12`, filter: "blur(90px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", bgcolor: `${COLORS.PRIMARY_PURPLE}10`, filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo — top-left */}
        <Box sx={{ position: "absolute", top: { xs: 20, md: 28 }, left: { xs: 20, md: 40 }, zIndex: 2 }}>
          <ExternalLogo mode={isDark ? "dark" : "light"} />
        </Box>

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate={heroInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: "100px", bgcolor: `${COLORS.ERROR_RED}12`, border: `1px solid ${COLORS.ERROR_RED}30`, mb: 2.5 }}>
                <WarningAmberIcon sx={{ fontSize: 15, color: COLORS.ERROR_RED }} />
                <Typography variant="caption" sx={{ color: COLORS.ERROR_RED, fontWeight: 700, letterSpacing: 0.8, fontSize: "0.7rem" }}>IRREVERSIBLE ACTION</Typography>
              </Box>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Typography component="h1" sx={{
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" }, fontWeight: 800, lineHeight: 1.1, mb: 2,
                background: `linear-gradient(130deg,${COLORS.ERROR_RED} 0%,${COLORS.PRIMARY_PURPLE} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Delete Your Account
              </Typography>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Typography variant="h6" sx={{ color: secondaryTxt, fontWeight: 400, maxWidth: 560, mx: "auto", lineHeight: 1.75, fontSize: { xs: "1rem", md: "1.1rem" } }}>
                Before you proceed, please read our deletion policies carefully. This action is permanent and cannot be undone.
              </Typography>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        {/* ── POLICY CARDS ── */}
        <Box ref={policyRef} sx={{ mb: { xs: 6, md: 8 } }}>
          <motion.div initial="hidden" animate={policyInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: primaryTxt, textAlign: "center", mb: 1 }}>
                What Happens When You Delete?
              </Typography>
              <Typography variant="body1" sx={{ color: secondaryTxt, textAlign: "center", mb: 5, maxWidth: 520, mx: "auto" }}>
                Please read and understand each policy before proceeding with account deletion.
              </Typography>
            </motion.div>
            <Grid container spacing={3}>
              {policies.map((p, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <motion.div variants={fadeUp}>
                    <Card elevation={0} sx={{
                      height: "100%", bgcolor: cardBg, borderRadius: "18px",
                      border: `1px solid ${p.color}25`,
                      background: isDark
                        ? `linear-gradient(135deg,${p.color}08 0%,transparent 70%)`
                        : `linear-gradient(135deg,${p.color}06 0%,transparent 70%)`,
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: `0 16px 40px ${p.color}20`, border: `1px solid ${p.color}50` },
                    }}>
                      <CardContent sx={{ p: "24px !important" }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: "14px", bgcolor: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <p.icon sx={{ color: p.color, fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 1, fontSize: "0.9375rem", lineHeight: 1.35 }}>{p.title}</Typography>
                        <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.7 }}>{p.desc}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* ── DELETION FLOW ── */}
        <Box ref={formRef} sx={{ maxWidth: 560, mx: "auto", mb: 4 }}>
          <motion.div initial="hidden" animate={formInView ? "visible" : "hidden"} variants={fadeUp}>
            <Box sx={{
              bgcolor: cardBg,
              border: `2px solid ${step === "done" ? COLORS.SUCCESS_GREEN : COLORS.ERROR_RED}`,
              borderRadius: "24px",
              p: { xs: 3, sm: 4 },
              boxShadow: isDark
                ? `0 8px 48px ${COLORS.ERROR_RED}20`
                : `0 8px 48px ${COLORS.ERROR_RED}12`,
            }}>

              {/* ─ STEP: POLICY AGREE & CONTACT INPUT ─ */}
              {step === "policy" && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: `${COLORS.ERROR_RED}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <DeleteForeverIcon sx={{ color: COLORS.ERROR_RED, fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, lineHeight: 1.2 }}>Proceed with Deletion</Typography>
                      <Typography variant="caption" sx={{ color: secondaryTxt }}>We'll send an OTP to verify your identity</Typography>
                    </Box>
                  </Box>

                  {/* Agreement checkbox */}
                  <Box
                    onClick={() => setAgreed(!agreed)}
                    sx={{
                      display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, mb: 3, cursor: "pointer",
                      bgcolor: agreed ? `${COLORS.ERROR_RED}08` : isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#fafafa",
                      borderRadius: "12px", border: `1px solid ${agreed ? COLORS.ERROR_RED + "40" : border}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <Box sx={{
                      width: 20, height: 20, borderRadius: "6px", border: `2px solid ${agreed ? COLORS.ERROR_RED : border}`,
                      bgcolor: agreed ? COLORS.ERROR_RED : "transparent", flexShrink: 0, mt: "2px",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                    }}>
                      {agreed && <Box component="span" sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 900, lineHeight: 1 }}>✓</Box>}
                    </Box>
                    <Typography variant="body2" sx={{ color: secondaryTxt, lineHeight: 1.65, userSelect: "none" }}>
                      I have read and understood all the deletion policies above. I acknowledge that this action is <strong style={{ color: COLORS.ERROR_RED }}>permanent and irreversible</strong>.
                    </Typography>
                  </Box>

                  {/* Contact method tabs */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: primaryTxt, mb: 1 }}>
                    Verify via
                  </Typography>
                  <Box sx={{ display: "flex", bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f5f5f5", borderRadius: "12px", p: 0.5, mb: 2 }}>
                    {(["email", "phone"] as ContactMethod[]).map((m) => {
                      const active = contactMethod === m;
                      return (
                        <Box key={m} onClick={() => { setContactMethod(m); setContactValue(""); setError(""); }}
                          sx={{ flex: 1, py: 1.25, borderRadius: "10px", textAlign: "center", cursor: "pointer", bgcolor: active ? COLORS.ERROR_RED : "transparent", transition: "all 0.2s", "&:hover": { bgcolor: active ? COLORS.ERROR_RED : `${COLORS.ERROR_RED}15` } }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: active ? "#fff" : secondaryTxt, fontSize: "0.8125rem" }}>
                            {m === "email" ? "📧 Email" : "📱 Phone"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}

                  <TextField
                    fullWidth
                    label={contactMethod === "email" ? "Email Address" : "Phone Number"}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    type={contactMethod === "email" ? "email" : "tel"}
                    inputProps={contactMethod === "phone" ? { maxLength: 10 } : {}}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {contactMethod === "email"
                            ? <EmailOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} />
                            : <PhoneAndroidOutlinedIcon sx={{ color: secondaryTxt, fontSize: 20 }} />}
                        </InputAdornment>
                      ),
                    }}
                    sx={{ ...inputSx, mb: 2.5 }}
                  />

                  <Box
                    id="delete-send-otp-btn"
                    onClick={agreed ? handleSendOtp : undefined}
                    sx={{
                      width: "100%", py: 1.75, borderRadius: "12px", textAlign: "center", cursor: agreed ? "pointer" : "not-allowed",
                      background: agreed ? `linear-gradient(135deg,${COLORS.ERROR_RED},#c2185b)` : isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f0f0f0",
                      color: agreed ? "#fff" : secondaryTxt, fontWeight: 700, fontSize: "1rem",
                      boxShadow: agreed ? `0 6px 24px ${COLORS.ERROR_RED}35` : "none",
                      transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      "&:hover": agreed ? { opacity: 0.9, transform: "translateY(-1px)" } : {},
                    }}
                  >
                    <DeleteForeverIcon sx={{ fontSize: 20 }} />
                    Send Verification OTP
                  </Box>
                </Box>
              )}

              {/* ─ STEP: OTP ENTRY ─ */}
              {step === "otp" && (
                <Box>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: `${COLORS.ERROR_RED}15`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                      <LockOutlinedIcon sx={{ color: COLORS.ERROR_RED, fontSize: 26 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: primaryTxt, mb: 0.75 }}>Enter Verification OTP</Typography>
                    <Typography variant="body2" sx={{ color: secondaryTxt }}>
                      A 6-digit OTP has been sent to{" "}
                      <Box component="span" sx={{ color: primaryTxt, fontWeight: 600 }}>{contactValue}</Box>
                    </Typography>
                  </Box>

                  {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2.5, borderRadius: "10px" }}>{error}</Alert>}

                  {/* OTP Boxes */}
                  <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mb: 3 }}>
                    {otp.map((digit, i) => (
                      <Box
                        key={i}
                        id={`otp-input-${i}`}
                        component="input"
                        value={digit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e: React.KeyboardEvent) => handleOtpKeyDown(e, i)}
                        maxLength={1}
                        sx={{
                          width: { xs: 44, sm: 52 }, height: { xs: 52, sm: 60 },
                          borderRadius: "12px", border: `2px solid ${digit ? COLORS.ERROR_RED : border}`,
                          bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#f9f9ff",
                          textAlign: "center", fontSize: "1.5rem", fontWeight: 700,
                          color: primaryTxt, outline: "none",
                          transition: "all 0.15s",
                          "&:focus": { border: `2px solid ${COLORS.ERROR_RED}`, boxShadow: `0 0 0 3px ${COLORS.ERROR_RED}20` },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Resend */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    {resendTimer > 0 ? (
                      <Typography variant="body2" sx={{ color: secondaryTxt }}>
                        Resend OTP in <Box component="span" sx={{ color: COLORS.ERROR_RED, fontWeight: 600 }}>{resendTimer}s</Box>
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        onClick={() => { setStep("policy"); setOtp(["", "", "", "", "", ""]); }}
                        sx={{ color: COLORS.ERROR_RED, fontWeight: 600, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                      >
                        Resend OTP
                      </Typography>
                    )}
                  </Box>

                  <Box
                    id="delete-verify-otp-btn"
                    onClick={handleVerifyOtp}
                    sx={{
                      width: "100%", py: 1.75, borderRadius: "12px", textAlign: "center", cursor: "pointer",
                      background: `linear-gradient(135deg,${COLORS.ERROR_RED},#c2185b)`,
                      color: "#fff", fontWeight: 700, fontSize: "1rem",
                      boxShadow: `0 6px 24px ${COLORS.ERROR_RED}35`,
                      transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                    }}
                  >
                    <DeleteForeverIcon sx={{ fontSize: 20 }} />
                    Verify & Delete Account
                  </Box>

                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      onClick={() => { setStep("policy"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                      sx={{ color: secondaryTxt, cursor: "pointer", "&:hover": { color: primaryTxt } }}
                    >
                      ← Go back
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* ─ STEP: DONE ─ */}
              {step === "done" && (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 72, color: COLORS.SUCCESS_GREEN, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: primaryTxt, mb: 1 }}>Account Deleted</Typography>
                  <Typography variant="body1" sx={{ color: secondaryTxt, mb: 1.5, lineHeight: 1.75 }}>
                    Your KartSquare account and all associated data have been permanently deleted.
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryTxt, mb: 4 }}>
                    A confirmation has been sent to <Box component="span" sx={{ fontWeight: 600, color: primaryTxt }}>{contactValue}</Box>.
                  </Typography>
                  <Box
                    onClick={() => router.push("/External/GlobalAboutUs")}
                    sx={{ display: "inline-block", px: 5, py: 1.5, bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9375rem", transition: "all 0.2s", "&:hover": { bgcolor: COLORS.PURPLE_HOVER, transform: "translateY(-1px)" } }}
                  >
                    Explore About Us
                  </Box>
                </Box>
              )}
            </Box>

            {/* Safety note */}
            {step !== "done" && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mt: 3, p: 2, bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : "#fffbeb", border: `1px solid #f59e0b30`, borderRadius: "12px" }}>
                <WarningAmberIcon sx={{ color: "#f59e0b", fontSize: 20, mt: "2px", flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: secondaryTxt, lineHeight: 1.65 }}>
                  <strong style={{ color: primaryTxt as string }}>Need help instead?</strong> If you're facing issues with your account, our support team can help resolve them without deleting your account.{" "}
                  <Box
                    component="span"
                    onClick={() => router.push("/External/GlobalContactUs")}
                    sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                  >
                    Contact Support →
                  </Box>
                </Typography>
              </Box>
            )}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
