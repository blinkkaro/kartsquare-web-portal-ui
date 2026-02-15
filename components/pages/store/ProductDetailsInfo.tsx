"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Verified } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface ProductDetailsInfoProps {
    productName: string;
    description: string;
    onContinueReading: () => void;
    showContinueReading: boolean;
    gstNumber?: string;
}

const ProductDetailsInfo = ({
    productName,
    description,
    onContinueReading,
    showContinueReading,
    gstNumber,
}: ProductDetailsInfoProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <>
            {/* Product Title */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mb: 1.5,
                        color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                        fontSize: { xs: "1.75rem", sm: "2.25rem" },
                        lineHeight: 1.2,
                    }}
                >
                    {productName}
                </Typography>

                {/* Badges */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Verified Badge */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#1D4ED8",
                            fontWeight: 800,
                            cursor: "default",
                        }}
                    >
                        <Verified sx={{ fontSize: "16px" }} />
                        <Typography
                            sx={{
                                fontWeight: 900,
                                fontSize: "0.75rem",
                                fontStyle: "italic",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                            }}
                        >
                            Verified Product
                        </Typography>
                    </Box>

                    {/* GST Tag */}
                    {gstNumber && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "#059669",
                                fontWeight: 800,
                                cursor: "default",
                            }}
                        >
                            <Verified sx={{ fontSize: "16px" }} />
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: "0.75rem",
                                    fontStyle: "italic",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                GST Registered
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Description */}
            <Typography
                variant="body1"
                sx={{
                    mb: 1,
                    lineHeight: 1.6,
                    color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                    display: "-webkit-box",
                    WebkitLineClamp: 10,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "pre-line",
                }}
            >
                {description || "No description available"}
            </Typography>

            {/* Continue Reading Link */}
            {showContinueReading && (
                <Button
                    onClick={onContinueReading}
                    sx={{
                        textTransform: "none",
                        color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                        p: 0,
                        mb: 3,
                        "&:hover": {
                            bgcolor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    Continue Reading
                </Button>
            )}
        </>
    );
};

export default ProductDetailsInfo;
