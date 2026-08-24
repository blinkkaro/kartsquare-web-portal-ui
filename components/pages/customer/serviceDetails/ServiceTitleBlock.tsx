"use client";
import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { Room, Verified, Star } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";

interface ServiceTitleBlockProps {
  name: string;
  categoryName: string[];
  city?: string;
  isNew?: boolean;
  avgRating?: number;
  reviewCount?: number;
}

const ServiceTitleBlock = ({
  name,
  categoryName,
  city,
  isNew,
  avgRating,
  reviewCount,
}: ServiceTitleBlockProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ratingNumber = Number(avgRating);
  const hasRating = Number.isFinite(ratingNumber) && ratingNumber > 0;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
      <Box>
        {categoryName.length > 0 && (
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              mb: 0.5,
            }}
          >
            {categoryName.join(" · ")}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: { xs: "1.6rem", sm: "2.1rem" },
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.01em",
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
          {hasRating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  bgcolor: "rgba(245, 158, 11, 0.12)",
                  color: "#b45309",
                  borderRadius: "8px",
                  px: 0.9,
                  py: 0.25,
                }}
              >
                <Star sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 800 }}>
                  {ratingNumber.toFixed(1)}
                </Typography>
              </Box>
              {!!reviewCount && (
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                </Typography>
              )}
            </Box>
          )}
          {city && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Room sx={{ fontSize: 16, color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }} />
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              >
                {city}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {isNew && (
        <Chip
          icon={<Verified sx={{ fontSize: "16px !important" }} />}
          label="New"
          size="small"
          sx={{
            bgcolor: "rgba(51, 207, 77, 0.14)",
            color: COLORS.SUCCESS_GREEN,
            fontWeight: 700,
            flexShrink: 0,
          }}
        />
      )}
    </Box>
  );
};

export default ServiceTitleBlock;
