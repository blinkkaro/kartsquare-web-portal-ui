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
} from "@/services/advertise/advertise.intreface";
import { CloudUpload } from "@mui/icons-material";

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
  const isDark = theme.palette.mode === "dark";
  const isEditMode = !!advertiseId;

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

  // Load ad data for edit mode
  useEffect(() => {
    console.log("Edit mode:", isEditMode, "Ad data:", adData);
    if (isEditMode && adData) {
      console.log("Loading ad data into form:", adData);

      // Convert UTC dates to local datetime-local format
      // The API returns UTC dates, but datetime-local input expects local time
      // We need to display the UTC time as-is without timezone conversion
      const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        // Get the ISO string and remove the 'Z' to treat it as local time
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_id) newErrors.service_id = "Service is required";
    // Title and description are now optional
    if (!formData.image_url) newErrors.image_url = "Image is required";
    if (!formData.start_at) newErrors.start_at = "Start date is required";
    if (!formData.expires_at) newErrors.expires_at = "End date is required";

    if (
      formData.start_at &&
      formData.expires_at &&
      new Date(formData.start_at) >= new Date(formData.expires_at)
    ) {
      newErrors.expires_at = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

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
        const updateData: AdvertiseUpdate = {
          advertise_id: advertiseId!,
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          start_at: startAtUTC,
          expires_at: expiresAtUTC,
        };
        await updateMutation.mutateAsync(updateData);
      } else {
        const createData: AdvertiseCreate = {
          service_id: formData.service_id,
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          start_at: startAtUTC,
          expires_at: expiresAtUTC,
        };
        await createMutation.mutateAsync(createData);
      }
      onSuccess();
    } catch (error) {
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
        {/* Service Selection */}
        <TextField
          select
          label="Service"
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
            <em>Select a service</em>
          </MenuItem>
          {services.map((service) => (
            <MenuItem key={service.service_id} value={service.service_id}>
              {service.service_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Title */}
        <TextField
          label="Advertisement Title (Optional)"
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
          label="Description (Optional)"
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
                ⚠️ Rejection Reason
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
            Advertisement Image
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
                  Click to upload image
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
          label="Start Date"
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
          label="End Date"
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
            Cancel
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
              "Update Advertisement"
            ) : (
              "Create Advertisement"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AdForm;
