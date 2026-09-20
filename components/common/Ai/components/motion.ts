/** Every animation in the AI UI opts out under prefers-reduced-motion. */
export const reducedMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    transition: "none !important",
  },
} as const;

export const fadeUp = {
  animation: "aiFadeUp 220ms ease-out both",
  "@keyframes aiFadeUp": {
    from: { opacity: 0, transform: "translateY(6px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  ...reducedMotion,
} as const;

export const MIN_TOUCH = 44;
