"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField,
  FormGroup,
  Chip,
  Grid,
  useTheme,
  Paper,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/common/ImageUpload";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierStore, useUpdateSupplierStore } from "@/hooks/useSupplier";
import { useRouter } from "next/navigation";
import { STORE_CATEGORIES, OPERATING_LOCATIONS } from "@/constants/common";
import { COLORS } from "@/constants/colors";
import { countries } from "@/components/pages/SignUp/components/data";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/features/ui/authSlice";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { secureStorage } from "@/helper/SecureStorage";

import { useGetAddress } from "@/hooks/useAddress";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import { CircularProgress } from "@mui/material";

import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

interface StoreStepProps {
  onNext: () => void;
  onBack?: () => void;
}

const StoreStep: React.FC<StoreStepProps> = ({ onNext, onBack }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const { data: storeData, isLoading: isLoadingStore } = useSupplierStore();
  const {
    data: addresses,
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = useGetAddress();
  const updateStore = useUpdateSupplierStore();
  const dispatch = useAppDispatch();
  const [addressDrawerOpen, setAddressDrawerOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const schema = yup.object().shape({
    display_name: yup.string().required("Store name is required"),
    slug: yup.string(),
    about_us: yup.string().optional(),
    contact_email: yup.string().email("Invalid email").optional(),
    contact_phone: yup
      .string()
      .required("Contact phone is required")
      .matches(/^[0-9]{10}$/, "Contact phone must be 10 digits"),
    country_code: yup.string().required("Country code is required"),
    establishment_year: yup.string().optional(),
    store_address_id: yup.string().required("Please select a store address"),
    logo_url: yup.string().optional(),
    banner_url: yup.string().optional(),
    categories_served: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one category")
      .required("Categories served is required"),
    operating_locations: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one location")
      .required("Operating locations is required"),
    contact_preferences: yup.array().of(yup.string()).optional(),
    business_type: yup.string().required("Business type is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categories_served: [],
      operating_locations: [],
      contact_preferences: [],
      store_address_id: "",
      country_code: "+91",
      business_type: "",
    },
  });

  const selectedCountryCode = watch("country_code");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode,
  );

  useEffect(() => {
    if (storeData?.data) {
      const data = storeData.data as any;

      // Map backend keys to form keys
      const formData = {
        ...data,
        display_name: data.display_name || data.store_name || "",
        about_us: data.about_us || data.description || "",
        contact_phone: (data.contact_phone || data.primary_mobile || "").trim(),
        contact_email: data.contact_email || data.email || "",
        establishment_year: data.establishment_year || "",
        slug: data.slug || data.website_url || "",
        store_address_id: data.store_address_id || "",
        country_code: data.country_code
          ? data.country_code.startsWith("+")
            ? data.country_code
            : `+${data.country_code}`
          : "+91",
        business_type: data.business_type || "",
      };

      // Mapping contact preferences from object to array for form
      if (
        data.contact_preferences &&
        typeof data.contact_preferences === "object"
      ) {
        const prefs: string[] = [];
        if (data.contact_preferences.show_phone) prefs.push("show_phone");
        if (data.contact_preferences.allow_calls) prefs.push("allow_calls");
        if (data.contact_preferences.allow_chat) prefs.push("allow_chat");
        if (data.contact_preferences.enquiry_only) prefs.push("enquiry_only");
        formData.contact_preferences = prefs;
      } else {
        formData.contact_preferences = [];
      }

      // Remove null values to avoid Yup validation issues
      Object.keys(formData).forEach((key) => {
        if (formData[key] === null) {
          delete formData[key];
        }
      });

      reset(formData);
    }
  }, [storeData, reset]);

  const handleImageChange = async (
    files: (File | string)[],
    field: "logo_url" | "banner_url",
  ) => {
    const newFile = files.find((f) => typeof f !== "string") as
      | File
      | undefined;
    if (!newFile) {
      // Check if removal happened
      const currentString = files.find((f) => typeof f === "string") as
        | string
        | undefined;
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

  const onSubmit = async (values: any) => {
    try {
      const payload = { ...values } as any;
      const prefs = Array.isArray(payload.contact_preferences)
        ? payload.contact_preferences
        : [];

      // Map form keys back to backend keys just in case
      payload.store_name = payload.display_name;
      payload.description = payload.about_us;
      payload.primary_mobile = payload.contact_phone?.trim();
      payload.website_url = payload.slug; // Send slug as website_url as requested

      payload.contact_preferences = {
        show_phone: prefs.includes("show_phone"),
        allow_calls: prefs.includes("allow_calls"),
        allow_chat: prefs.includes("allow_chat"),
        enquiry_only: prefs.includes("enquiry_only"),
        show_whatsapp: true, // Defaulting to true as per API response
      };

      // Remove empty strings and nulls
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });

      await updateStore.mutateAsync(payload);

      // Update auth state for Guard
      secureStorage.setItem(
        "register_step",
        UserRegisterSteps.SUPPLIER_STORE_CREATED.toString(),
      );
      dispatch(
        updateUser({ register_step: UserRegisterSteps.SUPPLIER_STORE_CREATED }),
      );

      onNext();
    } catch (error: any) {
      console.error("Failed to update store", error);
      if (error?.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          setError(err.field as any, { type: "server", message: err.message });
        });
      }
    }
  };

  if (isLoadingStore)
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );

  const logoUrl = watch("logo_url");
  const bannerUrl = watch("banner_url");

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark ? "background.paper" : "white",
            boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.04)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            mb={4}
            sx={{ color: COLORS.PRIMARY_PURPLE }}
          >
            Store Setup
          </Typography>

          <Grid container spacing={4}>
            {/* Basic Info Section */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                mb={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <BusinessOutlinedIcon fontSize="small" color="primary" /> Basic
                Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                Store Display Name*
              </Typography>
              <Input
                name="display_name"
                control={control}
                placeholder="LALA JI KELE WALE"
                startIcon={<StoreOutlinedIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                Store Website URL*
              </Typography>
              <Input
                name="slug"
                control={control}
                placeholder="my-store-name"
                startIcon={<LinkOutlinedIcon />}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" fontWeight="500" mb={1}>
                About Us
              </Typography>
              <Input
                name="about_us"
                control={control}
                multiline
                rows={4}
                placeholder="Tell us more about your business..."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                Business Type*
              </Typography>
              <Input
                name="business_type"
                control={control}
                select
                placeholder="Select Business Type"
                startIcon={<BusinessOutlinedIcon fontSize="small" />}
              >
                <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                <MenuItem value="Retailer">Retailer</MenuItem>
                <MenuItem value="Exporter">Exporter</MenuItem>
                <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              </Input>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                Categories Served*
              </Typography>
              <Controller
                name="categories_served"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Autocomplete
                      multiple
                      options={STORE_CATEGORIES}
                      value={(Array.isArray(value) ? value : []) as string[]}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderTags={() => null} // Don't show inside
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Choose Categories"
                          error={!!errors.categories_served}
                          helperText={
                            errors.categories_served?.message as string
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start" sx={{ pl: 1 }}>
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
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                Operating Locations*
              </Typography>
              <Controller
                name="operating_locations"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={OPERATING_LOCATIONS}
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
                        placeholder="Choose Locations"
                        error={!!errors.operating_locations}
                        helperText={
                          errors.operating_locations?.message as string
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
            </Grid>

            {/* Appearance Section */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                mb={2}
                mt={5}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <InfoOutlinedIcon fontSize="small" color="primary" /> Aesthetics
                & Branding
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                title="Store Logo"
                images={logoUrl ? [logoUrl] : []}
                onChange={(files) => handleImageChange(files, "logo_url")}
                maxImages={1}
                error={!!errors.logo_url}
                helperText={errors.logo_url?.message as string}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                title="Store Banner"
                images={bannerUrl ? [bannerUrl] : []}
                onChange={(files) => handleImageChange(files, "banner_url")}
                maxImages={1}
                error={!!errors.banner_url}
                helperText={errors.banner_url?.message as string}
              />
            </Grid>

            {/* Location Section */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                mb={2}
                mt={5}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <LocationOnOutlinedIcon fontSize="small" color="primary" />{" "}
                Store Location
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 1 }}>
                {isLoadingAddresses ? (
                  <Box display="flex" gap={2}>
                    <CircularProgress size={20} />{" "}
                    <Typography variant="body2">
                      Loading addresses...
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {addresses?.map((addr: any) => (
                      <Grid size={{ xs: 12, md: 6 }} key={addr.id}>
                        <Box
                          onClick={() =>
                            setValue("store_address_id", addr.id, {
                              shouldValidate: true,
                            })
                          }
                          sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor:
                              watch("store_address_id") === addr.id
                                ? COLORS.PRIMARY_PURPLE
                                : "divider",
                            borderRadius: 3,
                            cursor: "pointer",
                            bgcolor:
                              watch("store_address_id") === addr.id
                                ? `${COLORS.PRIMARY_PURPLE}08`
                                : "transparent",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              borderColor: COLORS.PRIMARY_PURPLE,
                              bgcolor: `${COLORS.PRIMARY_PURPLE}04`,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              bgcolor:
                                watch("store_address_id") === addr.id
                                  ? COLORS.PRIMARY_PURPLE
                                  : "divider",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              flexShrink: 0,
                            }}
                          >
                            <LocationOnOutlinedIcon fontSize="small" />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0, pr: 7 }}>
                            <Typography variant="subtitle2" fontWeight="700">
                              {addr.address_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              sx={{ display: "block" }}
                            >
                              {addr.address}, {addr.city_town}
                            </Typography>
                          </Box>
                          {watch("store_address_id") === addr.id && (
                            <Chip
                              label="Selected"
                              size="small"
                              color="primary"
                              variant="filled"
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        onClick={() => setAddressDrawerOpen(true)}
                        sx={{
                          p: 2,
                          border: "2px dashed",
                          borderColor: "divider",
                          borderRadius: 3,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          minHeight: 74,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                            color: COLORS.PRIMARY_PURPLE,
                            bgcolor: `${COLORS.PRIMARY_PURPLE}04`,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          + Add New Address
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                {errors.store_address_id && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {errors.store_address_id.message as string}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Contact Section */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                mb={2}
                mt={5}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <PhoneOutlinedIcon fontSize="small" color="primary" /> Contact
                Information
              </Typography>
            </Grid>

            {/* <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: isDark ? 'transparent' : '#f9fbff', mb: 2 }}>
                            <Typography variant="body2" gutterBottom fontWeight="600" mb={2}>Contact Preferences*</Typography>
                            <Controller
                                name="contact_preferences"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <FormGroup row>
                                        {[
                                            { key: "show_phone", label: "Show Phone" },
                                            { key: "allow_calls", label: "Allow Calls" },
                                            { key: "allow_chat", label: "Allow Chat" },
                                            { key: "enquiry_only", label: "Enquiry Only" }
                                        ].map((pref) => (
                                            <FormControlLabel
                                                key={pref.key}
                                                control={
                                                    <Checkbox
                                                        checked={(value as string[])?.includes(pref.key) || false}
                                                        onChange={(e) => {
                                                            const current = (value as any[]) || [];
                                                            if (e.target.checked) {
                                                                onChange([...current, pref.key]);
                                                            } else {
                                                                onChange(current.filter((v: string) => v !== pref.key));
                                                            }
                                                        }}
                                                        color="primary"
                                                    />
                                                }
                                                label={pref.label}
                                                sx={{ '& .MuiTypography-root': { fontSize: '0.9rem', fontWeight: 500 } }}
                                            />
                                        ))}
                                    </FormGroup>
                                )}
                            />
                            {errors.contact_preferences && <Typography color="error" variant="caption">{errors.contact_preferences.message as string}</Typography>}
                        </Box>
                    </Grid> */}

            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="body2" fontWeight="500" mb={1}>
                    Primary Contact Number*
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Box sx={{ width: { xs: "85px", md: "95px" } }}>
                      <Input
                        name="country_code"
                        control={control}
                        select
                        InputProps={{
                          sx: { borderRadius: "12px", height: 48 },
                          startAdornment: (
                            <InputAdornment position="start">
                              {selectedCountry?.flag}
                            </InputAdornment>
                          ),
                        }}
                      >
                        {countries.map((option) => (
                          <MenuItem key={option.code} value={option.phone_code}>
                            {option.phone_code}
                          </MenuItem>
                        ))}
                      </Input>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Input
                        name="contact_phone"
                        control={control}
                        placeholder="98765 43210"
                        startIcon={<PhoneOutlinedIcon fontSize="small" />}
                        type="tel"
                        sx={{ height: 48 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="body2" fontWeight="500" mb={1}>
                    Contact Email
                  </Typography>
                  <Input
                    name="contact_email"
                    control={control}
                    placeholder="business@mail.com"
                    startIcon={<EmailOutlinedIcon fontSize="small" />}
                    type="email"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Establishment Year
              </Typography>
              <Input
                name="establishment_year"
                control={control}
                placeholder="e.g. 2020"
                startIcon={<CalendarTodayOutlinedIcon fontSize="small" />}
              />
            </Grid>
          </Grid>

          <Box
            mt={10}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {onBack ? (
              <Button
                variant="outlined"
                type="button"
                onClick={onBack || (() => router.back())}
                sx={{ borderRadius: "50px", px: 4, height: 48 }}
              >
                {t("goBack" as any)}
              </Button>
            ) : (
              <Box />
            )}
            <Button
              type="submit"
              isLoading={updateStore.isPending || isUploading}
              variant="contained"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 10,
                height: 56,
                boxShadow: isDark
                  ? "none"
                  : `0 10px 25px ${COLORS.PRIMARY_PURPLE}40`,
                "&:hover": {
                  boxShadow: isDark
                    ? "none"
                    : `0 15px 35px ${COLORS.PRIMARY_PURPLE}60`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Save & Continue
            </Button>
          </Box>
        </Paper>
      </Box>
      <AddressDrawer
        open={addressDrawerOpen}
        onClose={() => {
          setAddressDrawerOpen(false);
          refetchAddresses();
        }}
        mode="add"
      />
    </>
  );
};

export default StoreStep;
