"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { alpha, Box, Typography } from "@mui/material";
import {
  AddPhotoAlternateRounded,
  DeleteOutlineRounded,
  SwapHorizRounded,
} from "@mui/icons-material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB, the limit the shared uploader uses too
const IMAGE_TYPE = /^image\/(jpeg|jpg|png|gif)$/;
const VIDEO_TYPE = /^video\/(mp4|webm|ogg)$/;

interface PostMediaPickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  /** Message from the form (for example "an image is required"). */
  error?: string;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Drop zone while empty, preview while filled. One file, photo or video. */
const PostMediaPicker: React.FC<PostMediaPickerProps> = ({ file, onChange, error }) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pickError, setPickError] = useState("");

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const accept = (picked: File | undefined) => {
    if (!picked) return;
    if (!IMAGE_TYPE.test(picked.type) && !VIDEO_TYPE.test(picked.type)) {
      setPickError(t("cp_err_format"));
      return;
    }
    if (picked.size > MAX_FILE_SIZE) {
      setPickError(t("cp_err_size"));
      return;
    }
    setPickError("");
    onChange(picked);
  };

  const isVideo = Boolean(file?.type.startsWith("video/"));
  const shownError = pickError || error;
  const openPicker = () => inputRef.current?.click();

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/gif,video/mp4,video/webm,video/ogg"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {file && previewUrl ? (
          <Box
            key="preview"
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
              bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
            }}
          >
            <Box sx={{ position: "relative", aspectRatio: "4 / 3", maxHeight: 380, width: "100%" }}>
              {isVideo ? (
                <Box
                  component="video"
                  src={previewUrl}
                  controls
                  muted
                  playsInline
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                px: 2,
                py: 1.5,
                bgcolor: COLORS.WHITE,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                  {formatSize(file.size)}
                  {isVideo ? ` · ${t("cp_reels_note")}` : ""}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={openPicker}
                  startIcon={<SwapHorizRounded />}
                  sx={{ minHeight: 44, px: 2.5 }}
                >
                  {t("cp_replace")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onChange(null)}
                  startIcon={<DeleteOutlineRounded />}
                  sx={{ minHeight: 44, px: 2.5 }}
                >
                  {t("cp_remove")}
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            key="drop"
            component={motion.button}
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={openPicker}
            onDragOver={(e: React.DragEvent) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e: React.DragEvent) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files?.[0]);
            }}
            aria-label={t("cp_drop_title")}
            sx={{
              width: "100%",
              minHeight: 232,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 3,
              cursor: "pointer",
              font: "inherit",
              color: "inherit",
              borderRadius: "16px",
              border: `2px dashed ${dragging || shownError ? (shownError ? COLORS.ERROR_RED : COLORS.PRIMARY_PURPLE) : COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT}`,
              background: dragging
                ? COLORS.PURPLE_ALPHA_10
                : `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_04} 0%, ${alpha(COLORS.SECONDARY_ORANGE, 0.06)} 100%)`,
              transition:
                "border-color 200ms ease-out, background-color 200ms ease-out, transform 200ms ease-out",
              "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, transform: "translateY(-2px)" },
              "&:focus-visible": {
                outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                outlineOffset: 2,
              },
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
                "&:hover": { transform: "none" },
              },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: COLORS.WHITE,
                background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_DEEP})`,
                boxShadow: `0 8px 20px ${alpha(COLORS.PRIMARY_PURPLE, 0.35)}`,
              }}
            >
              <AddPhotoAlternateRounded sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h6" component="span">
              {t("cp_drop_title")}
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
              {t("cp_drop_hint")}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
              {t("cp_drop_formats")}
            </Typography>
          </Box>
        )}
      </AnimatePresence>

      {shownError && (
        <Typography
          role="alert"
          variant="body2"
          sx={{ color: COLORS.ERROR_RED, mt: 1, fontWeight: 600 }}
        >
          {shownError}
        </Typography>
      )}
    </Box>
  );
};

export default PostMediaPicker;
