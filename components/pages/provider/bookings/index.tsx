"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import { CalendarToday, GridView, TableRows } from "@mui/icons-material";
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
import BookingStatusCard from "@/components/common/BookingStatusCard";

type ViewMode = "table" | "card";

const ProviderBookingsPage = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Set default view mode to card on mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 900) {
        setViewMode("card");
      }
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use TanStack Query hook for bookings
  const { data: bookings = [], isLoading: loading } = useProviderBookings();

  const tabs = [
    t("pending"),
    t("upcoming"),
    t("in_progress"),
    t("completed"),
    t("cancelled"),
  ];

  const tabCounts = useMemo(() => {
    return [
      bookings.filter((b) => b.status === "PENDING").length,
      bookings.filter((b) => b.status === "CONFIRMED").length,
      bookings.filter((b) => b.status === "ACTIVE").length,
      bookings.filter((b) => b.status === "COMPLETED").length,
      bookings.filter((b) => b.status === "CANCELLED").length,
    ];
  }, [bookings]);

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by status
    const currentTab = tabs[activeTab];
    if (currentTab === t("pending")) {
      filtered = bookings.filter((b) => b.status === "PENDING");
    } else if (currentTab === t("upcoming")) {
      filtered = bookings.filter((b) => b.status === "CONFIRMED");
    } else if (currentTab === t("in_progress")) {
      filtered = bookings.filter((b) => b.status === "ACTIVE");
    } else if (currentTab === t("completed")) {
      filtered = bookings.filter((b) => b.status === "COMPLETED");
    } else if (currentTab === t("cancelled")) {
      filtered = bookings.filter((b) => b.status === "CANCELLED");
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.booking_id.toLowerCase().includes(searchQuery.toLowerCase()),
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
    <MainLayout>
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
          minHeight: "100%",
          pt: { xs: 8, md: 10 },
          pb: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header with Search */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
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
          {/* View Toggle - Hidden on mobile */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              mb: 2,
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => setViewMode("table")}
              sx={{
                bgcolor:
                  viewMode === "table"
                    ? isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.PURPLE_ALPHA_10
                    : "transparent",
                color:
                  viewMode === "table"
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                border: `1px solid ${
                  viewMode === "table"
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.PAPER_DARK
                    : COLORS.PURPLE_ALPHA_10,
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              <TableRows />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("card")}
              sx={{
                bgcolor:
                  viewMode === "card"
                    ? isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.PURPLE_ALPHA_10
                    : "transparent",
                color:
                  viewMode === "card"
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                border: `1px solid ${
                  viewMode === "card"
                    ? COLORS.PRIMARY_PURPLE
                    : isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.PAPER_DARK
                    : COLORS.PURPLE_ALPHA_10,
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              <GridView />
            </IconButton>
          </Box>

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
            <>
              {/* Table View - Hidden on mobile, shown on desktop when table mode is active */}
              {viewMode === "table" && (
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <ProviderBookingsTable
                    bookings={filteredBookings}
                    activeTab={activeTab}
                    tabs={tabs}
                    onViewDetails={handleViewDetails}
                  />
                </Box>
              )}

              {/* Card View - Always shown on mobile, shown on desktop when card mode is active */}
              {(viewMode === "card" ||
                (typeof window !== "undefined" && window.innerWidth < 900)) && (
                <Box
                  sx={{
                    display: {
                      xs: "block",
                      md: viewMode === "card" ? "block" : "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {filteredBookings.map((booking) => (
                      <BookingStatusCard
                        key={booking.booking_id}
                        booking={{
                          booking_id: booking.booking_id,
                          currency: booking.currency,
                          name: booking.service_name,
                          image:
                            booking.service_images?.[0] || "/placeholder.png",
                          status: booking.status,
                          price: booking.service_price,
                          time: booking.booking_at,
                          service_address: booking.booking_address
                            ? {
                                address: booking.booking_address.address,
                                city_town: booking.booking_address.cityTown,
                                state: booking.booking_address.state,
                                country: booking.booking_address.country,
                                pincode: booking.booking_address.pincode,
                                latitude:
                                  booking.booking_address.latitude?.toString() ??
                                  "0",
                                longitude:
                                  booking.booking_address.longitude?.toString() ??
                                  "0",
                                landmark: booking.booking_address.landmark,
                              }
                            : {
                                address: "",
                                city_town: "",
                                state: "",
                                country: "",
                                pincode: "",
                                latitude: "0",
                                longitude: "0",
                              },
                        }}
                        isProvider={true}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      <ProviderBookingDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        booking_id={selectedBooking?.booking_id!}
      />
    </MainLayout>
  );
};

export default ProviderBookingsPage;
