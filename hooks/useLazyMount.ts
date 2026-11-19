"use client";

import { useEffect, useState } from "react";

/**
 * True from the first time `open` is true, and stays true. Lets an overlay (drawer, modal) that is
 * loaded on demand mount only when it is first needed, then stay mounted so its close animation
 * and internal state behave exactly as if it had always been there.
 */
export function useLazyMount(open: boolean): boolean {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  return mounted || open;
}

/**
 * Downloads code-split chunks once the page is idle, so an on-demand overlay opens without a
 * network wait on first use but never competes with the page's own first load.
 */
export function usePrefetchWhenIdle(loaders: ReadonlyArray<() => Promise<unknown>>): void {
  useEffect(() => {
    const run = () => {
      for (const load of loaders) load().catch(() => undefined);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(run, { timeout: 5000 });
      else timer = setTimeout(run, 2500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
    // Loaders are module-level constants; run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
