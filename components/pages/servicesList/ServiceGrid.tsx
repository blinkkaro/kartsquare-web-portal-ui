import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ServiceCard from "../../ServiceCard";
import { Service } from "../../../services/serviceList/listInteraface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface ServiceGridProps {
    services: Service[];
    total: number;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services, total }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <>
            {/* Results Count */}
            <Typography
                variant="body2"
                sx={{
                    mb: 2,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
                }}
            >
                {total} service{total !== 1 ? "s" : ""} found
            </Typography>

            {/* Grid of Services */}
            {services.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            mb: 1
                        }}
                    >
                        {english.no_services_found}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
                        }}
                    >
                        Try adjusting your filters or search query
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
                    gap: 3,
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
