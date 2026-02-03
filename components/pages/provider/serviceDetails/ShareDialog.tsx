"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Button,
    Tooltip,
    Fade,
    useTheme,
} from "@mui/material";
import {
    Close,
    ContentCopy,
    WhatsApp,
    Facebook,
    Twitter,
    LinkedIn,
    Check,
} from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    serviceName: string;
    serviceId: string;
}

const ShareDialog = ({ open, onClose, serviceName, serviceId }: ShareDialogProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [copied, setCopied] = useState(false);

    // Generate absolute URL for sharing
    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/services/${serviceId}`
        : "";

    const shareText = `Check out this service: ${serviceName}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: <WhatsApp sx={{ color: "#25D366" }} />,
            url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
        },
        {
            name: "Facebook",
            icon: <Facebook sx={{ color: "#1877F2" }} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "Twitter",
            icon: <Twitter sx={{ color: "#1DA1F2" }} />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "LinkedIn",
            icon: <LinkedIn sx={{ color: "#0A66C2" }} />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: serviceName,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Fade}
            transitionDuration={400}
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "400px",
                    bgcolor: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.05)"}`,
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                    Share Service
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pb: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Share this service with your network or copy the direct link.
                </Typography>

                {/* Social Share Icons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, px: 1 }}>
                    {shareOptions.map((option) => (
                        <Box key={option.name} sx={{ textAlign: "center" }}>
                            <IconButton
                                component="a"
                                href={option.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    width: 50,
                                    height: 50,
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                                        transform: "translateY(-4px)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {option.icon}
                            </IconButton>
                            <Typography variant="caption" sx={{ display: "block", mt: 1, fontWeight: 500 }}>
                                {option.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Link Copy Section */}
                <Box
                    sx={{
                        p: 0.5,
                        pl: 2,
                        borderRadius: "12px",
                        bgcolor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                    }}
                >
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{
                            flex: 1,
                            mr: 1,
                            color: "text.secondary",
                            fontSize: "0.8rem"
                        }}
                    >
                        {shareUrl}
                    </Typography>
                    <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                        <Button
                            onClick={handleCopy}
                            variant="contained"
                            size="small"
                            sx={{
                                minWidth: "80px",
                                borderRadius: "10px",
                                bgcolor: copied ? "#4caf50" : COLORS.PRIMARY_PURPLE,
                                "&:hover": {
                                    bgcolor: copied ? "#43a047" : COLORS.PURPLE_HOVER,
                                },
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {copied ? <Check fontSize="small" /> : english.copy || "Copy"}
                        </Button>
                    </Tooltip>
                </Box>

                {/* Web Share Native Option */}
                {typeof navigator !== "undefined" && !!navigator.share && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleNativeShare}
                        sx={{
                            mt: 3,
                            borderRadius: "12px",
                            py: 1.5,
                            borderStyle: "dashed",
                            borderColor: COLORS.PRIMARY_PURPLE,
                            color: COLORS.PRIMARY_PURPLE,
                            "&:hover": {
                                borderStyle: "dashed",
                                bgcolor: "rgba(94, 24, 233, 0.04)",
                                borderColor: COLORS.PURPLE_HOVER,
                            }
                        }}
                    >
                        More Sharing Options
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;
