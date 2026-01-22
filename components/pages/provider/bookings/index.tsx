"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress, useTheme } from "@mui/material";
import Nav from "../../../common/Nav";
import { providerBookingService } from "../../../../services/booking/providerBookingService";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import ProviderBookingsHeader from "./ProviderBookingsHeader";
import ProviderBookingsSearchBar from "./ProviderBookingsSearchBar";
import ProviderBookingsTabs from "./ProviderBookingsTabs";
import ProviderBookingsTable from "./ProviderBookingsTable";
import ProviderBookingDetailsDrawer from "./ProviderBookingDetailsDrawer";

const ProviderBookingsPage = () => {
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
        english.completed,
        english.cancelled
    ];

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
            case english.upcoming:
                filtered = bookings.filter(b =>
                    (b.status === "CONFIRMED" && dayjs(b.booking_at).isAfter(dayjs())) ||
                    b.status === "PENDING"
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
                        <ProviderBookingsHeader />
                        <ProviderBookingsSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </Box>

                    {/* Tabs */}
                    <ProviderBookingsTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        bookingCounts={filteredBookings.length}
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
                        <ProviderBookingsTable
                            bookings={filteredBookings}
                            activeTab={activeTab}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </Container>
            </Box>

            <ProviderBookingDetailsDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                booking={selectedBooking}
            />
        </>
    );
};

export default ProviderBookingsPage;
