"use client";
import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SpaIcon from "@mui/icons-material/Spa";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import SchoolIcon from "@mui/icons-material/School";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useActiveAdvertisements } from "@/hooks/useAdvertisements";
import { advertiseService } from "@/services/advertise/advertiseServies";
import HomeSearchBar from "./HomeSearchBar";
import PromoCarousel from "./PromoCarousel";
import SectionCard from "@/components/common/SectionCard";

const CATEGORY_ICON_MATCHERS: Array<[RegExp, React.ElementType]> = [
  [/beaut|makeup|salon|spa/i, FaceRetouchingNaturalIcon],
  [/tech|electronic|gadget|repair.*device|it\b/i, DevicesOtherIcon],
  [/wellness|health|yoga|fitness/i, SpaIcon],
  [/clean/i, CleaningServicesIcon],
  [/tutor|educat|class/i, SchoolIcon],
];

const CATEGORY_COLORS = [
  { bg: "#e7ecfd", fg: COLORS.PRIMARY_PURPLE },
  { bg: "#fde7ea", fg: "#e0446b" },
  { bg: "#e2f8ee", fg: "#1fa971" },
  { bg: "#e6f2ff", fg: COLORS.PRIMARY_BLUE },
];

const renderCategoryIcon = (name: string) => {
  const match = CATEGORY_ICON_MATCHERS.find(([re]) => re.test(name));
  const Icon = match ? match[1] : HomeRepairServiceIcon;
  return <Icon fontSize="small" />;
};

// No "seasonal offer" API exists yet, so this is a static, month-based fallback shown
// whenever there's no active ad to fill the promo slot — keeps the hero's right column
// from going empty, themed to services relevant to the current season in India.
const SEASONAL_PROMOS = [
  {
    months: [11, 0, 1], // Dec-Feb: winter
    badge: "Winter Special",
    title: "Geyser & Heater Servicing",
    description:
      "Beat the cold with verified technicians for water heaters, room heaters, and insulation fixes.",
    searchTerm: "geyser heater servicing",
    image:
      "https://images.unsplash.com/photo-1608181831718-c9ffd8074648?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [2, 3, 4], // Mar-May: summer
    badge: "Summer Special",
    title: "AC & Cooling Services",
    description:
      "Get your AC serviced and coolers repaired by verified experts before the heat peaks.",
    searchTerm: "ac cooling servicing",
    image:
      "https://images.unsplash.com/photo-1631545806609-83f2f4c2c0af?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [5, 6, 7, 8], // Jun-Sep: monsoon
    badge: "Monsoon Special",
    title: "Waterproofing & Pest Control",
    description:
      "Protect your home this monsoon with waterproofing, leak repairs, and pest control experts.",
    searchTerm: "waterproofing pest control",
    image:
      "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [9, 10], // Oct-Nov: festive
    badge: "Festive Special",
    title: "Home Deep Cleaning & Decor",
    description:
      "Get your home festival-ready with deep cleaning, painting, and decor services near you.",
    searchTerm: "home deep cleaning decor",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
  },
];

// Same idea, product-flavored — also no backing API, static seasonal placeholder.
const SEASONAL_PRODUCT_PROMOS = [
  {
    months: [11, 0, 1], // Dec-Feb: winter
    badge: "Winter Special",
    title: "Winter Wear & Room Heaters",
    description: "Shop blankets, heaters, and winter essentials for your home.",
    searchTerm: "winter wear room heater",
    image:
      "https://images.unsplash.com/photo-1608889175638-9e0d3e2c7c9f?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [2, 3, 4], // Mar-May: summer
    badge: "Summer Special",
    title: "Coolers & Fans",
    description: "Beat the heat with air coolers, fans, and cooling essentials.",
    searchTerm: "coolers fans summer",
    image:
      "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [5, 6, 7, 8], // Jun-Sep: monsoon
    badge: "Monsoon Special",
    title: "Raincoats & Waterproof Covers",
    description: "Stock up on raincoats, umbrellas, and waterproof covers for the season.",
    searchTerm: "raincoat waterproof cover",
    image:
      "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&q=80&w=800",
  },
  {
    months: [9, 10], // Oct-Nov: festive
    badge: "Festive Special",
    title: "Festive Decor & Gifts",
    description: "Lights, decor, and gifting essentials to get your home festival-ready.",
    searchTerm: "festive decor gifts",
    image:
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=800",
  },
];

// Current season's promo leads the carousel; the rest follow so all four are reachable.
const getOrderedSeasonal = <T extends { months: number[] }>(items: T[]): T[] => {
  const month = new Date().getMonth();
  const currentIndex = items.findIndex((item) => item.months.includes(month));
  if (currentIndex <= 0) return items;
  return [items[currentIndex], ...items.filter((_, index) => index !== currentIndex)];
};

const CategoryTile = ({
  category,
  index,
  onClick,
}: {
  category: { id: string; name: string };
  index: number;
  onClick: () => void;
}) => {
  const palette = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  return (
    <SectionCard
      size="md"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        py: 2,
        px: 1.5,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: palette.bg,
          color: palette.fg,
        }}
      >
        {renderCategoryIcon(category.name)}
      </Box>
      <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600, textAlign: "center" }}>
        {category.name}
      </Typography>
    </SectionCard>
  );
};

const HeroSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<{ focus: () => void }>(null);
  const categorySwiperRef = useRef<SwiperClass | null>(null);

  const { data: categories } = useCategories();
  const { data: ad } = useActiveAdvertisements(1);
  const featuredAd = ad?.ads?.[0];

  const handleAdClick = async () => {
    if (!featuredAd) return;
    try {
      await advertiseService.AdvertiseClicked(featuredAd.advertise_id);
    } catch (error) {
      console.error("Error tracking ad click:", error);
    } finally {
      router.push(`/services/${featuredAd.service_id}`);
    }
  };

  const promoSlides = [
    ...(featuredAd
      ? [
          {
            key: "ad",
            badge: "Limited Time Offer",
            title: featuredAd.title || "Quick Book Offer",
            description: featuredAd.description,
            image: featuredAd.image_url,
            ctaLabel: "Claim Discount",
            onClick: handleAdClick,
          },
        ]
      : []),
    ...getOrderedSeasonal(SEASONAL_PROMOS).map((promo) => ({
      key: promo.badge,
      badge: promo.badge,
      title: promo.title,
      description: promo.description,
      image: promo.image,
      ctaLabel: "Explore Services",
      onClick: () => router.push(`/store?q=${encodeURIComponent(promo.searchTerm)}`),
    })),
  ];

  const productPromoSlides = getOrderedSeasonal(SEASONAL_PRODUCT_PROMOS).map((promo) => ({
    key: promo.badge,
    badge: promo.badge,
    title: promo.title,
    description: promo.description,
    image: promo.image,
    ctaLabel: "Shop Now",
    onClick: () => router.push(`/store?q=${encodeURIComponent(promo.searchTerm)}`),
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 4 },
        alignItems: { xs: "stretch", md: "flex-start" },
      }}
    >
      {/* Left: Headline, search, categories */}
      <Box sx={{ flex: { md: "1 1 60%" }, minWidth: 0 }}>
        <Typography variant="h1" sx={{ mb: 1.5 }}>
          Hire Experts,{" "}
          <Box component="span" sx={{ color: COLORS.PRIMARY_BLUE }}>
            Buy Products
          </Box>
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 3 }}>
          Connect with top-rated professionals in your area for home
          maintenance, beauty, and tech support. Everything you need,
          delivered at your doorstep.
        </Typography>

        <HomeSearchBar ref={searchRef} value={searchQuery} onChange={setSearchQuery} />

        {/* Category quick links */}
        {categories && categories.length > 0 && (
          <>
            {isMobile ? (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => categorySwiperRef.current?.slidePrev()}
                    sx={{
                      bgcolor: (theme) => theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => categorySwiperRef.current?.slideNext()}
                    sx={{
                      bgcolor: (theme) => theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Swiper
                  onSwiper={(swiper) => {
                    categorySwiperRef.current = swiper;
                  }}
                  slidesPerView={3.2}
                  spaceBetween={12}
                  loop
                >
                  {categories.slice(0, 20).map((category, index) => (
                    <SwiperSlide key={category.id}>
                      <CategoryTile
                        category={category}
                        index={index}
                        onClick={() => router.push(`/store?category=${category.id}`)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
                {categories.slice(0, 20).map((category, index) => (
                  <Box
                    key={category.id}
                    sx={{ flex: { sm: "1 1 calc(25% - 12px)", md: "1 1 calc(20% - 12px)" } }}
                  >
                    <CategoryTile
                      category={category}
                      index={index}
                      onClick={() => router.push(`/store?category=${category.id}`)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Right: Promo carousels — services (real ad first, then seasonal fallbacks)
          stacked above a second seasonal carousel for products */}
      <Box
        sx={{
          flex: { md: "1 1 40%" },
          minWidth: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Top Picks Services
          </Typography>
          <PromoCarousel slides={promoSlides} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Top Pick Products
          </Typography>
          <PromoCarousel slides={productPromoSlides} />
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
