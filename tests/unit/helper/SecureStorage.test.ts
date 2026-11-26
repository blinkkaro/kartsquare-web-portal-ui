/**
 * @jest-environment jsdom
 */
import CryptoJS from "crypto-js";
import { secureStorage } from "@/helper/SecureStorage";

// The module reads NEXT_PUBLIC_SECRET_KEY at import; unset in tests, it uses its fallback key.
const KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-fallback-secret-key";

describe("secureStorage", () => {
  beforeEach(() => localStorage.clear());
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  afterAll(() => warn.mockRestore());

  it("stores values encrypted, never in plain text", () => {
    secureStorage.setItem("token", "abc.def.ghi");
    const raw = localStorage.getItem("token");
    expect(raw).toBeTruthy();
    expect(raw).not.toContain("abc.def.ghi");
  });

  it("reads back what it stored (strings, numbers, objects)", () => {
    secureStorage.setItem("token", "abc.def.ghi");
    secureStorage.setItem("register_step", 4);
    secureStorage.setItem("user", { id: "u1", role: "CUSTOMER" });
    expect(secureStorage.getItem("token")).toBe("abc.def.ghi");
    expect(secureStorage.getItem("register_step")).toBe(4);
    expect(secureStorage.getItem("user")).toEqual({ id: "u1", role: "CUSTOMER" });
  });

  it("still reads values written by the previous build (full crypto-js), so nobody is logged out", () => {
    const legacy = CryptoJS.AES.encrypt(JSON.stringify("legacy-token"), KEY).toString();
    localStorage.setItem("token", legacy);
    expect(secureStorage.getItem("token")).toBe("legacy-token");
  });

  it("writes values the previous build can read (safe to roll back)", () => {
    secureStorage.setItem("token", "new-token");
    const raw = localStorage.getItem("token") ?? "";
    const plain = CryptoJS.AES.decrypt(raw, KEY).toString(CryptoJS.enc.Utf8);
    expect(JSON.parse(plain)).toBe("new-token");
  });

  it("returns null for a missing key", () => {
    expect(secureStorage.getItem("nope")).toBeNull();
  });

  it("returns null for a value it cannot decrypt instead of throwing", () => {
    localStorage.setItem("token", "not-encrypted-at-all");
    expect(() => secureStorage.getItem("token")).not.toThrow();
    expect(secureStorage.getItem("token")).toBeNull();
  });

  it("removes and clears", () => {
    secureStorage.setItem("a", 1);
    secureStorage.setItem("b", 2);
    secureStorage.removeItem("a");
    expect(secureStorage.getItem("a")).toBeNull();
    secureStorage.clear();
    expect(secureStorage.getItem("b")).toBeNull();
  });
});
