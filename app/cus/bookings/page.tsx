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
    Chip,
} from "@mui/material";
import {
    Search,
    CalendarToday,
    DeleteOutline,
    Visibility,
    Star,
    Refresh,
    NearMe,
    CheckCircle,
    Cancel as CancelIcon
} from "@mui/icons-material";
import Nav from "../../../components/common/Nav";
import { bookingService } from "../../../services/booking/bookingService";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import dayjs from "dayjs";

const BookingsPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = ["Cart", "Upcoming", "In Progress", "Completed", "Cancelled"];

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = await bookingService.getUserBookings();
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
            case "Cart":
                filtered = bookings.filter(b => b.status === "PENDING");
                break;
            case "Upcoming":
                filtered = bookings.filter(b =>
                    b.status === "CONFIRMED" &&
                    dayjs(b.booking_at).isAfter(dayjs())
                );
                break;
            case "In Progress":
                filtered = bookings.filter(b =>
                    (b.status === "CONFIRMED" && dayjs(b.booking_at).isBefore(dayjs())) ||
                    b.status === "IN_PROGRESS" as any
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
                `${b.provider_first_name} ${b.provider_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.booking_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const renderActionButtons = (booking: UserBooking) => {
        const tabName = tabs[activeTab];

        if (tabName === "Cart") {
            // Cart uses a different layout (card-based), handled separately or within the table row if unified
            return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600, borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}
                    >
                        Details
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<DeleteOutline />}
                        sx={{ bgcolor: isDark ? "#2A2A2A" : "#1A1A1A", color: "white", textTransform: "none", borderRadius: "8px", fontWeight: 600, "&:hover": { bgcolor: "#000" } }}
                    >
                        Delete
                    </Button>
                </Box>
            );
        }

        if (tabName === "Upcoming") {
            return (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#4F46E5", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#4338ca" } }}
                    >
                        Reschedule
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

        if (tabName === "In Progress") {
            return (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton size="small" sx={{ bgcolor: "#EFF6FF", color: "#3B82F6" }}>
                        <NearMe fontSize="small" />
                    </IconButton>
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

        if (tabName === "Completed") {
            return (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

                    <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#1F2937", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#111827" } }}
                    >
                        Request a Refund
                    </Button>
                    <IconButton size="small">
                        <Visibility fontSize="small" />
                    </IconButton>
                </Box>
            );
        }

        if (tabName === "Cancelled") {
            return (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton size="small">
                        <Visibility fontSize="small" />
                    </IconButton>
                </Box>
            );
        }

        return null;
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
        <>
            <Nav />
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#F3F4F6", // Light gray bg like screenshot
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
                            Orders/Bookings
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {/* Additional header actions if needed */}
                            <Button
                                variant="outlined"
                                startIcon={<CalendarToday />}
                                sx={{
                                    borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB",
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#374151",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    bgcolor: isDark ? "transparent" : "white"
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
                                <Tab key={tab} label={tab} disableRipple />
                            ))}
                        </Tabs>
                        {/* Thin divider line under tabs */}
                        <Box sx={{ height: "1px", bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB", mt: -0.2 }} />
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <TextField
                            placeholder="Search by Request ID, name, email, date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: "#9CA3AF" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small">
                                            {/* Filter icon placeholder */}
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
                                    pl: 2,
                                    "& fieldset": { border: 'none' }, // Remove default border
                                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                                },
                            }}
                        />
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
                        // Switch between Grid for Cart and Table for others potentially, 
                        // but based on request "Cart" was grid, others are new layout. 
                        // Implementing Table for all non-Cart tabs.  
                        tabs[activeTab] === "Cart" ? (
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
                                {filteredBookings.map((booking) => (
                                    <Box key={booking.booking_id} sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white", borderRadius: "16px", p: 2.5, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                            <Box component="img" src={booking.service_images?.[0] || "/placeholder.png"} alt={booking.service_name} sx={{ width: 60, height: 60, borderRadius: "12px", objectFit: "cover" }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mb: 0.5 }}>{booking.category_name}</Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? "white" : "#111827", mb: 0.5 }}>{booking.service_name}</Typography>
                                                <Typography variant="body2" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}>{booking.currency} {booking.service_price.toFixed(2)}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 1 }}>{renderActionButtons(booking)}</Box>
                                    </Box>
                                ))}
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
                                            {tabs[activeTab] === "Completed" && <TableCell sx={headerCellStyle}>RATING</TableCell>}
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
                                                    #{booking.booking_id.substring(0, 8)}...
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
                                                        {activeTab === tabs.indexOf("Completed") || activeTab === tabs.indexOf("Cancelled") ? (
                                                            <CheckCircle sx={{ fontSize: 16, color: "#3B82F6" }} /> // Blue check
                                                        ) : null}
                                                        {activeTab === tabs.indexOf("Cancelled") ? (
                                                            <CancelIcon sx={{ fontSize: 16, color: "#EF4444" }} />
                                                        ) : null}

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

                                                {tabs[activeTab] === "Completed" && (
                                                    <TableCell sx={cellStyle}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Star sx={{ fontSize: 18, color: "#F59E0B" }} />
                                                            <Typography variant="body2" fontWeight={600}>4.6</Typography>
                                                        </Box>
                                                    </TableCell>
                                                )}

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
                        )
                    )}
                </Container>
            </Box>
        </>
    );
};

export default BookingsPage;
