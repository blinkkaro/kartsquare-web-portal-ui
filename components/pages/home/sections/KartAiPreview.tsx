"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { motion, useInView, useReducedMotion, useSpring } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useAppDispatch } from "@/store/hooks";
import { openAiNewChat, setInlineAiVisible } from "@/features/ui/uiSlice";
import { KART_AI_EXAMPLE_QUERY } from "@/lib/homeHero";

/**
 * A short, scripted example of how Kart AI helps. It is an illustration: nothing in it is a live
 * request, and it names no provider, price, rating or arrival time. Its button opens the real assistant.
 */
export const PREVIEW_LINES = {
  greeting: "Namaste! Aapko kya help chahiye?",
  customer: `${KART_AI_EXAMPLE_QUERY}.`,
  reply: "Samajh gayi. Geyser repair ki service dhoondhne mein help karti hoon. Aap kis area mein hain?",
} as const;

/** Delay (ms) before each step after the first. The first message is on screen from the start. */
export const STEP_DELAYS = [1100, 800, 1500] as const;
/** Steps: 1 greeting, 2 customer, 3 Kart AI typing, 4 reply. */
export const LAST_STEP = STEP_DELAYS.length + 1;

const ease = [0.22, 1, 0.36, 1] as const;

function Message({ from, children }: { from: "ai" | "customer"; children: React.ReactNode }) {
  const ai = from === "ai";
  return (
    <Box
      sx={{
        alignSelf: ai ? "flex-start" : "flex-end",
        maxWidth: "88%",
        px: 1.5,
        py: 1.1,
        fontSize: "0.92rem",
        lineHeight: 1.45,
        fontWeight: 500,
        borderRadius: ai ? "16px 16px 16px 5px" : "16px 16px 5px 16px",
        bgcolor: ai ? COLORS.BACKGROUND.PAPER_LIGHT : COLORS.PRIMARY_PURPLE,
        color: ai ? "text.primary" : COLORS.WHITE,
      }}
    >
      {children}
    </Box>
  );
}

function Typing({ animate }: { animate: boolean }) {
  return (
    <Box
      sx={{
        alignSelf: "flex-start",
        display: "flex",
        gap: 0.5,
        px: 1.5,
        py: 1.5,
        borderRadius: "16px 16px 16px 5px",
        bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={animate ? { y: [0, -3, 0], opacity: [0.45, 1, 0.45] } : undefined}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: 3, background: COLORS.PRIMARY_PURPLE, display: "block" }}
        />
      ))}
    </Box>
  );
}

/** What is on screen at a given step. Shared by the live list and the invisible full-height copy. */
function Conversation({ step, animate }: { step: number; animate: boolean }) {
  // Every line is its own motion element, so one that is already on screen never replays when the
  // next arrives. The greeting never animates in: it is there from the first paint.
  const item = (key: string, node: React.ReactNode) => (
    <motion.div
      key={key}
      initial={animate && key !== "greeting" ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease }}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {node}
    </motion.div>
  );
  return (
    <>
      {step >= 1 && item("greeting", <Message from="ai">{PREVIEW_LINES.greeting}</Message>)}
      {step >= 2 && item("customer", <Message from="customer">{PREVIEW_LINES.customer}</Message>)}
      {step === 3 && item("typing", <Typing animate={animate} />)}
      {step >= 4 && item("reply", <Message from="ai">{PREVIEW_LINES.reply}</Message>)}
    </>
  );
}

export default function KartAiPreview() {
  const dispatch = useAppDispatch();
  // `null` before hydration: render the finished conversation until we know the user's preference.
  const reducedMotion = useReducedMotion();
  const reduce = reducedMotion === true;
  const ref = useRef<HTMLDivElement>(null);
  // The card leans a few degrees toward the mouse (desktop only), then settles back.
  const tiltX = useSpring(0, { stiffness: 180, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 18 });
  const onTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onTiltEnd = () => {
    tiltX.set(0);
    tiltY.set(0);
  };
  const inView = useInView(ref, { amount: 0.3 });

  // Step 1 (the greeting) is on screen at once and in the server HTML.
  const [step, setStep] = useState(1);
  const [paused, setPaused] = useState(false);
  const finished = step >= LAST_STEP;
  const shown = reduce ? LAST_STEP : step;
  const running = inView && !paused && !finished && !reduce;

  // The floating AI button steps aside while this inline entry is on screen.
  useEffect(() => {
    dispatch(setInlineAiVisible(inView));
  }, [dispatch, inView]);
  useEffect(() => () => void dispatch(setInlineAiVisible(false)), [dispatch]);

  // Reveal one step at a time. Leaving the screen or pausing cancels the timer; coming back resumes.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setStep((s) => Math.min(s + 1, LAST_STEP)), STEP_DELAYS[step - 1]);
    return () => clearTimeout(timer);
  }, [running, step]);

  const replay = useCallback(() => {
    setStep(1);
    setPaused(false);
  }, []);

  const togglePause = () => {
    if (finished) replay();
    else setPaused((p) => !p);
  };

  const playLabel = finished ? "Example dobara chalayein" : paused ? "Example chalayein" : "Example rokein";

  return (
    // The wrapper carries a soft light half circle behind the card, so it stands off the violet band.
    // Decoration only: solid, static, and kept inside the page padding on narrow screens.
    <Box
      onPointerMove={onTilt}
      onPointerLeave={onTiltEnd}
      sx={{
        position: "relative",
        isolation: "isolate",
        perspective: "900px",
        width: "100%",
        maxWidth: { xs: "100%", md: 500 },
        justifySelf: { md: "center" },
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          // a "D": round on the left, flat on the right, taller than the card so it shows above and below
          top: { xs: "-12px", md: "-40px" },
          bottom: { xs: "-12px", md: "-40px" },
          right: { xs: "-6px", md: "-36px", lg: "-72px" },
          width: { xs: "78%", md: "82%" },
          borderRadius: { xs: "999px 28px 28px 999px", md: "999px 48px 48px 999px" },
          background: "rgba(255, 255, 255, 0.14)",
          pointerEvents: "none",
        },
      }}
    >
    <Box
      ref={ref}
      component={motion.section}
      aria-labelledby="kart-ai-preview-title"
      style={{ rotateX: tiltX, rotateY: tiltY }}
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: COLORS.WHITE,
        // The hero band around it sets white text; the card is white, so it sets its own.
        color: "text.primary",
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        borderRadius: "20px",
        boxShadow: "0 24px 56px rgba(20, 5, 47, 0.45)",
        overflow: "hidden",
      }}
    >
      {/* header: who, what this is, and the example controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pl: 2,
          pr: 0.5,
          py: 0.5,
          borderBottom: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Box
            aria-hidden
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color: COLORS.WHITE,
              bgcolor: COLORS.PRIMARY_PURPLE,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography id="kart-ai-preview-title" component="h2" sx={{ fontSize: "0.92rem", fontWeight: 700, lineHeight: 1.2 }}>
              Kart AI
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.2 }}>
              Example conversation
            </Typography>
          </Box>
        </Box>

        {/* nothing animates under reduced motion, so there is nothing to pause or replay */}
        {!reduce && (
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <IconButton aria-label={playLabel} onClick={togglePause} sx={{ width: 44, height: 44, color: "text.secondary" }}>
              {finished ? <ReplayRoundedIcon /> : paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
            </IconButton>
            {!finished && (
              <IconButton aria-label="Example shuru se dekhein" onClick={replay} sx={{ width: 44, height: 44, color: "text.secondary" }}>
                <ReplayRoundedIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* The whole conversation as plain text, so it reads in full whatever the animation is doing. */}
      <Box
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        <p>Example conversation. Kart AI: {PREVIEW_LINES.greeting}</p>
        <p>Customer: {PREVIEW_LINES.customer}</p>
        <p>Kart AI: {PREVIEW_LINES.reply}</p>
      </Box>

      {/* The invisible full conversation and the live one share one grid cell, so the card is always
          its final height and nothing below it moves as messages appear. */}
      <Box sx={{ display: "grid", p: 2, pb: 1.5 }} aria-hidden>
        <Box
          sx={{ gridArea: "1 / 1", display: "flex", flexDirection: "column", gap: 1, visibility: "hidden" }}
          // the copy is never interactive or focusable
          {...({ inert: "" } as Record<string, string>)}
        >
          <Conversation step={LAST_STEP} animate={false} />
        </Box>
        <Box sx={{ gridArea: "1 / 1", display: "flex", flexDirection: "column", gap: 1, alignContent: "start" }}>
          <Conversation step={shown} animate={!reduce} />
        </Box>
      </Box>

      {/* the way into the real assistant */}
      <Box sx={{ px: 2, pb: 2 }}>
        <ButtonBase
          onClick={() => dispatch(openAiNewChat())}
          sx={{
            width: "100%",
            minHeight: 48,
            gap: 0.75,
            borderRadius: "12px",
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
            fontWeight: 700,
            fontSize: "0.92rem",
            transition: "background-color 160ms ease, transform 120ms ease",
            "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            "&:active": { transform: "scale(0.98)" },
            "&.Mui-focusVisible": { outline: `3px solid ${COLORS.PURPLE_ALPHA_30}`, outlineOffset: 2 },
            "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:active": { transform: "none" } },
          }}
        >
          Kart AI se poochho <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
        </ButtonBase>
      </Box>
    </Box>
    </Box>
  );
}
