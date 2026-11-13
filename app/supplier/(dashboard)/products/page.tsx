"use client";

import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    useTheme,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    alpha,
    Fade
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Sort as SortIcon
} from "@mui/icons-material";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierProducts } from "@/hooks/useSupplier";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductCard from "@/components/supplier/products/ProductCard";
import { COLORS } from "@/constants/colors";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function SupplierProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { t } = useTranslate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const { data, isLoading } = useSupplierProducts();

    // Initialize state from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "All Brands");

    // Sync state with URL when state changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        const currentQ = params.get("q") || "";
        const currentCat = params.get("category") || "All";
        const currentBrand = params.get("brand") || "All Brands";
        const currentSort = params.get("sort") || "newest";

        if (currentQ === searchQuery && currentCat === selectedCategory &&
            currentBrand === selectedBrand && currentSort === sortBy) {
            return;
        }

        if (searchQuery) params.set("q", searchQuery); else params.delete("q");
        if (selectedCategory !== "All") params.set("category", selectedCategory); else params.delete("category");
        if (selectedBrand !== "All Brands") params.set("brand", selectedBrand); else params.delete("brand");
        if (sortBy !== "newest") params.set("sort", sortBy); else params.delete("sort");

        const search = params.toString();
        const query = search ? `?${search}` : "";

        router.replace(`${pathname}${query}`, { scroll: false });
    }, [searchQuery, selectedCategory, selectedBrand, sortBy, pathname, router, searchParams]);

    // Handle initial load or browser back/forward
    useEffect(() => {
        const q = searchParams.get("q") || "";
        const cat = searchParams.get("category") || "All";
        const brand = searchParams.get("brand") || "All Brands";
        const sort = searchParams.get("sort") || "newest";

        if (q !== searchQuery) setSearchQuery(q);
        if (cat !== selectedCategory) setSelectedCategory(cat);
        if (brand !== selectedBrand) setSelectedBrand(brand);
        if (sort !== sortBy) setSortBy(sort);
    }, [searchParams]);

    // Logic to extract unique categories and brands for filters
    const products = useMemo(() => {
        const responseData = data?.data as any;
        if (!responseData) return [];
        if (Array.isArray(responseData)) return responseData;
        if (responseData.products && Array.isArray(responseData.products)) return responseData.products;
        return [];
    }, [data]);

    const categories = useMemo(() => {
        const uniqueCats = new Set<string>();
        products.forEach((p: any) => {
            if (p.category) uniqueCats.add(p.category);
            else if (p.product_category) uniqueCats.add(p.product_category);
            else uniqueCats.add("General");
        });
        return ["All", ...Array.from(uniqueCats)];
    }, [products]);

    const brands = useMemo(() => {
        const uniqueBrands = new Set<string>();
        products.forEach((p: any) => {
            const firstWord = p.product_name?.split(" ")[0];
            if (firstWord && firstWord.length > 2) uniqueBrands.add(firstWord);
        });
        return ["All Brands", ...Array.from(uniqueBrands)];
    }, [products]);


    const filteredProducts = useMemo(() => {
        return products.filter((p: any) => {
            const matchesSearch = p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku_number?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || (p.category === selectedCategory || p.product_category === selectedCategory);
            const matchesBrand = selectedBrand === "All Brands" || p.product_name?.startsWith(selectedBrand);
            return matchesSearch && matchesCategory && matchesBrand;
        }).sort((a: any, b: any) => {
            if (sortBy === "price_low") return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === "price_high") return parseFloat(b.price) - parseFloat(a.price);
            return 0; // default newest
        });
    }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

    const handleAddProduct = () => {
        router.push("/supplier/products/add");
    };

    const handleProductClick = (id: string) => {
        router.push(`/supplier/products/${id}`);
    };

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <LogoLoader />
        </Box>
    );

    return (
        <Box sx={{ pb: 8 }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    mb: 5,
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                <Box>
                    <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{
                            color: isDark ? "white" : COLORS.PRIMARY_PURPLE,
                            mb: 1
                        }}
                    >
                        My Catalog
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and showcase your product inventory
                    </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleAddProduct}
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: '12px',
                            px: 3,
                            py: 1.5,
                            boxShadow: `0 8px 16px ${alpha(COLORS.PRIMARY_PURPLE, 0.2)}`,
                            textTransform: 'none',
                            fontWeight: 700
                        }}
                    >
                        {t("addProduct") || "Add New Product"}
                    </Button>
                </motion.div>
            </Box>

            {/* Filter & Search Section */}
            <Box
                sx={{
                    bgcolor: isDark ? alpha(COLORS.BACKGROUND.SECONDARY_DARK, 0.4) : "white",
                    p: 3,
                    borderRadius: 4,
                    mb: 5,
                    boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.03)",
                    border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by name, SKU or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : COLORS.BACKGROUND.SECONDARY_LIGHT }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 1, mb: 0.5, display: 'block' }}>
                            Categories
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5, '::-webkit-scrollbar': { display: 'none' } }}>
                            {categories.map((cat: any) => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    sx={{
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        px: 1,
                                        bgcolor: selectedCategory === cat ? COLORS.PRIMARY_PURPLE : 'transparent',
                                        color: selectedCategory === cat ? "white" : "inherit",
                                        border: `1px solid ${selectedCategory === cat ? COLORS.PRIMARY_PURPLE : alpha(theme.palette.divider, 0.1)}`,
                                        "&:hover": {
                                            bgcolor: selectedCategory === cat ? COLORS.PURPLE_HOVER : alpha(COLORS.PRIMARY_PURPLE, 0.05)
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="brand-label">Brand</InputLabel>
                            <Select
                                labelId="brand-label"
                                value={selectedBrand}
                                label="Brand"
                                onChange={(e) => setSelectedBrand(e.target.value as string)}
                                sx={{ borderRadius: '12px' }}
                            >
                                {brands.map((brand: any) => (
                                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="sort-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-label"
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{ borderRadius: '12px' }}
                                startAdornment={<SortIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
                            >
                                <MenuItem value="newest">Latest Added</MenuItem>
                                <MenuItem value="price_low">Price: Low to High</MenuItem>
                                <MenuItem value="price_high">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Products Grid */}
            <AnimatePresence mode="popLayout">
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h5" color="text.secondary">
                                {t("noProductsFound") || "We couldn't find any products matching your search."}
                            </Typography>
                        </Box>
                    </motion.div>
                ) : (
                    <Grid container spacing={3}>
                        {filteredProducts.map((product: any, index: number) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.product_id || product.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: index * 0.05 }
                                    }}
                                >
                                    <ProductCard
                                        product={product}
                                        onClick={handleProductClick}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </AnimatePresence>
        </Box>
    );
}
