"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { Category } from "@/services/serviceList/listInteraface";
import { Subcategory } from "@/services/subcategory/subcategoryInterface";
import { english } from "@/features/i18n/en";

const MAX_CATEGORIES = 3;
const MAX_SUBCATEGORIES = 6;

interface ServiceBasicInfoProps {
  categories: Category[];
  categoryIds: string[];
  onCategoryChange: (value: string[]) => void;
  subcategories: Subcategory[];
  subcategoryIds: string[];
  onSubcategoryChange: (value: string[]) => void;
  serviceName: string;
  onServiceNameChange: (value: string) => void;
  categoriesLoading: boolean;
  subcategoriesLoading: boolean;
  description: string;
  onDescriptionChange: (value: string) => void;
}

const ServiceBasicInfo = ({
  categories,
  categoryIds,
  onCategoryChange,
  subcategories,
  subcategoryIds,
  onSubcategoryChange,
  serviceName,
  onServiceNameChange,
  categoriesLoading,
  subcategoriesLoading,
  description,
  onDescriptionChange,
}: ServiceBasicInfoProps) => {
  // Get the selected Category objects from their IDs
  const selectedCategories = categories.filter((cat) =>
    categoryIds.includes(cat.id)
  );

  // Get the selected Subcategory objects from their IDs
  const selectedSubcategories = subcategories.filter((sub) =>
    subcategoryIds.includes(sub.id)
  );

  return (
    <>
      {/* Category — multi-select, max 3 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
          {english.select_category} (max {MAX_CATEGORIES})
          <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
        </Typography>
        <Autocomplete
          multiple
          size="small"
          options={categories}
          getOptionLabel={(option) => option.name}
          value={selectedCategories}
          onChange={(_event, newValue) => {
            if (newValue.length <= MAX_CATEGORIES) {
              onCategoryChange(newValue.map((cat) => cat.id));
            }
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={categoriesLoading}
          limitTags={3}
          disableCloseOnSelect
          getOptionDisabled={() =>
            selectedCategories.length >= MAX_CATEGORIES
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.name}
                size="small"
                {...getTagProps({ index })}
                key={option.id}
                sx={{
                  bgcolor: `${COLORS.PRIMARY_PURPLE}20`,
                  color: COLORS.PRIMARY_PURPLE,
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: COLORS.PRIMARY_PURPLE,
                    "&:hover": { color: COLORS.SECONDARY_ORANGE },
                  },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                selectedCategories.length === 0 ? english.select : ""
              }
            />
          )}
        />
      </Box>

      {/* Subcategory — multi-select, max 6 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
          {english.select_subcategory} (max {MAX_SUBCATEGORIES})
          <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
        </Typography>
        <Autocomplete
          multiple
          size="small"
          options={subcategories}
          getOptionLabel={(option) => option.name}
          value={selectedSubcategories}
          onChange={(_event, newValue) => {
            if (newValue.length <= MAX_SUBCATEGORIES) {
              onSubcategoryChange(newValue.map((sub) => sub.id));
            }
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={subcategoriesLoading}
          disabled={categoryIds.length === 0}
          limitTags={4}
          disableCloseOnSelect
          getOptionDisabled={() =>
            selectedSubcategories.length >= MAX_SUBCATEGORIES
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.name}
                size="small"
                {...getTagProps({ index })}
                key={option.id}
                sx={{
                  bgcolor: `${COLORS.PRIMARY_PURPLE}20`,
                  color: COLORS.PRIMARY_PURPLE,
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: COLORS.PRIMARY_PURPLE,
                    "&:hover": { color: COLORS.SECONDARY_ORANGE },
                  },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                selectedSubcategories.length === 0 ? english.select : ""
              }
              helperText={
                categoryIds.length === 0
                  ? english.select_subcategory_helper
                  : ""
              }
            />
          )}
        />
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
