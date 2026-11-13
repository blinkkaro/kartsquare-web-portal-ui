/**
 * The feed's motion language, in one place so every animation shares one rhythm.
 * Rules: transform and opacity only; 150-300ms; springs for things that respond to a tap;
 * nothing loops except loading skeletons; everything is off under prefers-reduced-motion
 * (components read `useReducedMotion()` from framer-motion).
 */
export const FEED_SPRING = { type: "spring", stiffness: 420, damping: 28 } as const;
export const FEED_EASE = [0.22, 1, 0.36, 1] as const;
export const FEED_DURATION = { micro: 0.18, enter: 0.28, exit: 0.18 } as const;
/** Gap between siblings that enter one after another (stories, tabs), in seconds. */
export const FEED_STAGGER = 0.04;
