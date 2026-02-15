import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormHelperText,
  useTheme,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { useGetCategories, useGetSubCategories } from "@/hooks/useProducts";
import { COLORS } from "@/constants/colors";

const ProductCategorySelect = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const categoryId = watch("product_category_id");
  const subCategoryId = watch("product_sub_category_id");

  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState("");
  const [debouncedSubCategorySearch, setDebouncedSubCategorySearch] =
    useState("");

  // Debounce category search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategorySearch(categorySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [categorySearch]);

  // Debounce subcategory search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSubCategorySearch(subCategorySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [subCategorySearch]);

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategories(
    debouncedCategorySearch,
  );
  const { data: subCategories, isLoading: isSubCategoriesLoading } =
    useGetSubCategories(categoryId, debouncedSubCategorySearch);

  // Reset subcategory and brand when category changes
  useEffect(() => {
    setValue("product_sub_category_id", "");
    setValue("product_brand_id", "");
  }, [categoryId, setValue]);

  // Reset brand when subcategory changes
  useEffect(() => {
    setValue("product_brand_id", "");
  }, [subCategoryId, setValue]);

  return (
    <Box>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
        <Controller
          name="product_category_id"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Box>
              <Typography variant="subtitle2" mb={1} fontWeight={500}>
                {t("select_category") + "*"}
              </Typography>
              <Autocomplete
                {...field}
                value={
                  categories?.find(
                    (cat) => cat.product_category_id === value,
                  ) || null
                }
                onChange={(_, newValue) => {
                  onChange(newValue?.product_category_id || "");
                }}
                onInputChange={(_, newInputValue) => {
                  setCategorySearch(newInputValue);
                }}
                options={categories || []}
                getOptionLabel={(option) => option.category_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.product_category_id === value?.product_category_id
                }
                loading={isCategoriesLoading}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("select_category")}
                    error={!!errors.product_category_id}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        borderRadius: "50rem",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PAPER_DARK
                          : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        height: "2.5rem",
                        paddingY: 0,
                      },
                    }}
                  />
                )}
              />
              {errors.product_category_id && (
                <FormHelperText error sx={{ ml: 2 }}>
                  {errors.product_category_id?.message as string}
                </FormHelperText>
              )}
            </Box>
          )}
        />

        <Controller
          name="product_sub_category_id"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Box>
              <Typography variant="subtitle2" mb={1} fontWeight={500}>
                {t("select_subcategory") + "*"}
              </Typography>
              <Autocomplete
                {...field}
                value={
                  subCategories?.find(
                    (sub) => sub.product_sub_category_id === value,
                  ) || null
                }
                onChange={(_, newValue) => {
                  onChange(newValue?.product_sub_category_id || "");
                }}
                onInputChange={(_, newInputValue) => {
                  setSubCategorySearch(newInputValue);
                }}
                options={subCategories || []}
                getOptionLabel={(option) => option.sub_category_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.product_sub_category_id ===
                  value?.product_sub_category_id
                }
                disabled={!categoryId}
                loading={isSubCategoriesLoading}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("select_type")}
                    error={!!errors.product_sub_category_id}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        borderRadius: "50rem",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PAPER_DARK
                          : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        height: "2.5rem",
                        paddingY: 0,
                      },
                    }}
                  />
                )}
              />
              {errors.product_sub_category_id && (
                <FormHelperText error sx={{ ml: 2 }}>
                  {errors.product_sub_category_id?.message as string}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default ProductCategorySelect;
