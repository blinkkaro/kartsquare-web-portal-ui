"use client";
import React from "react";
import {
  Box,
  Typography,
  Switch,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  useTheme,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { COLORS } from "@/constants/colors";

export interface AreaFilterItem {
  name: string;
  count?: number;
}

export type PricingFilterType = "any" | "starting_price" | "contact_price";
export type RatingFilterType = "any" | "4.0" | "4.5";

export interface ServicesFilterState {
  rating: RatingFilterType;
  verifiedOnly: boolean;
  pricing: PricingFilterType;
  selectedAreas: string[];
  sortByDistance: boolean;
}

interface ServicesFilterSidebarProps {
  filters: ServicesFilterState;
  onChangeFilter: (key: keyof ServicesFilterState, value: any) => void;
  onResetFilters: () => void;
  areaItems: AreaFilterItem[];
  onTriggerDistanceSort: () => void;
  isLocating?: boolean;
}

export default function ServicesFilterSidebar({
  filters,
  onChangeFilter,
  onResetFilters,
  areaItems,
  onTriggerDistanceSort,
  isLocating,
}: ServicesFilterSidebarProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const ratingOptions: Array<{ id: RatingFilterType; label: string }> = [
    { id: "any", label: "Any" },
    { id: "4.0", label: "4.0+" },
    { id: "4.5", label: "4.5+" },
  ];

  const handleAreaToggle = (areaName: string) => {
    const current = new Set(filters.selectedAreas);
    if (current.has(areaName)) {
      current.delete(areaName);
    } else {
      current.add(areaName);
    }
    onChangeFilter("selectedAreas", Array.from(current));
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 270,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        pr: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid",
          borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
          mb: 2.5,
        }}
      >
        <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "text.primary" }}>
          Filters
        </Typography>
        <Button
          onClick={onResetFilters}
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: dark ? "#c4a3ff" : COLORS.PRIMARY_PURPLE,
            textTransform: "none",
            p: 0,
            minWidth: 0,
            "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
          }}
        >
          Reset filters
        </Button>
      </Box>

      {/* 1. Rating */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1.25, color: "text.primary" }}>
          Rating
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            p: "3px",
            borderRadius: "10px",
            bgcolor: dark ? "rgba(255,255,255,0.05)" : "#f4f1f8",
          }}
        >
          {ratingOptions.map((opt) => {
            const isSelected = filters.rating === opt.id;
            return (
              <Box
                key={opt.id}
                component="button"
                type="button"
                onClick={() => onChangeFilter("rating", opt.id)}
                sx={{
                  py: 0.8,
                  textAlign: "center",
                  fontSize: "0.8rem",
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  bgcolor: isSelected ? (dark ? "#262332" : "#ffffff") : "transparent",
                  color: isSelected ? (dark ? "#ffffff" : COLORS.PRIMARY_PURPLE) : "text.secondary",
                  boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 2. Verified only */}
      <Box
        sx={{
          mb: 3,
          pb: 2.5,
          borderBottom: "1px solid",
          borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "text.primary" }}>
              Verified only
            </Typography>
            <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", mt: 0.2 }}>
              Details checked by Kartsquare
            </Typography>
          </Box>
          <Switch
            checked={filters.verifiedOnly}
            onChange={(e) => onChangeFilter("verifiedOnly", e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: COLORS.PRIMARY_PURPLE,
                "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                bgcolor: COLORS.PRIMARY_PURPLE,
              },
            }}
          />
        </Box>
      </Box>

      {/* 3. Pricing */}
      <Box
        sx={{
          mb: 3,
          pb: 2.5,
          borderBottom: "1px solid",
          borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
        }}
      >
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1, color: "text.primary" }}>
          Pricing
        </Typography>
        <RadioGroup
          value={filters.pricing}
          onChange={(e) => onChangeFilter("pricing", e.target.value as PricingFilterType)}
        >
          <FormControlLabel
            value="any"
            control={
              <Radio
                size="small"
                sx={{
                  color: dark ? "rgba(255,255,255,0.3)" : "#b3acbd",
                  "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                }}
              />
            }
            label={<Typography sx={{ fontSize: "0.84rem", color: "text.primary" }}>Any</Typography>}
            sx={{ mb: 0.5 }}
          />
          <FormControlLabel
            value="starting_price"
            control={
              <Radio
                size="small"
                sx={{
                  color: dark ? "rgba(255,255,255,0.3)" : "#b3acbd",
                  "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.84rem", color: "text.primary" }}>
                Shows a starting price
              </Typography>
            }
            sx={{ mb: 0.5 }}
          />
          <FormControlLabel
            value="contact_price"
            control={
              <Radio
                size="small"
                sx={{
                  color: dark ? "rgba(255,255,255,0.3)" : "#b3acbd",
                  "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.84rem", color: "text.primary" }}>
                Contact for pricing
              </Typography>
            }
          />
        </RadioGroup>
      </Box>

      {/* 4. Area / Localities */}
      {areaItems.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1, color: "text.primary" }}>
            Area
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {areaItems.map((area) => {
              const checked = filters.selectedAreas.includes(area.name);
              return (
                <Box
                  key={area.name}
                  onClick={() => handleAreaToggle(area.name)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.4,
                    px: 0.5,
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f6f3f9" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Checkbox
                      checked={checked}
                      size="small"
                      sx={{
                        p: 0.5,
                        color: dark ? "rgba(255,255,255,0.3)" : "#b3acbd",
                        "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                      }}
                    />
                    <Typography sx={{ fontSize: "0.84rem", color: "text.primary" }}>
                      {area.name}
                    </Typography>
                  </Box>
                  {typeof area.count === "number" && (
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", pr: 0.5 }}>
                      {area.count}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* 5. Sort by distance from me button */}
      <Button
        onClick={onTriggerDistanceSort}
        disabled={isLocating}
        variant="outlined"
        startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
        sx={{
          width: "100%",
          py: 1,
          borderRadius: "12px",
          borderStyle: "dashed",
          borderColor: filters.sortByDistance
            ? COLORS.PRIMARY_PURPLE
            : dark
            ? "rgba(255,255,255,0.2)"
            : "#d9d3e3",
          bgcolor: filters.sortByDistance
            ? COLORS.PURPLE_ALPHA_10
            : "transparent",
          color: dark ? "#d2b4ff" : COLORS.PRIMARY_PURPLE,
          fontSize: "0.82rem",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            borderColor: COLORS.PRIMARY_PURPLE,
            bgcolor: COLORS.PURPLE_ALPHA_10,
          },
        }}
      >
        {isLocating
          ? "Locating..."
          : filters.sortByDistance
          ? "✓ Sorted by distance"
          : "+ Sort by distance from me"}
      </Button>
    </Box>
  );
}
