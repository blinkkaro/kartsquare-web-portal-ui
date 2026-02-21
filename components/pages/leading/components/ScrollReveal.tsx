"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

const defaultEase = [0.25, 0.46, 0.45, 0.94];
const defaultDuration = 0.65;

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fadeUp" | "fade" | "scale" | "fadeLeft" | "fadeRight";
  delay?: number;
  className?: string;
  /** Trigger when this much of element is in view (0-1). Default 0.12 */
  amount?: number;
}

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: defaultDuration, ease: defaultEase },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: defaultEase },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: defaultDuration, ease: defaultEase },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 56 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: defaultDuration, ease: defaultEase },
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -56 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: defaultDuration, ease: defaultEase },
    },
  },
};

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
  amount = 0.12,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px", amount });

  const variantConfig = variants[variant];
  const visibleTransition =
    typeof variantConfig.visible.transition === "object"
      ? { ...variantConfig.visible.transition, delay }
      : { duration: defaultDuration, delay };
  const visibleWithDelay = {
    ...variantConfig.visible,
    transition: visibleTransition,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ hidden: variantConfig.hidden, visible: visibleWithDelay }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container: children animate in sequence when in view */
interface ScrollStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function ScrollStagger({
  children,
  staggerDelay = 0.08,
  className,
}: ScrollStaggerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px", amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Single stagger item: use inside ScrollStagger */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: defaultEase },
  },
};

export default ScrollReveal;
