"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    useTheme,
    Button,
} from "@mui/material";
import Nav from "../../../common/Nav";
import { serviceListService } from "../../../../services/serviceList/serviceListService";
import { Service, Category } from "../../../../services/serviceList/listInteraface";
import { COLORS } from "../../../../constants/colors";
import { getUserRole, UserRole } from "../../../../utils/auth";
import AddServiceDrawer from "../addService";
import { english } from "../../../../features/i18n/en";
import ProviderServicesHeader from "./ProviderServicesHeader";
import ProviderServicesSearchBar from "./ProviderServicesSearchBar";
import ProviderCategoriesBar from "./ProviderCategoriesBar";
import ProviderServicesGrid from "./ProviderServicesGrid";
import MainLayout from "@/app/mainLayout";

const ProviderServicesList = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Get user role
    const userRole = getUserRole();

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
    const [addServiceDrawerOpen, setAddServiceDrawerOpen] = useState(false);

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
                let data;
                if (userRole === UserRole.SERVICE_PROVIDER) {
                    data = await serviceListService.getProviderServices({
                        search: search
                    });
                } else {
                    const filters: any = {
                        page,
                        limit,
                        ...(selectedCategory && { category_id: selectedCategory }),
                        ...(search && { search }),
                    };
                    data = await serviceListService.getServices(filters);
                }

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
    }, [page, selectedCategory, search, userRole]);

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

    const handleServiceAdded = () => {
        // Refresh services list after adding a new service
        setPage(1);
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await serviceListService.getProviderServices({ search });
                setServices(data.services);
                setTotalPages(data.pagination.total_pages);
                setTotal(data.pagination.total);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    };

    return (
        <MainLayout>
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
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
                        <ProviderServicesHeader />

                        <Box sx={{ 
                            display: "flex", 
                            gap: { xs: 1, sm: 2 }, 
                            alignItems: "center", 
                            width: { xs: "100%", sm: "auto" },
                            flexDirection: { xs: "column", sm: "row" },
                        }}>
                            {/* Search Bar */}
                            <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: { xs: 1, sm: "none" } }}>
                                <ProviderServicesSearchBar
                                    searchInput={searchInput}
                                    onSearchInputChange={setSearchInput}
                                    onSearchSubmit={handleSearchSubmit}
                                />
                            </Box>

                            {/* Add Service Button - Only for Service Providers */}
                            {userRole === UserRole.SERVICE_PROVIDER && (
                                <Button
                                    variant="contained"
                                    onClick={() => setAddServiceDrawerOpen(true)}
                                    sx={{
                                        bgcolor: COLORS.PRIMARY_PURPLE,
                                        color: "white",
                                        borderRadius: { xs: "8px", sm: "12px" },
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 0.75, sm: 1 },
                                        textTransform: "none",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                        fontSize: { xs: "0.875rem", sm: "1rem" },
                                        width: { xs: "100%", sm: "auto" },
                                        "&:hover": {
                                            bgcolor: COLORS.PURPLE_HOVER,
                                        },
                                    }}
                                >
                                    {english.add_service}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Categories Bar - Hidden for Service Providers */}
                    {userRole !== UserRole.SERVICE_PROVIDER && (
                        <ProviderCategoriesBar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            categoriesLoading={categoriesLoading}
                            onCategoryClick={handleCategoryClick}
                        />
                    )}

                    {/* Results Count */}
                    {!loading && (
                        <Typography
                            variant="body2"
                            sx={{
                                mb: { xs: 1.5, sm: 2 },
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                        >
                            {total} {english.services_found}
                        </Typography>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 4, sm: 8 } }}>
                            <CircularProgress size={isDark ? 40 : 40} />
                        </Box>
                    ) : (
                        <ProviderServicesGrid
                            services={services}
                            totalPages={totalPages}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </Container>
            </Box>

            {/* Add Service Drawer */}
            <AddServiceDrawer
                open={addServiceDrawerOpen}
                onClose={() => setAddServiceDrawerOpen(false)}
                onSuccess={handleServiceAdded}
            /> 
        </MainLayout>
    );
};

export default ProviderServicesList;
