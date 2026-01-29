"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import {
  BusinessInfoSchema,
  BusinessInfoFormData,
} from "../businessInfoSchema";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/common/ImageUpload";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import AddressCard from "@/components/pages/address/components/AddressCard";
import WarningModel from "@/components/common/WarningModel";
import {
  useGetAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddress";
import { Address } from "@/services/address/addressInterface";
import { COLORS } from "@/constants/colors";
import ErrorMessage from "@/components/common/ErrorMessage";

interface BusinessInfoFormProps {
  onSubmit: (data: BusinessInfoFormData) => void;
  isLoading?: boolean;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  // Address Management State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const { data: addresses, isLoading: isAddressLoading } = useGetAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const handleSetDefault = (id: string) => {
    const address = addresses?.find((addr) => addr.id === id);
    if (address) {
      updateAddressMutation.mutate({
        id,
        data: { ...address, is_default: true },
      });
    }
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setAddressToDelete(null);
        },
      });
    }
  };

  const openEditModal = (address: Address) => {
    setAddressToEdit(address);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setIsDeleteDialogOpen(true);
    setAddressToDelete(id);
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessInfoFormData>({
    resolver: yupResolver(BusinessInfoSchema(t)),
    defaultValues: {
      business_name: "",
      //   description: "",
      address_id: "",
      business_images: [],
    },
  });

  const selectedAddressId = watch("address_id");
  const businessImages = watch("business_images") as (File | string)[];

  const selectedAddress = addresses?.find(
    (addr: Address) => addr.id === selectedAddressId,
  );

  // Sort addresses to show the newest one first and limit to 1
  const displayedAddresses = addresses
    ? [...addresses]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 1)
    : [];

  const handleImageChange = (files: (File | string)[]) => {
    setValue("business_images", files, { shouldValidate: true });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Business Name */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("businessName")}
            </Typography>
            <Input
              name="business_name"
              control={control}
              placeholder={t("enterBusinessName")}
            />
          </Grid>

          {/* Description
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("businessDescription")}
            </Typography>
            <Input
              name="description"
              control={control}
              placeholder={t("enterBusinessDescription")}
              multiline
              rows={4}
            />
          </Grid> */}
          {/* Business Images */}

          <Grid size={{ xs: 12, md: 6 }}>
            <ImageUpload
              images={businessImages || []}
              onChange={handleImageChange}
              maxImages={5}
              error={!!errors.business_images}
              helperText={errors.business_images?.message as string}
              title={t("businessImages")}
            />
            {/* Note: casting message as string because yup array error message type can be complex */}
          </Grid>

          {/* Address Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("address")}
            </Typography>

            {errors.address_id && (
              <ErrorMessage
                error={errors.address_id.message || ""}
                isVisible={!!errors.address_id}
              />
            )}

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT
                }`,
              }}
            >
              {isAddressLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Typography>{t("loading")}</Typography>
                </Box>
              ) : displayedAddresses && displayedAddresses.length > 0 ? (
                <Grid container spacing={2}>
                  {displayedAddresses.map((addr: Address) => (
                    <Grid size={{ xs: 12 }} key={addr.id}>
                      <Box
                        onClick={() => {
                          setValue("address_id", addr.id, {
                            shouldValidate: true,
                          });
                        }}
                        sx={{
                          cursor: "pointer",
                          height: "100%",
                          border:
                            selectedAddressId === addr.id
                              ? `2px solid ${COLORS.PRIMARY_PURPLE}`
                              : `1px solid ${
                                  isDark
                                    ? COLORS.BORDER.DEFAULT_DARK
                                    : COLORS.BORDER.DEFAULT_LIGHT
                                }`,
                          borderRadius: "12px",
                          position: "relative",
                          "&:hover": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          backgroundColor:
                            selectedAddressId === addr.id
                              ? isDark
                                ? "rgba(124, 77, 255, 0.1)"
                                : "rgba(124, 77, 255, 0.05)"
                              : "transparent",
                        }}
                      >
                        <AddressCard
                          address={addr}
                          onEdit={(a) => openEditModal(a)}
                          onDelete={(id) => openDeleteDialog(id)}
                          onSetDefault={handleSetDefault}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ mb: 2 }}>{t("noAddressesYet")}</Typography>
                </Box>
              )}

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsAddressDrawerOpen(true)}
                sx={{ mt: 3, borderStyle: "dashed" }}
                startIcon={<span>+</span>}
              >
                {t("addNewAddress")}
              </Button>
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              {t("submit")}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Add Address Drawer */}
      <AddressDrawer
        open={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        mode="add"
      />

      {/* Edit Address Drawer */}
      <AddressDrawer
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setAddressToEdit(null);
        }}
        initialData={addressToEdit}
        mode="edit"
      />

      {/* Address Selection Drawer (Removed) */}

      {/* Delete Confirmation Dialog */}
      <WarningModel
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setAddressToDelete(null);
        }}
        title={t("deleteAddress")}
        description={t("deleteAddressDescription")}
        ActionsButtons={
          <Box>
            <Button
              variant="outlined"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setAddressToDelete(null);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteAddress}
              sx={{
                ml: 2,
              }}
            >
              {t("delete")}
            </Button>
          </Box>
        }
      />
    </Box>
  );
};

export default BusinessInfoForm;
