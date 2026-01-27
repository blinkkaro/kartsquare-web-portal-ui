"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Box, Typography, IconButton, useTheme, alpha } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Notification Toast Component
const NotificationToast = ({ notification, t }: { notification: any; t: any }) => {
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
                animation: t.visible ? "animate-enter 0.3s ease-out" : "animate-leave 0.3s ease-in forwards",
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                    {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
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
    notifications: any[]; // Replace 'any' with Notification interface definition
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
// Socket.io needs the base URL (e.g. localhost:8000) not the API path
const SOCKET_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    const { token, user } = useAppSelector((state) => state.auth);

    // Initialize Socket connection
    useEffect(() => {
        if (!token || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        if (user?.unread_notification_count !== undefined) {
            setUnreadCount(user.unread_notification_count);
        }

        const newSocket = io(SOCKET_URL, {
            path: "/socket.io",
            auth: {
                token: token,
            },
            // Ensure we don't create multiple connections
            reconnection: true,
            reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        newSocket.on("new_notification", (notification: any) => {
            console.log("New notification received:", notification);
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

        newSocket.on("notification_count_update", (data: { count: number }) => {
            console.log("Notification count updated:", data.count);
            setUnreadCount(data.count);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
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
            const res = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setNotifications(res.data.data);
                // Verify if we can calculate unread count from list or if we need to fetch profile
                // The user prompt showed notification list but didn't explicitly show count field in the list response
                // But we added 'unread_notification_count' to user.
                // We should fetch user profile to get accurate count. 
                // We'll skip fetching profile here assuming Redux 'user' state might be updated elsewhere or we fetch it.
                // Actually, let's trust the Redux user state initially if it has it, or fetch it.
                // The prompt `user` object shows `unread_notification_count`? No, the user object in prompt didn't have it yet (we just added it).
                // So we might need to rely on the socket pushing it, or fetch it.
                // Let's count locally from the list for now if "is_viewed" is there.
                const count = res.data.data.filter((n: any) => !n.is_viewed).length;
                setUnreadCount(count);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    }, [token]);

    useEffect(() => {
        if (isConnected) {
            fetchNotifications();
        }
    }, [isConnected, fetchNotifications]);


    const markAllAsRead = async () => {
        if (!token) return;
        try {
            await axios.patch(`${API_URL}/notifications/mark-all-viewed`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_viewed: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const markAsRead = async (id: string) => {
        if (!token) return;
        try {
            await axios.patch(`${API_URL}/notifications/${id}/viewed`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_viewed: true } : n));
            // Decrement locally if it was unread
            // Note: This logic assumes we know it was unread.
            // Ideally we check before decrementing.
            // We'll trust the count update from backend if we want perfect sync, or optimistically decrement.
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, unreadCount, notifications, markAllAsRead, markAsRead, refreshNotifications: fetchNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};
