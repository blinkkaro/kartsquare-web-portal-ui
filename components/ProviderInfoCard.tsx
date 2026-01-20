import React from "react";
import { Box, Avatar, Typography, Button, Chip, useTheme } from "@mui/material";
import { Message, PersonAdd } from "@mui/icons-material";
import { COLORS } from "../constants/colors";

interface ProviderInfoCardProps {
    providerId: string;
    providerName: string;
    providerImageUrl?: string | null;
    isHotSeller?: boolean;
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = ({
    providerId,
    providerName,
    providerImageUrl,
    isHotSeller = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                borderRadius: "16px",
                p: 3,
                mt: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
            >
                Service provider Info.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        src={providerImageUrl || undefined}
                        sx={{ width: 48, height: 48 }}
                    >
                        {providerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        {isHotSeller && (
                            <Chip
                                label="Hot seller"
                                size="small"
                                sx={{
                                    bgcolor: "#FF6B6B",
                                    color: "white",
                                    height: "20px",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    mb: 0.5,
                                }}
                            />
                        )}
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            }}
                        >
                            {providerName}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Message />}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            "&:hover": {
                                borderColor: COLORS.PRIMARY_PURPLE,
                                bgcolor: "transparent",
                            },
                        }}
                    >
                        Message
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            "&:hover": {
                                borderColor: COLORS.PRIMARY_PURPLE,
                                bgcolor: "transparent",
                            },
                        }}
                    >
                        Follow
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ProviderInfoCard;
