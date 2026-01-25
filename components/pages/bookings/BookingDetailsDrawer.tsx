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
import { UserBooking, BookingDetails } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";
import RightDrawer from "../../common/RightDrawer";
import { bookingDetailsService } from "../../../services/booking/bookingDetails";
import { CircularProgress } from "@mui/material";

interface BookingDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    booking: UserBooking | null;
}

const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
    open,
    onClose,
    booking: initialBooking,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [booking, setBooking] = React.useState<BookingDetails | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open && initialBooking?.booking_id) {
            fetchBookingDetails(initialBooking.booking_id);
        } else if (!open) {
            setBooking(null);
        }
    }, [open, initialBooking?.booking_id]);

    const fetchBookingDetails = async (id: string) => {
        setLoading(true);
        try {
            const details = await bookingDetailsService.getCustomerBookingDetails(id);
            setBooking(details);
        } catch (error) {
            console.error("Error fetching booking details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!initialBooking) return null;

    const subtotal = booking ? booking.service_price : (initialBooking.service_price);

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

    const currentBooking = booking || initialBooking;
    const statusStyle = getStatusColor(currentBooking.status);

    return (
        <RightDrawer
            open={open}
            onClose={onClose}
            title={english.booking_details}
            width={450}
        >
            <Box sx={{ px: 4, pb: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Status & ID Summary */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Chip
                                label={currentBooking.status.charAt(0) + currentBooking.status.slice(1).toLowerCase()}
                                size="small"
                                sx={{
                                    bgcolor: statusStyle.bg,
                                    color: statusStyle.text,
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                }}
                            />
                            <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500 }}>
                                {currentBooking.status === "COMPLETED" ? english.paid : english.service_charge}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? "white" : "inherit" }}>
                                {english.id} | <span style={{ fontWeight: 700 }}>{currentBooking.booking_id.substring(0, 16)}</span>
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                                <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                                    {booking?.service_currency || initialBooking.currency}
                                </span>
                                {subtotal.toFixed(2)}
                            </Typography>
                        </Box>

                        <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mb: 4 }}>
                            {english.booked_date} <span style={{ color: isDark ? "#E5E7EB" : "#2D2D2D", fontWeight: 500, marginLeft: "4px" }}>
                                {dayjs(currentBooking.booking_at).format("MMM DD, YYYY")}
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
                                    src={booking ? booking.service_image?.[0] : initialBooking.service_images?.[0]}
                                    sx={{ width: 48, height: 48, border: "2px solid white" }}
                                />
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D", fontSize: "1.1rem" }}>
                                        {currentBooking.service_name}
                                    </Typography>
                                    <Typography sx={{ color: isDark ? "#9CA3AF" : "#4B5563", fontSize: "0.875rem", fontWeight: 500 }}>
                                        {dayjs(currentBooking.booking_at).format("MMM DD, YYYY")}, {dayjs(currentBooking.booking_at).format("h:mm a")}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)" }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mb: 0.5 }}>
                                        {currentBooking.service_location === "at_customer" ? english.at_customer_location : english.at_provider_location}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 600, color: isDark ? "white" : "#2D2D2D", fontSize: "0.875rem" }}>
                                        {currentBooking.service_location === "at_customer" ? english.at_customer_location : english.at_provider_location}
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

                        {/* OTP Section (Only for CONFIRMED status) */}
                        {currentBooking.status === "CONFIRMED" && booking?.otp && (
                            <Box
                                sx={{
                                    background: isDark
                                        ? `linear-gradient(135deg, ${COLORS.SECONDARY_ORANGE}15 0%, ${COLORS.SECONDARY_ORANGE}05 100%)`
                                        : `linear-gradient(135deg, ${COLORS.SECONDARY_ORANGE}08 0%, ${COLORS.WHITE} 100%)`,
                                    borderRadius: "28px",
                                    p: 3.5,
                                    mb: 4,
                                    textAlign: "center",
                                    border: `1px solid ${COLORS.SECONDARY_ORANGE}30`,
                                    boxShadow: isDark ? 'none' : '0 10px 30px -10px rgba(249, 115, 22, 0.15)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    "&::before": {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '4px',
                                        height: '100%',
                                        bgcolor: COLORS.SECONDARY_ORANGE
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: `${COLORS.SECONDARY_ORANGE}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <CheckCircle sx={{ color: COLORS.SECONDARY_ORANGE, fontSize: 18 }} />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ color: COLORS.SECONDARY_ORANGE, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px" }}>
                                        {english.otp_to_provider_label}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2 }}>
                                    {booking.otp.toString().split('').map((digit, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: 42,
                                                height: 52,
                                                borderRadius: '12px',
                                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : COLORS.WHITE,
                                                border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 800,
                                                color: isDark ? COLORS.WHITE : COLORS.TEXT.PRIMARY_LIGHT,
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {digit}
                                        </Box>
                                    ))}
                                </Box>

                                <Typography variant="body2" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 500, lineHeight: 1.6 }}>
                                    {english.otp_to_provider_instruction}
                                </Typography>
                            </Box>
                        )}

                        {/* Customer Notes */}
                        {currentBooking.customer_notes && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 1 }}>
                                    {english.customer_notes_title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: isDark ? "#9CA3AF" : "#4B5563", bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", p: 2, borderRadius: "12px" }}>
                                    {currentBooking.customer_notes}
                                </Typography>
                            </Box>
                        )}

                        {/* Photos */}
                        {currentBooking.photo_url && currentBooking.photo_url.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                                    {english.uploaded_photos_title}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                                    {currentBooking.photo_url?.map((url: string, idx: number) => (
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
                                    src={booking ? booking.provider_profile_pic || undefined : initialBooking.provider_profile_pic}
                                    sx={{ width: 48, height: 48 }}
                                />
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>
                                        by {booking ? booking.provider_first_name : initialBooking.provider_first_name} {booking ? booking.provider_last_name : initialBooking.provider_last_name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500 }}>
                                        {booking ? booking.category_name : initialBooking.category_name} {english.provider_suffix}
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

                        <Box sx={{ mb: 6 }} />

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
                    </>
                )}
            </Box>
        </RightDrawer>
    );
};

export default BookingDetailsDrawer;
