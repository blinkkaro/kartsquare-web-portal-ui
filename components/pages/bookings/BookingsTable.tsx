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
import { Star, CheckCircle, Cancel as CancelIcon } from "@mui/icons-material";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";
import BookingActionButtons from "./BookingActionButtons";

interface BookingsTableProps {
    bookings: UserBooking[];
    activeTab: number;
    onViewDetails: (booking: UserBooking) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, activeTab, onViewDetails }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tabs = [
        english.upcoming,
        english.in_progress,
        english.completed,
        english.cancelled
    ];

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
                        <TableCell sx={headerCellStyle}>S.No</TableCell>
                        <TableCell sx={headerCellStyle}>{english.id}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_name}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.booking_date}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_charge}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_location}</TableCell>
                        {tabs[activeTab] === english.completed && <TableCell sx={headerCellStyle}>{english.rating}</TableCell>}
                        <TableCell sx={{ ...headerCellStyle, textAlign: 'right' }}>{english.action}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings?.map((booking, index) => (
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
                                <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#6B7280" }}>
                                    {index + 1}.
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                #{booking.booking_id.substring(0, 8)}...
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
                                    {activeTab === tabs.indexOf(english.completed) || activeTab === tabs.indexOf(english.cancelled) ? (
                                        <CheckCircle sx={{ fontSize: 16, color: "#3B82F6" }} />
                                    ) : null}
                                    {activeTab === tabs.indexOf(english.cancelled) ? (
                                        <CancelIcon sx={{ fontSize: 16, color: "#EF4444" }} />
                                    ) : null}

                                    <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "text.primary" : "#374151" }}>
                                        {booking.currency} {booking.service_price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                {booking.booking_address ? (
                                    <Box>
                                        <Typography variant="caption" sx={{
                                            color: COLORS.PRIMARY_PURPLE,
                                            fontWeight: 700,
                                            display: 'block',
                                            mb: 0.5,
                                            fontSize: '0.65rem',
                                            textTransform: 'uppercase'
                                        }}>
                                            {booking.service_location === 'at_customer' ? english.at_home : english.at_service_provider_location}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{
                                            maxWidth: '180px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {booking.booking_address.address}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {booking.booking_address.cityTown}, {booking.booking_address.state}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                                            {booking.service_location === 'at_customer' ? english.at_customer_location : english.at_provider_location}
                                        </Typography>
                                    </Box>
                                )}
                            </TableCell>

                            {tabs[activeTab] === english.completed && (
                                <TableCell sx={cellStyle}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Star sx={{ fontSize: 18, color: "#F59E0B" }} />
                                        <Typography variant="body2" fontWeight={600}>4.6</Typography>
                                    </Box>
                                </TableCell>
                            )}

                            <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <BookingActionButtons
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

export default BookingsTable;
