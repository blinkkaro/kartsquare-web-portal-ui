"use client";
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Switch,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Divider,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { COLORS } from "@/constants/colors";
import {
  ServicesFilterState,
  AreaFilterItem,
  RatingFilterType,
  PricingFilterType,
} from "./ServicesFilterSidebar";
import { SortOptionType } from "./ServicesToolbar";

interface ServicesMobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ServicesFilterState;
  onChangeFilter: (key: keyof ServicesFilterState, value: any) => void;
  onResetFilters: () => void;
  sortBy: SortOptionType;
  onChangeSort: (sort: SortOptionType) => void;
  areaItems: AreaFilterItem[];
  totalResults: number;
}

export default function ServicesMobileFilterDrawer({
  open,
  onClose,
  filters,
  onChangeFilter,
  onResetFilters,
  sortBy,
  onChangeSort,
  areaItems,
  totalResults,
}: ServicesMobileFilterDrawerProps) {
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
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: "85vh",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton onClick={onClose} size="small">
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "text.primary" }}>
              Filters & sort
            </Typography>
          </Box>

          <Button
            onClick={onResetFilters}
            sx={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: COLORS.PRIMARY_PURPLE,
              textTransform: "none",
              p: 0,
            }}
          >
            Reset all
          </Button>
        </Box>

        {/* Scrollable Filter Body */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          {/* 1. Sort By */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1, color: "text.primary" }}>
              Sort by
            </Typography>
            <RadioGroup
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as SortOptionType)}
            >
              {[
                { value: "recommended", label: "Recommended" },
                { value: "rating", label: "Highest rated" },
                { value: "reviews", label: "Most reviewed" },
                { value: "price_low", label: "Lowest price" },
              ].map((s) => (
                <FormControlLabel
                  key={s.value}
                  value={s.value}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: dark ? "rgba(255,255,255,0.3)" : "#b3acbd",
                        "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: "0.84rem" }}>{s.label}</Typography>}
                />
              ))}
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 2. Rating */}
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
                    }}
                  >
                    {opt.label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 3. Verified only */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "text.primary" }}>
                Verified only
              </Typography>
              <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>
                Details checked by Kartsquare
              </Typography>
            </Box>
            <Switch
              checked={filters.verifiedOnly}
              onChange={(e) => onChangeFilter("verifiedOnly", e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: COLORS.PRIMARY_PURPLE,
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: COLORS.PRIMARY_PURPLE,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 4. Pricing */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1, color: "text.primary" }}>
              Pricing
            </Typography>
            <RadioGroup
              value={filters.pricing}
              onChange={(e) => onChangeFilter("pricing", e.target.value as PricingFilterType)}
            >
              <FormControlLabel
                value="any"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.84rem" }}>Any</Typography>}
              />
              <FormControlLabel
                value="starting_price"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.84rem" }}>Shows a starting price</Typography>}
              />
              <FormControlLabel
                value="contact_price"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.84rem" }}>Contact for pricing</Typography>}
              />
            </RadioGroup>
          </Box>

          {/* 5. Area */}
          {areaItems.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1, color: "text.primary" }}>
                  Area
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
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
                          py: 0.5,
                          cursor: "pointer",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Checkbox checked={checked} size="small" sx={{ p: 0.5 }} />
                          <Typography sx={{ fontSize: "0.84rem" }}>{area.name}</Typography>
                        </Box>
                        {typeof area.count === "number" && (
                          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                            {area.count}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* Sticky Apply Button */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
            bgcolor: "background.paper",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.92rem",
              borderRadius: "12px",
              py: 1.2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            Show {totalResults} providers
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
