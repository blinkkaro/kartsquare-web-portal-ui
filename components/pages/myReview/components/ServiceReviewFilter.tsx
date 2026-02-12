import React from "react";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import { Service } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";

interface ServiceReviewFilterProps {
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ServiceReviewFilter: React.FC<ServiceReviewFilterProps> = ({
  services,
  selectedId,
  onSelect,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Select Service
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {services.map((service) => {
          const isSelected = service.service_id === selectedId;
          return (
            <Chip
              key={service.service_id}
              label={service.service_name}
              onClick={() => onSelect(service.service_id)}
              sx={{
                bgcolor: isSelected
                  ? COLORS.PRIMARY_PURPLE
                  : isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
                color: isSelected
                  ? "white"
                  : isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                fontWeight: isSelected ? 600 : 400,
                "&:hover": {
                  bgcolor: isSelected
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? "rgba(255, 255, 255, 0.16)"
                      : "rgba(0, 0, 0, 0.16)",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ServiceReviewFilter;
