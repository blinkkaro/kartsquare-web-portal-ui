"use client";

import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem, useTheme } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Button from "@/components/common/Button";
import { useForm, Controller } from "react-hook-form";
import { useCreatePost } from "@/hooks/useProfile";
import { PostType, Visibility } from "@/services/post/postInterfaces";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGeolocation } from "@/hooks/useGeolocation";
import ImageUpload from "@/components/common/ImageUpload";

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

  const onSubmit = async (data: AddPostFormData) => {
    setError("");
    if (selectedFiles.length === 0) {
      setError(t("imageRequired"));
      return;
    }

    try {
      const imageUrls: File[] = [];

      for (const file of selectedFiles) {
        imageUrls.push(file);
      }

      await createPostMutation.mutateAsync({
        caption: data.caption,
        media_urls: imageUrls,
        post_type: PostType.IMAGE,
        visibility: data.visibility,
        location_name: "", // You might want to get this from reverse geocoding if needed
        latitude: userCoordinates?.latitude || 0,
        longitude: userCoordinates?.longitude || 0,
        mentions: [],
      });

      reset();
      setSelectedFiles([]);
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(
        error?.data?.message || error?.message || t("postCreationFailed"),
      );
    }
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
        <ImageUpload
          images={selectedFiles}
          onChange={setSelectedFiles}
          maxImages={10}
          error={!!error && selectedFiles.length === 0}
          helperText={selectedFiles.length === 0 ? error : ""}
          title={t("selectImages")}
        />

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
