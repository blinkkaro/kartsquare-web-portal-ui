"use client";
import { COLORS } from "@/constants/colors";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

interface PreferenceCardProps {
  title: string;
  description?: string;
  isSelected: boolean;
  onPress: (id: string) => void;
  id: string;
}

const PreferenceCards: React.FC<PreferenceCardProps> = ({
  title,
  description,
  isSelected,
  onPress,
  id,
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={() => onPress(id)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: { xs: 2.5, sm: 3 },
        borderRadius: "20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "2px solid",
        borderColor: isSelected ? "primary.main" : "transparent",
        bgcolor: isSelected
          ? theme.palette.mode === "dark"
            ? "rgba(94, 24, 233, 0.15)"
            : "rgba(94, 24, 233, 0.04)"
          : theme.palette.mode === "dark"
          ? "grey.900"
          : "#F8F9FA",
        height: "100%",
        minHeight: "140px",
        "&:hover": {
          borderColor: isSelected
            ? "primary.main"
            : theme.palette.mode === "dark"
            ? "grey.700"
            : "grey.300",
        },
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "center",
            color: isSelected
              ? "text.primary"
              : theme.palette.mode === "dark"
              ? "grey.300"
              : "grey.700",
            fontSize: { xs: "0.9375rem", sm: "1rem" },
            lineHeight: 1.3,
            mb: 1,
            mt: 0.5,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: "0.8125rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        {isSelected ? (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "common.white",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            ✓
          </Box>
        ) : (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: theme.palette.mode === "dark" ? "grey.700" : "#E5E7EB",
              bgcolor: theme.palette.mode === "dark" ? "transparent" : "common.white",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PreferenceCards;
