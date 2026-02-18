import React from "react";
import { Box, Typography, TextField, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const ProductDescription = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box>
      <Typography variant="subtitle2" mb={1} fontWeight={500}>
        {t("description") + "*"}
      </Typography>
      <Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          InputProps={{
            sx: {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: "50rem",
              bgcolor: "background.paper",
            },
          }}
          placeholder={t("write_here")}
          {...register("product_description")}
          error={!!errors.product_description}
          helperText={errors.product_description?.message as string}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: isDark
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PRIMARY_LIGHT,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductDescription;
