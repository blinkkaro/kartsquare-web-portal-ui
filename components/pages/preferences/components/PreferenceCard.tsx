"use client";
import { COLORS } from "@/constants/colors";
import { Box, Typography } from "@mui/material";
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

  // New Database Icons from Screenshot
  real_estate: { icon: "🏠" },
  automotive_services: { icon: "🚗" },
  business_services: { icon: "💼" },
  education_services: { icon: "🎓" },
  home_services: { icon: "🧹" },
  construction_services: { icon: "🏗️" },
  event_management: { icon: "🎭" },
  jems_jewelry: { icon: "💎" },
  healthcare_services: { icon: "🏥" },
  digital_services: { icon: "💻" },
  legal_services: { icon: "⚖️" },
  hospitality_services: { icon: "🏨" },
  financial_services: { icon: "🏦" },
  relocation_services: { icon: "🚚" },
  personal_care: { icon: "🧴" },
  grocery_services: { icon: "🛒" },
  government_services: { icon: "🏛️" },

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
        p: 1.5,
        borderRadius: "16px",
        boxShadow: isSelected
          ? `0 4px 16px ${COLORS.SHADOW.BLUE}`
          : "0 1px 3px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        border: "2px solid",
        borderColor: isSelected ? "primary.main" : "transparent",
        bgcolor: "background.paper",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        height: "100%",
        minHeight: "120px",
        position: "relative",
        "&:hover": {
          transform: "scale(1.02) translateY(-2px)",
          boxShadow: isSelected
            ? `0 8px 24px ${COLORS.SHADOW.BLUE}`
            : "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: isSelected ? "primary.main" : "grey.300",
        },
      }}
    >
      <Box
        sx={{
          fontSize: { xs: "1.75rem", sm: "2rem" },
          mb: 1,
          lineHeight: 1,
          transition: "transform 0.25s ease",
          transform: isSelected ? "scale(1.08)" : "scale(1)",
        }}
      >
        {iconMap[iconName]?.icon || iconMap["default"].icon}
      </Box>
      <Typography
        sx={{
          fontWeight: 600,
          textAlign: "center",
          color: isSelected ? "text.primary" : "text.secondary",
          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
          lineHeight: 1.3,
          px: 0.5,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ mt: 0.75 }}>
        {isSelected ? (
          <Box
            sx={{
              width: 22,
              height: 22,
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
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "grey.300",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PreferenceCards;
