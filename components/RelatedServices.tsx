import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../constants/colors";
import { Service } from "../services/serviceList/listInteraface";
import ServiceCard from "./ServiceCard";

interface RelatedServicesProps {
  services: Service[];
  title?: string;
}

const RelatedServices: React.FC<RelatedServicesProps> = ({
  services,
  title = "Turfa al-Shah's Services",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (services.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.service_id} service={service} />
        ))}
      </Box>
    </Box>
  );
};

export default RelatedServices;
