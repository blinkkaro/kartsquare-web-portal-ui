import React, { useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  useTheme,
  Slider,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { useGetProductSpecifications } from "@/hooks/useProducts";
import { product_specifications_option_type } from "@/services/product/product.interface";
import { COLORS } from "@/constants/colors";

const ProductSpecifications = () => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subCategoryId = watch("product_sub_category_id");
  const { data: specifications } = useGetProductSpecifications(subCategoryId);

  // Initialize specifications array when subcategory changes
  useEffect(() => {
    if (
      specifications &&
      Array.isArray(specifications) &&
      specifications.length > 0
    ) {
      const currentSpecs = watch("specifications") || [];

      // Map through backend specifications to ensure metadata is present for all
      const updatedSpecs = specifications.map((spec) => {
        const existingSpec = currentSpecs.find(
          (cs: any) =>
            cs.product_specifications_id === spec.product_specifications_id,
        );

        return {
          product_specifications_id: spec.product_specifications_id,
          product_specifications_entered_value:
            existingSpec?.product_specifications_entered_value || [],
          product_specifications_value_type:
            spec.product_specifications_option_type,
          product_specifications_is_required:
            spec.product_specifications_is_required,
          product_specifications_name: spec.product_specifications_name,
        };
      });

      // Simple comparison to avoid infinite update loops
      if (JSON.stringify(currentSpecs) !== JSON.stringify(updatedSpecs)) {
        setValue("specifications", updatedSpecs);
      }
    }
  }, [specifications, subCategoryId]);

  if (
    !specifications ||
    !Array.isArray(specifications) ||
    specifications.length === 0
  ) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle2" mb={1} fontWeight={500}>
        {t("other_specifications")}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
        {specifications.map((spec, index) => {
          const fieldName = `specifications.${index}.product_specifications_entered_value`;
          const isRequired = spec.product_specifications_is_required;
          const label =
            spec.product_specifications_name + (isRequired ? "*" : "");

          return (
            <Controller
              key={spec.product_specifications_id}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={
                    !!(errors.specifications as any)?.[index]
                      ?.product_specifications_entered_value
                  }
                >
                  <Typography variant="subtitle2" mb={1} fontWeight={500}>
                    {label}
                  </Typography>

                  {spec.product_specifications_option_type ===
                    product_specifications_option_type.TEXT && (
                    <TextField
                      {...field}
                      placeholder={t("Enter value" as any)}
                      fullWidth
                      value={
                        Array.isArray(field.value) ? field.value[0] || "" : ""
                      }
                      onChange={(e) => field.onChange([e.target.value])}
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
                  )}

                  {spec.product_specifications_option_type ===
                    product_specifications_option_type.DROPDOWN && (
                    <Select
                      {...field}
                      value={
                        Array.isArray(field.value) ? field.value[0] || "" : ""
                      }
                      onChange={(e) => field.onChange([e.target.value])}
                      displayEmpty
                      sx={{
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        borderRadius: "50rem",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PAPER_DARK
                          : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        height: "2.5rem",
                      }}
                    >
                      <MenuItem value="" disabled>
                        {t("Select option" as any)}
                      </MenuItem>
                      {Array.isArray(
                        spec.product_specifications_option_value,
                      ) &&
                        typeof spec.product_specifications_option_value[0] ===
                          "string" &&
                        (
                          spec.product_specifications_option_value as string[]
                        ).map((opt: string) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                    </Select>
                  )}

                  {spec.product_specifications_option_type ===
                    product_specifications_option_type.CHECKBOX && (
                    <Select
                      {...field}
                      multiple
                      value={Array.isArray(field.value) ? field.value : []}
                      renderValue={(selected: any) => selected.join(", ")}
                      displayEmpty
                      sx={{
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                        borderRadius: "50rem",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PAPER_DARK
                          : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        height: "2.5rem",
                      }}
                    >
                      {Array.isArray(
                        spec.product_specifications_option_value,
                      ) &&
                        typeof spec.product_specifications_option_value[0] ===
                          "string" &&
                        (
                          spec.product_specifications_option_value as string[]
                        ).map((opt: string) => (
                          <MenuItem key={opt} value={opt}>
                            <Checkbox
                              checked={(field.value || []).indexOf(opt) > -1}
                            />
                            <ListItemText primary={opt} />
                          </MenuItem>
                        ))}
                    </Select>
                  )}

                  {/* Range type - slider to select value within min/max */}
                  {spec.product_specifications_option_type ===
                    product_specifications_option_type.RANGE &&
                    (() => {
                      // Extract min/max from array structure: [{min, max}]
                      const rangeValue =
                        Array.isArray(
                          spec.product_specifications_option_value,
                        ) &&
                        spec.product_specifications_option_value.length > 0 &&
                        typeof spec.product_specifications_option_value[0] ===
                          "object"
                          ? (spec.product_specifications_option_value[0] as {
                              min?: number;
                              max?: number;
                            })
                          : null;

                      const minValue = rangeValue?.min ?? 0;
                      const maxValue = rangeValue?.max ?? 100;
                      const currentValue =
                        Array.isArray(field.value) && field.value[0]
                          ? Number(field.value[0])
                          : minValue;

                      return (
                        <Box sx={{ px: 1 }}>
                          {/* Display current value */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {minValue}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary"
                            >
                              {currentValue}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {maxValue}
                            </Typography>
                          </Box>
                          {/* Slider */}
                          <Slider
                            value={currentValue}
                            onChange={(_, newValue) => {
                              field.onChange([String(newValue)]);
                            }}
                            min={minValue}
                            max={maxValue}
                            valueLabelDisplay="auto"
                            sx={{
                              color: isDark
                                ? COLORS.ACCENT_BLUE_DARK
                                : COLORS.PRIMARY_PURPLE,
                              "& .MuiSlider-thumb": {
                                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                              },
                            }}
                          />
                        </Box>
                      );
                    })()}

                  {/* Date type */}
                  {spec.product_specifications_option_type ===
                    product_specifications_option_type.DATE && (
                    <TextField
                      {...field}
                      type="date"
                      placeholder={t("enter_value")}
                      fullWidth
                      value={
                        Array.isArray(field.value) ? field.value[0] || "" : ""
                      }
                      onChange={(e) => field.onChange([e.target.value])}
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
                  )}

                  {(errors.specifications as any)?.[index]
                    ?.product_specifications_entered_value?.message && (
                    <FormHelperText error>
                      {
                        (errors.specifications as any)[index]
                          .product_specifications_entered_value.message
                      }
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ProductSpecifications;
