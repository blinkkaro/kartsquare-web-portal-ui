"use client";

import React, { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  durationSeconds?: number;
}

/** Counts up to `value` once on mount and whenever it changes. Static under reduced motion. */
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, durationSeconds = 0.9 }) => {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(display, value, {
      duration: durationSeconds,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion, durationSeconds]);

  return <>{display.toLocaleString("en-IN")}</>;
};

export default AnimatedNumber;
