/**
 * The message to show for a failed API call: the backend's own `message` when it sent one
 * (`{ message }` in the error response body), else the error's message, else `fallback`.
 * Takes `unknown` because that is what a `catch` receives.
 */
export function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const { response, message } = error as {
      response?: { data?: { message?: unknown } };
      message?: unknown;
    };
    const fromApi = response?.data?.message;
    if (typeof fromApi === "string" && fromApi.trim()) return fromApi;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}
