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
import { Close, ChatBubbleOutline, NearMe, CheckCircle } from "@mui/icons-material";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";

interface ProviderBookingDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    booking: UserBooking | null;
}

const ProviderBookingDetailsDrawer: React.FC<ProviderBookingDetailsDrawerProps> = ({
    open,
    onClose,
    booking,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (!booking) return null;

    const totalAmount = booking.service_price / 100;

    // Map status to colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return { bg: "#ECFDF5", text: "#10B981" }; // Green as per screenshot for Completed/Success?
            case "CONFIRMED": return { bg: "#ECFDF5", text: "#10B981" };
            case "CANCELLED": return { bg: "#FEF2F2", text: "#EF4444" };
            case "COMPLETED": return { bg: "#ECFDF5", text: "#10B981" };
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
                    borderRadius: "24px 0 0 24px",
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
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#9CA3AF" }}>
                    ID | <span style={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>{booking.booking_id.substring(0, 16)}</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ color: "#3B82F6", fontSize: 18 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                        <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                            {booking.currency}
                        </span>
                        {totalAmount.toFixed(2)}
                    </Typography>
                </Box>
            </Box>

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
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar
                        src={booking.service_images?.[0]}
                        sx={{ width: 48, height: 48, border: "2px solid white" }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D", fontSize: "1.05rem" }}>
                            {booking.service_name}
                        </Typography>
                        <Typography sx={{ color: isDark ? "#9CA3AF" : "#4B5563", fontSize: "0.85rem", fontWeight: 500 }}>
                            {dayjs(booking.booking_at).format("MMM DD, YYYY")}, {dayjs(booking.booking_at).format("h:mm a")} - {dayjs(booking.booking_at).add(2, 'hour').format("h:mm a")}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Customer Info */}
            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                {english.customer_info}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar
                        src={booking.customer_profile_pic}
                        sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>
                            {booking.customer_first_name} {booking.customer_last_name}
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

            {/* Billing Summary */}
            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mt: "auto", mb: 2 }}>
                {english.billing_summary}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "#9CA3AF" : "#4B5563" }}>
                    {english.total_receivable_amount}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                    <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                        {booking.currency}
                    </span>
                    {totalAmount.toFixed(2)}
                </Typography>
            </Box>
        </Drawer>
    );
};

export default ProviderBookingDetailsDrawer;
