"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  useTheme,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Button from "@/components/common/Button";
import { useForm, Controller } from "react-hook-form";
import { Close, CloudUpload } from "@mui/icons-material";
import { useCreatePost } from "@/hooks/useProfile";
import { PostType, Visibility } from "@/services/post/postInterfaces";
import Image from "next/image";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGeolocation } from "@/hooks/useGeolocation";

interface AddPostFormData {
  caption: string;
  visibility: Visibility;
  images: File[];
}

interface AddPostDrawerProps {
  onClose: () => void;
}

const AddPostDrawer: React.FC<AddPostDrawerProps> = ({ onClose }) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const {
    coordinates: userCoordinates,
    error: locationError,
    getCoordinates,
  } = useGeolocation();

  useEffect(() => {
    getCoordinates();
  }, []);

  const createPostMutation = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddPostFormData>({
    defaultValues: {
      caption: "",
      visibility: Visibility.PUBLIC,
      images: [],
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    // Validate file types
    for (const file of newFiles) {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        setError(t("invalidImageFormat"));
        return;
      }

      if (selectedFiles.length + validFiles.length >= 10) {
        setError(t("maxImagesReached"));
        break;
      }

      validFiles.push(file);
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles([...selectedFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setError("");
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const onSubmit = async (data: AddPostFormData) => {
    setError("");
    if (selectedFiles.length === 0) {
      setError(t("imageRequired"));
      return;
    }

    try {
      // Convert images to base64 or upload to server
      const imageUrls: File[] = [];

      for (const file of selectedFiles) {
        imageUrls.push(file);
      }

      await createPostMutation.mutateAsync({
        caption: data.caption,
        media_urls: imageUrls,
        post_type: PostType.IMAGE,
        visibility: data.visibility,
        location_name: "",
        latitude: userCoordinates?.latitude || 0,
        longitude: userCoordinates?.longitude || 0,
        mentions: [],
      });

      // Clean up
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      reset();
      setImagePreviews([]);
      setSelectedFiles([]);
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(
        error?.data?.message || error?.message || t("postCreationFailed"),
      );
    }
  };

  const convertToBase64 = (
    file: File,
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 3, px: 1 }}>
          <ErrorMessage
            error={error || locationError || ""}
            isVisible={!!error || !!locationError}
          />
        </Box>
        {/* Image Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("selectImages")}
          </Typography>

          {/* Upload Area */}
          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
              borderRadius: 2,
              p: 4,
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
              {t("dragDropImage")}
            </Typography>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: 1,
                mt: 2,
              }}
            >
              {imagePreviews.map((preview, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    paddingTop: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
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

        {/* Caption Input */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="caption"
            control={control}
            rules={{
              maxLength: {
                value: 2200,
                message: t("captionMaxLength"),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                fullWidth
                placeholder={t("captionPlaceholder")}
                error={!!errors.caption}
                helperText={errors.caption?.message}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? COLORS.BACKGROUND.SECONDARY_DARK
                      : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Visibility Selector */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label={t("selectVisibility")}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? COLORS.BACKGROUND.SECONDARY_DARK
                      : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  },
                }}
              >
                <MenuItem value={Visibility.PUBLIC}>{t("public")}</MenuItem>
                <MenuItem value={Visibility.FRIENDS}>{t("friends")}</MenuItem>
                <MenuItem value={Visibility.PRIVATE}>{t("private")}</MenuItem>
              </TextField>
            )}
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          isLoading={createPostMutation.isPending}
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? t("uploadingPost") : t("createPost")}
        </Button>
      </form>
    </Box>
  );
};

export default AddPostDrawer;
