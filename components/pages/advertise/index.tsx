"use client";

import React, { useState } from "react";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Pagination,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Campaign, Add } from "@mui/icons-material";
import {
  useProviderAdvertisements,
  useDeleteAdvertisement,
} from "@/hooks/useAdvertisements";
import { useCategories } from "@/hooks/useCategories";
import { useProviderServicesList } from "@/hooks/useServicesList";
import { ad_status_type } from "@/services/advertise/advertise.intreface";
import AdCard from "./components/AdCard";
import AdFilters from "./components/AdFilters";
import EmptyState from "@/components/common/EmptyState";
import WarningModel from "@/components/common/WarningModel";
import RightDrawer from "@/components/common/RightDrawer";
import AdForm from "./components/AdForm";

function AdvertiseView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ad_status_type | "">("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [adToDelete, setAdToDelete] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editingAdId, setEditingAdId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const limit = 9; // 3x3 grid

  // Fetch data
  const { data: categoriesData } = useCategories();
  const { data: servicesData } = useProviderServicesList();
  const {
    data: adsData,
    isLoading,
    isError,
    error,
  } = useProviderAdvertisements({
    category_id: selectedCategory,
    service_id: selectedService,
    status: selectedStatus || undefined,
    page,
    limit,
  });

  // Delete mutation
  const deleteMutation = useDeleteAdvertisement();

  const categories = categoriesData || [];
  const services = servicesData?.services || [];
  const ads = adsData?.ads || [];
  const pagination = adsData?.pagination;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page when filter changes
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setPage(1);
  };

  const handleStatusChange = (status: ad_status_type | "") => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedService("");
    setSelectedStatus("");
    setPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateAd = () => {
    setEditingAdId(undefined);
    setDrawerOpen(true);
  };

  const handleEdit = (ad: any) => {
    setEditingAdId(ad.advertise_id);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingAdId(undefined);
  };

  const handleFormSuccess = () => {
    setDrawerOpen(false);
    setEditingAdId(undefined);
  };

  const handleDelete = (ad: any) => {
    setAdToDelete(ad);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adToDelete) return;

    try {
      await deleteMutation.mutateAsync(adToDelete.advertise_id);
      setDeleteDialogOpen(false);
      setAdToDelete(null);
    } catch (error) {
      console.error("Failed to delete advertisement:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAdToDelete(null);
  };

  return (
    <ProfileWrapper showBackButton>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "500",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("advertisement")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateAd}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            "&:hover": {
              bgcolor: COLORS.PURPLE_HOVER,
            },
          }}
        >
          {t("create_ad")}
        </Button>
      </Box>

      {/* Filters */}
      <AdFilters
        selectedCategory={selectedCategory}
        selectedService={selectedService}
        selectedStatus={selectedStatus}
        categories={categories}
        services={services}
        onCategoryChange={handleCategoryChange}
        onServiceChange={handleServiceChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <CenteredLoader minHeight={400} size={80} />
      )}

      {/* Error State */}
      {isError && (
        <EmptyState
          titleKey="error"
          title={t("error_loading_advertisements")}
          descriptionKey="errorLoadingAds"
          description={error?.message || t("error_loading_ads_description")}
          variant="notFound"
          minHeight={400}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && ads.length === 0 && (
        <EmptyState
          titleKey="noAdvertisements"
          title={t("no_advertisements_yet")}
          descriptionKey="noAdvertisementsDesc"
          description={t("no_advertisements_description")}
          icon={
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.PURPLE_ALPHA_10,
                mb: 3,
              }}
            >
              <Campaign
                sx={{
                  fontSize: 40,
                  color: COLORS.PRIMARY_PURPLE,
                }}
              />
            </Box>
          }
          minHeight={400}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateAd}
              sx={{
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: COLORS.WHITE,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: COLORS.PURPLE_HOVER,
                },
              }}
            >
              {t("create_your_first_ad")}
            </Button>
          }
        />
      )}

      {/* Ads Grid */}
      {!isLoading && !isError && ads.length > 0 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {ads.map((ad) => (
              <AdCard
                key={ad.advertise_id}
                ad={ad}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Box>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                    "&.Mui-selected": {
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      color: COLORS.WHITE,
                      "&:hover": {
                        bgcolor: COLORS.PURPLE_HOVER,
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <WarningModel
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        title={t("delete_advertisement")}
        description={t("delete_ad_confirmation", {
          title: adToDelete?.title || t("this_advertisement"),
        })}
        ActionsButtons={
          <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  bgcolor: COLORS.PURPLE_ALPHA_04,
                },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#EF4444",
                color: COLORS.WHITE,
                "&:hover": {
                  bgcolor: "#DC2626",
                },
                "&:disabled": {
                  bgcolor: "rgba(239, 68, 68, 0.5)",
                },
              }}
            >
              {deleteMutation.isPending ? (
                <LogoLoader size={24} />
              ) : (
                t("delete")
              )}
            </Button>
          </Box>
        }
      />

      {/* Ad Form Drawer */}
      <RightDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={
          editingAdId ? t("edit_advertisement") : t("create_advertisement")
        }
        width={800}
      >
        <AdForm
          advertiseId={editingAdId}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseDrawer}
        />
      </RightDrawer>
    </ProfileWrapper>
  );
}

export default AdvertiseView;
