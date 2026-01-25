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
} from "@mui/material";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import ProviderBookingActionButtons from "./ProviderBookingActionButtons";
import { useTranslate } from "@/hooks/useTranslate";

interface ProviderBookingsTableProps {
    bookings: UserBooking[];
    activeTab: number;
    tabs: string[];
    onViewDetails: (booking: UserBooking) => void;
}

const ProviderBookingsTable: React.FC<ProviderBookingsTableProps> = ({ bookings, activeTab, tabs, onViewDetails }) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    // Reusable Table Cell Styles
    const cellStyle = {
        borderBottom: 'none',
        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
        fontSize: '0.875rem',
        py: 2
    };

    const headerCellStyle = {
        borderBottom: 'none',
        color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#9CA3AF",
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
            <Table sx={{ minWidth: 650, borderSpacing: "0 12px", borderCollapse: "separate" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCellStyle}>{english.id}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_name}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.booking_date}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.pay}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_location}</TableCell>
                        <TableCell sx={{ ...headerCellStyle, textAlign: 'right' }}>{english.action}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow
                            key={booking.booking_id}
                            sx={{
                                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                "& > td:first-of-type": { borderRadius: "12px 0 0 12px" },
                                "& > td:last-of-type": { borderRadius: "0 12px 12px 0" },
                            }}
                        >
                            <TableCell sx={cellStyle}>
                                {booking.booking_id.substring(0, 15)}...
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        component="img"
                                        src={(booking as any).service_images?.[0] || (booking as any).service_image?.[0] || booking.photo_url?.[0] || "/placeholder.png"}
                                        sx={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                                    />
                                    <Typography variant="body2" fontWeight={600}>
                                        {booking.service_name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {dayjs(booking.booking_at).format("MMM DD, YYYY")}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(booking.booking_at).format("h:mm a")} - {dayjs(booking.booking_at).add(2, 'hour').format("h:mm a")}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tabs[activeTab] === t("completed") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                                    )}
                                    {tabs[activeTab] === t("cancelled") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444' }} />
                                    )}
                                    {tabs[activeTab] === t("in_progress") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                                    )}
                                    {tabs[activeTab] === t("upcoming") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                                    )}
                                    {tabs[activeTab] === t("pending") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366F1' }} />
                                    )}
                                    <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "text.primary" : "#374151" }}>
                                        {booking.currency} {booking.service_price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Typography variant="body2" fontWeight={600}>
                                    {booking.service_location === 'at_customer'
                                        ? t("at_customer_location")
                                        : t("at_provider_location")}
                                </Typography>
                            </TableCell>

                            <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <ProviderBookingActionButtons
                                        booking={booking}
                                        tabName={tabs[activeTab]}
                                        onViewDetails={onViewDetails}
                                    />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProviderBookingsTable;
