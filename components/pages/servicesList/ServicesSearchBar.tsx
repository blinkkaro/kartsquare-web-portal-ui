"use client";

import React from "react";
import { Box, TextField, InputAdornment, useTheme, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

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
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";
    const borderColor = isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT;
    const inputBg = isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE;

    return (
        <Box
            component="form"
            onSubmit={onSearchSubmit}
            sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: 500 },
            }}
        >
            <TextField
                fullWidth
                size="small"
                placeholder={t("search_services_placeholder")}
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search
                                sx={{
                                    color: COLORS.PRIMARY_PURPLE,
                                    fontSize: 20,
                                    ml: 0.5
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "50px",
                        bgcolor: inputBg,
                        fontSize: "0.95rem",
                        p: "4px 8px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        "& fieldset": {
                            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                        },
                        "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                        },
                        "&.Mui-focused": {
                            boxShadow: "0 4px 20px rgba(94, 24, 233, 0.12)",
                        },
                        "&.Mui-focused fieldset": {
                            borderWidth: "1.5px",
                            borderColor: COLORS.PRIMARY_PURPLE,
                        },
                    },
                }}
            />
        </Box>
    );
};

export default ServicesSearchBar;
