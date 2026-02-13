"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceLocationProps {
  address: string;
  serviceAtLocation?: string;
  serviceRadius?: number;
  visitingCharge?: number | null;
}

const ServiceLocation = ({
  address,
  serviceAtLocation,
  serviceRadius,
  visitingCharge,
}: ServiceLocationProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 0 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
        }}
      >
        {english.my_address || "Service Provider Address"}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: "0.875rem", sm: "1rem" },
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {address || "123 Main Street, Al Satwa Dubai, United Arab Emirates"}
      </Typography>

      {serviceAtLocation === "at_customer" && (
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Visiting Charge */}
          <Box sx={{ flex: "1 1 auto", minWidth: "120px" }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontSize: "0.75rem",
                fontWeight: 500,
                display: "block",
                mb: 0.2,
              }}
            >
              {english.visiting_charge_inr || "Visiting Charge (INR)"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {visitingCharge ? `₹${visitingCharge}` : "₹0"}
            </Typography>
          </Box>

          {/* Service Radius */}
          <Box sx={{ flex: "1 1 auto", minWidth: "120px" }}>
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontSize: "0.75rem",
                fontWeight: 500,
                display: "block",
                mb: 0.2,
              }}
            >
              {english.service_radius_km || "Service Radius (km)"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {serviceRadius ? `${serviceRadius} km` : "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.6, sm: 0.8 },
                borderRadius: "20px",
                border: `1px solid ${isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE}`,
                bgcolor: isDark
                  ? COLORS.ACCENT_BLUE_BG_DARK
                  : "rgba(94, 24, 233, 0.04)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? COLORS.WHITE : COLORS.PRIMARY_PURPLE,
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                {english.provider_service_at_customer_location ||
                  "I provide this service at customer location"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ServiceLocation;
