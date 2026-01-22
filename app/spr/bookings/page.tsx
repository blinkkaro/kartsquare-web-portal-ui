"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    useTheme,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import {
    Search,
    CalendarToday,
    Visibility,
    PlayArrow,
} from "@mui/icons-material";
import Nav from "../../../components/common/Nav";
import { providerBookingService } from "../../../services/booking/providerBookingService";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import dayjs from "dayjs";
import MainLayout from "@/app/mainLayout";

const ProviderBookingsPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = ["Upcoming", "Completed", "Cancelled"];

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = await providerBookingService.getProviderBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Filter bookings based on active tab
    const getFilteredBookings = () => {
        let filtered = bookings;

        // Filter by status
        switch (tabs[activeTab]) {
            case "Upcoming":
                filtered = bookings.filter(b =>
                    (b.status === "CONFIRMED" && dayjs(b.booking_at).isAfter(dayjs())) ||
                    b.status === "PENDING"
                );
                break;
            case "Completed":
                filtered = bookings.filter(b => b.status === "COMPLETED");
                break;
            case "Cancelled":
                filtered = bookings.filter(b => b.status === "CANCELLED");
                break;
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(b =>
                b.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.booking_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const renderActionButtons = (booking: UserBooking) => {
        const tabName = tabs[activeTab];

        if (tabName === "Upcoming") {
            return (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrow />}
                        sx={{ bgcolor: "#4F46E5", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#4338ca" } }}
                    >
                        Start
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#1F2937", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#111827" } }}
                    >
                        Cancel
                    </Button>
                    <IconButton size="small">
                        <Visibility fontSize="small" />
                    </IconButton>
                </Box>
            );
        }

        // Completed and Cancelled tabs only have View button
        return (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton size="small">
                    <Visibility fontSize="small" />
                </IconButton>
            </Box>
        );
    };

    const filteredBookings = getFilteredBookings();

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
        <MainLayout>
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#F3F4F6",
                    minHeight: "100vh",
                    pt: { xs: 8, md: 10 },
                    pb: 4,
                }}
            >
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#1F2937",
                            }}
                        >
                            Bookings
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            {/* Search Bar */}
                            <TextField
                                placeholder="Search by Request ID, name, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "#9CA3AF", fontSize: "1.2rem" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small">
                                                <Box component="span" sx={{ fontSize: '1.2rem', color: COLORS.PRIMARY_PURPLE }}>⇅</Box>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    width: { xs: '100%', md: '400px' },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "30px",
                                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                                        height: "40px",
                                        pl: 2,
                                        "& fieldset": { border: 'none' },
                                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                                    },
                                    "& .MuiInputBase-input": {
                                        py: 1,
                                        fontSize: "0.875rem"
                                    }
                                }}
                            />
                            {/* Calendar Button */}
                            <Button
                                variant="outlined"
                                startIcon={<CalendarToday />}
                                sx={{
                                    borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB",
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#374151",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    bgcolor: isDark ? "transparent" : "white",
                                    height: "40px",
                                    px: 2
                                }}
                            >
                                Calendar
                            </Button>
                        </Box>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ mb: 4 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{
                                "& .MuiTabs-indicator": {
                                    backgroundColor: COLORS.PRIMARY_PURPLE,
                                    height: "3px",
                                    borderRadius: "3px 3px 0 0"
                                },
                                "& .MuiTab-root": {
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#6B7280",
                                    mr: 2,
                                    "&.Mui-selected": {
                                        color: isDark ? "white" : "#111827",
                                    },
                                },
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab}
                                    label={`${tab} ${filteredBookings.length > 0 ? `(${filteredBookings.length})` : ''}`}
                                    disableRipple
                                />
                            ))}
                        </Tabs>
                        {/* Thin divider line under tabs */}
                        <Box sx={{ height: "1px", bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB", mt: -0.2 }} />
                    </Box>


                    {/* Bookings Content */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredBookings.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography variant="h6" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                                No bookings found
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
                            <Table sx={{ minWidth: 650, borderSpacing: "0 12px", borderCollapse: "separate" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerCellStyle}>ID</TableCell>
                                        <TableCell sx={headerCellStyle}>SERVICE NAME</TableCell>
                                        <TableCell sx={headerCellStyle}>BOOKING DATE</TableCell>
                                        <TableCell sx={headerCellStyle}>PAY</TableCell>
                                        <TableCell sx={headerCellStyle}>SERVICE LOCATION</TableCell>
                                        <TableCell sx={{ ...headerCellStyle, textAlign: 'right' }}>ACTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
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
                                                        src={booking.service_images?.[0] || "/placeholder.png"}
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
                                                    {tabs[activeTab] === "Completed" && (
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                                                    )}
                                                    {tabs[activeTab] === "Cancelled" && (
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EF4444' }} />
                                                    )}
                                                    <Typography variant="body2" fontWeight={700} sx={{ color: isDark ? "text.primary" : "#374151" }}>
                                                        {booking.currency} {booking.service_price.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={cellStyle}>
                                                {booking.service_location === 'at_customer' ? (
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            123 Main Street, Al Satwa...
                                                        </Typography>
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            Dubai, United Arab Emira...
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>—</Typography>
                                                )}
                                            </TableCell>

                                            <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {renderActionButtons(booking)}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
            </Box>
        </MainLayout>
    );
};

export default ProviderBookingsPage;
