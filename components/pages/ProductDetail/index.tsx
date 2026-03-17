"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { useRouter } from "next/navigation";
import { useGetProductById, useDeleteProduct } from "@/hooks/useProducts";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductDetailInfo from "./components/ProductDetailInfo";
import ProductDetailSpecs from "./components/ProductDetailSpecs";
import ServiceImageCarousel from "@/components/ServiceImageCarousel";
import ProductMap from "../store/ProductMap";
import ProviderInfoCard from "@/components/ProviderInfoCard";
import { AppUserType } from "@/services/auth/auth.interface";
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
    return <CenteredLoader minHeight="60vh" />;
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

              {/* Map View */}
              {product.supplier?.store_address && (
                <Box sx={{ mt: 7 }}>
                  <ProductMap
                    latitude={parseFloat(String(product.supplier.store_address.lat)) || 26.9124}
                    longitude={parseFloat(String(product.supplier.store_address.long)) || 75.7873}
                    storeName={product.supplier.name}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side - Info & Specs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductDetailInfo
              productName={product.product_name}
              price={product.price}
              currency={product.currency}
              description={product.product_description}
              category={product.category_name}
              status={product.product_status}
              rejectedReason={product.rejected_reason}
              gstNumber={product.supplier?.gst_in ?? undefined}
            />

            <ProductDetailSpecs
              specifications={product.specifications}
              isAvailable={product.is_available}
              origin={product.product_origin}
            />

            {product.supplier && (
              <>
                <Divider sx={{ opacity: 0.6, my: 3 }} />
                <Box sx={{ py: 3 }}>
                  <ProviderInfoCard
                    providerId={product.supplier_id}
                    providerName={product.supplier.name}
                    providerImageUrl={product.supplier.logo_url}
                    isHotSeller={true}
                    providerPhoneNumber={`${product.supplier.country_code || '+91'}${product.supplier.primary_mobile || ''}`}
                    businessName={product.supplier.name}
                    isFollowing={false}
                    gstNumber={product.supplier.gst_in ?? undefined}
                    username={product.supplier.username || ""}
                    role={AppUserType.SUPPLIER}
                  />
                </Box>
              </>
            )}
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
              {deleteMutation.isPending ? <LogoLoader size={20} /> : t("delete")}
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
