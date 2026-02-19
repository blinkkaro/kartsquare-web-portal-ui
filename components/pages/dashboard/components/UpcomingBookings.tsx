"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import BookingStatusCard from "@/components/common/BookingStatusCard";
import EmptyState from "@/components/common/EmptyState";
import SupplierQuotationCard from "@/components/common/supplierQuotations/SupplierQuotationCard";

interface UpcomingBookingsProps {
  bookings: any[];
  role?: "SERVICE_PROVIDER" | "SUPPLIER";
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  bookings = [],
  role = "SERVICE_PROVIDER",
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
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
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
          {role === "SUPPLIER"
            ? t("pendingEnquiries" as any)
            : t("upcomingBookings")}
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
          onClick={() =>
            router.push(
              role === "SUPPLIER" ? "/sup/orders" : "/spr/bookings",
            )
          }
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
          bookings?.map((item) =>
            role === "SUPPLIER" ? (
              <SupplierQuotationCard
                key={item.supplier_quotation_id}
                enquiry={item}
              />
            ) : (
              <BookingStatusCard
                key={item.booking_id}
                booking={{
                  booking_id: item.booking_id,
                  currency: item.currency,
                  name: item.service_name,
                  image: item.image_urls?.[0] || "",
                  status: item.status,
                  price: item.price,
                  time: item.schedule_at,
                  service_address: item.service_address,
                }}
                isProvider={true}
                showStatus={false}
              />
            ),
          )
        ) : (
          <EmptyState
            titleKey=""
            title={
              role === "SUPPLIER"
                ? t("noEnquiriesFound" as any)
                : t("no_upcoming_bookings")
            }
            description={
              role === "SUPPLIER" ? "" : t("no_upcoming_bookings_desc")
            }
            minHeight={200}
            iconSize={48}
          />
        )}
      </Box>
    </Box>
  );
};

export default UpcomingBookings;
