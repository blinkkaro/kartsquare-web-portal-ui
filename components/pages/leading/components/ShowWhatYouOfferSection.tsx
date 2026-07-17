"use client";

import React from "react";
import { Box, Typography, Container, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";
import { ScrollStagger, staggerItemVariants } from "./ScrollReveal";

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;

// Individual card animation — used as staggerItemVariants child inside ScrollStagger
// This replaces per-card whileInView observers (was 3 IntersectionObserver instances)
// with a single shared ScrollStagger observer.
const cardVariants = staggerItemVariants;

const ShowWhatYouOfferSection = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const blocks = [
    {
      title: t("acceptOrdersTitle"),
      desc: t("acceptOrdersDesc"),
      learnMore: t("acceptOrdersLearnMore"),
      Icon: RestaurantOutlinedIcon,
      image: "/businessProfile.png",
      imageAlt: "Orders and reservations",
      bgTint: isDark ? "rgba(255,255,255,0.04)" : "rgba(94, 24, 233, 0.06)",
      accent: "purple",
    },
    {
      title: t("beFoundForWhatYouSellTitle"),
      desc: t("beFoundForWhatYouSellDesc"),
      learnMore: t("beFoundLearnMore"),
      Icon: StorefrontOutlinedIcon,
      image: "/serviceProfile.png",
      imageAlt: "Products and inventory",
      bgTint: isDark ? "rgba(255,255,255,0.04)" : "rgba(52, 168, 83, 0.08)",
      accent: "green",
    },
    {
      title: t("offerYourServicesTitle"),
      desc: t("offerYourServicesDesc"),
      learnMore: t("offerServicesLearnMore"),
      Icon: BuildOutlinedIcon,
      image: "/businessProfile.png",
      imageAlt: "Services and quotes",
      bgTint: isDark ? "rgba(255,255,255,0.04)" : "rgba(255, 193, 7, 0.08)",
      accent: "amber",
    },
  ];

  const [hero, ...sideCards] = blocks;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-15%",
          width: "50%",
          height: "80%",
          background: isDark
            ? "radial-gradient(ellipse, rgba(94, 24, 233, 0.12) 0%, transparent 60%)"
            : "radial-gradient(ellipse, rgba(94, 24, 233, 0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: "center" }}>
          <SectionHeading
            title={t("showWhatYouOfferTitle")}
            subtitle={t("showWhatYouOfferSubtext")}
            variant="accent"
            align="center"
          />
        </Box>

        {/* Bento: hero card left, two compact cards right (desktop) | stacked (mobile) */}
        {/* ScrollStagger: single IntersectionObserver for all 3 cards vs per-card observers */}
        <ScrollStagger>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
            gridTemplateRows: { md: "auto auto" },
            gap: { xs: 3, md: 2.5 },
            alignItems: "stretch",
          }}
        >
          {/* Hero card — large, spans 2 rows on desktop */}
          <Box sx={{ gridRow: { md: "1 / 3" }, minHeight: 0 }}>
          <motion.div
            variants={cardVariants}
            style={{ height: "100%" }}
          >
            <Box
              sx={{
                height: "100%",
                minHeight: { md: 420 },
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                border: "1px solid transparent",
                background: isDark
                  ? `linear-gradient(${COLORS.BACKGROUND.PAPER_DARK}, ${COLORS.BACKGROUND.PAPER_DARK}) padding-box, linear-gradient(145deg, rgba(94,24,233,0.35), rgba(94,24,233,0.08)) border-box`
                  : "linear-gradient(#fff, #fff) padding-box, linear-gradient(145deg, rgba(94,24,233,0.4), rgba(94,24,233,0.06)) border-box",
                backgroundOrigin: "border-box",
                boxShadow: isDark ? "none" : "0 12px 48px rgba(94, 24, 233, 0.08)",
                overflow: "hidden",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: isDark ? "none" : "0 24px 56px rgba(94, 24, 233, 0.12)",
                },
              }}
            >
              <Box sx={{ position: "relative", flex: "1 1 0", minHeight: 220 }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: hero.bgTint,
                    borderBottom: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
                  }}
                >
                  <Image
                    src={hero.image}
                    alt={hero.imageAlt}
                    fill
                    style={{ objectFit: "contain", objectPosition: "center center" }}
                  />
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "3.5rem",
                    lineHeight: 1,
                    color: isDark ? "rgba(255,255,255,0.06)" : "rgba(94, 24, 233, 0.08)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  01
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_HOVER} 100%)`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 24px ${PURPLE}50`,
                    "& .MuiSvgIcon-root": { fontSize: 28 },
                  }}
                >
                  <hero.Icon />
                </Box>
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.375rem",
                    letterSpacing: "-0.02em",
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    mb: 1.25,
                  }}
                >
                  {hero.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    lineHeight: 1.7,
                    fontSize: "0.9375rem",
                    mb: 2,
                  }}
                >
                  {hero.desc}
                </Typography>
                <Button
                  component={Link}
                  href="/business-listing"
                  variant="contained"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    bgcolor: PURPLE,
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    py: 1.25,
                    px: 2.5,
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${PURPLE}40`,
                    "&:hover": { bgcolor: PURPLE_HOVER, boxShadow: `0 8px 28px ${PURPLE}50` },
                  }}
                >
                  {hero.learnMore}
                </Button>
              </Box>
            </Box>
          </motion.div>
          </Box>

          {/* Right column: two compact cards */}
          {sideCards.map((card, i) => {
            const Icon = card.Icon;
            const index = i + 1;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: { xs: "row", sm: "row", md: "column" },
                    borderRadius: 3,
                    border: "1px solid transparent",
                    background: isDark
                      ? `linear-gradient(${COLORS.BACKGROUND.PAPER_DARK}, ${COLORS.BACKGROUND.PAPER_DARK}) padding-box, linear-gradient(145deg, rgba(94,24,233,0.2), rgba(94,24,233,0.04)) border-box`
                      : "linear-gradient(#fff, #fff) padding-box, linear-gradient(145deg, rgba(94,24,233,0.25), rgba(94,24,233,0.05)) border-box",
                    backgroundOrigin: "border-box",
                    boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.06)",
                    overflow: "hidden",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: isDark ? "none" : "0 16px 40px rgba(94, 24, 233, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: 120, md: "100%" },
                      minHeight: { xs: 140, md: 160 },
                      flexShrink: 0,
                      bgcolor: card.bgTint,
                      borderRight: { xs: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`, md: "none" },
                      borderBottom: { md: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}` },
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      loading="lazy"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        color: isDark ? "rgba(255,255,255,0.08)" : "rgba(94, 24, 233, 0.1)",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "rgba(94, 24, 233, 0.1)",
                        color: PURPLE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1rem",
                        letterSpacing: "-0.01em",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        mb: 0.5,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        lineHeight: 1.5,
                        fontSize: "0.8125rem",
                        flex: 1,
                        mb: 1,
                      }}
                    >
                      {card.desc}
                    </Typography>
                    <Button
                      component={Link}
                      href="/business-listing"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        color: PURPLE,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        p: 0,
                        minHeight: "auto",
                        alignSelf: "flex-start",
                        "&:hover": { bgcolor: "transparent", color: PURPLE_HOVER },
                      }}
                    >
                      {card.learnMore}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
        </ScrollStagger>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default ShowWhatYouOfferSection;
