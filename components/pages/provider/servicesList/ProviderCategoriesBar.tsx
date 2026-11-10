"use client";
import React from "react";
import { Box, Chip, useTheme } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { COLORS } from "../../../../constants/colors";
import { Category } from "../../../../services/serviceList/listInteraface";
import { english } from "../../../../features/i18n/en";
import CategoryIcon from "@/components/common/CategoryIcon";

interface ProviderCategoriesBarProps {
  categories: Category[];
  selectedCategory: string | null;
  categoriesLoading: boolean;
  onCategoryClick: (categoryId: string | null) => void;
}

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
        <LogoLoader size={24} />
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
                  <CategoryIcon icon={category.icon} color={category.color} size={18} />
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
