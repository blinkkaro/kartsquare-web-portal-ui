/**
 * Whether the /services hub is served instead of the redirect to /cus/services-list.
 *
 * - SERVICES_HUB_ENABLED=true  -> on everywhere.
 * - SERVICES_HUB_ENABLED=false -> off everywhere.
 * - unset                      -> on in development, off in production until a person enables it.
 *
 * Read by next.config.ts (redirect, at build/start) and by the hub page and sitemap.
 */
export function isServicesHubEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.SERVICES_HUB_ENABLED === "true") return true;
  if (env.SERVICES_HUB_ENABLED === "false") return false;
  return env.NODE_ENV !== "production";
}
