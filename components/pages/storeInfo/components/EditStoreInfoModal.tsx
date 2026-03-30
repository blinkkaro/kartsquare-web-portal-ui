import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Grid,
  Autocomplete,
  Chip,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";

import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessModel from "@/components/common/SuccessModel";
import RightDrawer from "@/components/common/RightDrawer";
import { useTranslate } from "@/hooks/useTranslate";
import ImageUpload from "@/components/common/ImageUpload";
import { useEditSupplierStore } from "@/hooks/useSupplier";
import { SupplierStore } from "@/services/supplier/supplier.service";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/common/Input";
import { STORE_CATEGORIES, OPERATING_LOCATIONS } from "@/constants/common";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";

import {
  useGetAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/hooks/useAddress";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import AddressCard from "@/components/pages/address/components/AddressCard";
import WarningModel from "@/components/common/WarningModel";
import { Address } from "@/services/address/addressInterface";

interface EditStoreInfoModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<SupplierStore>;
}

const EditStoreInfoModal: React.FC<EditStoreInfoModalProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [successModelOpen, setSuccessModelOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Address Data & Management
  const { data: addresses, isLoading: isLoadingAddresses } = useGetAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Form Setup
  const schema = React.useMemo(
    () =>
      yup.object().shape({
        store_name: yup
          .string()
          .trim()
          .max(100, t("valNameMax"))
          .required(t("store_setup_store_name_required")),
        description: yup.string().trim().max(2000, t("valDescMax")).optional(),
        contact_email: yup
          .string()
          .trim()
          .max(255, t("valEmailMax"))
          .email(t("store_setup_invalid_email"))
          .optional(),
        primary_mobile: yup
          .string()
          .trim()
          .required(t("store_setup_contact_phone_required"))
          .matches(/^[0-9]{10}$/, t("store_setup_contact_phone_digits")),
        whatsapp_number: yup
          .string()
          .trim()
          .matches(/^[0-9]{10}$/, t("store_setup_contact_phone_digits"))
          .nullable()
          .transform((v) => (v === "" ? null : v))
          .optional(),
        store_address_id: yup.string().trim().required(t("store_setup_address_required")),
        logo_url: yup.string().trim().required(t("store_setup_logo_required")),
        banner_url: yup.string().trim().required(t("store_setup_banner_required")),
        categories_served: yup
          .array()
          .of(yup.string().trim())
          .min(1, t("store_setup_categories_min"))
          .required(t("store_setup_categories_required")),
        operating_locations: yup.array().of(yup.string().trim()).required(t("store_setup_operating_locations_required")),
        business_type: yup.string().trim().required(t("store_setup_business_type_required")),
        establishment_year: yup
          .string()
          .trim()
          .max(4, "Invalid Year")
          .required(t("store_setup_establishment_year_required")),
        website_url: yup.string().trim().url("Invalid URL").optional(),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupplierStore>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      store_name: "",
      description: "",
      about_us: "",
      contact_email: "",
      primary_mobile: "",
      whatsapp_number: "",
      store_address_id: "",
      logo_url: "",
      banner_url: "",
      categories_served: [],
      operating_locations: [],
      business_type: "",
      establishment_year: "",
      website_url: "",
    },
  });

  const watchedAddressId = watch("store_address_id");

  const { mutate: editStore, isPending } = useEditSupplierStore();

  useEffect(() => {
    if (open && initialData) {
      reset({
        store_name: initialData.store_name || "",
        description: initialData.description || "",
        about_us: initialData.about_us || "",
        contact_email: initialData.contact_email || "",
        primary_mobile: initialData.primary_mobile || initialData.contact_phone || "",
        whatsapp_number: initialData.whatsapp_number || "",
        store_address_id: initialData.store_address_id || "",
        logo_url: initialData.logo_url || "",
        banner_url: initialData.banner_url || "",
        categories_served: initialData.categories_served || [],
        operating_locations: initialData.operating_locations || [],
        business_type: initialData.business_type || "",
        establishment_year: initialData.establishment_year || "",
        website_url: initialData.website_url || "",
      });
      setErrorMsg("");
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: SupplierStore) => {
    editStore(data, {
      onSuccess: () => {
        setSuccessModelOpen(true);
      },
      onError: (error: any) => {
        setErrorMsg(error?.message || "Failed to update store info");
      },
    });
  };

  const handleImageChange = async (
    files: (File | string)[],
    field: "logo_url" | "banner_url",
  ) => {
    const newFile = files.find((f) => typeof f !== "string") as File | undefined;
    if (!newFile) {
      const currentString = files.find((f) => typeof f === "string") as string | undefined;
      setValue(field, currentString || "", { shouldValidate: true });
      return;
    }

    try {
      setIsUploading(true);
      const urls = await verifyDocumentService.uploadImages([newFile]);
      if (urls && urls[0]) {
        setValue(field, urls[0], { shouldValidate: true });
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
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
          if (addressToDelete === watchedAddressId) {
            setValue("store_address_id", "");
          }
        },
      });
    }
  };

  const openEditModal = (address: Address) => {
    setAddressToEdit(address);
    setIsEditAddressModalOpen(true);
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

  const logoUrl = watch("logo_url");
  const bannerUrl = watch("banner_url");

  return (
    <>
      <RightDrawer
        open={open}
        onClose={onClose}
        title={t("editStoreInfo") || "Edit Store Info"}
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
          <Grid container spacing={2}>
             <Grid size={{ xs: 12, sm: 6 }}>
                 <ImageUpload
                  variant="document"
                  title={t("storeLogo") || "Store Logo"}
                  images={logoUrl ? [logoUrl] : []}
                  onChange={(files) => handleImageChange(files, "logo_url")}
                  maxImages={1}
                  error={!!errors.logo_url}
                  helperText={errors.logo_url?.message}
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
                <ImageUpload
                  variant="document"
                  title={t("storeBanner") || "Store Banner"}
                  images={bannerUrl ? [bannerUrl] : []}
                  onChange={(files) => handleImageChange(files, "banner_url")}
                  maxImages={1}
                  error={!!errors.banner_url}
                  helperText={errors.banner_url?.message}
                />
             </Grid>
          </Grid>
          
          <Box>
            <Input
              name="store_name"
              control={control}
              label={t("storeName") || "Store Name"}
              placeholder="Enter Store Name"
            />
          </Box>

          <Box>
            <Input
              name="description"
              control={control}
              label={t("description") || "Description"}
              placeholder="Enter Description"
              multiline
              rows={3}
            />
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  name="primary_mobile"
                  control={control}
                  label={t("primaryMobile") || "Primary Number"}
                  placeholder="Enter Primary Number"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  name="contact_email"
                  control={control}
                  label={t("contactEmail") || "Contact Email"}
                  placeholder="Enter Contact Email"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  name="whatsapp_number"
                  control={control}
                  label={t("whatsappNumberRequired") || "Whatsapp Number"}
                  placeholder="Enter Whatsapp Number"
                />
             </Grid>
             <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  name="establishment_year"
                  control={control}
                  label={t("establishmentYear") || "Establishment Year"}
                  placeholder="Enter Year"
                />
             </Grid>
             <Grid size={{ xs: 12 }}>
                <Input
                  name="business_type"
                  control={control}
                  select
                  label={t("businessType") || "Business Type"}
                  placeholder={t("store_setup_business_type_placeholder")}
                  startIcon={<BusinessOutlinedIcon fontSize="small" />}
                >
                  <MenuItem value="Wholesaler">{t("wholesaler")}</MenuItem>
                  <MenuItem value="Retailer">{t("retailer")}</MenuItem>
                  <MenuItem value="Exporter">{t("exporter")}</MenuItem>
                  <MenuItem value="Manufacturer">{t("manufacturer")}</MenuItem>
                </Input>
             </Grid>
          </Grid>
          <Grid size={{ xs: 12 }}>
                <Input
                  name="website_url"
                  control={control}
                  label={t("websiteUrl")}
                  placeholder="Enter Website URL"
                />
             </Grid>

           {/* Address Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600
              }}
            >
              {t("address") || "Address"}*
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
                          setValue("store_address_id", addr.id, {
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
                  <Typography sx={{ mb: 2 }}>{t("no_address_yet")}</Typography>
                </Box>
              )}

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsAddressDrawerOpen(true)}
                sx={{ mt: 3, borderStyle: "dashed" }}
                startIcon={<span>+</span>}
              >
                {t("add_address")}
              </Button>
            </Box>
            {errors.store_address_id && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                {errors.store_address_id.message}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("categoriesServed") || "Categories Served"}*
            </Typography>
            <Controller
                name="categories_served"
                control={control}
                render={({ field: { onChange, value } }) => (
                <Box>
                    <Autocomplete
                    multiple
                    options={STORE_CATEGORIES || []}
                    value={(Array.isArray(value) ? value : []) as string[]}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderTags={() => null} // Don't show inside
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        placeholder="Select Categories"
                        error={!!errors.categories_served}
                        helperText={
                            errors.categories_served?.message
                        }
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                            <>
                                <InputAdornment
                                position="start"
                                sx={{ pl: 1 }}
                                >
                                <CategoryOutlinedIcon fontSize="small" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                            </>
                            ),
                            sx: { borderRadius: "12px" },
                        }}
                        />
                    )}
                    />
                    <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1.5,
                    }}
                    >
                    {((value as string[]) || []).map((option) => (
                        <Chip
                        key={option}
                        label={option}
                        onDelete={() =>
                            onChange(
                            (value as string[]).filter((v) => v !== option),
                            )
                        }
                        variant="filled"
                        size="medium"
                        sx={{
                            bgcolor: `${COLORS.PRIMARY_PURPLE}10`,
                            color: COLORS.PRIMARY_PURPLE,
                            fontWeight: 500,
                            borderRadius: "8px",
                            "& .MuiChip-deleteIcon": {
                            color: COLORS.PRIMARY_PURPLE,
                            fontSize: "18px",
                            },
                        }}
                        />
                    ))}
                    </Box>
                </Box>
                )}
            />
          </Box>
          <Box>
             <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("operatingLocations") || "Operating Locations"}
            </Typography>
            <Controller
                name="operating_locations"
                control={control}
                render={({ field: { onChange, value } }) => (
                <Autocomplete
                    multiple
                    options={OPERATING_LOCATIONS || []}
                    value={(Array.isArray(value) ? value : []) as string[]}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        />
                    ))
                    }
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Select Locations"
                        error={!!errors.operating_locations}
                        helperText={
                        errors.operating_locations?.message
                        }
                        InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                            <InputAdornment position="start" sx={{ pl: 1 }}>
                                <LocationOnOutlinedIcon fontSize="small" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                            </>
                        ),
                        sx: { borderRadius: "12px" },
                        }}
                    />
                    )}
                />
                )}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending || isUploading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {t("save") || "Save"}
          </Button>
        </Box>
      </RightDrawer>

      <SuccessModel
        open={successModelOpen}
        onClose={() => setSuccessModelOpen(false)}
        title={t("storeInfoUpdated") || "Store Info Updated"}
        description={
          t("storeInfoUpdatedDesc") ||
          "Your store information has been successfully updated."
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
        open={isEditAddressModalOpen}
        onClose={() => {
          setIsEditAddressModalOpen(false);
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

export default EditStoreInfoModal;
