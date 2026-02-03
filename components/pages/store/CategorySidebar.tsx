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
    Paper,
} from "@mui/material";
import {
    Category,
    Apartment,
    Construction,
    Science,
    DirectionsCar,
    Checkroom,
    ElectricalServices,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface CategorySidebarProps {
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    const categories = [
        { id: "all", name: "All Categories", icon: <Category /> },
        { id: "electronics", name: "Electronics & Electrical", icon: <ElectricalServices /> },
        { id: "machinery", name: "Industrial Machinery", icon: <Construction /> },
        { id: "textiles", name: "Apparel & Textiles", icon: <Checkroom /> },
        { id: "chemicals", name: "Chemicals & Dyes", icon: <Science /> },
        { id: "automotive", name: "Automotive Parts", icon: <DirectionsCar /> },
        { id: "building", name: "Building & Construction", icon: <Apartment /> },
    ];

    const businessTypes = [
        "Wholesaler",
        "Manufacturer",
        "Retailer",
        "Exporter",
    ];

    return (
        <Box sx={{ width: "100%" }}>
            {/* Categories Section */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Categories
                </Typography>
                <List disablePadding>
                    {categories.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={selectedCategory === item.id}
                                onClick={() => onSelectCategory(item.id)}
                                sx={{
                                    borderRadius: 1,
                                    "&.Mui-selected": {
                                        bgcolor: `${COLORS.PRIMARY_PURPLE}15`,
                                        color: COLORS.PRIMARY_PURPLE,
                                        "&:hover": { bgcolor: `${COLORS.PRIMARY_PURPLE}25` },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: selectedCategory === item.id ? COLORS.PRIMARY_PURPLE : "text.secondary",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{
                                        variant: "body2",
                                        fontWeight: selectedCategory === item.id ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Filters Section (Visual Only) */}
            <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Business Type
                </Typography>
                {businessTypes.map((type) => (
                    <FormControlLabel
                        key={type}
                        control={<Checkbox size="small" />}
                        label={<Typography variant="body2">{type}</Typography>}
                        sx={{ display: "block", mb: 0.5 }}
                    />
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    GST Filter
                </Typography>
                <FormControlLabel
                    control={<Checkbox size="small" />}
                    label={<Typography variant="body2">GST Registered Only</Typography>}
                />
            </Paper>
        </Box>
    );
};

export default CategorySidebar;
