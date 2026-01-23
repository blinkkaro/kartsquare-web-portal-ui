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
} from "@mui/material";
import {
  ArrowForward,
  Cancel,
  PlayArrow,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  paymentStatus: string;
  price: string;
  image?: string;
}

const UpcomingBookings: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  // Mock data - will be replaced with API data
  const bookings: Booking[] = [
    {
      id: "1254AB78ASDE235",
      serviceName: t("haircutAyurvedaSpa"),
      date: "Sep 18, 2023",
      time: "9:00am - 18:00pm",
      paymentStatus: t("fullPaid"),
      price: "₹50.00",
    },
    {
      id: "1254AB78ASDE236",
      serviceName: t("haircutAyurvedaSpa"),
      date: "Sep 18, 2023",
      time: "9:00am - 18:00pm",
      paymentStatus: t("fullPaid"),
      price: "₹50.00",
    },
  ];

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
          {bookings.map((booking, index) => (
            <Box
              key={index}
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
                    {booking.id}
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
                    {booking.serviceName}
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
                    {booking.date}, {booking.time}
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
                      label={booking.paymentStatus}
                      size="small"
                      sx={{
                        bgcolor: COLORS.SUCCESS_GREEN,
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
                      {booking.price}
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
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
