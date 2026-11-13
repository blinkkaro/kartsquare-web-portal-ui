"use client";
import React, { useState } from "react";
import { IconButton } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { FEED_DURATION, FEED_EASE, FEED_SPRING } from "../feedMotion";

const SPARKS = 6;
const SPARK_DISTANCE = 22;

interface LikeButtonProps {
  liked: boolean;
  /** Called on every press. The parent likes or unlikes. */
  onToggle: () => void;
  /** Colour of the outline heart. */
  color?: string;
}

/**
 * The heart. Pressing it to like pops the icon with a spring and sends a short ring of sparks outward;
 * unliking is a plain swap. A heart that is already liked when the card appears does not animate.
 * Under reduced motion it only swaps.
 */
export default function LikeButton({ liked, onToggle, color = "text.primary" }: LikeButtonProps) {
  const reduce = useReducedMotion() === true;
  // Counts likes pressed here; a new value remounts the icon and the sparks so they play again.
  const [pressed, setPressed] = useState(0);

  const press = () => {
    if (!liked) setPressed((n) => n + 1);
    onToggle();
  };

  return (
    <IconButton onClick={press} aria-label={liked ? "Unlike" : "Like"} aria-pressed={liked} sx={{ position: "relative", overflow: "visible" }}>
      <motion.span
        key={pressed}
        initial={reduce || pressed === 0 ? false : { scale: 0.65 }}
        animate={{ scale: 1 }}
        transition={FEED_SPRING}
        style={{ display: "inline-flex" }}
      >
        {liked ? <FavoriteRoundedIcon sx={{ color: COLORS.ERROR_RED }} /> : <FavoriteBorderRoundedIcon sx={{ color }} />}
      </motion.span>

      {!reduce && pressed > 0 && liked && (
        <span key={`sparks-${pressed}`} aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: SPARKS }).map((_, i) => {
            const angle = (i / SPARKS) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                animate={{ x: Math.cos(angle) * SPARK_DISTANCE, y: Math.sin(angle) * SPARK_DISTANCE, scale: 1, opacity: 0 }}
                transition={{ duration: 0.45, ease: FEED_EASE }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 6,
                  height: 6,
                  marginLeft: -3,
                  marginTop: -3,
                  borderRadius: 3,
                  background: i % 2 ? COLORS.PRIMARY_PURPLE : COLORS.ERROR_RED,
                }}
              />
            );
          })}
        </span>
      )}
    </IconButton>
  );
}

/**
 * A big heart that pops over a photo when it is double-tapped. Pass a number that goes up on every
 * double-tap: the overlay plays once per value. Renders nothing under reduced motion.
 */
export function DoubleTapHeart({ trigger }: { trigger: number }) {
  const reduce = useReducedMotion() === true;
  if (reduce || trigger === 0) return null;
  return (
    <motion.span
      key={trigger}
      aria-hidden
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 1.1] }}
      transition={{ duration: 0.8, times: [0, 0.25, 0.6, 1], ease: FEED_EASE }}
      style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", zIndex: 2 }}
    >
      <FavoriteRoundedIcon sx={{ fontSize: 96, color: COLORS.WHITE, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.45))" }} />
    </motion.span>
  );
}

/** A number that slides up when it changes (a like arriving), instead of snapping. */
export function AnimatedCount({ value, children }: { value: number; children?: React.ReactNode }) {
  const reduce = useReducedMotion() === true;
  const text = children ?? value.toLocaleString("en-IN");
  if (reduce) return <>{text}</>;
  return (
    <span style={{ display: "inline-flex", overflow: "hidden", verticalAlign: "bottom" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: FEED_DURATION.micro, ease: FEED_EASE }}
          style={{ display: "inline-block" }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
