"use client";

import React from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Category as CategoryIcon } from "@mui/icons-material";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  onCategoryClick: (categoryId: string | null) => void;
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("health")) return "🏥";
  if (name.includes("fitness")) return "💪";
  if (name.includes("beauty")) return "💄";
  if (name.includes("sport")) return "⚽";
  if (name.includes("fashion")) return "👗";
  return "📋";
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  loading,
  onCategoryClick,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark
    ? COLORS.BORDER.DEFAULT_DARK
    : COLORS.BORDER.DEFAULT_LIGHT;
  const chipBg = isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE;
  const textPrimary = isDark
    ? COLORS.TEXT.PRIMARY_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;
  const textSecondary = isDark
    ? COLORS.TEXT.SECONDARY_DARK
    : COLORS.TEXT.SECONDARY_LIGHT;

  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <CategoryIcon
          sx={{
            fontSize: 20,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: textPrimary,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {t("categories_label")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          overflowX: "auto",
          pb: 1.5,
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: borderColor,
            borderRadius: 3,
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
            <CircularProgress size={28} sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        ) : (
          <>
            <Chip
              label={t("all_categories")}
              onClick={() => onCategoryClick(null)}
              sx={{
                borderRadius: 3,
                px: 2,
                py: 1.25,
                height: "auto",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                bgcolor:
                  selectedCategory === null
                    ? isDark
                      ? COLORS.ACCENT_BLUE_DARK
                      : COLORS.PRIMARY_PURPLE
                    : chipBg,
                color: selectedCategory === null ? COLORS.WHITE : textPrimary,
                border: `1px solid ${selectedCategory === null ? (isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE) : borderColor}`,
                "&:hover": {
                  bgcolor:
                    selectedCategory === null
                      ? isDark
                        ? COLORS.ACCENT_BLUE_DARK
                        : COLORS.PRIMARY_PURPLE
                      : COLORS.PURPLE_ALPHA_04,
                  borderColor: isDark
                    ? COLORS.ACCENT_BLUE_DARK
                    : COLORS.PRIMARY_PURPLE,
                },
              }}
            />
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <Chip
                  key={category.id}
                  icon={
                    <Box component="span" sx={{ fontSize: "1rem" }}>
                      {getCategoryIcon(category.name)}
                    </Box>
                  }
                  label={category.name}
                  onClick={() => onCategoryClick(category.id)}
                  sx={{
                    borderRadius: 3,
                    px: 2,
                    py: 1.25,
                    height: "auto",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    bgcolor: isSelected
                      ? isDark
                        ? COLORS.ACCENT_BLUE_DARK
                        : COLORS.PRIMARY_PURPLE
                      : chipBg,
                    color: isSelected ? COLORS.WHITE : textPrimary,
                    border: `1px solid ${isSelected ? (isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE) : borderColor}`,
                    "& .MuiChip-icon": { color: "inherit", ml: 1 },
                    "&:hover": {
                      bgcolor: isSelected
                        ? isDark
                          ? COLORS.ACCENT_BLUE_DARK
                          : COLORS.PRIMARY_PURPLE
                        : COLORS.PURPLE_ALPHA_04,
                      borderColor: isDark
                        ? COLORS.ACCENT_BLUE_DARK
                        : COLORS.PRIMARY_PURPLE,
                    },
                  }}
                />
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CategoryFilter;
