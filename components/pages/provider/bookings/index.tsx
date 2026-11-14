"use client";
import React, { useMemo, useState } from "react";
import {
  CalendarMonthRounded,
  GridViewRounded,
  SearchOffRounded,
  TableRowsRounded,
} from "@mui/icons-material";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { SERVICE_FALLBACK_IMAGE } from "@/constants/media";
import MainLayout from "@/app/mainLayout";
import BookingStatusCard from "@/components/common/BookingStatusCard";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import EmptyPanel from "@/components/common/list/EmptyPanel";
import FilterChips from "@/components/common/list/FilterChips";
import ListSearchBar from "@/components/common/list/ListSearchBar";
import { COLORS } from "@/constants/colors";
import { useProviderBookings } from "@/hooks/useBookings";
import { useTranslate } from "@/hooks/useTranslate";
import type { UserBooking } from "@/services/booking/bookingInterface";
import ProviderBookingDetailsDrawer from "./ProviderBookingDetailsDrawer";
import ProviderBookingsTable from "./ProviderBookingsTable";

type ViewMode = "table" | "card";

/** Status groups in tab order: the index is what the table and its action buttons expect. */
const STATUSES = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"] as const;

const ProviderBookingsPage = () => {
  const { t } = useTranslate();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const { data: bookingsData, isLoading: loading } = useProviderBookings();
  // The API answers null, not [], when a provider has no bookings, and a default value only covers undefined.
  const bookings = useMemo(() => bookingsData ?? [], [bookingsData]);

  const tabs = [t("pending"), t("upcoming"), t("in_progress"), t("completed"), t("cancelled")];
  const counts = useMemo(
    () => STATUSES.map((status) => bookings.filter((b) => b.status === status).length),
    [bookings],
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === STATUSES[activeTab])
        .filter(
          (b) =>
            !query ||
            b.service_name.toLowerCase().includes(query) ||
            b.booking_id.toLowerCase().includes(query),
        ),
    [bookings, activeTab, query],
  );

  const subtitle =
    bookings.length > 0
      ? t("bk_subtitle", { pending: counts[0], upcoming: counts[1] })
      : t("bk_subtitle_none");

  const handleViewDetails = (booking: UserBooking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const toggleSx = (selected: boolean) => ({
    width: 40,
    height: 40,
    borderRadius: "12px",
    bgcolor: selected ? COLORS.PURPLE_ALPHA_10 : COLORS.WHITE,
    color: selected ? COLORS.PRIMARY_PURPLE : COLORS.TEXT.SECONDARY_LIGHT,
    border: `1px solid ${selected ? COLORS.PRIMARY_PURPLE : COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT}`,
    "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
  });

  const cardGrid = {
    display: "grid",
    gap: { xs: 2, md: 3 },
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(3, minmax(0, 1fr))",
    },
  } as const;

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={cardGrid} aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" sx={{ height: 168, borderRadius: "16px" }} />
          ))}
        </Box>
      );
    }
    if (filteredBookings.length === 0) {
      if (query) {
        return (
          <EmptyPanel
            icon={<SearchOffRounded sx={{ fontSize: 36 }} />}
            title={t("bk_none_title", { query: searchQuery.trim() })}
            description={t("bk_none_desc")}
            action={
              <Button
                variant="outlined"
                onClick={() => setSearchQuery("")}
                sx={{ minHeight: 44, px: 3 }}
              >
                {t("bk_none_cta")}
              </Button>
            }
          />
        );
      }
      return (
        <EmptyPanel
          icon={<CalendarMonthRounded sx={{ fontSize: 36 }} />}
          title={t("no_bookings_found")}
          description={t("no_bookings_found_description")}
        />
      );
    }
    return (
      <>
        {/* Table: desktop only, when the table view is chosen */}
        <Box sx={{ display: { xs: "none", md: viewMode === "table" ? "block" : "none" } }}>
          <ProviderBookingsTable
            bookings={filteredBookings}
            activeTab={activeTab}
            tabs={tabs}
            onViewDetails={handleViewDetails}
          />
        </Box>

        {/* Cards: always on phones and tablets, and on desktop when the card view is chosen */}
        <Box sx={{ display: { xs: "block", md: viewMode === "card" ? "block" : "none" } }}>
          <Box sx={cardGrid}>
            {filteredBookings.map((booking) => (
              <BookingStatusCard
                key={booking.booking_id}
                booking={{
                  booking_id: booking.booking_id,
                  currency: booking.currency,
                  name: booking.service_name,
                  image: booking.service_images?.[0] || SERVICE_FALLBACK_IMAGE,
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
                        latitude: booking.booking_address.latitude ?? 0,
                        longitude: booking.booking_address.longitude ?? 0,
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
                isProvider={true}
              />
            ))}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <MainLayout>
      <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 }, mx: "auto", maxWidth: 1200 }}>
        <Box component="header" sx={{ mb: { xs: 2, md: 3 } }}>
          <PageTitle subtitle={subtitle} subtitleProps={{ variant: "body2", sx: { mt: 0.5 } }}>
            {t("bk_title")}
          </PageTitle>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <ListSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("bk_search_ph")}
            ariaLabel={t("bk_search_label")}
            clearLabel={t("bk_search_clear")}
          />
          {/* View toggle: desktop only, phones always get cards */}
          <Box
            role="group"
            aria-label={t("bk_views_label")}
            sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}
          >
            <IconButton
              onClick={() => setViewMode("table")}
              aria-label={t("bk_view_table")}
              aria-pressed={viewMode === "table"}
              sx={toggleSx(viewMode === "table")}
            >
              <TableRowsRounded fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("card")}
              aria-label={t("bk_view_cards")}
              aria-pressed={viewMode === "card"}
              sx={toggleSx(viewMode === "card")}
            >
              <GridViewRounded fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FilterChips
            options={tabs.map((label, i) => ({ key: String(i), label, count: counts[i] }))}
            value={String(activeTab)}
            onChange={(key) => setActiveTab(Number(key))}
            ariaLabel={t("bk_filters_label")}
          />
        </Box>

        {renderContent()}
      </Box>

      <ProviderBookingDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        booking_id={selectedBooking?.booking_id ?? ""}
      />
    </MainLayout>
  );
};

export default ProviderBookingsPage;
