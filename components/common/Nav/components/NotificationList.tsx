"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  useTheme,
  alpha,
  Divider,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Cancel,
  EventAvailable,
  Assignment,
  DeleteOutline,
  DoneAll,
} from "@mui/icons-material";
import { getNotification } from "@/hooks/useNotification";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { COLORS } from "@/constants/colors";
import { service_booking_events } from "@/services/notifications/notificationInterfaces";
import { formatTimestamp } from "@/helper/helper";

// Get notification type details
const getNotificationTypeDetails = (type: service_booking_events, t: any) => {
  switch (type) {
    case service_booking_events.SERVICE_REQUEST:
      return {
        label: t("notificationServiceRequest"),
        icon: <Assignment />,
        color: COLORS.PRIMARY_BLUE,
      };
    case service_booking_events.BOOKING_CONFIRMED:
      return {
        label: t("notificationBookingConfirmed"),
        icon: <CheckCircle />,
        color: COLORS.SUCCESS_GREEN,
      };
    case service_booking_events.BOOKING_CANCELLED:
      return {
        label: t("notificationBookingCancelled"),
        icon: <Cancel />,
        color: "error",
      };
    case service_booking_events.BOOKING_COMPLETED:
      return {
        label: t("notificationBookingCompleted"),
        icon: <EventAvailable />,
        color: "warning",
      };
    default:
      return {
        label: "",
        icon: <NotificationsIcon />,
        color: COLORS.PRIMARY_BLUE,
      };
  }
};

import { useSocket } from "@/contexts/SocketContext";

function NotificationList({ onClose }: { onClose: () => void }) {
  const { notifications, markAllAsRead, markAsRead, refreshNotifications } = useSocket();
  const { t } = useTranslationContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Refresh notifications on mount (drawer open)
  React.useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Sort notifications by date (newest first)
  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => !n.is_viewed).length || 0;
  }, [notifications]);

  // Empty state
  if (!notifications || notifications.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          px: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${alpha(
              COLORS.PRIMARY_BLUE,
              0.1
            )}, ${alpha(COLORS.PRIMARY_BLUE, 0.1)})`,
            mb: 3,
          }}
        >
          <NotificationsIcon
            sx={{
              fontSize: { xs: 50, sm: 60 },
              color: COLORS.PRIMARY_BLUE,
              opacity: 0.6,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
            mb: 1,
          }}
        >
          {t("noNotifications")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            maxWidth: 300,
          }}
        >
          {t("noNotificationsDescription")}
        </Typography>
      </Box>
    );
  }



  return (
    <Box
      sx={{
        pb: 3,
      }}
    >
      {/* Header with stats */}
      {unreadCount > 0 && (
        <Box
          sx={{
            px: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Chip
            label={`${unreadCount} ${t("newNotification")}`}
            size="small"
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? COLORS.DARK_GRADIENT
                  : COLORS.PURPLECYAN,
              color: COLORS.WHITE,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Button
            size="small"
            startIcon={<DoneAll />}
            onClick={() => markAllAsRead()}
            sx={{
              textTransform: "none",
              color: isDark ? COLORS.WHITE : COLORS.PRIMARY_PURPLE,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": {
                background: alpha(COLORS.PRIMARY_BLUE, 0.1),
              },
            }}
          >
            {t("markAllAsRead")}
          </Button>
        </Box>
      )}

      {/* Notifications List */}
      <Stack spacing={0}>
        {sortedNotifications.map((notification, index) => {
          const typeDetails = getNotificationTypeDetails(notification.type, t);
          const timeAgo = formatTimestamp(notification.created_at);

          return (
            <React.Fragment key={notification.notification_id}>
              <Box
                onClick={() => markAsRead(notification.notification_id)}
                sx={{
                  px: 3,
                  py: 2,
                  position: "relative",
                  cursor: "pointer",
                  background: !notification.is_viewed
                    ? isDark
                      ? alpha(COLORS.PRIMARY_PURPLE, 0.05)
                      : alpha(COLORS.PRIMARY_PURPLE, 0.03)
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: isDark
                      ? alpha(COLORS.PRIMARY_PURPLE, 0.08)
                      : alpha(COLORS.PRIMARY_PURPLE, 0.06),
                  },
                }}
              >
                {/* Unread indicator */}
                {!notification.is_viewed && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 4,
                      height: "60%",
                      background: `linear-gradient(180deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PRIMARY_BLUE})`,
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Icon */}
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${alpha(
                        typeDetails.color,
                        0.1
                      )}, ${alpha(typeDetails.color, 0.2)})`,
                      color: typeDetails.color,
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(typeDetails.icon, {
                      sx: { fontSize: { xs: 20, sm: 24 } },
                    })}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                      mb={0.5}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: isDark
                            ? COLORS.TEXT.PRIMARY_DARK
                            : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark
                            ? COLORS.TEXT.SECONDARY_DARK
                            : COLORS.TEXT.SECONDARY_LIGHT,
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                        mb: 1.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {index < sortedNotifications.length - 1 && (
                <Divider
                  sx={{
                    mx: 3,
                    borderColor: isDark
                      ? alpha(COLORS.WHITE, 0.05)
                      : alpha(COLORS.BLACK, 0.05),
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Box>
  );
}

export default NotificationList;
