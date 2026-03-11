"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetProductById, useDeleteProduct } from "@/hooks/useProducts";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailSpecs from "./components/ProductDetailSpecs";
import ServiceImageCarousel from "@/components/ServiceImageCarousel";
import WarningModel from "@/components/common/WarningModel";
import SuccessModel from "@/components/common/SuccessModel";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductDetailViewProps {
  productId: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: product, isLoading, error } = useGetProductById(productId);
  const deleteMutation = useDeleteProduct();
  const { t } = useTranslate();
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(productId);
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {t("failed_to_load_product_details")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.back()}
          sx={{ bgcolor: COLORS.PRIMARY_PURPLE }}
        >
          {t("go_back")}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 4 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "transparent" : "#FDFBFF",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <ProductDetailHeader
          productId={productId}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />

        <Grid container spacing={4}>
          {/* Left Side - Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: 100,
              }}
            >
              <ServiceImageCarousel
                images={product.product_images}
                serviceName={product.product_name}
              />
            </Box>
          </Grid>

          {/* Right Side - Info & Specs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductDetailInfo
              price={product.price}
              currency={product.currency}
              description={product.product_description}
              category={product.category_name}
              status={product.product_status}
              rejectedReason={product.rejected_reason}
            />

            <ProductDetailSpecs
              specifications={product.specifications}
              isAvailable={product.is_available}
              origin={product.product_origin}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Modal */}
      <WarningModel
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("delete_product")}
        description={t("delete_product_description")}
        ActionsButtons={
          <Box sx={{ display: "flex", gap: 2, mt: 3, width: "100%" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
              sx={{
                borderRadius: "12px",
                borderColor: "rgba(0,0,0,0.1)",
                color: "text.primary",
                py: 1.5,
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              sx={{
                borderRadius: "12px",
                bgcolor: "#FF4444",
                "&:hover": { bgcolor: "#CC3333" },
                py: 1.5,
              }}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </Box>
        }
      />

      {/* Success Modal */}
      <SuccessModel
        open={isSuccessModalOpen}
        title={t("product_deleted")}
        description={t("product_deleted_description")}
        actionLabel={t("go_to_my_store")}
        onAction={() => router.push("/sup/myStore")}
      />
    </Box>
  );
};

export default ProductDetailView;
