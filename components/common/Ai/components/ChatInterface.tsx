import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  useTheme,
  Typography,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  InputBase,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Send, AutoAwesome, SmartToy, Mic } from "@mui/icons-material";
import { AIMessage } from "@/services/ai/aiInterface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ServiceCard from "@/components/ServiceCard";
import { useAISearch } from "@/hooks/useAISearch";

export default function ChatInterface() {
  const theme = useTheme();
  const { t } = useTranslate();
  const dark = theme.palette.mode === "dark";
  const [searchValue, setSearchValue] = useState("");
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { search, isLoading } = useAISearch();
  const recognitionRef = useRef<any>(null);

  const getSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    return recognition;
  }, []);

  const startListening = useCallback(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) return;
    if (recognitionRef.current) recognitionRef.current.stop();
    recognitionRef.current = recognition;
    recognition.onresult = (event: any) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setSearchValue((prev) => (prev ? prev + " " + final : final).trim());
    };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.start();
    setIsListening(true);
  }, [getSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsListening(false);
  }, []);

  useEffect(() => {
    const greetingMessage: AIMessage = {
      id: "greeting",
      role: "assistant",
      content: t("kartAiGreeting" as any),
      timestamp: new Date(),
    };
    setChatHistory([greetingMessage]);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [chatHistory, isLoading]);

  const handleSearch = async (queryParam?: string) => {
    const query = queryParam || searchValue;
    if (!query.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setSearchValue("");

    try {
      const response = await search(query);
      if (!response) return;

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message || t("ai_services_found"),
        timestamp: new Date(),
        services: "services" in response ? response.services : undefined,
        suggestedCategories: "suggestedCategories" in response ? response.suggestedCategories : undefined,
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setChatHistory((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("ai_error_message"),
        timestamp: new Date(),
      }]);
    }
  };

  const suggestionChips = [
    `${t("find")} ${t("plumber")}`,
    `${t("find")} ${t("electrician")}`,
    `${t("find")} ${t("cleaner")}`,
    `${t("find")} ${t("painter")}`,
  ];

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      bgcolor: dark ? "#0a0a0a" : "#f8fafc",
      position: "relative"
    }}>
      {/* Messages Container */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: "auto", 
        px: 2, 
        pt: 2, 
        pb: 12, 
        display: "flex", 
        flexDirection: "column", 
        gap: 1.5,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" }
      }}>
        {chatHistory.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              width: "100%",
            }}
          >
            {/* Assistant Header */}
            {msg.role === "assistant" && msg.id !== "greeting" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5, ml: 1 }}>
                <SmartToy sx={{ fontSize: 14, color: COLORS.PRIMARY_PURPLE }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS.PRIMARY_PURPLE, fontSize: '0.65rem' }}>
                  KART AI
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                maxWidth: "85%",
                p: 1.5,
                borderRadius: "16px",
                borderTopRightRadius: msg.role === "user" ? "4px" : "16px",
                borderTopLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                background: msg.role === "user" 
                  ? `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`
                  : (dark ? "rgba(255,255,255,0.05)" : "#fff"),
                color: msg.role === "user" ? "#fff" : (dark ? "#eee" : "#1e293b"),
                boxShadow: msg.role === "user" 
                  ? "0 4px 12px rgba(94, 24, 233, 0.2)" 
                  : "0 2px 8px rgba(0,0,0,0.05)",
                border: msg.role === "assistant" ? `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}` : "none",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.9rem", lineHeight: 1.45, fontWeight: msg.role === "user" ? 500 : 400 }}>
                {msg.content}
              </Typography>
            </Box>

            {/* Services Results */}
            {msg.services && msg.services.length > 0 && (
              <Box sx={{ width: "100%", mt: 1, px: 0.5 }}>
                <Grid container spacing={1.5}>
                  {msg.services.map((service) => (
                    <Grid size={{ xs: 12 }} key={service.service_id}>
                      <ServiceCard service={service} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Suggested Categories */}
            {msg.suggestedCategories && msg.suggestedCategories.length > 0 && (
              <Box sx={{ mt: 1, width: "100%", display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {msg.suggestedCategories.map((cat) => (
                  <Chip 
                    key={cat.id} 
                    label={cat.name} 
                    size="small" 
                    onClick={() => handleSearch(cat.name)}
                    sx={{ 
                      bgcolor: COLORS.PURPLE_ALPHA_10, 
                      color: COLORS.PRIMARY_PURPLE, 
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }} 
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <LogoLoader size={16} />
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>Thinking...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        background: dark ? "rgba(10,10,10,0.8)" : "rgba(248,250,252,0.8)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`
      }}>
        {/* Quick Suggestions */}
        {chatHistory.length < 3 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
            {suggestionChips.map(s => (
              <Chip 
                key={s} 
                label={s} 
                onClick={() => handleSearch(s)} 
                sx={{ 
                  bgcolor: dark ? "rgba(255,255,255,0.05)" : "#fff", 
                  border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_04, borderColor: COLORS.PRIMARY_PURPLE }
                }} 
              />
            ))}
          </Box>
        )}

        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          bgcolor: dark ? "rgba(255,255,255,0.05)" : "#fff", 
          borderRadius: "24px",
          p: "4px 4px 4px 16px",
          border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          <InputBase
            fullWidth
            placeholder="Ask Kart AI..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{ fontSize: "0.95rem", color: dark ? "#fff" : "#1e293b" }}
          />
          <IconButton 
            size="small" 
            onClick={isListening ? stopListening : startListening}
            sx={{ color: isListening ? COLORS.PRIMARY_PURPLE : "text.secondary" }}
          >
            <Mic sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={() => handleSearch()}
            disabled={!searchValue.trim() && !isLoading}
            sx={{ 
              bgcolor: COLORS.PRIMARY_PURPLE, 
              color: "#fff",
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
              "&.Mui-disabled": { bgcolor: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9", color: "text.disabled" }
            }}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
