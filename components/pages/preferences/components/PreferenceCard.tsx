"use client";
import { COLORS } from "@/constants/colors";
import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";

const iconMap: {
  [key: string]: { icon: string };
} = {
  // Original Icons
  fitness: { icon: "💪" },
  Music_icon: { icon: "🎶" },
  sports_icon: { icon: "🏀" },
  lifestyle_icon: { icon: "🛍️" },
  health: { icon: "❤️" },
  beauty: { icon: "💅" },
  fashion: { icon: "👕" },
  education: { icon: "📚" },

  // Database Icons
  beauty_icon: { icon: "💅" },
  doctor_icon: { icon: "👨‍⚕️" },
  daily_services_icon: { icon: "🛒" },
  home_services_icon: { icon: "🏠" },
  events_entertainment_icon: { icon: "🎉" },
  music_icon: { icon: "🎶" },

  // Expanded Icons
  technology: { icon: "💻" },
  gaming: { icon: "🎮" },
  food: { icon: "🍔" },
  travel: { icon: "✈️" },
  outdoors: { icon: "🍃" },
  movies: { icon: "🎬" },
  reading: { icon: "📖" },
  finance: { icon: "💰" },
  business: { icon: "💼" },
  art: { icon: "🎨" },
  photography: { icon: "📸" },
  home: { icon: "🏠" },
  pets: { icon: "🐾" },
  science: { icon: "🧪" },
  automotive: { icon: "🚗" },

  // Default
  default: { icon: "📱" },
};

interface PreferenceCardProps {
  iconName: string;
  title: string;
  isSelected: boolean;
  onPress: (id: string) => void;
  id: string;
}

const PreferenceCards: React.FC<PreferenceCardProps> = ({
  iconName,
  title,
  isSelected,
  onPress,
  id,
}) => {
  return (
    <Box
      onClick={() => onPress(id)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        borderRadius: "16px",
        boxShadow: isSelected
          ? `0px 4px 20px ${COLORS.SHADOW.BLUE}`
          : `0px 2px 10px ${COLORS.SHADOW.DEFAULT}`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "2px solid",
        borderColor: isSelected ? "transparent" : "transparent",
        bgcolor: "background.paper",
        transform: isSelected ? "scale(1.05)" : "scale(1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0px 8px 25px ${COLORS.SHADOW.HOVER}`,
        },
        height: "100%",
        minHeight: "140px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          fontSize: { xs: "2rem", lg: "3rem" },
          mb: 2,
          transition: "transform 0.3s ease",
          transform: isSelected ? "scale(1.1)" : "scale(1)",
        }}
      >
        {iconMap[iconName]?.icon || iconMap["default"].icon}
      </Box>
      <Typography
        sx={{
          fontWeight: 600,
          textAlign: "center",
          color: isSelected ? "text.primary" : "text.secondary",
          fontSize: { xl: "1rem", lg: "0.875rem" },
        }}
      >
        {title}
      </Typography>

      <Box sx={{ mt: 1 }}>
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
              fontSize: "14px",
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
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PreferenceCards;
