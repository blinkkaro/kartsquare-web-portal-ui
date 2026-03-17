"use client";

import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import {
  useDeleteProduct,
  useSupplierProducts,
  useUpdateProductStatus,
} from "@/hooks/useProducts";
import { COLORS } from "@/constants/colors";
import WarningModel from "@/components/common/WarningModel";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";

function MyStoreView() {
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const deleteMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {t} = useTranslate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSupplierProducts({ search });

  // Flatten the pages into a single array of products
  const products = data?.pages.flatMap((page) => page.products) || [];
  const handleDelete = async () => {
    if (!selectedProductId) return;
    try {
      await deleteMutation.mutateAsync(selectedProductId);
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 3 },
        bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
      }}
    >
      <ProductFilter
        onSearch={setSearch}
        totalCount={data?.pages[0]?.pagination?.total}
      />
      <ProductTable
        products={products}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onDelete={(id) => {
          setSelectedProductId(id);
          setIsDeleteModalOpen(true);
        }}
        onUpdateStatus={(id, status) => {
          updateStatusMutation.mutate({
            product_id: id,
            product_status: status as any,
          });
        }}
        onUpdateAvailability={(id, isAvailable) => {
          updateStatusMutation.mutate({
            product_id: id,
            is_available: isAvailable,
          });
        }}
      />

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
    </Box>
  );
}

export default MyStoreView;
