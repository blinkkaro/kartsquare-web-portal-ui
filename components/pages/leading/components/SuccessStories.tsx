"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { keyframes } from "@mui/system";
import { getSuccessStories } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";

const scrollUp = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const scrollDown = keyframes`
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
`;

const MarqueeColumn = ({
  stories,
  speed,
  reverse = false,
  isDark,
  paused,
}: {
  stories: ReturnType<typeof getSuccessStories>;
  speed: number;
  reverse?: boolean;
  isDark: boolean;
  paused: boolean;
}) => {
  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 3 }}>
      {stories.map((story, index) => (
        <Box
          key={index}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
            boxShadow: isDark
              ? "none"
              : "0 4px 24px rgba(94, 24, 233, 0.04), 0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
              fontWeight: 500,
              lineHeight: 1.6,
              fontSize: "0.9375rem",
            }}
          >
            {story.tagline}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Use Next.js Image for automatic WebP conversion + lazy loading */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={story.image}
                alt={story.name}
                fill
                sizes="48px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {story.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                  fontSize: "0.75rem",
                }}
              >
                {story.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // Pause the CSS animation when the section is off-screen or on hover
        animationPlayState: paused ? "paused" : "running",
        animation: `${reverse ? scrollDown : scrollUp} ${speed}s linear infinite`,
        "&:hover": {
          animationPlayState: "paused",
        },
      }}
    >
      {content}
      {/* Duplicate for seamless loop */}
      {content}
    </Box>
  );
};

const SuccessStories = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const stories = getSuccessStories(t);
  const containerRef = useRef<HTMLDivElement>(null);
  // Pause all animations when section is not in the viewport to save GPU cycles
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Divide into 3 columns
  const col1 = stories.filter((_, i) => i % 3 === 0);
  const col2 = stories.filter((_, i) => i % 3 === 1);
  const col3 = stories.filter((_, i) => i % 3 === 2);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark
          ? COLORS.BACKGROUND.SECONDARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <SectionHeading
            title={t("whatSuccessLooksLikeTitle")}
            subtitle={t("whatSuccessLooksLikeSubtext")}
            variant="accent"
            align="center"
          />
        </Box>

        <Box
          ref={containerRef}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            height: { xs: 500, md: 700 },
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        >
          {/* Column 1: Scrolls Up */}
          <Box sx={{ display: "block" }}>
            <MarqueeColumn stories={col1} speed={25} isDark={isDark} paused={!isVisible} />
          </Box>
          {/* Column 2: Scrolls Down (Reverse) */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <MarqueeColumn stories={col2} speed={30} reverse isDark={isDark} paused={!isVisible} />
          </Box>
          {/* Column 3: Scrolls Up */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <MarqueeColumn stories={col3} speed={28} isDark={isDark} paused={!isVisible} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default SuccessStories;
