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
  media: File[];
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
  const [compressing, setCompressing] = useState(false);

  const generateThumbnail = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      video.src = url;
      video.currentTime = 1; // Capture at 1 second
      
      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
            URL.revokeObjectURL(url);
            resolve(thumbFile);
          } else {
            reject(new Error("Thumbnail generation failed"));
          }
        }, "image/jpeg", 0.7);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Video load failed for thumbnail"));
      };
    });
  };

  const compressVideo = async (file: File): Promise<File> => {
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size <= MAX_SIZE) return file;

    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      video.src = url;
      video.muted = false; // Need sound!
      video.volume = 0; // But don't blast it to the user
      video.play();

      video.onloadeddata = () => {
        let stream;
        try {
          stream = (video as any).captureStream();
        } catch (e) {
          // Fallback if captureStream fails
          URL.revokeObjectURL(url);
          resolve(file); 
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8,opus", // Include opus for audio
          videoBitsPerSecond: 2500000, // 2.5Mbps for better quality
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webm"), {
            type: "video/webm",
          });
          URL.revokeObjectURL(url);
          resolve(compressedFile);
        };

        mediaRecorder.start();
        video.onended = () => mediaRecorder.stop();
        
        setTimeout(() => {
          if (mediaRecorder.state === "recording") mediaRecorder.stop();
        }, (video.duration + 1) * 1000);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Video load failed"));
      };
    });
  };

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
      media: [],
    },
  });

  const onSubmit = async (data: AddPostFormData) => {
    setError("");
    if (selectedFiles.length === 0) {
      setError(t("imageRequired"));
      return;
    }

    const isVideo = selectedFiles.some((file) => file.type.startsWith("video/"));
    const isImage = selectedFiles.some((file) => file.type.startsWith("image/"));

    let postType: PostType = PostType.IMAGE;
    if (isVideo && isImage) {
      postType = PostType.MIXED;
    } else if (isVideo) {
      postType = PostType.VIDEO;
    }

    try {
      setCompressing(true);
      const processedFiles: File[] = [];

      for (const file of selectedFiles) {
        if (file.type.startsWith("video/")) {
          // 1. Generate thumbnail first
          try {
            const thumbnail = await generateThumbnail(file);
            processedFiles.push(thumbnail);
          } catch (e) {
            console.error("Thumbnail generation failed", e);
          }

          // 2. Compress video if needed (increased limit to 20MB)
          if (file.size > 20 * 1024 * 1024) {
            try {
              const compressed = await compressVideo(file);
              processedFiles.push(compressed);
            } catch (e) {
              console.error("Compression failed, using original", e);
              processedFiles.push(file);
            }
          } else {
            processedFiles.push(file);
          }
        } else {
          processedFiles.push(file);
        }
      }
      
      await createPostMutation.mutateAsync({
        caption: data.caption,
        media_urls: processedFiles,
        post_type: postType,
        visibility: data.visibility,
        location_name: "", 
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
    } finally {
      setCompressing(false);
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
          onChange={(files) => setSelectedFiles(files as File[])}
          maxImages={1}
          error={!!error && selectedFiles.length === 0}
          helperText={selectedFiles.length === 0 ? error : ""}
          title={t("selectMedia")}
          allowVideo={true}
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
          isLoading={createPostMutation.isPending || compressing}
          disabled={createPostMutation.isPending || compressing}
        >
          {createPostMutation.isPending || compressing
            ? compressing
              ? t("compressingVideo")
              : t("uploadingPost")
            : t("createPost")}
        </Button>
      </form>
    </Box>
  );
};

export default AddPostDrawer;
