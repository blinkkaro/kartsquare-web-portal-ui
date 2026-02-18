"use client";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { Assignment, Phone } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface ProductDetailsActionsProps {
    onGetQuote: () => void;
    onTalkToUs: () => void;
}

const ProductDetailsActions = ({
    onGetQuote,
    onTalkToUs,
}: ProductDetailsActionsProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", gap: 2, mb: 1, py: 1 }}>
            <Button
                variant="contained"
                fullWidth
                onClick={onGetQuote}
                startIcon={<Assignment sx={{ fontSize: "1.2rem !important" }} />}
                sx={{
                    flex: 1,
                    bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                    color: "white",
                    borderRadius: "30px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    "&:hover": {
                        bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${isDark
                                ? `${COLORS.ACCENT_BLUE_BG_DARK}40`
                                : `${COLORS.PRIMARY_PURPLE}40`
                            }`,
                    },
                    transition: "all 0.2s ease-in-out",
                }}
            >
                Get Best Quote
            </Button>
            <Button
                variant="outlined"
                fullWidth
                onClick={onTalkToUs}
                startIcon={<Phone sx={{ fontSize: "1.2rem !important" }} />}
                sx={{
                    flex: 1,
                    borderColor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                    color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                    borderRadius: "30px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    "&:hover": {
                        borderColor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.02)",
                        transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                }}
            >
                Talk to Us
            </Button>
        </Box>
    );
};

export default ProductDetailsActions;
