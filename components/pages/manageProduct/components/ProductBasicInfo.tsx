import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Input from "@/components/common/Input";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { productOrigins } from "./data";

const ProductBasicInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)" }}
        gap={3}
      >
        <Box>
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              {t("product_name") + "*"}
            </Typography>
          </Box>
          <Input
            placeholder={t("enter_product_name")}
            name="product_name"
            control={control}
            error={!!errors.product_name}
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
        <Box>
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              {t("sku_no") + "*"}
            </Typography>
          </Box>
          <Input
            placeholder={t("enter_sku_no")}
            name="sku_number"
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

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)" }}
        gap={3}
        mt={3}
      >
        <Box>
          <Typography variant="subtitle2" mb={1} fontWeight={500}>
            {t("product_origin") + "*"}
          </Typography>
          <Controller
            name="product_origin"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.product_origin}>
                <Select
                  {...field}
                  value={field.value?.toUpperCase() || ""}
                  sx={{
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                    borderRadius: "50rem",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    height: "2.5rem",
                    paddingY: 0,
                  }}
                  displayEmpty
                >
                  <MenuItem value="">{t("select_origin")}</MenuItem>
                  {productOrigins.map((origin) => (
                    <MenuItem key={origin} value={origin}>
                      {origin}
                    </MenuItem>
                  ))}
                </Select>
                {errors.product_origin && (
                  <FormHelperText error>
                    {errors.product_origin?.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductBasicInfo;
