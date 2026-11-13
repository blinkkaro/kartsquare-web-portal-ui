import React, { useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Dialog,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBackRounded,
  CloseRounded,
  PhotoCameraRounded,
  SwapHorizRounded,
  TimerOutlined,
  VideocamRounded,
} from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { MediaType } from "@/services/stories/stories.interface";

const MAX_CAPTION = 200;

interface AddStoryModalProps {
  open: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  onAddVideo: () => void;
  file: File | null;
  mediaType: MediaType;
  onShare: (caption: string) => void;
  isLoading?: boolean;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Add-a-story flow, two steps in one dialog: choose photo or video, then preview it in a portrait frame
 * (the shape stories are viewed in) with an optional caption. Full screen on phones.
 */
const AddStoryModal: React.FC<AddStoryModalProps> = ({
  open,
  onClose,
  onAddPhoto,
  onAddVideo,
  file,
  mediaType,
  onShare,
  isLoading,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const [caption, setCaption] = useState("");

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const choices = [
    {
      key: "photo",
      label: t("st_photo"),
      hint: t("st_photo_hint"),
      icon: <PhotoCameraRounded sx={{ fontSize: 32 }} />,
      tint: COLORS.PRIMARY_PURPLE,
      action: onAddPhoto,
    },
    {
      key: "video",
      label: t("st_video"),
      hint: t("st_video_hint"),
      icon: <VideocamRounded sx={{ fontSize: 32 }} />,
      tint: COLORS.SECONDARY_ORANGE,
      action: onAddVideo,
    },
  ];

  const close = () => {
    setCaption("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : close}
      fullWidth
      fullScreen={isPhone && Boolean(file)}
      maxWidth={file ? "md" : "xs"}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isPhone && file ? 0 : "24px",
            backgroundImage: "none",
            bgcolor: COLORS.WHITE,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          p: 2,
          pl: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          {file && !isLoading && (
            <IconButton onClick={close} aria-label={t("st_back")} sx={{ width: 44, height: 44 }}>
              <ArrowBackRounded />
            </IconButton>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              {file ? t("st_preview") : t("st_title")}
            </Typography>
            {!file && (
              <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                {t("st_sub")}
              </Typography>
            )}
          </Box>
        </Box>
        {!isLoading && (
          <IconButton onClick={close} aria-label={t("pd_nav_close")} sx={{ width: 44, height: 44 }}>
            <CloseRounded />
          </IconButton>
        )}
      </Box>

      {!file ? (
        /* Step 1: choose what to add */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
            p: 3,
            pt: 1,
          }}
        >
          {choices.map((c, i) => (
            <Box
              key={c.key}
              component={motion.button}
              type="button"
              onClick={c.action}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.05 * i, duration: 0.25, ease: "easeOut" }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 3,
                minHeight: 180,
                justifyContent: "center",
                cursor: "pointer",
                font: "inherit",
                color: "inherit",
                textAlign: "center",
                borderRadius: "16px",
                border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
                background: `linear-gradient(160deg, ${alpha(c.tint, 0.1)} 0%, ${COLORS.WHITE} 70%)`,
                transition:
                  "border-color 200ms ease-out, box-shadow 200ms ease-out, transform 200ms ease-out",
                "&:hover": {
                  borderColor: c.tint,
                  boxShadow: `0 8px 20px ${alpha(c.tint, 0.2)}`,
                  transform: "translateY(-2px)",
                },
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
                  bgcolor: c.tint,
                  boxShadow: `0 8px 18px ${alpha(c.tint, 0.35)}`,
                }}
              >
                {c.icon}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {c.label}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                {c.hint}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        /* Step 2: preview in a portrait frame, then caption and share */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
            gap: 3,
            p: 3,
            pt: 1,
            alignItems: "start",
          }}
        >
          <Box
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              position: "relative",
              mx: "auto",
              width: "100%",
              maxWidth: 300,
              aspectRatio: "9 / 16",
              maxHeight: { xs: "52vh", sm: "60vh" },
              borderRadius: "20px",
              overflow: "hidden",
              bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
              border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
            }}
          >
            {previewUrl &&
              (mediaType === MediaType.VIDEO ? (
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
                  alt={t("st_preview")}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                {formatSize(file.size)}
              </Typography>
            </Box>

            <Box>
              <TextField
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
                placeholder={t("st_caption_ph")}
                multiline
                rows={3}
                fullWidth
                disabled={isLoading}
                slotProps={{ htmlInput: { "aria-label": t("st_caption_label") } }}
                sx={{ "& .MuiInputBase-root": { borderRadius: "12px", bgcolor: COLORS.WHITE } }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  color:
                    caption.length > MAX_CAPTION * 0.9
                      ? COLORS.SECONDARY_ORANGE
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {t("cp_counter", { count: caption.length, max: MAX_CAPTION })}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              <TimerOutlined fontSize="small" />
              <Typography variant="body2">{t("st_expires")}</Typography>
            </Box>

            <Box sx={{ mt: "auto" }}>
              {isLoading && <LinearProgress sx={{ mb: 1.5, borderRadius: "2px" }} />}
              <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={mediaType === MediaType.VIDEO ? onAddVideo : onAddPhoto}
                  disabled={isLoading}
                  startIcon={<SwapHorizRounded />}
                  sx={{ minHeight: 44, px: 2.5 }}
                >
                  {t("st_change")}
                </Button>
                <Button
                  fullWidth
                  onClick={() => onShare(caption)}
                  disabled={isLoading}
                  sx={{ minHeight: 44 }}
                >
                  {isLoading ? t("st_sharing") : t("st_share")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default AddStoryModal;
