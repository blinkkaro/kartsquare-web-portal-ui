"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionTitleSx, sectionSubtitleSx } from "./shared";
import { HOME_PHOTOS } from "./homePhotos";

const COLUMN_SIZE = 5;
const MAX_COLUMNS = 2;

const columnHeadSx = { mb: 1.75, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" } as const;

/**
 * City tile + link lists. Links are the live category list (split into columns), so every
 * link goes to a real filtered results page. Skyline photo is shown only for Jaipur.
 */
export default function PopularInArea() {
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  const { data: categories } = useCategories();

  if (!categories || categories.length === 0) return null;

  const isJaipur = location.city.toLowerCase() === "jaipur";
  const columns = [
    { title: "Top services", items: categories.slice(0, COLUMN_SIZE) },
    { title: "More services", items: categories.slice(COLUMN_SIZE, COLUMN_SIZE * MAX_COLUMNS) },
  ].filter((c) => c.items.length > 0);
  const lift = dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;

  return (
    <Section sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: isJaipur ? "minmax(0, 1fr) minmax(0, 2.4fr)" : "minmax(0, 1fr)" }, gap: { xs: 3, md: 5 }, alignItems: "stretch" }}>
        {isJaipur && (
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 220, md: 300 },
              borderRadius: 5,
              overflow: "hidden",
              bgcolor: COLORS.PURPLE_ALPHA_10,
            }}
          >
            <Image src={HOME_PHOTOS.hawaMahal.src} alt={HOME_PHOTOS.hawaMahal.alt} fill loading="lazy" sizes="(max-width: 900px) 100vw, 280px" style={{ objectFit: "cover" }} />
            <Box sx={{ position: "absolute", left: 14, right: 14, bottom: 14, p: 1.5, borderRadius: 3.5, bgcolor: "rgba(255,255,255,0.95)", color: "#201b2c", boxShadow: "0 8px 24px rgba(32,27,44,0.16)" }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b6577" }}>You&apos;re exploring</Typography>
              <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.15, color: COLORS.PRIMARY_PURPLE }}>{location.city}</Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" sx={{ ...sectionTitleSx, fontSize: { xs: "1.4rem", md: "1.9rem" }, letterSpacing: "-0.035em" }}>
            Popular services in {location.city}
          </Typography>
          <Typography sx={{ ...sectionSubtitleSx, mt: 0.75, fontSize: "0.92rem" }}>Browse by what you need</Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: `repeat(${columns.length}, minmax(0, 1fr))` }, gap: { xs: 3, md: 4 }, mt: 3.5 }}>
            {columns.map((col) => (
              <Box key={col.title} component="nav" aria-label={col.title} sx={{ display: { xs: col.title === "Top services" ? "block" : "none", sm: "block" } }}>
                <Typography component="h3" sx={columnHeadSx}>{col.title}</Typography>
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {col.items.map((c) => (
                    <li key={c.id}>
                      <Box
                        component={Link}
                        href={`/cus/servicesList?category=${encodeURIComponent(c.id)}`}
                        sx={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: "0.95rem", color: "text.secondary", textDecoration: "none", transition: "color 150ms ease", "&:hover": { color: lift } }}
                      >
                        {c.name} in {location.city}
                      </Box>
                    </li>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
