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
                minWidth: { xs: "100%", sm: 320 },
                width: "100%",
                maxWidth: { sm: 420 },
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
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                    fontSize: 22,
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        bgcolor: inputBg,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        "& fieldset": {
                            borderWidth: "1px",
                            borderColor,
                        },
                        "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                        },
                        "&.Mui-focused fieldset": {
                            borderWidth: 2,
                            borderColor: COLORS.PRIMARY_PURPLE,
                        },
                    },
                }}
            />
        </Box>
    );
};

export default ServicesSearchBar;
