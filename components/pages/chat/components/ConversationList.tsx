import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SpeakerNotesOffOutlinedIcon from "@mui/icons-material/SpeakerNotesOffOutlined";

interface ConversationListProps {
    conversations: any[];
    onSelect: (conv: any) => void;
    selectedId?: string;
    currentUserId?: string;
}

const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isSameDay(date, today)) return "Today, " + timeStr;
    if (isSameDay(date, yesterday)) return "Yesterday, " + timeStr;

    return date.toLocaleDateString([], { month: "short", day: "numeric" }) + ", " + timeStr;
};

export default function ConversationList({ conversations, onSelect, selectedId, currentUserId }: ConversationListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(conv => {
        const isParticipant1 = currentUserId === conv.participant1_id;
        const otherUserFirstName = isParticipant1 ? conv.p2_first_name : conv.p1_first_name;
        const otherUserLastName = isParticipant1 ? conv.p2_last_name : conv.p1_last_name;
        const title = `${otherUserFirstName || ""} ${otherUserLastName || ""}`.trim().toLowerCase();
        return title.includes(searchTerm.toLowerCase());
    });

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRadius: 4, overflow: "hidden" }}>
            {/* Search Bar area */}
            <Box sx={{ p: 3, pb: 1 }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#F7F8FA",
                    borderRadius: 8,
                    px: 2,
                    py: 1
                }}>
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
                    <InputBase
                        placeholder="Search user"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flex: 1, fontSize: "0.9rem" }}
                    />
                </Box>
            </Box>

            {/* List */}
            <List sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
                {filteredConversations.map((conv) => {
                    const isParticipant1 = currentUserId === conv.participant1_id;
                    const otherUserFirstName = isParticipant1 ? conv.p2_first_name : conv.p1_first_name;
                    const otherUserLastName = isParticipant1 ? conv.p2_last_name : conv.p1_last_name;
                    const otherUserAvatar = isParticipant1 ? conv.p2_profile_pic : conv.p1_profile_pic;
                    const title = `${otherUserFirstName || "User"} ${otherUserLastName || ""}`.trim();
                    const isSelected = selectedId === conv.id;

                    return (
                        <ListItem
                            key={conv.id}
                            onClick={() => onSelect(conv)}
                            sx={{
                                cursor: "pointer",
                                bgcolor: isSelected ? "#F3F4F6" : "transparent",
                                borderRadius: 3,
                                mb: 1,
                                px: 2,
                                py: 1.5,
                                "&:hover": { bgcolor: "#F3F4F6" }
                            }}
                            secondaryAction={
                                <IconButton edge="end" size="small">
                                    <MoreVertIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar sx={{ minWidth: 50 }}>
                                <Avatar src={otherUserAvatar} alt={title} sx={{ width: 44, height: 44 }} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                            {title}
                                        </Typography>
                                        {(conv.unread_count > 0 || conv.new_count > 0) && (
                                            <Box sx={{
                                                bgcolor: "#3B5EDB",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: 18,
                                                height: 18,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.65rem",
                                                fontWeight: 700,
                                                mr: 3
                                            }}>
                                                {conv.unread_count || conv.new_count}
                                            </Box>
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: (conv.unread_count > 0 || conv.new_count > 0) ? 600 : 400,
                                                color: (conv.unread_count > 0 || conv.new_count > 0) ? "text.primary" : "text.secondary",
                                                fontSize: "0.85rem",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "90%"
                                            }}
                                        >
                                            {conv.last_message || "Start a conversation"}
                                        </Typography>
                                        {conv.last_message_time && (
                                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", mt: 0.5 }}>
                                                {formatTime(conv.last_message_time)}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                sx={{ m: 0 }}
                            />
                        </ListItem>
                    );
                })}
                {filteredConversations.length === 0 && (
                    <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", mt: 4 }}>
                        <Box sx={{ p: 2, bgcolor: '#F3F4F6', borderRadius: '50%', mb: 2 }}>
                            <SpeakerNotesOffOutlinedIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                        </Box>
                        <Typography color="text.primary" variant="subtitle1" fontWeight={600} gutterBottom>
                            No conversations
                        </Typography>
                        <Typography color="text.secondary" variant="body2" textAlign="center" sx={{ maxWidth: 200 }}>
                            {searchTerm ? "No user found matching your search." : "You haven't started any conversations yet."}
                        </Typography>
                    </Box>
                )}
            </List>
        </Box>
    );
}
