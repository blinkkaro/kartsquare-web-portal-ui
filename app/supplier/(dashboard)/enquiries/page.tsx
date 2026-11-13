"use client";
import React from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Chip
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierEnquiries } from "@/hooks/useSupplier";

export default function SupplierEnquiriesPage() {
    const { t } = useTranslate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { data, isLoading } = useSupplierEnquiries();

    if (isLoading) return <Typography>Loading enquiries...</Typography>;

    const enquiries = Array.isArray(data?.data) ? data.data : [];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
                {t("enquiries") || "Enquiries"}
            </Typography>

            {enquiries.length === 0 ? (
                <Typography>{t("noEnquiriesFound") || "No enquiries yet."}</Typography>
            ) : isMobile ? (
                <Box display="flex" flexDirection="column" gap={2}>
                    {enquiries.map((enquiry: any) => (
                        <Card key={enquiry.id} elevation={2}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {new Date(enquiry.created_at).toLocaleDateString()}
                                </Typography>
                                <Typography variant="h6" mt={1}>
                                    {enquiry.product_name || "N/A"}
                                </Typography>
                                <Typography variant="body2" mb={1}>
                                    {t("customer")}: {enquiry.user_name || "Guest"}
                                </Typography>
                                <Typography variant="body1">
                                    {enquiry.message}
                                </Typography>
                                <Box mt={2}>
                                    <Chip label={enquiry.status} size="small" color={enquiry.status === 'PENDING' ? 'warning' : 'success'} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("productService")}</TableCell>
                                <TableCell>{t("customer")}</TableCell>
                                <TableCell>{t("message")}</TableCell>
                                <TableCell>{t("status")}</TableCell>
                                <TableCell>{t("date")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enquiries.map((enquiry: any) => (
                                <TableRow key={enquiry.id}>
                                    <TableCell>{enquiry.product_name || "N/A"}</TableCell>
                                    <TableCell>{enquiry.user_name || "Guest"}</TableCell>
                                    <TableCell>{enquiry.message}</TableCell>
                                    <TableCell>
                                        <Chip label={enquiry.status} size="small" color={enquiry.status === 'PENDING' ? 'warning' : 'success'} />
                                    </TableCell>
                                    <TableCell>{new Date(enquiry.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
