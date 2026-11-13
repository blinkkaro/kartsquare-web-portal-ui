"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { FEED_DURATION, FEED_EASE } from "../feedMotion";

const SHOW_AFTER_SCREENS = 1.5;
const RING = 20; // circle radius in a 48px box

/**
 * A button that appears after about a screen and a half of scrolling and takes you back to the top.
 * Its ring fills as you scroll, so it also shows how far down the feed you are. Sits on the left,
 * because the Kart AI button owns the right edge on phones.
 */
export default function BackToTop() {
  const reduce = useReducedMotion() === true;
  const { scrollY, scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const show = y > window.innerHeight * SHOW_AFTER_SCREENS;
    setVisible((v) => (v === show ? v : show));
  });

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={motion.button}
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          initial={reduce ? false : { opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: FEED_DURATION.enter, ease: FEED_EASE }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          sx={{
            position: "fixed",
            zIndex: 1100,
            left: { xs: 16, lg: 24 },
            // clears the phone bottom nav (its height is published as --mobile-nav-h) and the home indicator
            bottom: "calc(var(--mobile-nav-h, 0px) + 16px + env(safe-area-inset-bottom, 0px))",
            width: 48,
            height: 48,
            p: 0,
            border: 0,
            borderRadius: "50%",
            bgcolor: COLORS.WHITE,
            color: COLORS.PRIMARY_PURPLE,
            boxShadow: "0 6px 20px rgba(42, 13, 115, 0.22)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            "&:focus-visible": { outline: `3px solid ${COLORS.PURPLE_ALPHA_30}`, outlineOffset: 2 },
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="24" cy="24" r={RING} fill="none" stroke={COLORS.PURPLE_ALPHA_20} strokeWidth="3" />
            <motion.circle cx="24" cy="24" r={RING} fill="none" stroke={COLORS.PRIMARY_PURPLE} strokeWidth="3" strokeLinecap="round" style={{ pathLength: reduce ? scrollYProgress : spring }} />
          </svg>
          <KeyboardArrowUpRoundedIcon sx={{ position: "relative" }} />
        </Box>
      )}
    </AnimatePresence>
  );
}
