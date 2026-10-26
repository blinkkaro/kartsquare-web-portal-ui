"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section } from "./shared";
import { HOME_PHOTOS } from "./homePhotos";

const DUMMY_CITY_SERVICES = [
  "AC repair & gas refilling",
  "Home deep cleaning",
  "Water purifier service",
  "Packers & movers",
  "Electrician & wiring",
  "Salon at home & bridal makeup",
  "Plumbing & bathroom fittings",
  "Carpentry & furniture assembly",
];

const WHY_REASONS = [
  {
    icon: GridViewRoundedIcon,
    title: "All local, one place",
    body: "Services and shops in your city, one search away.",
  },
  {
    icon: PhotoLibraryOutlinedIcon,
    title: "See real work first",
    body: "Photos, reels and portfolios before you decide who to call.",
  },
  {
    icon: BalanceRoundedIcon,
    title: "Compare easily",
    body: "Consistent profiles make it simple to weigh options side by side.",
  },
  {
    icon: ChatBubbleOutlineRoundedIcon,
    title: "Connect direct",
    body: "Call or send an enquiry, and book where it's offered.",
  },
] as const;

export default function NewPopularInArea() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const { location } = useAILocation();
  const { data: categories } = useCategories();

  const city = location.city || "Jaipur";

  // Use API categories if available, else dummy services
  const serviceList = (categories && categories.length > 0)
    ? categories.slice(0, 8).map((c) => c.name)
    : DUMMY_CITY_SERVICES;

  return (
    <Section id="popular-area" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 0 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1.4fr)" }, gap: 4, alignItems: "stretch" }}>
        {/* Left: Popular in City Card */}
        <Box
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Banner with Hawa Mahal image */}
          <Box
            sx={{
              position: "relative",
              height: 180,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
              bgcolor: COLORS.PRIMARY_PURPLE,
            }}
          >
            <Image
              src={HOME_PHOTOS.hawaMahal.src}
              alt={HOME_PHOTOS.hawaMahal.alt}
              fill
              loading="lazy"
              style={{ objectFit: "cover", opacity: 0.35 }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, ${COLORS.PRIMARY_PURPLE} 0%, rgba(105,39,218,0.7) 100%)`,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Popular in
              </Typography>
              <Typography sx={{ color: "#fff", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {city}
              </Typography>
            </Box>
          </Box>

          {/* List of services in city */}
          <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
            {serviceList.map((serviceName, idx) => (
              <Box
                key={idx}
                component={Link}
                href={`/cus/servicesList?search=${encodeURIComponent(serviceName)}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.25,
                  px: 1.5,
                  borderRadius: 2.5,
                  color: "text.primary",
                  textDecoration: "none",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  transition: "background-color 150ms ease, color 150ms ease, transform 150ms ease",
                  "&:hover": {
                    bgcolor: COLORS.PURPLE_ALPHA_10,
                    color: COLORS.PRIMARY_PURPLE,
                    transform: "translateX(4px)",
                  },
                }}
              >
                <span>{serviceName}</span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right: Why Kartsquare? Feature Grid */}
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.45rem", md: "1.85rem" },
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "text.primary",
                mb: 0.75,
              }}
            >
              Why Kartsquare?
            </Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "text.secondary" }}>
              Built to make discovering and booking reliable local services completely transparent.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" },
              gap: 2.5,
            }}
          >
            {WHY_REASONS.map(({ icon: Icon, title, body }) => (
              <Box
                key={title}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
                  boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                  transition: "transform 200ms ease, border-color 200ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: COLORS.PRIMARY_PURPLE,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: COLORS.PURPLE_ALPHA_10,
                    color: COLORS.PRIMARY_PURPLE,
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
                <Typography component="h3" sx={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.01em", mt: 0.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.55, color: "text.secondary" }}>
                  {body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
