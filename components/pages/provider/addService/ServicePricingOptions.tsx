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
  Checkbox,
  alpha,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";

export type PricingType = "single" | "catalog" | "multiple" | "noPrice";

interface ServicePricingOptionsProps {
  pricingType: PricingType;
  onPricingTypeChange: (value: PricingType) => void;
  /** Display names of selected catalog files (supports multiple) */
  priceCatalogFileNames: string[];
  onCatalogFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCatalogFile: (index: number) => void;
  existingCatalogUrls?: string[];
  onRemoveExistingCatalogUrl?: (index: number) => void;
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
  isPriceRequired: boolean;
  onIsPriceRequiredChange: (value: boolean) => void;
  errors?: Record<string, string>;
}

const ServicePricingOptions: React.FC<ServicePricingOptionsProps> = ({
  pricingType,
  onPricingTypeChange,
  priceCatalogFileNames,
  onCatalogFileSelect,
  onRemoveCatalogFile,
  existingCatalogUrls = [],
  onRemoveExistingCatalogUrl,
  onClearCatalog,
  priceItems,
  onAddPriceItem,
  onRemovePriceItem,
  onUpdatePriceItem,
  price,
  onPriceChange,
  isPriceRequired,
  onIsPriceRequiredChange,
  errors,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const optionCardStyle = (active: boolean) => ({
    flex: "1 1 150px",
    minWidth: 150,
    p: 2,
    borderRadius: 2,
    border: `2px solid ${active ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
    bgcolor: active
      ? isDark
        ? COLORS.PURPLE_ALPHA_10
        : COLORS.PURPLE_ALPHA_04
      : "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: COLORS.PRIMARY_PURPLE,
      bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04,
    },
  });

  return (
    <Box sx={{ mb: 3 }}>
      {/* Intro — what to do */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          mb: 2,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: isDark
            ? alpha(COLORS.PRIMARY_PURPLE, 0.08)
            : alpha(COLORS.PRIMARY_PURPLE, 0.06),
          border: `1px solid ${isDark ? alpha(COLORS.PRIMARY_PURPLE, 0.2) : alpha(COLORS.PRIMARY_PURPLE, 0.15)}`,
        }}
      >
        <InfoOutlinedIcon
          sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20, mt: 0.25 }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.5 }}
        >
          Choose how you want to set your service price(s). You can change this
          anytime.
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={isPriceRequired}
            onChange={(e) => onIsPriceRequiredChange(e.target.checked)}
            sx={{
              color: COLORS.PRIMARY_PURPLE,
              "&.Mui-checked": {
                color: COLORS.PRIMARY_PURPLE,
              },
              py: 0.5,
            }}
          />
        }
        label={
          <Typography variant="body2" fontWeight={500}>
            Is Price Required?
          </Typography>
        }
        sx={{ mb: isPriceRequired ? 1 : 0 }}
      />
      {isPriceRequired && (
        <>
          <FormControl component="fieldset" sx={{ width: "100%", mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1.5, display: "block", fontWeight: 600 }}
            >
              Select one option
            </Typography>
            <RadioGroup
              row
              value={pricingType}
              onChange={(e) =>
                onPricingTypeChange(e.target.value as PricingType)
              }
              sx={{ gap: 1.5, flexWrap: "wrap" }}
            >
              <Paper
                variant="outlined"
                sx={optionCardStyle(pricingType === "single")}
                onClick={() => onPricingTypeChange("single")}
              >
                {/* <FormControlLabel value="single" control={<Radio size="small" sx={{ color: COLORS.PRIMARY_PURPLE, "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE } }} />} label="" sx={{ m: 0, width: "100%" }} /> */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: -0.5,
                  }}
                >
                  {/* <AttachMoneyIcon sx={{ fontSize: 22, color: COLORS.PRIMARY_PURPLE }} /> */}
                  <Typography variant="body2" fontWeight={600}>
                    {english.pricing_single}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5, lineHeight: 1.4 }}
                >
                  {english.pricing_single_desc}
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={optionCardStyle(pricingType === "catalog")}
                onClick={() => onPricingTypeChange("catalog")}
              >
                {/* <FormControlLabel value="catalog" control={<Radio size="small" sx={{ color: COLORS.PRIMARY_PURPLE, "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE } }} />} label="" sx={{ m: 0, width: "100%" }} /> */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: -0.5,
                  }}
                >
                  {/* <PictureAsPdfIcon sx={{ fontSize: 22, color: COLORS.PRIMARY_PURPLE }} /> */}
                  <Typography variant="body2" fontWeight={600}>
                    {english.pricing_catalog}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5, lineHeight: 1.4 }}
                >
                  {english.pricing_catalog_desc}
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={optionCardStyle(pricingType === "multiple")}
                onClick={() => onPricingTypeChange("multiple")}
              >
                {/* <FormControlLabel value="multiple" control={<Radio size="small" sx={{ color: COLORS.PRIMARY_PURPLE, "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE } }} />} label="" sx={{ m: 0, width: "100%" }} /> */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: -0.5,
                  }}
                >
                  {/* <FormatListBulletedIcon sx={{ fontSize: 22, color: COLORS.PRIMARY_PURPLE }} /> */}
                  <Typography variant="body2" fontWeight={600}>
                    {english.pricing_multiple}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5, lineHeight: 1.4 }}
                >
                  {english.pricing_multiple_desc}
                </Typography>
              </Paper>
            </RadioGroup>
          </FormControl>

          {pricingType === "single" && (
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
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  {english.price_inr}
                  <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1.5, display: "block" }}
                >
                  Enter the price in INR. Customers will see this on your
                  service listing.
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
                    )
                      onPriceChange(val);
                  }}
                  placeholder={english.enter_price}
                />
              </Box>
            </Paper>
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
                  mb: 0.5,
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
                sx={{ mb: 1.5, display: "block", lineHeight: 1.5 }}
              >
                Upload your price list as PDF or image. Customers can view it
                when they open your service.{" "}
                {english.upload_price_catalog_helper}
              </Typography>
              <Box
                component="label"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 3,
                  px: 2,
                  borderRadius: 2,
                  border: `2px dashed ${errors?.catalog ? "error.main" : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                  bgcolor: isDark
                    ? alpha(COLORS.PRIMARY_PURPLE, 0.04)
                    : alpha(COLORS.PRIMARY_PURPLE, 0.03),
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, bgcolor 0.2s ease",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    bgcolor: isDark
                      ? alpha(COLORS.PRIMARY_PURPLE, 0.08)
                      : alpha(COLORS.PRIMARY_PURPLE, 0.06),
                  },
                }}
              >
                <CloudUploadIcon
                  sx={{
                    fontSize: 40,
                    color: COLORS.PRIMARY_PURPLE,
                    mb: 1,
                    opacity: 0.9,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={COLORS.PRIMARY_PURPLE}
                  sx={{ mb: 0.5 }}
                >
                  {english.upload_price_catalog}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, JPG or PNG · Multiple files allowed
                </Typography>
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  onChange={onCatalogFileSelect}
                />
              </Box>
              {errors?.catalog && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.catalog}
                </Typography>
              )}
              {(priceCatalogFileNames.length > 0 ||
                existingCatalogUrls.length > 0) && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block", fontWeight: 600 }}
                  >
                    Uploaded / existing files
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {priceCatalogFileNames.map((name, index) => (
                      <Box
                        key={`${name}-${index}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
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
                            maxWidth: 160,
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
                    {existingCatalogUrls.map((url, index) => (
                      <Box
                        key={`existing-${index}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1,
                          bgcolor: isDark
                            ? COLORS.BACKGROUND.PRIMARY_DARK
                            : "white",
                          border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                        }}
                      >
                        <PictureAsPdfIcon fontSize="small" color="action" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          File {index + 1}
                        </Typography>
                        {onRemoveExistingCatalogUrl && (
                          <IconButton
                            size="small"
                            onClick={() => onRemoveExistingCatalogUrl(index)}
                            color="error"
                            aria-label="Remove"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Button
                    size="small"
                    onClick={onClearCatalog}
                    sx={{
                      mt: 1,
                      color: "text.secondary",
                      textTransform: "none",
                    }}
                  >
                    {english.clear_all_catalog}
                  </Button>
                </Box>
              )}
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
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Add each service or package
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block", lineHeight: 1.5 }}
              >
                Enter name, price (INR), and a short description for each item.
                You can add as many as you need.
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
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : "white",
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
                        Service #{index + 1}
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
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                      >
                        {english.service_name_label}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.name}
                        onChange={(e) =>
                          onUpdatePriceItem(index, "name", e.target.value)
                        }
                        placeholder={english.enter_service_name}
                      />
                    </Box>
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                      >
                        {english.price_label} (INR)
                      </Typography>
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
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block", fontWeight: 500 }}
                      >
                        {english.description}
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          onUpdatePriceItem(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder={english.write_here}
                      />
                    </Box>
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
                    py: 1.25,
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
        </>
      )}
    </Box>
  );
};

export default ServicePricingOptions;
