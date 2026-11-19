/**
 * @jest-environment jsdom
 *
 * The shell (app/MainLayoutClient) loads its overlays (Kart AI, profile drawer, login modal) on
 * demand. This proves the wiring with the real Redux store: nothing is mounted until its flag is
 * set, the same actions the app dispatches open it, and it stays mounted after closing so its
 * close animation can play. Only the heavy overlay bodies and the nav/footer are stubbed.
 */
import "@testing-library/jest-dom";
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import uiReducer, { setAiOpen } from "@/features/ui/uiSlice";
import authReducer from "@/features/ui/authSlice";
import profileDrawerReducer, { closeDrawer, openDrawer } from "@/features/ui/profileDrawerSlice";
import appConfigReducer from "@/features/ui/appConfigSlice";
import loginModalReducer, { closeLoginModal, openLoginModal } from "@/features/ui/loginModalSlice";
import MainLayoutClient from "@/app/MainLayoutClient";

// next/dynamic resolved synchronously-ish: render the loaded module's default export once ready.
jest.mock("next/dynamic", () => {
  const ReactLib: typeof React = jest.requireActual("react");
  return (loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) =>
    function Dynamic(props: Record<string, unknown>) {
      const [Comp, setComp] = ReactLib.useState<React.ComponentType<
        Record<string, unknown>
      > | null>(null);
      ReactLib.useEffect(() => {
        let live = true;
        void loader().then((m) => live && setComp(() => m.default));
        return () => {
          live = false;
        };
      }, []);
      return Comp ? <Comp {...props} /> : null;
    };
});

jest.mock("@/components/common/Ai", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => <div data-testid="ai" data-open={String(open)} />,
}));
jest.mock("@/components/common/ProfileDrawer", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-drawer" />,
}));
jest.mock("@/components/common/loginModel", () => ({
  __esModule: true,
  default: () => <div data-testid="login-modal" />,
}));
jest.mock("@/components/common/Nav", () => ({ __esModule: true, default: () => <nav /> }));
jest.mock("@/components/common/Footer", () => ({ __esModule: true, default: () => <footer /> }));
jest.mock("@/components/common/Ai/AIBotton", () => ({ __esModule: true, default: () => null }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function setup() {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      profileDrawer: profileDrawerReducer,
      appConfig: appConfigReducer,
      loginModal: loginModalReducer,
    },
  });
  render(
    <Provider store={store}>
      <MainLayoutClient>
        <p>page content</p>
      </MainLayoutClient>
    </Provider>,
  );
  return store;
}

describe("on-demand overlays in the shell", () => {
  it("renders the page without loading any overlay", () => {
    setup();
    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.queryByTestId("ai")).toBeNull();
    expect(screen.queryByTestId("profile-drawer")).toBeNull();
    expect(screen.queryByTestId("login-modal")).toBeNull();
  });

  it("opens Kart AI from the same action the app dispatches, and keeps it mounted when closed", async () => {
    const store = setup();
    act(() => void store.dispatch(setAiOpen(true)));
    expect(await screen.findByTestId("ai")).toHaveAttribute("data-open", "true");

    act(() => void store.dispatch(setAiOpen(false)));
    expect(screen.getByTestId("ai")).toHaveAttribute("data-open", "false"); // still there to animate out
  });

  it("opens the profile drawer when a profile is opened, and keeps it after closing", async () => {
    const store = setup();
    act(() => void store.dispatch(openDrawer({ userId: "u1" })));
    expect(await screen.findByTestId("profile-drawer")).toBeInTheDocument();
    act(() => void store.dispatch(closeDrawer()));
    expect(screen.getByTestId("profile-drawer")).toBeInTheDocument();
  });

  it("shows the login modal when a request needs a login (401), and keeps it after closing", async () => {
    const store = setup();
    act(() => void store.dispatch(openLoginModal()));
    expect(await screen.findByTestId("login-modal")).toBeInTheDocument();
    act(() => void store.dispatch(closeLoginModal()));
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
  });

  it("opens only the overlay that was asked for", async () => {
    const store = setup();
    act(() => void store.dispatch(setAiOpen(true)));
    await screen.findByTestId("ai");
    expect(screen.queryByTestId("profile-drawer")).toBeNull();
    expect(screen.queryByTestId("login-modal")).toBeNull();
  });
});
