"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Grid,
  Box,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import BackButton from "@/components/common/BackButton";

export interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
}

interface AuthCarouselWrapperProps {
  children: React.ReactNode;
  carouselItems: CarouselItem[];
  showBackButton?: boolean;
  backButtonAction?: () => void;
}

function AuthCarouselWrapper({
  children,
  carouselItems,
  showBackButton = false,
  backButtonAction,
}: AuthCarouselWrapperProps) {
  const { t, locale, changeLanguage } = useTranslate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleLanguageChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      changeLanguage(event.target.value as any);
    },
    [changeLanguage],
  );

  return (
    <Grid
      container
      sx={{ minHeight: "100vh", width: "100%", position: "relative" }}
    >
      {/* Left Side (Carousel) */}
      {showBackButton && (
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            justifyContent: "flex-start",
            mb: 4,
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 10,
          }}
        >
          <BackButton onClick={backButtonAction} />
        </Box>
      )}
      <Grid
        size={{ xs: 12, lg: 6 }}
        sx={{
          background:
            theme.palette.mode === "light"
              ? COLORS.PURPLECYAN
              : COLORS.DARK_GRADIENT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "auto", lg: "100vh" },
          p: { xs: 3, lg: 4 },
          py: { xs: 4, lg: 4 },
          position: "relative",
          transition: "background 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {/* Logo with Brand Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, lg: 2 },
              mb: { xs: 3, lg: 4 },
            }}
          >
            <Image
              src="/logo.svg"
              alt="KartSquare Logo"
              width={isLargeScreen ? 80 : 50}
              height={isLargeScreen ? 80 : 50}
              priority
            />
            <Typography
              sx={{
                fontWeight: "bold",
                color:
                  theme.palette.mode === "light"
                    ? COLORS.TEXT.PRIMARY_LIGHT
                    : COLORS.TEXT.PRIMARY_DARK,
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.5rem", md: "2rem", xl: "2.5rem" },
              }}
            >
              KartSquare
            </Typography>
          </Box>

          {/* Carousel Content */}
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              position: "relative",
              minHeight: { xs: "300px", lg: "400px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {carouselItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  opacity: activeIndex === index ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {/* Carousel Image */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "85px", lg: "143px" },
                    height: { xs: "174px", lg: "298px" }, 
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "5px solid #333",
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority={index === 0}
                  />
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "light"
                        ? COLORS.TEXT.PRIMARY_LIGHT
                        : COLORS.TEXT.PRIMARY_DARK,
                    fontSize: { xs: "1.25rem", md: "1.5rem", xl: "1.75rem" },
                    letterSpacing: "-0.01em",
                    px: { xs: 2, lg: 0 },
                  }}
                >
                  {item.title}
                </Typography>

                {/* Subtitle */}
                <Typography
                  sx={{
                    color:
                      theme.palette.mode === "light"
                        ? COLORS.TEXT.SECONDARY_LIGHT
                        : COLORS.TEXT.SECONDARY_DARK,
                    fontSize: { xs: "0.875rem", xl: "1rem" },
                    maxWidth: { xs: "300px", lg: "400px" },
                    lineHeight: 1.6,
                    px: { xs: 2, lg: 0 },
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Carousel Indicators */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mt: { xs: 3, lg: 4 },
              mb: { xs: 2, lg: 0 },
            }}
          >
            {carouselItems.map((_, index) => (
              <Box
                key={index}
                onClick={() => setActiveIndex(index)}
                sx={{
                  width: activeIndex === index ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor:
                    activeIndex === index
                      ? theme.palette.mode === "light"
                        ? COLORS.PRIMARY_PURPLE
                        : COLORS.WHITE
                      : theme.palette.mode === "light"
                        ? COLORS.PURPLE_ALPHA_20
                        : COLORS.PURPLE_ALPHA_30,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? COLORS.PRIMARY_PURPLE
                        : COLORS.WHITE,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Right Side (Form) */}
      <Grid size={{ xs: 12, lg: 6 }}>
        {/* <Box sx={{ position: "absolute", top: 24, right: 24 }}>
          <Select
            value={locale}
            onChange={handleLanguageChange}
            size="small"
            variant="standard"
            disableUnderline
            sx={{ fontWeight: "bold" }}
          >
            <MenuItem value="en">🇺🇸 EN</MenuItem>
            <MenuItem value="es">🇪🇸 ES</MenuItem>
            <MenuItem value="hi">🇮🇳 HI</MenuItem>
          </Select>
        </Box> */}
        <Box
          sx={{
            background: "none",
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            justifyContent: "center",
            minHeight: { xs: "auto", lg: "100vh" },
            px: { xs: 4, lg: 10 },
            py: { xs: 4, lg: 2 },
            transition: "background 0.3s ease-in-out",
          }}
        >
          {showBackButton && (
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                justifyContent: "flex-start",
                mb: 4,
              }}
            >
              <BackButton onClick={backButtonAction} />
            </Box>
          )}
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthCarouselWrapper;
