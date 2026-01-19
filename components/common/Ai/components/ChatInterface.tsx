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

interface ChatInterfaceProps {
  chatHistory: AIMessage[];
  onSearch: (query: string) => void;
  isLoading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export default function ChatInterface({
  chatHistory,
  onSearch,
  isLoading,
  onSuggestionClick,
}: ChatInterfaceProps) {
  const theme = useTheme();
  const { t } = useTranslate();
  const [searchValue, setSearchValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    onSearch(searchValue);
    setSearchValue("");
  };

  const handleSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onSearch(suggestion);
    }
    // If we don't clear search value here, it might persist.
    // Actually usually suggestion click implies sending immediately.
    // So let's clear it if the parent handles it immediately.
    // But for now, let's assume we want to match the previous behavior.
  };

  const suggestionChips = [
    t("plumber"),
    t("electrician"),
    t("cleaner"),
    t("gardener"),
    t("carpenter"),
    t("painter"),
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
            {/* Message Bubble - Only styled for USER */}
            {msg.role === "user" ? (
              <Box
                sx={{
                  maxWidth: "85%",
                  p: 2,
                  borderRadius: "20px",
                  borderTopRightRadius: "4px",
                  borderTopLeftRadius: "20px",
                  backgroundColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.WHITE,
                  boxShadow: COLORS.SHADOW.LIGHT,
                  alignSelf: "flex-end",
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            ) : (
              // Assistant Message - Plain Text
              <Box sx={{ width: "100%", mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            )}

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
                    flexDirection: "column",
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
