"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PlumbingRoundedIcon from "@mui/icons-material/PlumbingRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import FormatPaintRoundedIcon from "@mui/icons-material/FormatPaintRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { PANEL_PX, Section, SectionHeader } from "./shared";
import { photoForCategory } from "./homePhotos";

type IconType = typeof AcUnitRoundedIcon;

/** Picks an icon from the live category name; unknown names get a neutral toolbox. */
const ICON_RULES: ReadonlyArray<readonly [RegExp, IconType]> = [
  [/\b(ac|appliance|cool)/i, AcUnitRoundedIcon],
  [/clean|pest|maid/i, CleaningServicesRoundedIcon],
  [/electric/i, BoltRoundedIcon],
  [/plumb/i, PlumbingRoundedIcon],
  [/auto|car|vehicle|bike/i, DirectionsCarRoundedIcon],
  [/beauty|salon|parlou?r|spa|groom/i, ContentCutRoundedIcon],
  [/photo|video/i, CameraAltRoundedIcon],
  [/event|wedding|party|cater/i, CelebrationRoundedIcon],
  [/legal|law|account|tax|finance|\bca\b/i, GavelRoundedIcon],
  [/tech|web|software|digital|it\b|marketing/i, LaptopMacRoundedIcon],
  [/paint|interior|decor/i, FormatPaintRoundedIcon],
  [/educat|tutor|coach|school/i, SchoolRoundedIcon],
  [/health|medical|doctor|wellness/i, LocalHospitalRoundedIcon],
];
const iconFor = (name: string): IconType => ICON_RULES.find(([re]) => re.test(name))?.[1] ?? HomeRepairServiceRoundedIcon;

const FEATURED_COUNT = 4;
const COMPACT_COUNT = 4;
const categoryHref = (id: string) => `/cus/servicesList?category=${encodeURIComponent(id)}`;

const clamp2 = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "normal", hyphens: "auto" } as const;
/** Below 360px the arrow button steals ~40px from the title, so it is hidden there. */
const HIDE_BELOW_360 = { display: { xs: "none", "@media (min-width:360px)": "flex" } } as const;

export default function CategoryGrid() {
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  const { data: categories, isLoading } = useCategories();

  if (!isLoading && (!categories || categories.length === 0)) return null;

  const featured = categories?.slice(0, FEATURED_COUNT) ?? [];
  const compact = categories?.slice(FEATURED_COUNT, FEATURED_COUNT + COMPACT_COUNT) ?? [];
  const lift = dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;

  return (
    <Section id="categories" sx={{ pt: 1, pb: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          px: PANEL_PX,
          py: { xs: 0, md: 5 },
          borderRadius: { xs: 0, md: 7 },
          bgcolor: { xs: "transparent", md: dark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT },
        }}
      >
        <SectionHeader
          title="Popular categories"
          subtitle={`Tap a category to see approved providers in ${location.locality || location.city}`}
          action={
            <Box
              component={Link}
              href="/cus/servicesList"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 44, flexShrink: 0, fontSize: "0.9rem", fontWeight: 700, color: lift, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              View all categories <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
            </Box>
          }
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.25, md: 2 } }}>
          {isLoading
            ? Array.from({ length: FEATURED_COUNT }).map((_, i) => <Skeleton key={i} variant="rounded" sx={{ height: { xs: 190, md: 250 }, borderRadius: 5 }} />)
            : featured.map((c, i) => {
                const photo = photoForCategory(c.name);
                const Icon = iconFor(c.name);
                return (
                  <Box
                    key={c.id}
                    component={Link}
                    href={categoryHref(c.id)}
                    aria-label={`Browse ${c.name}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      overflow: "hidden",
                      borderRadius: 5,
                      bgcolor: "background.paper",
                      color: "text.primary",
                      textDecoration: "none",
                      transition: "transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms ease, border-color 220ms ease",
                      "& img": { transition: "transform 600ms cubic-bezier(.2,.7,.2,1)" },
                      "&:hover": { transform: "translateY(-4px)", boxShadow: `0 14px 30px ${COLORS.PURPLE_ALPHA_20}` },
                      "&:hover img": { transform: "scale(1.06)" },
                      "&:hover .go": { bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", transform: "translateX(2px)" },
                      "&:active": { transform: "scale(0.98)" },
                      "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
                      "@media (prefers-reduced-motion: reduce)": { transition: "none", "& img, & .go": { transition: "none" }, "&:hover, &:hover img, &:hover .go": { transform: "none" } },
                    }}
                  >
                    <Box sx={{ position: "relative", height: { xs: 120, md: 164 }, overflow: "hidden", bgcolor: COLORS.PURPLE_ALPHA_10, display: "flex", alignItems: "center", justifyContent: "center", color: lift }}>
                      {photo ? (
                        <Image src={photo.src} alt="" fill loading="lazy" sizes="(max-width: 900px) 50vw, 250px" style={{ objectFit: "cover" }} />
                      ) : (
                        <Icon sx={{ fontSize: 56, opacity: 0.8 }} />
                      )}
                      {i === 0 && (
                        <Box sx={{ position: "absolute", top: 10, left: 10, px: 1.25, py: 0.4, borderRadius: 99, bgcolor: "#ffebdd", color: "#9a3412", fontSize: "0.7rem", fontWeight: 700 }}>
                          Top category
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, p: { xs: 1.25, md: 1.75 }, flex: 1 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1.02rem" }, fontWeight: 800, letterSpacing: "-0.015em", lineHeight: 1.25, ...clamp2 }}>{c.name}</Typography>
                        <Typography sx={{ mt: 0.25, fontSize: "0.76rem", color: "text.secondary", lineHeight: 1.4, ...clamp2, display: { xs: "none", sm: "-webkit-box" } }}>
                          {c.description || `Approved providers in ${location.city}`}
                        </Typography>
                      </Box>
                      <Box className="go" aria-hidden sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: "50%", ...HIDE_BELOW_360, alignItems: "center", justifyContent: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: lift, transition: "background-color 180ms ease, color 180ms ease, transform 220ms cubic-bezier(.2,.7,.2,1)" }}>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
        </Box>

        {compact.length > 0 && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, mt: 1.5 }}>
            {compact.map((c) => {
              const Icon = iconFor(c.name);
              return (
                <Box
                  key={c.id}
                  component={Link}
                  href={categoryHref(c.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    minHeight: 68,
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    color: "text.primary",
                    textDecoration: "none",
                    transition: "transform 200ms cubic-bezier(.2,.7,.2,1), border-color 200ms ease, box-shadow 200ms ease",
                    "&:hover": { transform: "translateY(-3px)", boxShadow: `0 10px 24px ${COLORS.PURPLE_ALPHA_20}` },
                    "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
                    "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
                  }}
                >
                  <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: lift }}>
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.3, ...clamp2, WebkitLineClamp: 1 }}>{c.name}</Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", lineHeight: 1.35, ...clamp2 }}>{c.description || `In ${location.city}`}</Typography>
                  </Box>
                  <ChevronRightRoundedIcon sx={{ color: lift, flexShrink: 0 }} />
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Section>
  );
}
