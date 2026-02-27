"use client";
import React from "react";
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";

interface ServiceImageUploadProps {
  mainImagePreview: string | null;
  onMainImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMainImage: () => void;
  selectedImages: File[];
  imagePreviews: string[];
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

const ServiceImageUpload = ({
  mainImagePreview,
  onMainImageSelect,
  onRemoveMainImage,
  selectedImages,
  imagePreviews,
  onImageSelect,
  onRemoveImage,
}: ServiceImageUploadProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ mb: 1, mt: 2, fontWeight: 500 }}>
        Main Image (Required)
        <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        This will be the primary image displayed for your service.
      </Typography>

      {mainImagePreview ? (
        <Box
          sx={{
            position: "relative",
            width: "140px",
            height: "140px",
            borderRadius: "8px",
            overflow: "hidden",
            mb: 3,
            border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
          }}
        >
          <img
            src={mainImagePreview}
            alt="Main Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <IconButton
            size="small"
            onClick={onRemoveMainImage}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          sx={{
            mb: 3,
            borderColor: COLORS.PRIMARY_PURPLE,
            color: COLORS.PRIMARY_PURPLE,
            "&:hover": {
              borderColor: COLORS.PURPLE_HOVER,
              bgcolor: COLORS.PURPLE_ALPHA_04,
            },
          }}
        >
          Upload Main Image
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png"
            onChange={onMainImageSelect}
          />
        </Button>
      )}

      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 500,
          pt: 2,
          borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
        }}
      >
        {english.upload_images} (Optional Additional Images)
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        {english.upload_images_helper}
      </Typography>

      {/* Upload Button */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUpload />}
        disabled={imagePreviews.length >= 6}
        sx={{
          mb: 2,
          borderColor: COLORS.PRIMARY_PURPLE,
          color: COLORS.PRIMARY_PURPLE,
          "&:hover": {
            borderColor: COLORS.PURPLE_HOVER,
            bgcolor: COLORS.PURPLE_ALPHA_04,
          },
        }}
      >
        {english.upload_images_count.replace(
          "{count}",
          imagePreviews.length.toString(),
        )}
        <input
          type="file"
          hidden
          multiple
          accept="image/jpeg,image/png"
          onChange={onImageSelect}
        />
      </Button>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {imagePreviews.map((preview, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              }}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={() => onRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServiceImageUpload;
