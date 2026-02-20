"use client";
import React from "react";
import { Box, Chip, CircularProgress, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { Category } from "../../../../services/serviceList/listInteraface";
import { english } from "../../../../features/i18n/en";

interface ProviderCategoriesBarProps {
  categories: Category[];
  selectedCategory: string | null;
  categoriesLoading: boolean;
  onCategoryClick: (categoryId: string | null) => void;
}

// Category icons mapping
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

const ProviderCategoriesBar = ({
  categories,
  selectedCategory,
  categoriesLoading,
  onCategoryClick,
}: ProviderCategoriesBarProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 2, sm: 4 },
        overflowX: "auto",
        pb: 1,
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
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
      {categoriesLoading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          <Chip
            label={english.all}
            onClick={() => onCategoryClick(null)}
            sx={{
              borderRadius: "20px",
              px: { xs: 1.5, sm: 2 },
              height: { xs: "32px", sm: "36px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
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
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  <span>{getCategoryIcon(category.name)}</span>
                  <span>{category.name}</span>
                </Box>
              }
              onClick={() => onCategoryClick(category.id)}
              sx={{
                borderRadius: "20px",
                px: { xs: 1.5, sm: 2 },
                height: { xs: "32px", sm: "36px" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
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

export default ProviderCategoriesBar;
