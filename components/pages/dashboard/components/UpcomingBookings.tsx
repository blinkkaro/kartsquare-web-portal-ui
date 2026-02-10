"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import BookingStatusCard from "@/components/common/BookingStatusCard";
import EmptyState from "@/components/common/EmptyState";

interface UpcomingBookingsProps {
  bookings: any[]; // Using any for now to match index.tsx data structure, can refine with interface later if available
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings = [],
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        borderRadius: "12px",
        p: 2,
        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
          }`,
        boxShadow: isDark
          ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
          : "0px 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("upcomingBookings")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: COLORS.PRIMARY_PURPLE,
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => router.push("/spr/bookings")}
        >
          {t("seeall")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {bookings.length > 0 ? (
          bookings?.map((booking) => (
            <BookingStatusCard
              key={booking.booking_id}
              booking={{
                booking_id: booking.booking_id,
                currency: booking.currency,
                name: booking.service_name,
                image: booking.image_urls[0] || "",
                status: booking.status,
                price: booking.price,
                time: booking.schedule_at,
                service_address: booking.service_address,
              }}
              isProvider={true}
              showStatus={false}
            />
          ))
        ) : (
          <EmptyState
            titleKey=""
            title={t("no_upcoming_bookings")}
            description={t("no_upcoming_bookings_desc")}
            minHeight={200}
            iconSize={48}
          />
        )}
      </Box>
    </Box>
  );
};

export default UpcomingBookings;
