"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Skeleton,
  Typography,
  InputBase,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { toSlug } from "@/services/location/locationClient";
import { Section, sectionTitleSx, sectionSubtitleSx } from "./shared";
import CategoryIcon, { sameOrigin } from "@/components/common/CategoryIcon";

/** Fields from migration 006; the dummy fallback categories have none of them. */
type CategoryMedia = { icon?: string | null; color?: string | null; image?: string | null };

/** Hosts next.config lets next/image load from; any other photo falls back to the colour gradient. */
const PHOTO_HOSTS = /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|kartsquare-document\.s3\.ap-south-1\.amazonaws\.com)\//;
const photoSrc = (url?: string | null): string | null => {
  const src = sameOrigin(url);
  return src && (src.startsWith("/") || PHOTO_HOSTS.test(src)) ? src : null;
};

/** Short descriptions for all categories. */
const CATEGORY_DESCRIPTIONS: Array<[RegExp, string]> = [
  [/\b(agri|farm)/i, "Farming tools & supplies"],
  [/\b(air.*water|water.*treat)/i, "Purifiers & filter service"],
  [/\b(auto|cars?\b|bikes?\b)/i, "Car repair, service & wash"],
  [/\b(beauty|salon)/i, "Hair, makeup, salon at home"],
  [/\b(business\s*serv)/i, "Consulting, audit & support"],
  [/\b(cloth|tailor)/i, "Custom tailoring & stitching"],
  [/\b(construct|archit)/i, "Design, planning & renovation"],
  [/\b(courier|logist)/i, "Parcel dispatch & transport"],
  [/\b(educat|train)/i, "Tuition, coaching & skills"],
  [/\b(energy|solar)/i, "Solar panels, inverters & battery"],
  [/\b(event|celebrat)/i, "Weddings, decor & catering"],
  [/\b(financ|tax)/i, "Loans, taxes & accounting"],
  [/\b(fit|sport|gym)/i, "Trainers, gyms & fitness"],
  [/\b(gov|public)/i, "Public & municipal services"],
  [/\b(groc|daily)/i, "Daily groceries & essentials"],
  [/\b(health|medic)/i, "Clinics, therapy & doctors"],
  [/\b(home\s*serv)/i, "Repairs & handyman services"],
  [/\b(it\b|digital)/i, "Web, apps, IT support & AMC"],
  [/\b(jewel|gold)/i, "Gold, silver & ornaments"],
  [/\b(laundry|dry)/i, "Wash, fold & dry cleaning"],
  [/\b(legal|law)/i, "Consultation, notices & filings"],
  [/\b(manufact|indust)/i, "Industrial equipment & supply"],
  [/\b(media|creative)/i, "Branding & creative design"],
  [/\b(mobile|electronic)/i, "Phone, laptop & gadget repair"],
  [/\b(music)/i, "Audio, instruments & classes"],
  [/\b(ngo|social)/i, "Charity & social work"],
  [/\b(optic|eye)/i, "Frames, lenses & vision tests"],
  [/\b(pack|mov)/i, "Household & office shifting"],
  [/\b(pet|animal)/i, "Pet grooming, clinics & supplies"],
  [/\b(photo|video)/i, "Weddings, events & shoots"],
  [/\b(print|station)/i, "Flex, cards, books & print"],
  [/\b(real\s*estate)/i, "Buy, sell & rent properties"],
  [/\b(relig|spirit)/i, "Astrology, vastu & rituals"],
  [/\b(rental)/i, "Vehicle & equipment rentals"],
  [/\b(rest|food|cafe)/i, "Dine-in, takeaway & cafes"],
  [/\b(secur|cctv)/i, "CCTV, alarms & security"],
  [/\b(shop|retail)/i, "Consumer stores & retail"],
  [/\b(stone|marble)/i, "Granite, tiles & flooring"],
  [/\b(transp|cab)/i, "Taxi, cab hire & logistics"],
  [/\b(travel|tour)/i, "Trips, tour packages & hotels"],
  [/\b(ac|appliance)/i, "Service, gas refill & repair"],
  [/\b(clean|pest)/i, "Deep cleaning & sanitization"],
  [/\b(electric)/i, "Wiring, fittings & MCB repairs"],
  [/\b(plumb)/i, "Pipes, faucets & drainage"],
];

const descFor = (name: string): string =>
  CATEGORY_DESCRIPTIONS.find(([re]) => re.test(name))?.[1] ?? "Local providers";

const DUMMY_CATEGORIES = [
  { id: "electricians", slug: "electricians", name: "Electricians", description: "Wiring, fittings, repairs" },
  { id: "ac-repair", slug: "ac-repair", name: "AC Repair", description: "Service, gas refill" },
  { id: "home-cleaning", slug: "home-cleaning", name: "Home Cleaning", description: "Deep cleaning, sanitization" },
  { id: "beauty-salon", slug: "beauty-salon", name: "Beauty & Salon", description: "Hair, makeup, salon at home" },
  { id: "plumbers", slug: "plumbers", name: "Plumbers", description: "Pipe fixing, installation" },
  { id: "packers-movers", slug: "packers-movers", name: "Packers & Movers", description: "Home and office shifting" },
  { id: "photographers", slug: "photographers", name: "Photographers", description: "Weddings, events, portraits" },
  { id: "automotive", slug: "automotive", name: "Automotive", description: "Car repair, service & wash" },
  { id: "solar-energy", slug: "energy-environment", name: "Energy & Solar", description: "Solar panels, inverters & battery" },
  { id: "it-digital", slug: "it-digital-services", name: "IT & Digital", description: "Web, apps, IT support & AMC" },
  { id: "fitness", slug: "fitness-sports", name: "Fitness & Sports", description: "Trainers, gyms & fitness" },
  { id: "restaurants", slug: "restaurants-food", name: "Restaurants & Food", description: "Dine-in, takeaway & cafes" },
];

export default function NewCategoryGrid() {
  const router = useRouter();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: categories, isLoading } = useCategories();
  const { location } = useAILocation();
  // City pages (/{city}/{category}) only when we know the user's city.
  const city = location.city ? toSlug(location.city) : "";

  const listingRef = useRef<HTMLDivElement>(null);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Items per page: 8 on mobile, 12 on tablet/desktop
  const itemsPerPage = isMobile ? 8 : 12;

  // Use API data if available, else dummy
  const cats = (!isLoading && categories && categories.length > 0) ? categories : (isLoading ? null : DUMMY_CATEGORIES);

  const go = (c: { id: string; name: string; slug?: string | null }) => {
    if (c.slug && city) {
      router.push(`/${city}/${c.slug}`);
    } else {
      router.push(`/cus/services-list?category=${encodeURIComponent(c.id)}&search=${encodeURIComponent(c.name)}`);
    }
  };

  // Split: top 4 featured visual cards
  const imageCards = cats?.slice(0, 4) ?? [];

  // Filter remaining categories for the paginated listing
  const filteredCategories = useMemo(() => {
    if (!cats) return [];
    // If search term is present, search across all categories; otherwise use remaining categories (index 4 onwards)
    const list = searchTerm.trim() ? cats : cats.slice(4);
    if (!searchTerm.trim()) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        Boolean((c as any).slug && (c as any).slug.toLowerCase().includes(term)) ||
        descFor(c.name).toLowerCase().includes(term)
    );
  }, [cats, searchTerm]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));

  // Current page items
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (listingRef.current) {
      listingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Section id="categories" sx={{ pt: { xs: 2.5, sm: 3, md: 4 }, pb: { xs: 3, md: 5 } }}>
      {/* 1. Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          mb: { xs: 2, md: 2.5 },
        }}
      >
        <Box>
          <Typography component="h2" sx={sectionTitleSx}>
            Popular categories
          </Typography>
          {/* Two lines reserved on phones: the city name changes length when GPS or a saved
              city replaces the default, and the section must not jump when it does. */}
          <Typography sx={{ ...sectionSubtitleSx, minHeight: { xs: "3em", sm: 0 } }}>
            Find trusted service providers & specialists {location.city ? `in ${location.city}` : "near you"}
          </Typography>
        </Box>

        <Box
          component="button"
          type="button"
          onClick={() => router.push("/cus/services-list")}
          sx={{
            all: "unset",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            minHeight: 44,
            fontSize: "0.9rem",
            fontWeight: 700,
            color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
            whiteSpace: "nowrap",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View all <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
        </Box>
      </Box>

      {/* 2. Top Featured Visual Cards (4 items) */}
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 1.25, md: 1.75 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 1.25, md: 1.75 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {imageCards.map((c, i) => {
            const img = photoSrc((c as CategoryMedia).image);
            const { icon, color } = c as CategoryMedia;
            const hasColor = Boolean(color && /^#[0-9a-f]{6}$/i.test(color));
            const isFirst = i === 0;
            return (
              <Box
                key={c.id}
                role="link"
                tabIndex={0}
                onClick={() => go(c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go(c);
                  }
                }}
                aria-label={`Browse ${c.name}`}
                sx={{
                  position: "relative",
                  borderRadius: { xs: 3.5, md: 4 },
                  overflow: "hidden",
                  cursor: "pointer",
                  height: { xs: 155, sm: 180, md: 215, lg: 225, xl: 240 },
                  // Under the photo, or the whole card when there is none: the category's own colour.
                  backgroundImage: hasColor
                    ? `linear-gradient(135deg, ${color}, ${color}b3)`
                    : `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_20}, ${COLORS.PURPLE_ALPHA_04})`,
                  bgcolor: dark ? "#2a2535" : "#f0edf5",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: dark
                      ? "0 14px 30px rgba(0,0,0,0.3)"
                      : "0 14px 30px rgba(105,39,218,0.12)",
                  },
                  "&:active": { transform: "scale(0.96)" },
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Category photo: above the fold, so fetched first and never lazily */}
                {img && (
                  <Image
                    src={img}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 900px) 50vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                )}

                {/* Gradient overlay for readability */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                  }}
                />

                {/* "Most booked" badge */}
                {isFirst && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      px: 1.25,
                      py: 0.35,
                      borderRadius: 99,
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    Most booked
                  </Box>
                )}

                {/* Category details */}
                <Box sx={{ position: "absolute", bottom: { xs: 12, md: 16 }, left: { xs: 12, md: 16 }, right: { xs: 12, md: 16 }, pr: { xs: 0, sm: 5 } }}>
                  <CategoryIcon
                    icon={icon}
                    color={color}
                    tile={{ xs: 38, sm: 42 }}
                    size={{ xs: 22, sm: 26 }}
                    radius={2.5}
                    sx={{ bgcolor: "common.white", mb: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
                  />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.2rem" },
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: { xs: "0.7rem", md: "0.76rem" },
                      mt: 0.25,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {descFor(c.name)}
                  </Typography>
                </Box>

                {/* Arrow */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 12, md: 16 },
                    right: { xs: 12, md: 16 },
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(4px)",
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowForwardRoundedIcon sx={{ color: "#fff", fontSize: 16 }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* 3. Paginated Category Listing Section */}
      <Box ref={listingRef} sx={{ scrollMarginTop: "90px" }}>
        {/* Listing Subheader + Search/Filter Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 2,
            pt: 1,
            borderTop: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography component="h2" sx={{ ...sectionTitleSx, color: "text.primary" }}>
              Browse all categories
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 99,
                bgcolor: dark ? "rgba(130,72,247,0.15)" : COLORS.PURPLE_ALPHA_10,
                color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {filteredCategories.length}
            </Box>
          </Box>

          {/* Quick Search in Categories */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: dark ? "rgba(255,255,255,0.12)" : "#e2deea",
              borderRadius: "10px",
              px: 1.25,
              py: 0.5,
              width: { xs: "100%", sm: 260, md: 300 },
              transition: "border-color 160ms ease",
              "&:focus-within": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 18, color: "text.secondary", mr: 0.75 }} />
            <InputBase
              placeholder="Filter categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ fontSize: "0.84rem", flex: 1 }}
              inputProps={{ "aria-label": "Filter categories" }}
            />
            {searchTerm && (
              <IconButton
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                sx={{ p: 0.25 }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Categories Grid (Paginated) */}
        {isLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 1.25,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={68} sx={{ borderRadius: 3 }} />
            ))}
          </Box>
        ) : paginatedCategories.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              px: 2,
              borderRadius: 3,
              bgcolor: dark ? "rgba(255,255,255,0.02)" : "#fbf9fd",
              border: "1px dashed",
              borderColor: dark ? "rgba(255,255,255,0.1)" : "#ded8e8",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              No categories match &ldquo;{searchTerm}&rdquo;
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              sx={{ color: COLORS.PRIMARY_PURPLE, textTransform: "none", fontWeight: 700 }}
            >
              Clear filter
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 1, sm: 1.25 },
            }}
          >
            {paginatedCategories.map((c) => {
              const { icon, color } = c as CategoryMedia;
              return (
                <Box
                  key={c.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => go(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      go(c);
                    }
                  }}
                  aria-label={`Browse ${c.name}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: { xs: 1.1, sm: 1.35 },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    minHeight: { xs: 66, sm: 72 },
                    transition:
                      "border-color 160ms ease, background-color 160ms ease, transform 160ms ease",
                    "&:hover": {
                      borderColor: COLORS.PRIMARY_PURPLE,
                      bgcolor: dark ? "rgba(130,72,247,0.06)" : COLORS.PURPLE_ALPHA_04,
                      transform: "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "scale(0.96)",
                      bgcolor: dark ? "rgba(130,72,247,0.12)" : COLORS.PURPLE_ALPHA_10,
                    },
                    userSelect: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* Category Icon */}
                  <CategoryIcon icon={icon} color={color} tile={{ xs: 38, sm: 42 }} size={{ xs: 22, sm: 26 }} radius={2.5} />

                  {/* Category Text */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.82rem", sm: "0.88rem" },
                        lineHeight: 1.25,
                        color: "text.primary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {c.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.75rem" },
                        color: "text.secondary",
                        lineHeight: 1.2,
                        mt: 0.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {descFor(c.name)}
                    </Typography>
                  </Box>

                  {/* Subtle Arrow */}
                  <ArrowForwardRoundedIcon
                    sx={{
                      color: "text.disabled",
                      fontSize: 16,
                      flexShrink: 0,
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}

        {/* 4. Modern Interactive Pagination Bar */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mt: 2.5,
              pt: 2,
              borderTop: "1px solid",
              borderColor: dark ? "rgba(255,255,255,0.06)" : "#f0ecf6",
            }}
          >
            {/* Range Text */}
            <Typography sx={{ fontSize: "0.82rem", color: "text.secondary", fontWeight: 500 }}>
              Showing{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredCategories.length)}
              </Box>{" "}
              of{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                {filteredCategories.length}
              </Box>{" "}
              categories
            </Typography>

            {/* Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: { xs: 0.5, sm: 0.75 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {/* Previous Button */}
              <Button
                variant="outlined"
                size="small"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                startIcon={<ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: dark ? "rgba(255,255,255,0.15)" : "#e2deea",
                  color: "text.primary",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  py: 0.5,
                  px: { xs: 1, sm: 1.5 },
                  minHeight: { xs: 34, sm: 36 },
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.PRIMARY_PURPLE,
                    bgcolor: dark ? "rgba(130,72,247,0.06)" : COLORS.PURPLE_ALPHA_04,
                  },
                  "&:active": { transform: "scale(0.96)" },
                  "&.Mui-disabled": {
                    borderColor: dark ? "rgba(255,255,255,0.06)" : "#f0ecf6",
                    color: "text.disabled",
                  },
                }}
              >
                Previous
              </Button>

              {/* Numbered Page Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.35, sm: 0.5 } }}>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <Box
                      key={pageNum}
                      component="button"
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      sx={{
                        all: "unset",
                        cursor: "pointer",
                        width: { xs: 32, sm: 34 },
                        height: { xs: 32, sm: 34 },
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: { xs: "0.78rem", sm: "0.82rem" },
                        fontWeight: isActive ? 800 : 600,
                        bgcolor: isActive
                          ? COLORS.PRIMARY_PURPLE
                          : dark
                          ? "rgba(255,255,255,0.04)"
                          : "#f3eff8",
                        color: isActive ? "#ffffff" : "text.secondary",
                        boxShadow: isActive ? "0 2px 8px rgba(105,39,218,0.35)" : "none",
                        transition: "all 120ms ease",
                        userSelect: "none",
                        WebkitTapHighlightColor: "transparent",
                        "&:hover": {
                          bgcolor: isActive ? COLORS.PURPLE_HOVER : dark ? "rgba(255,255,255,0.1)" : "#e8e1f2",
                          color: isActive ? "#ffffff" : COLORS.PRIMARY_PURPLE,
                        },
                        "&:active": { transform: "scale(0.92)" },
                      }}
                    >
                      {pageNum}
                    </Box>
                  );
                })}
              </Box>

              {/* Next Button */}
              <Button
                variant="outlined"
                size="small"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                endIcon={<ChevronRightRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: "8px",
                  borderColor: dark ? "rgba(255,255,255,0.15)" : "#e2deea",
                  color: "text.primary",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  py: 0.5,
                  px: { xs: 1, sm: 1.5 },
                  minHeight: { xs: 34, sm: 36 },
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.PRIMARY_PURPLE,
                    bgcolor: dark ? "rgba(130,72,247,0.06)" : COLORS.PURPLE_ALPHA_04,
                  },
                  "&:active": { transform: "scale(0.96)" },
                  "&.Mui-disabled": {
                    borderColor: dark ? "rgba(255,255,255,0.06)" : "#f0ecf6",
                    color: "text.disabled",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Section>
  );
}
