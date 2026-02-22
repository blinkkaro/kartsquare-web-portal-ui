"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { KeyboardArrowRight } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Category } from "@/services/store/store.service";
import { Product } from "@/hooks/useSearchSuggestions";

interface SuggestionCardProps {
  type: "category" | "product";
  data: Category | Product;
  onClick: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  type,
  data,
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (type === "category") {
    const cat = data as Category;
    return (
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.5,
          borderRadius: "16px",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(94, 24, 233, 0.05)",
            transform: "translateX(8px)",
          },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            overflow: "hidden",
            bgcolor: "white",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={cat.category_image}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={700}>
            {cat.category_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {cat.sub_categories?.length || 0} Departments
          </Typography>
        </Box>
        <KeyboardArrowRight sx={{ ml: "auto", color: "text.disabled" }} />
      </Box>
    );
  }

  const product = data as Product;
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(94, 24, 233, 0.05)",
          transform: "translateX(8px)",
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "white",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={product.image}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight={700} noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color={COLORS.PRIMARY_PURPLE}
          fontWeight={800}
        >
          {product.price}
        </Typography>
      </Box>
      <KeyboardArrowRight sx={{ ml: "auto", color: "text.disabled" }} />
    </Box>
  );
};

export default SuggestionCard;
