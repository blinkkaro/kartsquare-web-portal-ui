"use client";
import React from "react";
import { Box, Typography, Pagination, useTheme } from "@mui/material";
import ServiceCard from "../../../ServiceCard";
import { Service } from "../../../../services/serviceList/listInteraface";
import { COLORS } from "../../../../constants/colors";
import { getUserRole, UserRole } from "../../../../utils/auth";
import { english } from "../../../../features/i18n/en";
import EmptyState from "@/components/common/EmptyState";
import { CalendarToday } from "@mui/icons-material";

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
            <Box sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        mb: 1,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                >
                   
                         <EmptyState
                            titleKey={userRole === UserRole.SERVICE_PROVIDER
                                ? "no_services_created"
                                : "no_services_found"}
                            descriptionKey={userRole === UserRole.SERVICE_PROVIDER
                                ? "no_services_created_description"
                                : "no_services_found_description"}
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
                                        border: `3px solid ${COLORS.PRIMARY_PURPLE}20`,
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
                        
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
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
                gap: { xs: 2, sm: 3 },
            }}>
                {services.map((service) => (
                    <ServiceCard key={service.service_id} service={service} />
                ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="medium"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                                minWidth: { xs: 32, sm: 40, md: 48 },
                                height: { xs: 32, sm: 40, md: 48 },
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
