import React from "react";
import { Box, TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, CalendarToday } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ProviderBookingsSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const ProviderBookingsSearchBar: React.FC<ProviderBookingsSearchBarProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Search Bar */}
            <TextField
                placeholder={english.search_provider_bookings_placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: "#9CA3AF", fontSize: "1.2rem" }} />
                        </InputAdornment>
                    ),
                    
                }}
                sx={{
                    width: { xs: '100%', md: '450px' },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                        height: { xs: "48px", md: "50px" },
                        pl: 2,
                        "& fieldset": { 
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                        },
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            "& fieldset": { borderColor: `${COLORS.PRIMARY_PURPLE}40` }
                        },
                        "&.Mui-focused": {
                            "& fieldset": { borderColor: COLORS.PRIMARY_PURPLE, borderWidth: "1.5px" }
                        }
                    },
                    "& .MuiInputBase-input": {
                        py: 1,
                        fontSize: "0.95rem",
                        fontWeight: 500
                    }
                }}
            />
            {/* Calendar Button */}
            {/* <Button
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
            </Button> */}
        </Box>
    );
};

export default ProviderBookingsSearchBar;
