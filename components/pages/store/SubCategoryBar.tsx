"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Stack,
  Avatar,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { Category, SubCategory } from "@/services/store/store.service";

interface SubCategoryBarProps {
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  categories?: Category[];
}

const SubCategoryBar: React.FC<SubCategoryBarProps> = ({
  selectedCategory,
  selectedSubCategory,
  categories = [],
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get subcategories for the selected category
  const getSubCategories = (): SubCategory[] => {
    if (!selectedCategory) return [];
    
    const category = categories.find(cat => cat.product_category_id === selectedCategory);
    return category?.sub_categories || [];
  };

  const subCategories = getSubCategories();

  // Don't show if no subcategories or if we're already in a subcategory
  if (subCategories.length === 0 || selectedSubCategory) {
    return null;
  }

  const handleSubCategoryClick = (subCategoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sub_category', subCategoryId);
    params.delete('category'); // Remove main category when selecting subcategory
    router.push(`/store/products?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        py: 3,
        borderBottom: `2px solid ${COLORS.PRIMARY_PURPLE}`,
        mb: 4,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          mb: 2.5,
          color: isDark ? "text.primary" : "#1a1a2e",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 24,
            bgcolor: COLORS.PRIMARY_PURPLE,
            borderRadius: 1,
          }}
        />
        Explore Subcategories
      </Typography>
      
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        {subCategories.map((sub) => (
          <Chip
            key={sub.product_sub_category_id}
            onClick={() => handleSubCategoryClick(sub.product_sub_category_id)}
            label={sub.sub_category_name}
            sx={{
              px: 1,
              py: 2,
              height: "auto",
              borderRadius: "12px",
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fc",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0e4e8"}`,
              color: isDark ? "text.primary" : "#1a1a2e",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: "white",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(94, 24, 233, 0.3)",
              },
            }}
            avatar={
              sub.sub_category_image ? (
                <Avatar
                  src={sub.sub_category_image}
                  alt={sub.sub_category_name}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                  }}
                />
              ) : undefined
            }
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SubCategoryBar;
