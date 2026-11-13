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
} from "@mui/material";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import ProviderBookingActionButtons from "./ProviderBookingActionButtons";
import { useTranslate } from "@/hooks/useTranslate";
import { SERVICE_FALLBACK_IMAGE } from "@/constants/media";

interface ProviderBookingsTableProps {
    bookings: UserBooking[];
    activeTab: number;
    tabs: string[];
    onViewDetails: (booking: UserBooking) => void;
}

const ProviderBookingsTable: React.FC<ProviderBookingsTableProps> = ({ bookings, activeTab, tabs, onViewDetails }) => {
    const { t } = useTranslate();

    // Reusable Table Cell Styles
    const cellStyle = {
        borderBottom: `1px solid ${COLORS.NEW_UI.DIVIDER_LIGHT}`,
        color: COLORS.TEXT.PRIMARY_LIGHT,
        fontSize: '0.875rem',
        py: 2
    };

    const headerCellStyle = {
        borderBottom: `1px solid ${COLORS.NEW_UI.DIVIDER_LIGHT}`,
        bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
        color: COLORS.TEXT.SECONDARY_LIGHT,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap' as const,
    };

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ bgcolor: COLORS.WHITE, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`, borderRadius: "16px", overflowX: "auto" }}
        >
            <Table sx={{ minWidth: 760 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCellStyle}>{english.id || "ID"}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_name || "Service"}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.customer || "Customer"}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.booking_date || "Date"}</TableCell>
                        <TableCell sx={headerCellStyle}>{english.service_charge || "Service Charge"}</TableCell>
                        {/* <TableCell sx={headerCellStyle}>{english.service_location || "Location Type"}</TableCell> */}
                        <TableCell sx={headerCellStyle}>{english.address || "Actual Location"}</TableCell>
                        <TableCell sx={{ ...headerCellStyle, textAlign: 'right' }}>{english.action || "Action"}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings?.map((booking) => (
                        <TableRow
                            key={booking.booking_id}
                            hover
                            sx={{ "&:last-of-type td": { borderBottom: 0 } }}
                        >
                            <TableCell sx={cellStyle}>
                                #{booking.booking_id.substring(0, 8)}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        component="img"
                                        src={booking.service_images?.[0] || SERVICE_FALLBACK_IMAGE}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 700, maxWidth: 150 }} noWrap>
                                        {booking.service_name}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={cellStyle}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {booking.customer_details ? `${booking.customer_details?.first_name || ""} ${booking.customer_details?.last_name || ""}` : "N/A"}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ ...cellStyle, whiteSpace: "nowrap" }}>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {dayjs(booking.booking_at).format("MMM DD, YYYY")}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(booking.booking_at).format("h:mm a")} - {dayjs(booking.booking_at).add(2, 'hour').format("h:mm a")}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ ...cellStyle, whiteSpace: "nowrap" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tabs[activeTab] === t("completed") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.SUCCESS_GREEN }} />
                                    )}
                                    {tabs[activeTab] === t("cancelled") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.ERROR_RED }} />
                                    )}
                                    {tabs[activeTab] === t("in_progress") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.PRIMARY_BLUE }} />
                                    )}
                                    {tabs[activeTab] === t("upcoming") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.SECONDARY_ORANGE }} />
                                    )}
                                    {tabs[activeTab] === t("pending") && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.PRIMARY_PURPLE }} />
                                    )}
                                    <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.TEXT.PRIMARY_LIGHT }}>
                                        {booking.service_price > 0 ? `${booking.currency} ${booking.service_price.toFixed(2)}` : "Get Quote"}
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
                                            {booking.service_location === 'at_customer' ? "At Home" : "At Service Provider Location"}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {booking.booking_address.address}
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ color: "text.secondary", fontSize: '0.75rem' }}>
                                            {booking.booking_address.cityTown}, {booking.booking_address.state} — {booking.booking_address.pincode}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>N/A</Typography>
                                )}
                            </TableCell>

                            {/* <TableCell sx={cellStyle}>
                                <Box
                                    sx={{
                                        display: "inline-block",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "20px",
                                        bgcolor: booking.service_location === 'at_customer'
                                            ? "rgba(94, 24, 233, 0.1)"
                                            : "rgba(16, 185, 129, 0.1)",
                                        color: booking.service_location === 'at_customer'
                                            ? COLORS.PRIMARY_PURPLE
                                            : "#10B981",
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                                        {booking.service_location?.replace('_', ' ')}
                                    </Typography>
                                </Box>
                            </TableCell> */}

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
