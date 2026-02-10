import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";

import "swiper/css";
import "swiper/css/pagination";
import { useActiveAdvertisements } from "@/hooks/useAdvertisements";
import { advertiseService } from "@/services/advertise/advertiseServies";
import { COLORS } from "@/constants/colors";

const AdvertisementSlider = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: ads, isLoading } = useActiveAdvertisements();

  const handleAdClick = async (advertiseId: string, serviceId: string) => {
    try {
      await advertiseService.AdvertiseClicked(advertiseId);
      router.push(`/services/${serviceId}`);
    } catch (error) {
      console.error("Error tracking ad click:", error);
      router.push(`/services/${serviceId}`);
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <Box>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad.advertise_id}>
            <Box
              onClick={() => handleAdClick(ad.advertise_id, ad.service_id)}
              sx={{
                width: "100%",
                height: { xs: 160, sm: 220, md: 220 },
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.6)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {/* Blurred background image */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${ad.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px)",
                  transform: "scale(1.1)",
                  opacity: 0.6,
                }}
              />
              {/* Dark overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
              />
              {/* Main image */}
              <Box
                component="img"
                src={ad.image_url}
                alt={ad.title || "advertisement"}
                sx={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  maxHeight: "100%",
                  position: "relative",
                  zIndex: 1,
                }}
              />
              {/* Title and Description overlay */}
              {(ad.title || ad.description) && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                    padding: { xs: 2, sm: 3 },
                    zIndex: 2,
                  }}
                >
                  {ad.title && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: COLORS.TEXT.PRIMARY_DARK,
                        fontWeight: 600,
                        mb: ad.description ? 0.5 : 0,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}
                    >
                      {ad.title}
                    </Typography>
                  )}
                  {ad.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.TEXT.PRIMARY_DARK,
                        opacity: 0.9,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {ad.description}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default AdvertisementSlider;
