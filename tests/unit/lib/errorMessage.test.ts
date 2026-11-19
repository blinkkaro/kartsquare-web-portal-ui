import { errorMessage } from "@/lib/http/errorMessage";

describe("errorMessage", () => {
  it("prefers the backend's message from an Axios-style error", () => {
    const err = Object.assign(new Error("Request failed with status code 400"), {
      response: { data: { message: "Business name is taken" } },
    });
    expect(errorMessage(err, "fallback")).toBe("Business name is taken");
  });

  it("uses the error's own message when the backend sent none", () => {
    expect(errorMessage(new Error("Network Error"), "fallback")).toBe("Network Error");
    const empty = Object.assign(new Error("timeout of 6000ms exceeded"), {
      response: { data: {} },
    });
    expect(errorMessage(empty, "fallback")).toBe("timeout of 6000ms exceeded");
  });

  it("falls back when there is nothing usable", () => {
    expect(errorMessage(undefined, "Failed to load")).toBe("Failed to load");
    expect(errorMessage(null, "Failed to load")).toBe("Failed to load");
    expect(errorMessage({}, "Failed to load")).toBe("Failed to load");
    expect(errorMessage(new Error(""), "Failed to load")).toBe("Failed to load");
    expect(errorMessage({ response: { data: { message: 42 } } }, "Failed to load")).toBe(
      "Failed to load",
    );
  });

  it("accepts a thrown string", () => {
    expect(errorMessage("Session expired", "fallback")).toBe("Session expired");
  });

  it("ignores a blank backend message", () => {
    const err = Object.assign(new Error("Bad Request"), { response: { data: { message: "  " } } });
    expect(errorMessage(err, "fallback")).toBe("Bad Request");
  });
});
