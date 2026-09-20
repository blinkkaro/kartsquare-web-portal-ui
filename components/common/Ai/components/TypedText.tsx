import React, { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Short "typing" reveal for the newest assistant reply. Full text is always in
 * the DOM for screen readers. Parent keys this by message id, so it animates
 * once per message.
 */
export default function TypedText({ text, animate }: { text: string; animate: boolean }) {
  const [instant] = useState(() => !animate || prefersReducedMotion());
  const [n, setN] = useState(0);

  useEffect(() => {
    if (instant) return;
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(id);
          return v;
        }
        return v + 2;
      });
    }, 14);
    return () => window.clearInterval(id);
  }, [text, instant]);

  const shown = instant ? text.length : n;
  return (
    <>
      <span aria-hidden={shown < text.length}>{text.slice(0, shown)}</span>
      {shown < text.length && (
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{text}</span>
      )}
    </>
  );
}
