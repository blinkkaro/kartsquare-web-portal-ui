import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  useTheme,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
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
  type SpeechRecognitionInstance = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult:
    | ((e: {
      results: { isFinal: boolean;[0]: { transcript: string } }[];
      resultIndex: number;
    }) => void)
    | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
  };
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const { search, isLoading } = useAISearch();

  // Speech-to-text: check support and create recognition instance
  const getSpeechRecognition =
    useCallback((): SpeechRecognitionInstance | null => {
      if (typeof window === "undefined") return null;
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) return null;
      const recognition =
        new SpeechRecognitionAPI() as SpeechRecognitionInstance;
      recognition.continuous = false; // stop when user stops talking
      recognition.interimResults = true;
      recognition.lang = "en-US";
      return recognition;
    }, []);

  const startListening = useCallback(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      return; // Voice not supported — mic still shown for consistency
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    recognitionRef.current = recognition;
    recognition.onresult = (event: {
      results: { isFinal: boolean;[0]: { transcript: string } }[];
      resultIndex: number;
    }) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final)
        setSearchValue((prev) => (prev ? prev + " " + final : final).trim());
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.start();
    setIsListening(true);
  }, [getSpeechRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Add default greeting message on mount
  useEffect(() => {
    const greetingMessage: AIMessage = {
      id: "greeting",
      role: "assistant",
      content: t("kartAiGreeting" as any),
      timestamp: new Date(),
    };
    setChatHistory([greetingMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: searchValue,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    const query = searchValue;
    setSearchValue("");

    try {
      // Call AI search service
      const response = await search(query);

      if (!response) return;

      // Add assistant response to chat
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message || t("ai_services_found"),
        timestamp: new Date(),
        services: "services" in response ? response.services : undefined,
        suggestedCategories:
          "suggestedCategories" in response
            ? response.suggestedCategories
            : undefined,
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("ai_error_message"),
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    // Automatically send the suggestion
    setTimeout(() => handleSearch(), 100);
  };

  const suggestionChips = [
    `${t("find")} ${t("plumber")} ${t("neatMyArea")}`,
    `${t("find")} ${t("electrician")} ${t("neatMyArea")}`,
    `${t("find")} ${t("cleaner")} ${t("neatMyArea")}`,
    `${t("find")} ${t("gardener")} ${t("neatMyArea")}`,
    `${t("find")} ${t("carpenter")} ${t("neatMyArea")}`,
    `${t("find")} ${t("painter")} ${t("neatMyArea")}`,
  ];

  const assistantBg = dark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE;
  const assistantBorder = dark
    ? COLORS.BORDER.DEFAULT_DARK
    : COLORS.BORDER.DEFAULT_LIGHT;
  const inputBg = dark
    ? COLORS.BACKGROUND.SECONDARY_DARK
    : COLORS.BACKGROUND.SECONDARY_LIGHT;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: { xs: 2, sm: 3 },
          pt: 2,
          pb: 24,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {chatHistory.map((msg, idx) => {
          const isGreeting = msg.id === "greeting";
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              {/* Message bubble — user: gradient pill; assistant: card with optional icon */}
              <Box
                sx={{
                  maxWidth: "88%",
                  p: isGreeting ? 2.5 : 2,
                  borderRadius: 2.5,
                  borderTopRightRadius: msg.role === "user" ? 1 : 2.5,
                  borderTopLeftRadius: msg.role === "user" ? 2.5 : 1,
                  background:
                    msg.role === "user"
                      ? `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PURPLE_HOVER} 100%)`
                      : undefined,
                  backgroundColor:
                    msg.role === "assistant" ? assistantBg : undefined,
                  color:
                    msg.role === "user"
                      ? COLORS.WHITE
                      : dark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  boxShadow:
                    msg.role === "user"
                      ? `0 4px 14px ${COLORS.PURPLE_ALPHA_30}`
                      : dark
                        ? "0 2px 12px rgba(0,0,0,0.2)"
                        : "0 2px 12px rgba(94, 24, 233, 0.08)",
                  border:
                    msg.role === "assistant"
                      ? `1px solid ${assistantBorder}`
                      : "none",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role === "assistant" && !isGreeting && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      mb: 1,
                    }}
                  >
                    <SmartToy
                      sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: COLORS.PRIMARY_PURPLE }}
                    >
                      Kart AI
                    </Typography>
                  </Box>
                )}
                {isGreeting && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AutoAwesome sx={{ color: COLORS.WHITE, fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: dark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      {t("kartAi")}
                    </Typography>
                  </Box>
                )}
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.5, whiteSpace: "pre-wrap" }}
                >
                  {msg.content}
                </Typography>
              </Box>

              {/* Services found */}
              {msg.services && msg.services.length > 0 && (
                <Box sx={{ width: "100%", mt: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 1.5,
                      fontWeight: 700,
                      color: dark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {t("ai_services_label")}
                  </Typography>
                  <Grid container spacing={2}>
                    {msg.services.map((service) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={service.service_id}>
                        <ServiceCard service={service} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Suggested categories */}
              {msg.suggestedCategories &&
                msg.suggestedCategories.length > 0 && (
                  <Box sx={{ mt: 1.5, width: "100%" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 1.5,
                        fontWeight: 700,
                        color: dark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {t("ai_explore_categories")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 1.5,
                      }}
                    >
                      {msg.suggestedCategories.map((category) => (
                        <Box
                          key={category.id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: dark
                              ? COLORS.BACKGROUND.PRIMARY_DARK
                              : COLORS.WHITE,
                            border: `1px solid ${assistantBorder}`,
                            flex: "1 1 auto",
                            minWidth: "180px",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: COLORS.PRIMARY_PURPLE,
                              boxShadow: `0 2px 12px ${COLORS.PURPLE_ALPHA_10}`,
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              mb: 1.25,
                              color: dark
                                ? COLORS.TEXT.PRIMARY_DARK
                                : COLORS.TEXT.PRIMARY_LIGHT,
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.75,
                            }}
                          >
                            {category.subcategories.map((subcat) => (
                              <Chip
                                key={subcat.id}
                                label={subcat.name}
                                size="small"
                                onClick={() => handleSuggestion(subcat.name)}
                                sx={{
                                  backgroundColor: COLORS.PURPLE_ALPHA_10,
                                  color: COLORS.PRIMARY_PURPLE,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  "&:hover": {
                                    backgroundColor: COLORS.PURPLE_ALPHA_20,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
            </Box>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                borderTopLeftRadius: 1,
                backgroundColor: assistantBg,
                border: `1px solid ${assistantBorder}`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: dark
                  ? "0 2px 12px rgba(0,0,0,0.2)"
                  : "0 2px 12px rgba(94, 24, 233, 0.08)",
              }}
            >
              <CircularProgress
                size={20}
                sx={{ color: COLORS.PRIMARY_PURPLE }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: dark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  fontWeight: 500,
                }}
              >
                {t("ai_thinking")}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, ml: 0.5 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      opacity: 0.7,
                      animation: "chatBounce 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Bottom Input Area */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: dark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
          borderTop: `1px solid ${assistantBorder}`,
          zIndex: 10,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            fontWeight: 600,
            color: dark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            fontSize: "0.75rem",
          }}
        >
          {t("ai_try_asking")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1,
            mb: 2,
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {suggestionChips.map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              disabled={isLoading}
              size="small"
              sx={{
                flexShrink: 0,
                backgroundColor: inputBg,
                border: `1px solid ${assistantBorder}`,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_ALPHA_10,
                  color: COLORS.PRIMARY_PURPLE,
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            placeholder={t("ask_anything_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0.25 }}>
                  <IconButton
                    size="small"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    title={
                      isListening ? t("ai_voice_listening") : t("ai_voice_tap")
                    }
                    sx={{
                      bgcolor: isListening ? "#c62828" : "transparent",
                      color: isListening
                        ? COLORS.WHITE
                        : dark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                      "&:hover": {
                        bgcolor: isListening
                          ? "#b71c1c"
                          : COLORS.PURPLE_ALPHA_20,
                        color: isListening
                          ? COLORS.WHITE
                          : COLORS.PRIMARY_PURPLE,
                      },
                    }}
                  >
                    <Mic sx={{ fontSize: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: inputBg,
                pr: 0.5,
                "& fieldset": { borderColor: assistantBorder },
                "&:hover fieldset": { borderColor: COLORS.PRIMARY_PURPLE },
                "&.Mui-focused fieldset": {
                  borderWidth: 2,
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
              },
            }}
          />
          <IconButton
            onClick={handleSearch}
            disabled={isLoading || !searchValue.trim()}
            title="Send"
            sx={{
              width: 48,
              height: 48,
              bgcolor:
                isLoading || !searchValue.trim()
                  ? dark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT
                  : COLORS.PRIMARY_PURPLE,
              color:
                isLoading || !searchValue.trim()
                  ? dark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT
                  : COLORS.WHITE,
              "&:hover": {
                bgcolor:
                  isLoading || !searchValue.trim()
                    ? undefined
                    : COLORS.PURPLE_HOVER,
              },
              "&.Mui-disabled": { bgcolor: "transparent", color: "inherit" },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Send sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Keyframes for typing dots — inject once */}
      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
