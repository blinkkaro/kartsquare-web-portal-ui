"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  MenuItem,
  Grid,
  Skeleton,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getStatCards } from "./constants";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// LeadCaptureForm is code-split: yup + react-hook-form + countries data (~35KB)
// are loaded after the hero shell renders. A skeleton prevents layout shift.
const LeadCaptureForm = dynamic(() => import("./LeadCaptureForm"), {
  ssr: false,
  loading: () => (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="rounded" height={52} sx={{ mb: 2, borderRadius: 2 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
    </Box>
  ),
});

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;
const PURPLE_ALPHA_04 = COLORS.PURPLE_ALPHA_04;

const Hero: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        py: { xs: 4, sm: 5, md: 6 },
        px: { xs: 2, sm: 3 },
        background: isDark
          ? COLORS.DARK_GRADIENT
          : "linear-gradient(165deg, #fafaff 0%, #f5f0ff 35%, #faf8ff 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before":
          isDark
            ? {}
            : {
              content: '""',
              position: "absolute",
              top: "-30%",
              right: "-15%",
              width: "55%",
              height: "90%",
              background: "radial-gradient(ellipse, rgba(94, 24, 233, 0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Grid container spacing={{ xs: 3, lg: 2 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ maxWidth: 600 }}>
              {/* Breadcrumb */}
              <Typography
                variant="caption"
                component="nav"
                aria-label="Breadcrumb"
                sx={{
                  display: "block",
                  mb: 2,
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                  fontSize: "0.8125rem",
                  "& a": { color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } },
                }}
              >
                <Link href="/">{t("home")}</Link>
                {" / "}
                <Box component="span" fontWeight={600} color={isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT}>
                  {t("listYourBusiness")}
                </Box>
              </Typography>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    lineHeight: 1.18,
                    mb: 1.5,
                    letterSpacing: "-0.025em",
                  }}
                >
                  <Box component="span" sx={{ color: PURPLE }}>
                    {t("standOutHighlight")}
                  </Box>
                  {t("standOutRest")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "1.0625rem",
                    lineHeight: 1.55,
                    mb: 3,
                  }}
                >
                  {t("standOutSubtext")}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                style={{ position: 'relative', zIndex: 10 }} // Ensure form stays clickable above backgrounds
              >
                <LeadCaptureForm />
              </motion.div>
            </Box>
          </Grid>


          {/* Right: floating composition — phone + image stat cards */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                pl: { lg: 1 },
                minHeight: 300,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: 360,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Central phone — larger, device-like height */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    transform: "rotate(-3deg)",
                    width: "min(280px, 26vw)",
                    aspectRatio: "3/4",
                    maxHeight: 420,
                    minHeight: 510,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      borderRadius: "28px",
                      overflow: "hidden",
                      border: `10px solid ${isDark ? "#1a1a24" : "#0a0a0f"}`,
                      boxShadow: isDark
                        ? "0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
                        : "0 24px 56px rgba(94, 24, 233, 0.15), 0 12px 32px rgba(0,0,0,0.08)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "28%",
                        height: 18,
                        borderRadius: "0 0 10px 10px",
                        bgcolor: "#0a0a0f",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Image
                      src="/auth/Home.JPG"
                      alt="kartsquare app"
                      fill
                      sizes="360px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                      priority
                    />
                  </Box>
                </motion.div>

                {/* Floating stat cards with image strips */}
                {getStatCards(t).map(({ value, label, icon: Icon, color: statColor }, i) => {
                  const positions = [
                    { top: "4%", right: "0%", rotate: 8, delay: 0.25 },
                    { bottom: "8%", left: "-2%", rotate: -6, delay: 0.35 },
                    { bottom: "12%", right: "2%", rotate: 5, delay: 0.45 },
                  ];
                  const pos = positions[i];
                  const imagePositions: Record<number, string> = {
                    0: "center 10%",
                    1: "center 50%",
                    2: "center 90%",
                  };
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 16, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: pos.delay }}
                      style={{
                        position: "absolute",
                        top: pos.top,
                        bottom: pos.bottom,
                        left: pos.left,
                        right: pos.right,
                        zIndex: i === 1 ? 3 : 1,
                        transform: `rotate(${pos.rotate}deg)`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          borderRadius: 2.5,
                          overflow: "hidden",
                          background: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.92)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"}`,
                          boxShadow: isDark
                            ? "0 12px 32px rgba(0,0,0,0.3)"
                            : "0 12px 32px rgba(94, 24, 233, 0.12), 0 4px 16px rgba(0,0,0,0.06)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        <Box
                          sx={{
                            height: 44,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/auth/Home.JPG"
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="120px"
                            loading="lazy"
                            style={{
                              objectFit: "cover",
                              objectPosition: imagePositions[i],
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              background: isDark
                                ? "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)"
                                : "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.85) 100%)",
                            }}
                          />
                        </Box>
                        <Box sx={{ p: 1.25, textAlign: "center" }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 28,
                              height: 28,
                              borderRadius: "8px",
                              bgcolor: `${statColor}20`,
                              color: statColor,
                              mb: 0.75,
                            }}
                          >
                            <Icon sx={{ fontSize: 16 }} />
                          </Box>
                          <Typography
                            fontWeight={800}
                            sx={{
                              fontSize: "1.125rem",
                              lineHeight: 1.2,
                              letterSpacing: "-0.02em",
                              color: statColor,
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            {value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                              fontSize: "0.5625rem",
                              lineHeight: 1.3,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              mt: 0.25,
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}

                {/* Second smaller screen for depth */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{
                    position: "absolute",
                    left: "18%",
                    top: "32%",
                    zIndex: 0,
                    width: "min(100px, 10vw)",
                    aspectRatio: "3/4",
                    maxHeight: 140,
                    transform: "rotate(12deg)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: `5px solid ${isDark ? "#252530" : "#e8e8f0"}`,
                      boxShadow: isDark
                        ? "0 12px 28px rgba(0,0,0,0.35)"
                        : "0 12px 28px rgba(0,0,0,0.08)",
                    }}
                  >
                     <Image
                       src="/auth/Home.JPG"
                       alt=""
                       aria-hidden="true"
                       fill
                       sizes="100px"
                       loading="lazy"
                       style={{ objectFit: "cover", objectPosition: "center 70%" }}
                     />
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
