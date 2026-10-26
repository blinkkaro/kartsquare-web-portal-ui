"use client";
import React from "react";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PlumbingRoundedIcon from "@mui/icons-material/PlumbingRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section } from "./shared";

type IconType = typeof AcUnitRoundedIcon;

/** Icon matching for categories. */
const ICON_RULES: Array<[RegExp, IconType]> = [
  [/\b(ac|appliance|cool)/i, AcUnitRoundedIcon],
  [/clean|pest|maid/i, CleaningServicesRoundedIcon],
  [/electric/i, BoltRoundedIcon],
  [/plumb/i, PlumbingRoundedIcon],
  [/beauty|salon|parlou?r|spa|groom/i, ContentCutRoundedIcon],
  [/photo|video/i, CameraAltRoundedIcon],
  [/pack|mov|shift/i, LocalShippingRoundedIcon],
];
const iconFor = (name: string): IconType => ICON_RULES.find(([re]) => re.test(name))?.[1] ?? HomeRepairServiceRoundedIcon;

/** Category images for the visual cards. */
const CATEGORY_IMAGES: Record<string, string> = {
  ac: "/images/home/ac-repair.jpg",
  clean: "/images/home/home-cleaning.jpg",
  beauty: "/images/home/beauty-salon.jpg",
  electric: "/images/home/electrician-box.jpg",
};

const getImageForCategory = (name: string): string | null => {
  const lower = name.toLowerCase();
  if (/\b(ac|appliance|cool)/i.test(lower)) return CATEGORY_IMAGES.ac;
  if (/clean|pest|maid/i.test(lower)) return CATEGORY_IMAGES.clean;
  if (/beauty|salon|parlou?r|spa|groom/i.test(lower)) return CATEGORY_IMAGES.beauty;
  if (/electric/i.test(lower)) return CATEGORY_IMAGES.electric;
  return null;
};

/** Short descriptions for known categories. */
const CATEGORY_DESCRIPTIONS: Array<[RegExp, string]> = [
  [/\b(ac|appliance|cool)/i, "Service, gas refill"],
  [/clean|pest|maid/i, "Deep cleaning, sanitization"],
  [/beauty|salon|parlou?r|spa|groom/i, "Hair, makeup, salon at home"],
  [/electric/i, "Wiring, fittings, repairs"],
  [/plumb/i, "Pipe fixing, installation"],
  [/pack|mov|shift/i, "Home and office shifting"],
  [/photo|video/i, "Weddings, events, portraits"],
];
const descFor = (name: string): string => CATEGORY_DESCRIPTIONS.find(([re]) => re.test(name))?.[1] ?? "Find approved providers";

/** Dummy categories used when API returns no data. */
const DUMMY_CATEGORIES = [
  { id: "ac-repair", name: "AC Repair", description: "Service, gas refill" },
  { id: "home-cleaning", name: "Home Cleaning", description: "Deep cleaning, sanitization" },
  { id: "beauty-salon", name: "Beauty & Salon", description: "Hair, makeup, salon at home" },
  { id: "electricians", name: "Electricians", description: "Wiring, fittings, repairs" },
  { id: "plumbers", name: "Plumbers", description: "Pipe fixing, installation" },
  { id: "packers-movers", name: "Packers & Movers", description: "Home and office shifting" },
  { id: "photographers", name: "Photographers", description: "Weddings, events, portraits" },
];

export default function NewCategoryGrid() {
  const router = useRouter();
  const dark = useTheme().palette.mode === "dark";
  const { data: categories, isLoading } = useCategories();

  // Use API data if available, else dummy
  const cats = (!isLoading && categories && categories.length > 0) ? categories : (isLoading ? null : DUMMY_CATEGORIES);
  const go = (id: string) => router.push(`/cus/servicesList?category=${encodeURIComponent(id)}`);

  // Split: first 4 get image cards, rest get icon-row items
  const imageCards = cats?.slice(0, 4) ?? [];
  const iconItems = cats?.slice(4) ?? [];

  return (
    <Section id="categories" sx={{ pt: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
        <Typography component="h2" sx={{ fontSize: { xs: "1.35rem", md: "1.7rem" }, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Popular categories
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 1.5 }}>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={210} sx={{ borderRadius: 4 }} />)}
        </Box>
      ) : (
        <>
          {/* Image category cards - 2x2 grid on mobile, 4 columns on desktop */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 1.5, mb: 2 }}>
            {imageCards.map((c, i) => {
              const img = getImageForCategory(c.name);
              const isFirst = i === 0;
              return (
                <Box
                  key={c.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => go(c.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(c.id); } }}
                  aria-label={`Browse ${c.name}`}
                  sx={{
                    position: "relative",
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: { xs: 180, md: 210 },
                    backgroundImage: img ? `url(${img})` : `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_20}, ${COLORS.PURPLE_ALPHA_04})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    bgcolor: dark ? "#2a2535" : "#f0edf5",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 14px 30px rgba(0,0,0,0.12)" },
                    "&:active": { transform: "scale(0.985)" },
                    "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
                  }}
                >
                  {/* Gradient overlay for text readability */}
                  <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }} />

                  {/* "Most booked" badge on first item */}
                  {isFirst && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        px: 1.25,
                        py: 0.4,
                        borderRadius: 2,
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                      }}
                    >
                      Most booked
                    </Box>
                  )}

                  {/* Category name + description */}
                  <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.2 }}>
                      {c.name}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.74rem", mt: 0.25 }}>
                      {c.description || descFor(c.name)}
                    </Typography>
                  </Box>

                  {/* Arrow */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowForwardRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Icon-row categories */}
          {iconItems.length > 0 && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 1.25 }}>
              {iconItems.map((c) => {
                const Icon = iconFor(c.name);
                return (
                  <Box
                    key={c.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => go(c.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(c.id); } }}
                    aria-label={`Browse ${c.name}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      cursor: "pointer",
                      transition: "border-color 160ms ease, background-color 160ms ease",
                      "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, bgcolor: COLORS.PURPLE_ALPHA_04 },
                      "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                    }}
                  >
                    <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: COLORS.PURPLE_ALPHA_10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.2 }}>{c.name}</Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", lineHeight: 1.3 }}>{c.description || descFor(c.name)}</Typography>
                    </Box>
                    <ArrowForwardRoundedIcon sx={{ color: "text.disabled", fontSize: 18, flexShrink: 0 }} />
                  </Box>
                );
              })}
            </Box>
          )}

          {/* View all link */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Box
              component="button"
              type="button"
              onClick={() => router.push("/cus/servicesList")}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontWeight: 700,
                fontSize: "0.88rem",
                color: COLORS.PRIMARY_PURPLE,
                transition: "opacity 160ms ease",
                "&:hover": { opacity: 0.8 },
              }}
            >
              View all categories
              <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </>
      )}
    </Section>
  );
}
