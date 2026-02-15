"use client";

import React from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListItemIcon,
    Divider,
    Checkbox,
    FormControlLabel,
    useTheme,
    Stack,
    Paper,
} from "@mui/material";
import {
    Category as CategoryIcon,
    Apartment,
    Construction,
    Science,
    DirectionsCar,
    Checkroom,
    ElectricalServices,
    Star,
    FilterList,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Category } from "@/services/store/store.service";

interface CategorySidebarProps {
    selectedCategory: string | null;
    onSelectCategory: (id: string) => void;
    categories?: Category[];
    searchQuery?: string;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    selectedCategory,
    onSelectCategory,
    categories = [],
    searchQuery = "",
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const defaultCategories = [
        { id: "all", name: "All Categories", icon: <CategoryIcon /> },
    ];

    const businessTypes = [
        "Wholesaler",
        "Manufacturer",
        "Retailer",
        "Exporter",
    ];

    const priceRanges = [
        "Under ₹500",
        "₹500 - ₹1,000",
        "₹1,000 - ₹5,000",
        "₹5,000 - ₹10,000",
        "Over ₹10,000"
    ];

    return (
        <Box sx={{
            width: "100%",
            bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fcfdfe",
            borderRadius: 6,
            p: 3,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f2f5"}`
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FilterList sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5 }}>Filters</Typography>
                </Box>
                {(selectedCategory || searchQuery) && (
                    <Typography
                        variant="caption"
                        onClick={() => onSelectCategory("all")}
                        sx={{
                            color: COLORS.PRIMARY_PURPLE,
                            fontWeight: 700,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Reset All
                    </Typography>
                )}
            </Box>

            {/* Categories Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Categories
                </Typography>
                <List disablePadding>
                    {defaultCategories.concat(categories.map(cat => ({
                        id: cat.product_category_id,
                        name: cat.category_name,
                        icon: <CategoryIcon sx={{ fontSize: 18 }} />
                    }))).map((item) => (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.2 }}>
                            <ListItemButton
                                selected={selectedCategory === item.id}
                                onClick={() => onSelectCategory(item.id)}
                                sx={{
                                    borderRadius: 3,
                                    py: 1,
                                    transition: 'all 0.2s',
                                    "&.Mui-selected": {
                                        bgcolor: isDark ? "rgba(94, 24, 233, 0.15)" : `${COLORS.PRIMARY_PURPLE}08`,
                                        color: COLORS.PRIMARY_PURPLE,
                                        "&:hover": { bgcolor: isDark ? "rgba(94, 24, 233, 0.2)" : `${COLORS.PRIMARY_PURPLE}12` },
                                    },
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f5f7fa"
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 32,
                                        color: selectedCategory === item.id ? COLORS.PRIMARY_PURPLE : "text.secondary",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{
                                        variant: "body2",
                                        fontWeight: selectedCategory === item.id ? 800 : 500,
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            {/* Price Range Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Price Range
                </Typography>
                <Stack spacing={0.5}>
                    {priceRanges.map((range) => (
                        <FormControlLabel
                            key={range}
                            control={<Checkbox size="small" sx={{
                                color: isDark ? "rgba(255,255,255,0.1)" : "#dee2e6",
                                '&.Mui-checked': { color: COLORS.PRIMARY_PURPLE },
                                '& .MuiSvgIcon-root': { fontSize: 20 }
                            }} />}
                            label={<Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: isDark ? "text.primary" : "#444" }}>{range}</Typography>}
                            sx={{ m: 0, p: 0.5, borderRadius: 2, '&:hover': { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fa" } }}
                        />
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            {/* Business Type Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Expertise
                </Typography>
                <Stack spacing={0.5}>
                    {businessTypes.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox size="small" sx={{
                                color: isDark ? "rgba(255,255,255,0.1)" : "#dee2e6",
                                '&.Mui-checked': { color: COLORS.PRIMARY_PURPLE }
                            }} />}
                            label={<Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: isDark ? "text.primary" : "#444" }}>{type}</Typography>}
                            sx={{ m: 0, p: 0.5, borderRadius: 2, '&:hover': { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fa" } }}
                        />
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            {/* Rating Section */}
            <Box>
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Review Rating
                </Typography>
                <Stack spacing={0.5}>
                    {[4, 3, 2, 1].map((rating) => (
                        <FormControlLabel
                            key={rating}
                            control={<Checkbox size="small" sx={{
                                color: isDark ? "rgba(255,255,255,0.1)" : "#dee2e6",
                                '&.Mui-checked': { color: COLORS.PRIMARY_PURPLE }
                            }} />}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{rating}.0+</Typography>
                                    <Star sx={{ fontSize: 14, color: '#faaf00' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>(Verified)</Typography>
                                </Box>
                            }
                            sx={{ m: 0, p: 0.5, borderRadius: 2, '&:hover': { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f9fa" } }}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default CategorySidebar;
