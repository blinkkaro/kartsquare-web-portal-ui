"use client";
import React, { useMemo, useState } from "react";
import { Box, Drawer, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { COLORS } from "@/constants/colors";
import { CategoryTile, HomeCategory } from "./CategoryTile";

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: HomeCategory[];
  isMobile: boolean;
  onCategoryClick: (category: HomeCategory) => void;
}

const CategoryDrawer = ({ open, onClose, categories, isMobile, onCategoryClick }: CategoryDrawerProps) => {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categories, search]);

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: isMobile
            ? {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: "75vh",
                p: 2.5,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE),
              }
            : {
                width: { sm: 380, md: 440 },
                p: 3,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE),
              },
        },
      }}
    >
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: "divider" }} />
        </Box>
      )}

      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        Browse all categories
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Find trusted experts and products across every category KartSquare offers.
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Try “Cleaning”, “AC Repair”, “Tutoring”..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: COLORS.PRIMARY_PURPLE }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "999px",
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f5f4fd"),
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: COLORS.PURPLE_ALPHA_20 },
            "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_PURPLE, borderWidth: "1.5px" },
          },
        }}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 2, fontWeight: 600, px: 0.5 }}
      >
        {search
          ? `${filteredCategories.length} of ${categories.length} categories match`
          : `${categories.length} categories to explore`}
      </Typography>

      {filteredCategories.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <SearchOffRoundedIcon sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            No categories found
          </Typography>
          <Typography variant="caption" color="text.secondary">
            We couldn&apos;t find anything for &ldquo;{search}&rdquo;. Try a different keyword.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(4, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.25,
            overflowY: "auto",
            pb: 1,
          }}
        >
          {filteredCategories.map((category, index) => (
            <CategoryTile
              key={category.id}
              category={category}
              index={index}
              onClick={() => {
                onClose();
                onCategoryClick(category);
              }}
            />
          ))}
        </Box>
      )}
    </Drawer>
  );
};

export default CategoryDrawer;
