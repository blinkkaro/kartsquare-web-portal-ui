import { announceNavigationStart } from "@/lib/navigationProgress";
import type * as SentryNs from "@sentry/nextjs";

// Run non-critical work after the page is interactive so it doesn't compete
// with hydration (matters most on mid-range Android WebViews).
const whenIdle = (cb: () => void) => {
  const run = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(cb, { timeout: 4000 });
    } else {
      setTimeout(cb, 2000);
    }
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
};

let sentry: typeof SentryNs | null = null;

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  // The Sentry SDK is fetched as its own chunk instead of being bundled into the code every page
  // must run before it becomes interactive. Errors raised before it arrives are held here and
  // reported as soon as it initialises, so nothing is lost.
  const early: unknown[] = [];
  const onError = (e: ErrorEvent) => early.push(e.error ?? e.message);
  const onRejection = (e: PromiseRejectionEvent) => early.push(e.reason);
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      // Session replay - only record the sessions that actually hit an
      // error, plus a small sample of everything else, to keep this
      // affordable at real traffic volume.
      replaysSessionSampleRate: 0.02,
      replaysOnErrorSampleRate: 1.0,
    });
    sentry = Sentry;
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    for (const err of early.splice(0)) Sentry.captureException(err);
    // Replay observes every DOM mutation; attach it after load, not at boot.
    whenIdle(() => Sentry.addIntegration(Sentry.replayIntegration()));
  });
}

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  whenIdle(() => {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
      });
    });
  });
}

// Fires for every client navigation (<Link>, router.push/replace/back): starts the top progress bar
// and, once loaded, records the transition in Sentry.
export const onRouterTransitionStart: typeof SentryNs.captureRouterTransitionStart = (...args) => {
  announceNavigationStart(args[0]);
  return sentry?.captureRouterTransitionStart(...args);
};
