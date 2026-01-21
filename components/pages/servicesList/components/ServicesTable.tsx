"use client";
import React from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ServicesTableProps {
  services: Service[];
  loading: boolean;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ services, loading }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {t("no_services_found")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {t("try_different_search")}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {services.map((service, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <ServiceCard service={service} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ServicesTable;
