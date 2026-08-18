import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface BookingsHeaderProps {
    title?: string;
}

const BookingsHeader: React.FC<BookingsHeaderProps> = ({
    title = english.orders_bookings
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#1F2937",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default BookingsHeader;
