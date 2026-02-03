"use client";
import React from "react";
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";

interface ServiceImageUploadProps {
    selectedImages: File[];
    imagePreviews: string[];
    onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

const ServiceImageUpload = ({
    selectedImages,
    imagePreviews,
    onImageSelect,
    onRemoveImage
}: ServiceImageUploadProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {english.upload_images}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                {english.upload_images_helper}
            </Typography>

            {/* Upload Button */}
            <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={imagePreviews.length >= 6}
                sx={{
                    mb: 2,
                    borderColor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.PRIMARY_PURPLE,
                    "&:hover": {
                        borderColor: COLORS.PURPLE_HOVER,
                        bgcolor: COLORS.PURPLE_ALPHA_04,
                    },
                }}
            >
                {english.upload_images_count.replace("{count}", imagePreviews.length.toString())}
                <input
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={onImageSelect}
                />
            </Button>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {imagePreviews.map((preview, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                            }}
                        >
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => onRemoveImage(index)}
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "rgba(0,0,0,0.8)",
                                    },
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ServiceImageUpload;
