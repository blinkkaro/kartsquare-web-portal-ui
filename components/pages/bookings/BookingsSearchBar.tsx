import React from "react";
import { Box, TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, CalendarToday } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface BookingsSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const BookingsSearchBar: React.FC<BookingsSearchBarProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Search Bar */}
            <TextField
                placeholder={english.search_bookings_placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: "#9CA3AF", fontSize: "1.2rem" }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton size="small">
                                {/* Filter icon placeholder */}
                                <Box component="span" sx={{ fontSize: '1.2rem', color: COLORS.PRIMARY_PURPLE }}>⇅</Box>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                sx={{
                    width: { xs: '100%', md: '400px' },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                        height: "40px",
                        pl: 2,
                        "& fieldset": { border: 'none' },
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    },
                    "& .MuiInputBase-input": {
                        py: 1,
                        fontSize: "0.875rem"
                    }
                }}
            />
            {/* Calendar Button */}
            <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                sx={{
                    borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB",
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#374151",
                    textTransform: "none",
                    borderRadius: "8px",
                    bgcolor: isDark ? "transparent" : "white",
                    height: "40px",
                    px: 2
                }}
            >
                {english.calendar}
            </Button>
        </Box>
    );
};

export default BookingsSearchBar;
