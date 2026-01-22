"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, CircularProgress, useTheme } from "@mui/material";
import Nav from "../../common/Nav";
import { serviceListService } from "../../../services/serviceList/serviceListService";
import { Service, Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import ServicesHeader from "./ServicesHeader";
import ServicesSearchBar from "./ServicesSearchBar";
import CategoryFilter from "./CategoryFilter";
import ServiceGrid from "./ServiceGrid";
import ServicesPagination from "./ServicesPagination";

const ListOfServices = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

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
                        <ServicesHeader />
                        <ServicesSearchBar
                            searchInput={searchInput}
                            onSearchChange={setSearchInput}
                            onSearchSubmit={handleSearchSubmit}
                        />
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
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
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
        </>
    );
};

export default ListOfServices;
