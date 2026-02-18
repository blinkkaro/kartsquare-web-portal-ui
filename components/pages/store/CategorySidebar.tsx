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
    Collapse,
} from "@mui/material";
import {
    Category as CategoryIcon,
    FilterList,
    ExpandMore,
    ExpandLess,
    RadioButtonUnchecked,
    CheckCircle,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Category, SubCategory } from "@/services/store/store.service";

interface CategorySidebarProps {
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
    selectedSubCategory: string | null;
    onSelectSubCategory: (id: string | null) => void;
    categories?: Category[];
    searchQuery?: string;
    selectedBusinessTypes: string[];
    onToggleBusinessType: (type: string) => void;
    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    selectedCategory,
    onSelectCategory,
    selectedSubCategory,
    onSelectSubCategory,
    categories = [],
    searchQuery = "",
    selectedBusinessTypes,
    onToggleBusinessType,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const businessTypes = ["Wholesaler", "Manufacturer", "Retailer", "Exporter"];

    const handleReset = () => {
        onSelectCategory(null);
        onSelectSubCategory(null);
    };

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "white",
                borderRadius: "24px",
                p: { xs: 1.5, md: 2 },
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#eef2f6"}`,
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.02)",
                position: "sticky",
                top: 100,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            bgcolor: `${COLORS.PRIMARY_PURPLE}15`,
                            p: 1,
                            borderRadius: "12px",
                            display: "flex",
                        }}
                    >
                        <FilterList sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
                        Filters
                    </Typography>
                </Box>
                {(selectedCategory || selectedSubCategory || searchQuery) && (
                    <Typography
                        variant="caption"
                        onClick={handleReset}
                        sx={{
                            color: COLORS.PRIMARY_PURPLE,
                            fontWeight: 700,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Reset All
                    </Typography>
                )}
            </Box>

            {/* Categories Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="caption"
                    sx={{
                        mb: 2,
                        display: "block",
                        color: "text.secondary",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                        fontSize: "0.7rem",
                    }}
                >
                    Product Categories
                </Typography>
                <List disablePadding>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            selected={!selectedCategory}
                            onClick={() => onSelectCategory(null)}
                            sx={{
                                borderRadius: "12px",
                                py: 1,
                                transition: "all 0.2s",
                                "&.Mui-selected": {
                                    bgcolor: isDark
                                        ? "rgba(94, 24, 233, 0.15)"
                                        : `${COLORS.PRIMARY_PURPLE}08`,
                                    color: COLORS.PRIMARY_PURPLE,
                                    "& .MuiListItemIcon-root": { color: COLORS.PRIMARY_PURPLE },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <CategoryIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="All Products"
                                primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: !selectedCategory ? 800 : 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>

                    {categories.map((cat) => {
                        const isExpanded = selectedCategory === cat.product_category_id;
                        return (
                            <React.Fragment key={cat.product_category_id}>
                                <ListItem disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                        selected={isExpanded && !selectedSubCategory}
                                        onClick={() => onSelectCategory(cat.product_category_id)}
                                        sx={{
                                            borderRadius: "12px",
                                            py: 1,
                                            transition: "all 0.2s",
                                            "&.Mui-selected": {
                                                bgcolor: isDark
                                                    ? "rgba(94, 24, 233, 0.15)"
                                                    : `${COLORS.PRIMARY_PURPLE}08`,
                                                color: COLORS.PRIMARY_PURPLE,
                                                "& .MuiListItemIcon-root": {
                                                    color: COLORS.PRIMARY_PURPLE,
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Box
                                                component="img"
                                                src={cat.category_image}
                                                alt={cat.category_name}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "6px",
                                                    objectFit: "cover",
                                                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f8f9fa"
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={cat.category_name}
                                            primaryTypographyProps={{
                                                variant: "body2",
                                                fontWeight: isExpanded ? 800 : 500,
                                            }}
                                        />
                                        {cat.sub_categories.length > 0 && (
                                            isExpanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />
                                        )}
                                    </ListItemButton>
                                </ListItem>

                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List disablePadding sx={{ ml: 4, mb: 1 }}>
                                        {cat.sub_categories.map((sub) => (
                                            <ListItem key={sub.product_sub_category_id} disablePadding>
                                                <ListItemButton
                                                    selected={selectedSubCategory === sub.product_sub_category_id}
                                                    onClick={() => onSelectSubCategory(sub.product_sub_category_id)}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        py: 0.8,
                                                        my: 0.2,
                                                        "&.Mui-selected": {
                                                            bgcolor: "transparent",
                                                            color: COLORS.PRIMARY_PURPLE,
                                                            "& .dot": {
                                                                bgcolor: COLORS.PRIMARY_PURPLE,
                                                                transform: "scale(1.2)",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        className="dot"
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: "50%",
                                                            bgcolor: "text.disabled",
                                                            mr: 2,
                                                            transition: "all 0.2s",
                                                        }}
                                                    />
                                                    <ListItemText
                                                        primary={sub.sub_category_name}
                                                        primaryTypographyProps={{
                                                            variant: "caption",
                                                            fontWeight: selectedSubCategory === sub.product_sub_category_id ? 700 : 500,
                                                            fontSize: "0.8rem",
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        );
                    })}
                </List>
            </Box>

            <Divider sx={{ mb: 4, opacity: 0.5 }} />

            {/* Business Type Section */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="caption"
                    sx={{
                        mb: 2,
                        display: "block",
                        color: "text.secondary",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                        fontSize: "0.7rem",
                    }}
                >
                    Business Type
                </Typography>
                <Stack spacing={0.5}>
                    {businessTypes.map((type) => {
                        const isSelected = selectedBusinessTypes.includes(type);
                        return (
                            <Box
                                key={type}
                                onClick={() => onToggleBusinessType(type)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 1.2,
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    bgcolor: isSelected
                                        ? isDark
                                            ? "rgba(94, 24, 233, 0.1)"
                                            : `${COLORS.PRIMARY_PURPLE}05`
                                        : "transparent",
                                    "&:hover": {
                                        bgcolor: isDark
                                            ? "rgba(255, 255, 255, 0.05)"
                                            : "rgba(0, 0, 0, 0.02)",
                                    },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? COLORS.PRIMARY_PURPLE : "text.primary",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {type}
                                </Typography>
                                {isSelected ? (
                                    <CheckCircle sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
                                ) : (
                                    <RadioButtonUnchecked
                                        sx={{ fontSize: 18, color: "text.disabled", opacity: 0.5 }}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
        </Box>
    );
};

export default CategorySidebar;

