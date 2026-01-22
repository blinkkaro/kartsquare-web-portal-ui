import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";

interface ServicesHeaderProps {
    title?: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ title = "Services for you" }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT
            }}
        >
            {title}
        </Typography>
    );
};

export default ServicesHeader;
