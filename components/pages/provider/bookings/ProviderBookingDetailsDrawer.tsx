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
import { UserBooking, BookingDetails } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import RightDrawer from "../../../common/RightDrawer";
import { bookingDetailsService } from "../../../../services/booking/bookingDetails";
import { CircularProgress, Link } from "@mui/material";
import { Phone } from "@mui/icons-material";

interface ProviderBookingDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    booking: UserBooking | null;
}

const ProviderBookingDetailsDrawer: React.FC<ProviderBookingDetailsDrawerProps> = ({
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
            const details = await bookingDetailsService.getBookingDetails(id);
            setBooking(details);
        } catch (error) {
            console.error("Error fetching booking details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!initialBooking) return null;

    // Map status to colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return { bg: "#FFFBEB", text: "#F59E0B" };
            case "CONFIRMED": return { bg: "#ECFDF5", text: "#10B981" };
            case "CANCELLED": return { bg: "#FEF2F2", text: "#EF4444" };
            case "COMPLETED": return { bg: "#EFF6FF", text: "#3B82F6" };
            case "ACTIVE": return { bg: "#EEF2FF", text: "#6366F1" };
            default: return { bg: "#F3F4F6", text: "#6B7280" };
        }
    };

    const currentBooking = booking || initialBooking;
    const statusStyle = getStatusColor(currentBooking.status);
    const totalAmount = currentBooking.service_price;

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
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#9CA3AF" }}>
                                ID | <span style={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>{currentBooking.booking_id}</span>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle sx={{ color: "#3B82F6", fontSize: 18 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                                    <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                                        {booking?.service_currency || initialBooking.currency}
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
                                    src={booking ? booking.service_image?.[0] : initialBooking.service_images?.[0]}
                                    sx={{ width: 48, height: 48, border: "2px solid white" }}
                                />
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D", fontSize: "1.05rem" }}>
                                        {currentBooking.service_name}
                                    </Typography>
                                    <Typography sx={{ color: isDark ? "#9CA3AF" : "#4B5563", fontSize: "0.85rem", fontWeight: 500 }}>
                                        {dayjs(currentBooking.booking_at).format("MMM DD, YYYY")}, {dayjs(currentBooking.booking_at).format("h:mm a")}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Customer Info */}
                        <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "#2D2D2D", mb: 2 }}>
                            {english.customer_info}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Avatar
                                    src={currentBooking.customer_profile_pic || undefined}
                                    sx={{ width: 48, height: 48 }}
                                />
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>
                                        {currentBooking.customer_first_name} {currentBooking.customer_last_name}
                                    </Typography>
                                    {booking?.contact_number && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <Phone sx={{ fontSize: 14, color: "#3B82F6" }} />
                                            <Link href={`tel:${booking.contact_number}`} sx={{ fontSize: '0.85rem', color: "#3B82F6", textDecoration: 'none', fontWeight: 500 }}>
                                                {booking.contact_number}
                                            </Link>
                                        </Box>
                                    )}
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

                        {/* Customer Address (Detailed) */}
                        {booking && (
                            <Box sx={{ mb: 4, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", p: 2, borderRadius: "16px" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <NearMe sx={{ fontSize: 18, color: "#3B82F6" }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? "white" : "#2D2D2D" }}>
                                        {booking.customer_address_name || english.selected_customer_address}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: isDark ? "#9CA3AF" : "#4B5563", pl: 3.2 }}>
                                    {booking.customer_address_address}<br />
                                    {booking.customer_address_landmark && `${booking.customer_address_landmark}, `}{booking.customer_address_city_town}
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
                                    {currentBooking.photo_url.map((url, idx) => (
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, mt: 'auto' }}>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "#9CA3AF" : "#4B5563" }}>
                                {english.service_charge}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: isDark ? "white" : "inherit" }}>
                                <span style={{ color: "#9CA3AF", fontWeight: 500, fontSize: "0.875rem", marginRight: "4px" }}>
                                    {booking?.service_currency || initialBooking.currency}
                                </span>
                                {totalAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </RightDrawer>
    );
};

export default ProviderBookingDetailsDrawer;
