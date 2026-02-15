import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import ImageUpload from "@/components/common/ImageUpload";
import { COLORS } from "@/constants/colors";

const ProductMedia = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: isDarkMode ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        mb: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t("Add new product" as any)}
      </Typography>

      <Controller
        name="product_images"
        control={control}
        render={({ field: { onChange, value } }) => (
          <ImageUpload
            images={value || []}
            onChange={onChange}
            maxImages={5}
            title={t("Upload your product images." as any)}
            error={!!errors.product_images}
            helperText={errors.product_images?.message as string}
          />
        )}
      />
    </Box>
  );
};

export default ProductMedia;
