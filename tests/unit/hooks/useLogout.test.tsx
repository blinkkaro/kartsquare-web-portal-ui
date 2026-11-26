/**
 * @jest-environment jsdom
 */
import React from "react";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginUser } from "@/features/ui/authSlice";
import { useLogout } from "@/hooks/useLogout";
import { authService } from "@/services/auth/auth.service";
import { AppUserType } from "@/services/auth/auth.interface";
import { getTokens, onSessionEnd } from "@/utils/auth";
import type { User } from "@/services/auth/auth.interface";

const replace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace, push: jest.fn() }) }));
jest.mock("@/services/auth/auth.service", () => ({
  authService: { login: jest.fn(), logout: jest.fn() },
}));

const user = { id: "u1", role: AppUserType.SERVICE_PROVIDER, register_step: 6 } as User;
const tokens = { access_token: "access.jwt", refresh_token: "refresh.jwt" };

const setup = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  store.dispatch(
    loginUser.fulfilled({ message: "ok", tokens, user }, "req", { email: "a@b.c", password: "x" }),
  );
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(() => useLogout(), { wrapper });
  return { store, result };
};

describe("useLogout", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("revokes on the backend, clears state, storage and caches, then replaces the route", async () => {
    const cacheReset = jest.fn();
    const unsubscribe = onSessionEnd(cacheReset);
    const { store, result } = setup();

    await act(() => result.current.handleLogout());

    expect(authService.logout).toHaveBeenCalledWith("refresh.jwt");
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(getTokens()).toEqual({ accessToken: null, refreshToken: null });
    expect(cacheReset).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/");
    unsubscribe();
  });

  it("still signs out when the backend call fails", async () => {
    (authService.logout as jest.Mock).mockRejectedValueOnce(new Error("offline"));
    const { store, result } = setup();
    // authService.logout swallows its own errors; this proves useLogout does not depend on that.
    await act(() => result.current.handleLogout({ redirectTo: "/business-listing" }));
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it("goes where it is told", async () => {
    const { result } = setup();
    await act(() => result.current.handleLogout({ redirectTo: "/business-listing" }));
    expect(replace).toHaveBeenCalledWith("/business-listing");
  });
});
