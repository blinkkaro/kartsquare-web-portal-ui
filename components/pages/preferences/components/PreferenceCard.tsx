"use client";
import { COLORS } from "@/constants/colors";
import { Box, Typography, useTheme } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CategoryIcon from "@/components/common/CategoryIcon";
import React from "react";

interface PreferenceCardProps {
  title: string;
  description?: string;
  isSelected: boolean;
  onPress: (id: string) => void;
  id: string;
  /** The preference's Iconify icon name and colour (backend migration 009). */
  icon?: string | null;
  color?: string | null;
}

const PreferenceCards: React.FC<PreferenceCardProps> = ({
  title,
  description,
  isSelected,
  onPress,
  id,
  icon,
  color,
}) => {
  const theme = useTheme();
  const gradient = `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`;

  return (
    <Box
      onClick={() => onPress(id)}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2 },
        borderRadius: "18px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "2px solid",
        borderColor: isSelected ? COLORS.PRIMARY_PURPLE : "transparent",
        bgcolor: isSelected
          ? theme.palette.mode === "dark"
            ? "rgba(130, 72, 247, 0.16)"
            : COLORS.PURPLE_ALPHA_04
          : theme.palette.mode === "dark"
          ? "grey.900"
          : "#F8F9FA",
        boxShadow: isSelected
          ? `0 10px 24px ${COLORS.PRIMARY_PURPLE}2e, 0 0 0 4px ${COLORS.PURPLE_ALPHA_10}`
          : "none",
        transform: isSelected ? "translateY(-3px) scale(1.01)" : "none",
        height: "100%",
        minHeight: "130px",
        overflow: "hidden",
        "&:hover": {
          borderColor: isSelected
            ? COLORS.PRIMARY_PURPLE
            : theme.palette.mode === "dark"
            ? "rgba(130, 72, 247, 0.35)"
            : COLORS.PURPLE_ALPHA_20,
          transform: isSelected ? "translateY(-3px) scale(1.01)" : "translateY(-1px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: gradient,
          opacity: isSelected ? 1 : 0,
          transition: "opacity 0.25s ease",
        },
      }}
    >
      {/* Selection badge - floats at top-right corner */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 20,
          height: 20,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isSelected ? gradient : "transparent",
          border: isSelected
            ? "none"
            : `2px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.16)" : "#E5E7EB"}`,
          boxShadow: isSelected ? `0 2px 8px ${COLORS.PRIMARY_PURPLE}55` : "none",
          transform: isSelected ? "scale(1)" : "scale(0.9)",
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {isSelected && <CheckRoundedIcon sx={{ fontSize: 14, color: "common.white" }} />}
      </Box>

      {/* Category icon; its tint stays when selected, since the card's border and glow show the selection */}
      <CategoryIcon icon={icon} color={color} tile={36} size={22} radius="11px" sx={{ mb: 1.25 }} />

      <Box sx={{ flexGrow: 1, pr: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            textAlign: "left",
            color: isSelected ? COLORS.PRIMARY_PURPLE : "text.primary",
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            lineHeight: 1.25,
            mb: 0.25,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              textAlign: "left",
              color: "text.secondary",
              fontSize: "0.6875rem",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PreferenceCards;
