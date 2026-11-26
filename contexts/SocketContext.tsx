"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { type Toast } from "react-hot-toast";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "@/store/hooks";
import { CHAT_ENABLED } from "@/lib/featureFlags";
import type { Notification as AppNotification } from "@/services/notifications/notificationInterfaces";
import type { Socket } from "socket.io-client";

// Notification Toast Component
const NotificationToast = ({ notification, t }: { notification: AppNotification; t: Toast }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        maxWidth: 350,
        width: "100%",
        bgcolor: isDark ? "background.paper" : "#fff",
        color: isDark ? "text.primary" : "text.primary",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: 2,
        p: 2,
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        borderLeft: `6px solid ${theme.palette.primary.main}`,
        animation: t.visible
          ? "animate-enter 0.3s ease-out"
          : "animate-leave 0.3s ease-in forwards",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
          {notification.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}
        >
          {notification.message}
        </Typography>
      </Box>
      <IconButton size="small" onClick={() => toast.dismiss(t.id)} sx={{ mt: -0.5, mr: -0.5 }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

// Define the shape of the context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  notifications: AppNotification[];
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Base URL handling
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
// Socket.io needs the base URL (e.g. localhost:8000) not the API path
const SOCKET_URL = String(API_URL).replace(/\/api\/v1\/?$/, "");

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const { token, user } = useAppSelector((state) => state.auth);

  // Initialize Socket connection
  useEffect(() => {
    if (!token || !user) {
      // Logged out: the previous run's cleanup already disconnected its socket; just reset state.
      setSocket(null);
      setIsConnected(false);
      return;
    }

    if (user?.unread_notification_count !== undefined) {
      setUnreadCount(user.unread_notification_count);
    }

    // Chat/realtime is switched off (lib/featureFlags): never open the socket. Notifications
    // still load over REST below.
    if (!CHAT_ENABLED) return;

    // socket.io-client is loaded only when chat is on and someone is signed in, so it never
    // weighs on a public page's first load.
    let cancelled = false;
    let newSocket: Socket | null = null;
    import("socket.io-client").then(({ io }) => {
      if (cancelled) return;
      const sock = io(SOCKET_URL, {
        path: "/socket.io",
        auth: {
          token: token,
        },
        // Ensure we don't create multiple connections
        reconnection: true,
        reconnectionAttempts: 5,
      });

      sock.on("connect", () => {
        setIsConnected(true);
      });

      sock.on("disconnect", () => {
        setIsConnected(false);
      });

      sock.on("connect_error", (err) => {
        // Expired/invalid token: stop retrying instead of looping and spamming the console.
        if (/auth|token|jwt|unauthori[sz]ed|forbidden/i.test(err.message)) {
          sock.disconnect();
        }
      });

      sock.on("new_notification", (notification: AppNotification) => {
        setNotifications((prev) => [notification, ...prev]);
        // Optimistically update count or wait for count update event
        // We will rely on 'notification_count_update' for count, OR increment locally
        setUnreadCount((prev) => prev + 1);

        // Show Toast Notification
        toast.custom((t) => <NotificationToast notification={notification} t={t} />, {
          duration: 3000,
          position: "top-right",
        });
      });

      sock.on("notification_count_update", (data: { count: number }) => {
        setUnreadCount(data.count);
      });

      newSocket = sock;
      setSocket(sock);
    });

    return () => {
      cancelled = true;
      newSocket?.disconnect();
    };
  }, [token, user]);

  // Fetch initial notifications and count
  // We can assume there is an API to get notifications and User profile has the count
  // For now, let's implement basic API calls or rely on the user passing initial data or a separate hook.
  // Ideally, this provider should fetch the initial state.

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      // Replace with your actual services/axios instance
      const res = await axios.get<{ status: string; data: AppNotification[] }>(
        `${API_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.status === "success") {
        setNotifications(res.data.data);
        // The list carries is_viewed, so the unread count is counted from it.
        const count = res.data.data.filter((n) => !n.is_viewed).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [token]);

  useEffect(() => {
    // Without the socket there is no "connected" event to wait for: load once per login.
    if (isConnected || (!CHAT_ENABLED && token)) {
      fetchNotifications();
    }
  }, [isConnected, fetchNotifications, token]);

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await axios.patch(
        `${API_URL}/notifications/mark-all-viewed`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_viewed: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      await axios.patch(
        `${API_URL}/notifications/${id}/viewed`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_viewed: true } : n)),
      );
      // Decrement locally if it was unread
      // Note: This logic assumes we know it was unread.
      // Ideally we check before decrementing.
      // We'll trust the count update from backend if we want perfect sync, or optimistically decrement.
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        unreadCount,
        notifications,
        markAllAsRead,
        markAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
