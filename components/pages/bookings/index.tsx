"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";
import BookingsHeader from "./BookingsHeader";
import BookingsSearchBar from "./BookingsSearchBar";
import BookingsTabs from "./BookingsTabs";
import BookingsTable from "./BookingsTable";
import BookingDetailsDrawer from "./BookingDetailsDrawer";
import MainLayout from "@/app/mainLayout";
import { CalendarToday, GridView, TableRows } from "@mui/icons-material";
import EmptyState from "@/components/common/EmptyState";
import { useCustomerBookings } from "@/hooks/useBookings";
import BookingStatusCard from "@/components/common/BookingStatusCard";
import { IconButton } from "@mui/material";

type ViewMode = "table" | "card";

const BookingsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Set default view mode to card on mobile
  React.useEffect(() => {
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
  const { data: bookings = [], isLoading: loading } = useCustomerBookings();

  const tabs = [
    english.pending,
    english.upcoming,
    english.in_progress,
    english.completed,
    english.cancelled,
  ];

  const counts = useMemo(() => {
    return {
      pending: bookings.filter((b) => b.status === "PENDING").length,
      upcoming: bookings.filter((b) => b.status === "CONFIRMED").length,
      in_progress: bookings.filter((b) => b.status === "ACTIVE").length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    };
  }, [bookings]);

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by status
    switch (tabs[activeTab]) {
      case english.pending:
        filtered = bookings.filter((b) => b.status === "PENDING");
        break;
      case english.upcoming:
        filtered = bookings.filter((b) => b.status === "CONFIRMED");
        break;
      case english.in_progress:
        filtered = bookings.filter((b) => b.status === "ACTIVE");
        break;
      case english.completed:
        filtered = bookings.filter((b) => b.status === "COMPLETED");
        break;
      case english.cancelled:
        filtered = bookings.filter((b) => b.status === "CANCELLED");
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${b.provider_first_name} ${b.provider_last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
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
          bgcolor: "background.default",
          minHeight: "100%",
          pt: { xs: 2, sm: 4, md: 6 },
          pb: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header with Search */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: { xs: 3, md: 4 },
            }}
          >
            <BookingsHeader />
            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
              <BookingsSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </Box>
          </Box>

          {/* Tabs and Actions Row */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              mb: { xs: 2, md: 3 }
            }}
          >
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <BookingsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={[
                  counts.pending,
                  counts.upcoming,
                  counts.in_progress,
                  counts.completed,
                  counts.cancelled,
                ]}
              />
            </Box>
          </Box>

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
                color: viewMode === "table" ? COLORS.PRIMARY_PURPLE : "text.secondary",
                borderColor: viewMode === "table" ? COLORS.PRIMARY_PURPLE : "divider",
                borderStyle: "solid",
                borderWidth: "1px",
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
                color: viewMode === "card" ? COLORS.PRIMARY_PURPLE : "text.secondary",
                borderColor: viewMode === "card" ? COLORS.PRIMARY_PURPLE : "divider",
                borderStyle: "solid",
                borderWidth: "1px",
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
            <CenteredLoader py={10} size={80} />
          ) : filteredBookings.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
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
              </Typography>
            </Box>
          ) : (
            <>
              {/* Table View - Hidden on mobile, shown on desktop when table mode is active */}
              {viewMode === "table" && (
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <BookingsTable
                    bookings={filteredBookings}
                    activeTab={activeTab}
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
                      {filteredBookings?.map((booking) => (
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
                                  booking.booking_address.latitude ??
                                  0,
                                longitude:
                                  booking.booking_address.longitude ??
                                  0,
                                landmark: booking.booking_address.landmark,
                              }
                              : {
                                address: "",
                                city_town: "",
                                state: "",
                                country: "",
                                pincode: "",
                                latitude: 0,
                                longitude: 0,
                              },
                          }}
                          isProvider={false}
                        // onClick={() => handleViewDetails(booking)}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
            </>
          )}
        </Container>
      </Box>

      <BookingDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        booking={selectedBooking}
      />
    </MainLayout>
  );
};

export default BookingsPage;
