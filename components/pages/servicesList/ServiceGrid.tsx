"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ServiceCard from "../../ServiceCard";
import { Service } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import EmptyState from "@/components/common/EmptyState";
import { CalendarToday } from "@mui/icons-material";

interface ServiceGridProps {
    services: Service[];
    total: number;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, total }) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    return (
        <>
            {/* Results Count */}
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    fontWeight: 600,
                }}
            >
                {total} {t("services_found")}
            </Typography>

            {/* Grid of Services */}
            {services.length === 0 ? (
                <Box sx={{ py: { xs: 4, sm: 8 } }}>
                    <EmptyState
                        titleKey="no_services_found"
                        descriptionKey="no_services_found_description"
                        icon={
                            <Box
                                sx={{
                                    width: { xs: 100, sm: 120 },
                                    height: { xs: 100, sm: 120 },
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: isDark
                                        ? COLORS.BACKGROUND.SECONDARY_DARK
                                        : COLORS.PURPLE_ALPHA_10,
                                    mb: 3,
                                    border: `3px solid ${COLORS.PURPLE_ALPHA_20}`,
                                }}
                            >
                                <CalendarToday
                                    sx={{
                                        fontSize: { xs: 48, sm: 64 },
                                        color: COLORS.PRIMARY_PURPLE,
                                        opacity: 0.8,
                                    }}
                                />
                            </Box>
                        }
                        minHeight={400}
                        sx={{ minHeight: { xs: 300, sm: 400 } }}
                        variant="empty"
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: "0.875rem",
                            textAlign: "center",
                            mt: 2,
                        }}
                    >
                        {t("adjust_filters")}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: { xs: 2, sm: 3 },
                }}>
                    {services.map((service) => (
                        <ServiceCard key={service.service_id} service={service} />
                    ))}
                </Box>
            )}
        </>
    );
};

export default ServiceGrid;
