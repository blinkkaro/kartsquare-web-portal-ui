"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema, ProductFormValues } from "./product.schema";
import { useTranslate } from "@/hooks/useTranslate";
import {
  useCreateProduct,
  useUpdateProduct,
  useGetProductById,
} from "@/hooks/useProducts";
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductPricing from "./components/ProductPricing";
import ProductDescription from "./components/ProductDescription";
import ProductCategorySelect from "./components/ProductCategorySelect";
import ProductMedia from "./components/ProductMedia";
import ProductSpecifications from "./components/ProductSpecifications";
import { useRouter } from "next/navigation";
import {
  ProductCreate,
  ProductSpecificationValueCreate,
  ProductUpdate,
} from "@/services/product/product.interface";
import { COLORS } from "@/constants/colors";
import SuccessModel from "@/components/common/SuccessModel";

interface ManageProductViewProps {
  productId?: string;
}

function ManageProductView({ productId }: ManageProductViewProps) {
  const { t } = useTranslate();
  const theme = useTheme();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { data: productData, isLoading: isLoadingProduct } = useGetProductById(
    productId || "",
  );
  const isDarkMode = theme.palette.mode === "dark";

  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema(t)),
    defaultValues: {
      product_name: "",
      sku_number: "",
      product_category_id: "",
      product_sub_category_id: "",
      product_brand_id: "",
      currency: "INR",
      product_description: "",
      product_images: [],
      is_returnable: false,
      specifications: [],
      product_origin: "",
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (productData) {
      // Map product data to form values
      reset({
        product_name: productData.product_name,
        sku_number: productData.sku_number,
        product_category_id: productData.product_category_id,
        product_sub_category_id: productData.product_sub_category_id,
        product_brand_id: productData.product_brand_id,
        price: productData.price,
        currency: productData.currency || "INR",
        product_description: productData.product_description,
        product_origin: productData.product_origin?.toUpperCase() || "",
        product_images: productData.product_images,
        is_returnable: productData.is_returnable || false,
        specifications: (productData.specifications || []).map((s) => ({
          product_specifications_id: s.product_specifications_id,
          product_specifications_entered_value:
            s.product_specifications_entered_value,
          product_specifications_value_type:
            s.product_specifications_value_type,
          product_specifications_name: s.product_specifications_name,
          product_specifications_is_required: true, // Metadata for validation
        })),
      });
    }
  }, [productData, reset]);

  const transformSpecifications = (
    specs: any[],
  ): ProductSpecificationValueCreate[] => {
    return specs
      .map((spec) => ({
        product_specifications_id: spec.product_specifications_id,
        product_specifications_entered_value: (
          spec.product_specifications_entered_value || []
        ).filter((val: any) => val !== undefined && val !== null && val !== ""),
        product_specifications_value_type:
          spec.product_specifications_value_type,
      }))
      .filter((spec) => spec.product_specifications_entered_value.length > 0);
  };

  const onSubmit = (data: ProductFormValues) => {
    const transformedSpecs = transformSpecifications(data.specifications || []);

    if (productId) {
      const updatePayload: ProductUpdate = {
        product_id: productId,
        product_name: data.product_name,
        sku_number: data.sku_number,
        product_category_id: data.product_category_id,
        product_sub_category_id: data.product_sub_category_id,
        price: data.price,
        currency: data.currency,
        product_description: data.product_description,
        product_images: data.product_images,
        is_returnable: data.is_returnable,
        product_origin: data.product_origin,
        specifications: transformedSpecs,
        ...(data.product_brand_id && {
          product_brand_id: data.product_brand_id,
        }),
      };
      updateProduct(updatePayload, {
        onSuccess: () => {
          setShowSuccessModal(true);
        },
      });
    } else {
      const createPayload: ProductCreate = {
        product_name: data.product_name,
        sku_number: data.sku_number,
        product_category_id: data.product_category_id,
        product_sub_category_id: data.product_sub_category_id,
        price: data.price,
        currency: data.currency,
        product_description: data.product_description,
        product_images: data.product_images,
        is_returnable: data.is_returnable,
        specifications: transformedSpecs,
        is_available: true,
        product_origin: data.product_origin,
        ...(data.product_brand_id && {
          product_brand_id: data.product_brand_id,
        }),
      };
      createProduct(createPayload, {
        onSuccess: () => {
          setShowSuccessModal(true);
        },
      });
    }
  };

  if (isLoadingProduct) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 5, px: 20 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          {productId ? t("edit_product") : t("add_new_product")}
        </Typography>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
            gap={3}
          >
            {/* Left Column - Image Upload */}
            <Box>
              <ProductMedia />
            </Box>

            {/* Right Column - Form Fields */}
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                backgroundColor: isDarkMode
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PRIMARY_LIGHT,
                p: 2,
                borderRadius: 2,
              }}
            >
              <ProductCategorySelect />
              <ProductBasicInfo />
              <ProductDescription />
              <ProductSpecifications />
              <ProductPricing />
            </Box>
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.back()}
              sx={{
                border: `1px solid ${theme.palette.mode === "dark" ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE}`,
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.ACCENT_BLUE_DARK
                    : COLORS.PRIMARY_PURPLE,
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <CircularProgress size={24} />
              ) : productId ? (
                t("update_product")
              ) : (
                t("save")
              )}
            </Button>
          </Box>
        </form>
      </FormProvider>

      <SuccessModel
        open={showSuccessModal}
        onClose={() => router.push("/sup/myStore")}
        onAction={() => router.push("/sup/myStore")}
        title={productId ? t("product_updated") : t("product_created")}
        description={
          productId
            ? t("product_updated_successfully")
            : t("product_created_successfully")
        }
        actionLabel={t("continue")}
      />
    </Box>
  );
}

export default ManageProductView;
