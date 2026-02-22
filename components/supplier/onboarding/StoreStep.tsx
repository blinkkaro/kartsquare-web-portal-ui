"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Grid,
  useTheme,
  Paper,
  InputAdornment,
  MenuItem,
  alpha,
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

// Section block: left accent, padding, rounded — consistent form layout
const formSectionStyle = (isDark: boolean) => ({
  p: 2.5,
  mb: 2.5,
  borderRadius: 2,
  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
  borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
  bgcolor: isDark ? alpha(COLORS.PRIMARY_PURPLE, 0.03) : alpha(COLORS.PRIMARY_PURPLE, 0.02),
});

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

  const schema = React.useMemo(
    () =>
      yup.object().shape({
        display_name: yup.string().required(t("store_setup_store_name_required" as any)),
        slug: yup.string(),
        about_us: yup.string().optional(),
        contact_email: yup.string().email(t("store_setup_invalid_email" as any)).optional(),
        contact_phone: yup
          .string()
          .required(t("store_setup_contact_phone_required" as any))
          .matches(/^[0-9]{10}$/, t("store_setup_contact_phone_digits" as any)),
        country_code: yup.string().required(t("countryCodeRequired" as any)),
        establishment_year: yup.string().optional(),
        store_address_id: yup.string().optional(),
        logo_url: yup.string().optional(),
        banner_url: yup.string().optional(),
        categories_served: yup
          .array()
          .of(yup.string())
          .min(1, t("store_setup_categories_min" as any))
          .required(t("store_setup_categories_required" as any)),
        operating_locations: yup
          .array()
          .of(yup.string())
          .optional(),
        contact_preferences: yup.array().of(yup.string()).optional(),
        business_type: yup.string().required(t("store_setup_business_type_required" as any)),
      }),
    [t],
  );

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
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark ? "background.paper" : "white",
            boxShadow: isDark ? "none" : "0 4px 20px rgba(94, 24, 233, 0.06)",
          }}
        >
          {/* Section: Basic Information */}
          <Box sx={formSectionStyle(isDark)}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: COLORS.PRIMARY_PURPLE }}>
              <BusinessOutlinedIcon fontSize="small" /> {t("store_setup_basic_info" as any)}
            </Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("store_setup_display_name" as any)}*
                </Typography>
                <Input
                  name="display_name"
                  control={control}
                  placeholder={t("store_setup_display_name_placeholder" as any)}
                  startIcon={<StoreOutlinedIcon />}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("store_setup_website_url" as any)}
                </Typography>
                <Input
                  name="slug"
                  control={control}
                  placeholder={t("store_setup_website_url_placeholder" as any)}
                  startIcon={<LinkOutlinedIcon />}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" fontWeight="500" mb={1}>
                  {t("store_setup_about_us" as any)}
                </Typography>
                <Input
                  name="about_us"
                  control={control}
                  multiline
                  rows={4}
                  placeholder={t("store_setup_about_us_placeholder" as any)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("store_setup_business_type" as any)}*
                </Typography>
                <Input
                  name="business_type"
                  control={control}
                  select
                  placeholder={t("store_setup_business_type_placeholder" as any)}
                  startIcon={<BusinessOutlinedIcon fontSize="small" />}
                >
                  <MenuItem value="Wholesaler">{t("wholesaler" as any)}</MenuItem>
                  <MenuItem value="Retailer">{t("retailer" as any)}</MenuItem>
                  <MenuItem value="Exporter">{t("exporter" as any)}</MenuItem>
                  <MenuItem value="Manufacturer">{t("manufacturer" as any)}</MenuItem>
                </Input>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("store_setup_categories_served" as any)}*
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
                            placeholder={t("store_setup_categories_placeholder" as any)}
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
                  {t("store_setup_operating_locations" as any)}
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
                          placeholder={t("store_setup_locations_placeholder" as any)}
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

            </Grid>
          </Box>

          {/* Section: Aesthetics & Branding */}
          <Box sx={formSectionStyle(isDark)}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: COLORS.PRIMARY_PURPLE }}>
              <InfoOutlinedIcon fontSize="small" /> {t("store_setup_aesthetics_branding" as any)}
            </Typography>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ImageUpload
                  variant="document"
                  title={t("store_setup_store_logo" as any)}
                  hint={t("store_setup_doc_hint_logo" as any)}
                  images={logoUrl ? [logoUrl] : []}
                  onChange={(files) => handleImageChange(files, "logo_url")}
                  maxImages={1}
                  error={!!errors.logo_url}
                  helperText={errors.logo_url?.message as string}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ImageUpload
                  variant="document"
                  title={t("store_setup_store_banner" as any)}
                  hint={t("store_setup_doc_hint_banner" as any)}
                  images={bannerUrl ? [bannerUrl] : []}
                  onChange={(files) => handleImageChange(files, "banner_url")}
                  maxImages={1}
                  error={!!errors.banner_url}
                  helperText={errors.banner_url?.message as string}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section: Store Location */}
          <Box sx={formSectionStyle(isDark)}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: COLORS.PRIMARY_PURPLE }}>
              <LocationOnOutlinedIcon fontSize="small" /> {t("store_setup_store_location" as any)}
            </Typography>
            <Box>
              {isLoadingAddresses ? (
                <Box display="flex" gap={2}>
                  <CircularProgress size={20} />{" "}
                  <Typography variant="body2">
                    {t("store_setup_loading_addresses" as any)}
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
                            label={t("store_setup_selected" as any)}
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
                        {t("store_setup_add_new_address" as any)}
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
          </Box>

          {/* Section: Contact Information */}
          <Box sx={formSectionStyle(isDark)}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: COLORS.PRIMARY_PURPLE }}>
              <PhoneOutlinedIcon fontSize="small" /> {t("store_setup_contact_info" as any)}
            </Typography>

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
                    {t("store_setup_primary_contact" as any)}*
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Box sx={{ width: { xs: "85px", md: "95px" } }}>
                      <Input
                        name="country_code"
                        control={control}
                        select
                        InputProps={{
                          sx: { borderRadius: "12px", height: 48 },
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
                        placeholder={t("store_setup_contact_phone_placeholder" as any)}
                        startIcon={<PhoneOutlinedIcon fontSize="small" />}
                        type="tel"
                        sx={{ height: 48 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="body2" fontWeight="500" mb={1}>
                    {t("store_setup_contact_email" as any)}
                  </Typography>
                  <Input
                    name="contact_email"
                    control={control}
                    placeholder={t("store_setup_contact_email_placeholder" as any)}
                    startIcon={<EmailOutlinedIcon fontSize="small" />}
                    type="email"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={1} mt={2}>
                {t("store_setup_establishment_year" as any)}
              </Typography>
              <Input
                name="establishment_year"
                control={control}
                placeholder={t("store_setup_establishment_year_placeholder" as any)}
                startIcon={<CalendarTodayOutlinedIcon fontSize="small" />}
              />
            </Grid>
          </Box>

          <Box
            mt={4}
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
                px: 5,
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
              {t("store_setup_save_continue" as any)}
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
