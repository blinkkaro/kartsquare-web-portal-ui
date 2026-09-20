import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Box, useTheme, Typography, Chip, IconButton, InputBase } from "@mui/material";
import { useRouter } from "next/navigation";
import { Send, AutoAwesome, Mic } from "@mui/icons-material";
import {
  AgenticSearchContext,
  AgenticSearchResponse,
  AIAlternative,
  AIMessage,
  AIService,
} from "@/services/ai/aiInterface";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useAISearch } from "@/hooks/useAISearch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAiOpen, clearAiPendingQuery } from "@/features/ui/uiSlice";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import { getServiceRouteParam } from "@/utils/serviceRoute";
import { getExampleQueries } from "@/constants/aiSearch";
import { useAILocation } from "../useAILocation";
import LocationChip from "./LocationChip";
import IntentSummary from "./IntentSummary";
import ResultsPanel, { ResultsSkeleton } from "./ResultsPanel";
import { ClarifyBlock, NoResultsBlock } from "./EmptyStates";
import TypedText from "./TypedText";
import { fadeUp, MIN_TOUCH } from "./motion";

// Minimal typing for the browser Web Speech API (not in lib.dom for all targets).
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

// Survives the drawer unmounting, so going results -> provider profile -> back
// lands on the same conversation instead of an empty chat.
let persisted: { messages: AIMessage[]; sessionId: string } | null = null;

const newSessionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ChatInterface() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslate();
  const dark = theme.palette.mode === "dark";

  const [searchValue, setSearchValue] = useState("");
  const [chatHistory, setChatHistory] = useState<AIMessage[]>(persisted?.messages ?? []);
  const [isListening, setIsListening] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [locateSignal, setLocateSignal] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // One id per chat session so the backend can remember what we were just
  // talking about ("Mansarovar me", "sasta wala dikhao") without resending history.
  const sessionIdRef = useRef<string>(persisted?.sessionId ?? newSessionId());

  const pendingQuery = useAppSelector((state) => state.ui.aiPendingQuery);
  const { search, isLoading } = useAISearch();
  const { location, setLocation, locateMe, locating, locateError } = useAILocation();

  const examples = useMemo(() => getExampleQueries(location.city, location.locality), [location.city, location.locality]);

  // ---------------------------------------------------------------- voice
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as SpeechWindow;
    const API = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!API) return;
    const recognition = new API();
    recognition.continuous = false;
    recognition.interimResults = true;
    // en-IN transcribes Hinglish far better than en-US
    recognition.lang = "en-IN";
    if (recognitionRef.current) recognitionRef.current.stop();
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setSearchValue((prev) => (prev ? prev + " " + final : final).trim());
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = recognition.onend;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  // ------------------------------------------------------------- lifecycle
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        { id: "greeting", role: "assistant", content: t("kartAiGreeting" as any), timestamp: new Date() },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    persisted = { messages: chatHistory, sessionId: sessionIdRef.current };
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    const id = window.setInterval(() => setExampleIdx((i) => i + 1), 3500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  // ---------------------------------------------------------------- search
  const buildContext = (over?: AgenticSearchContext, loc = location): AgenticSearchContext => ({
    city: loc.city,
    locality: loc.locality ?? undefined,
    latitude: loc.coords?.latitude,
    longitude: loc.coords?.longitude,
    ...over,
  });

  const runSearch = async (query: string, over?: AgenticSearchContext, loc = location) => {
    const text = query.trim();
    if (!text || isLoading) return;
    setChatHistory((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date() },
    ]);
    setSearchValue("");
    try {
      const response = await search(text, sessionIdRef.current, buildContext(over, loc));
      if (!response) return;
      const message: AIMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response.message || t("ai_services_found"),
        timestamp: new Date(),
        response,
      };
      setChatHistory((prev) => [...prev, message]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: t("ai_error_message"), timestamp: new Date() },
      ]);
    }
  };

  // A query handed over from another screen (home search / symptom chips) runs once, right away.
  const handledPending = useRef<string | null>(null);
  useEffect(() => {
    if (!pendingQuery) {
      handledPending.current = null;
      return;
    }
    // Ref guard: effects can run twice (StrictMode) with the same stale closure.
    if (handledPending.current === pendingQuery || isLoading) return;
    handledPending.current = pendingQuery;
    dispatch(clearAiPendingQuery());
    void runSearch(pendingQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  const latest = [...chatHistory].reverse().find((m) => m.role === "assistant" && m.response);
  const latestConcept = latest?.response?.understanding?.conceptKey ?? null;
  const latestLabel = latest?.response?.understanding?.label ?? null;

  const changeService = (a: AIAlternative) => runSearch(a.label, { concept: a.key });
  const pickCategory = (c: { id: string; name: string; subcategoryId?: string }) =>
    runSearch(c.name, { categoryId: c.id, subcategoryId: c.subcategoryId });

  /** New place: re-run the current service there, or just remember the place if nothing was searched yet. */
  const changeLocation = (next: typeof location) => {
    setLocation(next);
    if (latestConcept) {
      const place = [next.locality, next.city].filter(Boolean).join(", ");
      runSearch(`${latestLabel} · ${place}`, { concept: latestConcept }, next);
    }
  };

  const useMyLocation = () =>
    locateMe((next) => {
      if (latestConcept) runSearch(`${latestLabel} · near me`, { concept: latestConcept }, next);
    });

  const openProfile = (s: AIService) => {
    // The assistant must not stay on top of the profile the user just opened.
    dispatch(closeDrawer());
    dispatch(setAiOpen(false));
    router.push(`/services/${getServiceRouteParam(s)}`);
  };

  const chipSx = {
    height: 34,
    fontSize: "0.78rem",
    fontWeight: 600,
    bgcolor: dark ? "rgba(130, 72, 247, 0.1)" : "#fff",
    border: `1px solid ${dark ? "rgba(130, 72, 247, 0.25)" : COLORS.PURPLE_ALPHA_20}`,
    color: COLORS.PRIMARY_PURPLE,
    "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_04, borderColor: COLORS.PRIMARY_PURPLE },
  } as const;

  const locationChip = (
    <LocationChip
      location={location}
      onChange={changeLocation}
      onUseCurrent={useMyLocation}
      locating={locating}
      error={locateError}
      disabled={isLoading}
      openSignal={locateSignal}
    />
  );

  // --------------------------------------------------------------- render
  const renderRich = (msg: AIMessage) => {
    const r: AgenticSearchResponse | undefined = msg.response;
    if (!r || msg.id !== latest?.id) return null;
    const u = r.understanding;
    const services = ("services" in r && r.services) || [];
    const common = {
      response: r,
      onPickService: changeService,
      onPickCategory: pickCategory,
      onChangeLocation: () => setLocateSignal((n) => n + 1),
      disabled: isLoading,
    };

    if (r.resultType === "results" || (!r.resultType && services.length > 0)) {
      const refinements = r.refinements;
      return (
        <Box sx={{ width: "100%", mt: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {u && (
            <IntentSummary
              understanding={u}
              alternatives={r.alternatives || []}
              locationChip={locationChip}
              onChangeService={changeService}
              disabled={isLoading}
            />
          )}
          {refinements && refinements.options.length > 0 && u?.conceptKey && (
            <Box role="group" aria-label={refinements.question} sx={{ ...fadeUp }}>
              <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 0.5 }}>{refinements.question}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                <Chip
                  label="All"
                  clickable
                  disabled={isLoading}
                  onClick={() => runSearch(u.label || "All", { concept: u.conceptKey! })}
                  sx={{ ...chipSx, ...(!refinements.selected && { bgcolor: COLORS.PURPLE_ALPHA_10 }) }}
                />
                {refinements.options.map((o) => (
                  <Chip
                    key={o.label}
                    label={`${o.label} (${o.count})`}
                    clickable
                    disabled={isLoading}
                    onClick={() => runSearch(o.label, { concept: u.conceptKey!, refinement: o.label })}
                    sx={{ ...chipSx, ...(refinements.selected === o.label && { bgcolor: COLORS.PURPLE_ALPHA_10 }) }}
                  />
                ))}
              </Box>
            </Box>
          )}
          <ResultsPanel
            key={msg.id}
            services={services}
            requestedLocality={u?.location.locality}
            userCoords={location.coords}
            onViewProfile={openProfile}
          />
        </Box>
      );
    }

    if (r.resultType === "clarify" || (!r.resultType && !r.success)) {
      return (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>{locationChip}</Box>
          <ClarifyBlock {...common} />
        </Box>
      );
    }

    // no_results / unsupported
    return (
      <Box sx={{ width: "100%", mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {u?.conceptKey ? (
          <IntentSummary
            understanding={u}
            alternatives={[]}
            locationChip={locationChip}
            onChangeService={changeService}
            disabled={isLoading}
          />
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>{locationChip}</Box>
        )}
        <NoResultsBlock {...common} />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: dark
          ? `linear-gradient(180deg, ${COLORS.BACKGROUND.PRIMARY_DARK} 0%, #0d0a17 100%)`
          : `linear-gradient(180deg, ${COLORS.PURPLE_ALPHA_04} 0%, #f8fafc 220px)`,
        position: "relative",
      }}
    >
      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          pt: 2,
          pb: 22,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {chatHistory.map((msg, idx) => {
          const isLast = idx === chatHistory.length - 1;
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 1,
                  maxWidth: "92%",
                  ...fadeUp,
                }}
              >
                {msg.role === "assistant" && (
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 14, color: "#fff" }} />
                  </Box>
                )}
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: "100%",
                    p: 1.5,
                    borderRadius: "16px",
                    borderTopRightRadius: msg.role === "user" ? "4px" : "16px",
                    borderTopLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                    background:
                      msg.role === "user"
                        ? `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`
                        : dark
                          ? "rgba(130, 72, 247, 0.08)"
                          : "#fff",
                    color: msg.role === "user" ? "#fff" : dark ? "#eee" : "#1e293b",
                    boxShadow: msg.role === "user" ? "0 4px 12px rgba(94, 24, 233, 0.2)" : "0 2px 8px rgba(94, 24, 233, 0.06)",
                    border: msg.role === "assistant" ? `1px solid ${dark ? "rgba(130, 72, 247, 0.2)" : COLORS.PURPLE_ALPHA_10}` : "none",
                    overflowWrap: "anywhere",
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", lineHeight: 1.45, fontWeight: msg.role === "user" ? 500 : 400 }}>
                    {msg.role === "assistant" ? <TypedText key={msg.id} text={msg.content} animate={isLast && !!msg.response} /> : msg.content}
                  </Typography>
                </Box>
              </Box>
              {renderRich(msg)}
            </Box>
          );
        })}

        {isLoading && (
          <Box role="status" aria-live="polite" sx={{ width: "100%", ...fadeUp }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500, display: "block", mb: 1, ml: 0.5 }}>
              Finding the right providers…
            </Typography>
            <ResultsSkeleton />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          pb: "max(16px, env(safe-area-inset-bottom))",
          background: dark ? "rgba(10,10,10,0.9)" : "rgba(248,250,252,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${dark ? "rgba(130, 72, 247, 0.15)" : COLORS.PURPLE_ALPHA_10}`,
        }}
      >
        <Box sx={{ mb: 1 }}>{!latest && locationChip}</Box>

        {chatHistory.length < 3 && (
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
            {examples.slice(0, 4).map((s) => (
              <Chip key={s} label={s} onClick={() => runSearch(s)} disabled={isLoading} sx={{ ...chipSx, flexShrink: 0 }} />
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: dark ? "rgba(130, 72, 247, 0.08)" : "#fff",
            borderRadius: "24px",
            p: "4px 4px 4px 14px",
            border: `1.5px solid ${dark ? "rgba(130, 72, 247, 0.25)" : COLORS.PURPLE_ALPHA_20}`,
            boxShadow: "0 2px 10px rgba(94, 24, 233, 0.06)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
            "&:focus-within": {
              borderColor: COLORS.PRIMARY_PURPLE,
              boxShadow: `0 0 0 3px ${COLORS.PURPLE_ALPHA_10}`,
              transform: "translateY(-1px)",
            },
            "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:focus-within": { transform: "none" } },
          }}
        >
          <AutoAwesome sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE, opacity: 0.7 }} />
          <InputBase
            fullWidth
            placeholder={`Try: ${examples[exampleIdx % examples.length]}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                runSearch(searchValue);
              }
            }}
            inputProps={{ "aria-label": "Describe what you need", enterKeyHint: "search", style: { fontSize: 16 } }}
            sx={{ color: dark ? "#fff" : "#1e293b", minHeight: MIN_TOUCH - 8 }}
          />
          <IconButton
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? "Stop voice input" : "Voice input"}
            sx={{ width: MIN_TOUCH, height: MIN_TOUCH, color: isListening ? COLORS.PRIMARY_PURPLE : "text.secondary" }}
          >
            <Mic sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={() => runSearch(searchValue)}
            disabled={!searchValue.trim() || isLoading}
            aria-label="Search"
            sx={{
              width: MIN_TOUCH,
              height: MIN_TOUCH,
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "#fff",
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
              "&.Mui-disabled": { bgcolor: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9", color: "text.disabled" },
            }}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
