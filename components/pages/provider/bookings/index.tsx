"use client";
import React, { useState, useMemo } from "react";
import { Box, Container, CircularProgress, useTheme } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import EmptyState from "@/components/common/EmptyState";
import dayjs from "dayjs";
import ProviderBookingsHeader from "./ProviderBookingsHeader";
import ProviderBookingsSearchBar from "./ProviderBookingsSearchBar";
import ProviderBookingsTabs from "./ProviderBookingsTabs";
import ProviderBookingsTable from "./ProviderBookingsTable";
import ProviderBookingDetailsDrawer from "./ProviderBookingDetailsDrawer";
import MainLayout from "@/app/mainLayout";
import { useProviderBookings } from "@/hooks/useBookings";

const ProviderBookingsPage = () => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);

    // Use TanStack Query hook for bookings
    const { data: bookings = [], isLoading: loading } = useProviderBookings();

    const tabs = [
        t("pending"),
        t("upcoming"),
        t("in_progress"),
        t("completed"),
        t("cancelled")
    ];

    const tabCounts = useMemo(() => {
        return [
            bookings.filter(b => b.status === "PENDING").length,
            bookings.filter(b => b.status === "CONFIRMED").length,
            bookings.filter(b => b.status === "ACTIVE").length,
            bookings.filter(b => b.status === "COMPLETED").length,
            bookings.filter(b => b.status === "CANCELLED").length,
        ];
    }, [bookings]);

    // Filter bookings based on active tab
    const getFilteredBookings = () => {
        let filtered = bookings;

        // Filter by status
        const currentTab = tabs[activeTab];
        if (currentTab === t("pending")) {
            filtered = bookings.filter(b => b.status === "PENDING");
        } else if (currentTab === t("upcoming")) {
            filtered = bookings.filter(b => b.status === "CONFIRMED");
        } else if (currentTab === t("in_progress")) {
            filtered = bookings.filter(b => b.status === "ACTIVE");
        } else if (currentTab === t("completed")) {
            filtered = bookings.filter(b => b.status === "COMPLETED");
        } else if (currentTab === t("cancelled")) {
            filtered = bookings.filter(b => b.status === "CANCELLED");
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
        <MainLayout >
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    minHeight: "100%",
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
                        counts={tabCounts}
                        tabs={tabs}
                    />

                    {/* Bookings Content */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredBookings.length === 0 ? (
                        <EmptyState
                            titleKey="no_bookings_found"
                            descriptionKey="no_bookings_found_description"
                            icon={
                                <Box
                                    sx={{
                                        width: { xs: 100, sm: 120 },
                                        height: { xs: 100, sm: 120 },
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: isDark
                                            ? COLORS.BACKGROUND.SECONDARY_DARK
                                            : COLORS.PURPLE_ALPHA_10,
                                        mb: 3,
                                        border: `3px solid ${COLORS.PRIMARY_PURPLE}20`,
                                    }}
                                >
                                    <CalendarToday
                                        sx={{
                                            fontSize: { xs: 48, sm: 64 },
                                            color: COLORS.PRIMARY_PURPLE,
                                            opacity: 0.8,
                                        }}
                                    />
                                </Box>
                            }
                            minHeight={400}
                            sx={{ minHeight: { xs: 300, sm: 400 } }}
                            variant="empty"
                        />
                    ) : (
                        <ProviderBookingsTable
                            bookings={filteredBookings}
                            activeTab={activeTab}
                            tabs={tabs}
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
        </MainLayout>
    );
};

export default ProviderBookingsPage;
