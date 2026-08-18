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
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import WarningIcon from "@mui/icons-material/WarningAmber";
import DeleteForeverIcon from "@mui/icons-material/DeleteForeverRounded";
import DatabaseIcon from "@mui/icons-material/StorageRounded";
import StorefrontIcon from "@mui/icons-material/StorefrontRounded";
import EventBusyIcon from "@mui/icons-material/EventBusyRounded";
import CheckIcon from "@mui/icons-material/Check";
import { COLORS } from "@/constants/colors";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BackButton from "@/components/common/BackButton";
import PageTitle from "@/components/common/PageTitle";
import SectionTitle from "@/components/common/SectionTitle";
import deleteAccountService from "@/services/deleteAccount/deleteAccount.service";
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

const REASON_OPTIONS = [
  { value: "Privacy Concerns", label: "I am concerned about my privacy / data safety" },
  { value: "Duplicate Account", label: "I have a duplicate account" },
  { value: "No Longer Using", label: "I no longer use kartsquare" },
  { value: "Too Many Notifications", label: "I receive too many notifications / emails" },
  { value: "Other", label: "Other (please specify below)" },
];

const IMPACTS = [
  {
    icon: DatabaseIcon,
    title: "Permanent data loss",
    description: "All your profile information, settings, configurations, and user history will be permanently wiped out.",
  },
  {
    icon: StorefrontIcon,
    title: "Listings, services & products removed",
    description: "Any business profiles, services, product listings, or active promotions you created will be deleted and cannot be recovered.",
  },
  {
    icon: EventBusyIcon,
    title: "Active orders & bookings cancelled",
    description: "Active service bookings, ongoing chats with clients/suppliers, and open business enquiries will be permanently terminated.",
  },
];

type Stage = "details" | "review" | "submitted";

const STAGES: { key: Stage; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
  { key: "submitted", label: "Submitted" },
];

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

// Shared label + control wrapper — this form repeats the same label/field
// pattern for every field, so it's factored out once, here, rather than
// promoted to a shared component (the layout is specific to this page).
function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        component="label"
        htmlFor={htmlFor}
        variant="subtitle2"
        sx={{ display: "block", mb: 1 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function ProgressRail({ stage }: { stage: Stage }) {
  const activeIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 3, sm: 4 } }}>
      {STAGES.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <React.Fragment key={s.key}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  transition: "background-color 0.2s ease, color 0.2s ease",
                  bgcolor: done || active ? COLORS.ERROR_RED : "action.selected",
                  color: done || active ? COLORS.WHITE : "text.secondary",
                }}
              >
                {done ? <CheckIcon sx={{ fontSize: 14 }} /> : i + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: active ? 700 : 500,
                  color: active ? "text.primary" : "text.secondary",
                  display: { xs: i === activeIndex ? "block" : "none", sm: "block" },
                }}
              >
                {s.label}
              </Typography>
            </Box>
            {i < STAGES.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  height: "2px",
                  mx: { xs: 1, sm: 1.5 },
                  bgcolor: i < activeIndex ? COLORS.ERROR_RED : "divider",
                  transition: "background-color 0.2s ease",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

function DeleteAccountView() {
  const { t } = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<DeletionFormData | null>(null);

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
  const stage: Stage = showSuccess ? "submitted" : showConfirm ? "review" : "details";

  // Validate + open the confirmation dialog. The actual API call only
  // happens once the user explicitly confirms in the dialog.
  const openConfirm = (data: DeletionFormData) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  const confirmDeletion = async () => {
    if (!pendingData) return;
    const data = pendingData;
    setIsSubmitting(true);
    try {
      setError("");

      await deleteAccountService.submitRequest({
        full_name: data.name,
        email: data.email,
        country_code: data.country_code,
        phone: data.phone,
        reason: data.reason,
        reason_detail: data.reason === "Other" ? data.reasonDetail : undefined,
      });

      setShowConfirm(false);
      reset();
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Failed to submit deletion request:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit deletion request. Please try again."
      );
      setShowConfirm(false);
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
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <PageTitle
            subtitle="Please fill out the form below to request the permanent deletion of your account and personal data from our platform."
          >
            Delete Account
          </PageTitle>
        </Box>

        <ProgressRail stage={stage} />

        {/* Outer Grid Layout (Form on Left, Important Notes on Right) */}
        <Grid container spacing={{ xs: 4, md: 4, lg: 5 }}>

          {/* Left Column: Form Section */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }} order={{ xs: 2, md: 1 }}>
            <Box
              component="form"
              onSubmit={handleSubmit(openConfirm)}
              sx={{
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                borderRadius: { xs: "16px", sm: "20px" },
                p: { xs: 2.5, sm: 3, md: 4 },
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                boxShadow: isDark ? "none" : "0 1px 2px rgba(16, 24, 40, 0.04)",
              }}
            >
              <SectionTitle sx={{ mb: { xs: 2.5, sm: 3 } }}>
                Deletion Request Form
              </SectionTitle>

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
                  <FormField label="Full Name">
                    <Input
                      name="name"
                      control={control}
                      placeholder="Enter your registered name"
                    />
                  </FormField>
                </Grid>

                {/* Email Address */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Registered Email Address">
                    <Input
                      name="email"
                      control={control}
                      placeholder="Enter your registered email"
                      type="email"
                    />
                  </FormField>
                </Grid>

                {/* Country Code */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label={t("countryCode")}>
                    <Controller
                      name="country_code"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          sx={{
                            height: "44px",
                            borderRadius: "10px",
                            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
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
                  </FormField>
                </Grid>

                {/* Phone Number */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField label="Registered Phone Number">
                    <Input
                      name="phone"
                      control={control}
                      placeholder="Enter your registered number"
                      type="tel"
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormField>
                </Grid>

                {/* Reason for Deletion */}
                <Grid size={{ xs: 12 }}>
                  <FormField label="Reason for Deletion">
                    <Controller
                      name="reason"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          error={!!errors.reason}
                          sx={{
                            height: "44px",
                            borderRadius: "10px",
                            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select a reason
                          </MenuItem>
                          {REASON_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.reason && (
                      <FormHelperText error>{errors.reason.message}</FormHelperText>
                    )}
                  </FormField>
                </Grid>

                {/* Optional Reason Detail */}
                {selectedReason === "Other" && (
                  <Grid size={{ xs: 12 }}>
                    <FormField label="Please specify reason">
                      <Input
                        name="reasonDetail"
                        control={control}
                        placeholder="Describe your reason for deletion"
                        multiline
                        rows={3}
                      />
                    </FormField>
                  </Grid>
                )}

                {/* Consent Checkbox */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      borderRadius: "10px",
                      bgcolor: isDark ? "rgba(255,255,255,0.03)" : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    }}
                  >
                    <Controller
                      name="consent"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          sx={{ alignItems: "flex-start", ml: 0 }}
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              color="error"
                              sx={{ mt: -0.5 }}
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              I confirm that I want to delete my kartsquare account and all associated personal data. I understand that this action is permanent and cannot be undone.
                            </Typography>
                          }
                        />
                      )}
                    />
                    {errors.consent && (
                      <FormHelperText error sx={{ ml: 4.5 }}>{errors.consent.message}</FormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: { xs: 3, sm: 4 } }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "auto",
                    minWidth: { xs: "100%", sm: "240px" },
                    background: COLORS.ERROR_RED,
                    color: "white",
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 3, sm: 4 },
                    fontWeight: 600,
                    borderRadius: "12px",
                    "&:hover": { background: "#e03b3b" },
                  }}
                >
                  Review & Submit Request
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Important Notes / Warnings Section */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                border: `1px solid ${isDark ? "rgba(255,77,79,0.35)" : "rgba(255,77,79,0.25)"}`,
                borderRadius: { xs: "16px", sm: "20px" },
                p: { xs: 2.5, sm: 3 },
                height: "fit-content",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2.5 }}>
                <WarningIcon sx={{ color: COLORS.ERROR_RED, mt: "2px" }} />
                <Typography variant="subtitle1" fontWeight={700} color="error.main">
                  What happens when your account is deleted?
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {IMPACTS.map((impact) => {
                  const Icon = impact.icon;
                  return (
                    <Box
                      key={impact.title}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: isDark ? "rgba(255, 77, 79, 0.08)" : "rgba(255, 77, 79, 0.05)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor: isDark ? "rgba(255,77,79,0.18)" : "rgba(255,77,79,0.12)",
                        }}
                      >
                        <Icon sx={{ fontSize: 18, color: COLORS.ERROR_RED }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>
                          {impact.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.5 }}>
                          {impact.description}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Box>

      {/* Confirmation Dialog — final gate before the destructive API call */}
      <Dialog
        open={showConfirm}
        onClose={() => !isSubmitting && setShowConfirm(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: isDark ? "rgba(255,77,79,0.15)" : "rgba(255,77,79,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <DeleteForeverIcon sx={{ fontSize: 28, color: COLORS.ERROR_RED }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Delete your account?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This is your last chance to cancel. Once submitted, this request cannot be undone.
          </Typography>

          {pendingData && (
            <Box
              sx={{
                textAlign: "left",
                borderRadius: "12px",
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                p: 2,
                mb: 1,
              }}
            >
              {[
                { label: "Name", value: pendingData.name },
                { label: "Email", value: pendingData.email },
                { label: "Phone", value: `${pendingData.country_code} ${pendingData.phone}` },
                {
                  label: "Reason",
                  value: REASON_OPTIONS.find((o) => o.value === pendingData.reason)?.label || pendingData.reason,
                },
              ].map((row, i) => (
                <Box key={row.label}>
                  {i > 0 && <Divider sx={{ my: 1 }} />}
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {row.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 3, sm: 4 }, pb: { xs: 3, sm: 4 }, pt: 0, flexDirection: "column", gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            onClick={confirmDeletion}
            sx={{
              background: COLORS.ERROR_RED,
              color: "white",
              py: 1.25,
              fontWeight: 600,
              borderRadius: "12px",
              "&:hover": { background: "#e03b3b" },
            }}
          >
            {isSubmitting ? "Submitting..." : "Yes, delete my account"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            disabled={isSubmitting}
            onClick={() => setShowConfirm(false)}
            sx={{ py: 1.25, fontWeight: 600, borderRadius: "12px" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
