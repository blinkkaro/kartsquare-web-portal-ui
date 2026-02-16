import React, { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { COLORS } from "../constants/colors";

interface ServiceImageCarouselProps {
  images: string[];
  serviceName: string;
}

const ServiceImageCarousel: React.FC<ServiceImageCarouselProps> = ({
  images,
  serviceName,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box>
      {/* Main Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "300px", md: "400px" },
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: isDark
            ? COLORS.BACKGROUND.SECONDARY_DARK
            : COLORS.BACKGROUND.SECONDARY_LIGHT,
        }}
      >
        <Box
          component="img"
          src={images[currentIndex]}
          alt={serviceName}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "white" },
                width: 40,
                height: 40,
              }}
            >
              <ArrowBackIos sx={{ fontSize: 18, ml: 0.5 }} />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": { bgcolor: "white" },
                width: 40,
                height: 40,
              }}
            >
              <ArrowForwardIos sx={{ fontSize: 18 }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: isDark
                ? COLORS.BORDER.DEFAULT_DARK
                : COLORS.BORDER.DEFAULT_LIGHT,
              borderRadius: "3px",
            },
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: `2px solid ${
                  currentIndex === index
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                flexShrink: 0,
                transition: "border-color 0.2s",
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`${serviceName} ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServiceImageCarousel;
