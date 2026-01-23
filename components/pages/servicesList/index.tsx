"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, CircularProgress, useTheme } from "@mui/material";
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
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    minHeight: "100vh",
                    pt: { xs: 2, sm: 4, md: 10 },
                    pb: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 1, sm: 2 },
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                    {/* Header Section */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        mb: { xs: 2, sm: 3 },
                        gap: { xs: 2, sm: 2 },
                    }}>
                        <ServicesHeader />
                        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: { xs: 1, sm: "none" } }}>
                            <ServicesSearchBar
                                searchInput={searchInput}
                                onSearchChange={setSearchInput}
                                onSearchSubmit={handleSearchSubmit}
                            />
                        </Box>
                    </Box>

                    {/* Categories Bar */}
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        loading={categoriesLoading}
                        onCategoryClick={handleCategoryClick}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 4, sm: 8 } }}>
                            <CircularProgress size={isDark ? 40 : 40} />
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
