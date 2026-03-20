"use client";
import React from "react";
import { Box, Chip, useTheme } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
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
  if (name.includes("business") || name.includes("finance")) return "💼";
  if (
    name.includes("car") ||
    name.includes("automotive") ||
    name.includes("vehicle")
  )
    return "🚗";
  if (
    name.includes("event") ||
    name.includes("entertainment") ||
    name.includes("party")
  )
    return "🎭";
  if (
    name.includes("health") ||
    name.includes("medical") ||
    name.includes("wellness")
  )
    return "🩺";
  if (
    name.includes("it") ||
    name.includes("software") ||
    name.includes("tech") ||
    name.includes("computer")
  )
    return "💻";
  if (
    name.includes("legal") ||
    name.includes("compliance") ||
    name.includes("law")
  )
    return "⚖️";
  if (name.includes("lifestyle")) return "🏡";
  if (name.includes("fitness") || name.includes("gym")) return "💪";
  if (name.includes("beauty") || name.includes("salon") || name.includes("spa"))
    return "💄";
  if (name.includes("sport")) return "⚽";
  if (name.includes("fashion") || name.includes("clothing")) return "👗";
  if (name.includes("cleaning")) return "🧹";
  if (
    name.includes("home") ||
    name.includes("repair") ||
    name.includes("maintenance")
  )
    return "🛠️";
  if (
    name.includes("education") ||
    name.includes("learning") ||
    name.includes("tutor")
  )
    return "🎓";
  if (
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("restaurant")
  )
    return "🍴";
  if (name.includes("travel") || name.includes("tour")) return "✈️";
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
          bgcolor: isDark
            ? COLORS.BORDER.DEFAULT_DARK
            : COLORS.BORDER.DEFAULT_LIGHT,
          borderRadius: "3px",
        },
      }}
    >
      {loading ? (
        <LogoLoader size={24} />
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
              bgcolor:
                selectedCategory === null
                  ? COLORS.PRIMARY_PURPLE
                  : isDark
                    ? COLORS.BACKGROUND.PAPER_DARK
                    : COLORS.BACKGROUND.PRIMARY_LIGHT,
              color:
                selectedCategory === null
                  ? "white"
                  : isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              border: `1px solid ${selectedCategory === null ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              "&:hover": {
                bgcolor:
                  selectedCategory === null
                    ? COLORS.PURPLE_HOVER
                    : isDark
                      ? COLORS.BACKGROUND.SECONDARY_DARK
                      : COLORS.BACKGROUND.SECONDARY_LIGHT,
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
                bgcolor:
                  selectedCategory === category.id
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                color:
                  selectedCategory === category.id
                    ? "white"
                    : isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                border: `1px solid ${selectedCategory === category.id ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                "&:hover": {
                  bgcolor:
                    selectedCategory === category.id
                      ? COLORS.PURPLE_HOVER
                      : isDark
                        ? COLORS.BACKGROUND.SECONDARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
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
