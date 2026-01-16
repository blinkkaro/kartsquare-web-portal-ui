"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import Button from "@/components/common/Button";
import AddressCard from "./components/AddressCard";
import {
  useGetAddress,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddress";
import { Address } from "@/services/address/addressInterface";
import WarningModel from "@/components/common/WarningModel";
import AddressDrawer from "@/components/common/address/AddressDrawer";

function AddressView() {
  const { t } = useTranslationContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const { data: addresses = [], isLoading } = useGetAddress();

  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

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

  const handleSetDefault = (id: string) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      updateAddressMutation.mutate({
        id,
        data: { ...address, is_default: true },
      });
    }
  };

  const openEditModal = (address: Address) => {
    setSelectedAddress(address);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setAddressToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <ProfileWrapper showBackButton>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            {t("addresses")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsAddModalOpen(true)}
            sx={{
              borderRadius: "30px",
              backgroundColor: "#2C2C3E",
              color: "white",
              "&:hover": {
                backgroundColor: "#1E1E2E",
              },
            }}
          >
            {t("addAddress")}
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && addresses.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t("noAddressesYet")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("addYourFirstAddress")}
            </Typography>
          </Box>
        )}

        {/* Address Grid */}
        {!isLoading && addresses.length > 0 && (
          <Grid container spacing={2}>
            {addresses.map((address) => (
              <Grid size={{ xs: 12, sm: 6 }} key={address.id}>
                <AddressCard
                  address={address}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                  onSetDefault={handleSetDefault}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Address Modal */}
        <AddressDrawer
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />

        {/* Edit Address Modal */}
        <AddressDrawer
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAddress(null);
          }}
          initialData={selectedAddress}
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
                }}
              >
                {t("delete")}
              </Button>
            </Box>
          }
        />
      </Box>
    </ProfileWrapper>
  );
}

export default AddressView;
