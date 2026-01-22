"use client";
import React from "react";
import { Box, Typography, Pagination, useTheme } from "@mui/material";
import ServiceCard from "../../../ServiceCard";
import { Service } from "../../../../services/serviceList/listInteraface";
import { COLORS } from "../../../../constants/colors";
import { getUserRole, UserRole } from "../../../../utils/auth";
import { english } from "../../../../features/i18n/en";

interface ProviderServicesGridProps {
    services: Service[];
    totalPages: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const ProviderServicesGrid = ({
    services,
    totalPages,
    currentPage,
    onPageChange
}: ProviderServicesGridProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const userRole = getUserRole();

    if (services.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        mb: 1
                    }}
                >
                    {userRole === UserRole.SERVICE_PROVIDER
                        ? english.no_services_created
                        : english.no_services_found}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
                    }}
                >
                    {userRole === UserRole.SERVICE_PROVIDER
                        ? english.create_first_service
                        : english.adjust_filters}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Grid of Services */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
                gap: 3,
            }}>
                {services.map((service) => (
                    <ServiceCard key={service.service_id} service={service} />
                ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="large"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            },
                            "& .Mui-selected": {
                                bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                                color: "white",
                            },
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default ProviderServicesGrid;
