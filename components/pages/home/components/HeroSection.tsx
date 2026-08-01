"use client";
import React, { useRef, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { useActiveAdvertisements } from "@/hooks/useAdvertisements";
import { advertiseService } from "@/services/advertise/advertiseServies";
import HomeSearchBar from "./HomeSearchBar";
import PromoCarousel from "./PromoCarousel";
import { CategoryTile, MoreCategoriesTile, HomeCategory } from "./categories/CategoryTile";
import CategoryDrawer from "./categories/CategoryDrawer";

const SERVICES_LIST_PATH = "/cus/servicesList";

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

const HeroSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<{ focus: () => void }>(null);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

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

  // Desktop grid uses 5 columns at sm, 6 columns from md up (matches the flex-basis
  // percentages below) — cap at 4 rows (measured to end level with the promo carousel
  // stack on the right) and reserve the last slot for a "More" tile.
  const desktopColumns = isMdUp ? 6 : 5;
  const desktopMaxDisplay = desktopColumns * 4;
  const showDesktopMore = !!categories && categories.length > desktopMaxDisplay;
  const desktopCategories = categories
    ? categories.slice(0, showDesktopMore ? desktopMaxDisplay - 1 : desktopMaxDisplay)
    : [];

  const productPromoSlides = getOrderedSeasonal(SEASONAL_PRODUCT_PROMOS).map((promo) => ({
    key: promo.badge,
    badge: promo.badge,
    title: promo.title,
    description: promo.description,
    image: promo.image,
    ctaLabel: "Shop Now",
    onClick: () => router.push(`/store?q=${encodeURIComponent(promo.searchTerm)}`),
  }));

  const goToCategory = (category: HomeCategory) => {
    router.push(`${SERVICES_LIST_PATH}?category=${category.id}`);
  };

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
              <Box
                sx={{
                  mt: 3,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 1.25,
                }}
              >
                {categories.slice(0, 7).map((category, index) => (
                  <CategoryTile
                    key={category.id}
                    category={category}
                    index={index}
                    onClick={() => goToCategory(category)}
                  />
                ))}
                {categories.length > 7 && (
                  <MoreCategoriesTile onClick={() => setCategoryDrawerOpen(true)} />
                )}
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
                {desktopCategories.map((category, index) => (
                  <Box
                    key={category.id}
                    sx={{ flex: { sm: "1 1 calc((100% - 32px) / 5)", md: "1 1 calc((100% - 40px) / 6)" } }}
                  >
                    <CategoryTile
                      category={category}
                      index={index}
                      onClick={() => goToCategory(category)}
                    />
                  </Box>
                ))}
                {showDesktopMore && (
                  <Box sx={{ flex: { sm: "1 1 calc((100% - 32px) / 5)", md: "1 1 calc((100% - 40px) / 6)" } }}>
                    <MoreCategoriesTile onClick={() => setCategoryDrawerOpen(true)} />
                  </Box>
                )}
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
          mt: { xs: 0, md: 2 },
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

      {categories && (categories.length > 7 || showDesktopMore) && (
        <CategoryDrawer
          open={categoryDrawerOpen}
          onClose={() => setCategoryDrawerOpen(false)}
          categories={categories}
          isMobile={isMobile}
          onCategoryClick={goToCategory}
        />
      )}
    </Box>
  );
};

export default HeroSection;
