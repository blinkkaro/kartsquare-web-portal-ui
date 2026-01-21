"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Pagination,
  useTheme,
} from "@mui/material";
import Nav from "@/components/common/Nav";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { Service, Category } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ServicesTable from "./components/ServicesTable";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";

const ServicesListView = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  // State
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await serviceListService.getCategories();
        setCategories(data.filter(cat => !cat.is_deleted));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const filters = {
          page,
          limit,
          ...(selectedCategory && { category_id: selectedCategory }),
          ...(search && { search }),
        };

        const data = await serviceListService.getServices(filters);
        setServices(data.services);
        setTotalPages(data.pagination.total_pages);
        setTotal(data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, selectedCategory, search]);

  const handleCategoryClick = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Nav />
      <Box
        sx={{
          bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
          minHeight: "100vh",
          pt: 10,
          pb: 4
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2
          }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT
              }}
            >
              {t("services_for_you")}
            </Typography>

            <SearchBar
              searchInput={searchInput}
              onSearchInputChange={handleSearchInputChange}
              onSearchSubmit={handleSearchSubmit}
            />
          </Box>

          {/* Categories Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            loading={categoriesLoading}
            onCategoryClick={handleCategoryClick}
          />

          {/* Services Grid */}
          <ServicesTable services={services} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                  },
                  "& .Mui-selected": {
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: "white",
                    "&:hover": {
                      bgcolor: COLORS.PURPLE_HOVER,
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Results Summary */}
          {!loading && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              >
                {`Showing ${total} results (Page ${page} of ${totalPages})`}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ServicesListView;