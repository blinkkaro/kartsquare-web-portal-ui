"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Pagination,
    useTheme,
    Chip,
    InputAdornment,
    TextField,
    Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Nav from "../../../components/common/Nav";
import ServiceCard from "../../../components/ServiceCard";
import { serviceListService } from "../../../services/serviceList/serviceListService";
import { Service, Category } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import { getUserRole, getUserId, UserRole } from "../../../utils/auth";
import AddServiceDrawer from "./AddServiceDrawer";
import MainLayout from "@/app/mainLayout";

// Category icons mapping (you can expand this based on actual categories)
const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("health")) return "🏥";
    if (name.includes("fitness")) return "💪";
    if (name.includes("beauty")) return "💄";
    if (name.includes("sport")) return "⚽";
    if (name.includes("fashion")) return "👗";
    return "📋";
};

const ServiceProviderServicesList = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Get user role and ID
    const userRole = getUserRole();
    const userId = getUserId();

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
    }, [page, selectedCategory, search, userRole, userId]);

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
        // Trigger refetch by updating a dependency
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

    // Determine page title based on role
    const pageTitle = userRole === UserRole.SERVICE_PROVIDER
        ? "My Services"
        : "Services for you";

    return (
        <MainLayout>
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
                            {pageTitle}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                            {/* Search Bar */}
                            <Box
                                component="form"
                                onSubmit={handleSearchSubmit}
                                sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: "400px" }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search services..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                                        borderRadius: "12px",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                            "& fieldset": {
                                                borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                                            },
                                        },
                                    }}
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
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                        "&:hover": {
                                            bgcolor: COLORS.PURPLE_HOVER,
                                        },
                                    }}
                                >
                                    Add Service
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Categories Bar - Hidden for Service Providers */}
                    {userRole !== UserRole.SERVICE_PROVIDER && (
                        <Box sx={{
                            display: "flex",
                            gap: 1.5,
                            mb: 4,
                            overflowX: "auto",
                            pb: 1,
                            "&::-webkit-scrollbar": {
                                height: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                                borderRadius: "3px",
                            }
                        }}>
                            {categoriesLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <Chip
                                        label="All"
                                        onClick={() => handleCategoryClick(null)}
                                        sx={{
                                            borderRadius: "20px",
                                            px: 2,
                                            height: "36px",
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                            cursor: "pointer",
                                            bgcolor: selectedCategory === null
                                                ? COLORS.PRIMARY_PURPLE
                                                : (isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT),
                                            color: selectedCategory === null
                                                ? "white"
                                                : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                            border: `1px solid ${selectedCategory === null ? COLORS.PRIMARY_PURPLE : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)}`,
                                            "&:hover": {
                                                bgcolor: selectedCategory === null
                                                    ? COLORS.PURPLE_HOVER
                                                    : (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT),
                                            },
                                        }}
                                    />
                                    {categories.map((category) => (
                                        <Chip
                                            key={category.id}
                                            label={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <span>{getCategoryIcon(category.name)}</span>
                                                    <span>{category.name}</span>
                                                </Box>
                                            }
                                            onClick={() => handleCategoryClick(category.id)}
                                            sx={{
                                                borderRadius: "20px",
                                                px: 2,
                                                height: "36px",
                                                fontSize: "0.875rem",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                bgcolor: selectedCategory === category.id
                                                    ? COLORS.PRIMARY_PURPLE
                                                    : (isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT),
                                                color: selectedCategory === category.id
                                                    ? "white"
                                                    : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                                border: `1px solid ${selectedCategory === category.id ? COLORS.PRIMARY_PURPLE : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)}`,
                                                "&:hover": {
                                                    bgcolor: selectedCategory === category.id
                                                        ? COLORS.PURPLE_HOVER
                                                        : (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT),
                                                },
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </Box>
                    )}

                    {/* Results Count */}
                    {!loading && (
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
                            }}
                        >
                            {total} service{total !== 1 ? "s" : ""} found
                        </Typography>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : services.length === 0 ? (
                        /* Empty State */
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                    mb: 1
                                }}
                            >
                                {userRole === UserRole.SERVICE_PROVIDER
                                    ? "You haven't created any services yet"
                                    : "No services found"}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
                                }}
                            >
                                {userRole === UserRole.SERVICE_PROVIDER
                                    ? "Create your first service to get started"
                                    : "Try adjusting your filters or search query"}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Grid of Services */}
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(1, 1fr)",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                },
                                gap: 3,
                            }}>
                                {services.map((service) => (
                                    <ServiceCard key={service.service_id} service={service} />
                                ))}
                            </Box>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        sx={{
                                            "& .MuiPaginationItem-root": {
                                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                            },
                                            "& .Mui-selected": {
                                                bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                                                color: "white",
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
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

export default ServiceProviderServicesList;
