"use client";
import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Switch,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceDetailsGridProps {
  hasServiceDuration?: boolean;
  serviceDuration: number;
  bookings?: number;
  homeFee?: number;
  serviceStatus?: boolean;
  onStatusToggle?: (newStatus: "ACTIVE" | "INACTIVE") => void;
  isUpdating?: boolean;
  status?: string | null;
  haveSlots?: boolean;
  showNumber?: boolean;
  onShowNumberToggle?: (checked: boolean) => void;
}

const ServiceDetailsGrid = ({
  hasServiceDuration,
  serviceDuration,
  bookings = 80,
  homeFee = 10.0,
  serviceStatus = true,
  onStatusToggle,
  isUpdating = false,
  status = "",
  haveSlots = false,
  showNumber = false,
  onShowNumberToggle,
}: ServiceDetailsGridProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onStatusToggle) {
      onStatusToggle(event.target.checked ? "ACTIVE" : "INACTIVE");
    }
  };

  return (
    <Box
      sx={{
        borderRadius: { xs: "8px", sm: "12px" },
        py: { xs: 1.5, sm: 2 },
      }}
    >
      {/* Combined Row: Duration and Service Status */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        {/* Duration */}
        {(hasServiceDuration ?? serviceDuration > 0) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                whiteSpace: "nowrap",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {english.duration}:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                whiteSpace: "nowrap",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {(() => {
                if (!serviceDuration) return "0d 0h 0m";
                const d = Math.floor(serviceDuration / (24 * 60));
                const h = Math.floor((serviceDuration % (24 * 60)) / 60);
                const m = serviceDuration % 60;
                return `${d > 0 ? `${d}d ` : ""}${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m` : d === 0 && h === 0 ? "0m" : ""}`;
              })()}
            </Typography>
          </Box>
        )}

        {/* Slots Indicator */}
        {(hasServiceDuration ?? serviceDuration > 0) && haveSlots && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime
              sx={{
                fontSize: "1rem",
                color: COLORS.PRIMARY_PURPLE,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: COLORS.PRIMARY_PURPLE,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {english.time_slots_enabled || "Time Slots Enabled"}
            </Typography>
          </Box>
        )}

        {/* Service status */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {english.service_status}
          </Typography>
          <Tooltip
            title={
              status === "PENDING_APPROVAL"
                ? "This service is currently pending approval. You will be able to activate or deactivate it once it has been approved."
                : ""
            }
            arrow
            placement="top"
          >
            <Box sx={{ display: "inline-block" }}>
              <Switch
                checked={serviceStatus}
                onChange={handleToggle}
                disabled={isUpdating || status === "PENDING_APPROVAL"}
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: COLORS.PRIMARY_PURPLE,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: COLORS.PRIMARY_PURPLE,
                  },
                  "&.Mui-disabled": {
                    cursor: "not-allowed",
                    pointerEvents: "auto",
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Box>

        {/* Show Number Toggle */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {english.show_number || "Show Number"}
          </Typography>
          <Switch
            checked={showNumber}
            onChange={(e) => onShowNumberToggle?.(e.target.checked)}
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: COLORS.PRIMARY_PURPLE,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: COLORS.PRIMARY_PURPLE,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetailsGrid;
