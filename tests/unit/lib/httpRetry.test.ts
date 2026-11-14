import { GET_TIMEOUT_MS, shouldRetryOnTimeout } from "@/lib/http/retry";

const err = (over: Record<string, unknown>) => ({ code: "ECONNABORTED", config: { method: "get" }, ...over });

describe("shouldRetryOnTimeout", () => {
  it("retries a GET that timed out once", () => {
    expect(shouldRetryOnTimeout(err({}))).toBe(true);
    expect(shouldRetryOnTimeout(err({ code: "ERR_NETWORK" }))).toBe(true);
    expect(shouldRetryOnTimeout(err({ config: {} }))).toBe(true); // method defaults to get
  });

  it("does not retry twice", () => {
    expect(shouldRetryOnTimeout(err({ config: { method: "get", _timeoutRetried: true } }))).toBe(false);
  });

  it("never retries non-idempotent requests", () => {
    for (const method of ["post", "put", "patch", "delete"]) {
      expect(shouldRetryOnTimeout(err({ config: { method } }))).toBe(false);
    }
  });

  it("does not retry when the server answered, or the caller aborted", () => {
    expect(shouldRetryOnTimeout(err({ response: { status: 500 } }))).toBe(false);
    expect(shouldRetryOnTimeout(err({ code: "ERR_CANCELED" }))).toBe(false);
    expect(shouldRetryOnTimeout({ config: { method: "get" } })).toBe(false);
    expect(shouldRetryOnTimeout({ code: "ECONNABORTED", config: null })).toBe(false);
  });

  it("uses a short GET timeout, below the old 10 s", () => {
    expect(GET_TIMEOUT_MS).toBeLessThan(10000);
  });
});

import { UPLOAD_TIMEOUT_MS, requestTimeoutMs } from "@/lib/http/retry";

describe("requestTimeoutMs", () => {
  it("gives multipart uploads a long deadline (the old 10 s cancelled big files)", () => {
    expect(requestTimeoutMs({ method: "post", isFormData: true, current: 10000 })).toBe(UPLOAD_TIMEOUT_MS);
    expect(requestTimeoutMs({ method: "put", isFormData: true, current: 10000 })).toBe(UPLOAD_TIMEOUT_MS);
    expect(UPLOAD_TIMEOUT_MS).toBeGreaterThanOrEqual(60000);
  });

  it("keeps GETs short and everything else on the configured timeout", () => {
    expect(requestTimeoutMs({ method: "get", isFormData: false, current: 10000 })).toBe(GET_TIMEOUT_MS);
    expect(requestTimeoutMs({ method: "post", isFormData: false, current: 10000 })).toBe(10000);
  });
});
