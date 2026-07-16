"use client";
import { useEffect, useRef } from "react";

/**
 * Attaches a single IntersectionObserver to a container ref.
 * Every child with data-animate gets the "visible" class when it enters
 * the viewport — driven purely by CSS keyframes, zero framer-motion.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <Box ref={ref}>
 *     <Box data-animate data-delay="0">...</Box>
 *     <Box data-animate data-delay="100">...</Box>
 *   </Box>
 */
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-animate]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ?? "0";
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("ks-visible");
          observer.unobserve(el);
        });
      },
      { threshold }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
