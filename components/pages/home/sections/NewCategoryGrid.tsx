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

// Comprehensive Icon set for all 40 categories
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import LocalLaundryServiceRoundedIcon from "@mui/icons-material/LocalLaundryServiceRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import MovieCreationRoundedIcon from "@mui/icons-material/MovieCreationRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import CarRentalRoundedIcon from "@mui/icons-material/CarRentalRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PlumbingRoundedIcon from "@mui/icons-material/PlumbingRounded";

import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section } from "./shared";

type IconType = typeof AcUnitRoundedIcon;

/** Full regex rule set to match all 40 categories in Kartsquare DB */
const ICON_RULES: Array<[RegExp, IconType]> = [
  [/\b(agri|farm)/i, AgricultureRoundedIcon],
  [/\b(air.*water|water.*treat|water.*purif)/i, WaterDropRoundedIcon],
  [/\b(auto|car|bike|motor|vehicle)/i, DirectionsCarRoundedIcon],
  [/\b(beauty|salon|parlou?r|spa|groom|hair|makeup)/i, ContentCutRoundedIcon],
  [/\b(business\s*serv)/i, BusinessCenterRoundedIcon],
  [/\b(cloth|tailor|apparel|dress)/i, CheckroomRoundedIcon],
  [/\b(construct|archit|build)/i, ArchitectureRoundedIcon],
  [/\b(courier|logist)/i, LocalShippingRoundedIcon],
  [/\b(educat|train|coach|tutor|school)/i, SchoolRoundedIcon],
  [/\b(energy|environ|solar)/i, SolarPowerRoundedIcon],
  [/\b(event|entertain|party|celebrat)/i, CelebrationRoundedIcon],
  [/\b(financ|loan|tax|account|ca\b)/i, AccountBalanceRoundedIcon],
  [/\b(fit|sport|gym|workout)/i, FitnessCenterRoundedIcon],
  [/\b(gov|public)/i, AccountBalanceRoundedIcon],
  [/\b(groc|daily|mart|store)/i, LocalGroceryStoreRoundedIcon],
  [/\b(health|wellness|doctor|clinic|medic)/i, LocalHospitalRoundedIcon],
  [/\b(home\s*serv|repair)/i, HomeRepairServiceRoundedIcon],
  [/\b(it\b|digital|software|web|tech)/i, ComputerRoundedIcon],
  [/\b(jewel|gold|silver|access)/i, DiamondRoundedIcon],
  [/\b(laundry|dry\s*clean)/i, LocalLaundryServiceRoundedIcon],
  [/\b(legal|law|lawyer|advocate)/i, GavelRoundedIcon],
  [/\b(manufact|indust)/i, PrecisionManufacturingRoundedIcon],
  [/\b(media|creative)/i, MovieCreationRoundedIcon],
  [/\b(mobile|electronic|phone)/i, SmartphoneRoundedIcon],
  [/\b(music)/i, MusicNoteRoundedIcon],
  [/\b(ngo|social)/i, VolunteerActivismRoundedIcon],
  [/\b(optic|eyewear|glass)/i, VisibilityRoundedIcon],
  [/\b(pack|mov|shift)/i, LocalShippingRoundedIcon],
  [/\b(pet|animal|vet)/i, PetsRoundedIcon],
  [/\b(photo|video|studio|shoot)/i, CameraAltRoundedIcon],
  [/\b(print|station)/i, PrintRoundedIcon],
  [/\b(real\s*estate|property)/i, ApartmentRoundedIcon],
  [/\b(relig|spirit|puja|pandit|jyotish|vastu)/i, SelfImprovementRoundedIcon],
  [/\b(rental)/i, CarRentalRoundedIcon],
  [/\b(rest|food|cafe|dining)/i, RestaurantRoundedIcon],
  [/\b(secur|cctv|guard)/i, SecurityRoundedIcon],
  [/\b(shop|retail)/i, ShoppingBagRoundedIcon],
  [/\b(stone|marble|tile)/i, LayersRoundedIcon],
  [/\b(transp|cab|taxi)/i, LocalTaxiRoundedIcon],
  [/\b(travel|tour|hotel|hospitality)/i, FlightTakeoffRoundedIcon],
  [/\b(ac|appliance|cool)/i, AcUnitRoundedIcon],
  [/\b(clean|pest|maid)/i, CleaningServicesRoundedIcon],
  [/\b(electric)/i, BoltRoundedIcon],
  [/\b(plumb)/i, PlumbingRoundedIcon],
];

const iconFor = (name: string): IconType =>
  ICON_RULES.find(([re]) => re.test(name))?.[1] ?? HomeRepairServiceRoundedIcon;

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

/** Short descriptions for all categories. */
const CATEGORY_DESCRIPTIONS: Array<[RegExp, string]> = [
  [/\b(agri|farm)/i, "Farming tools & supplies"],
  [/\b(air.*water|water.*treat)/i, "Purifiers & filter service"],
  [/\b(auto|car|bike)/i, "Car repair, service & wash"],
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
  CATEGORY_DESCRIPTIONS.find(([re]) => re.test(name))?.[1] ?? "Verified local providers";

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
  const city = (location.city || "Jaipur").toLowerCase();

  const listingRef = useRef<HTMLDivElement>(null);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Items per page: 8 on mobile, 12 on tablet/desktop
  const itemsPerPage = isMobile ? 8 : 12;

  // Use API data if available, else dummy
  const cats = (!isLoading && categories && categories.length > 0) ? categories : (isLoading ? null : DUMMY_CATEGORIES);

  const go = (c: { id: string; name: string; slug?: string }) => {
    if (c.slug && city) {
      router.push(`/${city}/${c.slug}`);
    } else {
      router.push(`/cus/servicesList?category=${encodeURIComponent(c.id)}&search=${encodeURIComponent(c.name)}`);
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
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.35rem", sm: "1.55rem", md: "1.8rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Popular categories
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.82rem", md: "0.92rem" },
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Find trusted service providers & specialists in {location.city || "Jaipur"}
          </Typography>
        </Box>

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
            fontSize: "0.9rem",
            fontWeight: 700,
            color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
            whiteSpace: "nowrap",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Explore all <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
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
            const img = getImageForCategory(c.name);
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
                  backgroundImage: img
                    ? `url(${img})`
                    : `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_20}, ${COLORS.PURPLE_ALPHA_04})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    Most booked
                  </Box>
                )}

                {/* Category details */}
                <Box sx={{ position: "absolute", bottom: { xs: 12, md: 16 }, left: { xs: 12, md: 16 }, right: { xs: 12, md: 16 } }}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.2rem" },
                      lineHeight: 1.2,
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
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 800,
                color: "text.primary",
              }}
            >
              Browse all categories
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 99,
                bgcolor: dark ? "rgba(130,72,247,0.15)" : COLORS.PURPLE_ALPHA_10,
                color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                fontSize: "0.72rem",
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
              const Icon = iconFor(c.name);
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
                  <Box
                    sx={{
                      width: { xs: 38, sm: 42 },
                      height: { xs: 38, sm: 42 },
                      borderRadius: 2.5,
                      bgcolor: dark ? "rgba(130,72,247,0.12)" : COLORS.PURPLE_ALPHA_10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                        fontSize: { xs: 20, sm: 22 },
                      }}
                    />
                  </Box>

                  {/* Category Text */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.82rem", sm: "0.88rem" },
                        lineHeight: 1.25,
                        color: "text.primary",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {c.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.68rem", sm: "0.72rem" },
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
