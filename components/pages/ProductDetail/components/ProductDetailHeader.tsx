"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/BackButton";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductDetailHeaderProps {
  productId: string;
  productName: string;
  onDeleteClick: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  productId,
  productName,
  onDeleteClick,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  const handleEdit = () => {
    router.push(`/sup/manageProduct?id=${productId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <BackButton />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: isDark
              ? COLORS.ACCENT_BLUE_DARK
              : COLORS.PRIMARY_PURPLE,
          }}
        >
          {productName}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Tooltip title={t("edit_product")}>
          <IconButton
            onClick={handleEdit}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "white",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_PURPLE,
                opacity: 0.9,
              },
              width: 44,
              height: 44,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(89, 44, 157, 0.2)",
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("delete_product")}>
          <IconButton
            onClick={onDeleteClick}
            sx={{
              bgcolor: isDark
                ? "rgba(255, 68, 68, 0.1)"
                : "rgba(255, 68, 68, 0.05)",
              color: "#FF4444",
              border: `1px solid rgba(255, 68, 68, 0.2)`,
              "&:hover": {
                bgcolor: "#FF4444",
                color: "white",
              },
              width: 44,
              height: 44,
              borderRadius: "12px",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ProductDetailHeader;
