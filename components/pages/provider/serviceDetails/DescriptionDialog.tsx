"use client";
import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    useTheme
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface DescriptionDrawerProps {
    open: boolean;
    onClose: () => void;
    description: string;
}

const DescriptionDrawer = ({ open, onClose, description }: DescriptionDrawerProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "400px" },
                    height: "100%",
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                },
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                    >
                        {english.service_description}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.8,
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        whiteSpace: "pre-wrap",
                        pb: 4
                    }}
                >
                    {description || "No description available"}
                </Typography>
            </Box>
        </Drawer>
    );
};

export default DescriptionDrawer;
