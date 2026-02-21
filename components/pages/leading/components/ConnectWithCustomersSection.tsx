"use client";

import React from "react";
import { Box, Typography, Container, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getFreeListingBenefits } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";

const PURPLE = COLORS.PRIMARY_PURPLE;

const ConnectWithCustomersSection = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <SectionHeading
            title={t("connectWithCustomersTitle")}
            subtitle={t("connectWithCustomersSubtext")}
            variant="gradient"
            align="center"
          />
        </Box>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left: phone mockup (reference: floating, tilted) */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  height: { xs: 280, sm: 340 },
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)"}`,
                  boxShadow: isDark
                    ? "none"
                    : "0 24px 48px rgba(94, 24, 233, 0.12), 0 8px 16px rgba(0,0,0,0.06)",
                  transform: { md: "rotate(-2deg)" },
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                }}
              >
                <Image
                  src="/businessProfile.png"
                  alt="Business profile on kartsquare"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center top" }}
                />
              </Box>
            </motion.div>
          </Grid>
          {/* Right: Create posts, offers, and events + list (reference) */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)"}`,
                  boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.08)",
                }}
              >
                <Typography
                  variant="overline"
                  fontWeight={700}
                  sx={{ color: PURPLE, letterSpacing: 1.2, display: "block", mb: 1 }}
                >
                  {t("yourFreeListingPage")}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontFamily: "var(--font-heading)",
                    mt: 0.75,
                    mb: 1.5,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontSize: "1.125rem",
                  }}
                >
                  {t("oneProfileMoreVisibility")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {t("completeBusinessProfile")}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {getFreeListingBenefits(t).map((text: string, i: number) => (
                    <Box
                      key={i}
                      component="li"
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.25 }}
                    >
                      <CheckCircleIcon sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 22, flexShrink: 0, mt: 0.15 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
        </Container>
      </Box>
    );
  };

export default ConnectWithCustomersSection;
