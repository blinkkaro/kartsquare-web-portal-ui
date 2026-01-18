import React, { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { COLORS } from "../constants/colors";
import { verifyDocumentService } from "../services/auth/verifyDocument.service";

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void;
    maxImages?: number;
    existingUrls?: string[];
    label?: string;
    description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUploadComplete,
    maxImages = 6,
    existingUrls = [],
    label = "Upload Photos",
    description = "Upload photos related to your request",
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [photoUrls, setPhotoUrls] = useState<string[]>(existingUrls);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed max
        if (photoUrls.length + files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images`);
            return;
        }

        try {
            setUploadingPhotos(true);
            setError(null);
            const urls = await verifyDocumentService.uploadImages(files);
            const newUrls = [...photoUrls, ...urls];
            setPhotoUrls(newUrls);
            onUploadComplete(newUrls);
        } catch (error) {
            console.error("Photo upload failed:", error);
            setError("Failed to upload photos. Please try again.");
        } finally {
            setUploadingPhotos(false);
        }
    };

    const handleRemovePhoto = (index: number) => {
        const newUrls = photoUrls.filter((_, i) => i !== index);
        setPhotoUrls(newUrls);
        onUploadComplete(newUrls);
    };

    return (
        <Box>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    mb: 2,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                }}
            >
                {description}
            </Typography>
            <Button
                variant="outlined"
                component="label"
                disabled={uploadingPhotos || photoUrls.length >= maxImages}
                sx={{
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.PRIMARY_PURPLE,
                    borderRadius: "8px",
                    textTransform: "none",
                    mb: 2,
                }}
            >
                {uploadingPhotos ? "Uploading..." : `Choose Photos (${photoUrls.length}/${maxImages})`}
                <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Button>
            {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            {photoUrls.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {photoUrls.map((url, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                width: 80,
                                height: 80,
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
                                    }`,
                            }}
                        >
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <Button
                                size="small"
                                onClick={() => handleRemovePhoto(index)}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    minWidth: "auto",
                                    p: 0.5,
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                                }}
                            >
                                ×
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageUpload;
