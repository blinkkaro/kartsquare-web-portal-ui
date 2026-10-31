import * as Sentry from "@sentry/nextjs";

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

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Session replay - only record the sessions that actually hit an
    // error, plus a small sample of everything else, to keep this
    // affordable at real traffic volume.
    replaysSessionSampleRate: 0.02,
    replaysOnErrorSampleRate: 1.0,
  });
  // Replay observes every DOM mutation; attach it after load, not at boot.
  whenIdle(() => Sentry.addIntegration(Sentry.replayIntegration()));
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
