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
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                lineHeight: { xs: 1.3, sm: 1.4 },
            }}
        >
            {title}
        </Typography>
    );
};

export default ServicesHeader;
