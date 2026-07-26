"use client";
import React, { useRef } from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { COLORS } from "@/constants/colors";
import SectionCard from "@/components/common/SectionCard";

export interface PromoSlide {
  key: string;
  badge: string;
  title: string;
  description?: string;
  image: string;
  ctaLabel: string;
  onClick: () => void;
}

interface PromoCarouselProps {
  slides: PromoSlide[];
  height?: { xs: number; md: number };
}

const DEFAULT_HEIGHT = { xs: 220, md: 320 };

const PromoCarousel: React.FC<PromoCarouselProps> = ({ slides, height = DEFAULT_HEIGHT }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  if (slides.length === 0) return null;

  return (
    <Box sx={{ position: "relative", minWidth: 0 }}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        loop={slides.length > 1}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <SectionCard
              size="lg"
              onClick={slide.onClick}
              sx={{
                position: "relative",
                height,
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-end",
                p: 3,
              }}
            >
              <Box
                component="img"
                src={slide.image}
                alt={slide.title}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(20,20,20,0.15) 0%, rgba(10,10,10,0.55) 55%, rgba(0,0,0,0.85) 100%)",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
                <Chip
                  label={slide.badge}
                  size="small"
                  sx={{
                    bgcolor: "rgba(240,120,140,0.25)",
                    color: "#ffb4c2",
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                />
                <Typography variant="h6" sx={{ color: COLORS.WHITE, mb: 1 }}>
                  {slide.title}
                </Typography>
                {slide.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {slide.description}
                  </Typography>
                )}
                <Box
                  component="button"
                  onClick={slide.onClick}
                  sx={{
                    bgcolor: COLORS.WHITE,
                    color: COLORS.DARK,
                    border: "none",
                    borderRadius: "24px",
                    px: 2.5,
                    py: 1,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                >
                  {slide.ctaLabel}
                </Box>
              </Box>
            </SectionCard>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <>
          <IconButton
            size="small"
            onClick={() => swiperRef.current?.slidePrev()}
            sx={{
              position: "absolute",
              top: 12,
              left: 8,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: COLORS.WHITE },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => swiperRef.current?.slideNext()}
            sx={{
              position: "absolute",
              top: 12,
              right: 8,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: COLORS.WHITE },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default PromoCarousel;
