"use client";

import React from "react";
import {
  Box,
  Chip,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { FilterList, Clear } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { ad_status_type } from "@/services/advertise/advertise.intreface";

interface AdFiltersProps {
  selectedCategory?: string;
  selectedService?: string;
  selectedStatus?: ad_status_type | "";
  categories: Array<{ id: string; name: string }>;
  services: Array<{ service_id: string; service_name: string }>;
  onCategoryChange: (categoryId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onStatusChange: (status: ad_status_type | "") => void;
  onClearFilters: () => void;
}

const AdFilters: React.FC<AdFiltersProps> = ({
  selectedCategory = "",
  selectedService = "",
  selectedStatus = "",
  categories,
  services,
  onCategoryChange,
  onServiceChange,
  onStatusChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const statusOptions = [
    {
      value: ad_status_type.PENDING,
      label: t("ad_status_pending"),
      color: "hsl(45deg 100% 51% / 71%)",
    },
    {
      value: ad_status_type.ACTIVE,
      label: t("ad_status_active"),
      color: "hsl(142deg 99.14% 41.59% / 71%)",
    },
    {
      value: ad_status_type.INACTIVE,
      label: t("ad_status_inactive"),
      color: "hsl(0deg 100% 50% / 71%)",
    },
    {
      value: ad_status_type.REJECTED,
      label: t("ad_status_rejected"),
      color: "hsl(0deg 84% 60% / 71%)",
    },
  ];

  const hasActiveFilters =
    selectedCategory || selectedService || selectedStatus;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList sx={{ fontSize: 20, color: COLORS.PRIMARY_PURPLE }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {t("filters")}
          </Typography>
        </Box>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={onClearFilters}
            sx={{
              color: COLORS.PRIMARY_PURPLE,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              "&:hover": {
                bgcolor: COLORS.PURPLE_ALPHA_10,
              },
            }}
          >
            {t("clear_filters")}
          </Button>
        )}
      </Box>

      {/* Filters Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Category Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 200 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
            },
          }}
        >
          <InputLabel>{t("category")}</InputLabel>
          <Select
            value={selectedCategory}
            label={t("category")}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">
              <em>{t("all_categories")}</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Service Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 200 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
            },
          }}
        >
          <InputLabel>{t("ad_form_service")}</InputLabel>
          <Select
            value={selectedService}
            label={t("ad_form_service")}
            onChange={(e) => onServiceChange(e.target.value)}
          >
            <MenuItem value="">
              <em>{t("all_services")}</em>
            </MenuItem>
            {services.map((service) => (
              <MenuItem key={service.service_id} value={service.service_id}>
                {service.service_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Status Filter Chips */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            fontWeight: 600,
            fontSize: "0.75rem",
            mb: 1,
            display: "block",
          }}
        >
          {t("status")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={t("ad_status_all")}
            onClick={() => onStatusChange("")}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.75rem",
              cursor: "pointer",
              bgcolor:
                selectedStatus === ""
                  ? COLORS.PRIMARY_PURPLE
                  : isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.WHITE,
              color:
                selectedStatus === ""
                  ? COLORS.WHITE
                  : isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              border: `1px solid ${selectedStatus === "" ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              "&:hover": {
                bgcolor:
                  selectedStatus === ""
                    ? COLORS.PURPLE_HOVER
                    : COLORS.PURPLE_ALPHA_10,
                borderColor: COLORS.PRIMARY_PURPLE,
              },
            }}
          />
          {statusOptions.map((status) => {
            const isSelected = selectedStatus === status.value;
            return (
              <Chip
                key={status.value}
                label={status.label}
                onClick={() => onStatusChange(status.value)}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  bgcolor: isSelected
                    ? status.color
                    : isDark
                      ? COLORS.BACKGROUND.SECONDARY_DARK
                      : COLORS.WHITE,
                  color: isSelected
                    ? COLORS.WHITE
                    : isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  border: `1px solid ${isSelected ? status.color : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                  "&:hover": {
                    bgcolor: isSelected ? status.color : COLORS.PURPLE_ALPHA_10,
                    borderColor: isSelected
                      ? status.color
                      : COLORS.PRIMARY_PURPLE,
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AdFilters;
