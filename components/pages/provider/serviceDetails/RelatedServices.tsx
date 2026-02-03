"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ServiceCard from "../../../ServiceCard";
import { Service } from "../../../../services/serviceList/listInteraface";
import { COLORS } from "../../../../constants/colors";

interface RelatedServicesProps {
    relatedServices: Service[];
    providerName: string;
}

const RelatedServices = ({ relatedServices, providerName }: RelatedServicesProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (relatedServices.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
            >
                {providerName}'s Services
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    pb: 2,
                    "&::-webkit-scrollbar": {
                        height: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                        borderRadius: "4px",
                        "&:hover": {
                            bgcolor: COLORS.PRIMARY_PURPLE,
                        },
                    },
                }}
            >
                {relatedServices.map((relatedService) => (
                    <Box
                        key={relatedService.service_id}
                        sx={{
                            minWidth: "280px",
                            maxWidth: "280px",
                            flexShrink: 0,
                        }}
                    >
                        <ServiceCard service={relatedService} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RelatedServices;
