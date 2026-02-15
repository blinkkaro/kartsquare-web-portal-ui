import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Input from "@/components/common/Input";
import { useFormContext } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

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
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
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
    </Box>
  );
};

export default ProductBasicInfo;
