import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Grid,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";

import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessModel from "@/components/common/SuccessModel";
import RightDrawer from "@/components/common/RightDrawer";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddress";
import { useUpdateBusinessInfo } from "@/hooks/useBusinessInfo";
import { BusinessInfoFormData } from "@/components/pages/businessInfo/businessInfoSchema";
import { EditBusinessInfoSchema } from "./editBusinessInfoSchema";
import { useTranslate } from "@/hooks/useTranslate";
import ImageUpload from "@/components/common/ImageUpload";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import AddressCard from "@/components/pages/address/components/AddressCard";
import WarningModel from "@/components/common/WarningModel";
import { Address } from "@/services/address/addressInterface";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/common/Input";

interface EditBusinessInfoModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

const EditBusinessInfoModal: React.FC<EditBusinessInfoModalProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const queryClient = useQueryClient();
  const isDark = theme.palette.mode === "dark";

  const [successModelOpen, setSuccessModelOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Setup
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(EditBusinessInfoSchema(t as any)),
    defaultValues: {
      business_name: "",
      description: "",
      address_id: "",
      business_images: [],
    },
  });

  const watchedAddressId = watch("address_id");
  const watchedBusinessImages = watch("business_images");

  // Address Data & Management
  const { data: addresses, isLoading: isLoadingAddresses } = useGetAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Mutation
  const { mutate: updateBusiness, isPending } = useUpdateBusinessInfo();

  useEffect(() => {
    if (open && initialData) {
      reset({
        business_name: initialData.business_name || "",
        description: initialData.description || "",
        address_id: initialData.address_id || "",
        business_images: initialData.business_images || [],
      });
      setErrorMsg("");
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: any) => {
    updateBusiness(data, {
      onSuccess: () => {
        setSuccessModelOpen(true);
      },
      onError: (error: any) => {
        setErrorMsg(error?.message || "Failed to update business info");
      },
    });
  };

  const handleSetDefault = (id: string) => {
    const address = addresses?.find((addr: Address) => addr.id === id);
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
          // If deleted address was selected, clear selection
          if (addressToDelete === watchedAddressId) {
            setValue("address_id", "");
          }
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

  const displayedAddresses = addresses
    ? [...addresses].sort(
        (a: Address, b: Address) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : [];

  return (
    <>
      <RightDrawer
        open={open}
        onClose={onClose}
        title={t("editBusinessInfo")}
        width={600}
      >
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <ErrorMessage error={errorMsg || ""} isVisible={!!errorMsg} />

          {/* Business Images */}
          <Box>
            <ImageUpload
              images={watchedBusinessImages}
              onChange={(newImages) => {
                setValue("business_images", newImages, {
                  shouldValidate: true,
                });
              }}
              maxImages={5}
              title={t("businessImages")}
            />
            {errors.business_images && (
              <Typography color="error" variant="caption">
                {errors.business_images.message as string}
              </Typography>
            )}
          </Box>

          {/* Business Name */}
          <Box>
            <Input
              name="business_name"
              control={control}
              label={t("businessName") || "Business Name"}
              placeholder={t("businessName") || "Enter Business Name"}
            />
          </Box>

          {/* Description */}
          <Box>
            <Input
              name="description"
              control={control}
              label={t("description") || "Description"}
              placeholder={t("businessDescription") || "Enter Description"}
              multiline
              rows={4}
            />
          </Box>

          {/* Address Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              {t("address" as any) || "Address"}
            </Typography>

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
              {isLoadingAddresses ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <LogoLoader size={20} />
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
                            watchedAddressId === addr.id
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
                            watchedAddressId === addr.id
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
          </Box>

          {errors.address_id && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {errors.address_id.message as string}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
            sx={{ mt: 2, py: 1.5 }}
          >
            {t("save")}
          </Button>
        </Box>
      </RightDrawer>

      <SuccessModel
        open={successModelOpen}
        onClose={() => setSuccessModelOpen(false)}
        title={t("businessInfoUpdated" as any) || "Business Info Updated"}
        description={
          t("businessInfoUpdatedDesc" as any) ||
          "Your business information has been successfully updated."
        }
        onAction={() => {
          setSuccessModelOpen(false);
          onClose();
        }}
      />

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
                backgroundColor: "error.main",
              }}
            >
              {t("delete")}
            </Button>
          </Box>
        }
      />
    </>
  );
};

export default EditBusinessInfoModal;
