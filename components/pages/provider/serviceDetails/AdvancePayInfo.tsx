"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface AdvancePayInfoProps {
    price: number;
    currency: string;
}

const AdvancePayInfo = ({ price, currency }: AdvancePayInfoProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const advanceAmount = price * 0.5;
    const afterAmount = price * 0.5;

    return (
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    {english.advance_pay || "Advance pay"}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    {currency} {advanceAmount.toFixed(2)}{" "}
                    <span style={{ fontWeight: 400, color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                        (50%)
                    </span>
                </Typography>
            </Box>

            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    {english.after_pay || "After pay"}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    {currency} {afterAmount.toFixed(2)}{" "}
                    <span style={{ fontWeight: 400, color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                        (50%)
                    </span>
                </Typography>
            </Box>
        </Box>
    );
};

export default AdvancePayInfo;
