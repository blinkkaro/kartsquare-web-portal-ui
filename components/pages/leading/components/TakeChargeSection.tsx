"use client";

import React from "react";
import { Box, Typography, Container, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import SectionHeading from "./SectionHeading";
import { ScrollStagger, staggerItemVariants } from "./ScrollReveal";
import SectionCTA from "./SectionCTA";

const PURPLE = COLORS.PRIMARY_PURPLE;

const TakeChargeSection = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const items = [
    { title: t("addEssentialInfo"), desc: t("addEssentialInfoDesc"), Icon: InfoOutlinedIcon },
    { title: t("sharePhotosLogos"), desc: t("sharePhotosLogosDesc"), Icon: PhotoCameraOutlinedIcon },
    { title: t("showWhoYouAre"), desc: t("showWhoYouAreDesc"), Icon: BadgeOutlinedIcon },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionHeading
            title={t("takeChargeTitle")}
            subtitle={t("takeChargeSubtext")}
            variant="accent"
            align="center"
          />
        </Box>
        <ScrollStagger staggerDelay={0.12}>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="stretch">
            {items.map((item, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <motion.div variants={staggerItemVariants} style={{ height: "100%" }}>
                  <Box
                    sx={{
                      height: "100%",
                      p: 3,
                      borderRadius: 3,
                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                      border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                      boxShadow: isDark ? "none" : "0 4px 20px rgba(94, 24, 233, 0.06)",
                      transition: "transform 0.35s ease, box-shadow 0.35s ease",
                      mt: { xs: 0, md: i === 1 ? 3 : 0 },
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: isDark ? "none" : "0 16px 48px rgba(94, 24, 233, 0.14)",
                      },
                    }}
                  >
                    <item.Icon sx={{ fontSize: 40, color: PURPLE, mb: 1.5 }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        fontFamily: "var(--font-heading)",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        mb: 1,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        lineHeight: 1.65,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </ScrollStagger>
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default TakeChargeSection;
