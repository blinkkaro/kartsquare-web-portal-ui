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
            sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: "400px" }}
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
                            <Search sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
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
