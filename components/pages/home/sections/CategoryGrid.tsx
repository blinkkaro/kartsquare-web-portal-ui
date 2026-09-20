"use client";
import React from "react";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
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
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionEyebrowSx, sectionTitleSx, sectionSubtitleSx } from "./shared";

type IconType = typeof AcUnitRoundedIcon;

/** Picks an icon from the live category name; unknown names get a neutral toolbox. */
const ICON_RULES: Array<[RegExp, IconType]> = [
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

/** [gradient start, gradient end] per tile - rotates so neighbours never match. */
const PALETTE: Array<[string, string]> = [
  ["#6d28d9", "#a78bfa"],
  ["#e11d74", "#fb7ab0"],
  ["#0d9488", "#5eead4"],
  ["#ea580c", "#fdba74"],
  ["#2563eb", "#93c5fd"],
  ["#7c3aed", "#f0abfc"],
];

export default function CategoryGrid() {
  const router = useRouter();
  const dark = useTheme().palette.mode === "dark";
  const { location } = useAILocation();
  const { data: categories, isLoading } = useCategories();

  const go = (id: string) => router.push(`/cus/servicesList?category=${encodeURIComponent(id)}`);

  if (!isLoading && (!categories || categories.length === 0)) return null;

  return (
    <Section id="categories" sx={{ pt: { xs: 3, md: 4 } }}>
      {/* Header: eyebrow / title / subtext, with a clear "see all" control */}
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2.25 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 22, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, #e11d74)` }} />
            <Typography sx={{ ...sectionEyebrowSx, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
              Explore
            </Typography>
          </Box>
          <Typography component="h2" sx={sectionTitleSx}>
            What do you need done?
          </Typography>
          <Typography sx={sectionSubtitleSx}>
            Tap a category to see approved providers in {location.locality || location.city}.
          </Typography>
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => router.push("/cus/servicesList")}
          aria-label="See all categories"
          sx={{
            flexShrink: 0,
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            pl: 2,
            pr: 0.75,
            borderRadius: 99,
            cursor: "pointer",
            font: "inherit",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
            bgcolor: "transparent",
            border: `1.5px solid ${COLORS.PURPLE_ALPHA_30}`,
            transition: "background-color 160ms ease, color 160ms ease",
            "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", "& .go": { bgcolor: "#fff", color: COLORS.PRIMARY_PURPLE } },
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          See all
          <Box className="go" sx={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff", transition: "inherit" }}>
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 1.25, md: 2 } }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={176} sx={{ borderRadius: 5 }} />)
          : categories!.slice(0, 4).map((c, i) => {
              const Icon = iconFor(c.name);
              const [from, to] = PALETTE[i % PALETTE.length];
              return (
                <Box
                  key={c.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => go(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      go(c.id);
                    }
                  }}
                  aria-label={`Browse ${c.name}`}
                  sx={{
                    p: { xs: 1.25, sm: 1.75 },
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.25,
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    "&:hover": { transform: "translateY(-3px)", borderColor: from, boxShadow: `0 14px 30px ${from}30`, "& .cta": { bgcolor: from, color: "#fff", borderColor: from }, "& .cta-arrow": { transform: "translateX(3px)" } },
                    "&:active": { transform: "scale(0.985)" },
                    "&:focus-visible": { outline: `3px solid ${from}`, outlineOffset: 2 },
                    "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" }, "& .cta, & .cta-arrow": { transition: "none" } },
                  }}
                >
                  {/* Row 1: icon + title */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.25 } }}>
                    <Box sx={{ width: { xs: 34, sm: 44 }, height: { xs: 34, sm: 44 }, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 8px 16px ${from}44` }}>
                      <Icon sx={{ fontSize: { xs: 19, sm: 24 } }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.8rem", sm: "0.98rem" }, lineHeight: 1.2, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minWidth: 0, overflowWrap: "break-word" }}>
                      {c.name}
                    </Typography>
                  </Box>

                  {/* Row 2: description */}
                  <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.8em" }}>
                    {c.description || `Approved providers in ${location.city}`}
                  </Typography>

                  {/* Row 3: action */}
                  <Box
                    className="cta"
                    aria-hidden
                    sx={{ mt: "auto", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, borderRadius: 99, border: `1.5px solid ${from}66`, color: from, fontWeight: 800, fontSize: { xs: "0.74rem", sm: "0.8rem" }, whiteSpace: "nowrap", transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease" }}
                  >
                    View providers
                    <ArrowForwardRoundedIcon className="cta-arrow" sx={{ fontSize: 17, transition: "transform 180ms ease" }} />
                  </Box>
                </Box>
              );
            })}
      </Box>
    </Section>
  );
}
