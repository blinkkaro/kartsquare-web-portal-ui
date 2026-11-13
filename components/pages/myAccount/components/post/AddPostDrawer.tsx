"use client";

import React, { useState, useEffect } from "react";
import { alpha, Avatar, Box, ButtonBase, Chip, Collapse, LinearProgress, TextField, Typography } from "@mui/material";
import { ExpandMoreRounded, LocationOffRounded, PlaceRounded, TipsAndUpdatesRounded } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Button from "@/components/common/Button";
import { useForm, Controller } from "react-hook-form";
import { useCreatePost } from "@/hooks/useProfile";
import { Visibility } from "@/services/post/postInterfaces";
import { postTypeForFiles } from "@/services/post/postMedia";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/features/ui/authSlice";
import PostMediaPicker from "./PostMediaPicker";

const MAX_CAPTION = 2200;

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
  const reduceMotion = useReducedMotion();
  const currentUser = useAppSelector(selectCurrentUser);
  const [tipsOpen, setTipsOpen] = useState(false);

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

  const { coordinates: userCoordinates, getCoordinates } = useGeolocation();

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

    // Video only → a "video" post, which is what the Reels feed shows.
    const postType = postTypeForFiles(selectedFiles);

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
        // Audience choice is hidden for now: every post is public.
        visibility: Visibility.PUBLIC,
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

  const busy = createPostMutation.isPending || compressing;
  const authorName = `${currentUser?.first_name ?? ""} ${currentUser?.last_name ?? ""}`.trim();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: { xs: 2, md: 3 }, pb: 0 }}>
      {/* Banner: who is posting, in the same violet-and-orange look as the dashboard. */}
      <Box
        component={motion.div}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          mb: 3,
          borderRadius: "16px",
          color: COLORS.WHITE,
          background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PRIMARY_PURPLE} 100%)`,
        }}
      >
        <Box
          aria-hidden
          sx={{ position: "absolute", right: -24, top: -40, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha(COLORS.SECONDARY_ORANGE, 0.45), filter: "blur(32px)" }}
        />
        <Avatar src={currentUser?.profile_pic || undefined} alt={authorName} sx={{ position: "relative", width: 48, height: 48, border: `2px solid ${COLORS.WHITE}` }}>
          {authorName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ position: "relative", minWidth: 0 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {t("cp_posting_as", { name: authorName })}
          </Typography>
          <Typography variant="h6" component="p">
            {t("cp_banner_title")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {t("cp_banner_sub")}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <ErrorMessage error={error} isVisible={!!error} />
      </Box>

      <Step n={1} title={t("cp_step_media")}>
        <PostMediaPicker
          file={selectedFiles[0] ?? null}
          onChange={(f) => setSelectedFiles(f ? [f] : [])}
          error={error && selectedFiles.length === 0 ? error : undefined}
        />
      </Step>

      <Step n={2} title={t("cp_step_caption")}>
        <Controller
          name="caption"
          control={control}
          rules={{ maxLength: { value: MAX_CAPTION, message: t("captionMaxLength") } }}
          render={({ field }) => {
            const count = field.value.length;
            const near = count > MAX_CAPTION * 0.9;
            return (
              <Box>
                <TextField
                  {...field}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder={t("captionPlaceholder")}
                  error={!!errors.caption}
                  helperText={errors.caption?.message}
                  slotProps={{ htmlInput: { "aria-label": t("cp_step_caption") } }}
                  sx={{ "& .MuiInputBase-root": { borderRadius: "12px", bgcolor: COLORS.WHITE } }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
                  <Box sx={{ flex: 1, height: 4, borderRadius: "2px", bgcolor: COLORS.PURPLE_ALPHA_10, overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        transformOrigin: "left",
                        transform: `scaleX(${Math.min(count / MAX_CAPTION, 1)})`,
                        bgcolor: count > MAX_CAPTION ? COLORS.ERROR_RED : near ? COLORS.SECONDARY_ORANGE : COLORS.PRIMARY_PURPLE,
                        transition: "transform 200ms ease-out, background-color 200ms ease-out",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontVariantNumeric: "tabular-nums" }}>
                    {t("cp_counter", { count, max: MAX_CAPTION })}
                  </Typography>
                </Box>
              </Box>
            );
          }}
        />
      </Step>

      {/* What the post will carry, and tips. Nothing here is a promise about reach. */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Chip
          icon={userCoordinates ? <PlaceRounded /> : <LocationOffRounded />}
          label={userCoordinates ? t("cp_loc_on") : t("cp_loc_off")}
          size="small"
          sx={{ bgcolor: COLORS.WHITE, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`, fontWeight: 600 }}
        />
      </Box>
      <Box sx={{ mb: 3, borderRadius: "16px", bgcolor: COLORS.WHITE, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}` }}>
        <ButtonBase
          onClick={() => setTipsOpen((v) => !v)}
          aria-expanded={tipsOpen}
          sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 48, px: 2, borderRadius: "16px", "&.Mui-focusVisible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: COLORS.PRIMARY_PURPLE }}>
            <TipsAndUpdatesRounded fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.TEXT.PRIMARY_LIGHT }}>
              {t("cp_tips_title")}
            </Typography>
          </Box>
          <ExpandMoreRounded sx={{ transform: tipsOpen ? "rotate(180deg)" : "none", transition: "transform 200ms ease-out" }} />
        </ButtonBase>
        <Collapse in={tipsOpen}>
          <Box component="ul" sx={{ m: 0, pl: 5, pr: 2, pb: 2, display: "flex", flexDirection: "column", gap: 0.5, color: COLORS.TEXT.SECONDARY_LIGHT }}>
            {(["cp_tip_1", "cp_tip_2", "cp_tip_3"] as const).map((k) => (
              <Typography key={k} component="li" variant="body2">
                {t(k)}
              </Typography>
            ))}
          </Box>
        </Collapse>
      </Box>

      {/* Sticky action bar: always in reach, however long the form is. */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          mx: { xs: -2, md: -3 },
          px: { xs: 2, md: 3 },
          py: 2,
          bgcolor: COLORS.WHITE,
          borderTop: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
          zIndex: 1,
        }}
      >
        {busy && <LinearProgress sx={{ mb: 1.5, borderRadius: "2px" }} />}
        <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose} disabled={busy} sx={{ minHeight: 44, px: 2.5 }}>
            {t("cp_cancel")}
          </Button>
          <Button type="submit" fullWidth isLoading={busy} disabled={busy} sx={{ minHeight: 44 }}>
            {busy ? (compressing ? t("compressingVideo") : t("uploadingPost")) : t("createPost")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

/** A numbered section: the number gives the form a clear order. */
const Step: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <Box component="section" sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
      <Box
        aria-hidden
        sx={{ width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 700, fontSize: "0.875rem" }}
      >
        {n}
      </Box>
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

export default AddPostDrawer;
