"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  AIMessage,
  isSuccessResponse,
  isFailureResponse,
} from "@/services/ai/aiInterface";
import { useAISearch } from "@/hooks/useAISearch";
import InitialView from "./InitialView";
import ChatInterface from "./ChatInterface";
import { AnimatePresence, motion } from "framer-motion";

export default function ServiceSearch() {
  const { isLoading, search } = useAISearch();

  const [isChatMode, setIsChatMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);

  // We need to keep track if we are in the middle of a search initiated from InitialView
  // so we can properly show the loading state in ChatInterface immediately.

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsChatMode(true);

    // Add user message
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const response = await search(query);

      if (response) {
        const botMsg: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
          services: isSuccessResponse(response) ? response.services : undefined,
          suggestedCategories: isFailureResponse(response)
            ? response.suggestedCategories
            : undefined,
        };
        setChatHistory((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      // Optional: Add error message to chat
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Full height of drawer
        overflow: "hidden", // Prevent outer scroll
        position: "relative",
      }}
    >
      <AnimatePresence mode="wait">
        {!isChatMode ? (
          <motion.div
            key="initial-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ height: "100%", width: "100%" }}
          >
            <InitialView
              onSearch={handleSearch}
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <ChatInterface
              chatHistory={chatHistory}
              onSearch={handleSearch}
              isLoading={isLoading}
              onSuggestionClick={handleSuggestionClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
