"use client";
import { COLORS } from "@/constants/colors";
import { Box, Typography, useTheme } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import GrassRoundedIcon from "@mui/icons-material/GrassRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import React from "react";

const ICON_RULES: [RegExp, React.ElementType][] = [
  [/agri|farm|garden/i, GrassRoundedIcon],
  [/water|air.*treat|purif/i, WaterDropRoundedIcon],
  [/educat|train|school|tuition|coaching/i, SchoolRoundedIcon],
  [/electron|device|gadget|tech/i, DevicesRoundedIcon],
  [/beauty|spa|salon|wellness/i, SpaRoundedIcon],
  [/food|restaurant|catering|kitchen/i, RestaurantRoundedIcon],
  [/health|hospital|medic|clinic|pharma/i, LocalHospitalRoundedIcon],
  [/home|interior|furnitur|decor/i, HomeRoundedIcon],
  [/courier|logistic|freight|transport|delivery/i, LocalShippingRoundedIcon],
  [/finance|bank|account|invest|insurance/i, AccountBalanceRoundedIcon],
  [/fashion|cloth|apparel|tailor/i, CheckroomRoundedIcon],
  [/event|wedding|party|celebrat/i, EventRoundedIcon],
  [/pet|animal|vet/i, PetsRoundedIcon],
  [/fitness|gym|sport|yoga/i, FitnessCenterRoundedIcon],
  [/auto|car|vehicle|bike/i, DirectionsCarRoundedIcon],
  [/construct|build|civil|architect/i, ConstructionRoundedIcon],
  [/energy|solar|power|electric/i, BoltRoundedIcon],
  [/clean|pest|sanitiz/i, CleaningServicesRoundedIcon],
  [/security|guard|surveillance/i, SecurityRoundedIcon],
  [/legal|law|advocate|court/i, GavelRoundedIcon],
  [/market|advertis|promot|seo/i, CampaignRoundedIcon],
  [/photo|video|shoot|studio/i, CameraAltRoundedIcon],
  [/real.?estate|property|rent|apartment/i, ApartmentRoundedIcon],
  [/repair|handyman|plumb|electric.*repair|maintenance/i, HandymanRoundedIcon],
];

const getCategoryIcon = (name: string): React.ElementType => {
  const match = ICON_RULES.find(([regex]) => regex.test(name || ""));
  return match ? match[1] : CategoryRoundedIcon;
};

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
  const gradient = `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`;
  const CategoryIcon = getCategoryIcon(title);

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

      {/* Gradient category icon */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.25,
          background: isSelected
            ? gradient
            : theme.palette.mode === "dark"
            ? "rgba(130, 72, 247, 0.25)"
            : COLORS.PURPLE_ALPHA_10,
          transition: "all 0.25s ease",
        }}
      >
        <CategoryIcon
          sx={{
            fontSize: 19,
            color: isSelected ? "common.white" : COLORS.PRIMARY_PURPLE,
          }}
        />
      </Box>

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
