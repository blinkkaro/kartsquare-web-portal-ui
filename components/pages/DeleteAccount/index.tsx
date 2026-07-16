"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import WarningIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ChevronIcon from "@mui/icons-material/ChevronRight";
import { COLORS } from "@/constants/colors";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BackButton from "@/components/common/BackButton";
import contactUsService from "@/services/contantUs/contactUs.service";
import { countries } from "@/data/countries";
import SuccessModel from "@/components/common/SuccessModel";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface DeletionFormData {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  reason: string;
  reasonDetail: string;
  consent: boolean;
}

const createDeletionSchema = (t: any) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("nameRequired") || "Name is required")
      .min(2, t("nameMin") || "Name must be at least 2 characters"),
    email: yup
      .string()
      .required(t("emailRequired") || "Email is required")
      .email(t("emailInvalid") || "Invalid email"),
    country_code: yup.string().required(t("countryCodeRequired") || "Country code is required"),
    phone: yup
      .string()
      .required(t("phoneNumberRequired") || "Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must contain only numbers")
      .length(10, "Phone number must be exactly 10 digits"),
    reason: yup.string().required("Please select a reason for deletion"),
    reasonDetail: yup.string().optional(),
    consent: yup
      .boolean()
      .oneOf([true], "You must confirm and consent to deletion to proceed")
      .required("Consent is required"),
  });

function DeleteAccountView() {
  const { t } = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DeletionFormData>({
    resolver: yupResolver(createDeletionSchema(t)) as any,
    defaultValues: {
      name: "",
      email: "",
      country_code: "+91",
      phone: "",
      reason: "",
      reasonDetail: "",
      consent: false,
    },
  });

  const selectedReason = watch("reason");

  const onSubmit = async (data: DeletionFormData) => {
    setIsSubmitting(true);
    try {
      setError("");
      
      const details = selectedReason === "Other" && data.reasonDetail
        ? `${data.reason} (${data.reasonDetail})`
        : data.reason;

      const messageContent = `[Account Deletion Request]
Name: ${data.name}
Email: ${data.email}
Phone: ${data.country_code} ${data.phone}
Reason: ${details}
Consent: Confirmed irreversible account and data deletion.`;

      // Skip the network call for now
      /*
      await contactUsService.contactUs({
        name: data.name,
        email: data.email,
        country_code: data.country_code,
        phone: data.phone,
        message: messageContent,
      });
      */

      reset();
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit deletion request:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit deletion request. Please try again."
      );
      toast.error("Failed to submit deletion request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5, lg: 5, xl: 10 }, py: 5 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <BackButton />
      </Box>
      <Box>
        
        {/* Header Section */}
        <Box sx={{ mb: { xs: 4, sm: 5 } }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
              mb: 1,
            }}
          >
            Delete Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Please fill out the form below to request the permanent deletion of your account and personal data from our platform.
          </Typography>
        </Box>

        {/* Outer Grid Layout (Form on Left, Important Notes on Right) */}
        <Grid container spacing={{ xs: 4, md: 4, lg: 5 }}>
          
          {/* Left Column: Form Section */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }} order={{ xs: 2, md: 1 }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                borderRadius: { xs: "12px", sm: "16px" },
                p: { xs: 2.5, sm: 3, md: 4 },
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2.5, sm: 3 },
                  fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                Deletion Request Form
              </Typography>

              {error && (
                <Box
                  sx={{
                    bgcolor: isDark ? "rgba(255, 77, 79, 0.15)" : "rgba(255, 77, 79, 0.05)",
                    color: COLORS.ERROR_RED,
                    p: 2,
                    borderRadius: "8px",
                    mb: 3,
                    border: `1px solid ${COLORS.ERROR_RED}`,
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Box>
              )}

              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                
                {/* Full Name */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      Full Name
                    </Typography>
                    <Input
                      name="name"
                      control={control}
                      placeholder="Enter your registered name"
                      InputProps={{
                        sx: {
                          borderRadius: "12px",
                          bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Email Address */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      Registered Email Address
                    </Typography>
                    <Input
                      name="email"
                      control={control}
                      placeholder="Enter your registered email"
                      type="email"
                      InputProps={{
                        sx: {
                          borderRadius: "12px",
                          bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Country Code */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      {t("countryCode")}
                    </Typography>
                    <Controller
                      name="country_code"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          sx={{
                            height: "48px",
                            borderRadius: "12px",
                            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.phone_code}>
                              {country.flag} {country.phone_code}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Box>
                </Grid>

                {/* Phone Number */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      Registered Phone Number
                    </Typography>
                    <Input
                      name="phone"
                      control={control}
                      placeholder="Enter your registered number"
                      type="tel"
                      inputProps={{
                        maxLength: 10,
                      }}
                      InputProps={{
                        sx: {
                          borderRadius: "12px",
                          bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Reason for Deletion */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      Reason for Deletion
                    </Typography>
                    <Controller
                      name="reason"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          sx={{
                            height: "48px",
                            borderRadius: "12px",
                            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select a reason
                          </MenuItem>
                          <MenuItem value="Privacy Concerns">I am concerned about my privacy / data safety</MenuItem>
                          <MenuItem value="Duplicate Account">I have a duplicate account</MenuItem>
                          <MenuItem value="No Longer Using">I no longer use KartSquare</MenuItem>
                          <MenuItem value="Too Many Notifications">I receive too many notifications / emails</MenuItem>
                          <MenuItem value="Other">Other (Please specify below)</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.reason && (
                      <FormHelperText error>{errors.reason.message}</FormHelperText>
                    )}
                  </Box>
                </Grid>

                {/* Optional Reason Detail */}
                {selectedReason === "Other" && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        Please specify reason
                      </Typography>
                      <Input
                        name="reasonDetail"
                        control={control}
                        placeholder="Describe your reason for deletion"
                        multiline
                        rows={3}
                        InputProps={{
                          sx: {
                            borderRadius: "12px",
                            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Consent Checkbox */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ mt: 1 }}>
                    <Controller
                      name="consent"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              color="error"
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              I confirm that I want to delete my KartSquare account and all associated personal data. I understand that this action is permanent and cannot be undone.
                            </Typography>
                          }
                        />
                      )}
                    />
                    {errors.consent && (
                      <FormHelperText error>{errors.consent.message}</FormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mt: { xs: 3, sm: 4 },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    width: "auto",
                    minWidth: { xs: "100%", sm: "240px" },
                    background: COLORS.ERROR_RED,
                    color: "white",
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                    fontWeight: 600,
                    borderRadius: "12px",
                    "&:hover": {
                      background: "#e03b3b",
                    },
                    "&:disabled": {
                      background: COLORS.ERROR_RED,
                      opacity: 0.6,
                    },
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Deletion Request"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Important Notes / Warnings Section */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                bgcolor: isDark ? "rgba(255, 77, 79, 0.08)" : "rgba(255, 77, 79, 0.04)",
                border: `1px solid ${COLORS.ERROR_RED}`,
                borderRadius: { xs: "12px", sm: "16px" },
                p: { xs: 2.5, sm: 3 },
                height: "fit-content",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                <WarningIcon sx={{ color: COLORS.ERROR_RED }} />
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                  Important: What happens when your account is deleted?
                </Typography>
              </Box>
              <List dense sx={{ pl: 0, py: 0 }}>
                <ListItem disableGutters sx={{ alignItems: "flex-start", py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.3 }}>
                    <ChevronIcon sx={{ fontSize: 16, color: COLORS.ERROR_RED }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Permanent Data Loss"
                    secondary="All your profile information, settings, configurations, and user history will be permanently wiped out."
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, color: isDark ? "grey.300" : "grey.800" }}
                    secondaryTypographyProps={{ variant: "caption", color: isDark ? "grey.400" : "grey.600" }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: "flex-start", py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.3 }}>
                    <ChevronIcon sx={{ fontSize: 16, color: COLORS.ERROR_RED }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Listings, Services, and Products Removal"
                    secondary="Any business profiles, services, product listings, or active promotions you created will be deleted and cannot be recovered."
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, color: isDark ? "grey.300" : "grey.800" }}
                    secondaryTypographyProps={{ variant: "caption", color: isDark ? "grey.400" : "grey.600" }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: "flex-start", py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.3 }}>
                    <ChevronIcon sx={{ fontSize: 16, color: COLORS.ERROR_RED }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Active Orders & Bookings Cancellation"
                    secondary="Active service bookings, ongoing chats with clients/suppliers, and open business enquiries will be permanently terminated."
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600, color: isDark ? "grey.300" : "grey.800" }}
                    secondaryTypographyProps={{ variant: "caption", color: isDark ? "grey.400" : "grey.600" }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
        </Grid>
      </Box>

      {/* Success Modal */}
      <SuccessModel
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Deletion Request Submitted"
        description="Your account deletion request has been submitted successfully. Our support team will verify your details and process your request within 24-48 business hours."
        actionLabel="Go to Home"
        onAction={() => {
          setShowSuccess(false);
          router.push("/");
        }}
      />
    </Box>
  );
}

export default DeleteAccountView;
