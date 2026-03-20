"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  FormHelperText,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ImageUploadProps {
  images: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  maxImages?: number;
  error?: boolean;
  helperText?: string;
  title?: string;
  /** "document" = compact drop zone for KYC/doc uploads */
  variant?: "default" | "document";
  /** Short hint shown below title (e.g. "Clear photo of PAN card") */
  hint?: string;
  /** Whether to allow video files */
  allowVideo?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
  error,
  helperText,
  title,
  variant = "default",
  hint,
  allowVideo = false,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [internalError, setInternalError] = useState<string>("");

  useEffect(() => {
    // Generate previews for existing files and strings
    const newPreviews = images.map((file) => {
      if (typeof file === "string") {
        return file;
      }
      return URL.createObjectURL(file);
    });
    setImagePreviews(newPreviews);

    // Cleanup function
    return () => {
      newPreviews.forEach((preview) => {
        // Only revoke blob URLs, not remote URLs
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    handleFiles(Array.from(files));
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFiles = (newFiles: File[]) => {
    const currentCount = images.length;
    const validFiles: File[] = [];
    let hasError = false;

    // Validate file types, size and count
    for (const file of newFiles) {
      const isImage = file.type.match(/image\/(jpeg|jpg|png|gif)/);
      const isVideo = allowVideo && file.type.match(/video\/(mp4|webm|ogg)/);

      if (!isImage && !isVideo) {
        setInternalError(allowVideo ? t("invalidMediaFormat") : t("invalidImageFormat"));
        hasError = true;
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setInternalError(t("imageSizeTooLarge"));
        hasError = true;
        return;
      }

      if (currentCount + validFiles.length >= maxImages) {
        setInternalError(t("maxImagesReachedAllowed", { max: maxImages }));
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (!hasError) {
      setInternalError("");
      onChange([...images, ...validFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = images.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const displayError = (error ? helperText : "") || internalError;

  const isDocument = variant === "document";

  return (
    <Box sx={{ mb: isDocument ? 0 : 3 }}>
      {title && (
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 600,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {title}
        </Typography>
      )}
      {hint && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {hint}
        </Typography>
      )}

      {/* Upload Area */}
      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${
            error || internalError
              ? theme.palette.error.main
              : isDark
                ? COLORS.BORDER.DEFAULT_DARK
                : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          borderRadius: 2,
          p: isDocument ? 2 : 4,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDark
            ? COLORS.BACKGROUND.SECONDARY_DARK
            : COLORS.BACKGROUND.SECONDARY_LIGHT,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: COLORS.PRIMARY_PURPLE,
            backgroundColor: isDark
              ? COLORS.PURPLE_ALPHA_04
              : COLORS.PURPLE_ALPHA_04,
          },
        }}
      >
        <CloudUpload
          sx={{
            fontSize: isDocument ? 32 : 48,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 1,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontSize: isDocument ? "0.8125rem" : undefined,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {isDocument
            ? t("uploadDocument")
            : allowVideo
              ? t("dragDropMedia")
              : t("dragDropImage")}
        </Typography>
        {!isDocument && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            {t("maxImages")}: {maxImages}
          </Typography>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept={
          allowVideo
            ? "image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/webm,video/ogg"
            : "image/jpeg,image/jpg,image/png,image/gif"
        }
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Error Message */}
      {displayError && (
        <FormHelperText error sx={{ mt: 1 }}>
          {displayError}
        </FormHelperText>
      )}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isDocument && imagePreviews.length === 1
              ? "1fr"
              : "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 1,
            mt: isDocument ? 1.5 : 2,
          }}
        >
          {imagePreviews.map((preview, index) => (
            <Box
              key={preview}
              sx={{
                position: "relative",
                aspectRatio: isDocument && imagePreviews.length === 1 ? "1/1" : "1/1",
                width: "100%",
                maxWidth: isDocument && imagePreviews.length === 1 ? 140 : "none",
                borderRadius: 1,
                overflow: "hidden",
                border: isDark ? "1px solid #333" : "1px solid #eee",
              }}
            >
              {preview.startsWith("blob:") &&
              images[index] instanceof File &&
              (images[index] as File).type.startsWith("video/") ? (
                <Box
                  component="video"
                  src={preview}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${preview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: COLORS.WHITE,
                  width: 24,
                  height: 24,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
