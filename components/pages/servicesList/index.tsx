"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, CircularProgress, Paper, useTheme } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { serviceListService } from "../../../services/serviceList/serviceListService";
import { Service, Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import ServicesHeader from "./ServicesHeader";
import ServicesSearchBar from "./ServicesSearchBar";
import CategoryFilter from "./CategoryFilter";
import ServiceGrid from "./ServiceGrid";
import ServicesPagination from "./ServicesPagination";
import { useCategories } from "@/hooks/useCategories";

const ListOfServices = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const surfaceBg = isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT;
    const borderColor = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;

    // State
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 12;

    // Use TanStack Query hook for categories
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

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

    const handleCategoryClick = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        setPage(1); // Reset to first page when category changes
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1); // Reset to first page when searching
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <MainLayout>
            <Box
                sx={{
                    bgcolor: surfaceBg,
                    minHeight: "100vh",
                    pt: { xs: 2, sm: 4, md: 6 },
                    pb: { xs: 3, sm: 4, md: 5 },
                    px: { xs: 1, sm: 2 },
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                    {/* Header + Search in a card */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            mb: { xs: 2, sm: 3 },
                            borderRadius: 3,
                            border: `1px solid ${borderColor}`,
                            bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: { xs: "stretch", sm: "center" },
                                gap: 2,
                            }}
                        >
                            <ServicesHeader />
                            <Box sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}>
                                <ServicesSearchBar
                                    searchInput={searchInput}
                                    onSearchChange={setSearchInput}
                                    onSearchSubmit={handleSearchSubmit}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    {/* Categories */}
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        loading={categoriesLoading}
                        onCategoryClick={handleCategoryClick}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 6, sm: 10 } }}>
                            <CircularProgress size={44} sx={{ color: COLORS.PRIMARY_PURPLE }} />
                        </Box>
                    ) : (
                        <>
                            {/* Service Grid */}
                            <ServiceGrid services={services} total={total} />

                            {/* Pagination */}
                            <ServicesPagination
                                totalPages={totalPages}
                                currentPage={page}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </Container>
            </Box>
        </MainLayout>
    );
};

export default ListOfServices;
