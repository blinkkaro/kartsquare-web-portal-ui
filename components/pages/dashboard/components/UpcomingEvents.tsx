"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowForward, Cancel } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  price: string;
  bookingStatus: string;
  image?: string;
  isOffline: boolean;
}

const UpcomingEvents: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  // Mock data - will be replaced with API data
  const events: Event[] = [
    {
      id: "1254AB78ASDE235",
      name: t("exploringCulinaryDelights"),
      date: "Sep 18, 2023",
      time: "9:00am - 18:00pm",
      price: "₹50.00",
      bookingStatus: "283/300",
      isOffline: true,
    },
    {
      id: "1254AB78ASDE236",
      name: t("exploringCulinaryDelights"),
      date: "Sep 18, 2023",
      time: "9:00am - 18:00pm",
      price: "₹50.00",
      bookingStatus: "283/300",
      isOffline: true,
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
            {t("upcomingEvents")}
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
            onClick={() => router.push("/events")}
          >
            {t("seeall")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {events.map((event, index) => (
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
                    bgcolor: COLORS.SECONDARY_ORANGE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.WHITE,
                    fontSize: "20px",
                  }}
                >
                  🍽️
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
                    {event.id} {event.isOffline && `- ${t("offline")}`}
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
                    {event.name}
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
                    {event.date}, {event.time}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: COLORS.PRIMARY_PURPLE,
                      }}
                    >
                      {event.price}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.75rem",
                      }}
                    >
                      {event.bookingStatus} {t("booked")}
                    </Typography>
                  </Box>
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

export default UpcomingEvents;
