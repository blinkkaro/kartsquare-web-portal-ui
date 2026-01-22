"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress, useTheme } from "@mui/material";
import Nav from "../../common/Nav";
import { bookingService } from "../../../services/booking/bookingService";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";
import BookingsHeader from "./BookingsHeader";
import BookingsSearchBar from "./BookingsSearchBar";
import BookingsTabs from "./BookingsTabs";
import BookingsTable from "./BookingsTable";
import BookingDetailsDrawer from "./BookingDetailsDrawer";

const BookingsPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);

    const tabs = [
        english.upcoming,
        english.in_progress,
        english.completed,
        english.cancelled
    ];

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
            case english.upcoming:
                filtered = bookings.filter(b =>
                    (b.status === "CONFIRMED" && dayjs(b.booking_at).isAfter(dayjs())) ||
                    b.status === "PENDING"
                );
                break;
            case english.in_progress:
                filtered = bookings.filter(b =>
                    (b.status === "CONFIRMED" && dayjs(b.booking_at).isBefore(dayjs())) ||
                    b.status === "IN_PROGRESS" as any
                );
                break;
            case english.completed:
                filtered = bookings.filter(b => b.status === "COMPLETED");
                break;
            case english.cancelled:
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

    const filteredBookings = getFilteredBookings();

    const handleViewDetails = (booking: UserBooking) => {
        setSelectedBooking(booking);
        setIsDrawerOpen(true);
    };

    return (
        <>
            <Nav />
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#F3F4F6",
                    minHeight: "100vh",
                    pt: { xs: 8, md: 10 },
                    pb: 4,
                }}
            >
                <Container maxWidth="xl">
                    {/* Header with Search */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <BookingsHeader />
                        <BookingsSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </Box>

                    {/* Tabs */}
                    <BookingsTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Bookings Content */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredBookings.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography variant="h6" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                                {english.no_bookings_found}
                            </Typography>
                        </Box>
                    ) : (
                        <BookingsTable
                            bookings={filteredBookings}
                            activeTab={activeTab}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </Container>
            </Box>

            <BookingDetailsDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                booking={selectedBooking}
            />
        </>
    );
};

export default BookingsPage;
