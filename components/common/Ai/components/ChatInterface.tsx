import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Typography,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { AIMessage } from "@/services/ai/aiInterface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ServiceCard from "@/components/ServiceCard";
import { useAISearch } from "@/hooks/useAISearch";

export default function ChatInterface() {
  const theme = useTheme();
  const { t } = useTranslate();
  const [searchValue, setSearchValue] = useState("");
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { search, isLoading } = useAISearch();

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
        content: response.message || "Here are the services I found for you:",
        timestamp: new Date(),
        services: "services" in response ? response.services : undefined,
        suggestedCategories:
          "suggestedCategories" in response
            ? response.suggestedCategories
            : undefined,
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
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

  return (
    <>
      {/* Chat History Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 3,
          pt: 3,
          pb: 20, // Space for bottom input
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {chatHistory.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Message Bubble - Purple for user, white for assistant */}
            <Box
              sx={{
                maxWidth: "85%",
                p: 2,
                borderRadius: "20px",
                borderTopRightRadius: msg.role === "user" ? "4px" : "20px",
                borderTopLeftRadius: msg.role === "user" ? "20px" : "4px",
                backgroundColor:
                  msg.role === "user" ? COLORS.PRIMARY_PURPLE : COLORS.WHITE,
                color:
                  msg.role === "user"
                    ? COLORS.WHITE
                    : COLORS.TEXT.PRIMARY_LIGHT,
                boxShadow: COLORS.SHADOW.LIGHT,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
            </Box>

            {/* Render Services if available */}
            {msg.services && msg.services.length > 0 && (
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                  {msg.services.map((service) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={service.service_id}>
                      <ServiceCard service={service} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Render Suggested Categories if available */}
            {msg.suggestedCategories && msg.suggestedCategories.length > 0 && (
              <Box sx={{ mt: 2, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {msg.suggestedCategories.map((category) => (
                    <Box
                      key={category.id}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? COLORS.BACKGROUND.PRIMARY_DARK
                            : COLORS.WHITE,
                        border: `1px solid ${
                          theme.palette.mode === "dark"
                            ? COLORS.BORDER.DEFAULT_DARK
                            : COLORS.BORDER.DEFAULT_LIGHT
                        }`,
                        flex: "1 1 auto",
                        minWidth: "200px",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {category.name}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {category.subcategories.map((subcat) => (
                          <Chip
                            key={subcat.id}
                            label={subcat.name}
                            size="small"
                            onClick={() => handleSuggestion(subcat.name)}
                            sx={{
                              backgroundColor: COLORS.PURPLE_ALPHA_10,
                              color: COLORS.PRIMARY_PURPLE,
                              fontWeight: 500,
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
        ))}

        {/* Loading Indicator */}
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
                borderRadius: "20px",
                borderTopLeftRadius: "4px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Thinking...
              </Typography>
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
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.WHITE,
          borderTop: `1px solid ${
            theme.palette.mode === "dark"
              ? COLORS.BORDER.DEFAULT_DARK
              : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          zIndex: 10,
        }}
      >
        {/* Suggestions above input */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1,
            mb: 2,
            pb: 1,
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
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                "&:hover": {
                  backgroundColor: COLORS.PURPLE_ALPHA_10,
                  color: COLORS.PRIMARY_PURPLE,
                },
              }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          placeholder={t("ask_anything_placeholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  component="button"
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue.trim()}
                  sx={{
                    background: "none",
                    border: "none",
                    cursor:
                      isLoading || !searchValue.trim() ? "default" : "pointer",
                    color:
                      isLoading || !searchValue.trim()
                        ? theme.palette.text.disabled
                        : COLORS.PRIMARY_PURPLE,
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: !(isLoading || !searchValue.trim())
                        ? "scale(1.1)"
                        : "none",
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : <Send />}
                </Box>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
              "& fieldset": { border: "none" },
            },
          }}
        />
      </Box>
    </>
  );
}
