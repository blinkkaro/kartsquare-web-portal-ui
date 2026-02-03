"use client";
import React from "react";
import {
    Box,
    Typography,
    IconButton,
    useTheme
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import RightDrawer from "../../../common/RightDrawer";
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
        <RightDrawer
            open={open}
            onClose={onClose}
            title={english.service_description}
            width={400}
        >
            <Box sx={{ p: 4 }}>
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
        </RightDrawer>
    );
};

export default DescriptionDrawer;
