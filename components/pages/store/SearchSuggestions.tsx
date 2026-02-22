"use client";

import React from "react";
import { Box, Paper, Typography, Stack, Grid, useTheme } from "@mui/material";
import { Category } from "@/services/store/store.service";
import { Product } from "@/hooks/useSearchSuggestions";
import { COLORS } from "@/constants/colors";
import SuggestionCard from "./SuggestionCard";

interface SearchSuggestionsProps {
  isSearching: boolean;
  categories: Category[];
  products: Product[];
  searchQuery: string;
  onCategoryClick: (categoryId: string) => void;
  onProductClick: (productId: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  isSearching,
  categories,
  products,
  searchQuery,
  onCategoryClick,
  onProductClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000,
        mt: 1,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 850,
          maxHeight: 500,
          overflowY: "auto",
          borderRadius: "24px",
          mt: 1,
          bgcolor: isDark ? "rgba(20, 20, 20, 0.98)" : "white",
          backdropFilter: "blur(10px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0"}`,
          p: 2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {isSearching ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Searching...</Typography>
          </Box>
        ) : categories.length === 0 && products.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No results found for "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Categories Suggestions */}
            {categories.length > 0 && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    px: 2,
                    mb: 1,
                    display: "block",
                    color: COLORS.PRIMARY_PURPLE,
                    fontWeight: 800,
                  }}
                >
                  Categories
                </Typography>
                <Grid container spacing={1}>
                  {categories.map((cat) => (
                    <Grid
                      size={{ xs: 12, sm: 6 }}
                      key={cat.product_category_id}
                    >
                      <SuggestionCard
                        type="category"
                        data={cat}
                        onClick={() => onCategoryClick(cat.product_category_id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Products Suggestions */}
            {products.length > 0 && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    px: 2,
                    mb: 1,
                    display: "block",
                    color: COLORS.PRIMARY_PURPLE,
                    fontWeight: 800,
                  }}
                >
                  Products
                </Typography>
                <Stack spacing={1}>
                  {products.map((product) => (
                    <SuggestionCard
                      key={product.id}
                      type="product"
                      data={product}
                      onClick={() => onProductClick(product.id)}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default SearchSuggestions;
