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
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const handleLanguageChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      changeLanguage(event.target.value as any);
    },
    [changeLanguage]
  );

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        background: {
          xs:
            theme.palette.mode === "light"
              ? COLORS.PURPLECYAN
              : COLORS.DARK_GRADIENT,
          lg:
            theme.palette.mode === "light"
              ? COLORS.BACKGROUND.PRIMARY_LIGHT
              : COLORS.BACKGROUND.PRIMARY_DARK,
        },
      }}
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
          background: {
            xs: "transparent",
            lg:
              theme.palette.mode === "light"
                ? COLORS.PURPLECYAN
                : COLORS.DARK_GRADIENT,
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: { xs: "auto", lg: "100vh" },
          p: { xs: 2, lg: 4 },
          // py: { xs: 4, lg: 4 },
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
          {/* Logo with Brand Name — sized to match AuthHeader (mobile) / AuthWrapper (desktop) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, lg: 3 },
              mb: { xs: 1, lg: 4 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 28, lg: 150, xl: 200 },
                height: { xs: 28, lg: 150, xl: 200 },
              }}
            >
              <Image
                src="/logo.svg"
                alt="kartsquare Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
            <Typography
              sx={{
                fontWeight: { xs: 800, lg: "bold" },
                color:
                  theme.palette.mode === "light"
                    ? COLORS.TEXT.PRIMARY_LIGHT
                    : COLORS.TEXT.PRIMARY_DARK,
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.1rem", lg: "3rem", xl: "4rem" },
              }}
            >
              kartsquare
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
                  gap: 2,
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
                    lineHeight: 1.3,
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
              display: { xs: "none", lg: "flex" },
              gap: 1.5,
              mt: { xs: 3, lg: 4 },
              // mb: { xs: 2, lg: 0 },
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
            background: {
              xs: "transparent",
              lg:
                theme.palette.mode === "light"
                  ? COLORS.BACKGROUND.PRIMARY_LIGHT
                  : COLORS.BACKGROUND.PRIMARY_DARK,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", lg: "stretch" },
            margin: "auto",
            justifyContent: "center",
            minHeight: { xs: "auto", lg: "100vh" },
            px: { xs: 2, sm: 3, lg: 10 },
            py: { xs: 0, sm: 4, lg: 2 },
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

          {/* Card wrapper — matches sign-up / forgot-password design on mobile/tablet */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: 480, lg: "none" },
              bgcolor: {
                xs:
                  theme.palette.mode === "light"
                    ? COLORS.BACKGROUND.PRIMARY_LIGHT
                    : COLORS.BACKGROUND.SECONDARY_DARK,
                lg: "transparent",
              },
              borderRadius: { xs: "24px", lg: 0 },
              boxShadow: {
                xs:
                  theme.palette.mode === "light"
                    ? "0 20px 60px rgba(94, 24, 233, 0.12)"
                    : "0 20px 60px rgba(0, 0, 0, 0.4)",
                lg: "none",
              },
              overflow: "hidden",
              position: "relative",
              px: { xs: 3, sm: 4, lg: 0 },
              py: { xs: 3, sm: 4, lg: 0 },
            }}
          >
            {/* Decorative blob — mobile card only */}
            <Box
              sx={{
                display: { xs: "block", lg: "none" },
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: COLORS.PURPLECYAN,
                opacity: theme.palette.mode === "light" ? 0.5 : 0.15,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative" }}>{children}</Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthCarouselWrapper;
