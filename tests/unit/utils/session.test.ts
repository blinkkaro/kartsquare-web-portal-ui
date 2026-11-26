/**
 * @jest-environment jsdom
 */
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { hydrateAuth, loginUser, logout } from "@/features/ui/authSlice";
import { secureStorage } from "@/helper/SecureStorage";
import { AppUserType } from "@/services/auth/auth.interface";
import { clearSession, getTokens, onSessionEnd, persistSession, SESSION_KEYS } from "@/utils/auth";
import type { User } from "@/services/auth/auth.interface";

jest.mock("@/services/auth/auth.service", () => ({
  authService: { login: jest.fn(), logout: jest.fn() },
}));

const user = { id: "u1", role: AppUserType.CUSTOMER, register_step: 6 } as User;
const tokens = { access_token: "access.jwt", refresh_token: "refresh.jwt" };

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe("session storage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("persistSession stores tokens, user, role and register step", () => {
    persistSession(user, tokens);
    expect(getTokens()).toEqual({ accessToken: "access.jwt", refreshToken: "refresh.jwt" });
    expect(secureStorage.getItem(SESSION_KEYS.user)).toEqual(user);
    expect(secureStorage.getItem(SESSION_KEYS.role)).toBe(AppUserType.CUSTOMER);
    expect(secureStorage.getItem(SESSION_KEYS.registerStep)).toBe(6);
  });

  it("clearSession wipes everything about the person and keeps device settings", () => {
    persistSession(user, tokens);
    secureStorage.setItem("user", user);
    localStorage.setItem("otp_expiry_timestamp", "123");
    localStorage.setItem("kartsquare_ai_location", "{}");
    localStorage.setItem("kartsquare_location_prompted", "1");
    sessionStorage.setItem("bus_lead_id", "lead-1");
    localStorage.setItem("theme", "light");
    secureStorage.setItem("aiServiceConfig", { a: 1 });

    clearSession();

    [
      ...Object.values(SESSION_KEYS),
      "user",
      "otp_expiry_timestamp",
      "kartsquare_ai_location",
      "kartsquare_location_prompted",
    ].forEach((key) => expect(localStorage.getItem(key)).toBeNull());
    expect(sessionStorage.getItem("bus_lead_id")).toBeNull();
    expect(localStorage.getItem("theme")).toBe("light");
    expect(secureStorage.getItem("aiServiceConfig")).toEqual({ a: 1 });
  });

  it("clearSession notifies onSessionEnd listeners until they unsubscribe", () => {
    const listener = jest.fn();
    const unsubscribe = onSessionEnd(listener);
    clearSession();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    clearSession();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("authSlice uses the one session flow", () => {
  beforeEach(() => localStorage.clear());

  it("loginUser.fulfilled signs in and persists the session", () => {
    const store = makeStore();
    store.dispatch(
      loginUser.fulfilled({ message: "ok", tokens, user }, "req", {
        email: "a@b.c",
        password: "x",
      }),
    );
    expect(store.getState().auth).toMatchObject({
      isAuthenticated: true,
      token: "access.jwt",
      user,
    });
    expect(getTokens().accessToken).toBe("access.jwt");
  });

  it("logout resets state and wipes storage, so a reload does not sign back in", () => {
    const store = makeStore();
    store.dispatch(
      loginUser.fulfilled({ message: "ok", tokens, user }, "req", {
        email: "a@b.c",
        password: "x",
      }),
    );
    store.dispatch(logout());
    expect(store.getState().auth).toMatchObject({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    expect(getTokens()).toEqual({ accessToken: null, refreshToken: null });

    const reloaded = makeStore();
    reloaded.dispatch(hydrateAuth());
    expect(reloaded.getState().auth.isAuthenticated).toBe(false);
  });

  it("loginUser.rejected keeps the backend's message", () => {
    const store = makeStore();
    store.dispatch(
      loginUser.rejected(null, "req", { email: "a@b.c", password: "x" }, "Invalid credentials"),
    );
    expect(store.getState().auth).toMatchObject({
      isAuthenticated: false,
      error: "Invalid credentials",
    });
  });
});
