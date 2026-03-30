"use client";
import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierDashboard } from "@/hooks/useSupplier";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";

export default function DashboardPage() {
    const { t } = useTranslate();
    const { data, isLoading } = useSupplierDashboard();

    if (isLoading) return <CenteredLoader minHeight="400px" showText={true} />;

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">
                {t("dashboard")}
            </Typography>

            <Grid container spacing={3}>
                {/* Placeholder Stats Cards */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ width: '100%' }}>
                    {/* Added sx width to force layout if Grid2 behavior is unexpected without size prop context */}
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="h6" color="primary">Total Products</Typography>
                        <Typography variant="h3">{(data?.data as any)?.total_products || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ width: '100%' }}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="h6" color="primary">Enquiries</Typography>
                        <Typography variant="h3">{(data?.data as any)?.total_enquiries || 0}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ width: '100%' }}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="h6" color="primary">Views</Typography>
                        <Typography variant="h3">{(data?.data as any)?.total_views || 0}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
