import React, { useRef, useState, useCallback, ReactNode } from "react";
import { Box, Typography, Modal, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CloudUpload as CloudUploadIcon,
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  Cameraswitch as FlipCameraIcon,
  RadioButtonChecked,
} from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Button from "@/components/common/Button";

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File) => void;
  error?: string;
  previewUrl?: string | null;
  icon?: ReactNode;
  description?: string;
}

const UploadCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragActive",
})<{ isDragActive?: boolean }>(({ theme, isDragActive }) => ({
  border: `1px solid ${
    isDragActive ? COLORS.PRIMARY_PURPLE : theme.palette.divider
  }`,
  borderRadius: "16px",
  padding: theme.spacing(3),
  backgroundColor: isDragActive
    ? COLORS.PURPLE_ALPHA_04
    : theme.palette.background.paper,
  display: "flex",
  flexDirection: "column", // Changed to column
  alignItems: "center", // Center items
  justifyContent: "center",
  gap: theme.spacing(2),
  transition: "all 0.2s",
  cursor: "pointer",
  height: "100%", // Full height
  minHeight: "220px", // Ensure minimum height
  textAlign: "center", // Center text
  "&:hover": {
    borderColor: COLORS.PRIMARY_PURPLE,
    boxShadow: COLORS.SHADOW.DEFAULT,
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: "56px",
  height: "56px",
  borderRadius: "50%", // Circle look
  backgroundColor: COLORS.PURPLE_ALPHA_10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: COLORS.PRIMARY_PURPLE,
  marginBottom: theme.spacing(1),
}));

const PreviewImage = styled("img")({
  width: "100%",
  maxHeight: "200px",
  objectFit: "contain",
  borderRadius: "12px",
  marginTop: "16px",
});

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onImageSelect,
  error,
  previewUrl,
  icon,
  description = "Jpeg, png, pdf file with max size of 10mb.",
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const startCamera = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent file input trigger if clicking camera button inside drop zone
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(t("camera_error"));
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const toggleCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      alert(t("camera_error"));
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera_capture.jpg", {
              type: "image/jpeg",
            });
            onImageSelect(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <Box sx={{ mb: 0, height: "100%" }}>
      {!previewUrl ? (
        <UploadCard
          isDragActive={isDragActive}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <IconContainer>{icon || <CloudUploadIcon />}</IconContainer>

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Drag & drop / {label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              sx={{ minWidth: "100px" }}
            >
              Upload
            </Button>
            <IconButton
              color="primary"
              onClick={startCamera}
              sx={{
                bgcolor: COLORS.PURPLE_ALPHA_10,
                "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_20 },
              }}
            >
              <CameraIcon />
            </IconButton>
          </Box>
        </UploadCard>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            textAlign: "center",
            border: `1px solid`,
            borderColor: "divider",
            borderRadius: "16px",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {label}
            </Typography>
            <IconButton onClick={() => onImageSelect(undefined as any)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <PreviewImage src={previewUrl} alt="Preview" />
        </Box>
      )}

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5, display: "block" }}
        >
          {error}
        </Typography>
      )}

      <Modal
        open={isCameraOpen}
        onClose={stopCamera}
        aria-labelledby="camera-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 600,
            bgcolor: COLORS.BLACK,
            boxShadow: 24,
            p: 0,
            height: { xs: "100%", sm: "auto" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "relative",
              flexGrow: 1,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </Box>

          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: COLORS.BLACK,
            }}
          >
            <IconButton onClick={stopCamera} sx={{ color: COLORS.WHITE }}>
              <CloseIcon />
            </IconButton>

            <IconButton
              onClick={capturePhoto}
              sx={{ color: COLORS.WHITE, p: 0 }}
            >
              <RadioButtonChecked sx={{ fontSize: 64, color: COLORS.WHITE }} />
            </IconButton>

            <IconButton onClick={toggleCamera} sx={{ color: COLORS.WHITE }}>
              <FlipCameraIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageUpload;
