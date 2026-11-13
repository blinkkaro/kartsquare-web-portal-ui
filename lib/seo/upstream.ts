/**
 * Server-side fetch of the public API with an explicit outcome:
 *
 *   ok         2xx with a JSON body
 *   not-found  the API said the entity does not exist (404/410, or 400 for a
 *              malformed identifier)
 *   throws UpstreamError for everything else: network error, timeout, 5xx,
 *              429, 401/403, unparsable body. These are operational failures,
 *              never "missing content", so callers must not call notFound().
 *
 * Callers must not wrap the result in a broad try/catch that also covers
 * `notFound()` / `permanentRedirect()`: those work by throwing.
 */
export class UpstreamError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "UpstreamError";
    this.status = status;
  }
}

export type UpstreamResult<T> = { status: "ok"; body: T } | { status: "not-found" };

const NOT_FOUND_STATUSES = new Set([400, 404, 410]);
export const UPSTREAM_TIMEOUT_MS = 8000;

export function getApiBaseUrl(): string {
  const raw =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5500/api/v1";
  return String(raw).replace(/\/$/, "");
}

export async function fetchPublicJson<T>(
  url: string,
  options: { revalidate?: number } = {},
): Promise<UpstreamResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: options.revalidate ?? 300 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (cause) {
    throw new UpstreamError(
      `Upstream request failed: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }

  if (NOT_FOUND_STATUSES.has(res.status)) return { status: "not-found" };
  if (!res.ok) throw new UpstreamError(`Upstream responded ${res.status}`, res.status);

  try {
    return { status: "ok", body: (await res.json()) as T };
  } catch {
    throw new UpstreamError("Upstream returned an unparsable body", res.status);
  }
}
