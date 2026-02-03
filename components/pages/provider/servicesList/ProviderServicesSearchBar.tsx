"use client";
import React from "react";
import { Box, TextField, InputAdornment, useTheme } from "@mui/material";
import { Search } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ProviderServicesSearchBarProps {
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

const ProviderServicesSearchBar = ({
    searchInput,
    onSearchInputChange,
    onSearchSubmit
}: ProviderServicesSearchBarProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            component="form"
            onSubmit={onSearchSubmit}
            sx={{ 
                minWidth: { xs: "100%", sm: "300px" }, 
                maxWidth: { xs: "100%", sm: "400px" },
                width: "100%",
            }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder={english.search_services_placeholder}
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
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

export default ProviderServicesSearchBar;
