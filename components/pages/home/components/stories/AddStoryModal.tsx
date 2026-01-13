import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Box,
  useTheme,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Videocam, Close, ArrowBack } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { MediaType } from "@/services/stories/stories.interface";
import Image from "next/image";

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
  const { t } = useTranslationContext();
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setCaption("");
    }
  }, [file]);

  const options = [
    {
      label: t("addPhoto"),
      Icon: PhotoCamera,
      action: onAddPhoto,
      color: COLORS.PRIMARY_PURPLE,
    },
    {
      label: t("addVideo"),
      Icon: Videocam,
      action: onAddVideo,
      color: COLORS.SECONDARY_ORANGE,
    },
  ];

  const handleShare = () => {
    onShare(caption);
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth={file ? "sm" : "xs"}
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          backgroundImage: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: file
            ? `1px solid ${
                isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT
              }`
            : "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {file && !isLoading && (
            <IconButton onClick={onClose} size="small">
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight="bold">
            {file ? t("preview") : t("addToStory")}
          </Typography>
        </Box>
        {!isLoading && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      <DialogContent sx={{ p: file ? 0 : 3 }}>
        {!file ? (
          <Stack spacing={2}>
            {options.map((option, index) => (
              <Box
                key={index}
                onClick={option.action}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  border: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                    transform: "translateY(-2px)",
                    boxShadow: COLORS.SHADOW.LIGHT,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: `${option.color}20`,
                    color: option.color,
                  }}
                >
                  <option.Icon sx={{ fontSize: 32, color: option.color }} />
                </Box>
                <Typography variant="body1" fontWeight={600}>
                  {option.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              height: { sm: 400 },
            }}
          >
            {/* Media Preview */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                minHeight: 300,
              }}
            >
              {mediaType === MediaType.VIDEO ? (
                <video
                  src={previewUrl || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  controls
                />
              ) : (
                <Image
                  src={previewUrl || ""}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>

            {/* Caption Area */}
            <Box
              sx={{
                width: { xs: "100%", sm: 250 },
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderLeft: {
                  sm: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                },
              }}
            >
              <TextField
                placeholder={t("addCaption")}
                multiline
                rows={4}
                fullWidth
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "0.9rem" },
                }}
                disabled={isLoading}
              />
              <Box sx={{ flex: 1 }} />
              <Button
                fullWidth
                variant="contained"
                onClick={handleShare}
                disabled={isLoading}
                sx={{
                  mt: 2,
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("share")
                )}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStoryModal;
