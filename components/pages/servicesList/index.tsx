"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Paper, useTheme } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import MainLayout from "@/app/mainLayout";
import { serviceListService } from "../../../services/serviceList/serviceListService";
import { Service, Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import ServicesHeader from "./ServicesHeader";
import ServicesSearchBar from "./ServicesSearchBar";
import ServiceFilterDrawer from "./ServiceFilterDrawer";
import ServiceGrid from "./ServiceGrid";
import ServicesPagination from "./ServicesPagination";
import { useCategories } from "@/hooks/useCategories";
import { useTranslate } from "@/hooks/useTranslate";
import { Button } from "@mui/material";
import { Tune } from "@mui/icons-material";

const ListOfServices = () => {
    const { t } = useTranslate();
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
    const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
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
                    <Box
                        sx={{
                            mb: { xs: 3, sm: 4 },
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", md: "flex-end" },
                            gap: 2,
                        }}
                    >
                        <ServicesHeader />
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5, 
                            width: { xs: "100%", md: "auto" } 
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<Tune />}
                                onClick={() => setShowCategoriesPopup(true)}
                                sx={{
                                    borderRadius: "50px",
                                    height: 44,
                                    px: 2.5,
                                    color: COLORS.PRIMARY_PURPLE,
                                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    whiteSpace: "nowrap",
                                    minWidth: "fit-content",
                                    "&:hover": {
                                        bgcolor: COLORS.PURPLE_ALPHA_04,
                                        borderColor: COLORS.PRIMARY_PURPLE,
                                    }
                                }}
                            >
                                {t("filters")}
                            </Button>
                            <ServicesSearchBar
                                searchInput={searchInput}
                                onSearchChange={setSearchInput}
                                onSearchSubmit={handleSearchSubmit}
                            />
                        </Box>
                    </Box>

                    <ServiceFilterDrawer
                        categories={categories}
                        selectedCategory={selectedCategory}
                        loading={categoriesLoading}
                        onCategoryClick={handleCategoryClick}
                        open={showCategoriesPopup}
                        onClose={() => setShowCategoriesPopup(false)}
                    />

                    {/* Loading State */}
                    {loading ? (
                        <CenteredLoader py={{ xs: 6, sm: 10 }} size={60} />
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
