/**
 * Retry policy for the shared API client. A request that gets no response at
 * all (timeout, dropped connection) is retried once, but only for GET: a GET is
 * idempotent, a POST that may have reached the server is not. An aborted
 * request (ERR_CANCELED) is the caller's choice and is never retried.
 */
export const GET_TIMEOUT_MS = 6000;

/** Multipart uploads (documents, reels, thumbnails, CSVs) are big and slow on mobile networks. */
export const UPLOAD_TIMEOUT_MS = 120000;

/**
 * Timeout for one request: uploads get a long deadline (the shared 10 s default cancelled
 * every large file), a plain GET a short one (a stuck GET is retried, see above), everything
 * else keeps what the client was configured with.
 */
export function requestTimeoutMs(opts: {
  method?: string;
  isFormData: boolean;
  current?: number;
}): number | undefined {
  if (opts.isFormData) return UPLOAD_TIMEOUT_MS;
  if ((opts.method ?? "get").toLowerCase() === "get") {
    return Math.min(opts.current ?? GET_TIMEOUT_MS, GET_TIMEOUT_MS);
  }
  return opts.current;
}

interface RetryableError {
  code?: string;
  response?: unknown;
  config?: { method?: string; _timeoutRetried?: boolean } | null;
}

const RETRYABLE_CODES = new Set(["ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK"]);

export function shouldRetryOnTimeout(error: RetryableError): boolean {
  if (error.response) return false;
  if (!error.code || !RETRYABLE_CODES.has(error.code)) return false;
  const config = error.config;
  if (!config || config._timeoutRetried) return false;
  return (config.method ?? "get").toLowerCase() === "get";
}
