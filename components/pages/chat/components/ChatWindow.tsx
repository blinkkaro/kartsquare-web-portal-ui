import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Avatar, InputBase } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import axios from "axios";

interface ChatWindowProps {
    conversation: any;
    currentUserId: string;
    token: string | null;
    socket: any;
    onBack: () => void;
    API_URL: string;
}

const formatDateBadge = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isSameDay(date, today)) return "TODAY, " + timeStr.toUpperCase();
    if (isSameDay(date, yesterday)) return "YESTERDAY, " + timeStr.toUpperCase();

    return date.toLocaleDateString([], { month: "short", day: "numeric" }).toUpperCase() + ", " + timeStr.toUpperCase();
};

export default function ChatWindow({ conversation, currentUserId, token, socket, onBack, API_URL }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isParticipant1 = currentUserId === conversation.participant1_id;
    const otherUserFirstName = isParticipant1 ? conversation.p2_first_name : conversation.p1_first_name;
    const otherUserLastName = isParticipant1 ? conversation.p2_last_name : conversation.p1_last_name;
    const otherUserAvatar = isParticipant1 ? conversation.p2_profile_pic : conversation.p1_profile_pic;
    const otherUserId = isParticipant1 ? conversation.participant2_id : conversation.participant1_id;
    const title = `${otherUserFirstName || "User"} ${otherUserLastName || ""}`.trim();

    useEffect(() => {
        fetchMessages();
    }, [conversation.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: any) => {
            if (msg.conversation_id === conversation.id) {
                setMessages(prev => [...prev, msg]);

                if (msg.sender_id !== currentUserId) {
                    axios.patch(`${API_URL}/chat/conversations/${conversation.id}/read`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(console.error);
                }
            }
        };

        socket.on("new_chat_message", handleNewMessage);
        return () => {
            socket.off("new_chat_message", handleNewMessage);
        };
    }, [socket, conversation.id, currentUserId]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/chat/conversations/${conversation.id}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === "success") {
                setMessages(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !token) return;

        const messageData = {
            conversation_id: conversation.id,
            receiver_id: otherUserId,
            content: inputText.trim()
        };

        try {
            const tempId = "temp-" + Date.now();
            const optimisticMsg = {
                id: tempId,
                sender_id: currentUserId,
                content: inputText.trim(),
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setInputText("");

            const res = await axios.post(`${API_URL}/chat/messages`, messageData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === "success") {
                setMessages(prev => prev.map(m => m.id === tempId ? res.data.data : m));
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#FAFBFC" }}>
            {/* Header */}
            <Box sx={{
                p: 2,
                px: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "background.paper"
            }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton sx={{ display: { md: "none" }, mr: 1, ml: -1 }} onClick={onBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Avatar src={otherUserAvatar} alt={title} sx={{ width: 44, height: 44, mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>{title}</Typography>
                </Box>
                <IconButton>
                    <MoreVertIcon sx={{ color: "text.secondary" }} />
                </IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)", // Subtle grid pattern if wanted, or just flat
                backgroundSize: "20px 20px"
            }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <LogoLoader />
                    </Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography color="text.secondary">Send a message to start chatting</Typography>
                    </Box>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;

                        // Show date badge if it's the first message or if the date changed significantly
                        // In a real app we'd compare dates, here we render it occasionally.
                        // For exact screenshot fidelity, we inject centered timestamp occasionally.
                        // We'll just show it for the first message of the day.
                        let showDateBadge = false;
                        if (index === 0) {
                            showDateBadge = true;
                        } else {
                            const prevDate = new Date(messages[index - 1].created_at);
                            const currDate = new Date(msg.created_at);
                            if (prevDate.getDate() !== currDate.getDate()) {
                                showDateBadge = true;
                            }
                        }

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateBadge && (
                                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                                        <Typography sx={{
                                            fontSize: "0.7rem",
                                            color: "text.disabled",
                                            fontWeight: 600,
                                            letterSpacing: 0.5
                                        }}>
                                            {formatDateBadge(msg.created_at)}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{
                                    display: "flex",
                                    justifyContent: isMe ? "flex-end" : "flex-start",
                                    mb: 1
                                }}>
                                    {!isMe && (
                                        <Avatar src={otherUserAvatar} sx={{ width: 36, height: 36, mr: 2, mt: 0.5 }} />
                                    )}
                                    <Box sx={{ maxWidth: "65%" }}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                py: 1.5,
                                                borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                                                bgcolor: isMe ? "#E8E3FD" : "#FFFFFF",
                                                color: "#000000",
                                                boxShadow: isMe ? "none" : "0px 1px 2px rgba(0,0,0,0.05)",
                                                border: isMe ? "none" : "1px solid #F3F4F6",
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontSize: "0.95rem", lineHeight: 1.4 }}>
                                                {msg.content}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                textAlign: isMe ? "right" : "left",
                                                color: "text.disabled",
                                                mt: 0.5,
                                                fontSize: "0.7rem",
                                                px: 0.5
                                            }}
                                        >
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{
                p: 2,
                px: 3,
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5
            }}>
                <IconButton sx={{ color: "primary.main" }}>
                    <AddIcon />
                </IconButton>

                <InputBase
                    fullWidth
                    placeholder="Hello, ma'm how are you?|"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    sx={{
                        flex: 1,
                        fontSize: "0.95rem",
                        color: "text.primary"
                    }}
                />

                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                        <AttachFileIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "primary.main" }}>
                        <CameraAltOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "primary.main", mr: 1 }}>
                        <MicNoneOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            width: 40,
                            height: 40,
                            "&:hover": { bgcolor: "primary.dark" },
                            "&.Mui-disabled": { bgcolor: "action.disabledBackground" }
                        }}
                    >
                        <SendIcon sx={{ fontSize: 20, ml: 0.5 }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
