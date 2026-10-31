"use client";
import React from "react";
import Link from "next/link";
import { Box, Typography, InputBase, Button, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { COLORS } from "@/constants/colors";

export interface SubServiceChip {
  id: string;
  label: string;
}

interface ServicesHeroHeaderProps {
  categoryName: string;
  cityName: string;
  localityName?: string;
  chips: SubServiceChip[];
  selectedChipId: string;
  onSelectChip: (chipId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  locationQuery: string;
  onLocationChange: (loc: string) => void;
  onSubmitSearch: (e: React.FormEvent) => void;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function ServicesHeroHeader({
  categoryName,
  cityName,
  localityName,
  chips,
  selectedChipId,
  onSelectChip,
  searchQuery,
  onSearchChange,
  locationQuery,
  onLocationChange,
  onSubmitSearch,
  breadcrumbs,
}: ServicesHeroHeaderProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const defaultBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/cus/servicesList" },
    { label: categoryName || "All Services" },
  ];

  const crumbs = breadcrumbs || defaultBreadcrumbs;
  const currentCity = localityName ? `${localityName}, ${cityName}` : cityName;

  return (
    <Box sx={{ pt: { xs: 2, md: 3 }, pb: 2 }}>
      {/* Breadcrumbs */}
      <Box
        component="nav"
        aria-label="Breadcrumb"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          fontSize: "0.82rem",
          color: "text.secondary",
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Typography
                  component="span"
                  sx={{
                    color: dark ? "rgba(255,255,255,0.3)" : "#a39fb0",
                    mx: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  /
                </Typography>
              )}
              {crumb.href && !isLast ? (
                <Box
                  component={Link}
                  href={crumb.href}
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": { color: COLORS.PRIMARY_PURPLE },
                  }}
                >
                  {crumb.label}
                </Box>
              ) : (
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    fontWeight: isLast ? 700 : 500,
                    color: isLast ? "text.primary" : "text.secondary",
                  }}
                >
                  {crumb.label}
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Main Heading and Search Bar Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "flex-start", lg: "center" },
          justifyContent: "space-between",
          gap: { xs: 2.5, lg: 3 },
          mb: 2.5,
        }}
      >
        {/* Title + Subtitle */}
        <Box sx={{ maxWidth: { xs: "100%", lg: 620 } }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.1rem", md: "2.35rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "text.primary",
              mb: 1,
            }}
          >
            Find the right {categoryName ? categoryName.toLowerCase().replace(/s$/, "") : "electrician"} in{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.PRIMARY_PURPLE,
              }}
            >
              {currentCity ? `${currentCity}.` : "your city."}
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.88rem", sm: "0.95rem" },
              color: "text.secondary",
              lineHeight: 1.5,
            }}
          >
            Compare local professionals, explore their work, and connect with the right provider.
          </Typography>
        </Box>

        {/* Unified Search + Location Box */}
        <Box
          component="form"
          role="search"
          onSubmit={onSubmitSearch}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", lg: "auto" },
            minWidth: { sm: 460, md: 520 },
            p: { xs: 1, sm: "4px 4px 4px 14px" },
            borderRadius: { xs: "14px", sm: "16px" },
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: dark ? "rgba(130,72,247,0.3)" : "#e4dfeb",
            boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.25)" : "0 4px 20px rgba(105,39,218,0.06)",
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          {/* Query input */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1.2, gap: 1, px: { xs: 0.75, sm: 0 }, py: { xs: 0.5, sm: 0 } }}>
            <SearchRoundedIcon sx={{ color: dark ? "#b388ff" : COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
            <InputBase
              placeholder={`Search in ${categoryName || "services"}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "text.primary",
                width: "100%",
                "& input": { p: 0 },
              }}
            />
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: { xs: "100%", sm: "1px" },
              height: { xs: "1px", sm: 24 },
              bgcolor: dark ? "rgba(255,255,255,0.15)" : "#e2deea",
            }}
          />

          {/* Location input + Search Button */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 0.75, pl: { xs: 0.75, sm: 0.5 } }}>
            <PlaceRoundedIcon sx={{ color: dark ? "#b388ff" : COLORS.PRIMARY_PURPLE, fontSize: 19 }} />
            <InputBase
              placeholder="City or main area"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "text.primary",
                flex: 1,
                "& input": { p: 0 },
              }}
            />
            {/* Search Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: "#fff",
                borderRadius: "10px",
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.75, sm: 0.85 },
                fontSize: "0.86rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: COLORS.PURPLE_HOVER,
                  boxShadow: "0 4px 14px rgba(105,39,218,0.3)",
                },
                "&:active": { transform: "scale(0.97)" },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Horizontal Scrolling Sub-service / Category Chips */}
      {chips.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
            py: 1,
            mb: 1,
          }}
        >
          {chips.map((chip) => {
            const isSelected = selectedChipId === chip.id;
            return (
              <Box
                key={chip.id}
                component="button"
                type="button"
                onClick={() => onSelectChip(chip.id)}
                sx={{
                  flexShrink: 0,
                  height: 38,
                  px: 2,
                  borderRadius: "999px",
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.15s ease",
                  border: isSelected
                    ? `1.5px solid ${COLORS.PRIMARY_PURPLE}`
                    : `1px solid ${dark ? "rgba(255,255,255,0.15)" : "#e2deea"}`,
                  bgcolor: isSelected
                    ? dark
                      ? "#ffffff"
                      : "#1c1924"
                    : "transparent",
                  color: isSelected
                    ? dark
                      ? "#1c1924"
                      : "#ffffff"
                    : "text.primary",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: isSelected ? undefined : COLORS.PRIMARY_PURPLE,
                    bgcolor: isSelected ? undefined : COLORS.PURPLE_ALPHA_04,
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                    opacity: 0.9,
                  },
                }}
              >
                {chip.label}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
