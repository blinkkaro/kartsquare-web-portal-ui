"use client";

import { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery, Paper } from "@mui/material";
import { useSocket } from "@/contexts/SocketContext";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

// Sub-components to be created
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function ChatView() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { token, user } = useAppSelector((state) => state.auth);
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();
    const initialConversationId = searchParams.get("conversationId");

    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

    useEffect(() => {
        if (token) {
            fetchConversations();
        }
    }, [token]);

    // Listen to new messages to update the conversation list snippet/unread count
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewMessage = (message: any) => {
            // Re-fetch conversations to get updated unread counts and latest messages
            // Alternatively, we could optimistically update the state
            fetchConversations();
        };

        socket.on("new_chat_message", handleNewMessage);

        return () => {
            socket.off("new_chat_message", handleNewMessage);
        };
    }, [socket, isConnected]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === "success") {
                const fetchedConversations = res.data.data;
                setConversations(fetchedConversations);

                // If there is an initial conversation ID in URL and we haven't selected anything yet
                if (initialConversationId && !selectedConversation) {
                    const conv = fetchedConversations.find((c: any) => c.id === initialConversationId);
                    if (conv) {
                        handleSelectConversation(conv);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const handleSelectConversation = (conv: any) => {
        setSelectedConversation(conv);
        // Mark as read when selected
        if (conv.unread_count > 0 && token) {
            axios.patch(`${API_URL}/chat/conversations/${conv.id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(() => fetchConversations()).catch(console.error);
        }
    };

    return (
        <Box sx={{ p: isMobile ? 0 : 3, height: "100vh", display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, display: isMobile ? "none" : "block" }}>
                Chat
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    display: "flex",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: isMobile ? 0 : 2,
                    overflow: "hidden",
                }}
            >
                {/* Conversation List Sidebar */}
                {(!isMobile || !selectedConversation) && (
                    <Box sx={{ width: isMobile ? "100%" : 350, borderRight: `1px solid ${theme.palette.divider}` }}>
                        <ConversationList
                            conversations={conversations}
                            onSelect={handleSelectConversation}
                            selectedId={selectedConversation?.id}
                            currentUserId={user?.id}
                        />
                    </Box>
                )}

                {/* Chat Window */}
                {(!isMobile || selectedConversation) && (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        {selectedConversation ? (
                            <ChatWindow
                                conversation={selectedConversation}
                                currentUserId={user?.id || ""}
                                token={token || null}
                                socket={socket}
                                onBack={() => isMobile && setSelectedConversation(null)}
                                API_URL={API_URL}
                            />
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                                <Typography color="text.secondary">Select a conversation to start chatting</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
