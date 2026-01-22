import React from "react";
import { Box, Chip } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const {t} = useTranslate();
  return (
    <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
      <Chip
        label={t("all")}
        variant={selectedCategory === null ? "filled" : "outlined"}
        onClick={() => onCategorySelect(null)}
        clickable
      />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          variant={selectedCategory === category ? "filled" : "outlined"}
          onClick={() => onCategorySelect(category)}
          clickable
        />
      ))}
    </Box>
  );
};

export default CategoryFilter;
