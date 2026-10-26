"use client";
import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Badge,
  useTheme,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { COLORS } from "@/constants/colors";

export type SortOptionType = "recommended" | "rating" | "reviews" | "price_low";

interface ServicesToolbarProps {
  totalCount: number;
  categoryName: string;
  cityName: string;
  sortBy: SortOptionType;
  onChangeSort: (sort: SortOptionType) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export default function ServicesToolbar({
  totalCount,
  categoryName,
  cityName,
  sortBy,
  onChangeSort,
  onOpenMobileFilters,
  activeFilterCount,
}: ServicesToolbarProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
        mb: 2,
        borderBottom: "1px solid",
        borderColor: dark ? "rgba(255,255,255,0.06)" : "#ede9f2",
      }}
    >
      {/* Result count */}
      <Typography
        sx={{
          fontSize: { xs: "0.88rem", sm: "0.98rem" },
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {totalCount}{" "}
        {categoryName ? categoryName.toLowerCase() : "providers"}{" "}
        <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
          · {cityName || "Jaipur"}
        </Box>
      </Typography>

      {/* Right controls: Mobile Filter button + Sort Dropdown */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Mobile filter button */}
        <Button
          onClick={onOpenMobileFilters}
          variant="outlined"
          startIcon={
            <Badge badgeContent={activeFilterCount} color="primary">
              <TuneRoundedIcon sx={{ fontSize: 18 }} />
            </Badge>
          }
          sx={{
            display: { xs: "inline-flex", md: "none" },
            px: 1.75,
            py: 0.65,
            borderRadius: "999px",
            borderColor: dark ? "rgba(255,255,255,0.2)" : "#d6d0e0",
            color: "text.primary",
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Filters & sort
        </Button>

        {/* Sort select */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            sx={{
              display: { xs: "none", sm: "inline" },
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            Sort
          </Typography>
          <Select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value as SortOptionType)}
            IconComponent={KeyboardArrowDownRoundedIcon}
            size="small"
            sx={{
              fontSize: "0.84rem",
              fontWeight: 700,
              borderRadius: "10px",
              bgcolor: dark ? "rgba(255,255,255,0.05)" : "#f6f3f9",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: dark ? "rgba(255,255,255,0.1)" : "#e2deea",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
              "& .MuiSelect-select": {
                py: 0.75,
                pr: "28px !important",
              },
            }}
          >
            <MenuItem value="recommended" sx={{ fontSize: "0.84rem" }}>
              Recommended
            </MenuItem>
            <MenuItem value="rating" sx={{ fontSize: "0.84rem" }}>
              Highest rated
            </MenuItem>
            <MenuItem value="reviews" sx={{ fontSize: "0.84rem" }}>
              Most reviewed
            </MenuItem>
            <MenuItem value="price_low" sx={{ fontSize: "0.84rem" }}>
              Lowest price
            </MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
