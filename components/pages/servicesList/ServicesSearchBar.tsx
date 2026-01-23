import React from "react";
import { Box, TextField, InputAdornment, useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface ServicesSearchBarProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

const ServicesSearchBar: React.FC<ServicesSearchBarProps> = ({
    searchInput,
    onSearchChange,
    onSearchSubmit,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            component="form"
            onSubmit={onSearchSubmit}
            sx={{ 
                minWidth: { xs: "100%", sm: "300px" },
                width: "100%",
            }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder={english.search_services}
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ 
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                fontSize: { xs: "1rem", sm: "1.25rem" },
                            }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    borderRadius: { xs: "8px", sm: "12px" },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: { xs: "8px", sm: "12px" },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        "& fieldset": {
                            borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                        },
                    },
                }}
            />
        </Box>
    );
};

export default ServicesSearchBar;
