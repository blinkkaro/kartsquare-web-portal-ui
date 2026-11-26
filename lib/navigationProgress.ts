/**
 * Glue between Next's router and the top progress bar (components/common/Loader/NavigationProgress).
 * `instrumentation-client.ts` calls `announceNavigationStart` from Next's `onRouterTransitionStart`
 * hook, which fires for every <Link> click and router.push/replace/back on phones and desktop alike.
 */

/** Window event fired when a client-side navigation starts. `detail.href` is the target. */
export const NAVIGATION_START_EVENT = "ks:navigation-start";

export interface NavigationStartDetail {
  href: string;
}

/**
 * Whether navigating from `current` to `target` loads a different page, i.e. changes the path or
 * the query. A hash-only jump or a link to the page already open never ends a navigation (the URL
 * does not change), so the bar must not start for it or it would never finish.
 */
export function isPageChange(target: string, current: string): boolean {
  let to: URL;
  let from: URL;
  try {
    from = new URL(current);
    to = new URL(target, from);
  } catch {
    return false;
  }
  if (to.origin !== from.origin) return false;
  return to.pathname !== from.pathname || to.search !== from.search;
}

/** Tell the progress bar a navigation to `href` has started. Safe to call on the server (no-op). */
export function announceNavigationStart(href: string): void {
  if (typeof window === "undefined") return;
  if (!isPageChange(href, window.location.href)) return;
  window.dispatchEvent(
    new CustomEvent<NavigationStartDetail>(NAVIGATION_START_EVENT, { detail: { href } }),
  );
}
