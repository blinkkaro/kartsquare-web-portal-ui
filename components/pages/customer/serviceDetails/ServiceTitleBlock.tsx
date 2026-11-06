"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { COLORS } from "../../../../constants/colors";

interface ServiceTitleBlockProps {
  name: string;
  categoryName: string[];
  city?: string;
  area?: string;
  isNew?: boolean;
  avgRating?: number;
  reviewCount?: number;
}

const ServiceTitleBlock = ({
  name,
  categoryName,
  city,
  area,
  isNew,
  avgRating,
  reviewCount,
}: ServiceTitleBlockProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const ratingNumber = Number(avgRating);
  const hasReviews = !!reviewCount && reviewCount > 0;
  // avg_service_rating defaults to 4.00 in the DB, so a rating only means
  // something once there is at least one review behind it.
  const hasRating = hasReviews && Number.isFinite(ratingNumber) && ratingNumber > 0;
  const showArea = !!area && !!city && area.toLowerCase() !== city.toLowerCase();

  return (
    <Box>
      {categoryName.length > 0 && (
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 800,
            color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            mb: 0.75,
          }}
        >
          {categoryName.join(" · ")}
        </Typography>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.25rem" },
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "text.primary",
          }}
        >
          {name}
        </Typography>
        <CheckCircleRoundedIcon
          sx={{ fontSize: 24, color: COLORS.NEW_UI.VERIFIED_GREEN }}
          titleAccess="Listed on Kartsquare"
        />
        {isNew && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.25,
              py: 0.25,
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 800,
              bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
              color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            }}
          >
            New
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
          <StarRoundedIcon sx={{ color: COLORS.NEW_UI.STAR_AMBER, fontSize: 20 }} />
          {hasRating ? (
            <>
              <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary" }}>
                {ratingNumber.toFixed(1)}
              </Typography>
              {hasReviews && (
                <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>
                  ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>
              New · No reviews yet
            </Typography>
          )}
        </Box>

        {city && (
          <>
            <Typography sx={{ fontSize: "0.86rem", color: "text.secondary" }}>·</Typography>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.35 }}>
              <PlaceRoundedIcon sx={{ fontSize: 17, color: COLORS.PRIMARY_PURPLE }} />
              {showArea && (
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "text.primary" }}>
                  {area},&nbsp;
                </Typography>
              )}
              <Typography
                sx={{
                  fontSize: "0.88rem",
                  fontWeight: showArea ? 400 : 700,
                  color: showArea ? "text.secondary" : "text.primary",
                }}
              >
                {city}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ServiceTitleBlock;
