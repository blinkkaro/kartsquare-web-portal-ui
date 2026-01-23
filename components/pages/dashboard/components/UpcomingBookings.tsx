"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Button,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  ArrowForward,
  Cancel,
  PlayArrow,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import { UserBooking } from "@/services/booking/bookingInterface";
import dayjs from "dayjs";

interface UpcomingBookingsProps {
  bookings: UserBooking[];
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings = [] }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  return (
      <Card
        sx={{
          borderRadius: "12px",
          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
          border: `1px solid ${
            isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          boxShadow: isDark
            ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
            : "0px 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
      <CardContent sx={{ p: 2.5 }}>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bookings.length === 0 ? (
             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
               No upcoming bookings.
             </Typography>
          ) : (
             bookings.map((booking, index) => (
            <Box
              key={booking.booking_id || index}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  boxShadow: isDark
                    ? "0px 2px 8px rgba(94, 24, 233, 0.2)"
                    : "0px 2px 8px rgba(94, 24, 233, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                {booking.service_images && booking.service_images.length > 0 ? (
                   <Avatar 
                     src={booking.service_images[0]} 
                     variant="rounded" 
                     sx={{ width: 48, height: 48 }}
                   />
                ) : (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "8px",
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: COLORS.WHITE,
                        fontSize: "20px",
                      }}
                    >
                      ✂️
                    </Box>
                )}
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    #{booking.booking_id.substring(0, 8)}...
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                      mb: 1,
                    }}
                  >
                    {booking.service_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: "0.75rem",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {booking.booking_at ? dayjs(booking.booking_at).format("MMM D, YYYY @ h:mma") : "TBD"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={booking.status}
                      size="small"
                      sx={{
                        bgcolor: booking.status === "CONFIRMED" ? COLORS.SUCCESS_GREEN : 
                                 booking.status === "PENDING" ? "#EAB308" : // Yellow-500
                                 "#9CA3AF", // Gray-400
                        color: COLORS.WHITE,
                        fontSize: "0.7rem",
                        height: "20px",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: COLORS.PRIMARY_PURPLE,
                      }}
                    >
                      {booking.currency} {booking.service_price}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrow />}
                      sx={{
                        bgcolor: COLORS.PRIMARY_BLUE,
                        color: COLORS.WHITE,
                        textTransform: "none",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        px: 2,
                        "&:hover": {
                          bgcolor: "#2563eb",
                        },
                      }}
                    >
                      {t("start")}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Cancel />}
                      sx={{
                        borderColor: isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : COLORS.BORDER.DEFAULT_LIGHT,
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                        textTransform: "none",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        px: 2,
                      }}
                    >
                      {t("cancel")}
                    </Button>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                  onClick={() => router.push(`/spr/bookings/${booking.booking_id}`)}
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
