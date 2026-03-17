"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useProviderServicesList } from "@/hooks/useServicesList";
import {
  useCreateAdvertisement,
  useUpdateAdvertisement,
  useAdvertisementById,
} from "@/hooks/useAdvertisements";
import {
  AdvertiseCreate,
  AdvertiseUpdate,
  ad_status_type,
} from "@/services/advertise/advertise.intreface";
import { CloudUpload } from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";
import ErrorMessage from "@/components/common/ErrorMessage";

interface AdFormProps {
  advertiseId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdForm: React.FC<AdFormProps> = ({
  advertiseId,
  onSuccess,
  onCancel,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const isEditMode = !!advertiseId;
  const [error, setError] = useState<string>("");

  // Hooks
  const { data: servicesData } = useProviderServicesList();
  const { data: adData, isLoading: isLoadingAd } = useAdvertisementById(
    advertiseId || "",
    isEditMode,
  );
  const createMutation = useCreateAdvertisement();
  const updateMutation = useUpdateAdvertisement();

  const services = servicesData?.services || [];

  // Form state
  const [formData, setFormData] = useState({
    service_id: "",
    title: "",
    description: "",
    image_url: "",
    start_at: "",
    expires_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);

  // Load ad data for edit mode
  useEffect(() => {
    if (isEditMode && adData) {
      const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      setFormData({
        service_id: adData.service_id || "",
        title: adData.title || "",
        description: adData.description || "",
        image_url: adData.image_url || "",
        start_at: adData.start_at ? formatDateForInput(adData.start_at) : "",
        expires_at: adData.expires_at
          ? formatDateForInput(adData.expires_at)
          : "",
      });
      setImagePreview(adData.image_url || "");
      setIsActive(adData.ad_status === ad_status_type.ACTIVE);
    }
  }, [isEditMode, adData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          image_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_id)
      newErrors.service_id = t("ad_validation_service_required");
    // Title and description are now optional
    if (!formData.image_url)
      newErrors.image_url = t("ad_validation_image_required");
    if (!formData.start_at)
      newErrors.start_at = t("ad_validation_start_date_required");
    if (!formData.expires_at)
      newErrors.expires_at = t("ad_validation_end_date_required");

    if (
      formData.start_at &&
      formData.expires_at &&
      new Date(formData.start_at) >= new Date(formData.expires_at)
    ) {
      newErrors.expires_at = t("ad_validation_end_after_start");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError("");
    try {
      const createUTCDate = (dateTimeString: string) => {
        const [datePart, timePart] = dateTimeString.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);

        return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
      };

      const startAtUTC = createUTCDate(formData.start_at);
      const expiresAtUTC = createUTCDate(formData.expires_at);

      if (isEditMode) {
        const updateData: Omit<AdvertiseUpdate, "image_url"> = {
          advertise_id: advertiseId!,
          title: formData.title,
          description: formData.description,
          start_at: startAtUTC,
          expires_at: expiresAtUTC,
          status: isActive ? ad_status_type.ACTIVE : ad_status_type.INACTIVE,
        };
        await updateMutation.mutateAsync({
          data: updateData,
          imageFile: imageFile || undefined,
        });
      } else {
        const createData: Omit<AdvertiseCreate, "image_url"> = {
          service_id: formData.service_id,
          title: formData.title,
          description: formData.description,
          start_at: startAtUTC,
          expires_at: expiresAtUTC,
        };
        await createMutation.mutateAsync({
          data: createData,
          imageFile: imageFile!,
        });
      }
      onSuccess();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save advertisement";
      setError(errorMessage);
      console.error("Failed to save advertisement:", error);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingAd) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          p: 3,
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Error Message */}
        <ErrorMessage error={error} isVisible={!!error} />
        {/* Service Selection */}
        <TextField
          select
          label={t("ad_form_service")}
          value={formData.service_id}
          onChange={(e) => handleChange("service_id", e.target.value)}
          error={!!errors.service_id}
          helperText={errors.service_id}
          disabled={isSubmitting}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        >
          <MenuItem value="">
            <em>{t("ad_form_select_service")}</em>
          </MenuItem>
          {services.map((service) => (
            <MenuItem key={service.service_id} value={service.service_id}>
              {service.service_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Title */}
        <TextField
          label={t("ad_form_title")}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          disabled={isSubmitting}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        {/* Description */}
        <TextField
          label={t("ad_form_description")}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          disabled={isSubmitting}
          multiline
          rows={4}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />

        {/* Rejection Reason - Only show if status is rejected */}
        {isEditMode &&
          adData?.ad_status === "rejected" &&
          adData?.ad_reject_reason && (
            <Box
              sx={{
                bgcolor: isDark
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#EF4444",
                  fontWeight: 600,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {t("ad_form_rejection_reason_label")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  lineHeight: 1.6,
                }}
              >
                {adData.ad_reject_reason}
              </Typography>
            </Box>
          )}

        {/* Status Display - Based on ad_status */}
        {isEditMode && adData && (
          <Box>
            {adData.ad_status ===
            ad_status_type.REJECTED ? null : adData.ad_status === // Don't show status controls for rejected ads
              ad_status_type.PENDING ? (
              // Show waiting message for pending ads
              <Box
                sx={{
                  bgcolor: isDark
                    ? "rgba(251, 191, 36, 0.1)"
                    : "rgba(251, 191, 36, 0.05)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "24px",
                  }}
                >
                  ⏳
                </Typography>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#F59E0B",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {t("ad_form_waiting_approval")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: "0.875rem",
                    }}
                  >
                    {t("ad_form_under_review")}
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Show active/inactive switch for approved ads
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  border: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  borderRadius: "12px",
                  p: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                  }}
                >
                  {t("ad_form_advertisement_status")}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(e) => handleStatusToggle(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: COLORS.PRIMARY_PURPLE,
                          },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? COLORS.TEXT.PRIMARY_DARK
                            : COLORS.TEXT.PRIMARY_LIGHT,
                          fontWeight: 500,
                        }}
                      >
                        {isActive
                          ? t("ad_status_active")
                          : t("ad_status_inactive")}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        )}

        {/* Image Upload */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("ad_form_image")}
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${errors.image_url ? "#EF4444" : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              borderRadius: "12px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                bgcolor: COLORS.PURPLE_ALPHA_04,
              },
            }}
            onClick={() => document.getElementById("ad-image-upload")?.click()}
          >
            {imagePreview ? (
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: "8px",
                }}
              />
            ) : (
              <Box>
                <CloudUpload
                  sx={{
                    fontSize: 48,
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("ad_form_click_to_upload")}
                </Typography>
              </Box>
            )}
            <input
              id="ad-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={isSubmitting}
            />
          </Box>
          {errors.image_url && (
            <Typography variant="caption" sx={{ color: "#EF4444", mt: 0.5 }}>
              {errors.image_url}
            </Typography>
          )}
        </Box>

        {/* Start Date */}
        <TextField
          label={t("ad_form_start_date")}
          type="datetime-local"
          value={formData.start_at}
          onChange={(e) => handleChange("start_at", e.target.value)}
          error={!!errors.start_at}
          helperText={errors.start_at}
          disabled={isSubmitting}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& input[type='datetime-local']": {
              colorScheme: isDark ? "dark" : "light",
            },
          }}
        />

        {/* End Date */}
        <TextField
          label={t("ad_form_end_date")}
          type="datetime-local"
          value={formData.expires_at}
          onChange={(e) => handleChange("expires_at", e.target.value)}
          error={!!errors.expires_at}
          helperText={errors.expires_at}
          disabled={isSubmitting}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& input[type='datetime-local']": {
              colorScheme: isDark ? "dark" : "light",
            },
          }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              borderColor: isDark
                ? COLORS.BORDER.DEFAULT_DARK
                : COLORS.BORDER.DEFAULT_LIGHT,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                bgcolor: COLORS.PURPLE_ALPHA_04,
              },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: COLORS.WHITE,
              "&:hover": {
                bgcolor: COLORS.PURPLE_HOVER,
              },
              "&:disabled": {
                bgcolor: "rgba(124, 58, 237, 0.5)",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: COLORS.WHITE }} />
            ) : isEditMode ? (
              t("update_advertisement")
            ) : (
              t("create_advertisement")
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdForm;
