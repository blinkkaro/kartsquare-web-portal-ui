"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  Avatar,
  Fab,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock API Response Logic ---

const FAQ_DATA: Record<string, string> = {
  benefits: "KartSquare helps businesses reach more customers, manage listings easily, and boost sales with integrated marketing tools.",
  cost: "We offer flexible pricing plans tailored for businesses of all sizes, starting from a free tier for local shops!",
  features: "Our platform includes AI-driven search, reel integration, booking management, and detailed analytics.",
  reach: "With KartSquare, you can tap into a network of thousands of active shoppers looking for services like yours.",
  default: "That's a great question! KartSquare is designed to grow your digital presence. Would you like to know more about our pricing or key features?",
};

const getBotResponse = async (query: string): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("benefit") || lowerQuery.includes("why")) return FAQ_DATA.benefits;
  if (lowerQuery.includes("cost") || lowerQuery.includes("price") || lowerQuery.includes("free")) return FAQ_DATA.cost;
  if (lowerQuery.includes("feature") || lowerQuery.includes("tool") || lowerQuery.includes("work")) return FAQ_DATA.features;
  if (lowerQuery.includes("reach") || lowerQuery.includes("customer")) return FAQ_DATA.reach;
  
  return FAQ_DATA.default;
};

// --- Sub-components ---

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 1,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: isBot ? "rgba(136, 0, 255, 0.1)" : "rgba(0, 178, 255, 0.1)",
          color: isBot ? "#8800FF" : "#00B2FF",
        }}
      >
        {isBot ? <BotIcon sx={{ fontSize: 16 }} /> : <UserIcon sx={{ fontSize: 16 }} />}
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: "75%",
          borderRadius: isBot ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
          bgcolor: isBot ? "#F8FAFC" : "#00B2FF",
          color: isBot ? "#1E293B" : "#FFFFFF",
          border: isBot ? "1px solid rgba(0,0,0,0.05)" : "none",
          boxShadow: isBot ? "none" : "0 4px 12px rgba(0, 178, 255, 0.25)",
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: "Inter", lineHeight: 1.5 }}>
          {message.text}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            fontSize: "10px",
            opacity: 0.6,
            textAlign: isBot ? "left" : "right",
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Typography>
      </Paper>
    </Box>
  );
};

const Aibot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm your KartSquare assistant. How can I help grow your business today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const response = await getBotResponse(input);

    const botMsg: Message = {
      id: Date.now() + 1,
      text: response,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* AI Assistance Tooltip (visible when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              y: [0, -8, 0], // Floating bounce effect
            }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ 
              opacity: { duration: 0.2 },
              y: { 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut" 
              } 
            }}
            style={{
              position: "absolute",
              right: 80,
              bottom: 12,
              pointerEvents: "none"
            }}
          >
            <Paper
              elevation={4}
              sx={{
                py: 1,
                px: 2,
                borderRadius: "12px 12px 4px 12px",
                background: "white",
                border: "1px solid rgba(136, 0, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  right: -6,
                  bottom: 8,
                  width: 12,
                  height: 12,
                  bgcolor: "white",
                  transform: "rotate(45deg)",
                  borderRight: "1px solid rgba(136, 0, 255, 0.1)",
                  borderTop: "1px solid rgba(136, 0, 255, 0.1)",
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "13px",
                  whiteSpace: { xs: "normal", md: "nowrap" }
                }}
              >
                Hi there! 👋 I'm your KartSquare assistant.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Fab
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            background: "linear-gradient(135deg, #8800FF 0%, #00B2FF 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(136, 0, 255, 0.3)",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 80,
              right: 0,
              zIndex: 1000,
            }}
          >
            <Paper
              elevation={24}
              sx={{
                width: { xs: "320px", sm: "380px" },
                height: "520px",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2.5,
                  background: "linear-gradient(135deg, #8800FF 0%, #00B2FF 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      border: "2px solid rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <BotIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontFamily: "Plus Jakarta Sans",
                        lineHeight: 1.2,
                      }}
                    >
                      KartSquare Assistant
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#4ADE80",
                          boxShadow: "0 0 8px #4ADE80",
                        }}
                      />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Online Now
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton size="small" sx={{ color: "white" }}>
                  <MoreIcon />
                </IconButton>
              </Box>

              {/* Message Area */}
              <Box
                ref={scrollRef}
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "linear-gradient(to bottom, rgba(248, 250, 252, 0.5), transparent)",
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                  },
                }}
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                
                {isTyping && (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", color: "#8800FF", mb: 2 }}>
                    <CircularProgress size={12} color="inherit" />
                    <Typography variant="caption" sx={{ fontStyle: "italic", opacity: 0.7 }}>
                      KartSquare is thinking...
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <TextField
                  fullWidth
                  placeholder="Ask about business benefits..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      bgcolor: "#F8FAFC",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "rgba(136, 0, 255, 0.2)" },
                      "&.Mui-focused fieldset": { borderColor: "#8800FF" },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleSend}
                          disabled={!input.trim() || isTyping}
                          sx={{
                            background: input.trim()
                              ? "linear-gradient(135deg, #8800FF 0%, #00B2FF 100%)"
                              : "#E2E8F0",
                            color: "white",
                            "&:hover": {
                              opacity: 0.9,
                              background: "linear-gradient(135deg, #8800FF 0%, #00B2FF 100%)",
                            },
                            "&.Mui-disabled": {
                              bgcolor: "#F1F5F9",
                              color: "#CBD5E1",
                            },
                          }}
                        >
                          {isTyping ? <CircularProgress size={20} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 1.5,
                    color: "#94A3B8",
                    fontSize: "11px",
                  }}
                >
                  Powered by KartSquare AI
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Aibot;