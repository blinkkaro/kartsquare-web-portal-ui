"use client";
import React from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { Category } from "@/services/serviceList/listInteraface";
import { Subcategory } from "@/services/subcategory/subcategoryInterface";
import { english } from "@/features/i18n/en";

interface ServiceBasicInfoProps {
    categories: Category[];
    categoryId: string;
    onCategoryChange: (value: string) => void;
    subcategories: Subcategory[];
    subcategoryId: string;
    onSubcategoryChange: (value: string) => void;
    serviceName: string;
    onServiceNameChange: (value: string) => void;
    price: string;
    onPriceChange: (value: string) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
    categoriesLoading: boolean;
    subcategoriesLoading: boolean;
}

const ServiceBasicInfo = ({
    categories,
    categoryId,
    onCategoryChange,
    subcategories,
    subcategoryId,
    onSubcategoryChange,
    serviceName,
    onServiceNameChange,
    price,
    onPriceChange,
    description,
    onDescriptionChange,
    categoriesLoading,
    subcategoriesLoading,
}: ServiceBasicInfoProps) => {
    return (
        <>
            {/* Category */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.select_category}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <TextField
                    select
                    fullWidth
                    size="small"
                    value={categoryId}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    disabled={categoriesLoading}
                    placeholder={english.select}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Subcategory */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.select_subcategory}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <TextField
                    select
                    fullWidth
                    size="small"
                    value={subcategoryId}
                    onChange={(e) => onSubcategoryChange(e.target.value)}
                    disabled={!categoryId || subcategoriesLoading}
                    placeholder={english.select}
                    helperText={!categoryId ? english.select_subcategory_helper : ""}
                >
                    {subcategories.map((subcat) => (
                        <MenuItem key={subcat.id} value={subcat.id}>
                            {subcat.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Service Name */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.service_name}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={serviceName}
                    onChange={(e) => onServiceNameChange(e.target.value)}
                    placeholder={english.enter_service_name}
                />
            </Box>

            {/* Price */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.price_inr}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={price}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if (val === '' || (parseFloat(val) <= 10000 && (val.match(/\./g) || []).length <= 1)) {
                            onPriceChange(val);
                        }
                    }}
                    placeholder={english.enter_price}
                />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {english.description}
                    <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder={english.write_here}
                />
            </Box>
        </>
    );
};

export default ServiceBasicInfo;
