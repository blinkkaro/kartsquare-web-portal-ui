"use client";
import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Avatar,
    Divider,
    Button,
    Chip,
    useTheme,
} from "@mui/material";
import { Close, ChatBubbleOutline, NearMe } from "@mui/icons-material";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";

interface BookingDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    booking: UserBooking | null;
}

const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
    open,
    onClose,
    booking,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (!booking) return null;

    const subtotal = booking.service_price / 100;
    const advancePayment = subtotal * 0.20;
    const remainingPayment = subtotal - advancePayment;

    // Map status to colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return { bg: "#FFFBEB", text: "#F59E0B" };
            case "CONFIRMED": return { bg: "#ECFDF5", text: "#10B981" };
            case "CANCELLED": return { bg: "#FEF2F2", text: "#EF4444" };
            case "COMPLETED": return { bg: "#EFF6FF", text: "#3B82F6" };
            default: return { bg: "#F3F4F6", text: "#6B7280" };
        }
    };

    const statusStyle = getStatusColor(booking.status);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "450px" },
                    padding: "32px",
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white",
                },
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D" }}>
                    {english.booking_details}
                </Typography>
                <IconButton onClick={onClose} sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F5F5F5", "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#E5E5E5" } }}>
                    <Close sx={{ fontSize: 20, color: isDark ? "white" : "inherit" }} />
                </IconButton>
            </Box>

            {/* Status & ID Summary */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Chip
                    label={booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                    size="small"
                    sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                    }}
                />
                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500 }}>
                    {booking.status === "COMPLETED" ? english.paid : english.service_charge}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? "white" : "inherit" }}>
                    {english.id} | <span style={{ fontWeight: 700 }}>{booking.booking_id.substring(0, 16)}</span>
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                    <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                        {booking.currency}
                    </span>
                    {subtotal.toFixed(2)}
                </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mb: 4 }}>
                {english.booked_date} <span style={{ color: isDark ? "#E5E7EB" : "#2D2D2D", fontWeight: 500, marginLeft: "4px" }}>
                    {dayjs(booking.booking_at).format("MMM DD, YYYY")}
                </span>
            </Typography>

            {/* Service Card */}
            <Box
                sx={{
                    bgcolor: isDark ? "rgba(94, 24, 233, 0.08)" : "#F4F2FF",
                    borderRadius: "24px",
                    p: 3,
                    mb: 4,
                    position: "relative",
                }}
            >
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Avatar
                        src={booking.service_images?.[0]}
                        sx={{ width: 48, height: 48, border: "2px solid white" }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D", fontSize: "1.1rem" }}>
                            {booking.service_name}
                        </Typography>
                        <Typography sx={{ color: isDark ? "#9CA3AF" : "#4B5563", fontSize: "0.875rem", fontWeight: 500 }}>
                            {dayjs(booking.booking_at).format("MMM DD, YYYY")}, {dayjs(booking.booking_at).format("h:mm a")} - {dayjs(booking.booking_at).add(2, 'hour').format("h:mm a")}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}>
                            {booking.service_location === "at_customer" ? english.at_customer_location : english.at_provider_location}
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: isDark ? "white" : "#2D2D2D", fontSize: "0.875rem" }}>
                            {booking.service_location === "at_customer" ? english.at_customer_location : english.at_provider_location}
                        </Typography>
                    </Box>
                    <IconButton
                        sx={{
                            bgcolor: "white",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                            "&:hover": { bgcolor: "white" },
                        }}
                    >
                        <NearMe sx={{ color: "#3B82F6", fontSize: 20 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Customer Notes */}
            {booking.customer_notes && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 1 }}>
                        {english.customer_notes_title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? "#9CA3AF" : "#4B5563", bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", p: 2, borderRadius: "12px" }}>
                        {booking.customer_notes}
                    </Typography>
                </Box>
            )}

            {/* Photos */}
            {booking.photo_url && booking.photo_url.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                        {english.uploaded_photos_title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                        {booking.photo_url.map((url, idx) => (
                            <Box
                                key={idx}
                                component="img"
                                src={url}
                                sx={{ width: 80, height: 80, borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Provider Info */}
            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                {english.service_provider_info}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                        src={booking.provider_profile_pic}
                        sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>
                            by {booking.provider_first_name} {booking.provider_last_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500 }}>
                            {booking.category_name} {english.provider_suffix}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    sx={{
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#F3F4F6"}`,
                        bgcolor: isDark ? "transparent" : "white",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
                    }}
                >
                    <ChatBubbleOutline sx={{ color: "#3B82F6", fontSize: 20 }} />
                </IconButton>
            </Box>

            {/* Billing Summary */}
            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                {english.billing_summary}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D" }}>
                    {english.total_service_payment}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                    <span style={{ color: "#9CA3AF", fontWeight: 500, marginRight: "4px" }}>
                        {booking.currency}
                    </span>
                    {subtotal.toFixed(2)}
                </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        bgcolor: "#4F46E5",
                        color: "white",
                        borderRadius: "16px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#4338CA" },
                    }}
                >
                    {english.reschedule}
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        bgcolor: isDark ? "#374151" : "#2D2D39",
                        color: "white",
                        borderRadius: "16px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { bgcolor: isDark ? "#4B5563" : "#1F1F2A" },
                    }}
                >
                    {english.cancel}
                </Button>
            </Box>
        </Drawer>
    );
};

export default BookingDetailsDrawer;
