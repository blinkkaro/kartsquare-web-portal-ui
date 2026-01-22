"use client";
import React from "react";
import {
  Box,
  Chip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Category } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

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
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 4,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
          borderRadius: "3px",
        },
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          <Chip
            label={t("all_categories")}
            onClick={() => onCategoryClick(null)}
            sx={{
              borderRadius: "20px",
              px: 2,
              height: "36px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              bgcolor: selectedCategory === null
                ? COLORS.PRIMARY_PURPLE
                : (isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT),
              color: selectedCategory === null
                ? "white"
                : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
              border: `1px solid ${selectedCategory === null ? COLORS.PRIMARY_PURPLE : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)}`,
              "&:hover": {
                bgcolor: selectedCategory === null
                  ? COLORS.PURPLE_HOVER
                  : (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT),
              },
            }}
          />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${getCategoryIcon(category.name)} ${category.name}`}
              onClick={() => onCategoryClick(category.id)}
              sx={{
                borderRadius: "20px",
                px: 2,
                height: "36px",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                bgcolor: selectedCategory === category.id
                  ? COLORS.PRIMARY_PURPLE
                  : (isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT),
                color: selectedCategory === category.id
                  ? "white"
                  : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                border: `1px solid ${selectedCategory === category.id ? COLORS.PRIMARY_PURPLE : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)}`,
                "&:hover": {
                  bgcolor: selectedCategory === category.id
                    ? COLORS.PURPLE_HOVER
                    : (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT),
                },
              }}
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default CategoryFilter;