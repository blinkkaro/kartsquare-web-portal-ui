"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  TextField,
  Autocomplete,
  MenuItem,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Chip } from "@mui/material";
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
import { useGetBusinessInfo } from "@/hooks/useBusinessInfo";
import { Address } from "@/services/address/addressInterface";
import { COLORS } from "@/constants/colors";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";

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

  const { data: businessInfo, isLoading: isBusinessLoading } = useGetBusinessInfo();
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
    reset,
    watch,
    formState: { errors },
  } = useForm<BusinessInfoFormData>({
    resolver: yupResolver(BusinessInfoSchema(t)),
    defaultValues: {
      business_name: "",
      address_id: "",
      business_images: [],
      category: "",
      sub_category: [],
    },
  });

  const selectedAddressId = watch("address_id");
  const businessImages = watch("business_images") as (File | string)[];
  const selectedCategory = watch("category");
  const selectedSubCategory = watch("sub_category");

  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories(selectedCategory ? [selectedCategory] : []);

  // Load existing business info into the form
  useEffect(() => {
    if (businessInfo) {
      reset({
        business_name: businessInfo.business_name || "",
        address_id: businessInfo.address_id || "",
        business_images: businessInfo.business_images || [],
        category: businessInfo.category || "",
        sub_category: Array.isArray(businessInfo.sub_category) 
          ? businessInfo.sub_category 
          : businessInfo.sub_category 
            ? [businessInfo.sub_category] 
            : [],
      });
    }
  }, [businessInfo, reset]);

  const selectedAddress = addresses?.find(
    (addr: Address) => addr.id === selectedAddressId,
  );

  // Sort addresses to show the newest one first
  const displayedAddresses = addresses
    ? [...addresses]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : [];

  useEffect(() => {
    if (displayedAddresses.length > 0 && !selectedAddressId) {
      setValue("address_id", displayedAddresses[0].id, {
        shouldValidate: true,
      });
    }
  }, [displayedAddresses, selectedAddressId, setValue]);

  const handleImageChange = (files: (File | string)[]) => {
    setValue("business_images", files, { shouldValidate: true });
  };

  return (
    <Box sx={{
      maxWidth: "1100px",
      mx: "auto",
      width: "100%",
      pb: 4,
      position: 'relative'
    }}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

          {/* Section 1: Business Identity */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: isDark ? COLORS.WHITE : "#374151", fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
              {t("businessName")}
            </Typography>
            <Input
              name="business_name"
              control={control}
              placeholder={t("enterBusinessName")}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '44px',
                  fontSize: '15px',
                  color: '#111827'
                }
              }}
            />
          </Grid>

          {/* Section 2: Visual Identity */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? COLORS.WHITE : "#374151", fontSize: '0.9rem' }}>
                {t("businessImages")}
              </Typography>

            </Box>

            <ImageUpload
              images={businessImages || []}
              onChange={handleImageChange}
              maxImages={5}
              error={!!errors.business_images}
              helperText={errors.business_images?.message as string}
              title=""
            />
          </Grid>

          {/* Section 3: Business Classification */}
          <Grid size={{ xs: 12 }}>


            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: "#374151", fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {t("businessCategory")}*
                </Typography>
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Autocomplete
                      options={categories || []}
                      getOptionLabel={(option) => option.name}
                      value={categories?.find((cat) => cat.id === value) || null}
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id : "");
                        setValue("sub_category", []);
                      }}
                      filterOptions={(options, { inputValue }) => {
                        const search = inputValue.toLowerCase();
                        return options.filter(
                          (option) =>
                            option.name.toLowerCase().includes(search) ||
                            (option.description && option.description.toLowerCase().includes(search))
                        );
                      }}
                      renderOption={(props, option, { selected }) => (
                        <Box
                          component="li"
                          {...props}
                          key={option.id}
                          sx={{
                            display: 'flex !important',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                            px: 3,
                            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                            '&:last-child': { borderBottom: 'none' },
                            bgcolor: selected ? (isDark ? 'rgba(94, 24, 233, 0.15) !important' : 'rgba(94, 24, 233, 0.04) !important') : 'transparent',
                            '&:hover': {
                              bgcolor: isDark ? 'rgba(94, 24, 233, 0.2) !important' : 'rgba(94, 24, 233, 0.08) !important',
                            }
                          }}
                        >
                          <Box sx={{ flex: 1, pr: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? COLORS.WHITE : "#111827", fontSize: '1rem', mb: 0.5 }}>
                              {option.name}
                            </Typography>
                            {option.description && (
                              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.4, fontSize: '0.85rem' }}>
                                {option.description}
                              </Typography>
                            )}
                          </Box>
                          {selected && (
                            <CheckIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
                          )}
                        </Box>
                      )}
                      PaperComponent={({ children }) => (
                        <Paper sx={{
                          mt: 1,
                          borderRadius: '16px',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                          width: 'max-content',
                          minWidth: '100%',
                          maxWidth: { xs: '90vw', md: '450px' },
                          overflow: 'hidden'
                        }}>
                          {children}
                        </Paper>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("selectBusinessCategory")}
                          error={!!error}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '44px',
                              fontSize: '14px',
                              borderRadius: '8px'
                            }
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: "#374151", fontSize: '0.85rem' }}>
                  {t("businessSubCategory")}*
                </Typography>
                <Controller
                  name="sub_category"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Box>
                      <Autocomplete
                        multiple
                        options={subCategories || []}
                        getOptionLabel={(option) => option.name}
                        value={(subCategories || []).filter(opt => Array.isArray(value) && value.includes(opt.id))}
                        onChange={(_, newValue) => {
                          onChange(newValue.map(v => v.id));
                        }}
                        renderTags={() => null} // Hide tags inside the input
                        disabled={!selectedCategory}
                        filterOptions={(options, { inputValue }) => {
                          const search = inputValue.toLowerCase();
                          return options.filter(
                            (option) =>
                              option.name.toLowerCase().includes(search) ||
                              (option.description && option.description.toLowerCase().includes(search))
                          );
                        }}
                        renderOption={(props, option, { selected }) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id}
                            sx={{
                              display: 'flex !important',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 2,
                              px: 3,
                              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                              '&:last-child': { borderBottom: 'none' },
                              bgcolor: selected ? (isDark ? 'rgba(94, 24, 233, 0.15) !important' : 'rgba(94, 24, 233, 0.04) !important') : 'transparent',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(94, 24, 233, 0.2) !important' : 'rgba(94, 24, 233, 0.08) !important',
                              }
                            }}
                          >
                            <Box sx={{ flex: 1, pr: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? COLORS.WHITE : "#111827", fontSize: '1rem', mb: 0.5 }}>
                                {option.name}
                              </Typography>
                              {option.description && (
                                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.4, fontSize: '0.85rem' }}>
                                  {option.description}
                                </Typography>
                              )}
                            </Box>
                            {selected && (
                              <CheckIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
                            )}
                          </Box>
                        )}
                        PaperComponent={({ children }) => (
                          <Paper sx={{
                            mt: 1,
                            borderRadius: '16px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                            width: 'max-content',
                            minWidth: '100%',
                            maxWidth: { xs: '90vw', md: '450px' },
                            overflow: 'hidden'
                          }}>
                            {children}
                          </Paper>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectSubCategory")}
                            error={!!error}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                minHeight: '44px',
                                fontSize: '14px',
                                borderRadius: '8px',
                                padding: '4px 12px !important'
                              }
                            }}
                          />
                        )}
                      />

                      {/* Custom Selected Chips Below */}
                      {Array.isArray(value) && value.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                          {value.map((id: string | undefined) => {
                            if (!id) return null;
                            const subCat = subCategories?.find(s => s.id === id);
                            if (!subCat) return null;
                            return (
                              <Chip
                                key={id}
                                label={subCat.name}
                                onDelete={() => {
                                  onChange(value.filter((val: string | undefined) => val !== id));
                                }}
                                deleteIcon={<CloseIcon sx={{ fontSize: '14px !important', color: COLORS.PRIMARY_PURPLE }} />}
                                sx={{
                                  bgcolor: isDark ? 'rgba(94, 24, 233, 0.1)' : 'rgba(94, 24, 233, 0.05)',
                                  color: COLORS.PRIMARY_PURPLE,
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  border: `1px solid ${isDark ? 'rgba(94, 24, 233, 0.2)' : 'rgba(94, 24, 233, 0.1)'}`,
                                  '& .MuiChip-label': { px: 1.5 },
                                  '&:hover': {
                                    bgcolor: isDark ? 'rgba(94, 24, 233, 0.2)' : 'rgba(94, 24, 233, 0.1)',
                                  }
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Section 4: Location & Address */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? COLORS.WHITE : "#374151", fontSize: '0.9rem' }}>
                {t("businessLocation")}
              </Typography>
            </Box>

            {errors.address_id && (
              <ErrorMessage
                error={errors.address_id.message || ""}
                isVisible={!!errors.address_id}
              />
            )}

            <Box sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
              borderRadius: '16px',
              border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
              p: displayedAddresses && displayedAddresses.length > 0 ? 3 : 6,
              textAlign: 'center'
            }}>
              {isAddressLoading || isBusinessLoading ? (
                <Typography>{t("loading")}</Typography>
              ) : displayedAddresses && displayedAddresses.length > 0 ? (
                <Grid container spacing={2}>
                  {displayedAddresses.map((addr: Address) => (
                    <Grid size={{ xs: 12 }} key={addr.id}>
                      <Box
                        onClick={() => setValue("address_id", addr.id, { shouldValidate: true })}
                        sx={{
                          cursor: "pointer",
                          border: selectedAddressId === addr.id ? `2px solid ${COLORS.PRIMARY_PURPLE}` : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                          borderRadius: "12px",
                          transition: 'all 0.2s ease',
                          bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
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
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="text"
                      onClick={() => setIsAddressDrawerOpen(true)}
                      sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, mt: 1 }}
                      startIcon={<span>+</span>}
                    >
                      {t("addAnotherAddress")}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                  <Typography sx={{ mb: 1, fontWeight: 700, color: '#64748b' }}>{t("noAddressesYet")}</Typography>
                  <Button
                    variant="text"
                    onClick={() => setIsAddressDrawerOpen(true)}
                    sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}
                    startIcon={<span>+</span>}
                  >
                    {t("addNewAddress")}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons Below Form */}
        <Box sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}>
          <Button
            variant="outlined"
            sx={{ px: { xs: 2, sm: 4 }, py: 1, borderRadius: '8px', color: '#374151', borderColor: '#e2e8f0', bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            sx={{ px: { xs: 2, sm: 4 }, py: 1, borderRadius: '8px', bgcolor: COLORS.PRIMARY_PURPLE, fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}
          >
            Add Business Details
          </Button>
        </Box>
      </form>

      {/* Drawers & Models */}
      <AddressDrawer open={isAddressDrawerOpen} onClose={() => setIsAddressDrawerOpen(false)} mode="add" isDefault={true} />
      <AddressDrawer open={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setAddressToEdit(null); }} initialData={addressToEdit} mode="edit" />
      <WarningModel
        open={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setAddressToDelete(null); }}
        title={t("deleteAddress")}
        description={t("deleteAddressDescription")}
        ActionsButtons={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => { setIsDeleteDialogOpen(false); setAddressToDelete(null); }}>{t("cancel")}</Button>
            <Button variant="contained" onClick={handleDeleteAddress} sx={{ bgcolor: COLORS.PRIMARY_PURPLE }}>{t("delete")}</Button>
          </Box>
        }
      />
    </Box>
  );
};

export default BusinessInfoForm;
