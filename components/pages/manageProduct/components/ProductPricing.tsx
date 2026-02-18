import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  useTheme,
  Autocomplete,
  TextField,
} from "@mui/material";
import Input from "@/components/common/Input";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { useGetBrands } from "@/hooks/useProducts";
import { Info, InfoOutline } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { countries } from "./data";

const ProductPricing = () => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const { t } = useTranslate();
  const subCategoryId = watch("product_sub_category_id");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [brandSearch, setBrandSearch] = useState("");
  const [debouncedBrandSearch, setDebouncedBrandSearch] = useState("");

  // Debounce brand search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBrandSearch(brandSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [brandSearch]);

  const { data: brands, isLoading: isBrandsLoading } = useGetBrands(
    subCategoryId,
    debouncedBrandSearch,
  );

  return (
    <Box>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            {t("price") + "*"}
          </Typography>
          <Box display="flex" gap={0.5} alignItems="flex-start">
            {/* Currency Dropdown */}
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  displayEmpty
                  error={!!errors.currency}
                  sx={{
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                    borderRadius: "50rem",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    height: "2.5rem",
                    width: "6rem",
                    flexShrink: 0,
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("select_currency")}
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.currency} value={country.currency}>
                      {country.currency} {country.flag}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {/* Price Field */}
            <Box flex={1}>
              <Input
                placeholder={"100"}
                type="number"
                name="price"
                control={control}
                InputProps={{
                  sx: {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                    borderRadius: "50rem",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                  },
                }}
              />
            </Box>
          </Box>
          {errors.currency && (
            <FormHelperText error sx={{ ml: 1 }}>
              {errors.currency?.message as string}
            </FormHelperText>
          )}
        </Box>

        {/* Brand Dropdown */}
        <Controller
          name="product_brand_id"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Box>
              <Typography variant="subtitle2" mb={1} fontWeight={500}>
                {t("select_brand")}
              </Typography>
              <Autocomplete
                {...field}
                value={
                  brands?.find((brand) => brand.product_brand_id === value) ||
                  null
                }
                onChange={(_, newValue) => {
                  onChange(newValue?.product_brand_id || "");
                }}
                onInputChange={(_, newInputValue) => {
                  setBrandSearch(newInputValue);
                }}
                options={brands || []}
                getOptionLabel={(option) => option.brand_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.product_brand_id === value?.product_brand_id
                }
                disabled={!subCategoryId}
                loading={isBrandsLoading}
                filterOptions={(x) => x}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("select_brand")}
                    error={!!errors.product_brand_id}
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
              {errors.product_brand_id && (
                <FormHelperText error sx={{ ml: 2 }}>
                  {errors.product_brand_id?.message as string}
                </FormHelperText>
              )}
            </Box>
          )}
        />

        {/* Is Returnable Checkbox */}
        <Controller
          name="is_returnable"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.is_returnable}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value || false}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": {
                        color: "primary.main",
                      },
                    }}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {t("product_is_returnable")}
                    </Typography>
                    <InfoOutline
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                        color: isDark
                          ? COLORS.ACCENT_BLUE_DARK
                          : COLORS.PRIMARY_PURPLE,
                      }}
                    />
                  </Box>
                }
              />
              <FormHelperText>
                {errors.is_returnable?.message as string}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Box>
    </Box>
  );
};

export default ProductPricing;
