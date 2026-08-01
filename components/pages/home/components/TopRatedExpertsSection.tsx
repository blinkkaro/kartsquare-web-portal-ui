"use client";
import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Star, ChevronLeft, ChevronRight, Verified } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { useDispatch } from "react-redux";
import "swiper/css";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import type { TopProvider } from "@/services/topSuppliers/topSupplires.interfaces";
import SectionCard from "@/components/common/SectionCard";

// Fixed, not percentage-relative — Swiper doesn't reliably stretch slides to equal
// height across breakpoints, so an explicit height keeps every card the same size
// regardless of how long each expert's name/location text happens to be.
const CARD_HEIGHT = { xs: 320, sm: 360, md: 380 };

const TopRatedExpertsSection = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef<SwiperClass | null>(null);

  const { provider, isLoading } = useTopSuggestions("20");

  const experts = (provider || []).filter(
    (item, index, self) => index === self.findIndex((p) => p.id === item.id),
  );

  const handleBookNow = (item: TopProvider) => {
    dispatch(openDrawer({ userId: item.id }));
  };

  if (isLoading || experts.length === 0) return null;

  // This section lives in a narrow (~60%) column next to the map, so even the
  // widest breakpoint rarely shows a full screenful of cards — arrows add value
  // as soon as there's more than one card to page through.
  const showArrows = experts.length > 1;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Top Rated Experts</Typography>
        {showArrows && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                bgcolor: (theme) => (theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE),
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                bgcolor: (theme) => (theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE),
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1.15}
        breakpoints={{
          // Below md the section is full-width (stacked under the map); at md+ it's
          // squeezed into a 60% column, so 3-per-view only kicks in once that column
          // is actually wide enough (~1280px viewport), showing 2 in between.
          600: { slidesPerView: 2.2 },
          900: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
      >
        {experts.map((expert) => (
          <SwiperSlide key={expert.id}>
            <SectionCard
              size="lg"
              sx={{
                height: CARD_HEIGHT,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                p: 0,
              }}
            >
              <Box sx={{ position: "relative", width: "100%", flex: "1 1 auto", minHeight: 0 }}>
                <Box
                  component="img"
                  src={expert.profile_pic}
                  alt={expert.business_name || expert.first_name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: 5,
                    px: 1,
                    py: 0.3,
                  }}
                >
                  <Star sx={{ fontSize: 14, color: "#FFB400" }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#111" }}>
                    {expert.rating?.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, flex: "0 0 auto" }}>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {expert.business_name || `${expert.first_name} ${expert.last_name}`}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {expert.city && expert.country ? `${expert.city}, ${expert.country}` : "Verified Professional"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                  <Verified sx={{ fontSize: 14, color: COLORS.PRIMARY_BLUE }} />
                  <Typography sx={{ fontSize: "0.72rem", color: COLORS.PRIMARY_BLUE, fontWeight: 600 }}>
                    {expert.total_bookings || "0"}+ Bookings Completed
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={() => handleBookNow(expert)}
                  sx={{
                    width: "100%",
                    border: "none",
                    borderRadius: "24px",
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.WHITE,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    py: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                  }}
                >
                  Book Now
                </Box>
              </Box>
            </SectionCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default TopRatedExpertsSection;
