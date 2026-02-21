"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { COLORS } from "@/constants/colors";

const PURPLE = COLORS.PRIMARY_PURPLE;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** "accent" = purple underline, "gradient" = gradient text, "minimal" = no underline */
  variant?: "accent" | "gradient" | "minimal";
  /** Center or left align */
  align?: "center" | "left";
  /** Animate on mount */
  animate?: boolean;
}

const sectionHeadingStyles = {
  title: {
    fontFamily: 'var(--font-heading), "Plus Jakarta Sans", "Poppins", sans-serif',
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: 'var(--font-body), "Inter", sans-serif',
    fontWeight: 300,
    letterSpacing: "-0.01em",
  },
};

export default function SectionHeading({
  title,
  subtitle,
  variant = "accent",
  align = "center",
  animate = true,
}: SectionHeadingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const textColor = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const subColor = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

  const content = (
    <Box sx={{ textAlign: align, position: "relative" }}>
      <Box sx={{ position: "relative", display: "inline-block", mb: subtitle ? 1.5 : 0 }}>
        <Typography
          component="h2"
          variant="h2"
          sx={{
            ...sectionHeadingStyles.title,
            color: variant === "gradient" ? "transparent" : textColor,
            background: variant === "gradient"
              ? `linear-gradient(135deg, ${PURPLE} 0%, #7c3aed 50%, ${COLORS.PRIMARY_BLUE} 100%)`
              : "none",
            backgroundClip: variant === "gradient" ? "text" : "unset",
            WebkitBackgroundClip: variant === "gradient" ? "text" : "unset",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          }}
        >
          {title}
        </Typography>
        {(variant === "accent" || variant === "gradient") && (
          <Box
            sx={{
              position: "absolute",
              left: align === "center" ? "50%" : 0,
              bottom: -8,
              transform: align === "center" ? "translateX(-50%)" : "none",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${PURPLE}, rgba(124, 58, 237, 0.9))`,
                transformOrigin: "left",
                animation: "heading-underline 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              }}
            />
          </Box>
        )}
      </Box>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            ...sectionHeadingStyles.subtitle,
            color: subColor,
            maxWidth: 560,
            mx: align === "center" ? "auto" : 0,
            lineHeight: 1.6,
            fontSize: "1rem",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
