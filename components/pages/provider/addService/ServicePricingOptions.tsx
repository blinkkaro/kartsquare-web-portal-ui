"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";

export type PricingType = "single" | "catalog" | "multiple";

interface ServicePricingOptionsProps {
  pricingType: PricingType;
  onPricingTypeChange: (value: PricingType) => void;
  /** Display names of selected catalog files (supports multiple) */
  priceCatalogFileNames: string[];
  onCatalogFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCatalogFile: (index: number) => void;
  onClearCatalog: () => void;
  priceItems: Array<{ name: string; price: string; description: string }>;
  onAddPriceItem: () => void;
  onRemovePriceItem: (index: number) => void;
  onUpdatePriceItem: (
    index: number,
    field: "name" | "price" | "description",
    value: string,
  ) => void;
  price: string;
  onPriceChange: (value: string) => void;
  errors?: Record<string, string>;
}

const ServicePricingOptions: React.FC<ServicePricingOptionsProps> = ({
  pricingType,
  onPricingTypeChange,
  priceCatalogFileNames,
  onCatalogFileSelect,
  onRemoveCatalogFile,
  onClearCatalog,
  priceItems,
  onAddPriceItem,
  onRemovePriceItem,
  onUpdatePriceItem,
  price,
  onPriceChange,
  errors,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
        {english.pricing_options}
      </Typography>

      <FormControl component="fieldset" sx={{ width: "100%", mb: 2 }}>
        <RadioGroup
          row
          value={pricingType}
          onChange={(e) => onPricingTypeChange(e.target.value as PricingType)}
          sx={{ gap: 1, flexWrap: "wrap" }}
        >
          <Paper
            variant="outlined"
            sx={{
              flex: "1 1 140px",
              minWidth: 140,
              p: 1.5,
              borderRadius: 2,
              border: `2px solid ${pricingType === "single" ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              bgcolor:
                pricingType === "single"
                  ? isDark
                    ? COLORS.PURPLE_ALPHA_10
                    : COLORS.PURPLE_ALPHA_04
                  : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                bgcolor: isDark
                  ? COLORS.PURPLE_ALPHA_10
                  : COLORS.PURPLE_ALPHA_04,
              },
            }}
            onClick={() => onPricingTypeChange("single")}
          >
            <FormControlLabel
              value="single"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                  }}
                />
              }
              label=""
              sx={{ m: 0, width: "100%" }}
            />
            <Typography variant="body2" fontWeight={600} sx={{ mt: -0.5 }}>
              {english.pricing_single}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {english.pricing_single_desc}
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              flex: "1 1 140px",
              minWidth: 140,
              p: 1.5,
              borderRadius: 2,
              border: `2px solid ${pricingType === "catalog" ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              bgcolor:
                pricingType === "catalog"
                  ? isDark
                    ? COLORS.PURPLE_ALPHA_10
                    : COLORS.PURPLE_ALPHA_04
                  : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                bgcolor: isDark
                  ? COLORS.PURPLE_ALPHA_10
                  : COLORS.PURPLE_ALPHA_04,
              },
            }}
            onClick={() => onPricingTypeChange("catalog")}
          >
            <FormControlLabel
              value="catalog"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                  }}
                />
              }
              label=""
              sx={{ m: 0, width: "100%" }}
            />
            <Typography variant="body2" fontWeight={600} sx={{ mt: -0.5 }}>
              {english.pricing_catalog}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {english.pricing_catalog_desc}
            </Typography>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              flex: "1 1 140px",
              minWidth: 140,
              p: 1.5,
              borderRadius: 2,
              border: `2px solid ${pricingType === "multiple" ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              bgcolor:
                pricingType === "multiple"
                  ? isDark
                    ? COLORS.PURPLE_ALPHA_10
                    : COLORS.PURPLE_ALPHA_04
                  : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                bgcolor: isDark
                  ? COLORS.PURPLE_ALPHA_10
                  : COLORS.PURPLE_ALPHA_04,
              },
            }}
            onClick={() => onPricingTypeChange("multiple")}
          >
            <FormControlLabel
              value="multiple"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                  }}
                />
              }
              label=""
              sx={{ m: 0, width: "100%" }}
            />
            <Typography variant="body2" fontWeight={600} sx={{ mt: -0.5 }}>
              {english.pricing_multiple}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {english.pricing_multiple_desc}
            </Typography>
          </Paper>
        </RadioGroup>
      </FormControl>

      {/* Price — only when pricing type is single */}
      {pricingType === "single" && (
        <>
          {/* Price — only when pricing type is single */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {english.price_inr}
              <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={price}
              error={!!errors?.price}
              helperText={errors?.price}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                if (
                  val === "" ||
                  (parseFloat(val) <= 10000 &&
                    (val.match(/\./g) || []).length <= 1)
                ) {
                  onPriceChange(val);
                }
              }}
              placeholder={english.enter_price}
            />
          </Box>
        </>
      )}

      {pricingType === "catalog" && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
            borderColor: errors?.catalog ? "error.main" : undefined,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              color: errors?.catalog ? "error.main" : undefined,
            }}
          >
            {english.upload_price_catalog}
            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1.5, display: "block" }}
          >
            {english.upload_price_catalog_helper}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                alignSelf: "flex-start",
                borderColor: COLORS.PRIMARY_PURPLE,
                color: COLORS.PRIMARY_PURPLE,
                "&:hover": {
                  borderColor: COLORS.PURPLE_HOVER,
                  bgcolor: COLORS.PURPLE_ALPHA_04,
                },
              }}
            >
              {english.upload_price_catalog}
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,image/jpeg,image/png,image/jpg"
                onChange={onCatalogFileSelect}
              />
            </Button>
            {errors?.catalog && (
              <Typography variant="caption" color="error">
                {errors.catalog}
              </Typography>
            )}
            {priceCatalogFileNames.length > 0 && (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {priceCatalogFileNames.map((name, index) => (
                    <Box
                      key={`${name}-${index}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PRIMARY_DARK
                          : "white",
                        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                      }}
                    >
                      <DescriptionIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onRemoveCatalogFile(index)}
                        color="error"
                        aria-label={english.remove_price_item}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <Button
                  size="small"
                  onClick={onClearCatalog}
                  sx={{
                    alignSelf: "flex-start",
                    color: "text.secondary",
                    textTransform: "none",
                  }}
                >
                  {english.clear_all_catalog}
                </Button>
              </>
            )}
          </Box>
        </Paper>
      )}

      {pricingType === "multiple" && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
            {english.pricing_multiple_desc}
          </Typography>
          {errors?.multiple && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mb: 1, display: "block" }}
            >
              {errors.multiple}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {priceItems.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
                  bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {english.service_name_label} #{index + 1}
                  </Typography>
                  {priceItems.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => onRemovePriceItem(index)}
                      color="error"
                      aria-label={english.remove_price_item}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={item.name}
                  onChange={(e) =>
                    onUpdatePriceItem(index, "name", e.target.value)
                  }
                  placeholder={english.enter_service_name}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  inputProps={{ inputMode: "numeric", maxLength: 10 }}
                  value={item.price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    if (
                      val === "" ||
                      (parseFloat(val) <= 100000 &&
                        (val.match(/\./g) || []).length <= 1)
                    )
                      onUpdatePriceItem(index, "price", val);
                  }}
                  placeholder={english.enter_price}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    onUpdatePriceItem(index, "description", e.target.value)
                  }
                  placeholder={english.write_here}
                />
              </Paper>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddPriceItem}
              sx={{
                borderStyle: "dashed",
                borderColor: COLORS.PRIMARY_PURPLE,
                color: COLORS.PRIMARY_PURPLE,
                "&:hover": {
                  borderColor: COLORS.PURPLE_HOVER,
                  bgcolor: COLORS.PURPLE_ALPHA_04,
                },
              }}
            >
              {english.add_price_item}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ServicePricingOptions;
