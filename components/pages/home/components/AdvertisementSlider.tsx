import React from "react";
import { Box, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const ads = [
  { id: 1, image: "advertisements/ad1.jpg" },
  { id: 2, image: "advertisements/ad2.jpg" },
  { id: 3, image: "advertisements/ad3.jpg" },
];

const AdvertisementSlider = () => {
  const theme = useTheme();

  return (
    <Box sx={{ my: 3 }}>
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
          <SwiperSlide key={ad.id}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 160, sm: 220, md: 260 },
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.6)"
                    : "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Box
                component="img"
                src={ad.image}
                alt="advertisement"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default AdvertisementSlider;
