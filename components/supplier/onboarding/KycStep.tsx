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
  Grid,
  useTheme,
  Paper,
  MenuItem,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/common/ImageUpload";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierKyc, useUpdateSupplierKyc } from "@/hooks/useSupplier";
import { ID_PROOF_TYPES } from "@/constants/common";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { countries } from "@/data/countries";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/features/ui/authSlice";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { secureStorage } from "@/helper/SecureStorage";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

// Section block: left accent, padding, rounded — consistent with StoreStep
const formSectionStyle = (isDark: boolean) => ({
  p: 2.5,
  mb: 2.5,
  borderRadius: 2,
  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
  borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
  bgcolor: isDark
    ? alpha(COLORS.PRIMARY_PURPLE, 0.03)
    : alpha(COLORS.PRIMARY_PURPLE, 0.02),
});

interface KycStepProps {
  onBack: () => void;
  onNext?: () => void;
}

const KycStep: React.FC<KycStepProps> = ({ onBack, onNext }) => {
  const { t } = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: kycData, isLoading: isLoadingKyc } = useSupplierKyc();
  const updateKyc = useUpdateSupplierKyc();
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = React.useState(false);

  const schema = React.useMemo(
    () =>
      yup.object().shape({
        gst_in: yup.string().trim().max(15, "Invalid GST").optional(),
        gst_state: yup.string().trim().max(50, "State Max").optional(),
        gst_certificate_url: yup.string().trim().optional(),
        pan_number: yup
          .string()
          .trim()
          .required(t("kyc_pan_required" ))
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, t("kyc_pan_invalid" )),
        pan_card_url: yup
          .string()
          .trim()
          .required(t("kyc_pan_image_required" )),
        id_proof_type: yup
          .string()
          .trim()
          .required(t("kyc_id_type_required" )),
        id_proof_url: yup
          .string()
          .trim()
          .required(t("kyc_id_image_required" )),
        address_proof_url: yup
          .string()
          .trim()
          .required(t("kyc_address_proof_required" )),
        owner_name: yup
          .string()
          .trim()
          .max(100, t("valNameMax"))
          .required(t("kyc_owner_name_required" )),
        owner_country_code: yup
          .string()
          .trim()
          .required(t("kyc_country_code_required" )),
        owner_mobile: yup
          .string()
          .trim()
          .required(t("kyc_owner_mobile_required" ))
          .matches(/^[0-9]{10}$/, t("kyc_owner_mobile_digits" )),
        owner_email: yup
          .string()
          .trim()
          .lowercase()
          .max(255, t("valEmailMax"))
          .email(t("kyc_owner_email_invalid" ))
          .required(t("kyc_owner_email_required" )),
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
      id_proof_type: "",
      owner_country_code: "+91",
    },
  });

  useEffect(() => {
    if (kycData?.data) {
      const data = { ...kycData.data } as any;

      // Remove null values
      Object.keys(data).forEach((key) => {
        if (data[key] === null) {
          delete data[key];
        }
      });

      // Map backend keys if different
      const formData = {
        ...data,
        gst_in: data.gst_in || data.gst_number || "",
        owner_country_code: data.owner_country_code
          ? data.owner_country_code.startsWith("+")
            ? data.owner_country_code
            : `+${data.owner_country_code}`
          : "+91",
      };

      reset(formData);
    }
  }, [kycData, reset]);

  const handleImageChange = async (files: (File | string)[], field: string) => {
    const newFile = files.find((f) => typeof f !== "string") as
      | File
      | undefined;
    if (!newFile) {
      const currentString = files.find((f) => typeof f === "string") as
        | string
        | undefined;
      setValue(field as any, currentString || "", { shouldValidate: true });
      return;
    }

    try {
      setIsUploading(true);
      const urls = await verifyDocumentService.uploadImages([newFile]);
      if (urls && urls[0]) {
        setValue(field as any, urls[0], { shouldValidate: true });
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

      // Clean empty strings
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });

      await updateKyc.mutateAsync(payload);

      // Update auth state for Guard
      secureStorage.setItem(
        "register_step",
        UserRegisterSteps.SUPPLIER_KYC_SUBMITTED.toString(),
      );
      dispatch(
        updateUser({ register_step: UserRegisterSteps.SUPPLIER_KYC_SUBMITTED }),
      );

      if (onNext) {
        onNext();
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Failed to update KYC", error);
      if (error?.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          setError(err.field as any, { type: "server", message: err.message });
        });
      }
    }
  };

  if (isLoadingKyc)
    return <CenteredLoader py={10} />;

  return (
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
        {/* Collapsible: Business Tax (GST) — number, state, certificate */}
        <Accordion
          defaultExpanded={false}
          sx={{
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
            bgcolor: isDark
              ? alpha(COLORS.PRIMARY_PURPLE, 0.03)
              : alpha(COLORS.PRIMARY_PURPLE, 0.02),
            "&:before": { display: "none" },
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
            }
            sx={{
              "& .MuiAccordionSummary-content": {
                alignItems: "center",
                gap: 1,
              },
              py: 0.5,
              minHeight: 48,
            }}
          >
            <BusinessOutlinedIcon
              fontSize="small"
              sx={{ color: COLORS.PRIMARY_PURPLE }}
            />
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={COLORS.PRIMARY_PURPLE}
            >
              {t("kyc_section_gst" )} ({t("kyc_optional" )})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2, px: 2.5 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("kyc_gst_number" )}
                </Typography>
                <Input
                  name="gst_in"
                  control={control}
                  placeholder={t("kyc_gst_number_placeholder" )}
                  startIcon={<DescriptionOutlinedIcon fontSize="small" />}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" fontWeight="500" mb={0.5}>
                  {t("kyc_gst_state" )}
                </Typography>
                <Input
                  name="gst_state"
                  control={control}
                  placeholder={t("kyc_gst_state_placeholder" )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <ImageUpload
                  title={`${t("kyc_gst_certificate" )} (${t("kyc_optional" )})`}
                  images={
                    watch("gst_certificate_url")
                      ? [watch("gst_certificate_url") as string]
                      : []
                  }
                  onChange={(files) =>
                    handleImageChange(files, "gst_certificate_url")
                  }
                  maxImages={1}
                  error={!!errors.gst_certificate_url}
                  helperText={errors.gst_certificate_url?.message as string}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Section: PAN + Owner Information */}
        <Box sx={formSectionStyle(isDark)}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: COLORS.PRIMARY_PURPLE,
            }}
          >
            <BadgeOutlinedIcon fontSize="small" /> {t("kyc_pan_number" )}{" "}
            & {t("kyc_section_owner" )}
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("kyc_pan_number" )}*
              </Typography>
              <Input
                name="pan_number"
                control={control}
                placeholder={t("kyc_pan_number_placeholder" )}
                startIcon={<BadgeOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("kyc_owner_name" )}*
              </Typography>
              <Input
                name="owner_name"
                control={control}
                placeholder={t("kyc_owner_name_placeholder" )}
                startIcon={<PersonOutlineOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("kyc_owner_email" )}*
              </Typography>
              <Input
                name="owner_email"
                control={control}
                placeholder={t("kyc_owner_email_placeholder" )}
                startIcon={<EmailOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("kyc_owner_mobile" )}*
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box sx={{ width: { xs: "85px", md: "95px" } }}>
                  <Input
                    name="owner_country_code"
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
                    name="owner_mobile"
                    control={control}
                    placeholder={t("kyc_owner_mobile_placeholder" )}
                    startIcon={<PhoneOutlinedIcon fontSize="small" />}
                    type="tel"
                    sx={{ height: 48 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Section: Identity Verification (PAN card, ID proof, address proof) */}
        <Box sx={formSectionStyle(isDark)}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: COLORS.PRIMARY_PURPLE,
            }}
          >
            <BadgeOutlinedIcon fontSize="small" />{" "}
            {t("kyc_section_identity" )}
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" fontWeight="500" mb={0.5}>
                {t("kyc_id_proof_type" )}*
              </Typography>
              <Controller
                name="id_proof_type"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={ID_PROOF_TYPES}
                    value={value || ""}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("kyc_id_proof_type_placeholder" )}
                        error={!!errors.id_proof_type}
                        helperText={errors.id_proof_type?.message as string}
                        InputProps={{
                          ...params.InputProps,
                          sx: { borderRadius: "12px" },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                variant="document"
                title={`${t("kyc_id_proof_image" )}*`}
                hint={t("kyc_doc_hint_id" )}
                images={
                  watch("id_proof_url") ? [watch("id_proof_url") as string] : []
                }
                onChange={(files) => handleImageChange(files, "id_proof_url")}
                maxImages={1}
                error={!!errors.id_proof_url}
                helperText={errors.id_proof_url?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                variant="document"
                title={`${t("kyc_address_proof_image" )}*`}
                hint={t("kyc_doc_hint_address" )}
                images={
                  watch("address_proof_url")
                    ? [watch("address_proof_url") as string]
                    : []
                }
                onChange={(files) =>
                  handleImageChange(files, "address_proof_url")
                }
                maxImages={1}
                error={!!errors.address_proof_url}
                helperText={errors.address_proof_url?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                variant="document"
                title={`${t("kyc_pan_card_image" )}*`}
                hint={t("kyc_doc_hint_pan" )}
                images={
                  watch("pan_card_url") ? [watch("pan_card_url") as string] : []
                }
                onChange={(files) => handleImageChange(files, "pan_card_url")}
                maxImages={1}
                error={!!errors.pan_card_url}
                helperText={errors.pan_card_url?.message as string}
              />
            </Grid>
            
          </Grid>
        </Box>

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outlined"
            type="button"
            onClick={onBack}
            sx={{ borderRadius: "50px", px: 4, height: 48 }}
          >
            {t("goBack" )}
          </Button>
          <Button
            type="submit"
            isLoading={updateKyc.isPending || isUploading}
            variant="contained"
            size="large"
            sx={{
              borderRadius: "50px",
              px: 2,
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
            {t("kyc_complete_registration" )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default KycStep;
